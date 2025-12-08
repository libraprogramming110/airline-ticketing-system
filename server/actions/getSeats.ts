'use server';

import { getSeatsByFlight } from '@/server/services/seatService';
import { z } from 'zod';

const getSeatsSchema = z.object({
  flightId: z.string().uuid('Invalid flight ID'),
  cabinClass: z.string().optional(),
});

export async function getSeatsAction(flightId: string, cabinClass?: string) {
  try {
    const validated = getSeatsSchema.parse({ flightId, cabinClass });

    const seats = await getSeatsByFlight(validated.flightId, validated.cabinClass);

    return {
      success: true,
      seats,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstIssue = error.issues[0];
      return {
        success: false,
        error: firstIssue?.message ?? 'Invalid seat request',
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch seats',
    };
  }
}

