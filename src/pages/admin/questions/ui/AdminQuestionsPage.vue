<template>
  <div class="admin-questions-page">
    <Tabs
      v-model:value="activeTab"
      class="admin-questions-page__tabs">
      <TabList>
        <Tab
          v-for="tab in tabs"
          :key="tab.key"
          :value="tab.key">
          {{ tab.label }}
        </Tab>
      </TabList>
    </Tabs>

    <DataTable
      v-model:selection="selectedQuestions"
      :value="questions"
      data-key="id"
      class="admin-questions-page__table">
      <Column
        selection-mode="multiple"
        header-style="width: 3rem" />
      <Column
        field="text"
        header="Вопрос">
        <template #body="{ data }">
          <router-link
            :to="{
              name: ROUTES.adminQuestionDetail,
              params: { id: data.id },
            }"
            class="admin-questions-page__question-link">
            {{ data.text }}
          </router-link>
        </template>
      </Column>
      <Column
        field="areaTitle"
        header="Область">
        <template #body="{ data }">
          {{ data.areaTitle ?? '—' }}
        </template>
      </Column>
      <Column
        field="speakerName"
        header="Спикер">
        <template #body="{ data }">
          {{ data.speakerName || '—' }}
        </template>
      </Column>
      <Column header="Статус">
        <template #body="{ data }">
          <QuestionStatusDropdown
            :status="data.status"
            :question-id="data.id"
            @status-changed="onStatusChanged"
            @error="onActionError" />
        </template>
      </Column>
      <Column header="💬">
        <template #body="{ data }">
          <QuestionCommentButton
            :question-id="data.id"
            :comment="data.comment"
            @comment-changed="onCommentChanged"
            @error="onActionError" />
        </template>
      </Column>
      <Column
        field="likes"
        header="▲" />
      <Column header="Дата">
        <template #body="{ data }">
          {{ relativeTime(data.created) }}
        </template>
      </Column>
    </DataTable>

    <Paginator
      v-model:first="firstRow"
      :rows="pageSize"
      :total-records="totalCount"
      template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
      class="admin-questions-page__pagination" />

    <QuestionBulkActions
      :selected-ids="selectedIds"
      :questions="questions"
      @action-completed="fetchData"
      @clear-selection="clearSelection" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

import type { QuestionResponse } from '@/shared/dto';

import { QuestionStatusId } from '@/shared/dto';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Paginator from 'primevue/paginator';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';

import { GetAllQuestions, type QuestionListParams } from '@/entities/question';
import {
  QuestionStatusDropdown,
  QuestionCommentButton,
  QuestionBulkActions,
} from '@/features/manage-question';
import { useAuthStore } from '@/features/auth';

import ROUTES from '@/shared/routes';
import { useApiCall } from '@/shared/lib';

defineOptions({ name: 'AdminQuestionsPage' });

const authStore = useAuthStore();

const { execute: executeFetch } = useApiCall(GetAllQuestions, {
  showPreloader: false,
});

const questions = ref<QuestionResponse[]>([]);
const totalCount = ref(0);
const currentPage = ref(1);
const pageSize = 20;
const selectedQuestions = ref<QuestionResponse[]>([]);
const selectedIds = computed(
  () => new Set(selectedQuestions.value.map((q) => q.id)),
);
const activeTab = ref<string>('all');
const firstRow = ref(0);

const isSpeaker = computed(() => authStore.userData?.userRoleId === 2);

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

const params = computed<QuestionListParams>(() => ({
  page: currentPage.value,
  pageSize,
  status: tabToStatus[activeTab.value],
  speakerId: isSpeaker.value ? authStore.userData?.id : undefined,
}));

watch(activeTab, () => {
  currentPage.value = 1;
  fetchData();
});

watch(currentPage, () => {
  fetchData();
});

watch(currentPage, (newPage) => {
  firstRow.value = (newPage - 1) * pageSize;
});

watch(firstRow, (newFirst) => {
  currentPage.value = Math.floor(newFirst / pageSize) + 1;
});

function clearSelection() {
  selectedQuestions.value = [];
}

function onStatusChanged(id: string, newStatus: QuestionStatusId) {
  const question = questions.value.find((q) => q.id === id);
  if (question) {
    question.status = newStatus;
  }
}

function onCommentChanged(id: string, newComment: string | null) {
  const question = questions.value.find((q) => q.id === id);
  if (question) {
    question.comment = newComment;
  }
}

function onActionError() {
  fetchData();
}

function relativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;

  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) {
    return 'только что';
  }
  if (minutes < 60) {
    return `${minutes} мин`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}ч`;
  }

  const days = Math.floor(hours / 24);
  if (days < 30) {
    return `${days}д`;
  }

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
</style>
