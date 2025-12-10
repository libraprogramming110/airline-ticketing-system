import { supabase } from '@/lib/supabase/server';

export type Flight = {
  id: string;
  origin: string;
  destination: string;
  departure_date: string;
  departure_time: string;
  arrival_time: string;
  price: number;
  available_seats: number;
  cabin_class: string;
};

export type DatePrice = {
  date: string;
  lowest_price: number;
};

export async function searchFlights(
  origin: string,
  destination: string,
  departureDate: string,
  passengerCount: number
) {
  const { data: flights, error } = await supabase
    .from('flights')
    .select('id, origin, destination, departure_date, departure_time, arrival_time, price, created_at, updated_at')
    .eq('origin', origin)
    .eq('destination', destination)
    .eq('departure_date', departureDate)
    .order('departure_time', { ascending: true });

  if (error) {
    throw new Error(`Failed to search flights: ${error.message}`);
  }

  if (!flights || flights.length === 0) {
    return [];
  }

  const now = new Date().toISOString();
  const flightsWithSeatCount: Flight[] = [];

  for (const flight of flights) {
    const { count, error: seatError } = await supabase
      .from('seats')
      .select('id', { count: 'exact', head: false })
      .eq('flight_id', flight.id)
      .or(`status.eq.available,and(status.eq.held,hold_expires_at.lt.${now})`);

    if (seatError) {
      console.error(`Failed to count seats for flight ${flight.id}:`, seatError);
      continue;
    }

    const availableSeats = count || 0;

    if (availableSeats >= passengerCount) {
      flightsWithSeatCount.push({
        ...flight,
        available_seats: availableSeats,
      });
    }
  }

  return flightsWithSeatCount;
}

export async function getLowestPricesByDate(
  origin: string,
  destination: string,
  startDate: string
) {
  if (!startDate || startDate.trim() === '') {
    return [];
  }

  const { data, error } = await supabase
    .from('flights')
    .select('departure_date, price')
    .eq('origin', origin)
    .eq('destination', destination)
    .gte('departure_date', startDate)
    .order('departure_date', { ascending: true })
    .order('price', { ascending: true });

  if (error) {
    throw new Error(`Failed to get date prices: ${error.message}`);
  }

  const datePriceMap = new Map<string, number>();

  data.forEach((flight) => {
    const date = flight.departure_date;
    const price = flight.price;
    if (!datePriceMap.has(date) || price < datePriceMap.get(date)!) {
      datePriceMap.set(date, price);
    }
  });

  const datePrices: DatePrice[] = Array.from(datePriceMap.entries())
    .map(([date, lowest_price]) => ({ date, lowest_price }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 6);

  return datePrices;
}

