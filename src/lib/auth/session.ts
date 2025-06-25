import { getServerSession } from 'next-auth/next';
import { authOptions } from './options';

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user || null;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error('No autenticado');
  }
  
  return user;
}

export async function requireRole(role: string) {
  const user = await requireAuth();
  
  if (user.role !== role && user.role !== 'ADMIN') {
    throw new Error('No autorizado');
  }
  
  return user;
}

export async function requireOrganizer() {
  return requireRole('ORGANIZER');
}

export async function requireAdmin() {
  return requireRole('ADMIN');
}
