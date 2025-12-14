-- Migration: Add status column to flights table for soft delete
-- Allows flights to be marked as cancelled or delayed instead of deleted

-- Add column if it doesn't exist
ALTER TABLE flights 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active';

-- Drop existing constraint if it exists (to update it)
ALTER TABLE flights 
DROP CONSTRAINT IF EXISTS flights_status_check;

-- Add updated constraint with 'delayed' status
ALTER TABLE flights 
ADD CONSTRAINT flights_status_check 
  CHECK (status IN ('active', 'cancelled', 'delayed'));

-- Create index for filtering active flights
CREATE INDEX IF NOT EXISTS idx_flights_status ON flights(status);

-- Update existing flights to have 'active' status
UPDATE flights SET status = 'active' WHERE status IS NULL;

