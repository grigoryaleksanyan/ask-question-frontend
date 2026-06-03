# Auth redirect — доработка авторизации на фронте

## Проблема

При переходе неавторизованного пользователя на защищённую страницу (`/admin`):
1. `auth-middleware.ts` вызывает `useToast()` в навигационном храннике — крашится, т.к. `inject()` не работает вне компонентного контекста
2. `http-client-interceptors.ts` при 401 делает hard redirect через `window.location.href` — теряет SPA-состояние
3. После логина всегда редиректит на `/admin` — не возвращается на целевую страницу
4. Авторизованный пользователь может зайти на `/login`

## Решение

### 1. auth-middleware.ts

Убрать `useToast()` и `TOAST_HANDLED`. При ошибке `GetUserData()` — редирект на `/login` с query-параметром `redirect`.

```ts
import type { RouteLocationNormalized } from 'vue-router';

import { useAuthStore } from '@/features/auth';
import { GetUserData } from '@/entities/user';

export default async function checkAuth(
  to: RouteLocationNormalized,
): Promise<true | RouteLocationRaw> {
  const authStore = useAuthStore();

  if (!authStore.getAuthStatus) {
    try {
      const user = await GetUserData();
      authStore.setAuthData(user);
      return true;
    } catch {
      return { name: 'login', query: { redirect: to.fullPath } };
    }
  }

  return true;
}
```

### 2. http-client-interceptors.ts

Заменить `window.location.href` на `router.push`. Убрать `useToast()` — ошибки API обрабатываются на уровне компонентов через `useApiCall`.

```ts
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
```

### 3. LoginView.vue

После успешного логина — редирект на `route.query.redirect` или `/admin` как fallback.

```ts
const route = useRoute();

const { execute: executeLogin, error } = useApiCall(Login, {
  showPreloader: false,
  onSuccess(user) {
    authStore.setAuthData(user);
    router.push((route.query.redirect as string) || '/admin');
  },
});
```

### 4. router.ts — редирект авторизованных с /login

В `beforeEach`: если пользователь авторизован и идёт на `/login` — редирект на `/admin`.

```ts
router.beforeEach((to) => {
  const authStore = useAuthStore();

  if (to.name === 'login' && authStore.getAuthStatus) {
    return { name: 'admin' };
  }

  if (to.meta.isProtected) {
    return checkAuth(to);
  }

  return true;
});
```

## Затрагиваемые файлы

- `src/app/router/middleware/auth-middleware.ts`
- `src/app/lib/http-client-interceptors.ts`
- `src/app/router/router.ts`
- `src/features/auth/ui/LoginView.vue`

## Проверка

- Неавторизованный → `/admin`: редирект на `/login?redirect=/admin`
- Логин: редирект на `/admin` (или на `redirect` из query)
- Авторизованный → `/login`: редирект на `/admin`
- 401 от API (вне навигационного хранника): SPA-редирект на `/login`
- Нет крашей `useToast()` вне компонентного контекста
