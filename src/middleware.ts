import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const token = await getToken({ req: request });
  
  // Public paths that don't require authentication
  const publicPaths = [
    '/',
    '/login',
    '/register',
    '/api/auth',
    '/_next',
    '/favicon.ico',
  ];
  
  // Allow all API routes to handle their own authentication
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Redirect old auth routes
  if (pathname.startsWith('/auth/')) {
    const newUrl = new URL(pathname.replace('/auth', ''), request.url);
    return NextResponse.redirect(newUrl);
  }

  // Allow access to public paths
  if (publicPaths.some(path => 
    pathname === path || 
    pathname.startsWith(`${path}/`) ||
    pathname.startsWith('/_next/')
  )) {
    return NextResponse.next();
  }

  // If no token, redirect to login with return URL (only for non-API routes)
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : ''));
    return NextResponse.redirect(loginUrl);
  }

  // If authenticated but trying to access login/register, redirect to dashboard
  if (pathname === '/login' || pathname === '/register') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If onboarding not completed, redirect to onboarding
  if (!token.onboardingCompleted && pathname !== '/onboarding') {
    return NextResponse.redirect(new URL('/onboarding', request.url));
  }

  // If onboarding completed but trying to access onboarding, redirect to dashboard
  if (token.onboardingCompleted && pathname === '/onboarding') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images).*)',
  ],
};