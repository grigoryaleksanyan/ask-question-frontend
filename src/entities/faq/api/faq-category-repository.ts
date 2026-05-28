import httpClient from '@/shared/api';

import type {
  FaqCategoryResponse,
  FaqCategoryWithEntriesResponse,
  FaqCategoryCreateRequest,
  FaqCategoryUpdateRequest,
} from '@/shared/types';

const apiRoute = '/api/FaqCategory';

export async function GetAll(): Promise<FaqCategoryResponse[]> {
  const result = await httpClient
    .get<FaqCategoryResponse[]>(`${apiRoute}/GetAll`)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка получения списка категорий', { cause: error });
    });

  return result;
}

export async function GetAllWithEntries(): Promise<
  FaqCategoryWithEntriesResponse[]
> {
  const result = await httpClient
    .get<FaqCategoryWithEntriesResponse[]>(`${apiRoute}/GetAllWithEntries`)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка получения списка категорий', { cause: error });
    });

  return result;
}

export async function GetById(
  id: string,
): Promise<FaqCategoryWithEntriesResponse> {
  const result = await httpClient
    .get<FaqCategoryWithEntriesResponse>(`${apiRoute}/GetById?id=${id}`)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка получения данных категории', { cause: error });
    });

  return result;
}

export async function Create(
  category: FaqCategoryCreateRequest,
): Promise<FaqCategoryResponse> {
  const result = await httpClient
    .post<FaqCategoryResponse>(`${apiRoute}/Create`, category)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка создания категории', { cause: error });
    });

  return result;
}

export async function Update(
  category: FaqCategoryUpdateRequest,
): Promise<FaqCategoryResponse> {
  const result = await httpClient
    .put<FaqCategoryResponse>(`${apiRoute}/Update`, category)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка изменения категории', { cause: error });
    });

  return result;
}

export async function Delete(id: string): Promise<void> {
  await httpClient
    .delete(`${apiRoute}/Delete?id=${id}`)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка удаления категории', { cause: error });
    });
}

export async function SetOrder(categoryIds: string[]): Promise<void> {
  await httpClient
    .put(`${apiRoute}/SetOrder`, categoryIds)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка сортировки категорий', { cause: error });
    });
}
