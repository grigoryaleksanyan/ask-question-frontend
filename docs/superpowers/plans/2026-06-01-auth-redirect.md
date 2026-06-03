# Auth Redirect — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Исправить краш `useToast()` в навигационных хранниках и реализовать корректный редирект при авторизации с сохранением целевого URL.

**Architecture:** Убрать `useToast()` из `auth-middleware` и `http-client-interceptors` (inject не работает вне компонентного контекста). Редирект на `/login?redirect=<path>` при 401, возврат на целевую страницу после логина. Редирект авторизованных пользователей с `/login` на `/admin`.

**Tech Stack:** Vue Router 5, Pinia 3, TypeScript

---

## File Structure

| File | Action | Responsibility |
|------|--------|---------------|
| `src/app/router/middleware/auth-middleware.ts` | Modify | Проверка авторизации в навигационном храннике, редирект с `redirect` query |
| `src/app/router/router.ts` | Modify | Добавление проверки авторизованных на `/login`, передача `to` в middleware |
| `src/app/lib/http-client-interceptors.ts` | Modify | SPA-редирект при 401 вместо hard redirect, убрать `useToast()` |
| `src/features/auth/ui/LoginView.vue` | Modify | Редирект на `redirect` query после логина |
| `tests/app/router/middleware/auth-middleware.test.ts` | Create | Тесты для auth-middleware |
| `tests/app/lib/http-client-interceptors.test.ts` | Create | Тесты для 401 интерцептора |
| `tests/app/router/router.test.ts` | Create | Тесты для beforeEach guard |

---

### Task 1: auth-middleware — убрать useToast, добавить redirect

**Files:**
- Modify: `src/app/router/middleware/auth-middleware.ts`
- Create: `tests/app/router/middleware/auth-middleware.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { createPinia, setActivePinia } from 'pinia';
import { vi } from 'vitest';

import checkAuth from '@/app/router/middleware/auth-middleware';
import { useAuthStore } from '@/features/auth';

vi.mock('@/entities/user', () => ({
  GetUserData: vi.fn(),
}));

import { GetUserData } from '@/entities/user';

function createMockRoute(fullPath: string) {
  return { fullPath, meta: {} } as any;
}

describe('checkAuth', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('возвращает true если пользователь авторизован', async () => {
    const authStore = useAuthStore();
    authStore.setAuthData({
      id: '1',
      login: 'admin',
      userRoleId: 1,
      created: '',
      updated: null,
      userDetails: null,
    } as any);

    const result = await checkAuth(createMockRoute('/admin'));

    expect(result).toBe(true);
  });

  it('вызывает GetUserData и возвращает true если не авторизован', async () => {
    const mockUser = {
      id: '1',
      login: 'admin',
      userRoleId: 1,
      created: '',
      updated: null,
      userDetails: null,
    };
    vi.mocked(GetUserData).mockResolvedValue(mockUser as any);

    const result = await checkAuth(createMockRoute('/admin'));

    expect(result).toBe(true);
    const authStore = useAuthStore();
    expect(authStore.getAuthStatus).toBe(true);
  });

  it('редиректит на /login с redirect query при ошибке GetUserData', async () => {
    vi.mocked(GetUserData).mockRejectedValue(new Error('Unauthorized'));

    const result = await checkAuth(createMockRoute('/admin-questions'));

    expect(result).toEqual({
      name: 'login',
      query: { redirect: '/admin-questions' },
    });
  });

  it('редиректит на /login без потери fullPath', async () => {
    vi.mocked(GetUserData).mockRejectedValue(new Error('Unauthorized'));

    const result = await checkAuth(createMockRoute('/admin-faq/42'));

    expect(result).toEqual({
      name: 'login',
      query: { redirect: '/admin-faq/42' },
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/app/router/middleware/auth-middleware.test.ts`
Expected: FAIL — `checkAuth` currently takes no arguments, doesn't use `redirect` query

- [ ] **Step 3: Write implementation**

Replace `src/app/router/middleware/auth-middleware.ts` with:

```ts
import type { RouteLocationNormalized, RouteLocationRaw } from 'vue-router';

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

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/app/router/middleware/auth-middleware.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/router/middleware/auth-middleware.ts tests/app/router/middleware/auth-middleware.test.ts
git commit -m "fix(auth): remove useToast from auth-middleware, add redirect query param"
```

---

### Task 2: router.ts — обновить beforeEach и добавить редирект авторизованных

**Files:**
- Modify: `src/app/router/router.ts`
- Create: `tests/app/router/router.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { createPinia, setActivePinia } from 'pinia';
import { createRouter, createWebHistory, type Router } from 'vue-router';
import { vi } from 'vitest';

import { useAuthStore } from '@/features/auth';

vi.mock('@/entities/user', () => ({
  GetUserData: vi.fn(),
}));

let router: Router;

function setupRouter() {
  router = createRouter({
    history: createWebHistory('/'),
    routes: [
      { path: '/', name: 'main', component: { template: '<div/>' } },
      {
        path: '/login',
        name: 'login',
        component: { template: '<div/>' },
        meta: { layout: 'EmptyLayout' },
      },
      {
        path: '/admin',
        name: 'admin',
        component: { template: '<div/>' },
        meta: { layout: 'AdminLayout', isProtected: true },
      },
      {
        path: '/:catchAll(.*)',
        name: 'not-found',
        component: { template: '<div/>' },
        meta: { layout: 'EmptyLayout' },
      },
    ],
  });

  router.beforeEach((to) => {
    const authStore = useAuthStore();

    if (to.name === 'login' && authStore.getAuthStatus) {
      return { name: 'admin' };
    }

    if (to.meta.isProtected) {
      const { default: checkAuth } = require('@/app/router/middleware/auth-middleware');
      return checkAuth(to);
    }

    return true;
  });

  return router;
}

describe('router beforeEach guard', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    setupRouter();
  });

  it('редиректит авторизованного с /login на /admin', async () => {
    const authStore = useAuthStore();
    authStore.setAuthData({
      id: '1',
      login: 'admin',
      userRoleId: 1,
      created: '',
      updated: null,
      userDetails: null,
    } as any);

    const result = await router.push('/login');
    const resolved = router.currentRoute.value;

    expect(resolved.name).toBe('admin');
  });
});
```

Note: The test above tests only the "authorized user on /login → redirect to admin" scenario. The middleware redirect is covered in Task 1.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/app/router/router.test.ts`
Expected: FAIL — router doesn't redirect authorized users from `/login`

- [ ] **Step 3: Write implementation**

Modify `src/app/router/router.ts` — update the `beforeEach` block:

```ts
import { createRouter, createWebHistory } from 'vue-router';

import checkAuth from '@/app/router/middleware/auth-middleware';
import { useAuthStore } from '@/features/auth';
import ROUTES from '@/shared/routes';

declare module 'vue-router' {
  interface RouteMeta {
    layout?: string;
    isProtected?: boolean;
  }
}

const routes = [
  {
    path: '/',
    name: ROUTES.main,
    component: () => import('@/pages/main'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/features/auth/ui/LoginView.vue'),
    meta: {
      layout: 'EmptyLayout',
    },
  },
  {
    path: '/questions',
    name: 'questions',
    component: () => import('@/pages/questions'),
  },
  {
    path: '/question/:id',
    name: 'question',
    component: () => import('@/pages/questions/detail'),
  },
  {
    path: '/faq',
    name: 'faq',
    component: () => import('@/pages/faq'),
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('@/pages/admin/main'),
    meta: { layout: 'AdminLayout', isProtected: true },
  },
  {
    path: '/admin-questions',
    name: 'admin-questions',
    component: () => import('@/pages/admin/questions'),
    meta: { layout: 'AdminLayout', isProtected: true },
  },
  {
    path: '/admin-faq',
    name: 'admin-faq',
    component: () => import('@/pages/admin/faq'),
    meta: { layout: 'AdminLayout', isProtected: true },
    children: [
      {
        path: ':id',
        name: 'admin-faq-category',
        props: (route: { params: { id: string } }) => ({
          id: route.params.id,
        }),
        meta: { layout: 'AdminLayout', isProtected: true },
        component: () =>
          import('@/pages/admin/faq/ui/AdminFAQCategoryPage.vue'),
      },
    ],
  },
  {
    path: '/admin-speakers',
    name: 'admin-speakers',
    component: () => import('@/pages/admin/speakers'),
    meta: { layout: 'AdminLayout', isProtected: true },
  },
  {
    path: '/admin-areas',
    name: 'admin-areas',
    component: () => import('@/pages/admin/areas'),
    meta: { layout: 'AdminLayout', isProtected: true },
  },
  {
    path: '/admin-feedback',
    name: 'admin-feedback',
    component: () => import('@/pages/admin/feedback'),
    meta: { layout: 'AdminLayout', isProtected: true },
  },

  {
    path: '/:catchAll(.*)',
    name: ROUTES.notFound,
    component: () => import('@/pages/errors'),
    meta: {
      layout: 'EmptyLayout',
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

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

export default router;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/app/router/router.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/router/router.ts tests/app/router/router.test.ts
git commit -m "feat(auth): redirect authorized users from /login to /admin"
```

---

### Task 3: http-client-interceptors — SPA-редирект при 401

**Files:**
- Modify: `src/app/lib/http-client-interceptors.ts`
- Create: `tests/app/lib/http-client-interceptors.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import axios from 'axios';
import { vi } from 'vitest';

vi.mock('@/app/router', () => ({
  default: {
    push: vi.fn(),
    currentRoute: { value: { fullPath: '/admin' } },
  },
}));

vi.mock('@/shared/api', () => {
  const mockAxios = axios.create();
  return { default: mockAxios };
});

import setupHttpClientInterceptors from '@/app/lib/http-client-interceptors';
import router from '@/app/router';
import httpClient from '@/shared/api';

describe('http-client-interceptors', () => {
  beforeEach(() => {
    setupHttpClientInterceptors();
  });

  it('при 401 вызывает router.push с redirect query', async () => {
    vi.mocked(router.push).mockResolvedValue(undefined);

    const promise = httpClient.get('/api/test').catch(() => {});

    httpClient.interceptors.response.handlers[0].rejected({
      response: { status: 401 },
    });

    await promise;

    expect(router.push).toHaveBeenCalledWith({
      name: 'login',
      query: { redirect: '/admin' },
    });
  });

  it('при не-401 ошибке не вызывает router.push', async () => {
    vi.mocked(router.push).mockClear();

    try {
      await httpClient.interceptors.response.handlers[0].rejected({
        response: { status: 500, data: { message: 'Server error' } },
        message: 'Server error',
      });
    } catch {
      // expected rejection
    }

    expect(router.push).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/app/lib/http-client-interceptors.test.ts`
Expected: FAIL — current interceptor uses `window.location.href` and `useToast()`, not `router.push`

- [ ] **Step 3: Write implementation**

Replace `src/app/lib/http-client-interceptors.ts` with:

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

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/app/lib/http-client-interceptors.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/lib/http-client-interceptors.ts tests/app/lib/http-client-interceptors.test.ts
git commit -m "fix(auth): replace hard redirect with router.push on 401, remove useToast from interceptor"
```

---

### Task 4: LoginView — редирект на целевую страницу после логина

**Files:**
- Modify: `src/features/auth/ui/LoginView.vue`

- [ ] **Step 1: Write implementation**

Modify `src/features/auth/ui/LoginView.vue` — add `useRoute` and update `onSuccess`:

In the `<script setup>` section, add import for `useRoute`:

```ts
import { reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
```

Add `route` constant after `router`:

```ts
const router = useRouter();
const route = useRoute();
```

Update `onSuccess` callback in `useApiCall`:

```ts
onSuccess(user) {
  authStore.setAuthData(user);
  router.push((route.query.redirect as string) || '/admin');
},
```

- [ ] **Step 2: Run typecheck**

Run: `npx vue-tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/features/auth/ui/LoginView.vue
git commit -m "feat(auth): redirect to original page after login via redirect query"
```

---

### Task 5: Финальная верификация

- [ ] **Step 1: Run full test suite**

Run: `npx vitest run`
Expected: All tests PASS

- [ ] **Step 2: Run typecheck**

Run: `npx vue-tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Run lint**

Run: `npm run lint`
Expected: PASS

- [ ] **Step 4: Manual verification checklist**

1. Неавторизованный → `/admin`: редирект на `/login?redirect=/admin`
2. Логин с `redirect` query: редирект на целевую страницу
3. Логин без `redirect` query: редирект на `/admin`
4. Авторизованный → `/login`: редирект на `/admin`
5. 401 от API: SPA-редирект на `/login` с `redirect`
6. Нет крашей `useToast()` в консоли
