"use client";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { ProfileForm } from '@/components/onboarding/ProfileForm';
import { toast } from 'sonner';
import type { ProfileInput } from '@/lib/validations/schemas';

export default function OnboardingPageClient() {
  const router = useRouter();
  const { data: session, update: updateSession } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [initialValues, setInitialValues] = useState<Partial<ProfileInput> | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Cargar datos del perfil al montar el componente
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetch('/api/user/profile');
        if (res.ok) {
          const data = await res.json();
          if (data.user?.profile) {
            // Mapear los datos del perfil a initialValues
            setInitialValues({
              firstName: data.user.profile.firstName || '',
              lastName: data.user.profile.lastName || '',
              birthDate: data.user.profile.birthDate || new Date().toISOString(),
              gender: data.user.profile.gender || 'PREFER_NOT_TO_SAY',
              country: data.user.profile.country || 'Venezuela',
              city: data.user.profile.city || '',
              phone: data.user.profile.phone || '',
              emergencyContact: data.user.profile.emergencyContact || '',
              emergencyPhone: data.user.profile.emergencyPhone || '',
              bloodType: data.user.profile.bloodType || 'UNKNOWN',
              documentType: data.user.profile.documentType || 'DNI',
              documentNumber: data.user.profile.documentNumber || '',
              address: data.user.profile.address || '',
              acceptTerms: false, // Siempre false para onboarding
            });
          } else {
            // Si no hay perfil, usar valores por defecto
            setInitialValues({
              firstName: '',
              lastName: '',
              birthDate: new Date().toISOString(),
              gender: 'PREFER_NOT_TO_SAY',
              country: 'Venezuela',
              city: '',
              phone: '',
              emergencyContact: '',
              emergencyPhone: '',
              bloodType: 'UNKNOWN',
              documentType: 'DNI',
              documentNumber: '',
              address: '',
              acceptTerms: false,
            });
          }
        }
      } catch (error) {
        console.error('Error cargando perfil:', error);
        // En caso de error, usar valores por defecto
        setInitialValues({
          firstName: '',
          lastName: '',
          birthDate: new Date().toISOString(),
          gender: 'PREFER_NOT_TO_SAY',
          country: 'Venezuela',
          city: '',
          phone: '',
          emergencyContact: '',
          emergencyPhone: '',
          bloodType: 'UNKNOWN',
          documentType: 'DNI',
          documentNumber: '',
          address: '',
          acceptTerms: false,
        });
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, []);

  const handleSubmit = async (formData: ProfileInput) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, birthDate: new Date(formData.birthDate).toISOString() }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al guardar el perfil');
      
      // Forzar la actualización de la sesión
      await updateSession({
        ...session,
        user: {
          ...session?.user,
          onboardingCompleted: true,
          name: data.user.name,
        }
      });
      
      toast.success('¡Perfil actualizado!', { description: 'Tu perfil ha sido guardado correctamente.' });
      
      // Pequeño delay para asegurar que la sesión se actualice
      setTimeout(() => {
        router.push('/dashboard');
      }, 100);
      
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Error al guardar el perfil';
      toast.error('Error al guardar el perfil', { description: message });
    } finally {
      setIsLoading(false);
    }
  };

  // Mostrar loading mientras se cargan los datos
  if (loadingProfile) {
    return (
      <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
            <div className="text-center">
              <p>Cargando datos del perfil...</p>
            </div>
          </div>
        </div>
      </div>
    );
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
            <ProfileForm
              initialValues={initialValues || {}}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              mode="onboarding"
            />
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