import httpClient from '@/shared/api';

import type {
  LoginRequest,
  SetupRequest,
  UserResponse,
  SetupRequiredResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from '@/shared/dto';

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

export async function SetupRequired(): Promise<SetupRequiredResponse> {
  const result = await httpClient
    .get<SetupRequiredResponse>(`${apiRoute}/SetupRequired`)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка проверки настройки', { cause: error });
    });

  return result;
}

export async function Setup(setupData: SetupRequest): Promise<UserResponse> {
  const result = await httpClient
    .post<UserResponse>(`${apiRoute}/Setup`, setupData)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка создания администратора', { cause: error });
    });

  return result;
}

export async function ForgotPassword(
  data: ForgotPasswordRequest,
): Promise<void> {
  await httpClient
    .post(`${apiRoute}/ForgotPassword`, data)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка отправки ссылки для сброса пароля', {
        cause: error,
      });
    });
}

export async function ResetPassword(data: ResetPasswordRequest): Promise<void> {
  await httpClient
    .post(`${apiRoute}/ResetPassword`, data)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка сброса пароля', { cause: error });
    });
}
