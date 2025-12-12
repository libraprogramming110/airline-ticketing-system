'use server';

import { verifyBookingAccess } from '@/server/services/bookingService';
import { z } from 'zod';

const verifyBookingSchema = z.object({
  bookingReference: z.string().min(1, 'Booking reference is required'),
  lastNameOrEmail: z.string().min(1, 'Last name or email is required'),
});

export async function verifyBookingAction(formData: FormData) {
  try {
    const rawData = {
      bookingReference: formData.get('bookingReference') as string,
      lastNameOrEmail: formData.get('lastNameOrEmail') as string,
    };

    const validated = verifyBookingSchema.parse(rawData);

    const result = await verifyBookingAccess(
      validated.bookingReference,
      validated.lastNameOrEmail
    );

    if (!result.success) {
      return {
        success: false,
        error: result.error || 'Booking verification failed',
      };
    }

    return {
      success: true,
      booking: result.booking,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstIssue = error.issues[0];
      return {
        success: false,
        error: firstIssue?.message ?? 'Invalid verification data',
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to verify booking',
    };
  }
}
