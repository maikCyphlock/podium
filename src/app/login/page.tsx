import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth/options';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Iniciar sesión',
  description: 'Inicia sesión en tu cuenta de Podium',
};

interface LoginPageProps {
  searchParams: { callbackUrl?: string; error?: string };
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await getServerSession(authOptions);
  const { callbackUrl, error } = searchParams;

  // If user is already logged in, redirect to dashboard or callback URL
  if (session) {
    redirect(callbackUrl || '/dashboard');
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Iniciar sesión
          </h1>
          <p className="text-sm text-muted-foreground">
            Ingresa tus credenciales para acceder a tu cuenta
          </p>
        </div>
        <LoginForm callbackUrl={callbackUrl} />
        {error && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {error === 'CredentialsSignin'
              ? 'Credenciales inválidas. Por favor, intenta de nuevo.'
              : 'Ocurrió un error al iniciar sesión. Por favor, intenta de nuevo.'}
          </div>
        )}
      </div>
    </div>
  );
}
