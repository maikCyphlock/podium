"use client"

import { SessionProvider } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { ProfileForm } from '@/components/onboarding/ProfileForm';
import { toast } from 'sonner';
import type { ProfileInput } from '@/lib/validations/schemas';

export default function ProfilePage() {
  const [initialValues, setInitialValues] = useState<Partial<ProfileInput> | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/user/profile', { credentials: 'include' });
        const data = await res.json();
        if (res.ok && data.user?.profile) {
          setInitialValues(data.user.profile);
        } else {
          toast.error('Error al cargar el perfil', { description: data.error });
        }
      } catch (e) {
        toast.error('Error al cargar el perfil');
        console.error(e)
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
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
      toast.success('¡Perfil actualizado!', { description: 'Tu perfil ha sido guardado correctamente.' });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Error al guardar el perfil';
      toast.error('Error al guardar el perfil', { description: message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SessionProvider>
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Mi Perfil</h1>
      <ProfileForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        mode="profile"
      />
    </div>
    </SessionProvider>
  );
} 