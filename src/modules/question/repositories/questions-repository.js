import httpClient from '@/core/plugins/http-client';

const apiRoute = '/api/Question';

export async function GetCapctha() {
  const result = await httpClient
    .get(`${apiRoute}/GetCapctha`)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка получения капчи', { cause: error });
    });

  return result;
}

export async function GetAll() {
  const result = await httpClient
    .get(`${apiRoute}/GetAll`)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка получения списка вопросов', { cause: error });
    });

  return result;
}

export async function GetById(id) {
  const result = await httpClient
    .get(`${apiRoute}/GetById?id=${id}`)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка получения вопроса', { cause: error });
    });

  return result;
}

export async function Create(capctha, question) {
  const result = await httpClient
    .post(`${apiRoute}/Create?capctha=${capctha}`, question)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка создания вопроса', { cause: error });
    });

  return result;
}

export async function Update(question) {
  const result = await httpClient
    .put(`${apiRoute}/Update/${question.id}`, question)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка изменения вопроса', { cause: error });
    });

  return result;
}

export async function Delete(id) {
  const result = await httpClient
    .delete(`${apiRoute}/Delete/${id}`)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка удаления вопроса', { cause: error });
    });

  return result;
}
