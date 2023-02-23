import httpClient from '@/core/plugins/http-client';

const apiRoute = '/api/auth';

export default async function Login(authData) {
  const result = await httpClient
    .post(`${apiRoute}/login`, authData)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка авторизации', { cause: error });
    });

  return result;
}
