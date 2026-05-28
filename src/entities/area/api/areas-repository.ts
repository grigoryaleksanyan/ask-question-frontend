import httpClient from '@/shared/api';

import type {
  AreaResponse,
  AreaCreateRequest,
  AreaUpdateRequest,
} from '@/shared/types';

const apiRoute = '/api/Area';

export async function GetAll(): Promise<AreaResponse[]> {
  const result = await httpClient
    .get<AreaResponse[]>(`${apiRoute}/GetAll`)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка получения списка областей', { cause: error });
    });

  return result;
}

export async function Create(area: AreaCreateRequest): Promise<AreaResponse> {
  const result = await httpClient
    .post<AreaResponse>(`${apiRoute}/Create`, area)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка создания области', { cause: error });
    });

  return result;
}

export async function Update(area: AreaUpdateRequest): Promise<AreaResponse> {
  const result = await httpClient
    .put<AreaResponse>(`${apiRoute}/Update`, area)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка изменения области', { cause: error });
    });

  return result;
}

export async function Delete(id: string): Promise<void> {
  await httpClient
    .delete(`${apiRoute}/Delete?id=${id}`)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка удаления области', { cause: error });
    });
}

export async function SetOrder(ids: string[]): Promise<void> {
  await httpClient
    .put(`${apiRoute}/SetOrder`, ids)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка сортировки областей', { cause: error });
    });
}
