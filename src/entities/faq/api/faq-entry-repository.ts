import httpClient from '@/shared/api';

import type {
  FaqEntryResponse,
  FaqEntryCreateRequest,
  FaqEntryUpdateRequest,
} from '@/shared/types';

const apiRoute = '/api/FaqEntry';

export async function GetAll(): Promise<FaqEntryResponse[]> {
  const result = await httpClient
    .get<FaqEntryResponse[]>(`${apiRoute}/GetAll`)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка получения списка записей', { cause: error });
    });

  return result;
}

export async function GetById(id: string): Promise<FaqEntryResponse> {
  const result = await httpClient
    .get<FaqEntryResponse>(`${apiRoute}/GetById?id=${id}`)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка получения данных записи', { cause: error });
    });

  return result;
}

export async function Create(entry: FaqEntryCreateRequest): Promise<FaqEntryResponse> {
  const result = await httpClient
    .post<FaqEntryResponse>(`${apiRoute}/Create`, entry)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка создания записи', { cause: error });
    });

  return result;
}

export async function Update(entry: FaqEntryUpdateRequest): Promise<FaqEntryResponse> {
  const result = await httpClient
    .put<FaqEntryResponse>(`${apiRoute}/Update`, entry)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка изменения записи', { cause: error });
    });

  return result;
}

export async function Delete(id: string): Promise<void> {
  await httpClient
    .delete(`${apiRoute}/Delete?id=${id}`)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка удаления записи', { cause: error });
    });
}

export async function SetOrder(ids: string[]): Promise<void> {
  await httpClient
    .put(`${apiRoute}/SetOrder`, ids)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка сортировки записей', { cause: error });
    });
}
