'use server';

import { getBookingByReference } from '@/server/services/bookingService';
import { z } from 'zod';

const getBookingSchema = z.string().min(1, 'Booking reference is required');

export async function getBookingAction(bookingReference: string) {
  try {
    const validated = getBookingSchema.parse(bookingReference);
    const booking = await getBookingByReference(validated);

    if (!booking) {
      return {
        success: false,
        error: 'Booking not found',
      };
    }

    return {
      success: true,
      booking,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstIssue = error.issues[0];
      return {
        success: false,
        error: firstIssue?.message ?? 'Invalid booking reference',
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch booking',
    };
  }
}





