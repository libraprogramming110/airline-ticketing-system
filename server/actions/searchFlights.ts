'use server';

import { searchFlights } from '@/server/services/flightService';
import { z } from 'zod';

const searchSchema = z.object({
  origin: z.string().length(3, 'Origin must be a valid airport code'),
  destination: z.string().length(3, 'Destination must be a valid airport code'),
  departureDate: z.string().min(1, 'Departure date is required'),
  returnDate: z.string().optional(),
  adults: z.number().min(1).max(10),
  children: z.number().min(0).max(10),
});

export async function searchFlightsAction(formData: FormData) {
  try {
    const rawData = {
      origin: formData.get('origin') as string,
      destination: formData.get('destination') as string,
      departureDate: formData.get('departureDate') as string,
      returnDate: formData.get('returnDate') as string | null,
      adults: parseInt(formData.get('adults') as string) || 0,
      children: parseInt(formData.get('children') as string) || 0,
    };

    const validated = searchSchema.parse({
      ...rawData,
      returnDate: rawData.returnDate || undefined,
    });

    const passengerCount = validated.adults + validated.children;

    const departingFlights = await searchFlights(
      validated.origin,
      validated.destination,
      validated.departureDate,
      passengerCount
    );

    let returningFlights = null;
    if (validated.returnDate && validated.returnDate !== '') {
      returningFlights = await searchFlights(
        validated.destination,
        validated.origin,
        validated.returnDate,
        passengerCount
      );
    }

    return {
      success: true,
      departingFlights,
      returningFlights,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstIssue = error.issues[0];
      return {
        success: false,
        error: firstIssue?.message ?? 'Invalid flight search',
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to search flights',
    };
  }
}

