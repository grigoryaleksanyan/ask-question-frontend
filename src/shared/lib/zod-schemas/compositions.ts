import type { ZodTypeAny } from 'zod';

export const withConfirmPassword =
  (
    passwordKey = 'password',
    confirmKey = 'confirmPassword',
    msg = 'Пароли не совпадают',
  ) =>
  (schema: ZodTypeAny) =>
    schema.refine(
      (data: Record<string, unknown>) => data[passwordKey] === data[confirmKey],
      { message: msg, path: [confirmKey] },
    );
