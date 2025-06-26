import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').optional(),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  role: z.enum(['USER', 'ORGANIZER', 'ADMIN']).optional().default('USER'),
});

export const eventSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  description: z.string().optional(),
  date: z.string().datetime('Fecha inválida'),
  location: z.string().optional(),
  image: z.string().optional(),
  isPublished: z.boolean().optional().default(false),
  categoryIds: z.array(z.string().cuid()).optional(),
});

export const categorySchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  description: z.string().optional(),
});

export const raceSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  description: z.string().optional(),
  distance: z.number().positive('La distancia debe ser un número positivo'),
  unit: z.string().min(1, 'La unidad es requerida'),
  startTime: z.string().datetime('Hora de inicio inválida'),
  categoryIds: z.array(z.string().cuid()).min(1, 'Se requiere al menos una categoría'),
});

// Esquema base para la información de perfil
export const profileSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  birthDate: z.string().datetime('Fecha de nacimiento inválida'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'], {
    required_error: 'El género es requerido',
  }),
  country: z.string().min(2, 'El país es requerido'),
  city: z.string().min(2, 'La ciudad es requerida'),
  phone: z.string().min(8, 'El teléfono debe tener al menos 8 dígitos'),
  emergencyContact: z.string().min(2, 'El contacto de emergencia es requerido'),
  emergencyPhone: z.string().min(8, 'El teléfono de emergencia es requerido'),
  bloodType: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'UNKNOWN']).optional(),
  documentType: z.enum(['DNI', 'PASSPORT', 'DRIVING_LICENSE', 'OTHER']),
  documentNumber: z.string().min(4, 'El número de documento es requerido'),
  address: z.string().min(5, 'La dirección es requerida'),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'Debes aceptar los términos y condiciones',
  }),
});

export const participantSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  birthDate: z.string().datetime('Fecha de nacimiento inválida'),
  gender: z.string().min(1, 'El género es requerido'),
  country: z.string().min(2, 'El país es requerido'),
  city: z.string().optional(),
  phone: z.string().optional(),
  emergencyContact: z.string().optional(),
  bloodType: z.string().optional(),
});

export const resultSchema = z.object({
  time: z.string().min(1, 'El tiempo es requerido'),
  position: z.number().int('La posición debe ser un número entero').positive('La posición debe ser un número positivo'),
  bibNumber: z.string().min(1, 'El número de dorsal es requerido'),
  status: z.enum(['FINISHED', 'DNF', 'DNS', 'DSQ']).default('FINISHED'),
  notes: z.string().optional(),
  raceId: z.string().cuid('ID de carrera inválido'),
  categoryId: z.string().cuid('ID de categoría inválido'),
  participantId: z.string().cuid('ID de participante inválido'),
});

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

export const registerSchema = userSchema.pick({
  name: true,
  email: true,
  password: true,
});

// Tipos exportados para usar en la aplicación
export type UserInput = z.infer<typeof userSchema>;
export type EventInput = z.infer<typeof eventSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type RaceInput = z.infer<typeof raceSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type ParticipantInput = z.infer<typeof participantSchema>;
export type ResultInput = z.infer<typeof resultSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
