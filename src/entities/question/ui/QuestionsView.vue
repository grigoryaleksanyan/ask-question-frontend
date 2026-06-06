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
      :allow-empty="false"
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
        v-if="totalCount > PAGE_SIZE"
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
import { useQuestionsFilters, PAGE_SIZE } from '../lib/use-questions-filters';
import { GetAll } from '../api/questions-repository';
import { questionStatusMap } from '../config/question-statuses';

import QuestionFilters from './QuestionFilters.vue';
import QuestionCard from './QuestionCard.vue';

defineOptions({ name: 'QuestionsView' });

const { areas, speakers } = defineProps<{
  areas: AreaResponse[];
  speakers: SpeakerPublicResponse[];
}>();

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
const pageSize = PAGE_SIZE;

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
  setStatus(value as 'new' | 'inFocus' | 'answered');
}

function onPageChange(event: { first: number }) {
  const newPage = Math.floor(event.first / pageSize) + 1;
  setPage(newPage);
}

let pendingScrollId: string | null = null;

async function fetchData() {
  const result = await executeFetch(apiParams.value);
  if (result) {
    questions.value = result.items;
    totalCount.value = result.totalCount;
  }
  if (pendingScrollId) {
    await nextTick();
    const el = document.querySelector(
      `[data-question-id="${pendingScrollId}"]`,
    );
    el?.scrollIntoView({ block: 'center' });
    pendingScrollId = null;
  }
}

onMounted(() => {
  const scrollId = sessionStorage.getItem('questions-scroll-id');
  if (scrollId) {
    pendingScrollId = scrollId;
    sessionStorage.removeItem('questions-scroll-id');
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
