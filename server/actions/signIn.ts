'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type SignInResult = {
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

export async function signIn(formData: FormData): Promise<SignInResult> {
  try {
    const rawData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    const validated = signInSchema.parse(rawData);

    const mockAuthEnabled = process.env.MOCK_ADMIN_AUTH === 'true';
    if (mockAuthEnabled) {
      const redirectToRaw = formData.get('redirectTo') as string | null;
      const redirectTo = redirectToRaw && redirectToRaw.startsWith('/') ? redirectToRaw : '/admin/home';
      const cookieStore = await cookies();
      cookieStore.set('mock_admin', 'true', {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
      });
      redirect(redirectTo);
    }

    const connectionCheck = await validateSupabaseConnection();
    if (!connectionCheck.valid) {
      return { success: false, error: connectionCheck.error };
    }

    const supabase = await createClient();

    let authResult;
    try {
      authResult = await supabase.auth.signInWithPassword({
        email: validated.email,
        password: validated.password,
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
        error: errorMessage || 'Failed to sign in',
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
        error: 'Failed to sign in',
      };
    }

    let admin;
    try {
      const { data } = await supabase
        .from('admins')
        .select('id')
        .eq('id', authResult.data.user.id)
        .single();
      admin = data;
    } catch (adminError) {
      if (isJsonParseError(adminError)) {
        return {
          success: false,
          error: 'Authentication service configuration error. Please check your Supabase project settings.',
        };
      }
      // If admin table query fails, continue with user_metadata check
      admin = null;
    }

    const isAdmin = admin !== null || authResult.data.user.user_metadata?.is_admin === true;

    if (!isAdmin) {
      return {
        success: false,
        error: 'Access denied. Admin privileges required.',
      };
    }

    redirect('/admin');
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

