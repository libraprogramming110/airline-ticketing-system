-- Generate seats for all existing flights
-- Each flight gets seats for ALL three cabin classes:
-- First Class: rows 1-5, 2 seats per row (A, B) = 10 seats
-- Business Class: rows 6-15, 4 seats per row (A, B, C, D) = 40 seats  
-- Economy: rows 16-40, 6 seats per row (A, B, C, D, E, F) = 150 seats

DO $$
DECLARE
  flight_record RECORD;
  row_num INTEGER;
  seat_letter VARCHAR(1);
  seat_letters TEXT[];
  current_seat_number VARCHAR(10);
BEGIN
  -- Loop through all flights
  FOR flight_record IN 
    SELECT id 
    FROM flights
  LOOP
    -- First Class: rows 1-5, 2 seats per row (A, B)
    seat_letters := ARRAY['A', 'B'];
    FOR row_num IN 1..5 LOOP
      FOREACH seat_letter IN ARRAY seat_letters LOOP
        current_seat_number := row_num::VARCHAR || seat_letter;
        INSERT INTO seats (flight_id, seat_number, cabin_class, status)
        VALUES (flight_record.id, current_seat_number, 'First Class', 'available')
        ON CONFLICT (flight_id, seat_number) DO NOTHING;
      END LOOP;
    END LOOP;
    
    -- Business Class: rows 6-15, 4 seats per row (A, B, C, D)
    seat_letters := ARRAY['A', 'B', 'C', 'D'];
    FOR row_num IN 6..15 LOOP
      FOREACH seat_letter IN ARRAY seat_letters LOOP
        current_seat_number := row_num::VARCHAR || seat_letter;
        INSERT INTO seats (flight_id, seat_number, cabin_class, status)
        VALUES (flight_record.id, current_seat_number, 'Business Class', 'available')
        ON CONFLICT (flight_id, seat_number) DO NOTHING;
      END LOOP;
    END LOOP;
    
    -- Economy: rows 16-40, 6 seats per row (A, B, C, D, E, F)
    seat_letters := ARRAY['A', 'B', 'C', 'D', 'E', 'F'];
    FOR row_num IN 16..40 LOOP
      FOREACH seat_letter IN ARRAY seat_letters LOOP
        current_seat_number := row_num::VARCHAR || seat_letter;
        INSERT INTO seats (flight_id, seat_number, cabin_class, status)
        VALUES (flight_record.id, current_seat_number, 'Economy', 'available')
        ON CONFLICT (flight_id, seat_number) DO NOTHING;
      END LOOP;
    END LOOP;
  END LOOP;
END $$;

-- Verify seat generation
SELECT 
  f.id as flight_id,
  f.origin || ' → ' || f.destination as route,
  s.cabin_class,
  COUNT(s.id) as total_seats,
  COUNT(CASE WHEN s.status = 'available' THEN 1 END) as available_seats,
  COUNT(CASE WHEN s.status = 'booked' THEN 1 END) as booked_seats,
  COUNT(CASE WHEN s.status = 'held' THEN 1 END) as held_seats
FROM flights f
LEFT JOIN seats s ON f.id = s.flight_id
GROUP BY f.id, f.origin, f.destination, s.cabin_class
ORDER BY f.origin, f.destination, f.departure_date, s.cabin_class;

