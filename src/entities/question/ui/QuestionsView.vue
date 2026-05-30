<template>
  <div class="questions-view">
    <div class="grid grid-nogutter">
      <div class="col-12 my-8">
        <h1
          class="typography__headline--large typography__display--small--sm text-center">
          Все вопросы
        </h1>
      </div>
    </div>

    <div class="grid grid-nogutter mb-8 justify-content-center">
      <div class="col-12 questions-view__search-col">
        <IconField>
          <InputIcon class="pi pi-search" />
          <InputText
            v-model="searchQuery"
            placeholder="Поиск"
            class="w-full" />
        </IconField>
      </div>
    </div>

    <div class="grid grid-nogutter mb-3">
      <div class="col-12 mb-4">
        <Tabs
          v-model:value="activeTab"
          class="questions-view__tabs">
          <TabList>
            <Tab value="new">
              <span>Новые <i class="pi pi-box" /></span>
            </Tab>
            <Tab value="inFocus">
              <span>В фокусе <i class="pi pi-question-circle" /></span>
            </Tab>
            <Tab value="withComment">
              <span>С комментарием <i class="pi pi-comment" /></span>
            </Tab>
            <Tab value="answered">
              <span>Отвеченные <i class="pi pi-megaphone" /></span>
            </Tab>
          </TabList>
        </Tabs>
      </div>
    </div>

    <div class="grid grid-nogutter mb-3">
      <div class="col-12">
        <QuestionFilters @change="onFiltersChange" />
      </div>
    </div>

    <template v-if="questions.length > 0">
      <div class="grid grid-nogutter mb-5">
        <div class="col-12">
          <QuestionCard
            v-for="question in questions"
            :key="question.id"
            :question="question" />
        </div>
      </div>

      <div class="grid grid-nogutter mb-5">
        <div class="col-12">
          <Paginator
            :rows="pageSize"
            :total-records="totalCount"
            :first="(currentPage - 1) * pageSize"
            @page="onPageChange" />
        </div>
      </div>
    </template>

    <template v-else-if="!isLoading">
      <div class="grid grid-nogutter my-6">
        <div class="col-12">
          <p class="questions-view__empty">Вопросы отсутствуют</p>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

import type { QuestionResponse } from '@/shared/types';

import { QuestionStatusId } from '@/shared/types';
import { useApiCall } from '@/shared/lib';
import { GetAll, type QuestionListParams } from '../api/questions-repository';

import QuestionFilters from './QuestionFilters.vue';
import QuestionCard from './QuestionCard.vue';

import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import Paginator from 'primevue/paginator';

defineOptions({ name: 'QuestionsView' });

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

const tabToStatus: Record<string, QuestionStatusId> = {
  new: QuestionStatusId.New,
  inFocus: QuestionStatusId.InFocus,
  withComment: QuestionStatusId.WithComment,
  answered: QuestionStatusId.Answered,
};

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

function onPageChange(event: { page: number }) {
  currentPage.value = event.page + 1;
}

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
  max-width: 1000px;
}

.questions-view__tabs :deep(.p-tabpanels) {
  display: none;
}

.questions-view__empty {
  margin: 0;
  color: variables.$text-muted;
  font-size: 1.375rem;
  text-align: center;
}

@media (width >= 600px) {
  .questions-view__search-col {
    width: 66.6667%;
  }
}
</style>
