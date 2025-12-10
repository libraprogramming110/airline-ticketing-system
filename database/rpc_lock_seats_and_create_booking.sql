-- RPC Function: Lock seats and create booking in a single transaction
-- This function ensures atomic seat locking with SELECT FOR UPDATE
-- Prevents race conditions and double-booking

-- Drop existing function if it exists (with old signature)
DROP FUNCTION IF EXISTS lock_seats_and_create_booking(UUID[], UUID, INTEGER, INTEGER, DECIMAL, UUID);

CREATE OR REPLACE FUNCTION lock_seats_and_create_booking(
  p_seat_ids UUID[],
  p_departing_flight_id UUID,
  p_adults_count INTEGER,
  p_children_count INTEGER,
  p_total_amount DECIMAL(10, 2),
  p_returning_flight_id UUID DEFAULT NULL,
  p_passenger_ids UUID[] DEFAULT NULL
)
RETURNS TABLE(
  booking_id UUID,
  booking_reference VARCHAR,
  success BOOLEAN,
  error_message TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_seat_id UUID;
  v_seat_record RECORD;
  v_booking_id UUID;
  v_booking_reference VARCHAR;
  v_next_number INTEGER;
  v_now TIMESTAMP WITH TIME ZONE;
  v_expires_at TIMESTAMP WITH TIME ZONE;
  v_seat_assignment_status VARCHAR(20);
BEGIN
  v_now := NOW();
  v_expires_at := v_now + INTERVAL '3 minutes';
  
  -- Transaction is implicit in PostgreSQL functions
  BEGIN
    -- Lock and validate each seat (only if seats are provided)
    IF array_length(p_seat_ids, 1) > 0 THEN
      FOREACH v_seat_id IN ARRAY p_seat_ids
      LOOP
        -- SELECT FOR UPDATE locks the row for this transaction
        SELECT * INTO v_seat_record
        FROM seats
        WHERE id = v_seat_id
        FOR UPDATE;
        
        -- Check if seat exists
        IF NOT FOUND THEN
          RETURN QUERY SELECT NULL::UUID, NULL::VARCHAR, FALSE, 
            format('Seat %s not found', v_seat_id);
          RETURN;
        END IF;
        
        -- Check if seat is already booked
        IF v_seat_record.status = 'booked' THEN
          RETURN QUERY SELECT NULL::UUID, NULL::VARCHAR, FALSE,
            format('Seat %s is already booked', v_seat_record.seat_number);
          RETURN;
        END IF;
        
        -- Check if seat is actively held (not expired)
        IF v_seat_record.status = 'held' AND 
           v_seat_record.hold_expires_at IS NOT NULL AND
           v_seat_record.hold_expires_at > v_now THEN
          RETURN QUERY SELECT NULL::UUID, NULL::VARCHAR, FALSE,
            format('Seat %s is currently reserved', v_seat_record.seat_number);
          RETURN;
        END IF;
        
        -- Update seat to held status
        UPDATE seats
        SET status = 'held',
            hold_expires_at = v_expires_at,
            updated_at = v_now
        WHERE id = v_seat_id;
      END LOOP;
    END IF;
    
    -- Generate sequential booking reference
    SELECT COALESCE(MAX(CAST(SUBSTRING(b.booking_reference FROM 4) AS INTEGER)), 0) + 1
    INTO v_next_number
    FROM bookings b;
    
    v_booking_reference := 'PNR' || LPAD(v_next_number::TEXT, 6, '0');
    
    -- Determine seat assignment status
    IF array_length(p_seat_ids, 1) > 0 THEN
      v_seat_assignment_status := 'selected';
    ELSE
      v_seat_assignment_status := 'pending';
    END IF;
    
    -- Create booking record
    INSERT INTO bookings (
      booking_reference,
      user_id,
      status,
      payment_status,
      departing_flight_id,
      returning_flight_id,
      total_amount,
      adults_count,
      children_count,
      seat_assignment_status
    ) VALUES (
      v_booking_reference,
      NULL,
      'pending',
      'pending',
      p_departing_flight_id,
      p_returning_flight_id,
      p_total_amount,
      p_adults_count,
      p_children_count,
      v_seat_assignment_status
    )
    RETURNING id INTO v_booking_id;
    
    -- Link seats to booking (only if seats were provided)
    IF array_length(p_seat_ids, 1) > 0 THEN
      INSERT INTO booking_seats (booking_id, seat_id)
      SELECT 
        v_booking_id,
        s.id
      FROM seats s
      WHERE s.id = ANY(p_seat_ids);
    END IF;
    
    -- Link passengers to booking (if provided)
    IF array_length(p_passenger_ids, 1) > 0 THEN
      INSERT INTO booking_passengers (booking_id, passenger_id)
      SELECT 
        v_booking_id,
        p.id
      FROM passengers p
      WHERE p.id = ANY(p_passenger_ids);
    END IF;
    
    -- Return success with booking details
    RETURN QUERY SELECT v_booking_id, v_booking_reference, TRUE, NULL::TEXT;
    
  EXCEPTION
    WHEN OTHERS THEN
      -- Automatic rollback on any error
      RETURN QUERY SELECT NULL::UUID, NULL::VARCHAR, FALSE, 
        SQLERRM;
  END;
END;
$$;

-- Grant execute permission to authenticated and anon users
GRANT EXECUTE ON FUNCTION lock_seats_and_create_booking TO anon, authenticated;

