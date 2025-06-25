import { z } from 'zod';

/**
 * Valida un string que solo contiene letras y espacios
 */
export const nameSchema = z.string().min(2, 'Debe tener al menos 2 caracteres').regex(
  /^[\p{L}\s]+$/u,
  'Solo se permiten letras y espacios'
);

/**
 * Valida un email
 */
export const emailSchema = z.string().email('Email inválido');

/**
 * Valida una contraseña
 * - Mínimo 8 caracteres
 * - Al menos una letra mayúscula
 * - Al menos una letra minúscula
 * - Al menos un número
 * - Al menos un carácter especial
 */
export const passwordSchema = z.string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres')
  .regex(/[A-Z]/, 'Debe contener al menos una letra mayúscula')
  .regex(/[a-z]/, 'Debe contener al menos una letra minúscula')
  .regex(/[0-9]/, 'Debe contener al menos un número')
  .regex(/[^A-Za-z0-9]/, 'Debe contener al menos un carácter especial');

/**
 * Valida un número de teléfono
 * Acepta formatos internacionales
 */
export const phoneSchema = z.string().regex(
  /^\+?[\d\s-]{6,}$/,
  'Número de teléfono inválido'
);

/**
 * Valida un DNI o cédula (ejemplo para Venezuela)
 */
export const idNumberSchema = z.string().regex(
  /^[VE]-?\d{7,8}$/i,
  'Formato de cédula inválido (Ej: V-12345678 o E-1234567)'
);

/**
 * Valida una URL
 */
export const urlSchema = z.string().url('URL inválida');

/**
 * Valida un código postal
 */
export const postalCodeSchema = z.string().regex(
  /^\d{4,5}(-\d{4})?$/,
  'Código postal inválido'
);

/**
 * Valida un color en formato hexadecimal
 */
export const colorSchema = z.string().regex(
  /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
  'Color hexadecimal inválido (ej: #RRGGBB o #RGB)'
);

/**
 * Valida un precio (número positivo con 2 decimales)
 */
export const priceSchema = z.number().positive('El precio debe ser mayor a cero')
  .multipleOf(0.01, 'Máximo 2 decimales');

/**
 * Valida una cantidad (número entero positivo)
 */
export const quantitySchema = z.number().int('Debe ser un número entero')
  .nonnegative('No puede ser negativo');

/**
 * Valida un porcentaje (0-100)
 */
export const percentageSchema = z.number()
  .min(0, 'El porcentaje no puede ser menor a 0')
  .max(100, 'El porcentaje no puede ser mayor a 100');

/**
 * Valida una fecha futura
 */
export const futureDateSchema = z.date()
  .min(new Date(), 'La fecha debe ser futura');

/**
 * Valida que una fecha sea mayor que otra
 * @param minDate Fecha mínima permitida
 * @param message Mensaje de error personalizado
 */
export const dateAfter = (minDate: Date, message?: string) => 
  z.date().min(minDate, message || `La fecha debe ser posterior a ${minDate.toLocaleDateString()}`);

/**
 * Valida que una cadena contenga al menos un número
 */
export const containsNumberSchema = z.string().regex(
  /\d/,
  'Debe contener al menos un número'
);

/**
 * Valida que una cadena contenga al menos una letra mayúscula
 */
export const containsUppercaseSchema = z.string().regex(
  /[A-Z]/,
  'Debe contener al menos una letra mayúscula'
);

/**
 * Valida que una cadena contenga al menos un carácter especial
 */
export const containsSpecialCharSchema = z.string().regex(
  /[^\w\s]/,
  'Debe contener al menos un carácter especial'
);

/**
 * Valida un campo condicional basado en otro campo
 * @param fieldName Nombre del campo del que depende
 * @param condition Condición que debe cumplirse
 * @param schema Esquema a aplicar cuando se cumple la condición
 */
export const conditionalSchema = <T extends z.ZodTypeAny, V = unknown>(
  fieldName: string,
  condition: (val: V) => boolean,
  schema: T
) => z.object({
  [fieldName]: z.unknown().transform((val: unknown, ctx) => {
    const typedVal = val as V;
    if (condition(typedVal)) {
      const result = schema.safeParse(typedVal);
      if (!result.success) {
        result.error.errors.forEach((error) => {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: error.message,
            path: [fieldName, ...(error.path || [])],
          });
        });
      }
      return result.data;
    }
    return val;
  })
});
