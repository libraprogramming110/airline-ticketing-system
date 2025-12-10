-- RPC Function: Auto-assign random seats to pending bookings when flight is fully booked
-- This function assigns available seats to bookings with seat_assignment_status = 'pending'
-- Should be called when a flight reaches full capacity

CREATE OR REPLACE FUNCTION assign_pending_seats(
  p_flight_id UUID
)
RETURNS TABLE(
  booking_id UUID,
  seats_assigned INTEGER,
  success BOOLEAN,
  error_message TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_booking_record RECORD;
  v_seat_record RECORD;
  v_seats_assigned INTEGER;
  v_passenger_count INTEGER;
  v_seats_needed INTEGER;
  v_now TIMESTAMP WITH TIME ZONE;
BEGIN
  v_now := NOW();
  
  -- Loop through all pending bookings for this flight
  FOR v_booking_record IN
    SELECT 
      b.id,
      b.adults_count,
      b.children_count,
      b.departing_flight_id,
      b.returning_flight_id
    FROM bookings b
    WHERE b.seat_assignment_status = 'pending'
      AND (b.departing_flight_id = p_flight_id OR b.returning_flight_id = p_flight_id)
      AND b.status = 'confirmed'
    ORDER BY b.created_at ASC
  LOOP
    v_seats_assigned := 0;
    v_passenger_count := v_booking_record.adults_count + v_booking_record.children_count;
    v_seats_needed := v_passenger_count;
    
    -- Check if this booking already has seats for this flight
    SELECT COUNT(*) INTO v_seats_assigned
    FROM booking_seats bs
    JOIN seats s ON bs.seat_id = s.id
    WHERE bs.booking_id = v_booking_record.id
      AND s.flight_id = p_flight_id;
    
    -- Only assign if seats are still needed
    IF v_seats_assigned < v_seats_needed THEN
      -- Get available seats for this flight (random order)
      FOR v_seat_record IN
        SELECT s.id, s.seat_number
        FROM seats s
        WHERE s.flight_id = p_flight_id
          AND s.status = 'available'
          AND s.id NOT IN (
            SELECT bs.seat_id 
            FROM booking_seats bs 
            WHERE bs.booking_id = v_booking_record.id
          )
        ORDER BY RANDOM()
        LIMIT (v_seats_needed - v_seats_assigned)
      LOOP
        -- Lock the seat
        UPDATE seats
        SET status = 'booked',
            updated_at = v_now
        WHERE id = v_seat_record.id;
        
        -- Link seat to booking
        INSERT INTO booking_seats (booking_id, seat_id)
        VALUES (v_booking_record.id, v_seat_record.id)
        ON CONFLICT DO NOTHING;
        
        v_seats_assigned := v_seats_assigned + 1;
      END LOOP;
      
      -- Update booking status if all seats assigned
      IF v_seats_assigned >= v_seats_needed THEN
        UPDATE bookings
        SET seat_assignment_status = 'assigned',
            updated_at = v_now
        WHERE id = v_booking_record.id;
      END IF;
      
      RETURN QUERY SELECT 
        v_booking_record.id, 
        v_seats_assigned, 
        TRUE, 
        NULL::TEXT;
    END IF;
  END LOOP;
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN QUERY SELECT 
      NULL::UUID, 
      0, 
      FALSE, 
      SQLERRM;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION assign_pending_seats TO authenticated;

