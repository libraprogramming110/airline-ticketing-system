    -- USER Table ("User" is reserved, so quoted)
    CREATE TABLE "User" (
        userID SERIAL PRIMARY KEY,
        fullname VARCHAR(255) NOT NULL,
        gmail VARCHAR(255) UNIQUE NOT NULL,
        role VARCHAR(50) NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
    );

    -- FLIGHT Table
    CREATE TABLE Flight (
        flightID SERIAL PRIMARY KEY,
        airline_name VARCHAR(255) NOT NULL,
        origin VARCHAR(100) NOT NULL,
        destination VARCHAR(100) NOT NULL,
        departure_time TIMESTAMPTZ NOT NULL,
        flight_duration INTERVAL NOT NULL,
        arrival_time TIMESTAMPTZ NOT NULL
    );

    -- SEATS Table
    CREATE TABLE Seats (
        seatID SERIAL PRIMARY KEY,
        flightID INT NOT NULL REFERENCES Flight(flightID) ON DELETE CASCADE,
        bookingID INT,
        seat_number VARCHAR(10) NOT NULL,
        seat_status VARCHAR(50) NOT NULL CHECK(seat_status IN ('available', 'reserved', 'booked')),
        seat_price NUMERIC(10, 2) NOT NULL,
        UNIQUE (flightID, seat_number)
    );

    -- BOOKING Table
    CREATE TABLE Booking (
        bookingID SERIAL PRIMARY KEY,
        userID INT NOT NULL REFERENCES "User"(userID) ON DELETE CASCADE,
        flightID INT NOT NULL REFERENCES Flight(flightID) ON DELETE CASCADE,
        seatID INT NOT NULL REFERENCES Seats(seatID) ON DELETE RESTRICT,
        pnr_code VARCHAR(50) UNIQUE NOT NULL,
        status VARCHAR(50) NOT NULL CHECK(status IN ('pending', 'confirmed', 'cancelled', 'completed')),
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
        UNIQUE (seatID) -- Prevent double booking of seat
    );

    -- Add foreign key bookingID to Seats after Booking is created (avoid circular FK)
    ALTER TABLE Seats
    ADD CONSTRAINT fk_booking_seats FOREIGN KEY (bookingID) REFERENCES Booking(bookingID) ON DELETE SET NULL;

    -- PAYMENT Table  
    CREATE TABLE Payment (
        paymentID SERIAL PRIMARY KEY,
        bookingID INT NOT NULL REFERENCES Booking(bookingID) ON DELETE CASCADE,
        base_fare NUMERIC(10, 2) NOT NULL,
        taxes NUMERIC(10, 2) NOT NULL,
        total_amount NUMERIC(10, 2) NOT NULL,
        status VARCHAR(50) NOT NULL CHECK(status IN ('pending', 'paid', 'failed', 'refunded')),
        transaction_ref VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
    );

    -- ==============================
    -- TRIGGERS FOR AUTOMATIC SEAT STATUS MANAGEMENT
    -- ==============================

    CREATE OR REPLACE FUNCTION update_seat_status_after_booking()
    RETURNS TRIGGER AS $$
    BEGIN
        IF (NEW.status != 'cancelled') THEN
            UPDATE Seats
            SET seat_status = 'booked'
            WHERE seatID = NEW.seatID;
        END IF;

        IF (TG_OP = 'UPDATE') THEN
            IF (OLD.seatID IS NOT NULL AND (OLD.seatID != NEW.seatID OR NEW.status = 'cancelled')) THEN
                UPDATE Seats
                SET seat_status = 'available'
                WHERE seatID = OLD.seatID;
            END IF;
        END IF;

        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER trg_update_seat_status_after_booking
    AFTER INSERT OR UPDATE ON Booking
    FOR EACH ROW
    EXECUTE FUNCTION update_seat_status_after_booking();


    CREATE OR REPLACE FUNCTION update_seat_status_after_booking_delete()
    RETURNS TRIGGER AS $$
    BEGIN
        IF OLD.seatID IS NOT NULL THEN
            UPDATE Seats
            SET seat_status = 'available'
            WHERE seatID = OLD.seatID;
        END IF;
        RETURN OLD;
    END;
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER trg_update_seat_status_after_booking_delete
    AFTER DELETE ON Booking
    FOR EACH ROW
    EXECUTE FUNCTION update_seat_status_after_booking_delete();