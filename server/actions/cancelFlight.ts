'use server';

import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const cancelFlightSchema = z.object({
  flightId: z.string().uuid('Invalid flight ID'),
});

async function cancelActiveBookings(supabase: Awaited<ReturnType<typeof createClient>>, flightId: string) {
  const { data: activeBookings } = await supabase
    .from('bookings')
    .select('id, payment_status')
    .or(`departing_flight_id.eq.${flightId},returning_flight_id.eq.${flightId}`)
    .in('status', ['pending', 'confirmed']);

  if (!activeBookings || activeBookings.length === 0) {
    return;
  }

  const bookingIds = activeBookings.map((b: any) => b.id);

  for (const booking of activeBookings) {
    const paymentStatus = booking.payment_status === 'paid' ? 'refunded' : booking.payment_status;
    
    await supabase
      .from('bookings')
      .update({
        status: 'cancelled',
        payment_status: paymentStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', booking.id);
  }

  return bookingIds;
}

async function releaseSeats(supabase: Awaited<ReturnType<typeof createClient>>, bookingIds: string[]) {
  const { data: bookingSeats } = await supabase
    .from('booking_seats')
    .select('seat_id')
    .in('booking_id', bookingIds);

  if (!bookingSeats || bookingSeats.length === 0) {
    return;
  }

  const seatIds = bookingSeats.map((bs: any) => bs.seat_id);
  
  await supabase
    .from('seats')
    .update({
      status: 'available',
      hold_expires_at: null,
      updated_at: new Date().toISOString(),
    })
    .in('id', seatIds);
}

export async function cancelFlightAction(formData: FormData) {
  try {
    const rawData = {
      flightId: formData.get('flightId') as string,
    };

    const validated = cancelFlightSchema.parse(rawData);
    const supabase = await createClient();

    const bookingIds = await cancelActiveBookings(supabase, validated.flightId);
    
    if (bookingIds && bookingIds.length > 0) {
      await releaseSeats(supabase, bookingIds);
    }

    const { error } = await supabase
      .from('flights')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString(),
      })
      .eq('id', validated.flightId);

    if (error) {
      return {
        success: false,
        error: `Failed to cancel flight: ${error.message}`,
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
        error: firstIssue?.message ?? 'Invalid flight ID',
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to cancel flight',
    };
  }
}

