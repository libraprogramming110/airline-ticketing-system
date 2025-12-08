'use server';

import { getAvailableSeatCountByCabin } from '@/server/services/seatService';

export async function getCabinAvailabilityAction(flightId: string, cabinClass: string) {
  try {
    const count = await getAvailableSeatCountByCabin(flightId, cabinClass);
    return {
      success: true,
      count,
    };
  } catch (error) {
    return {
      success: false,
      count: 0,
      error: error instanceof Error ? error.message : 'Failed to fetch cabin availability',
    };
  }
}

