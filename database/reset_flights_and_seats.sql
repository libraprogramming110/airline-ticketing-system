-- Reset script: Delete all flights and seats
-- WARNING: This will delete ALL flights, seats, and related bookings
-- Use this to start fresh with a clean database

-- Step 1: Delete all bookings first (required due to foreign key constraints)
-- This will automatically cascade delete:
--   - booking_seats (via CASCADE)
--   - booking_passengers (via CASCADE)
DELETE FROM bookings;

-- Step 2: Delete all flights
-- This will automatically cascade delete:
--   - seats (via CASCADE)
DELETE FROM flights;

-- Step 3: Verify deletion
SELECT 
  (SELECT COUNT(*) FROM flights) as remaining_flights,
  (SELECT COUNT(*) FROM seats) as remaining_seats,
  (SELECT COUNT(*) FROM bookings) as remaining_bookings;

-- Expected output:
-- remaining_flights = 0
-- remaining_seats = 0
-- remaining_bookings = 0

-- If all counts are 0, you can now insert a new flight
-- The trigger will automatically create seats for the new flight

