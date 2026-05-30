<template>
  <div style="max-width: 1000px">
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
        <TabView
          v-model:active-index="activeTabIndex"
          class="questions-view__tabs">
          <TabPanel value="new">
            <template #header>
              <span>Новые <i class="pi pi-box" /></span>
            </template>
          </TabPanel>
          <TabPanel value="inFocus">
            <template #header>
              <span>В фокусе <i class="pi pi-question-circle" /></span>
            </template>
          </TabPanel>
          <TabPanel value="withComment">
            <template #header>
              <span>С комментарием <i class="pi pi-comment" /></span>
            </template>
          </TabPanel>
          <TabPanel value="answered">
            <template #header>
              <span>Отвеченные <i class="pi pi-megaphone" /></span>
            </template>
          </TabPanel>
        </TabView>
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
          <p
            style="margin: 0; color: grey; font-size: 22px; text-align: center">
            Вопросы отсутствуют
          </p>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

import type { QuestionResponse } from '@/shared/types';

import { QuestionStatusId } from '@/shared/types';
import { ALERT_TYPES } from '@/shared/config';
import { useAlertStore } from '@/entities/alert';
import { GetAll, type QuestionListParams } from '../api/questions-repository';

import QuestionFilters from './QuestionFilters.vue';
import QuestionCard from './QuestionCard.vue';

import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Paginator from 'primevue/paginator';

defineOptions({ name: 'QuestionsView' });

const alertStore = useAlertStore();

const questions = ref<QuestionResponse[]>([]);
const isLoading = ref(false);
const totalCount = ref(0);
const currentPage = ref(1);
const pageSize = 10;
const searchQuery = ref('');
const activeTabIndex = ref(0);
const filterSortOrder = ref<'asc' | 'desc'>('desc');
const filterSpeakerId = ref<string | undefined>(undefined);
const filterAreaId = ref<string | undefined>(undefined);

const tabIndexToStatus: QuestionStatusId[] = [
  QuestionStatusId.New,
  QuestionStatusId.InFocus,
  QuestionStatusId.WithComment,
  QuestionStatusId.Answered,
];

const params = computed<QuestionListParams>(() => ({
  page: currentPage.value,
  pageSize,
  status: tabIndexToStatus[activeTabIndex.value],
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

watch(activeTabIndex, () => {
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
  isLoading.value = true;
  try {
    const result = await GetAll(params.value);
    questions.value = result.items;
    totalCount.value = result.totalCount;
  } catch (error) {
    const err = error as Error;
    alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: err.message });
  } finally {
    isLoading.value = false;
  }
}

fetchData();
</script>

<style lang="scss" scoped>
.questions-view__tabs :deep(.p-tabview-panels) {
  display: none;
}

@media (width >= 600px) {
  .questions-view__search-col {
    width: 66.6667%;
  }
}
</style>
