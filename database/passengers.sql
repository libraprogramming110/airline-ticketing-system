-- Passengers table for storing passenger personal information
CREATE TABLE IF NOT EXISTS passengers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  middle_initial VARCHAR(10),
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  sex VARCHAR(10) NOT NULL CHECK (sex IN ('Male', 'Female', 'Other')),
  date_of_birth DATE NOT NULL,
  passenger_type VARCHAR(10) NOT NULL CHECK (passenger_type IN ('adult', 'child')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_passengers_email ON passengers(email);
CREATE INDEX IF NOT EXISTS idx_passengers_passenger_type ON passengers(passenger_type);
CREATE INDEX IF NOT EXISTS idx_passengers_name ON passengers(last_name, first_name);

