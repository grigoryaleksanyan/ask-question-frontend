<template>
  <div class="questions-view">
    <h1 class="questions-view__title">Вопросы</h1>

    <div class="questions-view__search-wrap">
      <i class="pi pi-search questions-view__search-icon"></i>
      <input
        v-model="searchQuery"
        class="questions-view__search-input"
        placeholder="Поиск вопросов..." />
    </div>

    <SelectButton
      v-model="activeTab"
      :options="tabs"
      option-label="label"
      option-value="value"
      aria-label="Статус вопроса"
      class="questions-view__segment"
      fluid>
      <template #option="{ option }">
        <StatusDot
          :color="option.color"
          :label="option.label" />
      </template>
    </SelectButton>

    <QuestionFilters
      :areas="areas"
      :speakers="speakers"
      @change="onFiltersChange" />

    <template v-if="questions.length > 0">
      <div class="questions-view__list">
        <QuestionCard
          v-for="question in questions"
          :key="question.id"
          :question="question" />
      </div>

      <div class="questions-view__pagination">
        <button
          class="questions-view__page-btn"
          :disabled="currentPage <= 1"
          @click="currentPage--">
          ‹
        </button>
        <span class="questions-view__page-info">
          {{ currentPage }} / {{ totalPages }}
        </span>
        <button
          class="questions-view__page-btn"
          :disabled="currentPage >= totalPages"
          @click="currentPage++">
          ›
        </button>
      </div>
    </template>

    <template v-else-if="!isLoading">
      <p class="questions-view__empty">Вопросы отсутствуют</p>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

import type {
  QuestionResponse,
  AreaResponse,
  SpeakerPublicResponse,
} from '@/shared/dto';

import { QuestionStatusId } from '@/shared/dto';
import SelectButton from 'primevue/selectbutton';
import { useApiCall } from '@/shared/lib';
import { StatusDot } from '@/shared/ui/status-dot';
import { GetAll, type QuestionListParams } from '../api/questions-repository';
import { questionStatusMap } from '../config/question-statuses';

import QuestionFilters from './QuestionFilters.vue';
import QuestionCard from './QuestionCard.vue';

defineOptions({ name: 'QuestionsView' });

const { areas, speakers } = defineProps<{
  areas: AreaResponse[];
  speakers: SpeakerPublicResponse[];
}>();

const { execute: executeFetch, isLoading } = useApiCall(GetAll, {
  showPreloader: false,
});

const questions = ref<QuestionResponse[]>([]);
const totalCount = ref(0);
const currentPage = ref(1);
const pageSize = 10;
const searchQuery = ref('');
const activeTab = ref('new');
const filterSortOrder = ref<'asc' | 'desc'>('desc');
const filterSpeakerId = ref<string | undefined>(undefined);
const filterAreaId = ref<string | undefined>(undefined);

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

const tabToStatus: Record<string, QuestionStatusId> = {
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
  speakerId: filterSpeakerId.value,
  areaId: filterAreaId.value,
  search: searchQuery.value || undefined,
  sortOrder: filterSortOrder.value,
}));

let searchTimeout: ReturnType<typeof setTimeout> | undefined;

watch(searchQuery, () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    currentPage.value = 1;
    fetchData();
  }, 300);
});

watch(activeTab, () => {
  currentPage.value = 1;
  fetchData();
});

watch(currentPage, () => {
  fetchData();
});

function onFiltersChange(filters: {
  speakerId?: string;
  areaId?: string;
  sortOrder: 'asc' | 'desc';
}) {
  filterSpeakerId.value = filters.speakerId;
  filterAreaId.value = filters.areaId;
  filterSortOrder.value = filters.sortOrder;
  currentPage.value = 1;
  fetchData();
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
  position: relative;
  margin-bottom: 16px;
}

.questions-view__search-icon {
  position: absolute;
  top: 50%;
  left: 14px;
  color: variables.$text-muted;
  font-size: 14px;
  transform: translateY(-50%);
}

.questions-view__search-input {
  display: block;
  width: 100%;
  padding: 10px 14px 10px 38px;
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

.questions-view__page-btn {
  width: 32px;
  height: 32px;
  padding: 0;
  border: 1px solid variables.$border-light;
  border-radius: 6px;
  background: variables.$surface-card;
  color: variables.$text-secondary;
  cursor: pointer;
  font-size: 16px;

  &:disabled {
    cursor: default;
    opacity: 0.4;
  }
}

.questions-view__page-info {
  color: variables.$text-muted;
  font-size: 13px;
}

.questions-view__empty {
  margin: 40px 0 0;
  color: variables.$text-muted;
  font-size: 16px;
  text-align: center;
}
</style>
