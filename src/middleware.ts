import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import logger from '@/lib/utils/logger';

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const token = await getToken({ req: request });
 
  // Permitir acceso libre a rutas públicas
  if (pathname.startsWith('/api/public/')) {
    logger.info({ pathname }, 'Acceso permitido a ruta pública');
    return NextResponse.next();
  }

  // Protect non-auth API routes
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth/')) {
    if (!token) {
      logger.warn({ pathname }, 'Intento de acceso a API protegida sin autenticación');
      return new NextResponse(
        JSON.stringify({ success: false, message: 'Authentication required' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    logger.info({ pathname, user: token?.email }, 'Acceso autenticado a API protegida');
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
    'api/public/events',
    '/events'
  ];

  // Redirect old /auth/ routes to /
  if (pathname.startsWith('/auth/')) {
    logger.info({ pathname }, 'Redirección de ruta /auth/ a /');
    const newUrl = new URL(pathname.replace('/auth', ''), request.url);
    return NextResponse.redirect(newUrl);
  }

  // Allow access to public pages
  if (publicPaths.some(path => pathname === path || pathname.startsWith(`${path}/`))) {
    logger.info({ pathname }, 'Acceso permitido a página pública');
    return NextResponse.next();
  }

  // Definición de roles y rutas protegidas
  const protectedRoutes: Record<string, string[]> = {
    '/dashboard': ['ORGANIZER', 'ADMIN'],
    '/admin': ['ADMIN'],
    // Agrega más rutas y roles según necesidad
  };

  // If no token, redirect protected pages to login
  if (!token) {
    logger.warn({ pathname }, 'Redirección a login por falta de autenticación');
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : ''));
    return NextResponse.redirect(loginUrl);
  }

  // --- Control de acceso por roles ---
  for (const route in protectedRoutes) {
    if (pathname.startsWith(route)) {
      const allowedRoles = protectedRoutes[route];
      if (!token.role || !allowedRoles.includes(token.role)) {
        logger.warn({ pathname, user: token.email, role: token.role }, 'Acceso denegado por rol insuficiente');
        // Si el usuario no tiene el rol adecuado, redirige a la página de acceso denegado
        return NextResponse.redirect(new URL('/forbidden', request.url));
      }
    }
  }

  // --- User is authenticated at this point ---

  // If authenticated, redirect from login/register to dashboard
  if (pathname === '/login' || pathname === '/register') {
    logger.info({ pathname, user: token.email }, 'Usuario autenticado intenta acceder a login/register, redirigiendo a dashboard');
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Handle onboarding flow
  if (token.onboardingCompleted === false && pathname !== '/onboarding') {
    logger.info({ pathname, user: token.email }, 'Redirigiendo a onboarding por perfil incompleto');
    return NextResponse.redirect(new URL('/onboarding', request.url));
  }

  if (token.onboardingCompleted === true && pathname === '/onboarding') {
    logger.info({ pathname, user: token.email }, 'Redirigiendo a dashboard, onboarding ya completado');
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  logger.info({ pathname, user: token.email }, 'Acceso permitido');
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images).*)',
  ],
};