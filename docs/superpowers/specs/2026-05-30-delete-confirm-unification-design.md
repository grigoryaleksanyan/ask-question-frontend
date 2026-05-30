# Design: Унификация удаления сущностей через центральные модальные окна

## Обзор

Унифицировать паттерн удаления всех сущностей в проекте `ask-question-frontend` через:
- Единый composable `useDeleteConfirm`
- Центральные модальные окна `CenterModal` для всех подтверждений
- Унифицированный контракт Delete-компонентов

**Scope**: только 6 существующих точек удаления (без добавления UI удаления Question).

---

## Решения

| Вопрос | Решение |
|--------|----------|
| Scope | Только унификация 6 существующих удалений |
| Структура компонентов | Отдельные Delete-компоненты, унифицированная структура |
| Контейнер | `CenterModal` для всех (FAQ мигрирует со `SlideOver`) |
| Exposed API | `confirm()` + `cancel()` + emit `success`/`cancel` для всех |
| Реализация | Composable `useDeleteConfirm` (Подход A) |

---

## 1. Composable `useDeleteConfirm`

**Расположение**: `src/shared/lib/use-delete-confirm/index.ts`

### Контракт

```ts
interface UseDeleteConfirmOptions {
  apiFn: (id: string) => Promise<unknown>;
  successMessage: string;
  showPreloader?: boolean; // default: false
}

interface UseDeleteConfirmReturn {
  confirm: (id: string) => Promise<boolean>; // true = успех
  isLoading: Ref<boolean>;
  error: Ref<Error | null>;
}

function useDeleteConfirm(options: UseDeleteConfirmOptions): UseDeleteConfirmReturn
```

### Что унифицирует

- `showPreloader` по умолчанию `false` (сейчас Speaker использует `true`, остальные `false`)
- Возврат `boolean` из `confirm()` — единый паттерн проверки успеха (заменяет ручную проверку `deleteError.value` в DeleteSpeaker)
- `onSuccess` колбэк в `useApiCall` больше не нужен в компонентах — composable сам обрабатывает результат

### Реализация

```ts
import { ref, type Ref } from 'vue';
import { useApiCall } from '../use-api-call';

export function useDeleteConfirm(options: {
  apiFn: (id: string) => Promise<unknown>;
  successMessage: string;
  showPreloader?: boolean;
}): {
  confirm: (id: string) => Promise<boolean>;
  isLoading: Ref<boolean>;
  error: Ref<Error | null>;
} {
  const { apiFn, successMessage, showPreloader = false } = options;

  const { execute, isLoading, error } = useApiCall(apiFn, {
    successMessage,
    showPreloader,
  });

  async function confirm(id: string): Promise<boolean> {
    const result = await execute(id);
    return result !== undefined;
  }

  return { confirm, isLoading, error };
}
```

---

## 2. Унифицированный контракт Delete-компонентов

Все 5 Delete-компонентов приводятся к единому контракту:

| Аспект | Контракт |
|--------|----------|
| **Props** | `{ id: string }` |
| **Emits** | `success: [id: string]`, `cancel: []` |
| **Exposed** | `confirm(): Promise<void>`, `cancel(): void` |
| **Контейнер** | `CenterModal` (на уровне страницы) |
| **Composable** | `useDeleteConfirm` |

### Изменения по компонентам

| Компонент | Было | Станет |
|-----------|-------|--------|
| `DeleteSpeaker` | нет `cancel()`, проверка `deleteError.value` | добавить `cancel()`, использовать `doConfirm(id)` |
| `DeleteArea` | `useApiCall` + `onSuccess` | `useDeleteConfirm` |
| `DeleteEntry` | `useApiCall` + `onSuccess` | `useDeleteConfirm` |
| `DeleteCategory` | `useApiCall` + `onSuccess`, emit `success: []` | `useDeleteConfirm`, emit `success: [id: string]` |
| `DeleteFeedbackModal` | `useApiCall` + `onSuccess` | `useDeleteConfirm`, переименовать в `DeleteFeedback` |

---

## 3. Миграция FAQ со SlideOver на CenterModal

### AdminFAQPage (список категорий)

- Было: `SlideOver` → `DeleteCategory`
- Станет: `CenterModal` → `DeleteCategory`

### AdminFAQCategoryPage (конкретная категория)

- Было: 2 `SlideOver` (для DeleteCategory + DeleteEntry)
- Станет: 2 `CenterModal` (для DeleteCategory + DeleteEntry)
- DeleteCategory по-прежнему использует `router.push({ name: 'admin-faq' })` при успехе в странице

### Изменения в страницах

- Замена `<SlideOver>` → `<CenterModal>` с `title` prop и `@close`
- Footer-слот CenterModal: кнопки «Удалить» (severity=danger) + «Отмена» (severity=secondary)
- Использование `useTemplateRef()` для вызова `confirm()`/`cancel()`

---

## 4. Структура Delete-компонентов после рефакторинга

### Пример: DeleteSpeaker.vue

```vue
<template>
  <p class="delete-speaker__text">Вы действительно хотите удалить спикера?</p>
</template>

<script setup lang="ts">
import { useDeleteConfirm } from '@/shared/lib';
import { Delete } from '../api/speakers-repository';

defineOptions({ name: 'DeleteSpeaker' });

const { id } = defineProps<{ id: string }>();
const emit = defineEmits<{
  success: [id: string];
  cancel: [];
}>();

const { confirm: doConfirm } = useDeleteConfirm({
  apiFn: Delete,
  successMessage: 'Спикер успешно удалён',
});

async function confirm() {
  const ok = await doConfirm(id);
  if (ok) emit('success', id);
}

function cancel() {
  emit('cancel');
}

defineExpose({ confirm, cancel });
</script>

<style lang="scss" scoped>
.delete-speaker__text {
  color: variables.$text-primary-dark;
  font-size: 14px;
}
</style>
```

### DeleteCategory.vue

Сохраняет шаблон с красным предупреждением:
```vue
<template>
  <div class="delete-category">
    <p class="delete-category__text">
      Вы действительно хотите удалить всю категорию?
    </p>
    <p class="delete-category__warning">Так же будут удалены все записи!</p>
  </div>
</template>
```

### DeleteFeedbackModal → DeleteFeedback

Переименование файла `features/feedback/ui/DeleteFeedbackModal.vue` → `features/feedback/ui/DeleteFeedback.vue` для консистентности с остальными (DeleteSpeaker, DeleteArea, DeleteCategory, DeleteEntry, DeleteFeedback).

---

## 5. Интеграция на уровне страниц

### Пример: AdminFAQPage (миграция с SlideOver)

Было:
```vue
<SlideOver ref="deleteCategoryRef" title="Удалить категорию" @close="...">
  <DeleteCategory :id="categoryToDeleteId" @success="..." @cancel="..." />
  <template #confirm>...</template>
  <template #cancel>...</template>
</SlideOver>
```

Станет:
```vue
<CenterModal v-model:isOpen="isDeleteCategoryOpen" title="Удалить категорию" @close="...">
  <DeleteCategory :id="categoryToDeleteId" ref="deleteCategoryRef" @success="..." @cancel="..." />
  <template #footer>
    <Button label="Удалить" severity="danger" @click="deleteCategoryRef?.confirm()" />
    <Button label="Отмена" severity="secondary" @click="deleteCategoryRef?.cancel()" />
  </template>
</CenterModal>
```

### AdminFAQCategoryPage

Аналогично для двух модалок (DeleteCategory + DeleteEntry).

### AdminSpeakersPage, AdminAreasPage, AdminFeedbackPage

Без изменений (уже используют CenterModal, контракт компонентов обновляется, но страницы не меняются).

---

## Тестирование

- `useDeleteConfirm` — unit-тест с mock API-функции
- Delete-компоненты — snapshot-тесты + проверка exposed-методов
- Проверка миграции FAQ: визуальный осмотр (CenterModal вместо SlideOver)

---

## Чек-лист реализации

1. Создать `shared/lib/use-delete-confirm/index.ts`
2. Обновить `DeleteSpeaker` (add cancel, use composable)
3. Обновить `DeleteArea` (use composable)
4. Обновить `DeleteEntry` (use composable)
5. Обновить `DeleteCategory` (use composable, emit `success: [id: string]`)
6. Переименовать `DeleteFeedbackModal` → `DeleteFeedback`, обновить (use composable)
7. Обновить `AdminFAQPage`: SlideOver → CenterModal
8. Обновить `AdminFAQCategoryPage`: SlideOver → CenterModal для двух удалений
9. Обновить public API (index.ts) каждого слайса
10. Запустить `npm run fsd:check`, `npm run lint`, `npm run typecheck`
