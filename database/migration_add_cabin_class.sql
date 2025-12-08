-- Migration: Add cabin_class column to flights table
ALTER TABLE flights 
ADD COLUMN IF NOT EXISTS cabin_class VARCHAR(20) NOT NULL DEFAULT 'Economy';

-- Update existing flights to have Economy as default
UPDATE flights 
SET cabin_class = 'Economy' 
WHERE cabin_class IS NULL OR cabin_class = '';

-- Create index for faster cabin class filtering
CREATE INDEX IF NOT EXISTS idx_flights_cabin ON flights(cabin_class);

