/**
 * Utilidades para manejo de fechas en la aplicación
 */

/**
 * Formatea una fecha en formato legible
 * @param date Fecha a formatear (string, Date o timestamp)
 * @param options Opciones de formato
 * @returns Fecha formateada como string
 */
export function formatDate(
  date: string | Date | number,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date;

  return new Intl.DateTimeFormat('es-ES', {
    timeZone: 'America/Caracas',
    ...options,
  }).format(dateObj);
}

/**
 * Formatea una hora en formato legible
 * @param date Fecha u hora a formatear
 * @returns Hora formateada (HH:MM)
 */
export function formatTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleTimeString('es-VE', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'America/Caracas',
  });
}

/**
 * Calcula la diferencia en días entre dos fechas
 * @param start Fecha de inicio
 * @param end Fecha de fin (por defecto: hoy)
 * @returns Número de días de diferencia
 */
export function daysBetween(start: Date | string, end: Date | string = new Date()): number {
  const startDate = typeof start === 'string' ? new Date(start) : start;
  const endDate = typeof end === 'string' ? new Date(end) : end;
  
  // Ajustar ambas fechas a la medianoche para comparar solo días
  const startUTC = Date.UTC(
    startDate.getFullYear(), 
    startDate.getMonth(), 
    startDate.getDate()
  );
  
  const endUTC = Date.UTC(
    endDate.getFullYear(), 
    endDate.getMonth(), 
    endDate.getDate()
  );
  
  const diffMs = endUTC - startUTC;
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Verifica si una fecha es hoy
 * @param date Fecha a verificar
 * @returns true si es hoy, false en caso contrario
 */
export function isToday(date: Date | string): boolean {
  const today = new Date();
  const checkDate = typeof date === 'string' ? new Date(date) : date;
  
  return (
    checkDate.getDate() === today.getDate() &&
    checkDate.getMonth() === today.getMonth() &&
    checkDate.getFullYear() === today.getFullYear()
  );
}

/**
 * Verifica si una fecha es futura
 * @param date Fecha a verificar
 * @returns true si es futura, false en caso contrario
 */
export function isFutureDate(date: Date | string): boolean {
  const checkDate = typeof date === 'string' ? new Date(date) : date;
  return checkDate > new Date();
}

/**
 * Obtiene la edad a partir de una fecha de nacimiento
 * @param birthDate Fecha de nacimiento
 * @returns Edad en años
 */
export function getAge(birthDate: Date | string): number {
  const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  const today = new Date();
  
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Formatea la duración en segundos a un formato legible (HH:MM:SS)
 * @param seconds Duración en segundos
 * @returns Duración formateada
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  const parts = [];
  
  if (hours > 0) {
    parts.push(hours.toString().padStart(2, '0'));
  }
  
  parts.push(
    minutes.toString().padStart(hours > 0 ? 2 : 1, '0'),
    secs.toString().padStart(2, '0')
  );
  
  return parts.join(':');
}

/**
 * Convierte un objeto Date a un string en formato ISO sin la zona horaria
 * @param date Fecha a convertir
 * @returns String en formato ISO sin zona horaria (YYYY-MM-DDTHH:MM:SS)
 */
export function toLocalISOString(date: Date): string {
  const tzOffset = date.getTimezoneOffset() * 60000; // offset in milliseconds
  const localISOTime = new Date(date.getTime() - tzOffset).toISOString();
  return localISOTime.slice(0, 19); // Remove timezone and milliseconds
}
