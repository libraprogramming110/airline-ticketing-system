-- RPC Function: Process payment and confirm booking
-- This function updates booking status to confirmed and seats to booked
-- Uses transaction to ensure atomicity

CREATE OR REPLACE FUNCTION process_payment(
  p_booking_id UUID,
  p_payment_method VARCHAR(50)
)
RETURNS TABLE(
  success BOOLEAN,
  error_message TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_booking_record RECORD;
  v_seat_count INTEGER;
BEGIN
  -- Transaction is implicit in PostgreSQL functions
  BEGIN
    -- Validate booking exists and is in pending status
    SELECT * INTO v_booking_record
    FROM bookings
    WHERE id = p_booking_id
    FOR UPDATE;
    
    IF NOT FOUND THEN
      RETURN QUERY SELECT FALSE, 'Booking not found';
      RETURN;
    END IF;
    
    IF v_booking_record.status != 'pending' THEN
      RETURN QUERY SELECT FALSE, 
        format('Booking is already %s', v_booking_record.status);
      RETURN;
    END IF;
    
    IF v_booking_record.payment_status = 'paid' THEN
      RETURN QUERY SELECT FALSE, 'Payment already processed';
      RETURN;
    END IF;
    
    -- Update booking to confirmed and paid
    UPDATE bookings
    SET payment_status = 'paid',
        status = 'confirmed',
        payment_method = p_payment_method,
        updated_at = NOW()
    WHERE id = p_booking_id;
    
    -- Update all seats linked to this booking to booked status
    UPDATE seats
    SET status = 'booked',
        hold_expires_at = NULL,
        updated_at = NOW()
    WHERE id IN (
      SELECT seat_id
      FROM booking_seats
      WHERE booking_id = p_booking_id
    );
    
    -- Get count of updated seats for verification
    GET DIAGNOSTICS v_seat_count = ROW_COUNT;
    
    -- Return success
    RETURN QUERY SELECT TRUE, NULL::TEXT;
    
  EXCEPTION
    WHEN OTHERS THEN
      -- Automatic rollback on any error
      RETURN QUERY SELECT FALSE, SQLERRM;
  END;
END;
$$;

-- Grant execute permission to authenticated and anon users
GRANT EXECUTE ON FUNCTION process_payment TO anon, authenticated;

