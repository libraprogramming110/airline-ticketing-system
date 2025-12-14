'use server';

import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const createFlightSchema = z.object({
  origin: z.string().length(3, 'Origin must be a 3-letter airport code'),
  destination: z.string().length(3, 'Destination must be a 3-letter airport code'),
  departureDate: z.string().min(1, 'Departure date is required'),
  departureTime: z.string().min(1, 'Departure time is required'),
  arrivalTime: z.string().min(1, 'Arrival time is required'),
  price: z.string().min(1, 'Price is required'),
}).refine(
  (data) => data.origin !== data.destination,
  {
    message: 'Origin and destination must be different',
    path: ['destination'],
  }
).refine(
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

export async function createFlightAction(formData: FormData) {
  try {
    const rawData = {
      origin: formData.get('origin') as string,
      destination: formData.get('destination') as string,
      departureDate: formData.get('departureDate') as string,
      departureTime: formData.get('departureTime') as string,
      arrivalTime: formData.get('arrivalTime') as string,
      price: formData.get('price') as string,
    };

    const validated = createFlightSchema.parse(rawData);
    const supabase = await createClient();

    const priceNumber = parseFloat(validated.price);
    if (isNaN(priceNumber) || priceNumber <= 0) {
      return {
        success: false,
        error: 'Price must be a valid positive number',
      };
    }

    const { error } = await supabase
      .from('flights')
      .insert({
        origin: validated.origin.toUpperCase(),
        destination: validated.destination.toUpperCase(),
        departure_date: validated.departureDate,
        departure_time: validated.departureTime,
        arrival_time: validated.arrivalTime,
        price: priceNumber,
        status: 'active',
      });

    if (error) {
      return {
        success: false,
        error: `Failed to create flight: ${error.message}`,
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
      error: error instanceof Error ? error.message : 'Failed to create flight',
    };
  }
}

