-- Migration: Remove redundant columns from flights table
-- These columns are no longer used:
--   - available_seats: Now calculated from seats table
--   - cabin_class: Flights have multiple cabin classes (stored per seat)

-- Remove available_seats column
ALTER TABLE flights DROP COLUMN IF EXISTS available_seats;

-- Remove cabin_class column
ALTER TABLE flights DROP COLUMN IF EXISTS cabin_class;

-- Verify removal
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'flights' 
ORDER BY ordinal_position;

