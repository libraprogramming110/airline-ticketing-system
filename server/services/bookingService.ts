import { supabase } from '@/lib/supabase/server';

export type BookingResult = {
  bookingId: string;
  bookingReference: string;
};

export type BookingDetails = {
  id: string;
  bookingReference: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string | null;
  totalAmount: number;
  adultsCount: number;
  childrenCount: number;
  departingFlight: {
    id: string;
    flightNumber: string;
    origin: string;
    destination: string;
    departureTime: string;
    arrivalTime: string;
    date: string;
  };
  returningFlight: {
    id: string;
    flightNumber: string;
    origin: string;
    destination: string;
    departureTime: string;
    arrivalTime: string;
    date: string;
  } | null;
  seats: Array<{
    id: string;
    seatNumber: string;
    flightId: string;
  }>;
  passengers: Array<{
    id: string;
    firstName: string;
    lastName: string;
    middleInitial: string | null;
    email: string;
    phone: string | null;
    passengerType: string;
  }>;
};

export async function calculateTotalAmount(
  departingFlightPrice: number,
  returningFlightPrice: number | null,
  selectedSeats: Array<{ id: string; price: number }>,
  selectedAddOns: Array<{ name: string; price: number; category: string }>
): Promise<number> {
  const flightSubtotal = departingFlightPrice + (returningFlightPrice || 0);
  const seatsSubtotal = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  const addOnsSubtotal = selectedAddOns.reduce((sum, addon) => sum + addon.price, 0);
  const baseTaxesAndFees = 3425.80;
  const vatForAddOns = addOnsSubtotal * 0.12;

  const total = flightSubtotal + seatsSubtotal + addOnsSubtotal + baseTaxesAndFees + vatForAddOns;
  return Math.round(total * 100) / 100;
}

export async function lockSeats(
  departureSeatIds: string[],
  departingFlightId: string,
  returningFlightId: string | null,
  returnSeatIds: string[],
  adultsCount: number,
  childrenCount: number,
  totalAmount: number,
  passengerIds?: string[]
): Promise<BookingResult> {
  const allSeatIds = [...departureSeatIds, ...returnSeatIds];
  
  const { data, error } = await supabase.rpc('lock_seats_and_create_booking', {
    p_seat_ids: allSeatIds,
    p_departing_flight_id: departingFlightId,
    p_adults_count: adultsCount,
    p_children_count: childrenCount,
    p_total_amount: totalAmount,
    p_returning_flight_id: returningFlightId,
    p_passenger_ids: passengerIds || null,
  });

  if (error) {
    throw new Error(`Failed to lock seats: ${error.message}`);
  }

  if (!data || data.length === 0) {
    throw new Error('No response from database');
  }

  const result = data[0];

  if (!result.success) {
    throw new Error(result.error_message || 'Failed to lock seats');
  }

  if (!result.booking_id || !result.booking_reference) {
    throw new Error('Invalid response from database');
  }

  return {
    bookingId: result.booking_id,
    bookingReference: result.booking_reference,
  };
}

export async function processPayment(
  bookingId: string,
  paymentMethod: string
): Promise<void> {
  const { data, error } = await supabase.rpc('process_payment', {
    p_booking_id: bookingId,
    p_payment_method: paymentMethod,
  });

  if (error) {
    throw new Error(`Failed to process payment: ${error.message}`);
  }

  if (!data || data.length === 0) {
    throw new Error('No response from database');
  }

  const result = data[0];

  if (!result.success) {
    throw new Error(result.error_message || 'Failed to process payment');
  }
}

export async function getBookingByReference(bookingReference: string): Promise<BookingDetails | null> {
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .select(`
      *,
      departing_flight:flights!bookings_departing_flight_id_fkey(*),
      returning_flight:flights!bookings_returning_flight_id_fkey(*)
    `)
    .eq('booking_reference', bookingReference)
    .single();

  if (bookingError || !booking) {
    return null;
  }

  const { data: bookingSeats, error: seatsError } = await supabase
    .from('booking_seats')
    .select(`
      seat_id,
      seats(*)
    `)
    .eq('booking_id', booking.id);

  if (seatsError) {
    throw new Error(`Failed to fetch seats: ${seatsError.message}`);
  }

  const seats = (bookingSeats || []).map((bs: any) => ({
    id: bs.seat_id,
    seatNumber: bs.seats?.seat_number || '',
    flightId: bs.seats?.flight_id || '',
  }));

  const { data: bookingPassengers, error: passengersError } = await supabase
    .from('booking_passengers')
    .select(`
      passenger_id,
      passengers(*)
    `)
    .eq('booking_id', booking.id);

  if (passengersError) {
    throw new Error(`Failed to fetch passengers: ${passengersError.message}`);
  }

  const passengers = (bookingPassengers || []).map((bp: any) => ({
    id: bp.passenger_id,
    firstName: bp.passengers?.first_name || '',
    lastName: bp.passengers?.last_name || '',
    middleInitial: bp.passengers?.middle_initial || null,
    email: bp.passengers?.email || '',
    phone: bp.passengers?.phone || null,
    passengerType: bp.passengers?.passenger_type || '',
  }));

  return {
    id: booking.id,
    bookingReference: booking.booking_reference,
    status: booking.status,
    paymentStatus: booking.payment_status,
    paymentMethod: booking.payment_method,
    totalAmount: parseFloat(booking.total_amount),
    adultsCount: booking.adults_count,
    childrenCount: booking.children_count,
    departingFlight: {
      id: booking.departing_flight.id,
      flightNumber: booking.departing_flight.flight_number,
      origin: booking.departing_flight.origin,
      destination: booking.departing_flight.destination,
      departureTime: booking.departing_flight.departure_time,
      arrivalTime: booking.departing_flight.arrival_time,
      date: booking.departing_flight.departure_date,
    },
    returningFlight: booking.returning_flight ? {
      id: booking.returning_flight.id,
      flightNumber: booking.returning_flight.flight_number,
      origin: booking.returning_flight.origin,
      destination: booking.returning_flight.destination,
      departureTime: booking.returning_flight.departure_time,
      arrivalTime: booking.returning_flight.arrival_time,
      date: booking.returning_flight.departure_date,
    } : null,
    seats,
    passengers,
  };
}

export async function verifyBookingAccess(
  bookingReference: string,
  lastNameOrEmail: string
): Promise<{ success: boolean; booking?: BookingDetails; error?: string }> {
  const booking = await getBookingByReference(bookingReference);

  if (!booking) {
    return {
      success: false,
      error: 'Booking not found',
    };
  }

  const searchValue = lastNameOrEmail.toLowerCase().trim();
  const passengerMatches = booking.passengers.some(
    (passenger) =>
      passenger.lastName.toLowerCase() === searchValue ||
      passenger.email.toLowerCase() === searchValue
  );

  if (!passengerMatches) {
    return {
      success: false,
      error: 'Last name or email does not match this booking',
    };
  }

  return {
    success: true,
    booking,
  };
}

