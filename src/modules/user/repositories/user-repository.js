import httpClient from '@/core/plugins/http-client';

const apiRoute = '/api/User';

export async function GetUserData() {
  const result = await httpClient
    .get(`${apiRoute}/GetUserData`)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка получения данных пользователя', { cause: error });
    });

  return result;
}

export async function ChangePassword(userUpdateModel) {
  const result = await httpClient
    .put(`${apiRoute}/ChangePassword`, userUpdateModel)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка изменения пароля', { cause: error });
    });

  return result;
}
