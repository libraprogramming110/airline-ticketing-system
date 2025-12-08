-- Sample flights data for testing
-- Manila to Cagayan de Oro
INSERT INTO flights (origin, destination, departure_date, departure_time, arrival_time, price, available_seats) VALUES
('MNL', 'CGY', '2025-12-01', '06:00:00', '07:30:00', 1687.72, 180),
('MNL', 'CGY', '2025-12-01', '14:00:00', '15:30:00', 1850.00, 180),
('MNL', 'CGY', '2025-12-02', '06:00:00', '07:30:00', 1687.72, 180),
('MNL', 'CGY', '2025-12-02', '14:00:00', '15:30:00', 1850.00, 180);

-- Cagayan de Oro to Manila
INSERT INTO flights (origin, destination, departure_date, departure_time, arrival_time, price, available_seats) VALUES
('CGY', 'MNL', '2025-12-05', '06:00:00', '07:30:00', 1687.72, 180),
('CGY', 'MNL', '2025-12-05', '14:00:00', '15:30:00', 1850.00, 180),
('CGY', 'MNL', '2025-12-06', '06:00:00', '07:30:00', 1687.72, 180),
('CGY', 'MNL', '2025-12-06', '14:00:00', '15:30:00', 1850.00, 180);

-- Manila to Cebu
INSERT INTO flights (origin, destination, departure_date, departure_time, arrival_time, price, available_seats) VALUES
('MNL', 'CEB', '2025-12-01', '08:00:00', '09:30:00', 2500.00, 180),
('MNL', 'CEB', '2025-12-01', '16:00:00', '17:30:00', 2750.00, 180);

-- Cebu to Manila
INSERT INTO flights (origin, destination, departure_date, departure_time, arrival_time, price, available_seats) VALUES
('CEB', 'MNL', '2025-12-05', '08:00:00', '09:30:00', 2500.00, 180),
('CEB', 'MNL', '2025-12-05', '16:00:00', '17:30:00', 2750.00, 180);

-- Manila to Davao
INSERT INTO flights (origin, destination, departure_date, departure_time, arrival_time, price, available_seats) VALUES
('MNL', 'DVO', '2025-12-01', '10:00:00', '12:00:00', 3200.00, 180);

-- Davao to Manila
INSERT INTO flights (origin, destination, departure_date, departure_time, arrival_time, price, available_seats) VALUES
('DVO', 'MNL', '2025-12-05', '10:00:00', '12:00:00', 3200.00, 180);

-- Flights beyond December 8, 2025
-- Manila to Cagayan de Oro (December 9-15)
INSERT INTO flights (origin, destination, departure_date, departure_time, arrival_time, price, available_seats) VALUES
('MNL', 'CGY', '2025-12-09', '06:00:00', '07:30:00', 1687.72, 180),
('MNL', 'CGY', '2025-12-09', '14:00:00', '15:30:00', 1850.00, 180),
('MNL', 'CGY', '2025-12-10', '06:00:00', '07:30:00', 1687.72, 180),
('MNL', 'CGY', '2025-12-10', '14:00:00', '15:30:00', 1850.00, 180),
('MNL', 'CGY', '2025-12-12', '06:00:00', '07:30:00', 1687.72, 180),
('MNL', 'CGY', '2025-12-12', '14:00:00', '15:30:00', 1850.00, 180),
('MNL', 'CGY', '2025-12-15', '06:00:00', '07:30:00', 1687.72, 180),
('MNL', 'CGY', '2025-12-15', '14:00:00', '15:30:00', 1850.00, 180);

-- Cagayan de Oro to Manila (December 9-15)
INSERT INTO flights (origin, destination, departure_date, departure_time, arrival_time, price, available_seats) VALUES
('CGY', 'MNL', '2025-12-09', '06:00:00', '07:30:00', 1687.72, 180),
('CGY', 'MNL', '2025-12-09', '14:00:00', '15:30:00', 1850.00, 180),
('CGY', 'MNL', '2025-12-10', '06:00:00', '07:30:00', 1687.72, 180),
('CGY', 'MNL', '2025-12-10', '14:00:00', '15:30:00', 1850.00, 180),
('CGY', 'MNL', '2025-12-12', '06:00:00', '07:30:00', 1687.72, 180),
('CGY', 'MNL', '2025-12-12', '14:00:00', '15:30:00', 1850.00, 180),
('CGY', 'MNL', '2025-12-15', '06:00:00', '07:30:00', 1687.72, 180),
('CGY', 'MNL', '2025-12-15', '14:00:00', '15:30:00', 1850.00, 180);

-- Manila to Cebu (December 9-15)
INSERT INTO flights (origin, destination, departure_date, departure_time, arrival_time, price, available_seats) VALUES
('MNL', 'CEB', '2025-12-09', '08:00:00', '09:30:00', 2500.00, 180),
('MNL', 'CEB', '2025-12-09', '16:00:00', '17:30:00', 2750.00, 180),
('MNL', 'CEB', '2025-12-12', '08:00:00', '09:30:00', 2500.00, 180),
('MNL', 'CEB', '2025-12-12', '16:00:00', '17:30:00', 2750.00, 180),
('MNL', 'CEB', '2025-12-15', '08:00:00', '09:30:00', 2500.00, 180);

-- Cebu to Manila (December 9-15)
INSERT INTO flights (origin, destination, departure_date, departure_time, arrival_time, price, available_seats) VALUES
('CEB', 'MNL', '2025-12-09', '08:00:00', '09:30:00', 2500.00, 180),
('CEB', 'MNL', '2025-12-09', '16:00:00', '17:30:00', 2750.00, 180),
('CEB', 'MNL', '2025-12-12', '08:00:00', '09:30:00', 2500.00, 180),
('CEB', 'MNL', '2025-12-12', '16:00:00', '17:30:00', 2750.00, 180),
('CEB', 'MNL', '2025-12-15', '08:00:00', '09:30:00', 2500.00, 180);

-- Manila to Davao (December 9-15)
INSERT INTO flights (origin, destination, departure_date, departure_time, arrival_time, price, available_seats) VALUES
('MNL', 'DVO', '2025-12-09', '10:00:00', '12:00:00', 3200.00, 180),
('MNL', 'DVO', '2025-12-12', '10:00:00', '12:00:00', 3200.00, 180),
('MNL', 'DVO', '2025-12-15', '10:00:00', '12:00:00', 3200.00, 180);

-- Davao to Manila (December 9-15)
INSERT INTO flights (origin, destination, departure_date, departure_time, arrival_time, price, available_seats) VALUES
('DVO', 'MNL', '2025-12-09', '10:00:00', '12:00:00', 3200.00, 180),
('DVO', 'MNL', '2025-12-12', '10:00:00', '12:00:00', 3200.00, 180),
('DVO', 'MNL', '2025-12-15', '10:00:00', '12:00:00', 3200.00, 180);

