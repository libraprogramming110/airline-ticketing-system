-- Migration: Add flight_number column to flights table
-- Flight numbers will be generated automatically using format: OM-{ORIGIN}{DESTINATION}-{SEQUENTIAL}

-- Add flight_number column
ALTER TABLE flights
ADD COLUMN IF NOT EXISTS flight_number VARCHAR(20) UNIQUE;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_flights_flight_number ON flights(flight_number);

-- Generate flight numbers for existing flights
-- Format: OM-{ORIGIN}{DESTINATION}-{SEQUENTIAL_NUMBER}
DO $$
DECLARE
  flight_record RECORD;
  flight_counter INTEGER := 1;
  base_number VARCHAR(20);
BEGIN
  -- Loop through all flights ordered by creation date
  FOR flight_record IN 
    SELECT id, origin, destination, created_at
    FROM flights
    ORDER BY created_at ASC
  LOOP
    -- Generate base number: OM-{ORIGIN}{DESTINATION}-{COUNTER}
    base_number := 'OM-' || flight_record.origin || flight_record.destination || '-' || LPAD(flight_counter::TEXT, 4, '0');
    
    -- Update the flight with generated flight number
    UPDATE flights
    SET flight_number = base_number
    WHERE id = flight_record.id;
    
    flight_counter := flight_counter + 1;
  END LOOP;
END $$;

-- Set NOT NULL constraint after populating existing data
ALTER TABLE flights
ALTER COLUMN flight_number SET NOT NULL;

-- Verify the column has been added and populated
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'flights' AND column_name = 'flight_number';

-- Show sample of generated flight numbers
SELECT flight_number, origin, destination, departure_date
FROM flights
ORDER BY created_at ASC
LIMIT 10;

