import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  
  const isAuthRoute = pathname.includes('/admin/sign-in') || pathname.includes('/admin/sign-up');
  
  if (isAuthRoute) {
    return <>{children}</>;
  }

  // TODO: Remove this bypass when sign-in/sign-up is ready
  const bypassAuth = process.env.BYPASS_ADMIN_AUTH === 'true';
  
  if (bypassAuth) {
    return <>{children}</>;
  }

  const mockAuthEnabled = process.env.MOCK_ADMIN_AUTH === 'true';
  if (mockAuthEnabled) {
    const cookieStore = await cookies();
    const mockAdmin = cookieStore.get('mock_admin')?.value;
    if (mockAdmin === 'true') {
      return <>{children}</>;
    }
    redirect(`/sign-in?redirect=${encodeURIComponent('/admin/home')}`);
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/sign-in?redirect=${encodeURIComponent('/admin/home')}`);
  }

  // Check if user exists in admins table
  const { data: admin } = await supabase
    .from('admins')
    .select('id, role')
    .eq('id', user.id)
    .single();

  // Fallback to user_metadata check for backward compatibility
  const isAdmin = admin !== null || user.user_metadata?.is_admin === true;

  if (!isAdmin) {
    redirect('/sign-in?error=unauthorized');
  }

  return <>{children}</>;
}

