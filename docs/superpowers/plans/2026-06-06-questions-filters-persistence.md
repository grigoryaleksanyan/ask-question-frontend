# Questions Filters Persistence — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Сохранять состояние фильтров, пагинации, сортировки и поиска страницы `/questions` в URL query-параметрах, чтобы они переживали навигацию, F5 и шаринг ссылок. Восстанавливать scroll-позицию при возврате с детальной страницы.

**Architecture:** Composable `useQuestionsFilters` читает `route.query` и предоставляет `computed`-refs + setter-методы, обновляющие URL через `router.push`. Единый источник истины — URL. Scroll-позиция сохраняется в `sessionStorage` перед уходом и восстанавливается при возврате.

**Tech Stack:** Vue 3 Composition API, Vue Router 5, PrimeVue 4, Pinia (для auth store), Vitest

---

## File Structure

| Action | Path | Responsibility |
|--------|------|---------------|
| Create | `src/entities/question/lib/use-questions-filters/index.ts` | Composable: URL ↔ state sync |
| Create | `tests/entities/question/lib/use-questions-filters/index.test.ts` | Тесты composable |
| Modify | `src/entities/question/index.ts` | Экспорт composable |
| Modify | `src/entities/question/ui/QuestionsView.vue` | Замена локальных ref на composable |
| Modify | `src/entities/question/ui/QuestionFilters.vue` | Controlled props + emits |
| Modify | `src/entities/question/ui/QuestionCard.vue` | Сохранение scroll в sessionStorage |

---

### Task 1: Composable `useQuestionsFilters` — тесты

**Files:**
- Create: `tests/entities/question/lib/use-questions-filters/index.test.ts`

- [ ] **Step 1: Написать тесты для composable**

```ts
import { ref } from 'vue';

import { describe, it, expect, vi, beforeEach } from 'vitest';

import { QuestionStatusId } from '@/shared/dto';

const mockRoute = ref<{ query: Record<string, string> }>({ query: {} });
const mockPush = vi.fn();

vi.mock('vue-router', () => ({
  useRoute: () => mockRoute.value,
  useRouter: () => ({ push: mockPush }),
}));

import { useQuestionsFilters } from '@/entities/question/lib/use-questions-filters';

describe('useQuestionsFilters', () => {
  beforeEach(() => {
    mockRoute.value = { query: {} };
    mockPush.mockClear();
  });

  describe('чтение из URL — дефолты', () => {
    it('возвращает дефолтный status "new" при пустом query', () => {
      const { status } = useQuestionsFilters();
      expect(status.value).toBe('new');
    });

    it('возвращает дефолтный page 1 при пустом query', () => {
      const { page } = useQuestionsFilters();
      expect(page.value).toBe(1);
    });

    it('возвращает дефолтный sortOrder "desc" при пустом query', () => {
      const { sortOrder } = useQuestionsFilters();
      expect(sortOrder.value).toBe('desc');
    });

    it('возвращает null для speakerId при пустом query', () => {
      const { speakerId } = useQuestionsFilters();
      expect(speakerId.value).toBeNull();
    });

    it('возвращает null для areaId при пустом query', () => {
      const { areaId } = useQuestionsFilters();
      expect(areaId.value).toBeNull();
    });

    it('возвращает пустую строку для search при пустом query', () => {
      const { search } = useQuestionsFilters();
      expect(search.value).toBe('');
    });
  });

  describe('чтение из URL — заданные значения', () => {
    it('читает status из query', () => {
      mockRoute.value = { query: { status: 'answered' } };
      const { status } = useQuestionsFilters();
      expect(status.value).toBe('answered');
    });

    it('читает page из query', () => {
      mockRoute.value = { query: { page: '3' } };
      const { page } = useQuestionsFilters();
      expect(page.value).toBe(3);
    });

    it('читает sortOrder из query', () => {
      mockRoute.value = { query: { sortOrder: 'asc' } };
      const { sortOrder } = useQuestionsFilters();
      expect(sortOrder.value).toBe('asc');
    });

    it('читает speakerId из query', () => {
      mockRoute.value = { query: { speakerId: 'abc123' } };
      const { speakerId } = useQuestionsFilters();
      expect(speakerId.value).toBe('abc123');
    });

    it('читает areaId из query', () => {
      mockRoute.value = { query: { areaId: 'def456' } };
      const { areaId } = useQuestionsFilters();
      expect(areaId.value).toBe('def456');
    });

    it('читает search из query', () => {
      mockRoute.value = { query: { search: 'микросервисы' } };
      const { search } = useQuestionsFilters();
      expect(search.value).toBe('микросервисы');
    });
  });

  describe('валидация невалидных значений', () => {
    it('невалидный status подставляет дефолт "new"', () => {
      mockRoute.value = { query: { status: 'invalid' } };
      const { status } = useQuestionsFilters();
      expect(status.value).toBe('new');
    });

    it('невалидный page (не число) подставляет дефолт 1', () => {
      mockRoute.value = { query: { page: 'abc' } };
      const { page } = useQuestionsFilters();
      expect(page.value).toBe(1);
    });

    it('отрицательный page подставляет дефолт 1', () => {
      mockRoute.value = { query: { page: '-1' } };
      const { page } = useQuestionsFilters();
      expect(page.value).toBe(1);
    });

    it('невалидный sortOrder подставляет дефолт "desc"', () => {
      mockRoute.value = { query: { sortOrder: 'random' } };
      const { sortOrder } = useQuestionsFilters();
      expect(sortOrder.value).toBe('desc');
    });

    it('пустой speakerId возвращает null', () => {
      mockRoute.value = { query: { speakerId: '' } };
      const { speakerId } = useQuestionsFilters();
      expect(speakerId.value).toBeNull();
    });
  });

  describe('apiParams — маппинг в QuestionListParams', () => {
    it('маппит дефолтные значения', () => {
      const { apiParams } = useQuestionsFilters();
      expect(apiParams.value).toEqual({
        page: 1,
        pageSize: 10,
        status: QuestionStatusId.New,
        speakerId: undefined,
        areaId: undefined,
        search: undefined,
        sortOrder: 'desc',
      });
    });

    it('маппит заданные значения', () => {
      mockRoute.value = {
        query: {
          status: 'inFocus',
          page: '2',
          speakerId: 'sp1',
          areaId: 'ar1',
          sortOrder: 'asc',
          search: 'test',
        },
      };
      const { apiParams } = useQuestionsFilters();
      expect(apiParams.value).toEqual({
        page: 2,
        pageSize: 10,
        status: QuestionStatusId.InFocus,
        speakerId: 'sp1',
        areaId: 'ar1',
        search: 'test',
        sortOrder: 'asc',
      });
    });
  });

  describe('setter-методы', () => {
    it('setStatus вызывает router.push с новым status и page=1', () => {
      const { setStatus } = useQuestionsFilters();
      setStatus('answered');
      expect(mockPush).toHaveBeenCalledWith({
        query: { status: 'answered', page: '1' },
      });
    });

    it('setStatus с дефолтным значением опускает status из query', () => {
      const { setStatus } = useQuestionsFilters();
      setStatus('new');
      expect(mockPush).toHaveBeenCalledWith({ query: {} });
    });

    it('setPage вызывает router.push с новым page', () => {
      const { setPage } = useQuestionsFilters();
      setPage(3);
      expect(mockPush).toHaveBeenCalledWith({ query: { page: '3' } });
    });

    it('setPage с дефолтным значением опускает page из query', () => {
      const { setPage } = useQuestionsFilters();
      setPage(1);
      expect(mockPush).toHaveBeenCalledWith({ query: {} });
    });

    it('setSpeakerId вызывает router.push с новым speakerId и page=1', () => {
      const { setSpeakerId } = useQuestionsFilters();
      setSpeakerId('sp1');
      expect(mockPush).toHaveBeenCalledWith({
        query: { speakerId: 'sp1', page: '1' },
      });
    });

    it('setSpeakerId(null) удаляет speakerId из query', () => {
      mockRoute.value = { query: { speakerId: 'old' } };
      const { setSpeakerId } = useQuestionsFilters();
      setSpeakerId(null);
      expect(mockPush).toHaveBeenCalledWith({ query: {} });
    });

    it('setAreaId вызывает router.push с новым areaId и page=1', () => {
      const { setAreaId } = useQuestionsFilters();
      setAreaId('ar1');
      expect(mockPush).toHaveBeenCalledWith({
        query: { areaId: 'ar1', page: '1' },
      });
    });

    it('setSortOrder вызывает router.push с новым sortOrder и page=1', () => {
      const { setSortOrder } = useQuestionsFilters();
      setSortOrder('asc');
      expect(mockPush).toHaveBeenCalledWith({
        query: { sortOrder: 'asc', page: '1' },
      });
    });

    it('setSortOrder с дефолтом опускает sortOrder из query', () => {
      const { setSortOrder } = useQuestionsFilters();
      setSortOrder('desc');
      expect(mockPush).toHaveBeenCalledWith({ query: {} });
    });

    it('setSearch вызывает router.push с новым search и page=1', () => {
      const { setSearch } = useQuestionsFilters();
      setSearch('тест');
      expect(mockPush).toHaveBeenCalledWith({
        query: { search: 'тест', page: '1' },
      });
    });

    it('setSearch с пустой строкой удаляет search из query', () => {
      mockRoute.value = { query: { search: 'old' } };
      const { setSearch } = useQuestionsFilters();
      setSearch('');
      expect(mockPush).toHaveBeenCalledWith({ query: {} });
    });
  });

  describe('setter-методы сохраняют другие параметры', () => {
    it('setStatus сохраняет существующий speakerId', () => {
      mockRoute.value = {
        query: { speakerId: 'sp1', sortOrder: 'asc' },
      };
      const { setStatus } = useQuestionsFilters();
      setStatus('answered');
      expect(mockPush).toHaveBeenCalledWith({
        query: {
          status: 'answered',
          speakerId: 'sp1',
          sortOrder: 'asc',
          page: '1',
        },
      });
    });

    it('setSpeakerId сохраняет существующий status', () => {
      mockRoute.value = { query: { status: 'inFocus' } };
      const { setSpeakerId } = useQuestionsFilters();
      setSpeakerId('sp2');
      expect(mockPush).toHaveBeenCalledWith({
        query: { status: 'inFocus', speakerId: 'sp2', page: '1' },
      });
    });
  });

  describe('resetFilters', () => {
    it('очищает все параметры', () => {
      mockRoute.value = {
        query: {
          status: 'answered',
          page: '5',
          speakerId: 'sp1',
          areaId: 'ar1',
          sortOrder: 'asc',
          search: 'test',
        },
      };
      const { resetFilters } = useQuestionsFilters();
      resetFilters();
      expect(mockPush).toHaveBeenCalledWith({ query: {} });
    });
  });
});
```

- [ ] **Step 2: Запустить тесты, убедиться что они падают**

Run: `npx vitest run tests/entities/question/lib/use-questions-filters/index.test.ts`
Expected: FAIL — модуль `@/entities/question/lib/use-questions-filters` не найден

---

### Task 2: Composable `useQuestionsFilters` — реализация

**Files:**
- Create: `src/entities/question/lib/use-questions-filters/index.ts`

- [ ] **Step 1: Создать директорию и реализовать composable**

```ts
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import type { QuestionListParams } from '../../api/questions-repository';

import { QuestionStatusId } from '@/shared/dto';

const DEFAULT_STATUS = 'new';
const DEFAULT_PAGE = 1;
const DEFAULT_SORT_ORDER = 'desc';

const VALID_STATUSES = ['new', 'inFocus', 'answered'] as const;
type StatusKey = (typeof VALID_STATUSES)[number];

const statusToId: Record<StatusKey, QuestionStatusId> = {
  new: QuestionStatusId.New,
  inFocus: QuestionStatusId.InFocus,
  answered: QuestionStatusId.Answered,
};

function parseStatus(value: unknown): StatusKey {
  if (
    typeof value === 'string' &&
    VALID_STATUSES.includes(value as StatusKey)
  ) {
    return value as StatusKey;
  }
  return DEFAULT_STATUS;
}

function parsePage(value: unknown): number {
  const num = Number(value);
  return Number.isFinite(num) && num > 0 ? Math.floor(num) : DEFAULT_PAGE;
}

function parseSortOrder(value: unknown): 'asc' | 'desc' {
  if (value === 'asc' || value === 'desc') return value;
  return DEFAULT_SORT_ORDER;
}

function parseNullableString(value: unknown): string | null {
  if (typeof value === 'string' && value.length > 0) return value;
  return null;
}

function parseSearch(value: unknown): string {
  if (typeof value === 'string' && value.length > 0) return value;
  return '';
}

interface QueryOverrides {
  status?: string;
  page?: number;
  speakerId?: string | null;
  areaId?: string | null;
  sortOrder?: string;
  search?: string;
}

export function useQuestionsFilters() {
  const route = useRoute();
  const router = useRouter();

  const status = computed(() => parseStatus(route.query.status));
  const page = computed(() => parsePage(route.query.page));
  const speakerId = computed(() => parseNullableString(route.query.speakerId));
  const areaId = computed(() => parseNullableString(route.query.areaId));
  const sortOrder = computed(() => parseSortOrder(route.query.sortOrder));
  const search = computed(() => parseSearch(route.query.search));

  function buildQuery(overrides: QueryOverrides): Record<string, string> {
    const finalStatus = 'status' in overrides ? overrides.status : status.value;
    const finalPage = 'page' in overrides ? overrides.page : page.value;
    const finalSpeakerId =
      'speakerId' in overrides ? overrides.speakerId : speakerId.value;
    const finalAreaId =
      'areaId' in overrides ? overrides.areaId : areaId.value;
    const finalSortOrder =
      'sortOrder' in overrides ? overrides.sortOrder : sortOrder.value;
    const finalSearch =
      'search' in overrides ? overrides.search : search.value;

    const query: Record<string, string> = {};

    if (finalStatus !== DEFAULT_STATUS) query.status = finalStatus;
    if (finalPage !== DEFAULT_PAGE) query.page = String(finalPage);
    if (finalSpeakerId) query.speakerId = finalSpeakerId;
    if (finalAreaId) query.areaId = finalAreaId;
    if (finalSortOrder !== DEFAULT_SORT_ORDER)
      query.sortOrder = finalSortOrder;
    if (finalSearch) query.search = finalSearch;

    return query;
  }

  function setStatus(value: string) {
    router.push({ query: buildQuery({ status: value, page: 1 }) });
  }

  function setPage(value: number) {
    router.push({ query: buildQuery({ page: value }) });
  }

  function setSpeakerId(value: string | null) {
    router.push({
      query: buildQuery({ speakerId: value, page: 1 }),
    });
  }

  function setAreaId(value: string | null) {
    router.push({
      query: buildQuery({ areaId: value, page: 1 }),
    });
  }

  function setSortOrder(value: 'asc' | 'desc') {
    router.push({ query: buildQuery({ sortOrder: value, page: 1 }) });
  }

  function setSearch(value: string) {
    router.push({
      query: buildQuery({ search: value, page: 1 }),
    });
  }

  function resetFilters() {
    router.push({ query: {} });
  }

  const apiParams = computed<QuestionListParams>(() => ({
    page: page.value,
    pageSize: 10,
    status: statusToId[status.value],
    speakerId: speakerId.value ?? undefined,
    areaId: areaId.value ?? undefined,
    search: search.value || undefined,
    sortOrder: sortOrder.value,
  }));

  return {
    status,
    page,
    speakerId,
    areaId,
    sortOrder,
    search,
    apiParams,
    setStatus,
    setPage,
    setSpeakerId,
    setAreaId,
    setSortOrder,
    setSearch,
    resetFilters,
  };
}
```

- [ ] **Step 2: Запустить тесты, убедиться что они проходят**

Run: `npx vitest run tests/entities/question/lib/use-questions-filters/index.test.ts`
Expected: PASS

---

### Task 3: Экспорт composable из entity

**Files:**
- Modify: `src/entities/question/index.ts`

- [ ] **Step 1: Добавить экспорт useQuestionsFilters**

После существующих экспортов добавить:

```ts
export { useQuestionsFilters } from './lib/use-questions-filters';
```

- [ ] **Step 2: Запустить typecheck**

Run: `npm run typecheck`
Expected: PASS

---

### Task 4: QuestionFilters — controlled props

**Files:**
- Modify: `src/entities/question/ui/QuestionFilters.vue`

- [ ] **Step 1: Заменить внутренние ref на controlled props + emits**

Полное содержимое файла:

```vue
<template>
  <div class="question-filters">
    <div class="question-filters__row">
      <div class="question-filters__filters">
        <Select
          :model-value="speakerId"
          :options="speakers"
          :option-label="
            (speaker: SpeakerPublicResponse) =>
              `${speaker.lastName} ${speaker.firstName}`
          "
          option-value="id"
          placeholder="Спикер"
          size="small"
          show-clear
          class="question-filters__select"
          @update:model-value="onSpeakerChange" />

        <Select
          :model-value="areaId"
          :options="areas"
          option-label="title"
          option-value="id"
          placeholder="Область"
          size="small"
          show-clear
          class="question-filters__select"
          @update:model-value="onAreaChange" />
      </div>

      <SelectButton
        :model-value="sortOrder"
        :options="sortOptions"
        option-label="label"
        option-value="value"
        aria-label="Сортировка"
        class="question-filters__sort"
        @update:model-value="onSortChange">
        <template #option="{ option }">
          <i :class="option.icon" />
        </template>
      </SelectButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SpeakerPublicResponse, AreaResponse } from '@/shared/dto';

import Select from 'primevue/select';
import SelectButton from 'primevue/selectbutton';

defineOptions({ name: 'QuestionFilters' });

const { areas, speakers, speakerId, areaId, sortOrder } = defineProps<{
  areas: AreaResponse[];
  speakers: SpeakerPublicResponse[];
  speakerId: string | null;
  areaId: string | null;
  sortOrder: 'asc' | 'desc';
}>();

const emit = defineEmits<{
  (e: 'update:speakerId', value: string | null): void;
  (e: 'update:areaId', value: string | null): void;
  (e: 'update:sortOrder', value: 'asc' | 'desc'): void;
}>();

const sortOptions = [
  { label: 'Сначала новые', icon: 'pi pi-sort-amount-down', value: 'desc' },
  { label: 'Сначала старые', icon: 'pi pi-sort-amount-up', value: 'asc' },
];

function onSpeakerChange(value: string | null) {
  emit('update:speakerId', value);
}

function onAreaChange(value: string | null) {
  emit('update:areaId', value);
}

function onSortChange(value: 'asc' | 'desc') {
  emit('update:sortOrder', value);
}
</script>

<style lang="scss" scoped>
.question-filters__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  gap: 6px;
}

.question-filters__filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}

.question-filters__select {
  font-size: 13px;
}

.question-filters__sort {
  :deep(.p-selectbutton-option) {
    padding: 6px 10px;
  }

  :deep(.p-selectbutton-option-icon) {
    font-size: 14px;
  }
}
</style>
```

Ключевые изменения:
- Удалены внутренние `ref` (`sortOrder`, `selectedSpeaker`, `selectedAreaId`)
- Удалён `watch` и событие `change`
- Добавлены props `speakerId`, `areaId`, `sortOrder` (текущие значения из URL)
- PrimeVue компоненты используют `:model-value` + `@update:model-value` вместо `v-model` (controlled pattern)
- Три отдельных emit-события вместо объединённого `change`

- [ ] **Step 2: Запустить typecheck**

Run: `npm run typecheck`
Expected: PASS (QuestionsView ещё не обновлён, но QuestionFilters сам по себе корректен)

---

### Task 5: QuestionsView — интеграция composable

**Files:**
- Modify: `src/entities/question/ui/QuestionsView.vue`

- [ ] **Step 1: Переписать QuestionsView с использованием composable**

Полное содержимое файла:

```vue
<template>
  <div class="questions-view">
    <h1 class="questions-view__title">Вопросы</h1>

    <IconField class="questions-view__search-wrap">
      <InputIcon class="pi pi-search" />
      <InputText
        v-model="searchInput"
        class="questions-view__search-input"
        placeholder="Поиск вопросов..." />
    </IconField>

    <SelectButton
      :model-value="status"
      :options="tabs"
      option-label="label"
      option-value="value"
      aria-label="Статус вопроса"
      class="questions-view__segment"
      fluid
      @update:model-value="onStatusChange">
      <template #option="{ option }">
        <StatusDot
          :color="option.color"
          :label="option.label" />
      </template>
    </SelectButton>

    <QuestionFilters
      :areas="areas"
      :speakers="speakers"
      :speaker-id="speakerId"
      :area-id="areaId"
      :sort-order="sortOrder"
      @update:speaker-id="setSpeakerId"
      @update:area-id="setAreaId"
      @update:sort-order="setSortOrder" />

    <template v-if="questions.length > 0">
      <div class="questions-view__list">
        <QuestionCard
          v-for="question in questions"
          :key="question.id"
          :question="question" />
      </div>

      <Paginator
        :first="firstRow"
        :rows="pageSize"
        :total-records="totalCount"
        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
        class="questions-view__pagination"
        @page="onPageChange" />
    </template>

    <template v-else-if="!isLoading">
      <p class="questions-view__empty">Вопросы отсутствуют</p>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';

import type {
  QuestionResponse,
  AreaResponse,
  SpeakerPublicResponse,
} from '@/shared/dto';

import { QuestionStatusId } from '@/shared/dto';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import Paginator from 'primevue/paginator';
import SelectButton from 'primevue/selectbutton';
import { useApiCall } from '@/shared/lib';
import { StatusDot } from '@/shared/ui/status-dot';
import {
  useQuestionsFilters,
} from '../lib/use-questions-filters';
import { GetAll } from '../api/questions-repository';
import { questionStatusMap } from '../config/question-statuses';

import QuestionFilters from './QuestionFilters.vue';
import QuestionCard from './QuestionCard.vue';

defineOptions({ name: 'QuestionsView' });

const { areas, speakers } = defineProps<{
  areas: AreaResponse[];
  speakers: SpeakerPublicResponse[];
}>();

const router = useRouter();

const {
  status,
  page,
  speakerId,
  areaId,
  sortOrder,
  search,
  apiParams,
  setStatus,
  setPage,
  setSpeakerId,
  setAreaId,
  setSortOrder,
  setSearch,
} = useQuestionsFilters();

const { execute: executeFetch, isLoading } = useApiCall(GetAll, {
  showPreloader: false,
});

const questions = ref<QuestionResponse[]>([]);
const totalCount = ref(0);
const pageSize = 10;

const searchInput = ref(search.value);

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

const firstRow = computed(() => (page.value - 1) * pageSize);

let searchTimeout: ReturnType<typeof setTimeout> | undefined;

watch(searchInput, () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    setSearch(searchInput.value);
  }, 300);
});

watch(search, (newSearch) => {
  if (searchInput.value !== newSearch) {
    searchInput.value = newSearch;
  }
});

watch(apiParams, () => {
  fetchData();
});

function onStatusChange(value: string) {
  setStatus(value);
}

function onPageChange(event: { first: number }) {
  const newPage = Math.floor(event.first / pageSize) + 1;
  setPage(newPage);
}

async function fetchData() {
  const result = await executeFetch(apiParams.value);
  if (result) {
    questions.value = result.items;
    totalCount.value = result.totalCount;
  }
}

onMounted(() => {
  const scrollY = sessionStorage.getItem('questions-scroll');
  const cameFromDetail = router.options.history.state.back?.includes(
    '/question/',
  );
  if (scrollY && cameFromDetail) {
    nextTick(() => window.scrollTo(0, Number(scrollY)));
  } else {
    sessionStorage.removeItem('questions-scroll');
  }
  fetchData();
});
</script>

<style lang="scss" scoped>
.questions-view {
  max-width: 640px;
  padding: 24px 24px 48px;
  margin: 0 auto;
}

@media (width <= 600px) {
  .questions-view {
    padding: 16px 16px 32px;
  }
}

.questions-view__title {
  margin: 0 0 20px;
  color: variables.$text-primary;
  font-size: 24px;
  font-weight: 500;
}

.questions-view__search-wrap {
  margin-bottom: 16px;
}

.questions-view__search-input {
  display: block;
  width: 100%;
  padding: 10px 14px;
  border: 1px solid variables.$border-light;
  border-radius: 8px;
  background: variables.$surface-card;
  color: variables.$text-primary;
  font-size: 14px;
  outline: none;

  &::placeholder {
    color: variables.$text-muted;
  }

  &:focus {
    border-color: variables.$main-color;
  }
}

.questions-view__segment {
  width: 100%;
  margin-bottom: 12px;

  :deep(.p-selectbutton-option) {
    flex: 1;
    justify-content: center;
    padding: 12px 16px;
    font-size: 15px;
  }
}

.questions-view__list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.questions-view__pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  gap: 12px;
}

.questions-view__empty {
  margin: 40px 0 0;
  color: variables.$text-muted;
  font-size: 16px;
  text-align: center;
}
</style>
```

Ключевые изменения:
- Удалены локальные `ref`: `activeTab`, `currentPage`, `firstRow`, `filterSortOrder`, `filterSpeakerId`, `filterAreaId`, `searchQuery`
- Удалены `tabToStatus` маппинг, `params` computed, ручные `watch` на каждый параметр
- `useQuestionsFilters()` предоставляет все реактивные значения и setter-методы
- `searchInput` — локальный ref для debounce (в URL попадает итоговое значение)
- `SelectButton` статуса — controlled через `:model-value` + `@update:model-value`
- `Paginator` — `:first` computed из `(page - 1) * pageSize`, `@page` вызывает `setPage`
- Один `watch(apiParams)` заменяет все отдельные watch
- `onMounted` — восстановление scroll из sessionStorage

- [ ] **Step 2: Запустить typecheck**

Run: `npm run typecheck`
Expected: PASS

---

### Task 6: QuestionCard — сохранение scroll

**Files:**
- Modify: `src/entities/question/ui/QuestionCard.vue`

- [ ] **Step 1: Добавить сохранение scrollY перед навигацией**

Заменить функцию `navigateToQuestion`:

```ts
function navigateToQuestion() {
  sessionStorage.setItem('questions-scroll', String(window.scrollY));
  router.push(`/question/${question.id}`);
}
```

Никаких других изменений в QuestionCard.

- [ ] **Step 2: Запустить typecheck**

Run: `npm run typecheck`
Expected: PASS

---

### Task 7: Финальная проверка

- [ ] **Step 1: Запустить все тесты**

Run: `npx vitest run`
Expected: PASS

- [ ] **Step 2: Запустить линтеры**

Run: `npm run lint`
Expected: PASS

- [ ] **Step 3: Запустить typecheck**

Run: `npm run typecheck`
Expected: PASS

- [ ] **Step 4: Мануальная проверка в браузере**

1. Открыть `/questions` — дефолтные фильтры, URL без query
2. Переключить таб на «Отвеченные» — URL обновился: `?status=answered`
3. Выбрать спикера — URL: `?status=answered&speakerId=...`
4. Перейти на страницу 2 — URL: `?status=answered&speakerId=...&page=2`
5. Кликнуть на вопрос — переход на `/question/:id`
6. Нажать «Назад» — возврат на `/questions` с сохранёнными фильтрами и scroll
7. Нажать F5 — состояние сохраняется
8. Скопировать URL с query и открыть в новой вкладке — те же фильтры

- [ ] **Step 5: Коммит**

```bash
git add -A
git commit -m "feat(client): persist questions filters state in URL query params"
```
