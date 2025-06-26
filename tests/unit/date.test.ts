import { describe, test, expect } from 'vitest';
import {
  formatDate,
  formatTime,
  daysBetween,
  isToday,
  isFutureDate,
  getAge,
  formatDuration,
  toLocalISOString,
} from '@/lib/utils/date';

describe('Date Utils', () => {
  describe('formatDate', () => {
    test('should format date correctly', () => {
      const today = new Date();
      const result = formatDate(today);
      // Solo verificamos el año actual
      expect(result).toContain(today.getFullYear().toString());
    });

    test('should handle string dates', () => {
      const today = new Date();
      const dateStr = today.toISOString().split('T')[0];
      const result = formatDate(dateStr);
      expect(result).toContain(today.getFullYear().toString());
    });

    test('should handle timestamp', () => {
      const today = new Date();
      const timestamp = today.getTime();
      const result = formatDate(timestamp);
      expect(result).toContain(today.getFullYear().toString());
    });

    test('should use custom options', () => {
      const today = new Date();
      const result = formatDate(today, { 
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      expect(result).toContain(today.getFullYear().toString());
    });
  });

  describe('formatTime', () => {
    test('should format time correctly', () => {
      const testDate = new Date('2024-01-15T14:30:00');
      const result = formatTime(testDate);
      expect(result).toMatch(/^\d{2}:\d{2}$/);
    });

    test('should handle string dates', () => {
      const result = formatTime('2024-01-15T14:30:00');
      expect(result).toMatch(/^\d{2}:\d{2}$/);
    });
  });

  describe('daysBetween', () => {
    test('should calculate days between dates correctly', () => {
      const start = new Date();
      const end = new Date();
      end.setDate(start.getDate() + 2);
      expect(daysBetween(start, end)).toBe(2);
    });

    test('should handle string dates', () => {
      const start = new Date();
      const end = new Date();
      end.setDate(start.getDate() + 2);
      expect(daysBetween(start.toISOString(), end.toISOString())).toBe(2);
    });

    test('should use today as default end date', () => {
      const start = new Date();
      start.setDate(start.getDate() - 1);
      expect(daysBetween(start)).toBe(1);
    });

    test('should return negative for future dates', () => {
      const start = new Date();
      const end = new Date();
      start.setDate(start.getDate() + 1);
      expect(daysBetween(start, end)).toBe(-1);
    });
  });

  describe('isToday', () => {
    test('should return true for today', () => {
      const today = new Date();
      expect(isToday(today)).toBe(true);
    });

    test('should return false for other dates', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isToday(yesterday)).toBe(false);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(isToday(tomorrow)).toBe(false);
    });
  });

  describe('isFutureDate', () => {
    test('should return true for future dates', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(isFutureDate(tomorrow)).toBe(true);
    });

    test('should return false for past dates', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isFutureDate(yesterday)).toBe(false);
    });

    test('should return false for today', () => {
      const today = new Date();
      expect(isFutureDate(today)).toBe(false);
    });
  });

  describe('getAge', () => {
    test('should calculate age correctly', () => {
      const birthDate = new Date();
      birthDate.setFullYear(birthDate.getFullYear() - 25);
      expect(getAge(birthDate)).toBe(25);
    });

    test('should handle birthday not yet passed this year', () => {
      const birthDate = new Date();
      birthDate.setFullYear(birthDate.getFullYear() - 25);
      birthDate.setMonth(birthDate.getMonth() + 1); // Mes futuro
      expect(getAge(birthDate)).toBe(24);
    });

    test('should handle string dates', () => {
      const birthDate = new Date();
      birthDate.setFullYear(birthDate.getFullYear() - 30);
      const birthDateStr = birthDate.toISOString().split('T')[0];
      expect(getAge(birthDateStr)).toBe(30);
    });
  });

  describe('formatDuration', () => {
    test('should format seconds correctly', () => {
      expect(formatDuration(65)).toBe('1:05');
      expect(formatDuration(3661)).toBe('01:01:01');
      expect(formatDuration(30)).toBe('0:30');
    });

    test('should handle zero seconds', () => {
      expect(formatDuration(0)).toBe('0:00');
    });

    test('should handle large durations', () => {
      expect(formatDuration(7325)).toBe('02:02:05'); // 2h 2m 5s
    });
  });

  describe('toLocalISOString', () => {
    test('should convert date to local ISO string without timezone', () => {
      const testDate = new Date('2024-01-15T14:30:00.000Z');
      const result = toLocalISOString(testDate);
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/);
    });

    test('should not include Z or + in the string', () => {
      const testDate = new Date('2024-01-15T14:30:00.000Z');
      const result = toLocalISOString(testDate);
      expect(result).not.toContain('Z');
      expect(result).not.toContain('+');
    });
  });
}); 