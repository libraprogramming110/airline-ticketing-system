'use server';

import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const updateFlightSchema = z.object({
  flightId: z.string().uuid('Invalid flight ID'),
  departureTime: z.string().min(1, 'Departure time is required'),
  arrivalTime: z.string().min(1, 'Arrival time is required'),
}).refine(
  (data) => {
    const depTimeStr = data.departureTime;
    const arrTimeStr = data.arrivalTime;
    
    const [depHours, depMinutes] = depTimeStr.split(':').map(Number);
    const [arrHours, arrMinutes] = arrTimeStr.split(':').map(Number);
    
    const depMinutesTotal = depHours * 60 + depMinutes;
    let arrMinutesTotal = arrHours * 60 + arrMinutes;
    
    if (arrMinutesTotal <= depMinutesTotal) {
      arrMinutesTotal += 24 * 60;
    }
    
    return arrMinutesTotal > depMinutesTotal;
  },
  {
    message: 'Arrival time must be greater than departure time',
    path: ['arrivalTime'],
  }
);

function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

function validateTimesAgainstOriginal(
  newDepartureTime: string,
  newArrivalTime: string,
  originalDepartureTime: string,
  originalArrivalTime: string
): string | null {
  const newDepMinutes = timeToMinutes(newDepartureTime);
  const newArrMinutes = timeToMinutes(newArrivalTime);
  const origDepMinutes = timeToMinutes(originalDepartureTime);
  const origArrMinutes = timeToMinutes(originalArrivalTime);

  let adjustedNewDepMinutes = newDepMinutes;
  let adjustedNewArrMinutes = newArrMinutes;

  if (newDepMinutes < origDepMinutes) {
    adjustedNewDepMinutes = newDepMinutes + (24 * 60);
  }

  if (newArrMinutes < origArrMinutes) {
    adjustedNewArrMinutes = newArrMinutes + (24 * 60);
  }

  if (adjustedNewDepMinutes < origDepMinutes) {
    return 'New departure time cannot be earlier than the original departure time';
  }

  if (adjustedNewArrMinutes < origArrMinutes) {
    return 'New arrival time cannot be earlier than the original arrival time';
  }

  return null;
}

function isTimeDelayed(
  newDepartureTime: string,
  newArrivalTime: string,
  originalDepartureTime: string,
  originalArrivalTime: string
): boolean {
  const newDepMinutes = timeToMinutes(newDepartureTime);
  const newArrMinutes = timeToMinutes(newArrivalTime);
  const origDepMinutes = timeToMinutes(originalDepartureTime);
  const origArrMinutes = timeToMinutes(originalArrivalTime);

  let adjustedNewDepMinutes = newDepMinutes;
  let adjustedNewArrMinutes = newArrMinutes;

  if (newDepMinutes < origDepMinutes) {
    adjustedNewDepMinutes = newDepMinutes + (24 * 60);
  }

  if (newArrMinutes < origArrMinutes) {
    adjustedNewArrMinutes = newArrMinutes + (24 * 60);
  }

  return adjustedNewDepMinutes > origDepMinutes || adjustedNewArrMinutes > origArrMinutes;
}

export async function updateFlightAction(formData: FormData) {
  try {
    const rawData = {
      flightId: formData.get('flightId') as string,
      departureTime: formData.get('departureTime') as string,
      arrivalTime: formData.get('arrivalTime') as string,
    };

    const validated = updateFlightSchema.parse(rawData);
    const supabase = await createClient();

    const { data: flight, error: fetchError } = await supabase
      .from('flights')
      .select('departure_time, arrival_time, status')
      .eq('id', validated.flightId)
      .single();

    if (fetchError || !flight) {
      return {
        success: false,
        error: 'Flight not found',
      };
    }

    const timeValidationError = validateTimesAgainstOriginal(
      validated.departureTime,
      validated.arrivalTime,
      flight.departure_time,
      flight.arrival_time
    );

    if (timeValidationError) {
      return {
        success: false,
        error: timeValidationError,
      };
    }

    const isDelayed = isTimeDelayed(
      validated.departureTime,
      validated.arrivalTime,
      flight.departure_time,
      flight.arrival_time
    );

    const updateData: {
      departure_time: string;
      arrival_time: string;
      updated_at: string;
      status?: string;
    } = {
      departure_time: validated.departureTime,
      arrival_time: validated.arrivalTime,
      updated_at: new Date().toISOString(),
    };

    if (isDelayed && flight.status !== 'cancelled') {
      updateData.status = 'delayed';
    }

    const { error } = await supabase
      .from('flights')
      .update(updateData)
      .eq('id', validated.flightId);

    if (error) {
      return {
        success: false,
        error: `Failed to update flight: ${error.message}`,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstIssue = error.issues[0];
      return {
        success: false,
        error: firstIssue?.message ?? 'Invalid flight data',
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update flight',
    };
  }
}

