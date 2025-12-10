'use server';

import { supabase } from '@/lib/supabase/server';
import { z } from 'zod';

const passengerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  middleInitial: z.string().optional(),
  email: z.string().email('Valid email is required'),
  contactNumber: z.string().optional(),
  sex: z.enum(['Male', 'Female', 'Other'], {
    errorMap: () => ({ message: 'Sex is required' }),
  }),
  birthDate: z.string().min(1, 'Date of birth is required'),
  passengerType: z.enum(['adult', 'child'], {
    errorMap: () => ({ message: 'Passenger type is required' }),
  }),
});

export type PassengerPayload = z.infer<typeof passengerSchema>;

const savePassengersSchema = z.array(passengerSchema).min(1, 'At least one passenger is required');

export async function savePassengersAction(passengers: PassengerPayload[]) {
  try {
    const validated = savePassengersSchema.parse(passengers);

    const passengersToInsert = validated.map((p) => ({
      first_name: p.firstName,
      last_name: p.lastName,
      middle_initial: p.middleInitial || null,
      email: p.email,
      phone: p.contactNumber || null,
      sex: p.sex,
      date_of_birth: p.birthDate,
      passenger_type: p.passengerType,
    }));

    const { data, error } = await supabase
      .from('passengers')
      .insert(passengersToInsert)
      .select('id');

    if (error) {
      throw new Error(`Failed to save passengers: ${error.message}`);
    }

    if (!data || data.length === 0) {
      throw new Error('No passengers were saved');
    }

    return {
      success: true,
      passengerIds: data.map((p) => p.id),
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstIssue = error.issues[0];
      return {
        success: false,
        error: firstIssue?.message ?? 'Invalid passenger data',
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save passengers',
    };
  }
}

