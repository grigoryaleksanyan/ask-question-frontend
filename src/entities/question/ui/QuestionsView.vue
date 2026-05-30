<template>
  <v-container
    fluid
    style="max-width: 1000px">
    <v-row no-gutters>
      <v-col
        cols="12"
        class="my-8">
        <h1 class="text-headline-large text-sm-display-small text-center">
          Все вопросы
        </h1>
      </v-col>
    </v-row>

    <v-row
      no-gutters
      class="mb-8 justify-center">
      <v-col
        cols="12"
        sm="8">
        <v-text-field
          v-model="searchQuery"
          label="Поиск"
          variant="solo-inverted"
          prepend-inner-icon="mdi-magnify"
          clearable
          hide-details />
      </v-col>
    </v-row>

    <v-row
      no-gutters
      class="mb-3">
      <v-col
        cols="12"
        class="mb-4">
        <v-tabs
          v-model="activeTab"
          :show-arrows="mobile"
          align-tabs="center">
          <v-tab
            value="new"
            style="width: 150px">
            Новые
            <v-icon class="ml-2 ml-sm-0">mdi-new-box</v-icon>
          </v-tab>
          <v-tab
            value="inFocus"
            style="width: 150px">
            В фокусе
            <v-icon class="ml-2 ml-sm-0">mdi-crosshairs-question</v-icon>
          </v-tab>
          <v-tab
            value="withComment"
            style="width: 150px">
            С комментарием
            <v-icon class="ml-2 ml-sm-0">mdi-comment-text-outline</v-icon>
          </v-tab>
          <v-tab
            value="answered"
            style="width: 150px">
            Отвеченные
            <v-icon class="ml-2 ml-sm-0">mdi-bullhorn-outline</v-icon>
          </v-tab>
        </v-tabs>
      </v-col>
    </v-row>

    <v-row
      no-gutters
      class="mb-3">
      <v-col cols="12">
        <QuestionFilters @change="onFiltersChange" />
      </v-col>
    </v-row>

    <template v-if="questions.length > 0">
      <v-row
        no-gutters
        class="mb-5">
        <v-col cols="12">
          <QuestionCard
            v-for="question in questions"
            :key="question.id"
            :question="question" />
        </v-col>
      </v-row>

      <v-row
        no-gutters
        class="mb-5">
        <v-col cols="12">
          <v-pagination
            v-model="currentPage"
            :length="totalPages"
            :total-visible="7" />
        </v-col>
      </v-row>
    </template>

    <template v-else-if="!isLoading">
      <v-row
        no-gutters
        class="my-6">
        <v-col cols="12">
          <p
            style="margin: 0; color: grey; font-size: 22px; text-align: center">
            Вопросы отсутствуют
          </p>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useDisplay } from 'vuetify';

import type { QuestionResponse } from '@/shared/types';

import { QuestionStatusId } from '@/shared/types';
import { ALERT_TYPES } from '@/shared/config';
import { useAlertStore } from '@/entities/alert';
import { GetAll, type QuestionListParams } from '../api/questions-repository';

import QuestionFilters from './QuestionFilters.vue';
import QuestionCard from './QuestionCard.vue';

defineOptions({ name: 'QuestionsView' });

const { mobile } = useDisplay();

const alertStore = useAlertStore();

const questions = ref<QuestionResponse[]>([]);
const isLoading = ref(false);
const totalCount = ref(0);
const currentPage = ref(1);
const pageSize = 10;
const searchQuery = ref('');
const activeTab = ref('new');
const filterSortOrder = ref<'asc' | 'desc'>('desc');
const filterSpeakerId = ref<string | undefined>(undefined);
const filterArea = ref<string | undefined>(undefined);

const statusMap: Record<string, QuestionStatusId> = {
  new: QuestionStatusId.New,
  inFocus: QuestionStatusId.InFocus,
  withComment: QuestionStatusId.WithComment,
  answered: QuestionStatusId.Answered,
};

const totalPages = computed(() => Math.ceil(totalCount.value / pageSize));

const params = computed<QuestionListParams>(() => ({
  page: currentPage.value,
  pageSize,
  status: statusMap[activeTab.value],
  speakerId: filterSpeakerId.value,
  area: filterArea.value,
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
  area?: string;
  sortOrder: 'asc' | 'desc';
}) {
  filterSpeakerId.value = filters.speakerId;
  filterArea.value = filters.area;
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
