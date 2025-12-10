-- Junction table linking bookings to seats (many-to-many)
-- Allows multiple seats per booking (for round trips) and optional seat selection
-- Note: flight_id is derived from seats.flight_id via join (no redundancy)
CREATE TABLE IF NOT EXISTS booking_seats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  seat_id UUID NOT NULL REFERENCES seats(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(booking_id, seat_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_booking_seats_booking_id ON booking_seats(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_seats_seat_id ON booking_seats(seat_id);
