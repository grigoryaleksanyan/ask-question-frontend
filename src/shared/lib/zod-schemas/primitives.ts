import { z } from 'zod';

export const requiredString = (msg = 'Обязательное поле') =>
  z.string().min(1, msg);

export const emailString = (msg = 'Введите корректный email') =>
  z.string().min(1, 'Обязательное поле').email(msg);

export const passwordString = (min = 6, msg?: string) =>
  z.string().min(min, msg ?? `Минимум ${min} символов`);

export const optionalString = () => z.string();

export const nonNegativeInt = (msg = 'Минимум 0') =>
  z.coerce.number().int().min(0, msg);
