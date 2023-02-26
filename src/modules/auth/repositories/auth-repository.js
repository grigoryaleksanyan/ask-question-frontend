import httpClient from '@/core/plugins/http-client';

const apiRoute = '/api/Auth';

export async function Login(authData) {
  const result = await httpClient
    .post(`${apiRoute}/Login`, authData)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка авторизации', { cause: error });
    });

  return result;
}

export async function Logout() {
  const result = await httpClient
    .put(`${apiRoute}/Logout`)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка выхода', { cause: error });
    });

  return result;
}
