-- Bookings table for storing booking transactions
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_reference VARCHAR(20) NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' 
    CHECK (status IN ('pending', 'confirmed', 'cancelled', 'expired')),
  payment_status VARCHAR(20) NOT NULL DEFAULT 'pending' 
    CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  departing_flight_id UUID NOT NULL REFERENCES flights(id) ON DELETE RESTRICT,
  returning_flight_id UUID REFERENCES flights(id) ON DELETE RESTRICT,
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50),
  adults_count INTEGER NOT NULL DEFAULT 1,
  children_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_reference ON bookings(booking_reference);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON bookings(payment_status);
CREATE INDEX IF NOT EXISTS idx_bookings_departing_flight ON bookings(departing_flight_id);
CREATE INDEX IF NOT EXISTS idx_bookings_returning_flight ON bookings(returning_flight_id);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at);

