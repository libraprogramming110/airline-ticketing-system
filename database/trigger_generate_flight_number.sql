-- Trigger function to automatically generate flight numbers when a flight is created
-- Format: OM-{ORIGIN}{DESTINATION}-{SEQUENTIAL_NUMBER}
-- Example: OM-CGYMNL-0001

CREATE OR REPLACE FUNCTION generate_flight_number()
RETURNS TRIGGER AS $$
DECLARE
  route_prefix VARCHAR(10);
  next_number INTEGER;
  generated_flight_number VARCHAR(20);
BEGIN
  -- Generate route prefix: OM-{ORIGIN}{DESTINATION}
  route_prefix := 'OM-' || NEW.origin || NEW.destination || '-';
  
  -- Find the highest sequential number for this route
  SELECT COALESCE(
    MAX(CAST(SUBSTRING(flight_number FROM LENGTH(route_prefix) + 1) AS INTEGER)),
    0
  ) + 1
  INTO next_number
  FROM flights
  WHERE flight_number LIKE route_prefix || '%';
  
  -- Generate flight number: OM-{ORIGIN}{DESTINATION}-{PADDED_NUMBER}
  generated_flight_number := route_prefix || LPAD(next_number::TEXT, 4, '0');
  
  -- Set the flight number
  NEW.flight_number := generated_flight_number;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger that runs BEFORE a flight is inserted
DROP TRIGGER IF EXISTS trigger_generate_flight_number ON flights;
CREATE TRIGGER trigger_generate_flight_number
  BEFORE INSERT ON flights
  FOR EACH ROW
  WHEN (NEW.flight_number IS NULL)
  EXECUTE FUNCTION generate_flight_number();

-- Note: This trigger will automatically generate flight numbers for NEW flights
-- The migration script will handle existing flights

