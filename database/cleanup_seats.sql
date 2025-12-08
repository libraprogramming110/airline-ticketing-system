-- Cleanup script: Delete all existing seats
-- Run this BEFORE running seed_seats.sql to ensure clean seat generation
-- WARNING: This will delete ALL seats for ALL flights
-- Only run this if you want to regenerate all seats from scratch

-- Delete all seats
DELETE FROM seats;

-- Verify deletion
SELECT 
  COUNT(*) as remaining_seats
FROM seats;

-- Expected output: remaining_seats = 0
-- If you see 0, you can proceed to run seed_seats.sql

