import httpClient from '@/shared/api';

import type {
  QuestionResponse,
  QuestionCreateRequest,
  QuestionUpdateRequest,
  CaptchaResponse,
} from '@/shared/types';

const apiRoute = '/api/Question';

export async function GetCaptcha(): Promise<CaptchaResponse> {
  const result = await httpClient
    .get<CaptchaResponse>(`${apiRoute}/GetCaptcha`)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка получения капчи', { cause: error });
    });

  return result;
}

export async function GetAll(): Promise<QuestionResponse[]> {
  const result = await httpClient
    .get<QuestionResponse[]>(`${apiRoute}/GetAll`)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка получения списка вопросов', { cause: error });
    });

  return result;
}

export async function GetPopularQuestions(): Promise<QuestionResponse[]> {
  const result = await httpClient
    .get<QuestionResponse[]>(`${apiRoute}/GetPopularQuestions`)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка получения популярных вопросов', { cause: error });
    });

  return result;
}

export async function GetById(id: string): Promise<QuestionResponse> {
  const result = await httpClient
    .get<QuestionResponse>(`${apiRoute}/GetById?id=${id}`)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка получения вопроса', { cause: error });
    });

  return result;
}

export async function Create(
  captcha: string,
  question: QuestionCreateRequest,
): Promise<void> {
  await httpClient
    .post(`${apiRoute}/Create?captcha=${captcha}`, question)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка создания вопроса', { cause: error });
    });
}

export async function Update(question: QuestionUpdateRequest): Promise<void> {
  await httpClient
    .put(`${apiRoute}/Update/${question.id}`, question)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка изменения вопроса', { cause: error });
    });
}

export async function Delete(id: string): Promise<void> {
  await httpClient
    .delete(`${apiRoute}/Delete/${id}`)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка удаления вопроса', { cause: error });
    });
}
