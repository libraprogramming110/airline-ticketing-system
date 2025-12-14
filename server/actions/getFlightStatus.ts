'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const statusSchema = z.object({
  mode: z.enum(['route', 'flight']),
  origin: z.string().length(3).optional(),
  destination: z.string().length(3).optional(),
  date: z.string().min(1, 'Date is required'),
  flightNumber: z.string().optional(),
});

type FlightStatus = {
  id: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departure_date: string;
  departure_time: string;
  arrival_time: string;
  price: number;
  status: string;
};

function mapFlightStatus(dbStatus: string | null): string {
  if (dbStatus === 'cancelled') {
    return 'Cancelled';
  }
  if (dbStatus === 'delayed') {
    return 'Delayed';
  }
  return 'On time';
}

async function searchFlightsByRoute(
  origin: string,
  destination: string,
  date: string
): Promise<FlightStatus[]> {
  const supabase = await createClient();
  const { data: flights, error } = await supabase
    .from('flights')
    .select('id, origin, destination, departure_date, departure_time, arrival_time, price, flight_number, status')
    .eq('origin', origin)
    .eq('destination', destination)
    .eq('departure_date', date)
    .order('departure_time', { ascending: true });

  if (error || !flights) {
    return [];
  }

  return flights.map((f) => ({
    id: f.id,
    flightNumber: f.flight_number || f.id,
    origin: f.origin,
    destination: f.destination,
    departure_date: f.departure_date,
    departure_time: f.departure_time,
    arrival_time: f.arrival_time,
    price: parseFloat(f.price.toString()),
    status: mapFlightStatus(f.status),
  }));
}

async function searchFlightsByFlightNumber(
  flightNumber: string,
  date: string
): Promise<FlightStatus[]> {
  const supabase = await createClient();
  const { data: flights, error } = await supabase
    .from('flights')
    .select('id, origin, destination, departure_date, departure_time, arrival_time, price, flight_number, status')
    .eq('flight_number', flightNumber)
    .eq('departure_date', date)
    .order('departure_time', { ascending: true });

  if (error || !flights) {
    return [];
  }

  return flights.map((f) => ({
    id: f.id,
    flightNumber: f.flight_number || f.id,
    origin: f.origin,
    destination: f.destination,
    departure_date: f.departure_date,
    departure_time: f.departure_time,
    arrival_time: f.arrival_time,
    price: parseFloat(f.price.toString()),
    status: mapFlightStatus(f.status),
  }));
}

export async function getFlightStatusAction(formData: FormData) {
  try {
    const raw = {
      mode: formData.get('mode') as string,
      origin: formData.get('origin') as string | null,
      destination: formData.get('destination') as string | null,
      date: formData.get('date') as string | null,
      flightNumber: formData.get('flightNumber') as string | null,
    };

    const validated = statusSchema.parse({
      mode: raw.mode,
      origin: raw.origin || undefined,
      destination: raw.destination || undefined,
      date: raw.date || '',
      flightNumber: raw.flightNumber || undefined,
    });

    let flights: FlightStatus[] = [];

    if (validated.mode === 'route') {
      if (!validated.origin || !validated.destination) {
        return { success: false, error: 'Origin and destination are required' };
      }

      flights = await searchFlightsByRoute(
        validated.origin,
        validated.destination,
        validated.date
      );
    } else {
      if (!validated.flightNumber) {
        return { success: false, error: 'Flight number is required' };
      }

      flights = await searchFlightsByFlightNumber(
        validated.flightNumber,
        validated.date
      );
    }

    return {
      success: true,
      flights,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstIssue = error.issues[0];
      return {
        success: false,
        error: firstIssue?.message ?? 'Invalid flight status request',
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch flight status',
    };
  }
}

