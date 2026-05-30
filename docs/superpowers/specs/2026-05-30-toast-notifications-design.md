# Замена системы уведомлений на PrimeVue Toast с composable useApiCall

## Цель

Заменить собственную систему уведомлений (`entities/alert`) на PrimeVue Toast с централизованной обработкой успехов и ошибок через composable `useApiCall`. Устранить дублирование try/catch в 22+ компонентах.

## Мотивация

- **Дублирование кода:** 22+ компонентов содержат идентичный try/catch с `alertStore.addAlert()` и `preloaderStore`
- **Отсутствие прогресс-бара:** текущие алерты не показывают оставшееся время до закрытия
- **Нет лимита:** неограниченное число одновременных уведомлений
- **PrimeVue уже в проекте:** ToastService доступен из коробки, нет смысла в собственной реализации

## Подход

**Composable `useApiCall` + PrimeVue Toast** (подход B): composable оборачивает любой async-вызов, автоматически показывает toast при успехе/ошибке и управляет preloader. Компоненты не пишут try/catch.

Не включается: рефакторинг бизнес-логики, изменение FSD-структуры (кроме удаления `entities/alert`), добавление новых API-эндпоинтов.

## Стек миграции

| Было | Станет |
|---|---|
| `entities/alert/` (Pinia store + AppAlert + AppAlertItem) | PrimeVue ToastService + `shared/ui/toast/AppToast.vue` |
| `ALERT_TYPES` из `shared/config` | PrimeVue severity: `success`, `info`, `warn`, `error` |
| `useAlertStore()` в 22+ компонентах | `useApiCall()` composable |
| try/catch/finally с preloader в каждом компоненте | `execute()` из `useApiCall` |
| Ручной `addAlert()` при успехе | `successMessage` в опциях `useApiCall` |
| Только 401-перехватчик | Глобальный error-перехватчик для необработанных ошибок |

## Архитектура и FSD-размещение

### Удаляется

- `entities/alert/` — весь слайс (store, компоненты, иконки, pseudorandom-generator)
- `shared/config/alert-types.ts` — константа `ALERT_TYPES`
- Ссылки на `useAlertStore` и `ALERT_TYPES` из 22+ файлов

### Создаётся

| Путь | Назначение |
|------|-----------|
| `shared/ui/toast/AppToast.vue` | Обёртка над `<Toast>` из PrimeVue, конфигурация позиции/лимита |
| `shared/lib/use-api-call/index.ts` | Composable `useApiCall` — централизует API-вызов + toast + preloader |
| `shared/lib/use-api-call/types.ts` | Типы опций `useApiCall` |

### Изменяется

| Путь | Изменение |
|------|-----------|
| `app/entrypoint/App.vue` | Заменить `<AppAlert />` на `<AppToast />` |
| `app/lib/index.ts` | Подключить PrimeVue ToastService как плагин |
| `app/lib/http-client-interceptors.ts` | Глобальный показ toast при ошибках (не только 401) |
| 22+ UI-компонентов | Заменить try/catch на `useApiCall()` |

### FSD-обоснование

- `AppToast` — `shared/ui/` (переиспользуемый UI-компонент без бизнес-логики)
- `useApiCall` — `shared/lib/` (утилита без привязки к конкретному слайсу)
- ToastService — `app/lib/` (глобальный плагин приложения)

## Composable useApiCall

### Интерфейс

```typescript
interface UseApiCallOptions<T> {
  successMessage?: string;
  errorMapper?: (error: Error) => string;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  showPreloader?: boolean; // по умолчанию true
}

function useApiCall<T>(
  apiFn: (...args: any[]) => Promise<T>,
  options?: UseApiCallOptions<T>,
): {
  execute: (...args: any[]) => Promise<T | undefined>;
  isLoading: Ref<boolean>;
  error: Ref<Error | null>;
  data: Ref<T | null>;
}
```

### Поведение execute()

1. Ставит `isLoading = true`, добавляет preloader (если `showPreloader !== false`)
2. Вызывает `apiFn(...args)`
3. При успехе — показывает success-toast, вызывает `onSuccess`, возвращает данные
4. При ошибке — показывает error-toast (без автозакрытия), вызывает `onError`, возвращает `undefined`
5. В `finally` — снимает preloader, `isLoading = false`

### Глобальный интерцептор (http-client-interceptors.ts)

- **401** — редирект на `/login` (как сейчас)
- **Сетевые ошибки / 5xx** — показывает error-toast только если `useApiCall` не обработал ошибку сам
- Флаг `Symbol.for('toast-handled')` на error-объекте предотвращает дубль toast (Symbol вместо строкового ключа для избежания конфликтов)

### Escape-hatch

- `showPreloader: false` — без preloader
- `successMessage: undefined` — без toast при успехе
- Прямой вызов `useToast()` для нестандартных кейсов (без `useApiCall`)

## Конфигурация PrimeVue Toast

### AppToast.vue

Обёртка с предустановками:

```vue
<Toast
  position="top-right"
  :breakpoints="{ '600px': { width: '100%', right: '0', top: '0' } }"
>
  <template #message="{ message }">
    <!-- Кастомный шаблон: иконка + текст + прогресс-бар -->
  </template>
</Toast>
```

### Параметры

| Параметр | Значение |
|----------|---------|
| Позиция | `top-right` (как сейчас) |
| Лимит | 5 одновременных toast |
| Ширина | 370px (300px на экранах <= 600px) |
| Z-index | 1000 |

### Типы toast и поведение

| Тип | Иконка | Авто-закрытие | Цвет |
|-----|--------|---------------|------|
| success | ✓ | 3 сек | Зелёный (#4caf50) |
| info | ℹ | 3 сек | Синий (#2196f3) |
| warn | ⚠ | 3 сек | Оранжевый (#fb8c00) |
| error | ✕ | Без автозакрытия | Красный (#ff5252) |

### Прогресс-бар

Тонкая полоска внизу toast, анимированное уменьшение ширины от 100% до 0% за время `life`. Реализуется через `<template #message>` — кастомный рендер с CSS-анимацией. Для error-типа прогресс-бар не показывается.

### Кнопка закрытия

Есть для всех типов (как сейчас).

## Миграция — замена в 22+ компонентах

### Паттерн замены

**Было:**

```typescript
import { useAlertStore } from '@/entities/alert';
import { ALERT_TYPES } from '@/shared/config';

const alertStore = useAlertStore();
const preloaderStore = usePreloaderStore();

try {
  preloaderStore.addLoader();
  await someAction();
  alertStore.addAlert({ type: ALERT_TYPES.SUCCESS, text: 'Сообщение' });
} catch (error) {
  const err = error as Error;
  alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: err.message });
} finally {
  preloaderStore.removeLoader();
}
```

**Станет:**

```typescript
import { useApiCall } from '@/shared/lib';

const { execute } = useApiCall(someAction, { successMessage: 'Сообщение' });

await execute();
```

### Порядок миграции

1. Подключить ToastService в `app/lib/index.ts` + зарегистрировать `AppToast` в `App.vue`
2. Создать `useApiCall` в `shared/lib/`
3. Обновить `http-client-interceptors.ts` — глобальная обработка ошибок
4. Пофайлово заменить try/catch на `useApiCall` в 22+ компонентах
5. Удалить `entities/alert/` и `shared/config/alert-types.ts`
6. Удалить из `shared/config/index.ts` реэкспорт `ALERT_TYPES`

### Особые кейсы

- **Несколько API-вызовов** — отдельный `useApiCall` на каждый вызов (у каждого свой `successMessage`)
- **Без уведомления об успехе** — `successMessage` не указан, toast не показывается
- **Кастомная логика в catch** — `onError` callback или прямой `useToast()` без `useApiCall`
