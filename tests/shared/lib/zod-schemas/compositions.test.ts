import { describe, it, expect } from 'vitest';

import { z } from 'zod';

import { withConfirmPassword } from '@/shared/lib/zod-schemas';

describe('zod-schemas compositions', () => {
  describe('withConfirmPassword', () => {
    const schema = withConfirmPassword()(
      z.object({
        password: z.string(),
        confirmPassword: z.string(),
      }),
    );

    it('passes when passwords match', () => {
      const result = schema.safeParse({
        password: 'secret',
        confirmPassword: 'secret',
      });
      expect(result.success).toBe(true);
    });

    it('fails when passwords do not match', () => {
      const result = schema.safeParse({
        password: 'secret',
        confirmPassword: 'different',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Пароли не совпадают');
        expect(result.error.issues[0].path).toEqual(['confirmPassword']);
      }
    });

    it('supports custom keys', () => {
      const customSchema = withConfirmPassword('newPassword', 'confirmPassword', 'No match')(
        z.object({
          newPassword: z.string(),
          confirmPassword: z.string(),
        }),
      );

      const result = customSchema.safeParse({
        newPassword: 'a',
        confirmPassword: 'b',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('No match');
        expect(result.error.issues[0].path).toEqual(['confirmPassword']);
      }
    });
  });
});
