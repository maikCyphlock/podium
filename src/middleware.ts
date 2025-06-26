import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const token = await getToken({ req: request });

  // Protect non-auth API routes
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth/')) {
    if (!token) {
      return new NextResponse(
        JSON.stringify({ success: false, message: 'Authentication required' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    // If token exists, proceed to the API route which should handle its own authorization
    return NextResponse.next();
  }

  // Public page paths
  const publicPaths = [
    '/',
    '/login',
    '/register',
    '/api/auth',
    '/_next',
    '/favicon.ico',
  ];

  // Redirect old /auth/ routes to /
  if (pathname.startsWith('/auth/')) {
    const newUrl = new URL(pathname.replace('/auth', ''), request.url);
    return NextResponse.redirect(newUrl);
  }

  // Allow access to public pages
  if (publicPaths.some(path => pathname === path || pathname.startsWith(`${path}/`))) {
    return NextResponse.next();
  }

  // If no token, redirect protected pages to login
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : ''));
    return NextResponse.redirect(loginUrl);
  }

  // --- User is authenticated at this point ---

  // If authenticated, redirect from login/register to dashboard
  if (pathname === '/login' || pathname === '/register') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Handle onboarding flow
  if (token.onboardingCompleted === false && pathname !== '/onboarding') {
    return NextResponse.redirect(new URL('/onboarding', request.url));
  }

  if (token.onboardingCompleted === true && pathname === '/onboarding') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images).*)',
  ],
};