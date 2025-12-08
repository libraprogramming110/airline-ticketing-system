-- Junction table linking bookings to passengers (many-to-many)
-- Allows multiple passengers per booking and multiple bookings per passenger
CREATE TABLE IF NOT EXISTS booking_passengers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  passenger_id UUID NOT NULL REFERENCES passengers(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(booking_id, passenger_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_booking_passengers_booking_id ON booking_passengers(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_passengers_passenger_id ON booking_passengers(passenger_id);
