import httpClient from '@/shared/api';
import type { DashboardSummaryResponse } from '@/shared/types';

const apiRoute = '/api/Dashboard';

export async function GetSummary(
  periodDays: number = 30,
): Promise<DashboardSummaryResponse> {
  const result = await httpClient
    .get<DashboardSummaryResponse>(`${apiRoute}/Summary`, {
      params: { periodDays },
    })
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка получения данных сводки', { cause: error });
    });
  return result;
}
