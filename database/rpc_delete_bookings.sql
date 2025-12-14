-- RPC Function: Delete bookings atomically with seat release
-- This function ensures atomic deletion in a single transaction
-- Prevents partial deletions and data inconsistency

CREATE OR REPLACE FUNCTION delete_bookings(p_booking_ids UUID[])
RETURNS TABLE(
  success BOOLEAN,
  error_message TEXT,
  deleted_count INTEGER
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_seat_ids UUID[];
  v_deleted_count INTEGER;
BEGIN
  -- Get all seat IDs associated with these bookings
  SELECT ARRAY_AGG(DISTINCT seat_id) INTO v_seat_ids
  FROM booking_seats
  WHERE booking_id = ANY(p_booking_ids);

  -- Release seats (set to available)
  IF v_seat_ids IS NOT NULL AND array_length(v_seat_ids, 1) > 0 THEN
    UPDATE seats
    SET status = 'available', 
        hold_expires_at = NULL,
        updated_at = NOW()
    WHERE id = ANY(v_seat_ids);
  END IF;

  -- Delete bookings (CASCADE will handle booking_seats and booking_passengers)
  WITH deleted AS (
    DELETE FROM bookings
    WHERE id = ANY(p_booking_ids)
    RETURNING id
  )
  SELECT COUNT(*) INTO v_deleted_count FROM deleted;

  RETURN QUERY SELECT TRUE, NULL::TEXT, v_deleted_count;
EXCEPTION
  WHEN OTHERS THEN
    RETURN QUERY SELECT FALSE, SQLERRM, 0;
END;
$$;

