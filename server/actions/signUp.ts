'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

const signUpSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  termsAccepted: z.boolean().refine((val) => val === true, 'You must accept the terms'),
});

export type SignUpResult = {
  success: boolean;
  error?: string;
};

function isJsonParseError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const message = error.message.toLowerCase();
  const stack = error.stack?.toLowerCase() || '';
  return (
    message.includes('doctype') ||
    message.includes('json') ||
    message.includes('unexpected token') ||
    message.includes('<') ||
    stack.includes('json.parse')
  );
}

async function validateSupabaseConnection() {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return {
        valid: false,
        error: 'Supabase configuration missing. Please check your environment variables.',
      };
    }

    const supabase = await createClient();
    const { error } = await supabase.from('flights').select('id').limit(1);
    
    if (error && error.code !== 'PGRST116') {
      return {
        valid: false,
        error: 'Cannot connect to database. Please check if your Supabase project is active.',
      };
    }
    return { valid: true };
  } catch (error) {
    if (isJsonParseError(error)) {
      return {
        valid: false,
        error: 'Authentication service configuration error. Please check: 1) Supabase project is active, 2) Supabase URL and keys are correct, 3) Project is not paused.',
      };
    }
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      valid: false,
      error: `Database connection failed: ${errorMessage}. Please verify your Supabase project is active.`,
    };
  }
}

export async function signUp(formData: FormData): Promise<SignUpResult> {
  try {
    const rawData = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      password: formData.get('password') as string,
      termsAccepted: formData.get('termsAccepted') === 'on',
    };

    const validated = signUpSchema.parse(rawData);

    const connectionCheck = await validateSupabaseConnection();
    if (!connectionCheck.valid) {
      return { success: false, error: connectionCheck.error };
    }

    const supabase = await createClient();

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    let authResult;
    try {
      authResult = await supabase.auth.signUp({
        email: validated.email,
        password: validated.password,
        options: {
          data: {
            first_name: validated.firstName,
            last_name: validated.lastName,
            phone: validated.phone || null,
            is_admin: true,
          },
          emailRedirectTo: `${siteUrl}/sign-in`,
        },
      });
    } catch (authError) {
      if (isJsonParseError(authError)) {
        return {
          success: false,
          error: 'Authentication service configuration error. Please check: 1) Supabase project is active, 2) Supabase URL and keys are correct, 3) Project is not paused.',
        };
      }
      const errorMessage = authError instanceof Error ? authError.message : String(authError);
      return {
        success: false,
        error: errorMessage || 'Failed to create account',
      };
    }

    if (authResult.error) {
      return {
        success: false,
        error: authResult.error.message,
      };
    }

    if (!authResult.data.user) {
      return {
        success: false,
        error: 'Failed to create account',
      };
    }

    try {
      const { error: adminError } = await supabase
        .from('admins')
        .insert({
          id: authResult.data.user.id,
          role: 'admin',
        });

      if (adminError) {
        // User is created but admin record failed - still return success
        // since user_metadata already has is_admin flag
      }
    } catch (adminError) {
      if (isJsonParseError(adminError)) {
        return {
          success: false,
          error: 'Authentication service configuration error. Please check your Supabase project settings.',
        };
      }
      // Continue even if admin insert fails
    }

    redirect('/sign-in');
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message ?? 'Invalid form data',
      };
    }

    if (error && typeof error === 'object' && 'digest' in error) {
      // Next.js redirect throws an error, this is expected
      throw error;
    }

    if (isJsonParseError(error)) {
      return {
        success: false,
        error: 'Authentication service configuration error. Please check: 1) Supabase project is active, 2) Supabase URL and keys are correct, 3) Project is not paused.',
      };
    }

    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      error: errorMessage || 'An unexpected error occurred',
    };
  }
}

