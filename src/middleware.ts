import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = await getToken({ req: request });

  // Rutas públicas que no requieren autenticación
  const publicPaths = [
    '/',
    '/auth/signin',
    '/auth/signup',
    '/auth/error',
    '/api/auth',
    '/api/events',
    '/api/categories',
  ];

  // Si la ruta es pública, permitir el acceso
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Si no hay token, redirigir al login
  if (!token) {
    const loginUrl = new URL('/auth/signin', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Rutas de administración que requieren rol de ADMIN
  const adminPaths = ['/admin'];
  if (adminPaths.some(path => pathname.startsWith(path)) && token.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  // Rutas de organizador que requieren rol de ORGANIZER o ADMIN
  const organizerPaths = ['/dashboard', '/events/create'];
  if (
    organizerPaths.some(path => pathname.startsWith(path)) &&
    !['ORGANIZER', 'ADMIN'].includes(token.role)
  ) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images).*)',
  ],
};
