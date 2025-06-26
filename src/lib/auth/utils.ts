import { getServerSession } from 'next-auth';
import { authOptions } from './options';

declare module 'next-auth' {
  interface Session {
    update: (data: any) => Promise<any>;
  }
}

export async function update(data: any) {
  const session = await getServerSession(authOptions);
  if (session && typeof session.update === 'function') {
    return session.update(data);
  }
  return session;
}
