# Vitest для Pinia Stores — Дизайн

## Цель

Настроить Vitest и написать тесты для 3 Pinia Composition Stores. Тесты — сеть безопасности перед возможной миграцией на TypeScript.

## Scope

Только stores:
- `entities/alert/store` — useAlertStore
- `features/auth/store` — useAuthStore
- `features/preloader/store` — usePreloaderStore

## Структура файлов

```
vitest.config.js
tests/
  setup.js
  entities/alert/store/index.test.js
  features/auth/store/index.test.js
  features/preloader/store/index.test.js
```

Тесты в корневой директории `tests/` — не нарушают FSD, steiger не жалуется.

## Зависимости

```
npm install -D vitest jsdom @vue/test-utils
```

- `vitest` — test runner
- `jsdom` — environment для Pinia (setTimeout в alert store)
- `@vue/test-utils` — для будущего расширения на компоненты

## Конфигурация

### vitest.config.js

- Алиас `@` → `./src`
- `environment: 'jsdom'`
- `setupFiles: ['./tests/setup.js']`
- `globals: true`
- `css: false`

### tests/setup.js

Глобальный `beforeEach`: `createPinia()` + `setActivePinia()` — свежая Pinia для каждого теста.

### package.json — скрипты

- `"test": "vitest run"`
- `"test:watch": "vitest"`

## Тест-кейсы

### usePreloaderStore

| Кейс | Описание |
|------|----------|
| Начальное состояние | loadings === 0, showPreloader === false |
| addLoader | Инкремент loadings, showPreloader → true |
| removeLoader при loadings > 0 | Декремент loadings |
| removeLoader при loadings === 0 | Не уходит в минус |

### useAuthStore

| Кейс | Описание |
|------|----------|
| Начальное состояние | isAuthorized === false, userData === null |
| setAuthData | Устанавливает пользователя, isAuthorized → true |
| removeAuthData | Сбрасывает, isAuthorized → false, userData === null |
| getAuthStatus / getUserData | Computed возвращают актуальные значения |

### useAlertStore

| Кейс | Описание |
|------|----------|
| Начальное состояние | alerts === [], getAlerts === [] |
| addAlert (не error) | Добавляет alert, auto-dismiss через delay ms |
| addAlert (error) | Добавляется, не удаляется автоматически |
| removeAlert | Удаляет alert по id |
| Auto-dismiss | vi.useFakeTimers() для проверки setTimeout |

generateId не мокается — pseudorandom достаточно.

## Стиль

- `describe` / `it` — консистентно с Vue/Pinia документацией
- AAA-паттерн: Arrange → Act → Assert
- `vi.useFakeTimers()` только в alert store
