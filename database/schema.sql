-- Flights table for storing flight information
CREATE TABLE IF NOT EXISTS flights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  origin VARCHAR(3) NOT NULL,
  destination VARCHAR(3) NOT NULL,
  departure_date DATE NOT NULL,
  departure_time TIME NOT NULL,
  arrival_time TIME NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  flight_number VARCHAR(20) UNIQUE,
  available_seats INTEGER NOT NULL DEFAULT 180,
  cabin_class VARCHAR(20) NOT NULL DEFAULT 'Economy',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster search queries
CREATE INDEX IF NOT EXISTS idx_flights_search ON flights(origin, destination, departure_date);
CREATE INDEX IF NOT EXISTS idx_flights_date ON flights(departure_date);

