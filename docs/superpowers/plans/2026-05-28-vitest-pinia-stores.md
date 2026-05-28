# Vitest для Pinia Stores — План реализации

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Настроить Vitest и покрыть тестами 3 Pinia Composition Stores

**Architecture:** Корневая директория `tests/` с зеркальной структурой FSD-слайсов. Глобальный setup с `createPinia()` + `setActivePinia()` в `beforeEach`. Отдельный `vitest.config.js` с алиасом `@`. Fake timers для alert store.

**Tech Stack:** Vitest, jsdom, @vue/test-utils, Pinia

---

## Файловая структура

| Действие | Путь | Назначение |
|----------|------|------------|
| Create | `vitest.config.js` | Конфиг Vitest (алиас, env, setup, globals) |
| Create | `tests/setup.js` | Глобальный beforeEach — свежая Pinia |
| Create | `tests/features/preloader/store/index.test.js` | Тесты usePreloaderStore |
| Create | `tests/features/auth/store/index.test.js` | Тесты useAuthStore |
| Create | `tests/entities/alert/store/index.test.js` | Тесты useAlertStore |
| Modify | `package.json` | Добавить vitest, jsdom, @vue/test-utils; скрипты test/test:watch |
| Modify | `jsconfig.json` | Exclude tests/ |

---

### Task 1: Установка зависимостей

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Установить пакеты**

Run:
```bash
npm install -D vitest jsdom @vue/test-utils
```

Expected: `added X packages` без ошибок

- [ ] **Step 2: Проверить установку**

Run:
```bash
npx vitest --version
```

Expected: версия vitest выводится без ошибок

---

### Task 2: Конфигурация Vitest

**Files:**
- Create: `vitest.config.js`
- Create: `tests/setup.js`
- Modify: `jsconfig.json`

- [ ] **Step 1: Создать vitest.config.js**

```js
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: [
      {
        find: '@',
        replacement: fileURLToPath(new URL('./src', import.meta.url)),
      },
    ],
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.js'],
    globals: true,
    css: false,
  },
});
```

- [ ] **Step 2: Создать tests/setup.js**

```js
import { createPinia, setActivePinia } from 'pinia';

beforeEach(() => {
  setActivePinia(createPinia());
});
```

- [ ] **Step 3: Обновить jsconfig.json — добавить tests/ в exclude**

Текущий `jsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "exclude": ["node_modules", "dist"]
}
```

Заменить на:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "exclude": ["node_modules", "dist", "tests"]
}
```

- [ ] **Step 4: Добавить скрипты в package.json**

В секцию `"scripts"` добавить:
```json
"test": "vitest run",
"test:watch": "vitest"
```

Итоговая секция scripts:
```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "test": "vitest run",
  "test:watch": "vitest",
  "prettier:check": "prettier ./src --check",
  "eslint:check": "eslint ./src/**/*.{vue,js}",
  "stylelint:check": "stylelint ./src/**/*.{vue,scss,css}",
  "lint": "npm run prettier:check && npm run eslint:check && npm run stylelint:check",
  "fsd:check": "steiger ./src",
  "husky:prepare": "husky || true",
  "commit": "better-commits"
}
```

- [ ] **Step 5: Проверить что Vitest запускается**

Run:
```bash
npx vitest run
```

Expected: `no test files found` — это нормально, тестов ещё нет

- [ ] **Step 6: Коммит конфигурации**

```bash
git add vitest.config.js tests/setup.js jsconfig.json package.json package-lock.json
git commit -m "chore: add vitest configuration for pinia stores"
```

---

### Task 3: Тесты usePreloaderStore

**Files:**
- Create: `tests/features/preloader/store/index.test.js`
- Reference: `src/features/preloader/store/index.js`

Store реализация (для справки):
```js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const usePreloaderStore = defineStore('preloader', () => {
  const loadings = ref(0);
  const showPreloader = computed(() => !!loadings.value);

  function addLoader() {
    loadings.value += 1;
  }

  function removeLoader() {
    if (loadings.value > 0) {
      loadings.value -= 1;
    }
  }

  return { loadings, showPreloader, addLoader, removeLoader };
});
```

- [ ] **Step 1: Написать тесты**

```js
import { usePreloaderStore } from '@/features/preloader';

describe('usePreloaderStore', () => {
  describe('начальное состояние', () => {
    it('loadings = 0', () => {
      const store = usePreloaderStore();

      expect(store.loadings).toBe(0);
    });

    it('showPreloader = false', () => {
      const store = usePreloaderStore();

      expect(store.showPreloader).toBe(false);
    });
  });

  describe('addLoader', () => {
    it('инкрементит loadings', () => {
      const store = usePreloaderStore();

      store.addLoader();

      expect(store.loadings).toBe(1);
    });

    it('showPreloader = true при loadings > 0', () => {
      const store = usePreloaderStore();

      store.addLoader();

      expect(store.showPreloader).toBe(true);
    });
  });

  describe('removeLoader', () => {
    it('декрементит loadings при loadings > 0', () => {
      const store = usePreloaderStore();

      store.addLoader();
      store.addLoader();
      store.removeLoader();

      expect(store.loadings).toBe(1);
    });

    it('не уходит в минус при loadings = 0', () => {
      const store = usePreloaderStore();

      store.removeLoader();

      expect(store.loadings).toBe(0);
    });
  });
});
```

- [ ] **Step 2: Запустить тесты**

Run:
```bash
npx vitest run tests/features/preloader
```

Expected: 4 tests passed

- [ ] **Step 3: Коммит**

```bash
git add tests/features/preloader/store/index.test.js
git commit -m "test: add usePreloaderStore tests"
```

---

### Task 4: Тесты useAuthStore

**Files:**
- Create: `tests/features/auth/store/index.test.js`
- Reference: `src/features/auth/store/index.js`

Store реализация (для справки):
```js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const isAuthorized = ref(false);
  const userData = ref(null);

  const getAuthStatus = computed(() => isAuthorized.value);
  const getUserData = computed(() => userData.value);

  function setAuthData(user) {
    userData.value = user;
    isAuthorized.value = true;
  }

  function removeAuthData() {
    userData.value = null;
    isAuthorized.value = false;
  }

  return {
    isAuthorized,
    userData,
    getAuthStatus,
    getUserData,
    setAuthData,
    removeAuthData,
  };
});
```

- [ ] **Step 1: Написать тесты**

```js
import { useAuthStore } from '@/features/auth';

describe('useAuthStore', () => {
  describe('начальное состояние', () => {
    it('isAuthorized = false', () => {
      const store = useAuthStore();

      expect(store.isAuthorized).toBe(false);
    });

    it('userData = null', () => {
      const store = useAuthStore();

      expect(store.userData).toBeNull();
    });
  });

  describe('setAuthData', () => {
    it('устанавливает userData', () => {
      const store = useAuthStore();
      const user = { id: 1, name: 'Admin' };

      store.setAuthData(user);

      expect(store.userData).toEqual(user);
    });

    it('isAuthorized = true', () => {
      const store = useAuthStore();

      store.setAuthData({ id: 1, name: 'Admin' });

      expect(store.isAuthorized).toBe(true);
    });
  });

  describe('removeAuthData', () => {
    it('сбрасывает userData в null', () => {
      const store = useAuthStore();

      store.setAuthData({ id: 1, name: 'Admin' });
      store.removeAuthData();

      expect(store.userData).toBeNull();
    });

    it('isAuthorized = false', () => {
      const store = useAuthStore();

      store.setAuthData({ id: 1, name: 'Admin' });
      store.removeAuthData();

      expect(store.isAuthorized).toBe(false);
    });
  });

  describe('computed', () => {
    it('getAuthStatus возвращает isAuthorized', () => {
      const store = useAuthStore();

      expect(store.getAuthStatus).toBe(false);

      store.setAuthData({ id: 1 });

      expect(store.getAuthStatus).toBe(true);
    });

    it('getUserData возвращает userData', () => {
      const store = useAuthStore();
      const user = { id: 1, name: 'Admin' };

      expect(store.getUserData).toBeNull();

      store.setAuthData(user);

      expect(store.getUserData).toEqual(user);
    });
  });
});
```

- [ ] **Step 2: Запустить тесты**

Run:
```bash
npx vitest run tests/features/auth
```

Expected: 6 tests passed

- [ ] **Step 3: Коммит**

```bash
git add tests/features/auth/store/index.test.js
git commit -m "test: add useAuthStore tests"
```

---

### Task 5: Тесты useAlertStore

**Files:**
- Create: `tests/entities/alert/store/index.test.js`
- Reference: `src/entities/alert/store/index.js`
- Reference: `src/entities/alert/lib/pseudorandom-generator.js`

Store реализация (для справки):
```js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

import generateId from '../lib/pseudorandom-generator';

export const useAlertStore = defineStore('alert', () => {
  const alerts = ref([]);

  const getAlerts = computed(() => alerts.value);

  function addAlert({ type, text, delay }) {
    const id = generateId();

    alerts.value.push({ id, type, text });

    if (type !== 'error') {
      setTimeout(() => {
        removeAlert(id);
      }, delay ?? 3000);
    }
  }

  function removeAlert(id) {
    alerts.value = alerts.value.filter((alert) => alert.id !== id);
  }

  return { alerts, getAlerts, addAlert, removeAlert };
});
```

- [ ] **Step 1: Написать тесты**

```js
import { useAlertStore } from '@/entities/alert';

describe('useAlertStore', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('начальное состояние', () => {
    it('alerts = []', () => {
      const store = useAlertStore();

      expect(store.alerts).toEqual([]);
    });

    it('getAlerts = []', () => {
      const store = useAlertStore();

      expect(store.getAlerts).toEqual([]);
    });
  });

  describe('addAlert', () => {
    it('добавляет alert в массив', () => {
      const store = useAlertStore();

      store.addAlert({ type: 'success', text: 'Успех' });

      expect(store.alerts).toHaveLength(1);
      expect(store.alerts[0].type).toBe('success');
      expect(store.alerts[0].text).toBe('Успех');
    });

    it('авто-удаление через delay мс (type !== error)', () => {
      const store = useAlertStore();

      store.addAlert({ type: 'success', text: 'Успех', delay: 5000 });

      expect(store.alerts).toHaveLength(1);

      vi.advanceTimersByTime(4999);

      expect(store.alerts).toHaveLength(1);

      vi.advanceTimersByTime(1);

      expect(store.alerts).toHaveLength(0);
    });

    it('авто-удаление через 3000 мс по умолчанию (delay не указан)', () => {
      const store = useAlertStore();

      store.addAlert({ type: 'info', text: 'Инфо' });

      vi.advanceTimersByTime(2999);

      expect(store.alerts).toHaveLength(1);

      vi.advanceTimersByTime(1);

      expect(store.alerts).toHaveLength(0);
    });

    it('не удаляет error-алерт автоматически', () => {
      const store = useAlertStore();

      store.addAlert({ type: 'error', text: 'Ошибка', delay: 1000 });

      vi.advanceTimersByTime(10000);

      expect(store.alerts).toHaveLength(1);
    });
  });

  describe('removeAlert', () => {
    it('удаляет alert по id', () => {
      const store = useAlertStore();

      store.addAlert({ type: 'success', text: 'Первый' });
      store.addAlert({ type: 'info', text: 'Второй' });

      const id = store.alerts[0].id;

      store.removeAlert(id);

      expect(store.alerts).toHaveLength(1);
      expect(store.alerts[0].text).toBe('Второй');
    });

    it('не падает при несуществующем id', () => {
      const store = useAlertStore();

      store.addAlert({ type: 'success', text: 'Тест' });

      store.removeAlert('nonexistent-id');

      expect(store.alerts).toHaveLength(1);
    });
  });
});
```

- [ ] **Step 2: Запустить тесты**

Run:
```bash
npx vitest run tests/entities/alert
```

Expected: 7 tests passed

- [ ] **Step 3: Коммит**

```bash
git add tests/entities/alert/store/index.test.js
git commit -m "test: add useAlertStore tests"
```

---

### Task 6: Полная верификация

- [ ] **Step 1: Запустить все тесты**

Run:
```bash
npm test
```

Expected: 17 tests passed (4 + 6 + 7), 0 failed

- [ ] **Step 2: Запустить lint**

Run:
```bash
npm run lint
```

Expected: 0 errors, 0 warnings

- [ ] **Step 3: Запустить FSD-проверку**

Run:
```bash
npm run fsd:check
```

Expected: нет новых ошибок (существующие ложные срабатывания на insignificant-slice допустимы)
