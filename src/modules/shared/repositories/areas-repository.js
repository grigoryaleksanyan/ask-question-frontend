import httpClient from '@/core/plugins/http-client';

const apiRoute = '/api/Area';

export async function GetAll() {
  const result = await httpClient
    .get(`${apiRoute}/GetAll`)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка получения списка областей', { cause: error });
    });

  return result;
}

export async function Create(area) {
  const result = await httpClient
    .post(`${apiRoute}/Create`, area)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка создания области', { cause: error });
    });

  return result;
}

export async function Update(area) {
  const result = await httpClient
    .put(`${apiRoute}/Update`, area)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка изменения области', { cause: error });
    });

  return result;
}

export async function Delete(id) {
  const result = await httpClient
    .delete(`${apiRoute}/Delete?id=${id}`)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка удаления области', { cause: error });
    });

  return result;
}

export async function SetOrder(ids) {
  const result = await httpClient
    .put(`${apiRoute}/SetOrder`, ids)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка сортировки областей', { cause: error });
    });

  return result;
}
