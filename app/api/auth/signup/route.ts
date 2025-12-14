import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerClient } from '@supabase/ssr';

const signUpSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  termsAccepted: z.boolean().refine((val) => val === true, 'You must accept the terms'),
});

export async function POST(request: NextRequest) {
  console.log('[SIGNUP API] Route handler called');
  
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  try {
    const formData = await request.formData();
    
    const rawData = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      password: formData.get('password') as string,
      termsAccepted: formData.get('termsAccepted') === 'on',
    };

    console.log('[SIGNUP API] Form data received:', {
      hasFirstName: !!rawData.firstName,
      hasLastName: !!rawData.lastName,
      hasEmail: !!rawData.email,
      hasPassword: !!rawData.password,
      termsAccepted: rawData.termsAccepted,
    });

    const validated = signUpSchema.parse(rawData);
    console.log('[SIGNUP API] Validation passed');
    
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
      console.log('[SIGNUP API] Supabase client initialized');
    } catch (clientError) {
      console.error('[SIGNUP API] Failed to initialize Supabase client:', clientError);
      return NextResponse.json(
        {
          success: false,
          error: clientError instanceof Error ? clientError.message : 'Failed to initialize authentication service',
        },
        { status: 500 }
      );
    }
    
    console.log('[SIGNUP API] About to call Supabase auth.signUp()');
    console.log('[SIGNUP API] Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('[SIGNUP API] Has anon key:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    
    // Test Supabase connection first
    try {
      const { error: healthError } = await supabase
        .from('flights')
        .select('id')
        .limit(1);
      
      if (healthError && healthError.code !== 'PGRST116') {
        console.error('[SIGNUP API] Supabase connection test failed:', healthError);
        return NextResponse.json(
          {
            success: false,
            error: 'Cannot connect to database. Please check if your Supabase project is active.',
          },
          { status: 500 }
        );
      }
      console.log('[SIGNUP API] Supabase connection test passed');
    } catch (connectionError) {
      console.error('[SIGNUP API] Connection test exception:', connectionError);
      return NextResponse.json(
        {
          success: false,
          error: 'Database connection failed. Please verify your Supabase project is active and credentials are correct.',
        },
        { status: 500 }
      );
    }
    
    let data, error;
    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
      const result = await supabase.auth.signUp({
        email: validated.email,
        password: validated.password,
        options: {
          data: {
            first_name: validated.firstName,
            last_name: validated.lastName,
            phone: validated.phone || null,
            is_admin: true,
          },
          emailRedirectTo: `${siteUrl}/admin/sign-in`,
        },
      });
      
      data = result.data;
      error = result.error;
      
      console.log('[SIGNUP API] Supabase call completed');
      console.log('[SIGNUP API] Result has error:', !!error);
      console.log('[SIGNUP API] Result has data:', !!data);
      console.log('[SIGNUP API] Result has user:', !!data?.user);
      
      if (error) {
        console.error('[SIGNUP API] Supabase returned error object:', {
          message: error.message,
          status: error.status,
          name: error.name,
          cause: error.cause,
        });
        
        // Log full error for debugging
        if (error.message.includes('DOCTYPE') || error.message.includes('JSON')) {
          console.error('[SIGNUP API] HTML response detected - This is a Supabase configuration issue.');
          console.error('REQUIRED FIX: Go to Supabase Dashboard > Authentication > URL Configuration');
          console.error('  1. Set Site URL to: http://localhost:3000');
          console.error('  2. Add Redirect URL: http://localhost:3000/**');
          console.error('  3. Save and try again');
          console.error('Current Site URL in env:', process.env.NEXT_PUBLIC_SITE_URL || 'NOT SET');
        }
      }
    } catch (supabaseException) {
      const errorMessage = supabaseException instanceof Error ? supabaseException.message : String(supabaseException);
      
      console.error('[SIGNUP API] Supabase call threw exception:', {
        name: supabaseException instanceof Error ? supabaseException.name : 'Unknown',
        message: errorMessage,
        stack: supabaseException instanceof Error ? supabaseException.stack : undefined,
      });
      
      // Check if it's the HTML/JSON parsing error
      if (errorMessage.includes('DOCTYPE') || errorMessage.includes('JSON')) {
        return NextResponse.json(
          {
            success: false,
            error: 'Authentication service configuration error. Please check: 1) Supabase project is active, 2) Email confirmation settings in Supabase Dashboard',
          },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        {
          success: false,
          error: errorMessage || 'Supabase call failed with exception',
        },
        { status: 500 }
      );
    }

    if (error) {
      console.error('[SIGNUP API] Supabase signup error:', error.message);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    if (!data.user) {
      console.error('[SIGNUP API] No user returned from Supabase');
      return NextResponse.json(
        { success: false, error: 'Failed to create account' },
        { status: 400 }
      );
    }

    // Insert into admins table
    const { error: adminError } = await supabase
      .from('admins')
      .insert({
        id: data.user.id,
        role: 'admin',
      });

    if (adminError) {
      console.error('[SIGNUP API] Failed to create admin record:', adminError);
      // User is created but admin record failed - still return success
      // since user_metadata already has is_admin flag
      // Admin record can be created manually if needed
    }

    console.log('[SIGNUP API] Success - User created:', data.user.id);
    return NextResponse.json({ success: true }, {
      headers: response.headers,
    });
  } catch (error) {
    console.error('[SIGNUP API] Unexpected error:', error);
    
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

