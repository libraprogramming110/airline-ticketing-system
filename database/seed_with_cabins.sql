-- Sample flights data with cabin classes
-- Each flight has 3 rows: Economy, Business Class, First Class

-- Manila to Cagayan de Oro (December 1)
INSERT INTO flights (origin, destination, departure_date, departure_time, arrival_time, price, available_seats, cabin_class) VALUES
('MNL', 'CGY', '2025-12-01', '06:00:00', '07:30:00', 1687.72, 150, 'Economy'),
('MNL', 'CGY', '2025-12-01', '06:00:00', '07:30:00', 5000.00, 20, 'Business Class'),
('MNL', 'CGY', '2025-12-01', '06:00:00', '07:30:00', 10000.00, 10, 'First Class'),
('MNL', 'CGY', '2025-12-01', '14:00:00', '15:30:00', 1850.00, 150, 'Economy'),
('MNL', 'CGY', '2025-12-01', '14:00:00', '15:30:00', 5200.00, 20, 'Business Class'),
('MNL', 'CGY', '2025-12-01', '14:00:00', '15:30:00', 10500.00, 10, 'First Class');

-- Manila to Cagayan de Oro (December 2)
INSERT INTO flights (origin, destination, departure_date, departure_time, arrival_time, price, available_seats, cabin_class) VALUES
('MNL', 'CGY', '2025-12-02', '06:00:00', '07:30:00', 1687.72, 150, 'Economy'),
('MNL', 'CGY', '2025-12-02', '06:00:00', '07:30:00', 5000.00, 20, 'Business Class'),
('MNL', 'CGY', '2025-12-02', '06:00:00', '07:30:00', 10000.00, 10, 'First Class'),
('MNL', 'CGY', '2025-12-02', '14:00:00', '15:30:00', 1850.00, 150, 'Economy'),
('MNL', 'CGY', '2025-12-02', '14:00:00', '15:30:00', 5200.00, 20, 'Business Class'),
('MNL', 'CGY', '2025-12-02', '14:00:00', '15:30:00', 10500.00, 10, 'First Class');

-- Cagayan de Oro to Manila (December 5)
INSERT INTO flights (origin, destination, departure_date, departure_time, arrival_time, price, available_seats, cabin_class) VALUES
('CGY', 'MNL', '2025-12-05', '06:00:00', '07:30:00', 1687.72, 150, 'Economy'),
('CGY', 'MNL', '2025-12-05', '06:00:00', '07:30:00', 5000.00, 20, 'Business Class'),
('CGY', 'MNL', '2025-12-05', '06:00:00', '07:30:00', 10000.00, 10, 'First Class'),
('CGY', 'MNL', '2025-12-05', '14:00:00', '15:30:00', 1850.00, 150, 'Economy'),
('CGY', 'MNL', '2025-12-05', '14:00:00', '15:30:00', 5200.00, 20, 'Business Class'),
('CGY', 'MNL', '2025-12-05', '14:00:00', '15:30:00', 10500.00, 10, 'First Class');

-- Cagayan de Oro to Manila (December 6)
INSERT INTO flights (origin, destination, departure_date, departure_time, arrival_time, price, available_seats, cabin_class) VALUES
('CGY', 'MNL', '2025-12-06', '06:00:00', '07:30:00', 1687.72, 150, 'Economy'),
('CGY', 'MNL', '2025-12-06', '06:00:00', '07:30:00', 5000.00, 20, 'Business Class'),
('CGY', 'MNL', '2025-12-06', '06:00:00', '07:30:00', 10000.00, 10, 'First Class'),
('CGY', 'MNL', '2025-12-06', '14:00:00', '15:30:00', 1850.00, 150, 'Economy'),
('CGY', 'MNL', '2025-12-06', '14:00:00', '15:30:00', 5200.00, 20, 'Business Class'),
('CGY', 'MNL', '2025-12-06', '14:00:00', '15:30:00', 10500.00, 10, 'First Class');

-- Manila to Cebu (December 1)
INSERT INTO flights (origin, destination, departure_date, departure_time, arrival_time, price, available_seats, cabin_class) VALUES
('MNL', 'CEB', '2025-12-01', '08:00:00', '09:30:00', 2500.00, 150, 'Economy'),
('MNL', 'CEB', '2025-12-01', '08:00:00', '09:30:00', 6000.00, 20, 'Business Class'),
('MNL', 'CEB', '2025-12-01', '08:00:00', '09:30:00', 12000.00, 10, 'First Class'),
('MNL', 'CEB', '2025-12-01', '16:00:00', '17:30:00', 2750.00, 150, 'Economy'),
('MNL', 'CEB', '2025-12-01', '16:00:00', '17:30:00', 6200.00, 20, 'Business Class'),
('MNL', 'CEB', '2025-12-01', '16:00:00', '17:30:00', 12500.00, 10, 'First Class');

-- Cebu to Manila (December 5)
INSERT INTO flights (origin, destination, departure_date, departure_time, arrival_time, price, available_seats, cabin_class) VALUES
('CEB', 'MNL', '2025-12-05', '08:00:00', '09:30:00', 2500.00, 150, 'Economy'),
('CEB', 'MNL', '2025-12-05', '08:00:00', '09:30:00', 6000.00, 20, 'Business Class'),
('CEB', 'MNL', '2025-12-05', '08:00:00', '09:30:00', 12000.00, 10, 'First Class'),
('CEB', 'MNL', '2025-12-05', '16:00:00', '17:30:00', 2750.00, 150, 'Economy'),
('CEB', 'MNL', '2025-12-05', '16:00:00', '17:30:00', 6200.00, 20, 'Business Class'),
('CEB', 'MNL', '2025-12-05', '16:00:00', '17:30:00', 12500.00, 10, 'First Class');

-- Manila to Davao (December 1)
INSERT INTO flights (origin, destination, departure_date, departure_time, arrival_time, price, available_seats, cabin_class) VALUES
('MNL', 'DVO', '2025-12-01', '10:00:00', '12:00:00', 3200.00, 150, 'Economy'),
('MNL', 'DVO', '2025-12-01', '10:00:00', '12:00:00', 7000.00, 20, 'Business Class'),
('MNL', 'DVO', '2025-12-01', '10:00:00', '12:00:00', 14000.00, 10, 'First Class');

-- Davao to Manila (December 5)
INSERT INTO flights (origin, destination, departure_date, departure_time, arrival_time, price, available_seats, cabin_class) VALUES
('DVO', 'MNL', '2025-12-05', '10:00:00', '12:00:00', 3200.00, 150, 'Economy'),
('DVO', 'MNL', '2025-12-05', '10:00:00', '12:00:00', 7000.00, 20, 'Business Class'),
('DVO', 'MNL', '2025-12-05', '10:00:00', '12:00:00', 14000.00, 10, 'First Class');

-- Manila to Cagayan de Oro (December 9)
INSERT INTO flights (origin, destination, departure_date, departure_time, arrival_time, price, available_seats, cabin_class) VALUES
('MNL', 'CGY', '2025-12-09', '06:00:00', '07:30:00', 1687.72, 150, 'Economy'),
('MNL', 'CGY', '2025-12-09', '06:00:00', '07:30:00', 5000.00, 20, 'Business Class'),
('MNL', 'CGY', '2025-12-09', '06:00:00', '07:30:00', 10000.00, 10, 'First Class'),
('MNL', 'CGY', '2025-12-09', '14:00:00', '15:30:00', 1850.00, 150, 'Economy'),
('MNL', 'CGY', '2025-12-09', '14:00:00', '15:30:00', 5200.00, 20, 'Business Class'),
('MNL', 'CGY', '2025-12-09', '14:00:00', '15:30:00', 10500.00, 10, 'First Class');

-- Manila to Cagayan de Oro (December 12)
INSERT INTO flights (origin, destination, departure_date, departure_time, arrival_time, price, available_seats, cabin_class) VALUES
('MNL', 'CGY', '2025-12-12', '06:00:00', '07:30:00', 1687.72, 150, 'Economy'),
('MNL', 'CGY', '2025-12-12', '06:00:00', '07:30:00', 5000.00, 20, 'Business Class'),
('MNL', 'CGY', '2025-12-12', '06:00:00', '07:30:00', 10000.00, 10, 'First Class'),
('MNL', 'CGY', '2025-12-12', '14:00:00', '15:30:00', 1850.00, 150, 'Economy'),
('MNL', 'CGY', '2025-12-12', '14:00:00', '15:30:00', 5200.00, 20, 'Business Class'),
('MNL', 'CGY', '2025-12-12', '14:00:00', '15:30:00', 10500.00, 10, 'First Class');

-- Manila to Cagayan de Oro (December 15)
INSERT INTO flights (origin, destination, departure_date, departure_time, arrival_time, price, available_seats, cabin_class) VALUES
('MNL', 'CGY', '2025-12-15', '06:00:00', '07:30:00', 1687.72, 150, 'Economy'),
('MNL', 'CGY', '2025-12-15', '06:00:00', '07:30:00', 5000.00, 20, 'Business Class'),
('MNL', 'CGY', '2025-12-15', '06:00:00', '07:30:00', 10000.00, 10, 'First Class'),
('MNL', 'CGY', '2025-12-15', '14:00:00', '15:30:00', 1850.00, 150, 'Economy'),
('MNL', 'CGY', '2025-12-15', '14:00:00', '15:30:00', 5200.00, 20, 'Business Class'),
('MNL', 'CGY', '2025-12-15', '14:00:00', '15:30:00', 10500.00, 10, 'First Class');

