import { useToast } from 'primevue/usetoast';

import router from '@/app/router';
import httpClient from '@/shared/api';

import { TOAST_HANDLED } from '@/shared/lib/use-api-call';

export default function setupHttpClientInterceptors() {
  httpClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        if (router.currentRoute.value.meta.isProtected) {
          window.location.href = '/login';
        }

        return Promise.reject(error);
      }

      if (!(error as Record<symbol, boolean>)[TOAST_HANDLED]) {
        const toast = useToast();

        toast.add({
          severity: 'error',
          detail:
            error.response?.data?.message ??
            error.message ??
            'Произошла ошибка',
          group: 'api',
          life: undefined,
        });
      }

      return Promise.reject(error);
    },
  );
}
