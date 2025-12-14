import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerClient } from '@supabase/ssr';

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(request: NextRequest) {
  console.log('[SIGNIN API] Route handler called');
  
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  try {
    const formData = await request.formData();
    
    const rawData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    console.log('[SIGNIN API] Form data received:', {
      hasEmail: !!rawData.email,
      hasPassword: !!rawData.password,
    });

    const validated = signInSchema.parse(rawData);
    console.log('[SIGNIN API] Validation passed');
    
    let supabase;
    try {
      supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value, options }) => {
                request.cookies.set(name, value);
                response.cookies.set(name, value, options);
              });
            },
          },
        }
      );
      console.log('[SIGNIN API] Supabase client initialized');
    } catch (clientError) {
      console.error('[SIGNIN API] Failed to initialize Supabase client:', clientError);
      return NextResponse.json(
        {
          success: false,
          error: clientError instanceof Error ? clientError.message : 'Failed to initialize authentication service',
        },
        { status: 500 }
      );
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: validated.email,
      password: validated.password,
    });

    if (error) {
      console.error('[SIGNIN API] Supabase signin error:', error.message);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    if (!data.user) {
      console.error('[SIGNIN API] No user returned from Supabase');
      return NextResponse.json(
        { success: false, error: 'Failed to sign in' },
        { status: 400 }
      );
    }

    // Check if user exists in admins table
    const { data: admin } = await supabase
      .from('admins')
      .select('id')
      .eq('id', data.user.id)
      .single();

    // Fallback to user_metadata check for backward compatibility
    const isAdmin = admin !== null || data.user.user_metadata?.is_admin === true;

    if (!isAdmin) {
      console.warn('[SIGNIN API] Access denied - user is not admin:', data.user.id);
      return NextResponse.json(
        { success: false, error: 'Access denied. Admin privileges required.' },
        { status: 403 }
      );
    }

    console.log('[SIGNIN API] Success - User signed in:', data.user.id);
    return NextResponse.json({ success: true }, {
      headers: response.headers,
    });
  } catch (error) {
    console.error('[SIGNIN API] Unexpected error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0]?.message ?? 'Invalid form data' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

