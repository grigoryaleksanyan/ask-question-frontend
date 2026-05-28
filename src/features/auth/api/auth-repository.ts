import httpClient from '@/shared/api';

import type { LoginRequest, UserResponse } from '@/shared/types';

const apiRoute = '/api/Auth';

export async function Login(authData: LoginRequest): Promise<UserResponse> {
  const result = await httpClient
    .post<UserResponse>(`${apiRoute}/Login`, authData)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка авторизации', { cause: error });
    });

  return result;
}

export async function Logout(): Promise<void> {
  await httpClient
    .put(`${apiRoute}/Logout`)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка выхода', { cause: error });
    });
}
