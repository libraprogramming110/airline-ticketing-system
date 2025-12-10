-- Migration: Remove redundant flight_id from booking_seats table
-- flight_id can be derived from seats.flight_id via join
-- This simplifies the schema and removes redundancy

-- Drop the index first
DROP INDEX IF EXISTS idx_booking_seats_flight_id;

-- Remove the column
ALTER TABLE booking_seats DROP COLUMN IF EXISTS flight_id;

-- Verify removal
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'booking_seats' 
ORDER BY ordinal_position;

