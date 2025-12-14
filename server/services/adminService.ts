import { createClient } from '@/lib/supabase/server';

export type DashboardStats = {
  totalFlights: number;
  totalBookings: number;
  confirmedBookings: number;
  canceledBookings: number;
  totalRevenue: number;
};

export type SalesSummaryPeriod = {
  period: string;
  total: number;
  paid: number;
  rate: string;
  revenue: number;
};

export type RecentBookingPassenger = {
  bookingId: string;
  flightNumber: string;
  date: string;
  passengerName: string;
  seat: string;
  status: string;
  flightStatus: string;
};

export type RecentBooking = {
  flight: string;
  price: string;
  route: string;
  departure: string;
  arrival: string;
  seats: string;
  status: string;
  departureDate: string;
  departureTime: string;
};

export type FlightWithId = {
  id: string;
  flight: string;
  price: string;
  route: string;
  departure: string;
  arrival: string;
  seats: string;
  origin: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  arrivalTime: string;
  priceNumber: number;
  status: string;
};

export type PaginatedFlights = {
  flights: FlightWithId[];
  totalCount: number;
  totalPages: number;
  page: number;
  pageSize: number;
};

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient();

  const [flightsResult, bookingsResult, confirmedResult, canceledResult, revenueResult] = await Promise.all([
    supabase.from('flights').select('id', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('bookings').select('id', { count: 'exact', head: true }),
    supabase.from('bookings').select('id', { count: 'exact', head: true }).eq('payment_status', 'paid'),
    supabase.from('bookings').select('id', { count: 'exact', head: true }).eq('status', 'cancelled'),
    supabase.from('bookings').select('total_amount').eq('payment_status', 'paid'),
  ]);

  const totalRevenue = (revenueResult.data || []).reduce((sum, booking) => {
    return sum + parseFloat(booking.total_amount.toString());
  }, 0);

  return {
    totalFlights: flightsResult.count || 0,
    totalBookings: bookingsResult.count || 0,
    confirmedBookings: confirmedResult.count || 0,
    canceledBookings: canceledResult.count || 0,
    totalRevenue,
  };
}

function getBiWeeklyPeriods(): Array<{ start: Date; end: Date; label: string }> {
  const periods: Array<{ start: Date; end: Date; label: string }> = [];
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  
  for (let i = 5; i >= 0; i--) {
    const endDate = new Date(today);
    endDate.setDate(today.getDate() - (i * 14));
    
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - 13);
    startDate.setHours(0, 0, 0, 0);
    
    const startMonth = startDate.toLocaleString('en-US', { month: 'short' });
    const startDay = startDate.getDate();
    const endMonth = endDate.toLocaleString('en-US', { month: 'short' });
    const endDay = endDate.getDate();
    const year = endDate.getFullYear();
    
    const label = startMonth === endMonth
      ? `${startMonth} ${startDay}-${endDay}, ${year}`
      : `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
    
    periods.push({ start: startDate, end: endDate, label });
  }
  
  return periods;
}

export async function getSalesSummary(): Promise<SalesSummaryPeriod[]> {
  const supabase = await createClient();
  const allPeriods = getBiWeeklyPeriods();
  
  const periods = allPeriods.filter((period) => {
    const startMonth = period.start.getMonth();
    const endMonth = period.end.getMonth();
    const excludedMonths = [8, 9, 10];
    return !excludedMonths.includes(startMonth) && !excludedMonths.includes(endMonth);
  });

  const { data: allBookings, error } = await supabase
    .from('bookings')
    .select('created_at, payment_status, total_amount')
    .order('created_at', { ascending: false });

  if (error || !allBookings) {
    return [];
  }

  return periods.map((period) => {
    const periodBookings = allBookings.filter((booking) => {
      const bookingDate = new Date(booking.created_at);
      bookingDate.setHours(0, 0, 0, 0);
      return bookingDate >= period.start && bookingDate <= period.end;
    });

    const total = periodBookings.length;
    const paid = periodBookings.filter((b) => b.payment_status === 'paid').length;
    const revenue = periodBookings
      .filter((b) => b.payment_status === 'paid')
      .reduce((sum, b) => sum + parseFloat(b.total_amount.toString()), 0);
    
    const rate = total > 0 ? ((paid / total) * 100).toFixed(1) + '%' : '0%';

    return {
      period: period.label,
      total,
      paid,
      rate,
      revenue,
    };
  });
}

export async function getAllBookingPassengers(): Promise<RecentBookingPassenger[]> {
  const supabase = await createClient();

  const { data: bookings, error } = await supabase
    .from('bookings')
    .select(`
      id,
      payment_status,
      created_at,
      departing_flight:flights!bookings_departing_flight_id_fkey(
        flight_number,
        departure_date,
        status
      ),
      booking_passengers(
        passengers(
          first_name,
          last_name
        )
      ),
      booking_seats(
        seats(
          seat_number
        )
      )
    `)
    .order('created_at', { ascending: false });

  if (error || !bookings) {
    return [];
  }

  const results: RecentBookingPassenger[] = [];

  for (const booking of bookings) {
    const flight = booking.departing_flight as any;
    const passengers = booking.booking_passengers as any[];
    const seats = booking.booking_seats as any[];

    if (!flight || !passengers || passengers.length === 0) {
      continue;
    }

    const date = new Date(flight.departure_date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    for (let i = 0; i < passengers.length; i++) {
      const passenger = passengers[i]?.passengers;
      if (!passenger) {
        continue;
      }

      const passengerSeat = seats[i]?.seats;
      const seatNumber = passengerSeat?.seat_number || 'N/A';

      const passengerName = `${passenger.first_name} ${passenger.last_name}`;

      const flightStatusMap: Record<string, string> = {
        cancelled: 'Suspended',
        delayed: 'Delayed',
        active: 'On Time',
      };
      const flightStatus = flightStatusMap[flight.status] || 'On Time';

      results.push({
        bookingId: (booking as any).id,
        flightNumber: flight.flight_number || 'N/A',
        date,
        passengerName,
        seat: seatNumber,
        status: booking.payment_status === 'paid' ? 'Paid' : 'Pending',
        flightStatus,
      });
    }
  }

  return results;
}

export async function getRecentBookingPassengers(limit: number = 5): Promise<RecentBookingPassenger[]> {
  const supabase = await createClient();

  const { data: bookings, error } = await supabase
    .from('bookings')
    .select(`
      id,
      payment_status,
      departing_flight:flights!bookings_departing_flight_id_fkey(
        flight_number,
        departure_date,
        status
      ),
      booking_passengers(
        passengers(
          first_name,
          last_name
        )
      ),
      booking_seats(
        seats(
          seat_number
        )
      )
    `)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error || !bookings) {
    return [];
  }

  const results: RecentBookingPassenger[] = [];

  for (const booking of bookings) {
    const flight = booking.departing_flight as any;
    const passengers = booking.booking_passengers as any[];
    const seats = booking.booking_seats as any[];

    if (!flight || !passengers || passengers.length === 0 || !seats || seats.length === 0) {
      continue;
    }

    const firstPassenger = passengers[0]?.passengers;
    const firstSeat = seats[0]?.seats;

    if (!firstPassenger || !firstSeat) {
      continue;
    }

    const passengerName = `${firstPassenger.first_name} ${firstPassenger.last_name}`;
    const date = new Date(flight.departure_date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const flightStatusMap: Record<string, string> = {
      cancelled: 'Suspended',
      delayed: 'Delayed',
      active: 'On Time',
    };
    const flightStatus = flightStatusMap[flight.status] || 'On Time';

    results.push({
      bookingId: (booking as any).id,
      flightNumber: flight.flight_number || 'N/A',
      date,
      passengerName,
      seat: firstSeat.seat_number || 'N/A',
      status: booking.payment_status === 'paid' ? 'Paid' : 'Pending',
      flightStatus,
    });
  }

  return results;
}

export async function getRecentBookings(limit: number = 5): Promise<RecentBooking[]> {
  const supabase = await createClient();
  const now = new Date().toISOString();

  const { data: bookings, error } = await supabase
    .from('bookings')
    .select(`
      total_amount,
      departing_flight:flights!bookings_departing_flight_id_fkey(
        flight_number,
        origin,
        destination,
        departure_date,
        departure_time,
        arrival_time,
        id,
        status,
        price
      )
    `)
    .limit(100);

  if (error || !bookings) {
    return [];
  }

  const results: RecentBooking[] = [];
  const seenFlightIds = new Set<string>();

  for (const booking of bookings) {
    const flight = booking.departing_flight as any;

    if (!flight || !flight.id) {
      continue;
    }

    if (seenFlightIds.has(flight.id)) {
      continue;
    }

    seenFlightIds.add(flight.id);

    const { count } = await supabase
      .from('seats')
      .select('id', { count: 'exact', head: true })
      .eq('flight_id', flight.id)
      .or(`status.eq.available,and(status.eq.held,hold_expires_at.lt.${now})`);

    const availableSeats = count || 0;

    const formatTime = (time: string) => {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    };

    const formatDate = (date: string) => {
      return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    };

    const departureFormatted = `${formatDate(flight.departure_date)} • ${formatTime(flight.departure_time)}`;
    const arrivalFormatted = `${formatDate(flight.departure_date)} • ${formatTime(flight.arrival_time)}`;

    const route = `${flight.origin} ➜ ${flight.destination}`;
    const price = new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
    }).format(parseFloat(flight.price.toString()));

    results.push({
      flight: flight.flight_number || 'N/A',
      price,
      route,
      departure: departureFormatted,
      arrival: arrivalFormatted,
      seats: availableSeats.toString(),
      status: flight.status || 'active',
      departureDate: flight.departure_date,
      departureTime: flight.departure_time,
    });
  }

  results.sort((a, b) => {
    const dateCompare = a.departureDate.localeCompare(b.departureDate);
    if (dateCompare !== 0) {
      return dateCompare;
    }
    return a.departureTime.localeCompare(b.departureTime);
  });

  return results.slice(0, limit);
}

export async function getAllFlights(page: number = 1, pageSize: number = 10): Promise<PaginatedFlights> {
  const supabase = await createClient();
  const now = new Date().toISOString();

  const safePageSize = Number.isFinite(pageSize) && pageSize > 0 ? Math.min(pageSize, 100) : 10;
  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const from = (safePage - 1) * safePageSize;
  const to = from + safePageSize - 1;

  const { count: totalCount, error: countError } = await supabase
    .from('flights')
    .select('id', { count: 'exact', head: true });

  const { data: flights, error } = await supabase
    .from('flights')
    .select('flight_number, origin, destination, departure_date, departure_time, arrival_time, price, id, status')
    .order('departure_date', { ascending: true })
    .order('departure_time', { ascending: true })
    .range(from, to);

  if (countError || totalCount === null || error || !flights) {
    return {
      flights: [],
      totalCount: 0,
      totalPages: 0,
      page: safePage,
      pageSize: safePageSize,
    };
  }

  const seatCounts = await Promise.all(
    flights.map(async (flight) => {
      const { count } = await supabase
        .from('seats')
        .select('id', { count: 'exact', head: true })
        .eq('flight_id', flight.id)
        .or(`status.eq.available,and(status.eq.held,hold_expires_at.lt.${now})`);

      return count || 0;
    })
  );

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const results: FlightWithId[] = flights.map((flight, index) => {
    const availableSeats = seatCounts[index] || 0;

    const departureFormatted = `${formatDate(flight.departure_date)} • ${formatTime(flight.departure_time)}`;
    const arrivalFormatted = `${formatDate(flight.departure_date)} • ${formatTime(flight.arrival_time)}`;

    const route = `${flight.origin} ➜ ${flight.destination}`;
    const price = new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
    }).format(parseFloat(flight.price.toString()));

    return {
      id: flight.id,
      flight: flight.flight_number || 'N/A',
      price,
      route,
      departure: departureFormatted,
      arrival: arrivalFormatted,
      seats: availableSeats.toString(),
      origin: flight.origin,
      destination: flight.destination,
      departureDate: flight.departure_date,
      departureTime: flight.departure_time,
      arrivalTime: flight.arrival_time,
      priceNumber: parseFloat(flight.price.toString()),
      status: flight.status || 'active',
    };
  });

  const totalPages = Math.max(1, Math.ceil(totalCount / safePageSize));

  return {
    flights: results,
    totalCount,
    totalPages,
    page: safePage,
    pageSize: safePageSize,
  };
}

