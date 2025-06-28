'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema, type ProfileInput } from '@/lib/validations/schemas';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

export interface ProfileFormProps {
  initialValues?: Partial<ProfileInput>;
  onSubmit: (data: ProfileInput) => Promise<void>;
  isLoading?: boolean;
  mode?: 'onboarding' | 'profile';
}

export function ProfileForm({ initialValues, onSubmit, isLoading: externalIsLoading = false, mode = 'profile' }: ProfileFormProps) {
  const [date, setDate] = useState<Date | undefined>(
    initialValues?.birthDate ? new Date(initialValues.birthDate) : undefined
  );
  const [internalIsLoading, setInternalIsLoading] = useState(false);
  const router = useRouter();
  const { data: session, update } = useSession();  

  // Usar el loading externo o interno
  const isLoading = externalIsLoading || internalIsLoading;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
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
      ...initialValues,
    },
  });

  // Si cambian los initialValues, resetea el formulario
  useEffect(() => {
    if (initialValues) {
      reset({
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
        ...initialValues,
      });
      if (initialValues.birthDate) {
        setDate(new Date(initialValues.birthDate));
      }
    }
  }, [initialValues, reset]);

  const birthDate = watch('birthDate');
  const birthDateDate = birthDate ? new Date(birthDate) : undefined;

  const onSubmitForm = async (data: ProfileInput) => {
    if (!data.acceptTerms) {
      toast.error('Error', {
        description: 'Debes aceptar los términos y condiciones',
      });
      return;
    }
    
    setInternalIsLoading(true);

    try {
      await onSubmit(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al guardar el perfil';
      toast.error('Error', {
        description: errorMessage,
      });
    } finally {
      setInternalIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">
          {mode === 'onboarding' ? 'Completa tu perfil' : 'Editar perfil'}
        </h2>
        <p className="text-muted-foreground">
          {mode === 'onboarding'
            ? 'Necesitamos algunos datos adicionales para personalizar tu experiencia.'
            : 'Actualiza tu información personal.'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Nombres</Label>
            <Input
              id="firstName"
              placeholder="Juan"
              disabled={isLoading}
              {...register('firstName')}
            />
            {errors.firstName && (
              <p className="text-sm text-destructive">{errors.firstName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Apellidos</Label>
            <Input
              id="lastName"
              placeholder="Pérez"
              disabled={isLoading}
              {...register('lastName')}
            />
            {errors.lastName && (
              <p className="text-sm text-destructive">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Fecha de nacimiento</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !birthDateDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {birthDateDate ? format(birthDateDate, 'PPP', { locale: es }) : <span>Selecciona una fecha</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={birthDateDate}
                  onSelect={(date) => {
                    if (date) {
                      setDate(date);
                      setValue('birthDate', date.toISOString());
                    }
                  }}
                  initialFocus
                  disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                  locale={es}
                  captionLayout="dropdown"
                />
              </PopoverContent>
            </Popover>
            {errors.birthDate && (
              <p className="text-sm text-destructive">{errors.birthDate.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Género</Label>
            <Select
              onValueChange={(value) => setValue('gender', value as any)}
              defaultValue="PREFER_NOT_TO_SAY"
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona tu género" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MALE">Masculino</SelectItem>
                <SelectItem value="FEMALE">Femenino</SelectItem>
                <SelectItem value="OTHER">Otro</SelectItem>
                <SelectItem value="PREFER_NOT_TO_SAY">Prefiero no decirlo</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && (
              <p className="text-sm text-destructive">{errors.gender.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="country">País</Label>
            <Input
              id="country"
              placeholder="Venezuela"
              disabled={isLoading}
              {...register('country')}
            />
            {errors.country && (
              <p className="text-sm text-destructive">{errors.country.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">Ciudad</Label>
            <Input
              id="city"
              placeholder="Caracas"
              disabled={isLoading}
              {...register('city')}
            />
            {errors.city && (
              <p className="text-sm text-destructive">{errors.city.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              placeholder="+58 412 1234567"
              disabled={isLoading}
              {...register('phone')}
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergencyContact">Contacto de emergencia</Label>
            <Input
              id="emergencyContact"
              placeholder="Nombre completo"
              disabled={isLoading}
              {...register('emergencyContact')}
            />
            {errors.emergencyContact && (
              <p className="text-sm text-destructive">{errors.emergencyContact.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="emergencyPhone">Teléfono de emergencia</Label>
            <Input
              id="emergencyPhone"
              placeholder="+58 412 1234567"
              disabled={isLoading}
              {...register('emergencyPhone')}
            />
            {errors.emergencyPhone && (
              <p className="text-sm text-destructive">{errors.emergencyPhone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bloodType">Tipo de sangre</Label>
            <Select
              onValueChange={(value) => setValue('bloodType', value as any)}
              defaultValue="UNKNOWN"
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona tu tipo de sangre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A+">A+</SelectItem>
                <SelectItem value="A-">A-</SelectItem>
                <SelectItem value="B+">B+</SelectItem>
                <SelectItem value="B-">B-</SelectItem>
                <SelectItem value="AB+">AB+</SelectItem>
                <SelectItem value="AB-">AB-</SelectItem>
                <SelectItem value="O+">O+</SelectItem>
                <SelectItem value="O-">O-</SelectItem>
                <SelectItem value="UNKNOWN">No sé / Prefiero no decirlo</SelectItem>
              </SelectContent>
            </Select>
            {errors.bloodType && (
              <p className="text-sm text-destructive">{errors.bloodType.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="documentType">Tipo de documento</Label>
            <Select
              onValueChange={(value) => setValue('documentType', value as any)}
              defaultValue="DNI"
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el tipo de documento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DNI">Cédula</SelectItem>
                <SelectItem value="PASSPORT">Pasaporte</SelectItem>
                <SelectItem value="DRIVING_LICENSE">Licencia de conducir</SelectItem>
                <SelectItem value="OTHER">Otro</SelectItem>
              </SelectContent>
            </Select>
            {errors.documentType && (
              <p className="text-sm text-destructive">{errors.documentType.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="documentNumber">Número de documento</Label>
            <Input
              id="documentNumber"
              placeholder="12345678"
              disabled={isLoading}
              {...register('documentNumber')}
            />
            {errors.documentNumber && (
              <p className="text-sm text-destructive">{errors.documentNumber.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Dirección</Label>
          <Input
            id="address"
            placeholder="Calle, número, piso, apartamento"
            disabled={isLoading}
            {...register('address')}
          />
          {errors.address && (
            <p className="text-sm text-destructive">{errors.address.message}</p>
          )}
        </div>

        <div className="flex items-start space-x-2 pt-4">
          <div className="flex items-center h-5">
            <input
              type="checkbox"
              id="acceptTerms"
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              {...register('acceptTerms')}
            />
          </div>
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="acceptTerms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Acepto los{' '}
              <a href="/terms" className="text-primary hover:underline">
                Términos de servicio
              </a>{' '}
              y la{' '}
              <a href="/privacy" className="text-primary hover:underline">
                Política de privacidad
              </a>
            </label>
            <p className="text-sm text-muted-foreground">
              Al marcar esta casilla, aceptas nuestros términos y condiciones de uso.
            </p>
          </div>
        </div>
        {errors.acceptTerms && (
          <p className="text-sm text-destructive">{errors.acceptTerms.message}</p>
        )}

        <div className="pt-4">
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Guardando...' : 'Guardar perfil'}
          </Button>
        </div>
      </form>
    </div>
  );
}
