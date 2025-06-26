import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth/options';
import { ProfileForm } from '@/components/onboarding/ProfileForm';

export const metadata: Metadata = {
  title: 'Completa tu perfil',
  description: 'Completa tu perfil para comenzar a usar Podium',
};

export default async function OnboardingPage() {
  const session = await getServerSession(authOptions);

  // Si el usuario no está autenticado, redirigir al login
  if (!session) {
    redirect('/login?callbackUrl=/onboarding');
  }

  // Si el usuario ya completó el onboarding, redirigir al dashboard
  if ((session.user as any).onboardingCompleted) {
    redirect('/dashboard');
  }

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          Podium
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
&quot;Podium ha transformado la forma en que gestionamos nuestras carreras. ¡Increíble herramienta!&quot;
            </p>
            <footer className="text-sm">María González</footer>
            <footer className="text-sm opacity-70">Organizadora de carreras</footer>
          </blockquote>
        </div>
      </div>
      
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Bienvenido a Podium
            </h1>
            <p className="text-sm text-muted-foreground">
              Completa tu perfil para comenzar a usar la plataforma
            </p>
          </div>
          
          <div className="rounded-md border bg-card p-6 shadow-sm">
            <ProfileForm />
          </div>
          
          <p className="px-8 text-center text-sm text-muted-foreground">
            Al completar tu perfil, aceptas nuestros{' '}
            <a
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Términos de servicio
            </a>{' '}
            y{' '}
            <a
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Política de privacidad
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
