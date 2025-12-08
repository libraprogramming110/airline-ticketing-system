'use server';

import { processPayment } from '@/server/services/bookingService';
import { z } from 'zod';

const processPaymentSchema = z.object({
  bookingId: z.string().uuid('Invalid booking ID'),
  paymentMethod: z.string().min(1, 'Payment method is required'),
});

export async function processPaymentAction(formData: FormData) {
  try {
    const rawData = {
      bookingId: formData.get('bookingId') as string,
      paymentMethod: formData.get('paymentMethod') as string,
    };

    const validated = processPaymentSchema.parse(rawData);

    await processPayment(validated.bookingId, validated.paymentMethod);

    return {
      success: true,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstIssue = error.issues[0];
      return {
        success: false,
        error: firstIssue?.message ?? 'Invalid payment details',
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process payment',
    };
  }
}





