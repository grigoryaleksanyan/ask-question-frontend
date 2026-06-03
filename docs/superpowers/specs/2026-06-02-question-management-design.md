# Управление вопросами на фронтенде

## Контекст

На бэкенде реализована статусная модель вопросов: `QuestionStatus` (New=0, InFocus=1, Answered=2) + поле `Comment` + endpoints `ChangeStatus` и `SetComment`. На фронтенде API-функции `ChangeQuestionStatus` и `SetQuestionComment` существуют, но не используются в UI. Компоненты содержат дублированную логику маппинга статусов и ссылку на несуществующий статус `WITH_COMMENT`.

## Решения

- **3 статуса**: New=0, InFocus=1, Answered=2 (AGENTS.md бэкенда устарел — WithComment нет)
- **Спикер** может менять статус и комментировать свои вопросы (бэкенд уже поддерживает)
- **Управление** — только в админке (публичные страницы — только чтение)
- **UX**: Dropdown-статус в ячейке таблицы + SidebarModal для комментария
- **Массовые действия**: смена статуса + удаление
- **Публичные страницы**: показывать статус (StatusDot) + комментарий
- **Пагинация** в админке
- **Архитектура**: гибридный FSD-подход — отображение в `entities/question`, действия в `features/manage-question`

---

## Секция 1: Исправление типов и конфига

### Проблема

- `QuestionCard.vue` ссылается на `QUESTION_STATUSES.WITH_COMMENT` — не существует
- Логика маппинга статус→цвет/лейбл дублируется через switch в QuestionCard, QuestionListItem, QuestionIdView, AdminQuestionsPage

### Изменения

**`entities/question/config/question-statuses.ts`** — расширить конфиг, добавив утилиты:

```ts
import { QuestionStatusId } from '@/shared/types';
import type { QuestionStatus } from '@/shared/types';

const QUESTION_STATUSES: Record<string, QuestionStatus> = {
  NEW: {
    STATUS_ID: QuestionStatusId.New,
    TITLE: 'новый',
    COLOR: '#6B7CF6',
  },
  IN_FOCUS: {
    STATUS_ID: QuestionStatusId.InFocus,
    TITLE: 'в фокусе',
    COLOR: '#2AA89A',
  },
  ANSWERED: {
    STATUS_ID: QuestionStatusId.Answered,
    TITLE: 'отвеченный',
    COLOR: '#45BF8A',
  },
};

export const questionStatusMap: Record<
  QuestionStatusId,
  { color: string; label: string }
> = {
  [QuestionStatusId.New]: {
    color: QUESTION_STATUSES.NEW.COLOR,
    label: QUESTION_STATUSES.NEW.TITLE,
  },
  [QuestionStatusId.InFocus]: {
    color: QUESTION_STATUSES.IN_FOCUS.COLOR,
    label: QUESTION_STATUSES.IN_FOCUS.TITLE,
  },
  [QuestionStatusId.Answered]: {
    color: QUESTION_STATUSES.ANSWERED.COLOR,
    label: QUESTION_STATUSES.ANSWERED.TITLE,
  },
};

export function getStatusColor(status: QuestionStatusId): string {
  return questionStatusMap[status]?.color ?? QUESTION_STATUSES.ANSWERED.COLOR;
}

export function getStatusLabel(status: QuestionStatusId): string {
  return questionStatusMap[status]?.label ?? '';
}

export default QUESTION_STATUSES;
```

**Экспорт из `entities/question/index.ts`** — добавить:

```ts
export { questionStatusMap, getStatusColor, getStatusLabel } from './config/question-statuses';
```

**Рефакторинг компонентов** — заменить switch на `getStatusColor`/`getStatusLabel`:
- `QuestionCard.vue` — убрать switch, убрать `WITH_COMMENT`, использовать `getStatusColor`
- `QuestionListItem.vue` — убрать switch, использовать `getStatusColor`
- `QuestionIdView.vue` — убрать switch, использовать `getStatusColor`/`getStatusLabel`
- `QuestionStatusIcon.vue` — использовать `questionStatusMap` вместо локального маппинга
- `AdminQuestionsPage.vue` — убрать `getStatusColor`/`getStatusLabel` локальные функции, использовать из entities

---

## Секция 2: Фича `features/manage-question`

### Структура

```
features/manage-question/
  ui/
    QuestionStatusDropdown.vue
    QuestionCommentButton.vue
    QuestionBulkActions.vue
  index.ts
```

### QuestionStatusDropdown

PrimeVue Select для смены статуса inline в таблице.

- **Props**: `status: QuestionStatusId`, `questionId: string`
- Опции: три значения из `questionStatusMap`
- При выборе — вызов `ChangeQuestionStatus(id, newStatus)` из entities
- Optimistic update: немедленно обновляет локальный статус через emit; при ошибке — откат через refetch, ошибка показывается через alert store
- Отображение: цветной StatusDot + лейбл в текущем значении

### QuestionCommentButton

Кнопка-иконка для открытия SidebarModal с комментарием.

- **Props**: `questionId: string`, `comment: string | null`
- Иконка 💬: зелёная при наличии комментария, серая при отсутствии
- Клик → SidebarModal (из `shared/ui/sidebar-modal/`, promise-based API) с textarea + кнопка «Сохранить»
- Сохранение через `SetQuestionComment(id, comment)`
- Optimistic update: обновляет комментарий через emit; при ошибке — refetch, уведомление через alert store

### QuestionBulkActions

Панель массовых операций над выделенными вопросами.

- **Props**: `selectedIds: Set<string>`
- Видима только при `selectedIds.size > 0`
- PrimeVue Select для выбора целевого статуса + кнопка «Применить»
- Кнопка «Удалить» с подтверждением через PrimeVue ConfirmDialog
- Вызывает `ChangeQuestionStatus`/`DeleteQuestion` для каждого ID через `Promise.allSettled`
- После завершения всех операций — единый refetch списка; ошибки показываются через alert store

### Public API (`index.ts`)

```ts
export { default as QuestionStatusDropdown } from './ui/QuestionStatusDropdown.vue';
export { default as QuestionCommentButton } from './ui/QuestionCommentButton.vue';
export { default as QuestionBulkActions } from './ui/QuestionBulkActions.vue';
```

---

## Секция 3: Редизайн AdminQuestionsPage

### Структура таблицы

Колонки: `☐ | Вопрос | Зона | Спикер | Статус | 💬 | ▲ | Дата`

- **Статус** — `QuestionStatusDropdown` вместо StatusDot
- **💬** — `QuestionCommentButton`
- Под таблицей — `QuestionBulkActions` (при выделении)

### Пагинация

- Добавить `page`, `pageSize` в вызов `GetAllQuestions`
- Компонент пагинации внизу таблицы (аналог QuestionsView)
- Переключение страницы → refetch с параметрами

### Фильтрация по спикеру

- Спикер видит только свои вопросы — фильтр `speakerId` из auth-store (`useAuthStore().userId`)
- Админ видит все вопросы

### Табы

- Сохранить: Все | Новые | В фокусе | Отвеченные
- Переключение таба → API-запрос с `status` вместо клиентской фильтрации
- Таб «Все» — без параметра `status`

### Поток данных

1. Таб/пагинация/фильтр → `GetAllQuestions(params)` → `questions` ref
2. Dropdown-изменение → `ChangeQuestionStatus(id, status)` → optimistic update через emit; при ошибке — refetch + alert
3. 💬 клик → SidebarModal → `SetQuestionComment(id, comment)` → optimistic update через emit; при ошибке — refetch + alert
4. Массовые действия → `Promise.allSettled(ChangeStatus/Delete)` → единый refetch; ошибки через alert store

---

## Секция 4: Обновление публичных страниц

### QuestionsView (/questions)

- Табы по статусам — использовать `questionStatusMap` вместо хардкода
- QuestionListItem — StatusDot + лейбл через `getStatusColor`/`getStatusLabel`
- Без изменений в фильтрах/пагинации

### QuestionIdView (/question/:id)

- Статус: StatusDot + лейбл через `getStatusColor`/`getStatusLabel`
- Комментарий: блок «Комментарий спикера» — уже рендерится, без изменений
- Для статуса `Answered` — показывать дату ответа (`answered` из QuestionResponse)
- Без элементов управления — только чтение

### QuestionCard (главная)

- Убрать switch с `WITH_COMMENT`, использовать `getStatusColor`
- Остальное без изменений

---

## Затрагиваемые файлы

### Изменяемые

| Файл | Изменение |
|------|-----------|
| `entities/question/config/question-statuses.ts` | Добавить `questionStatusMap`, `getStatusColor`, `getStatusLabel` |
| `entities/question/index.ts` | Экспорт новых утилит |
| `entities/question/ui/QuestionCard.vue` | Убрать `WITH_COMMENT`, использовать `getStatusColor` |
| `entities/question/ui/QuestionListItem.vue` | Заменить switch на `getStatusColor` |
| `entities/question/ui/QuestionIdView.vue` | Заменить switch на утилиты, добавить дату ответа |
| `entities/question/ui/QuestionStatusIcon.vue` | Использовать `questionStatusMap` |
| `pages/admin/questions/ui/AdminQuestionsPage.vue` | Полный редизайн |

### Создаваемые

| Файл | Назначение |
|------|-----------|
| `features/manage-question/ui/QuestionStatusDropdown.vue` | Inline-Select смены статуса |
| `features/manage-question/ui/QuestionCommentButton.vue` | Кнопка 💬 + SidebarModal комментария |
| `features/manage-question/ui/QuestionBulkActions.vue` | Панель массовых действий |
| `features/manage-question/index.ts` | Public API |

### Без изменений

- `shared/types/models.ts` — уже корректен (3 статуса)
- `entities/question/api/questions-repository.ts` — API-функции уже есть
- `entities/question/ui/QuestionFilters.vue` — без изменений
- `entities/question/ui/QuestionFormCreate.vue` — без изменений
- `entities/question/ui/QuestionVote.vue` — без изменений
- `pages/questions/` — минимальные изменения (только если нужны правки в QuestionsView табах)
