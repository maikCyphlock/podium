import { describe, test, expect } from 'vitest';
import {
  nameSchema,
  emailSchema,
  passwordSchema,
  phoneSchema,
  idNumberSchema,
  urlSchema,
  postalCodeSchema,
  colorSchema,
  priceSchema,
  quantitySchema,
  percentageSchema,
  futureDateSchema,
  containsNumberSchema,
  containsUppercaseSchema,
  containsSpecialCharSchema,
} from '@/lib/utils/validation';

describe('Validation Schemas', () => {
  describe('nameSchema', () => {
    test('should validate correct names', () => {
      expect(nameSchema.safeParse('Juan Pérez').success).toBe(true);
      expect(nameSchema.safeParse('María José').success).toBe(true);
      expect(nameSchema.safeParse('José María').success).toBe(true);
    });

    test('should reject names with numbers', () => {
      expect(nameSchema.safeParse('Juan123').success).toBe(false);
      expect(nameSchema.safeParse('María 123').success).toBe(false);
    });

    test('should reject names that are too short', () => {
      expect(nameSchema.safeParse('J').success).toBe(false);
      expect(nameSchema.safeParse('').success).toBe(false);
    });

    test('should reject names with special characters', () => {
      expect(nameSchema.safeParse('Juan@Pérez').success).toBe(false);
      expect(nameSchema.safeParse('María#José').success).toBe(false);
    });
  });

  describe('emailSchema', () => {
    test('should validate correct emails', () => {
      expect(emailSchema.safeParse('test@example.com').success).toBe(true);
      expect(emailSchema.safeParse('user.name@domain.co.uk').success).toBe(true);
      expect(emailSchema.safeParse('test+tag@example.com').success).toBe(true);
    });

    test('should reject invalid emails', () => {
      expect(emailSchema.safeParse('invalid-email').success).toBe(false);
      expect(emailSchema.safeParse('test@').success).toBe(false);
      expect(emailSchema.safeParse('@example.com').success).toBe(false);
      expect(emailSchema.safeParse('test@example').success).toBe(false);
    });
  });

  describe('passwordSchema', () => {
    test('should validate strong passwords', () => {
      expect(passwordSchema.safeParse('Password123!').success).toBe(true);
      expect(passwordSchema.safeParse('MyP@ssw0rd').success).toBe(true);
      expect(passwordSchema.safeParse('Str0ng#Pass').success).toBe(true);
    });

    test('should reject weak passwords', () => {
      // Sin mayúscula
      expect(passwordSchema.safeParse('password123!').success).toBe(false);
      // Sin minúscula
      expect(passwordSchema.safeParse('PASSWORD123!').success).toBe(false);
      // Sin número
      expect(passwordSchema.safeParse('Password!').success).toBe(false);
      // Sin carácter especial
      expect(passwordSchema.safeParse('Password123').success).toBe(false);
      // Muy corta
      expect(passwordSchema.safeParse('Pass1!').success).toBe(false);
    });
  });

  describe('phoneSchema', () => {
    test('should validate correct phone numbers', () => {
      expect(phoneSchema.safeParse('+584141234567').success).toBe(true);
      expect(phoneSchema.safeParse('0414-123-4567').success).toBe(true);
      expect(phoneSchema.safeParse('0414 123 4567').success).toBe(true);
    });

    test('should reject invalid phone numbers', () => {
      expect(phoneSchema.safeParse('123').success).toBe(false);
      expect(phoneSchema.safeParse('abc').success).toBe(false);
      expect(phoneSchema.safeParse('').success).toBe(false);
    });
  });

  describe('idNumberSchema', () => {
    test('should validate correct Venezuelan ID numbers', () => {
      expect(idNumberSchema.safeParse('V-12345678').success).toBe(true);
      expect(idNumberSchema.safeParse('E-1234567').success).toBe(true);
      expect(idNumberSchema.safeParse('v-12345678').success).toBe(true);
    });

    test('should reject invalid ID numbers', () => {
      expect(idNumberSchema.safeParse('12345678').success).toBe(false);
      expect(idNumberSchema.safeParse('A-12345678').success).toBe(false);
      expect(idNumberSchema.safeParse('V-123456').success).toBe(false);
    });
  });

  describe('urlSchema', () => {
    test('should validate correct URLs', () => {
      expect(urlSchema.safeParse('https://example.com').success).toBe(true);
      expect(urlSchema.safeParse('http://www.example.com/path').success).toBe(true);
      expect(urlSchema.safeParse('https://example.com?param=value').success).toBe(true);
      expect(urlSchema.safeParse('ftp://example.com').success).toBe(true);
    });

    test('should reject invalid URLs', () => {
      expect(urlSchema.safeParse('not-a-url').success).toBe(false);
      expect(urlSchema.safeParse('').success).toBe(false);
    });
  });

  describe('postalCodeSchema', () => {
    test('should validate correct postal codes', () => {
      expect(postalCodeSchema.safeParse('12345').success).toBe(true);
      expect(postalCodeSchema.safeParse('1234').success).toBe(true);
      expect(postalCodeSchema.safeParse('12345-6789').success).toBe(true);
    });

    test('should reject invalid postal codes', () => {
      expect(postalCodeSchema.safeParse('123').success).toBe(false);
      expect(postalCodeSchema.safeParse('123456').success).toBe(false);
      expect(postalCodeSchema.safeParse('abc').success).toBe(false);
    });
  });

  describe('colorSchema', () => {
    test('should validate correct hex colors', () => {
      expect(colorSchema.safeParse('#FF0000').success).toBe(true);
      expect(colorSchema.safeParse('#00ff00').success).toBe(true);
      expect(colorSchema.safeParse('#f0f').success).toBe(true);
      expect(colorSchema.safeParse('#FFF').success).toBe(true);
    });

    test('should reject invalid colors', () => {
      expect(colorSchema.safeParse('red').success).toBe(false);
      expect(colorSchema.safeParse('#GG0000').success).toBe(false);
      expect(colorSchema.safeParse('#FF00').success).toBe(false);
      expect(colorSchema.safeParse('').success).toBe(false);
    });
  });

  describe('priceSchema', () => {
    test('should validate correct prices', () => {
      expect(priceSchema.safeParse(10.50).success).toBe(true);
      expect(priceSchema.safeParse(100).success).toBe(true);
      expect(priceSchema.safeParse(0.01).success).toBe(true);
    });

    test('should reject invalid prices', () => {
      expect(priceSchema.safeParse(-10).success).toBe(false);
      expect(priceSchema.safeParse(0).success).toBe(false);
      expect(priceSchema.safeParse(10.123).success).toBe(false);
    });
  });

  describe('quantitySchema', () => {
    test('should validate correct quantities', () => {
      expect(quantitySchema.safeParse(1).success).toBe(true);
      expect(quantitySchema.safeParse(100).success).toBe(true);
      expect(quantitySchema.safeParse(0).success).toBe(true);
    });

    test('should reject invalid quantities', () => {
      expect(quantitySchema.safeParse(-1).success).toBe(false);
      expect(quantitySchema.safeParse(1.5).success).toBe(false);
    });
  });

  describe('percentageSchema', () => {
    test('should validate correct percentages', () => {
      expect(percentageSchema.safeParse(0).success).toBe(true);
      expect(percentageSchema.safeParse(50).success).toBe(true);
      expect(percentageSchema.safeParse(100).success).toBe(true);
    });

    test('should reject invalid percentages', () => {
      expect(percentageSchema.safeParse(-1).success).toBe(false);
      expect(percentageSchema.safeParse(101).success).toBe(false);
    });
  });

  describe('futureDateSchema', () => {
    test('should validate future dates', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(futureDateSchema.safeParse(tomorrow).success).toBe(true);
    });

    test('should reject past dates', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(futureDateSchema.safeParse(yesterday).success).toBe(false);
    });
  });

  describe('String validation schemas', () => {
    test('containsNumberSchema should validate strings with numbers', () => {
      expect(containsNumberSchema.safeParse('abc123').success).toBe(true);
      expect(containsNumberSchema.safeParse('123').success).toBe(true);
      expect(containsNumberSchema.safeParse('abc').success).toBe(false);
    });

    test('containsUppercaseSchema should validate strings with uppercase', () => {
      expect(containsUppercaseSchema.safeParse('Abc').success).toBe(true);
      expect(containsUppercaseSchema.safeParse('ABC').success).toBe(true);
      expect(containsUppercaseSchema.safeParse('abc').success).toBe(false);
    });

    test('containsSpecialCharSchema should validate strings with special chars', () => {
      expect(containsSpecialCharSchema.safeParse('abc@123').success).toBe(true);
      expect(containsSpecialCharSchema.safeParse('abc#123').success).toBe(true);
      expect(containsSpecialCharSchema.safeParse('abc123').success).toBe(false);
    });
  });
}); 