import httpClient from '@/shared/api';

const apiRoute = '/api/FaqEntry';

export async function GetAll() {
  const result = await httpClient
    .get(`${apiRoute}/GetAll`)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка получения списка записей', { cause: error });
    });

  return result;
}

export async function GetById(id) {
  const result = await httpClient
    .get(`${apiRoute}/GetById?id=${id}`)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка получения данных записи', { cause: error });
    });

  return result;
}

export async function Create(entry) {
  const result = await httpClient
    .post(`${apiRoute}/Create`, entry)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка создания записи', { cause: error });
    });

  return result;
}

export async function Update(entry) {
  const result = await httpClient
    .put(`${apiRoute}/Update`, entry)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка изменения записи', { cause: error });
    });

  return result;
}

export async function Delete(id) {
  const result = await httpClient
    .delete(`${apiRoute}/Delete?id=${id}`)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка удаления записи', { cause: error });
    });

  return result;
}

export async function SetOrder(ids) {
  const result = await httpClient
    .put(`${apiRoute}/SetOrder`, ids)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка сортировки записей', { cause: error });
    });

  return result;
}
