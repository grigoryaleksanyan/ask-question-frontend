import { describe, it, expect } from 'vitest';

import {
  requiredString,
  emailString,
  passwordString,
  optionalString,
  nonNegativeInt,
} from '@/shared/lib/zod-schemas';

describe('zod-schemas primitives', () => {
  describe('requiredString', () => {
    const schema = requiredString();

    it('passes for non-empty string', () => {
      expect(schema.safeParse('hello').success).toBe(true);
    });

    it('fails for empty string', () => {
      const result = schema.safeParse('');
      expect(result.success).toBe(false);
    });

    it('passes for whitespace-only string', () => {
      const result = schema.safeParse('   ');
      expect(result.success).toBe(true);
    });

    it('uses custom message', () => {
      const custom = requiredString('Custom message');
      const result = custom.safeParse('');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Custom message');
      }
    });
  });

  describe('emailString', () => {
    const schema = emailString();

    it('passes for valid email', () => {
      expect(schema.safeParse('user@example.com').success).toBe(true);
    });

    it('fails for empty string', () => {
      const result = schema.safeParse('');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Обязательное поле');
      }
    });

    it('fails for invalid email', () => {
      const result = schema.safeParse('not-email');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Введите корректный email');
      }
    });

    it('uses custom email message', () => {
      const custom = emailString('Bad email');
      const result = custom.safeParse('not-email');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Bad email');
      }
    });
  });

  describe('passwordString', () => {
    const schema = passwordString();

    it('passes for string with 6+ chars', () => {
      expect(schema.safeParse('123456').success).toBe(true);
    });

    it('fails for string shorter than 6', () => {
      const result = schema.safeParse('12345');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Минимум 6 символов');
      }
    });

    it('supports custom min length', () => {
      const custom = passwordString(8);
      const result = custom.safeParse('1234567');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Минимум 8 символов');
      }
    });

    it('supports custom message', () => {
      const custom = passwordString(6, 'Too short');
      const result = custom.safeParse('12345');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Too short');
      }
    });
  });

  describe('optionalString', () => {
    const schema = optionalString();

    it('passes for any string', () => {
      expect(schema.safeParse('hello').success).toBe(true);
    });

    it('passes for empty string', () => {
      expect(schema.safeParse('').success).toBe(true);
    });
  });

  describe('nonNegativeInt', () => {
    const schema = nonNegativeInt();

    it('passes for 0', () => {
      expect(schema.safeParse('0').success).toBe(true);
    });

    it('passes for positive integer string', () => {
      expect(schema.safeParse('5').success).toBe(true);
    });

    it('fails for negative number', () => {
      const result = schema.safeParse('-1');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Минимум 0');
      }
    });

    it('fails for decimal', () => {
      const result = schema.safeParse('1.5');
      expect(result.success).toBe(false);
    });
  });
});
