import httpClient from '@/shared/api';

import type {
  SpeakerPublicResponse,
  SpeakerResponse,
  CreateSpeakerResponse,
  SpeakerCreateRequest,
  SpeakerUpdateRequest,
} from '@/shared/types';

const apiRoute = '/api/Speaker';

export async function GetAllPublicSpeakers(): Promise<SpeakerPublicResponse[]> {
  const result = await httpClient
    .get<SpeakerPublicResponse[]>(`${apiRoute}/GetAllPublic`)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка получения списка спикеров', { cause: error });
    });

  return result;
}

export async function GetAllSpeakers(): Promise<SpeakerResponse[]> {
  const result = await httpClient
    .get<SpeakerResponse[]>(`${apiRoute}/GetAll`)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка получения списка спикеров', { cause: error });
    });

  return result;
}

export async function GetSpeakerById(id: string): Promise<SpeakerResponse> {
  const result = await httpClient
    .get<SpeakerResponse>(`${apiRoute}/GetById/${id}`)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка получения данных спикера', { cause: error });
    });

  return result;
}

export async function Create(
  data: SpeakerCreateRequest,
): Promise<CreateSpeakerResponse> {
  const result = await httpClient
    .post<CreateSpeakerResponse>(`${apiRoute}/Create`, data)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка создания спикера', { cause: error });
    });

  return result;
}

export async function Update(data: SpeakerUpdateRequest): Promise<void> {
  await httpClient
    .put(`${apiRoute}/Update`, data)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка изменения спикера', { cause: error });
    });
}

export async function Delete(id: string): Promise<void> {
  await httpClient
    .delete(`${apiRoute}/Delete/${id}`)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка удаления спикера', { cause: error });
    });
}
