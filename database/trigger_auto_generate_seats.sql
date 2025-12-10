-- Trigger function to automatically generate seats when a flight is created
-- This eliminates the need to manually run seed_seats.sql after inserting flights

CREATE OR REPLACE FUNCTION generate_seats_for_flight()
RETURNS TRIGGER AS $$
DECLARE
  row_num INTEGER;
  seat_letter VARCHAR(1);
  seat_letters TEXT[];
  current_seat_number VARCHAR(10);
BEGIN
  -- First Class: rows 1-5, 2 seats per row (A, B) = 10 seats
  seat_letters := ARRAY['A', 'B'];
  FOR row_num IN 1..5 LOOP
    FOREACH seat_letter IN ARRAY seat_letters LOOP
      current_seat_number := row_num::VARCHAR || seat_letter;
      INSERT INTO seats (flight_id, seat_number, cabin_class, status)
      VALUES (NEW.id, current_seat_number, 'First Class', 'available')
      ON CONFLICT (flight_id, seat_number) DO NOTHING;
    END LOOP;
  END LOOP;
  
  -- Business Class: rows 6-15, 4 seats per row (A, B, C, D) = 40 seats
  seat_letters := ARRAY['A', 'B', 'C', 'D'];
  FOR row_num IN 6..15 LOOP
    FOREACH seat_letter IN ARRAY seat_letters LOOP
      current_seat_number := row_num::VARCHAR || seat_letter;
      INSERT INTO seats (flight_id, seat_number, cabin_class, status)
      VALUES (NEW.id, current_seat_number, 'Business Class', 'available')
      ON CONFLICT (flight_id, seat_number) DO NOTHING;
    END LOOP;
  END LOOP;
  
  -- Economy: rows 16-40, 6 seats per row (A, B, C, D, E, F) = 150 seats
  seat_letters := ARRAY['A', 'B', 'C', 'D', 'E', 'F'];
  FOR row_num IN 16..40 LOOP
    FOREACH seat_letter IN ARRAY seat_letters LOOP
      current_seat_number := row_num::VARCHAR || seat_letter;
      INSERT INTO seats (flight_id, seat_number, cabin_class, status)
      VALUES (NEW.id, current_seat_number, 'Economy', 'available')
      ON CONFLICT (flight_id, seat_number) DO NOTHING;
    END LOOP;
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger that runs AFTER a flight is inserted
DROP TRIGGER IF EXISTS trigger_generate_seats ON flights;
CREATE TRIGGER trigger_generate_seats
  AFTER INSERT ON flights
  FOR EACH ROW
  EXECUTE FUNCTION generate_seats_for_flight();

-- Note: This trigger will automatically create seats for any NEW flights inserted
-- For existing flights without seats, you can still run seed_seats.sql once

