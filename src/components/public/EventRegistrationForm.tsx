"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { participantSchema, type ParticipantInput } from "@/lib/validations/schemas";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

interface EventRegistrationFormProps {
  slug: string;
}

export function EventRegistrationForm({ slug }: EventRegistrationFormProps) {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [userCount, setUserCount] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ParticipantInput>({
    resolver: zodResolver(participantSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      birthDate: "",
      gender: "",
      country: "",
      city: "",
      phone: "",
      emergencyContact: "",
      bloodType: "",
    },
  });

  // Consultar cuántas inscripciones tiene el usuario autenticado
  useEffect(() => {
    if (!userId) return;
    fetch(`/api/public/participants/count?userId=${userId}`)
      .then(res => res.json())
      .then(data => setUserCount(data.count))
      .catch(() => setUserCount(null));
  }, [userId]);

  const onSubmit = async (data: ParticipantInput) => {
    setIsLoading(true);
    try {
      const birthDateISO = data.birthDate ? new Date(data.birthDate).toISOString() : "";
      const payload = { ...data, birthDate: birthDateISO };
      const res = await fetch(`/api/public/events/${slug}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (res.ok) {
        toast.success("¡Inscripción exitosa!", { description: "Te has inscrito correctamente en el evento." });
        setSuccess(true);
        reset();
        // Actualizar el contador tras inscribirse
        if (userId) {
          setUserCount((prev) => (typeof prev === 'number' ? prev + 1 : null));
        }
      } else {
        toast.error("Error", { description: result.error || "No se pudo inscribir" });
      }
    } catch (error) {
      toast.error("Error", { description: "No se pudo inscribir" });
      console.error(error)
    } finally {
      setIsLoading(false);
    }
  };

  const genderOptions = [
    { value: "MALE", label: "Masculino" },
    { value: "FEMALE", label: "Femenino" },
    { value: "PREFER_NOT_TO_SAY", label: "Prefiero no decirlo" },
  ];
  const bloodTypeOptions = [
    { value: "A+", label: "A+" },
    { value: "A-", label: "A-" },
    { value: "B+", label: "B+" },
    { value: "B-", label: "B-" },
    { value: "AB+", label: "AB+" },
    { value: "AB-", label: "AB-" },
    { value: "O+", label: "O+" },
    { value: "O-", label: "O-" },
    { value: "UNKNOWN", label: "Desconocido" },
  ];

  if (success) {
    return (
      <div className="p-4 rounded bg-green-50 text-green-800 text-center">
        ¡Te has inscrito correctamente en el evento!
      </div>
    );
  }

  if (userId && userCount !== null && userCount >= 5) {
    return (
      <div className="p-4 rounded bg-yellow-50 text-yellow-800 text-center">
        Has alcanzado el <b>límite de 5 inscripciones</b> por cuenta.<br />
        No puedes inscribirte en más eventos.
      </div>
    );
  }

  return (
    <form className="space-y-4 max-w-lg mx-auto" onSubmit={handleSubmit(onSubmit)}>
      <h3 className="text-lg font-semibold text-center mb-2">Inscríbete en este evento</h3>
      {userId && userCount !== null && (
        <div className="text-sm text-center mb-2 text-muted-foreground">
          Inscripciones usadas: <b>{userCount}</b> / 5
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium mb-1">Nombre</label>
          <Input id="firstName" {...register("firstName")}
            placeholder="Nombre"
            disabled={isLoading}
          />
          {errors.firstName && <p className="text-xs text-destructive">{errors.firstName.message}</p>}
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium mb-1">Apellido</label>
          <Input id="lastName" {...register("lastName")}
            placeholder="Apellido"
            disabled={isLoading}
          />
          {errors.lastName && <p className="text-xs text-destructive">{errors.lastName.message}</p>}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">Correo electrónico</label>
          <Input id="email" {...register("email")}
            placeholder="Correo electrónico"
            type="email"
            disabled={isLoading}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="birthDate" className="block text-sm font-medium mb-1">Fecha de nacimiento</label>
          <Input
            id="birthDate"
            type="date"
            {...register("birthDate", {
              setValueAs: (value) => value ? new Date(value).toISOString() : ""
            })}
            disabled={isLoading}
          />
          {errors.birthDate && <p className="text-xs text-destructive">{errors.birthDate.message}</p>}
        </div>
        <div>
          <label htmlFor="gender" className="block text-sm font-medium mb-1">Género</label>
          <select id="gender" {...register("gender")}
            className="w-full border rounded px-3 py-2 text-sm"
            disabled={isLoading}
          >
            <option value="">Selecciona una opción</option>
            {genderOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {errors.gender && <p className="text-xs text-destructive">{errors.gender.message}</p>}
        </div>
        <div>
          <label htmlFor="country" className="block text-sm font-medium mb-1">País</label>
          <Input id="country" {...register("country")}
            placeholder="País"
            disabled={isLoading}
          />
          {errors.country && <p className="text-xs text-destructive">{errors.country.message}</p>}
        </div>
        <div>
          <label htmlFor="city" className="block text-sm font-medium mb-1">Ciudad (opcional)</label>
          <Input id="city" {...register("city")}
            placeholder="Ciudad (opcional)"
            disabled={isLoading}
          />
          {errors.city && <p className="text-xs text-destructive">{errors.city.message}</p>}
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-1">Teléfono (opcional)</label>
          <Input id="phone" {...register("phone")}
            placeholder="Teléfono (opcional)"
            disabled={isLoading}
          />
          {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
        </div>
        <div>
          <label htmlFor="emergencyContact" className="block text-sm font-medium mb-1">Contacto de emergencia (opcional)</label>
          <Input id="emergencyContact" {...register("emergencyContact")}
            placeholder="Contacto de emergencia (opcional)"
            disabled={isLoading}
          />
          {errors.emergencyContact && <p className="text-xs text-destructive">{errors.emergencyContact.message}</p>}
        </div>
        <div>
          <label htmlFor="bloodType" className="block text-sm font-medium mb-1">Tipo de sangre (opcional)</label>
          <select id="bloodType" {...register("bloodType")}
            className="w-full border rounded px-3 py-2 text-sm"
            disabled={isLoading}
          >
            <option value="">Selecciona una opción</option>
            {bloodTypeOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {errors.bloodType && <p className="text-xs text-destructive">{errors.bloodType.message}</p>}
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading || (userId && userCount !== null && userCount >= 5)|| false}>
        {isLoading ? "Enviando..." : "Inscribirse"}
      </Button>
    </form>
  );
} 