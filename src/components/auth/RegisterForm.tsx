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

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
  callbackUrl?: string;
}

export function RegisterForm({ onSuccess, onSwitchToLogin, callbackUrl }: RegisterFormProps) {
  const [isLoading, setIsLoading] = useState(false);
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
      // 1. Register the user
      const registerResponse = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const registerResult = await registerResponse.json();

      if (!registerResponse.ok) {
        throw new Error(registerResult.error || 'Error al registrar el usuario');
      }

      // 2. Sign in the user automatically after registration
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
        description: 'Tu cuenta ha sido creada correctamente. Redirigiendo...',
      });

      // 3. Redirect to onboarding or success callback
      if (onSuccess) {
        onSuccess();
      } else if (signInResult?.url) {
        router.push(signInResult.url);
        router.refresh();
      } else {
        router.push('/onboarding');
        router.refresh();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al registrar el usuario';
      toast.error('Error', {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

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
