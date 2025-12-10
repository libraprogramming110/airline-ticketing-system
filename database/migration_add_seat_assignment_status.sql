-- Migration: Add seat_assignment_status to bookings table
-- This tracks whether seats were selected, pending, or auto-assigned

ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS seat_assignment_status VARCHAR(20) NOT NULL DEFAULT 'selected'
  CHECK (seat_assignment_status IN ('selected', 'pending', 'assigned'));

-- Index for querying pending assignments
CREATE INDEX IF NOT EXISTS idx_bookings_seat_assignment_status 
ON bookings(seat_assignment_status) 
WHERE seat_assignment_status = 'pending';

-- Update existing bookings to 'selected' (they all have seats)
UPDATE bookings 
SET seat_assignment_status = 'selected' 
WHERE seat_assignment_status IS NULL;

