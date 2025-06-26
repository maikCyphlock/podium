import Link from 'next/link';
import { Metadata } from 'next';
import { RegisterForm } from '@/components/auth/RegisterForm';
import {Icons} from '@/components/icons';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Crear cuenta',
  description: 'Crea una cuenta en Podium',
};

interface RegisterPageProps {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const { callbackUrl, error } = await searchParams;
  
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute left-4 top-4 md:left-8 md:top-8'
        )}
      >
        <Icons.ChevronLeft className="mr-2 h-4 w-4" />
        Volver
      </Link>
      
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <Icons.PersonStanding className="mx-auto h-6 w-6" />
          <h1 className="text-2xl font-semibold tracking-tight">
            Crea tu cuenta
          </h1>
          <p className="text-sm text-muted-foreground">
            &quot;Podium ha transformado la forma en que gestionamos nuestras carreras. ¡Increíble herramienta!&quot;
          </p>
        </div>
        
        <RegisterForm callbackUrl={callbackUrl} />
        
        {error && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {error === 'RegistrationError'
              ? 'Error al crear la cuenta. Por favor, intenta de nuevo.'
              : 'Ocurrió un error al crear la cuenta. Por favor, intenta de nuevo.'}
          </div>
        )}
        
        <p className="px-8 text-center text-sm text-muted-foreground">
          Al hacer clic en "Crear cuenta", aceptas nuestros{' '}
          <Link
            href="/terms"
            className="hover:text-brand underline underline-offset-4"
          >
            Términos de servicio
          </Link>{' '}
          y{' '}
          <Link
            href="/privacy"
            className="hover:text-brand underline underline-offset-4"
          >
            Política de privacidad
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
