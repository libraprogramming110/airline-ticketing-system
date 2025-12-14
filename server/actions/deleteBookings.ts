'use server';

import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const deleteBookingsSchema = z.object({
  bookingIds: z.array(z.string().uuid('Invalid booking ID')).min(1, 'At least one booking ID is required'),
});

export async function deleteBookingsAction(formData: FormData) {
  const bookingIdsString = formData.get('bookingIds');
  
  if (!bookingIdsString || typeof bookingIdsString !== 'string') {
    return { success: false, error: 'Booking IDs are required' };
  }

  let bookingIds: string[];
  try {
    bookingIds = JSON.parse(bookingIdsString);
  } catch {
    return { success: false, error: 'Invalid booking IDs format' };
  }

  const validation = deleteBookingsSchema.safeParse({ bookingIds });
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0]?.message ?? 'Invalid booking IDs' };
  }

  const supabase = await createClient();

  try {
    const { data, error } = await supabase.rpc('delete_bookings', {
      p_booking_ids: validation.data.bookingIds,
    });

    if (error) {
      return { success: false, error: error.message || 'Failed to delete bookings' };
    }

    if (!data || data.length === 0 || !data[0].success) {
      const errorMessage = data && data[0] ? data[0].error_message : 'Unknown error occurred';
      return { success: false, error: errorMessage || 'Failed to delete bookings' };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred while deleting bookings',
    };
  }
}

