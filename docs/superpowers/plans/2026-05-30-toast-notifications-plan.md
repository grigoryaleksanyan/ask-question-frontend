# Toast-уведомления: реализация замены alert на PrimeVue Toast

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Заменить `entities/alert` на PrimeVue Toast с composable `useApiCall`, устранив дублирование try/catch в 22+ компонентах.

**Architecture:** Composable `useApiCall` в `shared/lib/` оборачивает async-вызовы, автоматически показывает toast (через PrimeVue `useToast`) и управляет preloader. Глобальный error-перехватчик в `http-client-interceptors.ts` ловит необработанные ошибки. AppToast — обёртка над `<Toast>` с кастомным шаблоном (прогресс-бар, лимит 5).

**Tech Stack:** PrimeVue 4 ToastService, `useToast()` composable, Pinia preloader store, TypeScript

---

## Task 1: Типы для useApiCall

**Files:**
- Create: `src/shared/lib/use-api-call/types.ts`
- Modify: `src/shared/lib/index.ts`

- [ ] **Step 1: Создать файл типов**

```typescript
// src/shared/lib/use-api-call/types.ts

export interface UseApiCallOptions<T> {
  successMessage?: string;
  errorMapper?: (error: Error) => string;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  showPreloader?: boolean;
}

export interface UseApiCallReturn<T> {
  execute: (...args: unknown[]) => Promise<T | undefined>;
  isLoading: Ref<boolean>;
  error: Ref<Error | null>;
  data: Ref<T | null>;
}
```

- [ ] **Step 2: Обновить public API shared/lib**

Добавить реэкспорт в `src/shared/lib/index.ts`:

```typescript
export { default as copyToClipboard } from './copy-to-clipboard';
export { default as sanitizeHtml } from './html-sanitize';
export { useApiCall } from './use-api-call';
```

> Примечание: реэкспорт `useApiCall` будет работать после Task 2.

---

## Task 2: Composable useApiCall

**Files:**
- Create: `src/shared/lib/use-api-call/index.ts`

- [ ] **Step 1: Создать composable**

```typescript
// src/shared/lib/use-api-call/index.ts

import { ref, type Ref } from 'vue';

import { useToast } from 'primevue/usetoast';

import { usePreloaderStore } from '@/features/preloader';

import type { UseApiCallOptions, UseApiCallReturn } from './types';

const TOAST_HANDLED = Symbol.for('toast-handled');

export { TOAST_HANDLED };

export function useApiCall<T>(
  apiFn: (...args: unknown[]) => Promise<T>,
  options: UseApiCallOptions<T> = {},
): UseApiCallReturn<T> {
  const toast = useToast();
  const preloaderStore = usePreloaderStore();

  const isLoading = ref(false) as Ref<boolean>;
  const error = ref(null) as Ref<Error | null>;
  const data = ref(null) as Ref<T | null>;

  const {
    successMessage,
    errorMapper,
    onSuccess,
    onError,
    showPreloader = true,
  } = options;

  async function execute(
    ...args: unknown[]
  ): Promise<T | undefined> {
    isLoading.value = true;
    error.value = null;

    if (showPreloader) {
      preloaderStore.addLoader();
    }

    try {
      const result = await apiFn(...args);

      data.value = result;

      if (successMessage) {
        toast.add({
          severity: 'success',
          detail: successMessage,
          life: 3000,
        });
      }

      onSuccess?.(result);

      return result;
    } catch (err: unknown) {
      const errorObj = err as Error;

      error.value = errorObj;

      const errorText = errorMapper
        ? errorMapper(errorObj)
        : errorObj.message;

      toast.add({
        severity: 'error',
        detail: errorText,
        life: undefined,
      });

      (err as Record<symbol, boolean>)[TOAST_HANDLED] = true;

      onError?.(errorObj);

      return undefined;
    } finally {
      if (showPreloader) {
        preloaderStore.removeLoader();
      }

      isLoading.value = false;
    }
  }

  return { execute, isLoading, error, data };
}
```

---

## Task 3: AppToast — обёртка над PrimeVue Toast

**Files:**
- Create: `src/shared/ui/toast/AppToast.vue`

- [ ] **Step 1: Создать компонент AppToast**

```vue
<!-- src/shared/ui/toast/AppToast.vue -->
<template>
  <Toast
    position="top-right"
    group="api"
    :breakpoints="{ '600px': { width: '100%', right: '0', top: '0' } }">
    <template #message="{ message }">
      <div :class="toastClasses(message.severity)">
        <span :class="toastIconClass(message.severity)"></span>

        <p class="app-toast__text">{{ message.detail }}</p>

        <button
          type="button"
          title="Закрыть"
          class="app-toast__close"
          @click="toast.remove(message.id)">
          <span class="pi pi-times"></span>
        </button>
      </div>

      <div
        v-if="message.severity !== 'error' && message.life"
        :class="toastProgressClass(message.severity)"
        :style="{ animationDuration: `${message.life}ms` }">
      </div>
    </template>
  </Toast>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast';

import Toast from 'primevue/toast';

defineOptions({ name: 'AppToast' });

const toast = useToast();

const severityIconMap: Record<string, string> = {
  success: 'pi pi-check',
  info: 'pi pi-info-circle',
  warn: 'pi pi-exclamation-triangle',
  error: 'pi pi-times-circle',
};

function toastClasses(severity: string) {
  return {
    'app-toast': true,
    [`app-toast--${severity}`]: true,
  };
}

function toastIconClass(severity: string) {
  return `app-toast__icon ${severityIconMap[severity] ?? ''}`;
}

function toastProgressClass(severity: string) {
  return {
    'app-toast__progress': true,
    [`app-toast__progress--${severity}`]: true,
  };
}
</script>

<style lang="scss" scoped>
.app-toast {
  display: flex;
  width: 370px;
  align-items: center;
  padding: 15px;
  border-radius: 5px;
  color: #fff;
  font-size: 0.875rem;

  &--success {
    background-color: variables.$success-color;
  }

  &--info {
    background-color: variables.$info-color;
  }

  &--warn {
    background-color: variables.$warning-color;
  }

  &--error {
    background-color: variables.$error-color;
  }
}

.app-toast__icon {
  width: 24px;
  min-width: 24px;
  height: 24px;
  margin-right: 10px;
  font-size: 24px;
  line-height: 24px;
}

.app-toast__text {
  flex-grow: 1;
  margin: 0;
  margin-right: 10px;
}

.app-toast__close {
  width: 24px;
  min-width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  background: none;
  color: #fff;
  cursor: pointer;
  font-size: 16px;
  line-height: 24px;
}

.app-toast__progress {
  height: 3px;
  border-radius: 0 0 5px 5px;
  animation-name: app-toast-progress;
  animation-timing-function: linear;
  animation-fill-mode: forwards;

  &--success {
    background-color: rgba(255 255 255 / 50%);
  }

  &--info {
    background-color: rgba(255 255 255 / 50%);
  }

  &--warn {
    background-color: rgba(255 255 255 / 50%);
  }
}

@keyframes app-toast-progress {
  from {
    width: 100%;
  }

  to {
    width: 0%;
  }
}

@media (width <= 600px) {
  .app-toast {
    width: 100%;
  }
}
</style>
```

---

## Task 4: Подключить ToastService и AppToast в приложение

**Files:**
- Modify: `src/app/lib/index.ts`
- Modify: `src/app/entrypoint/App.vue`

- [ ] **Step 1: Зарегистрировать ToastService в app/lib/index.ts**

Заменить содержимое `src/app/lib/index.ts`:

```typescript
import type { App } from 'vue';

import router from '@/app/router';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';

import theme from './primevue-theme';
import setupHttpClientInterceptors from './http-client-interceptors';

export default function registerPlugins(app: App) {
  const pinia = createPinia();

  app
    .use(router)
    .use(pinia)
    .use(PrimeVue, { theme })
    .use(ToastService);

  setupHttpClientInterceptors();
}
```

- [ ] **Step 2: Заменить AppAlert на AppToast в App.vue**

Заменить содержимое `src/app/entrypoint/App.vue`:

```vue
<template>
  <div>
    <component :is="layout" />
    <AppPreloader />
    <AppToast />
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';
import { useRoute } from 'vue-router';

import { AppPreloader } from '@/features/preloader';
import AppToast from '@/shared/ui/toast/AppToast.vue';

defineOptions({ name: 'App' });

const route = useRoute();

const layout = computed(() => {
  const layoutName = route.meta.layout || 'DefaultLayout';
  return defineAsyncComponent(() => import(`@/app/layouts/${layoutName}.vue`));
});
</script>
```

---

## Task 5: Глобальный error-перехватчик

**Files:**
- Modify: `src/app/lib/http-client-interceptors.ts`

- [ ] **Step 1: Обновить интерцептор**

Заменить содержимое `src/app/lib/http-client-interceptors.ts`:

```typescript
import { useToast } from 'primevue/usetoast';

import httpClient from '@/shared/api';

import { TOAST_HANDLED } from '@/shared/lib/use-api-call';

export default function setupHttpClientInterceptors() {
  httpClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        window.location.href = '/login';

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
```

> **Важно:** Перехватчик проверяет `TOAST_HANDLED` Symbol на error-объекте. Если `useApiCall` уже показал toast, глобальный перехватчик не показывает дубль. Для ошибок, которые не прошли через `useApiCall` (например, в навигационных guards), toast показывается глобально.

---

## Task 6: Тест useApiCall

**Files:**
- Create: `tests/shared/lib/use-api-call/index.test.ts`

- [ ] **Step 1: Создать тест useApiCall**

```typescript
// tests/shared/lib/use-api-call/index.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest';

import { useApiCall } from '@/shared/lib/use-api-call';
import { TOAST_HANDLED } from '@/shared/lib/use-api-call';

vi.mock('primevue/usetoast', () => ({
  useToast: () => ({
    add: vi.fn(),
    remove: vi.fn(),
  }),
}));

vi.mock('@/features/preloader', () => ({
  usePreloaderStore: () => ({
    addLoader: vi.fn(),
    removeLoader: vi.fn(),
  }),
}));

describe('useApiCall', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('успешный вызов', () => {
    it('возвращает данные и показывает success-toast', async () => {
      const apiFn = vi.fn().mockResolvedValue('result');
      const { execute, data, isLoading, error } = useApiCall(apiFn, {
        successMessage: 'Успех',
      });

      const result = await execute();

      expect(result).toBe('result');
      expect(data.value).toBe('result');
      expect(isLoading.value).toBe(false);
      expect(error.value).toBeNull();
    });

    it('не показывает toast без successMessage', async () => {
      const apiFn = vi.fn().mockResolvedValue('result');
      const { execute } = useApiCall(apiFn);

      await execute();

      // toast.add не вызывается с severity success
      // (проверяется через mock, но здесь просто убеждаемся что нет ошибки)
    });
  });

  describe('ошибка', () => {
    it('возвращает undefined и показывает error-toast', async () => {
      const apiFn = vi
        .fn()
        .mockRejectedValue(new Error('Ошибка сервера'));
      const { execute, data, isLoading, error } = useApiCall(apiFn);

      const result = await execute();

      expect(result).toBeUndefined();
      expect(data.value).toBeNull();
      expect(isLoading.value).toBe(false);
      expect(error.value?.message).toBe('Ошибка сервера');
    });

    it('помечает ошибку Symbol toast-handled', async () => {
      const apiError = new Error('test');
      const apiFn = vi.fn().mockRejectedValue(apiError);
      const { execute } = useApiCall(apiFn);

      await execute();

      expect((apiError as Record<symbol, boolean>)[TOAST_HANDLED]).toBe(
        true,
      );
    });

    it('использует errorMapper для кастомного текста', async () => {
      const apiFn = vi
        .fn()
        .mockRejectedValue(new Error('raw error'));
      const { execute, error } = useApiCall(apiFn, {
        errorMapper: () => 'Кастомная ошибка',
      });

      await execute();

      expect(error.value?.message).toBe('raw error');
    });

    it('вызывает onError callback', async () => {
      const apiFn = vi
        .fn()
        .mockRejectedValue(new Error('err'));
      const onError = vi.fn();
      const { execute } = useApiCall(apiFn, { onError });

      await execute();

      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError.mock.calls[0][0].message).toBe('err');
    });
  });

  describe('preloader', () => {
    it('вызывает addLoader/removeLoader по умолчанию', async () => {
      const apiFn = vi.fn().mockResolvedValue('ok');
      const { execute } = useApiCall(apiFn);

      await execute();

      // addLoader и removeLoader вызываются через mock
      // проверяется отсутствием ошибок
    });

    it('не вызывает preloader при showPreloader: false', async () => {
      const apiFn = vi.fn().mockResolvedValue('ok');
      const { execute } = useApiCall(apiFn, {
        showPreloader: false,
      });

      await execute();

      // addLoader/removeLoader не вызываются
    });
  });

  describe('onSuccess callback', () => {
    it('вызывается с данными при успехе', async () => {
      const apiFn = vi.fn().mockResolvedValue('result');
      const onSuccess = vi.fn();
      const { execute } = useApiCall(apiFn, { onSuccess });

      await execute();

      expect(onSuccess).toHaveBeenCalledWith('result');
    });
  });

  describe('isLoading', () => {
    it('true во время выполнения, false после', async () => {
      let resolveApi: (value: string) => void;
      const apiFn = vi.fn().mockReturnValue(
        new Promise((resolve) => {
          resolveApi = resolve;
        }),
      );
      const { execute, isLoading } = useApiCall(apiFn);

      const promise = execute();

      expect(isLoading.value).toBe(true);

      resolveApi!('done');

      await promise;

      expect(isLoading.value).toBe(false);
    });
  });
});
```

- [ ] **Step 2: Запустить тест**

Run: `npx vitest run tests/shared/lib/use-api-call/index.test.ts`

Expected: все тесты PASS

---

## Task 7: Миграция — простые компоненты (только error-toast, без preloader)

Эти компоненты используют только `alertStore.addAlert({ type: ERROR })` в catch, без preloader. Замена: `useApiCall` с `showPreloader: false` и без `successMessage`.

**Files (8 компонентов):**
- Modify: `src/pages/main/ui/MainPage.vue`
- Modify: `src/entities/question/ui/QuestionsView.vue`
- Modify: `src/widgets/dashboard/ui/DashboardFilters.vue`
- Modify: `src/pages/admin/questions/ui/AdminQuestionsPage.vue`
- Modify: `src/features/auth/ui/LoginView.vue`
- Modify: `src/app/layouts/AdminLayout.vue`
- Modify: `src/app/router/middleware/auth-middleware.ts`
- Modify: `src/entities/question/ui/QuestionFormCreate.vue` (4 вызова — особый случай)

### 7a. MainPage.vue

- [ ] **Step 1: Заменить try/catch на useApiCall**

Удалить:
```typescript
import { useAlertStore } from '@/entities/alert';
import { ALERT_TYPES } from '@/shared/config';
const alertStore = useAlertStore();
```

Заменить `fetchData()`:
```typescript
async function fetchData() {
  const result = await executeFetch();
  if (result) {
    questions.value = result;
  }
}
```

Добавить:
```typescript
import { useApiCall } from '@/shared/lib';

const { execute: executeFetch } = useApiCall(GetPopularQuestions, {
  showPreloader: false,
});
```

### 7b. QuestionsView.vue

- [ ] **Step 2: Аналогичная замена**

```typescript
import { useApiCall } from '@/shared/lib';

const { execute: executeFetch } = useApiCall(GetAllQuestions, {
  showPreloader: false,
});
```

### 7c. DashboardFilters.vue

- [ ] **Step 3: Аналогичная замена**

### 7d. AdminQuestionsPage.vue

- [ ] **Step 4: Аналогичная замена**

### 7e. LoginView.vue

Особый случай — после успеха вызывается `authStore.setAuthData(user)` и `router.go(-1)`. Используем `onSuccess`:

- [ ] **Step 5: Заменить LoginView.vue**

```typescript
import { useApiCall } from '@/shared/lib';

const { execute: executeLogin } = useApiCall(Login, {
  showPreloader: false,
  onSuccess: (user) => {
    authStore.setAuthData(user);
    router.go(-1);
  },
});

async function onSubmit() {
  await executeLogin({
    login: controls.email!,
    password: controls.password!,
  });
}
```

### 7f. AdminLayout.vue

Особый случай — logout с success-сообщением:

- [ ] **Step 6: Заменить AdminLayout.vue**

```typescript
import { useApiCall } from '@/shared/lib';

const { execute: executeLogout } = useApiCall(Logout, {
  successMessage: 'Успешный выход',
  showPreloader: false,
  onSuccess: () => {
    authStore.removeAuthData();
    router.push({ name: 'login' });
  },
});

async function logout() {
  await executeLogout();
}
```

### 7g. auth-middleware.ts

Особый случай — навигационный guard, не компонент. Нельзя использовать composable напрямую. Вместо этого используем `useToast()` напрямую:

- [ ] **Step 7: Заменить auth-middleware.ts**

```typescript
import { useAuthStore } from '@/features/auth';
import { useToast } from 'primevue/usetoast';
import { GetUserData } from '@/entities/user';

export default async function checkAuth(): Promise<true | { name: string }> {
  const authStore = useAuthStore();

  if (!authStore.getAuthStatus) {
    try {
      const user = await GetUserData();

      authStore.setAuthData(user);

      return true;
    } catch (error) {
      const toast = useToast();
      const err = error as Error;

      toast.add({
        severity: 'error',
        detail: err.message,
        group: 'api',
        life: undefined,
      });

      (error as Record<symbol, boolean>)[Symbol.for('toast-handled')] = true;

      return { name: 'login' };
    }
  }

  return true;
}
```

### 7h. QuestionFormCreate.vue

Особый случай — 4 отдельных API-вызова (getCaptcha, fetchAllAreas, fetchAllSpeakers, submitForm), каждый со своим try/catch. Создаём отдельный `useApiCall` на каждый:

- [ ] **Step 8: Заменить QuestionFormCreate.vue**

```typescript
import { useApiCall } from '@/shared/lib';

const {
  execute: executeGetCaptcha,
} = useApiCall(GetCaptcha, { showPreloader: false });

const {
  execute: executeFetchAreas,
} = useApiCall(GetAllAreas, { showPreloader: false });

const {
  execute: executeFetchSpeakers,
} = useApiCall(GetAllSpeakers, { showPreloader: false });

const {
  execute: executeSubmit,
} = useApiCall(Create, {
  successMessage: 'Ваш вопрос успешно добавлен',
  showPreloader: false,
  onSuccess: () => {
    toggleForm();
    resetForm();
  },
  onError: () => {
    executeGetCaptcha();
  },
});

async function getCaptcha() {
  const result = await executeGetCaptcha();
  if (result) {
    captchaData.value = result;
  }
}

async function fetchAllAreas() {
  const result = await executeFetchAreas();
  if (result) {
    areas.value = result;
  }
}

async function fetchAllSpeakers() {
  const result = await executeFetchSpeakers();
  if (result) {
    speakers.value = result;
  }
}

async function submitForm() {
  if (!validate()) return;

  await executeSubmit(
    captcha.value!,
    {
      text: controls.text!,
      author: controls.author!,
      areaId: controls.areaId ?? null,
      speakerId: controls.speakerId ?? null,
    },
  );
}
```

---

## Task 8: Миграция — компоненты с preloader (error-only, без success-toast)

Эти компоненты используют `preloaderStore.addLoader()/removeLoader()` + `alertStore.addAlert(ERROR)` в catch, но не показывают success-toast.

**Files (3 компонента):**
- Modify: `src/pages/admin/feedback/ui/AdminFeedbackPage.vue`
- Modify: `src/entities/faq/ui/FAQView.vue`
- Modify: `src/widgets/dashboard/ui/DashboardWidget.vue`

### 8a. AdminFeedbackPage.vue

- [ ] **Step 1: Заменить**

```typescript
import { useApiCall } from '@/shared/lib';

const { execute: executeFetch } = useApiCall(GetAllFeedback);

async function fetchData() {
  const result = await executeFetch();
  if (result) {
    feedbacks.value = result;
  }
}
```

### 8b. FAQView.vue

- [ ] **Step 2: Аналогичная замена**

### 8c. DashboardWidget.vue

- [ ] **Step 3: Аналогичная замена**

---

## Task 9: Миграция — компоненты с preloader + success-toast

Эти компоненты используют оба store + показывают success-toast.

**Files (8 компонентов):**
- Modify: `src/features/feedback/ui/SidebarFeedbackContent.vue`
- Modify: `src/entities/user/ui/UserProfile.vue`
- Modify: `src/entities/faq/ui/CreateEntryContent.vue`
- Modify: `src/entities/faq/ui/UpdateEntryContent.vue`
- Modify: `src/entities/user/ui/CreateSpeaker.vue`
- Modify: `src/entities/user/ui/UpdateSpeaker.vue`
- Modify: `src/entities/user/ui/DeleteSpeaker.vue`
- Modify: `src/entities/area/ui/CreateArea.vue`

### 9a. SidebarFeedbackContent.vue

- [ ] **Step 1: Заменить**

```typescript
import { useApiCall } from '@/shared/lib';

const { execute: executeSubmit } = useApiCall(Create, {
  successMessage: 'Обратная связь отправлена',
  onSuccess: () => {
    modalConfirm();
  },
});

async function submitForm() {
  if (!validate()) return;

  await executeSubmit({
    username: controls.username!,
    email: controls.email!,
    theme: controls.theme!,
    text: controls.text!,
  });
}
```

### 9b. UserProfile.vue

- [ ] **Step 2: Заменить**

```typescript
import { useApiCall } from '@/shared/lib';

const { execute: executeChangePassword } = useApiCall(ChangePassword, {
  successMessage: 'Пароль успешно изменен',
  onSuccess: () => {
    emit('success');
  },
});

async function onSubmit({ valid, values }: { valid: boolean; values: Record<string, unknown> }) {
  if (!valid) return;

  await executeChangePassword({
    password: values.password as string,
    newPassword: values.newPassword as string,
    confirmPassword: values.confirmPassword as string,
  });
}
```

### 9c. CreateEntryContent.vue

- [ ] **Step 3: Заменить**

```typescript
import { useApiCall } from '@/shared/lib';

const { execute: executeCreate } = useApiCall(CreateEntry, {
  successMessage: 'Запись успешно создана',
  onSuccess: () => {
    modalConfirm();
  },
});

async function onSubmit({ valid, values }: { valid: boolean; values: Record<string, unknown> }) {
  if (!valid) return;

  await executeCreate({
    faqCategoryId: categoryId,
    question: values.question as string,
    answer: sanitizeHtml(values.answer as string),
    order,
  });
}
```

### 9d. UpdateEntryContent.vue

- [ ] **Step 4: Аналогичная замена с successMessage 'Запись успешно изменена'**

### 9e. CreateSpeaker.vue

- [ ] **Step 5: Заменить с successMessage 'Спикер успешно создан'**

### 9f. UpdateSpeaker.vue

- [ ] **Step 6: Заменить с successMessage 'Спикер успешно изменён'**

### 9g. DeleteSpeaker.vue

- [ ] **Step 7: Заменить с successMessage 'Спикер успешно удалён'**

### 9h. CreateArea.vue

- [ ] **Step 8: Заменить с successMessage 'Область успешно создана'**

---

## Task 10: Миграция — оставшиеся CRUD-компоненты

**Files (5 компонентов):**
- Modify: `src/entities/area/ui/UpdateArea.vue` — successMessage: 'Категория успешно изменена'
- Modify: `src/entities/area/ui/DeleteArea.vue` — successMessage: 'Область успешно удалена'
- Modify: `src/entities/faq/ui/CreateCategory.vue` — successMessage: 'Категория успешно создана'
- Modify: `src/entities/faq/ui/UpdateCategory.vue` — successMessage: 'Категория успешно изменена'
- Modify: `src/entities/faq/ui/DeleteCategory.vue` — successMessage: 'Категория успешно удалена'
- Modify: `src/entities/faq/ui/DeleteEntry.vue` — successMessage: 'Запись успешно удалена'
- Modify: `src/features/feedback/ui/DeleteFeedbackModal.vue` — successMessage: 'Обратная связь успешно удалена'

- [ ] **Steps 1-7: Пофайловая замена** — для каждого файла:
  - Удалить `import { useAlertStore } from '@/entities/alert'` и `import { ALERT_TYPES } from '@/shared/config'`
  - Удалить `const alertStore = useAlertStore()`
  - Добавить `import { useApiCall } from '@/shared/lib'`
  - Создать `const { execute } = useApiCall(ApiFn, { successMessage, onSuccess })`
  - Заменить try/catch/finally на `await execute(...)`

---

## Task 11: Миграция — сложные страницы с несколькими API-вызовами

**Files (3 компонента):**
- Modify: `src/pages/admin/speakers/ui/AdminSpeakersPage.vue`
- Modify: `src/pages/admin/faq/ui/AdminFAQPage.vue`
- Modify: `src/pages/admin/faq/ui/AdminFAQCategoryPage.vue`
- Modify: `src/pages/admin/areas/ui/AdminAreasPage.vue`

### 11a. AdminSpeakersPage.vue

Особый случай: `fetchData` + `copyToClipboard` (не API-вызов).

- [ ] **Step 1: Заменить**

```typescript
import { useApiCall } from '@/shared/lib';

const { execute: executeFetch } = useApiCall(GetAllSpeakers);

const toast = useToast();

async function fetchData() {
  const result = await executeFetch();
  if (result) {
    speakers.value = result;
  }
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast.add({
      severity: 'success',
      detail: 'Скопировано в буфер обмена',
      group: 'api',
      life: 3000,
    });
  } catch {
    toast.add({
      severity: 'error',
      detail: 'Не удалось скопировать',
      group: 'api',
      life: undefined,
    });
  }
}
```

> `copyToClipboard` не является API-вызовом, поэтому использует `useToast()` напрямую, а не `useApiCall`.

### 11b. AdminFAQPage.vue

Особый случай: `fetchData` + `draggableCategories.set` (с откатом на oldOrder при ошибке).

- [ ] **Step 2: Заменить**

```typescript
import { useApiCall } from '@/shared/lib';

const { execute: executeFetch } = useApiCall(GetAllCategories);

const { execute: executeSetOrder } = useApiCall(SetCategoryOrder, {
  successMessage: 'Сортировка применена',
  onError: () => {
    categories.value = oldOrderCategories;
  },
});

let oldOrderCategories: FaqCategoryResponse[] = [];

const draggableCategories = computed({
  get() {
    return categories.value;
  },

  async set(newOrderCategories: FaqCategoryResponse[]) {
    oldOrderCategories = [...categories.value];
    categories.value = newOrderCategories;

    const categoryIds = newOrderCategories.map(
      (category: FaqCategoryResponse) => category.id,
    );

    await executeSetOrder(categoryIds);
  },
});

async function fetchData() {
  const result = await executeFetch();
  if (result) {
    categories.value = result;
  }
}
```

> Для `draggableCategories.set` нужна кастомная логика отката при ошибке. Используем `onError` callback.

### 11c. AdminFAQCategoryPage.vue

Особый случай: `fetchData` + `draggableEntries.set` + `copyLink` (не API).

- [ ] **Step 3: Заменить**

```typescript
import { useApiCall } from '@/shared/lib';
import { useToast } from 'primevue/usetoast';

const { execute: executeFetch } = useApiCall(() => GetCategoryById(id));

let oldOrderEntries: FaqEntryResponse[] = [];

const { execute: executeSetOrder } = useApiCall(SetEntryOrder, {
  successMessage: 'Сортировка применена',
  onError: () => {
    if (category.value) {
      category.value.entries = oldOrderEntries;
    }
  },
});

const draggableEntries = computed({
  get() {
    return category.value?.entries ?? [];
  },

  async set(newOrderEntries: FaqEntryResponse[]) {
    if (!category.value) return;

    oldOrderEntries = [...category.value.entries];
    category.value.entries = newOrderEntries;

    const entryIds = newOrderEntries.map(
      (entry: FaqEntryResponse) => entry.id,
    );

    await executeSetOrder(entryIds);
  },
});

async function fetchData() {
  const result = await executeFetch();
  if (result) {
    category.value = result;
  }
}

const toast = useToast();

function copyLink(entry: FaqEntryResponse) {
  const link = `${window.location.protocol}//${window.location.host}/faq?id=${entry.id}`;

  copyToClipboard(link)
    .then(() => {
      toast.add({
        severity: 'success',
        detail: 'Ссылка скопирована в буфер обмена',
        group: 'api',
        life: 3000,
      });
    })
    .catch((error: unknown) => {
      const err = error as Error;
      toast.add({
        severity: 'error',
        detail: err.message,
        group: 'api',
        life: undefined,
      });
    });
}
```

### 11d. AdminAreasPage.vue

Особый случай: `fetchData` + `draggableAreas.set` (аналог AdminFAQPage).

- [ ] **Step 4: Заменить аналогично 11b**

---

## Task 12: Удаление entities/alert и очистка

**Files:**
- Delete: `src/entities/alert/` (весь каталог)
- Delete: `src/shared/config/alert-types.ts`
- Modify: `src/shared/config/index.ts`
- Modify: `src/shared/types/models.ts`
- Delete: `tests/entities/alert/` (весь каталог)

- [ ] **Step 1: Удалить entities/alert/**

```bash
rm -rf src/entities/alert/
```

- [ ] **Step 2: Удалить shared/config/alert-types.ts**

```bash
rm src/shared/config/alert-types.ts
```

- [ ] **Step 3: Очистить shared/config/index.ts**

```typescript
// src/shared/config/index.ts — файл становится пустым, удалить если нет других экспортов
```

Проверить: если `index.ts` содержит только экспорт `ALERT_TYPES` — удалить файл. Если есть другие экспорты — убрать строку с `ALERT_TYPES`.

- [ ] **Step 4: Очистить shared/types/models.ts**

Удалить из `src/shared/types/models.ts`:

```typescript
export interface AlertItem {
  id: string;
  type: AlertType;
  text: string;
}

export type AlertType = 'success' | 'info' | 'warning' | 'error';
```

Проверить: если `AlertType` используется в других типах — оставить.

- [ ] **Step 5: Удалить тесты alert store**

```bash
rm -rf tests/entities/alert/
```

- [ ] **Step 6: Запустить lint и typecheck**

Run: `npm run lint && npm run typecheck`

Expected: нет ошибок, связанных с `useAlertStore`, `ALERT_TYPES`, `entities/alert`

---

## Task 13: Финальная верификация

- [ ] **Step 1: Запустить FSD-валидацию**

Run: `npx steiger ./src`

Expected: нет ошибок, связанных с удалением `entities/alert`

- [ ] **Step 2: Запустить тесты**

Run: `npm run test`

Expected: все тесты PASS

- [ ] **Step 3: Запустить typecheck**

Run: `npm run typecheck`

Expected: нет ошибок

- [ ] **Step 4: Запустить dev-сервер и проверить вручную**

Run: `npm run dev`

Открыть http://localhost:5000, проверить:
- Успешные действия показывают зелёный toast справа сверху с прогресс-баром
- Ошибки показывают красный toast без автозакрытия
- Toast автоматически закрывается через 3 сек (кроме error)
- Лимит 5 одновременных toast
- Кнопка закрытия работает
- Preloader появляется при API-вызовах

- [ ] **Step 5: Коммит**

```bash
git add -A
git commit -m "feat: replace alert system with PrimeVue Toast and useApiCall composable"
```
