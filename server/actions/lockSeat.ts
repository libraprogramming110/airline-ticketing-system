'use server';

import { lockSeats, calculateTotalAmount } from '@/server/services/bookingService';
import { supabase } from '@/lib/supabase/server';
import { z } from 'zod';

const lockSeatsSchema = z.object({
  seatIds: z.array(z.string().uuid()).min(1, 'At least one seat must be selected'),
  departingFlightId: z.string().uuid('Invalid departing flight ID'),
  returningFlightId: z.string().uuid().nullable().optional(),
  adultsCount: z.number().min(1).max(10),
  childrenCount: z.number().min(0).max(10),
  selectedSeats: z.array(
    z.object({
      id: z.string().uuid(),
      price: z.number().min(0),
    })
  ),
  selectedAddOns: z.array(
    z.object({
      name: z.string(),
      price: z.number().min(0),
      category: z.string(),
    })
  ),
});

export async function lockSeatsAction(formData: FormData) {
  try {
    const rawData = {
      seatIds: JSON.parse(formData.get('seatIds') as string),
      departingFlightId: formData.get('departingFlightId') as string,
      returningFlightId: formData.get('returningFlightId') as string | null,
      departureSeatIds: formData.get('departureSeatIds') ? JSON.parse(formData.get('departureSeatIds') as string) : [],
      returnSeatIds: formData.get('returnSeatIds') ? JSON.parse(formData.get('returnSeatIds') as string) : [],
      adultsCount: parseInt(formData.get('adultsCount') as string) || 0,
      childrenCount: parseInt(formData.get('childrenCount') as string) || 0,
      selectedSeats: JSON.parse(formData.get('selectedSeats') as string),
      selectedAddOns: JSON.parse(formData.get('selectedAddOns') as string),
    };

    const validated = lockSeatsSchema.parse(rawData);

    const { data: departingFlight, error: departingError } = await supabase
      .from('flights')
      .select('*')
      .eq('id', validated.departingFlightId)
      .single();

    if (departingError || !departingFlight) {
      return {
        success: false,
        error: 'Departing flight not found',
      };
    }

    let returningFlight = null;
    if (validated.returningFlightId) {
      const { data: returnFlight, error: returnError } = await supabase
        .from('flights')
        .select('*')
        .eq('id', validated.returningFlightId)
        .single();

      if (returnError || !returnFlight) {
        return {
          success: false,
          error: 'Returning flight not found',
        };
      }
      returningFlight = returnFlight;
    }

    const totalAmount = await calculateTotalAmount(
      departingFlight.price,
      returningFlight?.price || null,
      validated.selectedSeats,
      validated.selectedAddOns
    );

    const departureSeatIds = rawData.departureSeatIds.length > 0 ? rawData.departureSeatIds : validated.seatIds;
    const returnSeatIds = rawData.returnSeatIds.length > 0 ? rawData.returnSeatIds : [];
    
    const result = await lockSeats(
      departureSeatIds,
      validated.departingFlightId,
      validated.returningFlightId || null,
      returnSeatIds,
      validated.adultsCount,
      validated.childrenCount,
      totalAmount
    );

    return {
      success: true,
      bookingId: result.bookingId,
      bookingReference: result.bookingReference,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstIssue = error.issues[0];
      return {
        success: false,
        error: firstIssue?.message ?? 'Invalid seat selection',
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to lock seats',
    };
  }
}

