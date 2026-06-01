import router from '@/app/router';
import httpClient from '@/shared/api';

export default function setupHttpClientInterceptors() {
  httpClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        router.push({
          name: 'login',
          query: { redirect: router.currentRoute.value.fullPath },
        });
        return Promise.reject(error);
      }

      return Promise.reject(error);
    },
  );
}
