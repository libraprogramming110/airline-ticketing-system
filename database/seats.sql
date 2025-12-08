-- Seats table for individual seat management
CREATE TABLE IF NOT EXISTS seats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flight_id UUID NOT NULL REFERENCES flights(id) ON DELETE CASCADE,
  seat_number VARCHAR(10) NOT NULL,
  cabin_class VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'available' 
    CHECK (status IN ('available', 'held', 'booked')),
  hold_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(flight_id, seat_number)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_seats_flight_id ON seats(flight_id);
CREATE INDEX IF NOT EXISTS idx_seats_status ON seats(status);
CREATE INDEX IF NOT EXISTS idx_seats_hold_expires ON seats(hold_expires_at) WHERE hold_expires_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_seats_flight_status ON seats(flight_id, status);