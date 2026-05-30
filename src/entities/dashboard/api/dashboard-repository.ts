import httpClient from '@/shared/api';
import type { DashboardSummaryResponse } from '@/shared/types';

const apiRoute = '/api/Dashboard';

export async function GetSummary(
  periodDays: number = 30,
  speakerId: string | null = null,
): Promise<DashboardSummaryResponse> {
  const params: Record<string, string> = { periodDays: String(periodDays) };

  if (speakerId) {
    params.speakerId = speakerId;
  }

  const result = await httpClient
    .get<DashboardSummaryResponse>(`${apiRoute}/Summary`, { params })
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка получения данных сводки', { cause: error });
    });

  return result;
}
