'use server';

import { z } from 'zod';
import { getBookingByReference, verifyBookingAccess } from '@/server/services/bookingService';

const checkInSchema = z.object({
  bookingReference: z.string().min(1, 'Booking reference is required'),
  lastNameOrEmail: z.string().min(1, 'Last name or email is required'),
});

function isWithinCheckInWindow(departureDate: string, departureTime: string) {
  const dep = new Date(`${departureDate}T${departureTime}`);
  const now = new Date();
  const diffMs = dep.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  return diffHours <= 48 && diffHours >= 1;
}

export async function checkInAction(formData: FormData) {
  try {
    const raw = {
      bookingReference: formData.get('bookingReference') as string,
      lastNameOrEmail: formData.get('lastNameOrEmail') as string,
    };

    const validated = checkInSchema.parse(raw);

    // Verify booking + passenger match
    const verification = await verifyBookingAccess(validated.bookingReference, validated.lastNameOrEmail);
    if (!verification.success || !verification.booking) {
      return { success: false, error: verification.error || 'Booking not found' };
    }

    const booking = verification.booking;

    // Eligibility checks
    if (booking.paymentStatus !== 'paid') {
      return { success: false, error: 'Payment required before check-in' };
    }

    if (booking.status !== 'confirmed') {
      return { success: false, error: 'Only confirmed bookings can be checked in' };
    }

    const eligible = isWithinCheckInWindow(booking.departingFlight.date, booking.departingFlight.departureTime);
    if (!eligible) {
      return { success: false, error: 'Check-in available from 48h to 1h before departure' };
    }

    // All good — return booking details (no DB mutation needed for static UI)
    return {
      success: true,
      booking,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstIssue = error.issues[0];
      return {
        success: false,
        error: firstIssue?.message ?? 'Invalid check-in data',
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to check in',
    };
  }
}

