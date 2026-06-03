# Question Management Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Добавить управление статусами и комментариями вопросов на фронтенде — инлайн-дропдаун статуса, модалка комментария, массовые действия в админке; исправить рассинхрон статусной модели.

**Architecture:** Гибридный FSD — отображение в `entities/question`, действия в `features/manage-question`. Рефакторинг маппинга статусов в единый `questionStatusMap`. AdminQuestionsPage полностью перерабатывается с пагинацией и серверной фильтрацией.

**Tech Stack:** Vue 3.5 + PrimeVue 4 + Pinia 3 + TypeScript. SidebarModal (promise-based), useApiCall (auto toast), PrimeVue Select/Toast.

---

## File Structure

### Modified

| File | Responsibility |
|------|---------------|
| `src/entities/question/config/question-statuses.ts` | Единый маппинг статус→цвет/лейбл, утилиты getStatusColor/getStatusLabel |
| `src/entities/question/index.ts` | Экспорт новых утилит |
| `src/entities/question/ui/QuestionCard.vue` | Убрать WITH_COMMENT, использовать getStatusColor |
| `src/entities/question/ui/QuestionListItem.vue` | Заменить switch на getStatusColor |
| `src/entities/question/ui/QuestionIdView.vue` | Заменить switch на утилиты, добавить дату ответа |
| `src/entities/question/ui/QuestionStatusIcon.vue` | Использовать questionStatusMap |
| `src/pages/admin/questions/ui/AdminQuestionsPage.vue` | Полный редизайн: dropdown, comment button, bulk actions, пагинация, серверная фильтрация |

### Created

| File | Responsibility |
|------|---------------|
| `src/features/manage-question/ui/QuestionStatusDropdown.vue` | PrimeVue Select для inline смены статуса |
| `src/features/manage-question/ui/QuestionCommentButton.vue` | Кнопка 💬 + SidebarModal комментария |
| `src/features/manage-question/ui/QuestionBulkActions.vue` | Панель массовых действий (статус + удаление) |
| `src/features/manage-question/index.ts` | Public API фичи |

---

## Task 1: Refactor question-statuses config

**Files:**
- Modify: `src/entities/question/config/question-statuses.ts`
- Modify: `src/entities/question/index.ts`

- [ ] **Step 1: Update question-statuses.ts**

Replace the file with:

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

- [ ] **Step 2: Update index.ts exports**

Add to `src/entities/question/index.ts`:

```ts
export { questionStatusMap, getStatusColor, getStatusLabel } from './config/question-statuses';
```

- [ ] **Step 3: Verify build**

Run: `npx vue-tsc --noEmit` (in `ask-question-frontend/`)
Expected: No type errors

- [ ] **Step 4: Commit**

```bash
git add src/entities/question/config/question-statuses.ts src/entities/question/index.ts
git commit -m "feat(question): add questionStatusMap and status utility functions"
```

---

## Task 2: Refactor QuestionCard and QuestionListItem

**Files:**
- Modify: `src/entities/question/ui/QuestionCard.vue`
- Modify: `src/entities/question/ui/QuestionListItem.vue`

- [ ] **Step 1: Update QuestionCard.vue**

Replace the `statusColor` computed (which references `WITH_COMMENT`) with:

```ts
import { getStatusColor } from '../config/question-statuses';

const statusColor = computed(() => getStatusColor(question.status));
```

Remove the `import QUESTION_STATUSES from '../config/question-statuses'` and replace with the named import above.

- [ ] **Step 2: Update QuestionListItem.vue**

Replace the `statusColor` computed with:

```ts
import { getStatusColor } from '../config/question-statuses';

const statusColor = computed(() => getStatusColor(question.status));
```

- [ ] **Step 3: Verify build**

Run: `npx vue-tsc --noEmit`
Expected: No type errors

- [ ] **Step 4: Commit**

```bash
git add src/entities/question/ui/QuestionCard.vue src/entities/question/ui/QuestionListItem.vue
git commit -m "refactor(question): replace switch-based status mapping with utility functions"
```

---

## Task 3: Refactor QuestionStatusIcon and QuestionIdView

**Files:**
- Modify: `src/entities/question/ui/QuestionStatusIcon.vue`
- Modify: `src/entities/question/ui/QuestionIdView.vue`

- [ ] **Step 1: Update QuestionStatusIcon.vue**

Replace the entire `<script setup>` with:

```ts
import { computed } from 'vue';

import type { QuestionStatusId } from '@/shared/types';

import { StatusDot } from '@/shared/ui/status-dot';
import { questionStatusMap } from '../config/question-statuses';
import QUESTION_STATUSES from '../config/question-statuses';

defineOptions({ name: 'QuestionStatusIcon' });

const { status = QUESTION_STATUSES.NEW.STATUS_ID } = defineProps<{
  status?: QuestionStatusId;
}>();

const statusColor = computed(
  () => questionStatusMap[status]?.color ?? QUESTION_STATUSES.ANSWERED.COLOR,
);
const statusLabel = computed(() => questionStatusMap[status]?.label ?? '');
```

- [ ] **Step 2: Update QuestionIdView.vue**

Replace `statusColor` and `statusLabel` computed blocks with:

```ts
import { getStatusColor, getStatusLabel } from '../config/question-statuses';
```

Then:

```ts
const statusColor = computed(() =>
  question.value ? getStatusColor(question.value.status) : '',
);
const statusLabel = computed(() =>
  question.value ? getStatusLabel(question.value.status) : '',
);
```

Also add answered date display in the template — after the status row, add inside `question-id-view__card`:

```html
<div
  v-if="question.answered"
  class="question-id-view__answered-date">
  Ответ дан: {{ new Date(question.answered).toLocaleDateString('ru-RU') }}
</div>
```

With style:

```scss
.question-id-view__answered-date {
  color: variables.$text-muted;
  font-size: 12px;
  margin-top: 4px;
}
```

- [ ] **Step 3: Verify build**

Run: `npx vue-tsc --noEmit`
Expected: No type errors

- [ ] **Step 4: Commit**

```bash
git add src/entities/question/ui/QuestionStatusIcon.vue src/entities/question/ui/QuestionIdView.vue
git commit -m "refactor(question): unify status mapping, add answered date display"
```

---

## Task 4: Create QuestionStatusDropdown component

**Files:**
- Create: `src/features/manage-question/ui/QuestionStatusDropdown.vue`

- [ ] **Step 1: Create the component**

```vue
<template>
  <Select
    :model-value="status"
    :options="statusOptions"
    option-label="label"
    option-value="value"
    class="question-status-dropdown"
    @update:model-value="onStatusChange">
    <template #value="{ value }">
      <div class="question-status-dropdown__selected">
        <span
          class="question-status-dropdown__dot"
          :style="{ background: getStatusColor(value) }"></span>
        <span class="question-status-dropdown__label">
          {{ getStatusLabel(value) }}
        </span>
      </div>
    </template>
    <template #option="{ option }">
      <div class="question-status-dropdown__option">
        <span
          class="question-status-dropdown__dot"
          :style="{ background: getStatusColor(option.value) }"></span>
        <span>{{ option.label }}</span>
      </div>
    </template>
  </Select>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import { QuestionStatusId } from '@/shared/types';
import type { QuestionStatusId as QuestionStatusIdType } from '@/shared/types';

import { ChangeQuestionStatus, getStatusColor, getStatusLabel } from '@/entities/question';
import { useApiCall } from '@/shared/lib';
import Select from 'primevue/select';

defineOptions({ name: 'QuestionStatusDropdown' });

const props = defineProps<{
  status: QuestionStatusIdType;
  questionId: string;
}>();

const emit = defineEmits<{
  (e: 'status-changed', id: string, newStatus: QuestionStatusIdType): void;
  (e: 'error', id: string): void;
}>();

const localStatus = ref(props.status);

const { execute: executeChangeStatus } = useApiCall(ChangeQuestionStatus, {
  showPreloader: false,
  successMessage: 'Статус изменён',
  onSuccess() {
    emit('status-changed', props.questionId, localStatus.value);
  },
  onError() {
    localStatus.value = props.status;
    emit('error', props.questionId);
  },
});

const statusOptions = [
  { value: QuestionStatusId.New, label: 'Новый' },
  { value: QuestionStatusId.InFocus, label: 'В фокусе' },
  { value: QuestionStatusId.Answered, label: 'Отвеченный' },
];

async function onStatusChange(newStatus: QuestionStatusIdType) {
  const previousStatus = localStatus.value;
  localStatus.value = newStatus;
  await executeChangeStatus(props.questionId, newStatus);
  if (localStatus.value !== newStatus) {
    localStatus.value = previousStatus;
  }
}
</script>

<style lang="scss" scoped>
.question-status-dropdown {
  font-size: 12px;
}

.question-status-dropdown__selected,
.question-status-dropdown__option {
  display: flex;
  align-items: center;
  gap: 6px;
}

.question-status-dropdown__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.question-status-dropdown__label {
  font-size: 12px;
}
</style>
```

- [ ] **Step 2: Verify build**

Run: `npx vue-tsc --noEmit`
Expected: No type errors

- [ ] **Step 3: Commit**

```bash
git add src/features/manage-question/ui/QuestionStatusDropdown.vue
git commit -m "feat(manage-question): add QuestionStatusDropdown component"
```

---

## Task 5: Create QuestionCommentButton component

**Files:**
- Create: `src/features/manage-question/ui/QuestionCommentButton.vue`

- [ ] **Step 1: Create the component**

```vue
<template>
  <button
    class="question-comment-button"
    :class="{
      'question-comment-button--has-comment': comment !== null,
    }"
    :title="comment ? 'Комментарий есть' : 'Добавить комментарий'"
    @click="openModal">
    <i class="pi pi-comment"></i>
  </button>

  <SidebarModal ref="sidebarModalRef">
    <template #header>
      <span>Комментарий к вопросу</span>
    </template>

    <template #default="{ confirm, close }">
      <div class="question-comment-button__modal-content">
        <Textarea
          v-model="localComment"
          auto-resize
          rows="4"
          class="w-full"
          placeholder="Введите комментарий..." />

        <div class="question-comment-button__modal-actions">
          <Button
            label="Сохранить"
            severity="primary"
            @click="saveComment(confirm)" />
          <Button
            label="Отмена"
            severity="secondary"
            outlined
            @click="close()" />
        </div>
      </div>
    </template>
  </SidebarModal>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';

import { SetQuestionComment } from '@/entities/question';
import { useApiCall } from '@/shared/lib';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';

defineOptions({ name: 'QuestionCommentButton' });

const props = defineProps<{
  questionId: string;
  comment: string | null;
}>();

const emit = defineEmits<{
  (e: 'comment-changed', id: string, newComment: string | null): void;
  (e: 'error', id: string): void;
}>();

const sidebarModalRef = useTemplateRef('sidebarModalRef');
const localComment = ref(props.comment ?? '');

const { execute: executeSetComment } = useApiCall(SetQuestionComment, {
  showPreloader: false,
  successMessage: 'Комментарий сохранён',
  onSuccess() {
    emit('comment-changed', props.questionId, localComment.value || null);
  },
  onError() {
    emit('error', props.questionId);
  },
});

async function openModal() {
  localComment.value = props.comment ?? '';
  const result = await sidebarModalRef.value?.open();
  if (result?.status) {
    await saveComment();
  }
}

async function saveComment(
  confirm?: (data?: unknown) => void,
) {
  await executeSetComment(props.questionId, localComment.value || null);
  if (confirm) {
    confirm();
  }
}
</script>

<style lang="scss" scoped>
.question-comment-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  border-radius: 6px;
  background: none;
  color: variables.$text-muted;
  cursor: pointer;
  font-size: 14px;
  transition: color 0.15s, background 0.15s;

  &:hover {
    background: rgb(0 0 0 / 4%);
  }

  &--has-comment {
    color: variables.$main-color;
  }
}

.question-comment-button__modal-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.question-comment-button__modal-actions {
  display: flex;
  gap: 8px;
}
</style>
```

- [ ] **Step 2: Verify build**

Run: `npx vue-tsc --noEmit`
Expected: No type errors

- [ ] **Step 3: Commit**

```bash
git add src/features/manage-question/ui/QuestionCommentButton.vue
git commit -m "feat(manage-question): add QuestionCommentButton with SidebarModal"
```

---

## Task 6: Create QuestionBulkActions component

**Files:**
- Create: `src/features/manage-question/ui/QuestionBulkActions.vue`

- [ ] **Step 1: Create the component**

```vue
<template>
  <div
    v-if="selectedIds.size > 0"
    class="question-bulk-actions">
    <span class="question-bulk-actions__count">
      Выбрано: {{ selectedIds.size }}
    </span>

    <div class="question-bulk-actions__group">
      <Select
        v-model="targetStatus"
        :options="statusOptions"
        option-label="label"
        option-value="value"
        placeholder="Новый статус"
        class="question-bulk-actions__select" />

      <Button
        label="Изменить статус"
        severity="primary"
        size="small"
        :disabled="targetStatus === null"
        :loading="isChangingStatus"
        @click="changeStatuses" />
    </div>

    <Button
      label="Удалить"
      severity="danger"
      size="small"
      outlined
      :loading="isDeleting"
      @click="deleteQuestions" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import { QuestionStatusId } from '@/shared/types';
import type { QuestionStatusId as QuestionStatusIdType } from '@/shared/types';

import {
  ChangeQuestionStatus,
  DeleteQuestion,
} from '@/entities/question';
import { useToast } from 'primevue/usetoast';
import Select from 'primevue/select';
import Button from 'primevue/button';

defineOptions({ name: 'QuestionBulkActions' });

const props = defineProps<{
  selectedIds: Set<string>;
}>();

const emit = defineEmits<{
  (e: 'action-completed'): void;
  (e: 'clear-selection'): void;
}>();

const toast = useToast();

const targetStatus = ref<QuestionStatusIdType | null>(null);
const isChangingStatus = ref(false);
const isDeleting = ref(false);

const statusOptions = [
  { value: QuestionStatusId.New, label: 'Новый' },
  { value: QuestionStatusId.InFocus, label: 'В фокусе' },
  { value: QuestionStatusId.Answered, label: 'Отвеченный' },
];

async function changeStatuses() {
  if (targetStatus.value === null) return;

  isChangingStatus.value = true;

  const results = await Promise.allSettled(
    [...props.selectedIds].map((id) =>
      ChangeQuestionStatus(id, targetStatus.value!),
    ),
  );

  const failedCount = results.filter(
    (r) => r.status === 'rejected',
  ).length;

  if (failedCount > 0) {
    toast.add({
      severity: 'error',
      detail: `Не удалось изменить статус у ${failedCount} вопросов`,
      group: 'api',
      life: 3000,
    });
  } else {
    toast.add({
      severity: 'success',
      detail: 'Статус изменён',
      group: 'api',
      life: 3000,
    });
  }

  isChangingStatus.value = false;
  targetStatus.value = null;
  emit('action-completed');
  emit('clear-selection');
}

async function deleteQuestions() {
  if (!confirm(`Удалить ${props.selectedIds.size} вопросов?`)) return;

  isDeleting.value = true;

  const results = await Promise.allSettled(
    [...props.selectedIds].map((id) => DeleteQuestion(id)),
  );

  const failedCount = results.filter(
    (r) => r.status === 'rejected',
  ).length;

  if (failedCount > 0) {
    toast.add({
      severity: 'error',
      detail: `Не удалось удалить ${failedCount} вопросов`,
      group: 'api',
      life: 3000,
    });
  } else {
    toast.add({
      severity: 'success',
      detail: 'Вопросы удалены',
      group: 'api',
      life: 3000,
    });
  }

  isDeleting.value = false;
  emit('action-completed');
  emit('clear-selection');
}
</script>

<style lang="scss" scoped>
.question-bulk-actions {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border: 1px solid variables.$border-dark;
  border-top: none;
  border-radius: 0 0 10px 10px;
  background: variables.$surface-dark-elevated;
  gap: 16px;
}

.question-bulk-actions__count {
  color: variables.$text-secondary;
  font-size: 13px;
}

.question-bulk-actions__group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.question-bulk-actions__select {
  font-size: 13px;
}
</style>
```

- [ ] **Step 2: Verify build**

Run: `npx vue-tsc --noEmit`
Expected: No type errors

- [ ] **Step 3: Commit**

```bash
git add src/features/manage-question/ui/QuestionBulkActions.vue
git commit -m "feat(manage-question): add QuestionBulkActions component"
```

---

## Task 7: Create features/manage-question public API

**Files:**
- Create: `src/features/manage-question/index.ts`

- [ ] **Step 1: Create index.ts**

```ts
export { default as QuestionStatusDropdown } from './ui/QuestionStatusDropdown.vue';
export { default as QuestionCommentButton } from './ui/QuestionCommentButton.vue';
export { default as QuestionBulkActions } from './ui/QuestionBulkActions.vue';
```

- [ ] **Step 2: Verify FSD structure**

Run: `npx steiger ./src`
Expected: No new FSD violations

- [ ] **Step 3: Commit**

```bash
git add src/features/manage-question/index.ts
git commit -m "feat(manage-question): add public API"
```

---

## Task 8: Redesign AdminQuestionsPage

**Files:**
- Modify: `src/pages/admin/questions/ui/AdminQuestionsPage.vue`

- [ ] **Step 1: Rewrite AdminQuestionsPage.vue**

Replace the full file with the redesigned version. Key changes:

1. **Server-side filtering**: tabs pass `status` to `GetAllQuestions` API
2. **Pagination**: `page`/`pageSize` params, pagination UI below table
3. **New column 💬**: `QuestionCommentButton`
4. **Status column**: `QuestionStatusDropdown` instead of StatusDot
5. **Bulk actions**: `QuestionBulkActions` below table
6. **Speaker filter**: auto-set `speakerId` from auth store for speakers
7. **Remove local getStatusColor/getStatusLabel**: use from entities

```vue
<template>
  <div class="admin-questions-page">
    <div class="admin-questions-page__tabs">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="admin-questions-page__tab"
        :class="{
          'admin-questions-page__tab--active': activeTab === tab.key,
        }"
        @click="activeTab = tab.key">
        {{ tab.label }}
      </button>
    </div>

    <div class="admin-questions-page__table">
      <div class="admin-questions-page__header">
        <div class="admin-questions-page__cell admin-questions-page__cell--check">
          <Checkbox
            :model-value="allSelected"
            binary
            @change="toggleAll" />
        </div>
        <div class="admin-questions-page__cell admin-questions-page__cell--question">
          Вопрос
        </div>
        <div class="admin-questions-page__cell admin-questions-page__cell--area">
          Зона
        </div>
        <div class="admin-questions-page__cell admin-questions-page__cell--speaker">
          Спикер
        </div>
        <div class="admin-questions-page__cell admin-questions-page__cell--status">
          Статус
        </div>
        <div class="admin-questions-page__cell admin-questions-page__cell--comment">
          💬
        </div>
        <div class="admin-questions-page__cell admin-questions-page__cell--votes">
          ▲
        </div>
        <div class="admin-questions-page__cell admin-questions-page__cell--date">
          Дата
        </div>
      </div>

      <div
        v-for="question in questions"
        :key="question.id"
        class="admin-questions-page__row"
        :class="{
          'admin-questions-page__row--selected': selectedIds.has(question.id),
        }"
        @click="toggleSelect(question.id)">
        <div
          class="admin-questions-page__cell admin-questions-page__cell--check"
          @click.stop>
          <Checkbox
            :model-value="selectedIds.has(question.id)"
            binary
            @change="toggleSelect(question.id)" />
        </div>
        <div class="admin-questions-page__cell admin-questions-page__cell--question">
          {{ question.text }}
        </div>
        <div class="admin-questions-page__cell admin-questions-page__cell--area">
          {{ question.areaTitle ?? '—' }}
        </div>
        <div class="admin-questions-page__cell admin-questions-page__cell--speaker">
          {{ question.speakerName || '—' }}
        </div>
        <div
          class="admin-questions-page__cell admin-questions-page__cell--status"
          @click.stop>
          <QuestionStatusDropdown
            :status="question.status"
            :question-id="question.id"
            @status-changed="onStatusChanged"
            @error="onActionError" />
        </div>
        <div
          class="admin-questions-page__cell admin-questions-page__cell--comment"
          @click.stop>
          <QuestionCommentButton
            :question-id="question.id"
            :comment="question.comment"
            @comment-changed="onCommentChanged"
            @error="onActionError" />
        </div>
        <div class="admin-questions-page__cell admin-questions-page__cell--votes">
          ▲ {{ question.likes }}
        </div>
        <div class="admin-questions-page__cell admin-questions-page__cell--date">
          {{ relativeTime(question.created) }}
        </div>
      </div>
    </div>

    <QuestionBulkActions
      :selected-ids="selectedIds"
      @action-completed="fetchData"
      @clear-selection="clearSelection" />

    <div class="admin-questions-page__pagination">
      <button
        class="admin-questions-page__page-btn"
        :disabled="currentPage <= 1"
        @click="currentPage--">
        ‹
      </button>
      <span class="admin-questions-page__page-info">
        {{ currentPage }} / {{ totalPages }}
      </span>
      <button
        class="admin-questions-page__page-btn"
        :disabled="currentPage >= totalPages"
        @click="currentPage++">
        ›
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

import type { QuestionResponse } from '@/shared/types';

import { QuestionStatusId } from '@/shared/types';
import Checkbox from 'primevue/checkbox';

import {
  GetAllQuestions,
  type QuestionListParams,
} from '@/entities/question';
import {
  QuestionStatusDropdown,
  QuestionCommentButton,
  QuestionBulkActions,
} from '@/features/manage-question';
import { useAuthStore } from '@/features/auth';
import { useApiCall } from '@/shared/lib';

defineOptions({ name: 'AdminQuestionsPage' });

const authStore = useAuthStore();

const { execute: executeFetch, isLoading } = useApiCall(GetAllQuestions, {
  showPreloader: false,
});

const questions = ref<QuestionResponse[]>([]);
const totalCount = ref(0);
const currentPage = ref(1);
const pageSize = 20;
const selectedIds = ref<Set<string>>(new Set());
const activeTab = ref<string>('all');

const isSpeaker = computed(
  () => authStore.userData?.userRoleId === 2,
);

const tabs = [
  { key: 'all', label: 'Все' },
  { key: 'new', label: 'Новые' },
  { key: 'inFocus', label: 'В фокусе' },
  { key: 'answered', label: 'Отвеченные' },
];

const tabToStatus: Record<string, QuestionStatusId | undefined> = {
  all: undefined,
  new: QuestionStatusId.New,
  inFocus: QuestionStatusId.InFocus,
  answered: QuestionStatusId.Answered,
};

const totalPages = computed(() =>
  Math.max(1, Math.ceil(totalCount.value / pageSize)),
);

const params = computed<QuestionListParams>(() => ({
  page: currentPage.value,
  pageSize,
  status: tabToStatus[activeTab.value],
  speakerId: isSpeaker.value
    ? authStore.userData?.id
    : undefined,
}));

const allSelected = computed(() => {
  return (
    questions.value.length > 0 &&
    questions.value.every((q) => selectedIds.value.has(q.id))
  );
});

watch(activeTab, () => {
  currentPage.value = 1;
  fetchData();
});

watch(currentPage, () => {
  fetchData();
});

function toggleSelect(id: string) {
  const next = new Set(selectedIds.value);
  if (next.has(id)) {
    next.delete(id);
  } else {
    next.add(id);
  }
  selectedIds.value = next;
}

function toggleAll() {
  const allInPage = questions.value.every((q) =>
    selectedIds.value.has(q.id),
  );
  const next = new Set(selectedIds.value);
  for (const q of questions.value) {
    if (allInPage) {
      next.delete(q.id);
    } else {
      next.add(q.id);
    }
  }
  selectedIds.value = next;
}

function clearSelection() {
  selectedIds.value = new Set();
}

function onStatusChanged(
  id: string,
  newStatus: QuestionStatusId,
) {
  const question = questions.value.find((q) => q.id === id);
  if (question) {
    question.status = newStatus;
  }
}

function onCommentChanged(
  id: string,
  newComment: string | null,
) {
  const question = questions.value.find((q) => q.id === id);
  if (question) {
    question.comment = newComment;
  }
}

function onActionError(_id: string) {
  fetchData();
}

function relativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;

  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return 'только что';
  if (minutes < 60) return `${minutes} мин`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}ч`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}д`;

  const months = Math.floor(days / 30);
  return `${months}мес`;
}

async function fetchData() {
  const result = await executeFetch(params.value);
  if (result) {
    questions.value = result.items;
    totalCount.value = result.totalCount;
  }
}

fetchData();
</script>

<style lang="scss" scoped>
.admin-questions-page {
  padding: 24px;
  color: variables.$text-primary-dark;
}

.admin-questions-page__tabs {
  display: flex;
  margin-bottom: 20px;
  gap: 6px;
}

.admin-questions-page__tab {
  padding: 8px 16px;
  border: none;
  border-radius: 10px;
  background: none;
  color: variables.$text-secondary;
  cursor: pointer;
  font-size: 14px;
  transition: color 0.15s, background-color 0.15s;
}

.admin-questions-page__tab--active {
  background: rgba(variables.$main-color, 0.15);
  color: variables.$main-color;
  font-weight: 500;
}

.admin-questions-page__table {
  overflow: hidden;
  border: 1px solid variables.$border-dark;
  border-radius: 10px 10px 0 0;
  background: variables.$surface-dark-elevated;
}

.admin-questions-page__header,
.admin-questions-page__row {
  display: grid;
  align-items: center;
  padding: 12px 16px;
  gap: 12px;
  grid-template-columns: 28px 1fr 120px 120px 120px 36px 70px 70px;
}

.admin-questions-page__header {
  border-bottom: 1px solid variables.$border-dark;
  color: variables.$text-muted;
  font-size: 13px;
  letter-spacing: 0.5px;
}

.admin-questions-page__row {
  border-bottom: 1px solid variables.$border-dark;
  cursor: pointer;
  transition: background 0.1s;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: rgba(variables.$main-color, 0.04);
  }

  &--selected {
    background: rgba(variables.$main-color, 0.08);
  }
}

.admin-questions-page__cell--question {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.admin-questions-page__cell--status {
  min-width: 110px;
}

.admin-questions-page__cell--comment {
  display: flex;
  justify-content: center;
}

.admin-questions-page__pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  gap: 12px;
}

.admin-questions-page__page-btn {
  width: 32px;
  height: 32px;
  padding: 0;
  border: 1px solid variables.$border-dark;
  border-radius: 6px;
  background: variables.$surface-dark-elevated;
  color: variables.$text-secondary;
  cursor: pointer;
  font-size: 16px;

  &:disabled {
    cursor: default;
    opacity: 0.4;
  }
}

.admin-questions-page__page-info {
  color: variables.$text-muted;
  font-size: 13px;
}
</style>
```

- [ ] **Step 2: Verify build**

Run: `npx vue-tsc --noEmit`
Expected: No type errors

- [ ] **Step 3: Verify lint**

Run: `npm run lint`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/pages/admin/questions/ui/AdminQuestionsPage.vue
git commit -m "feat(admin-questions): redesign with status dropdown, comment button, bulk actions, pagination"
```

---

## Task 9: Update QuestionsView tabs to use questionStatusMap

**Files:**
- Modify: `src/entities/question/ui/QuestionsView.vue`

- [ ] **Step 1: Update QuestionsView.vue**

Replace the hardcoded `tabs` array with one derived from `questionStatusMap`:

```ts
import { questionStatusMap } from '../config/question-statuses';
import { QuestionStatusId } from '@/shared/types';

const tabs = [
  {
    value: 'new',
    label: 'Новые',
    color: questionStatusMap[QuestionStatusId.New].color,
  },
  {
    value: 'inFocus',
    label: 'В фокусе',
    color: questionStatusMap[QuestionStatusId.InFocus].color,
  },
  {
    value: 'answered',
    label: 'Отвеченные',
    color: questionStatusMap[QuestionStatusId.Answered].color,
  },
];
```

- [ ] **Step 2: Verify build**

Run: `npx vue-tsc --noEmit`
Expected: No type errors

- [ ] **Step 3: Commit**

```bash
git add src/entities/question/ui/QuestionsView.vue
git commit -m "refactor(questions-view): use questionStatusMap for tab colors"
```

---

## Task 10: Final verification

- [ ] **Step 1: Full lint check**

Run: `npm run lint`
Expected: No errors

- [ ] **Step 2: Typecheck**

Run: `npx vue-tsc --noEmit`
Expected: No type errors

- [ ] **Step 3: FSD check**

Run: `npx steiger ./src`
Expected: No new violations

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: Successful build

- [ ] **Step 5: Final commit if any fixes needed**

```bash
git add -A
git commit -m "fix: address lint/typecheck issues from final verification"
```
