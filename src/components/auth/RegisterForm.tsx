'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterInput } from '@/lib/validations/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Icons } from '@/components/icons';
import { VerifyOtpForm } from "@/components/auth/VerifyOtpForm";

interface RegisterFormProps {
  onSwitchToLogin?: () => void;
  callbackUrl?: string;
  defaultEmail?: string;
}

export function RegisterForm({ onSwitchToLogin, callbackUrl, defaultEmail }: RegisterFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState<string>("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);

    try {
      // 1. Registrar usuario y loguear
      const signInResult = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
        callbackUrl: callbackUrl || '/onboarding',
      });

      if (signInResult?.error) {
        throw new Error(signInResult.error);
      }

      toast.success('Registro exitoso', {
        description: 'Tu cuenta ha sido creada. Ahora verifica tu correo.',
      });

      setRegisteredEmail(data.email);
      setShowOtp(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al registrar el usuario';
      toast.error('Error', {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handler para cuando el OTP es verificado correctamente
  const handleOtpSuccess = () => {
    toast.success('Correo verificado', { description: 'Redirigiendo al onboarding...' });
    router.push('/onboarding');
    router.refresh();
  };

  if (showOtp) {
    return (
      <div className="grid gap-6">
        <h2 className="text-lg font-semibold text-center">Verifica tu correo electrónico</h2>
        <p className="text-sm text-muted-foreground text-center">Hemos enviado un código de verificación a <span className="font-medium">{registeredEmail}</span>. Ingresa el código para continuar.</p>
        <VerifyOtpForm onSuccess={handleOtpSuccess} defaultEmail={defaultEmail} />
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <div className="grid gap-1">
            <Label htmlFor="name">Nombre completo</Label>
            <Input
              id="name"
              placeholder="Juan Pérez"
              type="text"
              autoCapitalize="words"
              autoComplete="name"
              autoCorrect="off"
              disabled={isLoading}
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm font-medium text-destructive">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="grid gap-1">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              placeholder="nombre@ejemplo.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              {...register('email')}
            />
            {errors.email && (
              <p className="text-sm font-medium text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="grid gap-1">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              autoComplete="new-password"
              disabled={isLoading}
              {...register('password')}
            />
            {errors.password && (
              <p className="text-sm font-medium text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading && (
              <Icons.Route className="mr-2 h-4 w-4 animate-spin" />
            )}
            Crear cuenta
          </Button>
        </div>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            ¿Ya tienes una cuenta?
          </span>
        </div>
      </div>

      <a href="/login">
        <Button
          variant="outline"
          type="button"
          disabled={isLoading}
          onClick={onSwitchToLogin}
        >
          Iniciar sesión
        </Button>
      </a>
    </div>
  );
}
