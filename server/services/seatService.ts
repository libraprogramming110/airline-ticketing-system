import { createClient } from '@/lib/supabase/server';

export type Seat = {
  id: string;
  flight_id: string;
  seat_number: string;
  cabin_class: string;
  status: 'available' | 'held' | 'booked';
  hold_expires_at: string | null;
};

export async function getSeatsByFlight(flightId: string, cabinClass?: string) {
  const supabase = await createClient();
  let query = supabase
    .from('seats')
    .select('*')
    .eq('flight_id', flightId);
  
  if (cabinClass) {
    query = query.eq('cabin_class', cabinClass);
  }
  
  const { data, error } = await query.order('seat_number', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch seats: ${error.message}`);
  }

  return data as Seat[];
}

export async function getAvailableSeatsByFlight(flightId: string, cabinClass?: string) {
  const supabase = await createClient();
  const now = new Date().toISOString();
  
  let query = supabase
    .from('seats')
    .select('*')
    .eq('flight_id', flightId)
    .or(`status.eq.available,and(status.eq.held,or(hold_expires_at.is.null,hold_expires_at.lt.${now}))`);
  
  if (cabinClass) {
    query = query.eq('cabin_class', cabinClass);
  }
  
  const { data, error } = await query.order('seat_number', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch available seats: ${error.message}`);
  }

  return (data || []) as Seat[];
}

export async function getAvailableSeatCountByCabin(flightId: string, cabinClass: string): Promise<number> {
  const supabase = await createClient();
  const now = new Date().toISOString();
  
  const { data, error } = await supabase
    .from('seats')
    .select('id', { count: 'exact', head: false })
    .eq('flight_id', flightId)
    .eq('cabin_class', cabinClass)
    .or(`status.eq.available,and(status.eq.held,hold_expires_at.lt.${now})`);

  if (error) {
    throw new Error(`Failed to fetch available seat count: ${error.message}`);
  }

  return data?.length || 0;
}

