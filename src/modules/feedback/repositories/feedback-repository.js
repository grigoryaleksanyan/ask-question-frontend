import httpClient from '@/core/plugins/http-client';

const apiRoute = '/api/Feedback';

export async function GetAll() {
  const result = await httpClient
    .get(`${apiRoute}/GetAll`)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка получения списка обратной связи', { cause: error });
    });

  return result;
}

export async function Create(feedback) {
  const result = await httpClient
    .post(`${apiRoute}/Create`, feedback)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка создания обратной связи', { cause: error });
    });

  return result;
}

export async function Delete(id) {
  const result = await httpClient
    .delete(`${apiRoute}/Delete/${id}`)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка удаления обратной связи', { cause: error });
    });

  return result;
}
