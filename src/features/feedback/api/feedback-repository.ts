import httpClient from '@/shared/api';

import type { FeedbackResponse, FeedbackCreateRequest } from '@/shared/dto';

const apiRoute = '/api/Feedback';

export async function GetAll(): Promise<FeedbackResponse[]> {
  const result = await httpClient
    .get<FeedbackResponse[]>(`${apiRoute}/GetAll`)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка получения списка обратной связи', {
        cause: error,
      });
    });

  return result;
}

export async function Create(
  feedback: FeedbackCreateRequest,
): Promise<FeedbackResponse> {
  const result = await httpClient
    .post<FeedbackResponse>(`${apiRoute}/Create`, feedback)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка создания обратной связи', { cause: error });
    });

  return result;
}

export async function Delete(id: string): Promise<void> {
  await httpClient
    .delete(`${apiRoute}/Delete?id=${id}`)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка удаления обратной связи', { cause: error });
    });
}
