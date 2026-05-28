import httpClient from '@/shared/api';

import type { UserResponse, ChangePasswordRequest } from '@/shared/types';

const apiRoute = '/api/User';

export async function GetUserData(): Promise<UserResponse> {
  const result = await httpClient
    .get<UserResponse>(`${apiRoute}/GetUserData`)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка получения данных пользователя', { cause: error });
    });

  return result;
}

export async function ChangePassword(
  userUpdateModel: ChangePasswordRequest,
): Promise<void> {
  await httpClient
    .put(`${apiRoute}/ChangePassword`, userUpdateModel)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка изменения пароля', { cause: error });
    });
}
