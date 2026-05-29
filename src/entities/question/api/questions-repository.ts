import httpClient from '@/shared/api';

import type {
  QuestionResponse,
  QuestionCreateRequest,
  QuestionUpdateRequest,
  CaptchaResponse,
  PaginatedResponse,
  SpeakerResponse,
} from '@/shared/types';

const apiRoute = '/api/Question';
const userApiRoute = '/api/User';

export interface QuestionListParams {
  page?: number;
  pageSize?: number;
  status?: number;
  speaker?: string;
  area?: string;
  search?: string;
  sortOrder?: 'asc' | 'desc';
}

export async function GetCaptcha(): Promise<CaptchaResponse> {
  const result = await httpClient
    .get<CaptchaResponse>(`${apiRoute}/GetCaptcha`)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка получения капчи', { cause: error });
    });

  return result;
}

export async function GetAll(
  params?: QuestionListParams,
): Promise<PaginatedResponse<QuestionResponse>> {
  const queryParams: Record<string, string> = {};

  if (params?.page) queryParams.page = String(params.page);
  if (params?.pageSize) queryParams.pageSize = String(params.pageSize);
  if (params?.status !== undefined && params?.status !== null)
    queryParams.status = String(params.status);
  if (params?.speaker) queryParams.speaker = params.speaker;
  if (params?.area) queryParams.area = params.area;
  if (params?.search) queryParams.search = params.search;
  if (params?.sortOrder) queryParams.sortOrder = params.sortOrder;

  const queryString = Object.entries(queryParams)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');

  const url = queryString
    ? `${apiRoute}/GetAll?${queryString}`
    : `${apiRoute}/GetAll`;

  const result = await httpClient
    .get<PaginatedResponse<QuestionResponse>>(url)
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

export async function GetSpeakers(): Promise<SpeakerResponse[]> {
  const result = await httpClient
    .get<SpeakerResponse[]>(`${userApiRoute}/GetSpeakers`)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка получения списка спикеров', { cause: error });
    });

  return result;
}
