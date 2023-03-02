import httpClient from '@/core/plugins/http-client';

const apiRoute = '/api/FaqCategory';

export async function GetAll() {
  const result = await httpClient
    .get(`${apiRoute}/GetAll`)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка получения списка категорий', { cause: error });
    });

  return result;
}

export async function GetById(id) {
  const result = await httpClient
    .get(`${apiRoute}/GetById?id=${id}`)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка получения данных категории', { cause: error });
    });

  return result;
}

export async function Create(category) {
  const result = await httpClient
    .post(`${apiRoute}/Create`, category)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка создания категории', { cause: error });
    });

  return result;
}

export async function Update(category) {
  const result = await httpClient
    .put(`${apiRoute}/Update`, category)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка изменения категории', { cause: error });
    });

  return result;
}

export async function Delete(id) {
  const result = await httpClient
    .delete(`${apiRoute}/Delete?id=${id}`)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка удаления категории', { cause: error });
    });

  return result;
}

export async function SetOrder(categoryIds) {
  const result = await httpClient
    .put(`${apiRoute}/SetOrder`, categoryIds)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка сортировки категорий', { cause: error });
    });

  return result;
}
