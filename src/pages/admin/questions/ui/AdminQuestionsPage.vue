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
        <div
          class="admin-questions-page__cell admin-questions-page__cell--check">
          <Checkbox
            :model-value="allSelected"
            binary
            @change="toggleAll" />
        </div>
        <div
          class="admin-questions-page__cell admin-questions-page__cell--question">
          Вопрос
        </div>
        <div
          class="admin-questions-page__cell admin-questions-page__cell--area">
          Зона
        </div>
        <div
          class="admin-questions-page__cell admin-questions-page__cell--speaker">
          Спикер
        </div>
        <div
          class="admin-questions-page__cell admin-questions-page__cell--status">
          Статус
        </div>
        <div
          class="admin-questions-page__cell admin-questions-page__cell--comment">
          💬
        </div>
        <div
          class="admin-questions-page__cell admin-questions-page__cell--votes">
          ▲
        </div>
        <div
          class="admin-questions-page__cell admin-questions-page__cell--date">
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
        @click="navigateToDetail(question.id)">
        <div
          class="admin-questions-page__cell admin-questions-page__cell--check"
          @click.stop>
          <Checkbox
            :model-value="selectedIds.has(question.id)"
            binary
            @change="toggleSelect(question.id)" />
        </div>
        <div
          class="admin-questions-page__cell admin-questions-page__cell--question"
          @click.stop>
          <router-link
            :to="{
              name: ROUTES.adminQuestionDetail,
              params: { id: question.id },
            }"
            class="admin-questions-page__question-link">
            {{ question.text }}
          </router-link>
        </div>
        <div
          class="admin-questions-page__cell admin-questions-page__cell--area">
          {{ question.areaTitle ?? '—' }}
        </div>
        <div
          class="admin-questions-page__cell admin-questions-page__cell--speaker">
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
        <div
          class="admin-questions-page__cell admin-questions-page__cell--votes">
          ▲ {{ question.likes }}
        </div>
        <div
          class="admin-questions-page__cell admin-questions-page__cell--date">
          {{ relativeTime(question.created) }}
        </div>
      </div>
    </div>

    <QuestionBulkActions
      :selected-ids="selectedIds"
      :questions="questions"
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

import type { QuestionResponse } from '@/shared/dto';

import { QuestionStatusId } from '@/shared/dto';
import Checkbox from 'primevue/checkbox';
import { useRouter } from 'vue-router';

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
const router = useRouter();

const { execute: executeFetch } = useApiCall(GetAllQuestions, {
  showPreloader: false,
});

const questions = ref<QuestionResponse[]>([]);
const totalCount = ref(0);
const currentPage = ref(1);
const pageSize = 20;
const selectedIds = ref<Set<string>>(new Set());
const activeTab = ref<string>('all');

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

const totalPages = computed(() =>
  Math.max(1, Math.ceil(totalCount.value / pageSize)),
);

const params = computed<QuestionListParams>(() => ({
  page: currentPage.value,
  pageSize,
  status: tabToStatus[activeTab.value],
  speakerId: isSpeaker.value ? authStore.userData?.id : undefined,
}));

const allSelected = computed(
  () =>
    questions.value.length > 0 &&
    questions.value.every((q) => selectedIds.value.has(q.id)),
);

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
  const allInPage = questions.value.every((q) => selectedIds.value.has(q.id));
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

function navigateToDetail(id: string) {
  router.push({ name: ROUTES.adminQuestionDetail, params: { id } });
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
  transition:
    color 0.15s,
    background-color 0.15s;
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
  text-transform: uppercase;
}

.admin-questions-page__row {
  border-bottom: 1px solid variables.$border-dark;
  cursor: pointer;
  font-size: 15px;
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

.admin-questions-page__question-link {
  color: inherit;
  text-decoration: none;
}

.admin-questions-page__cell--question {
  overflow: hidden;
  color: variables.$text-primary-dark;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.admin-questions-page__cell--area,
.admin-questions-page__cell--speaker {
  overflow: hidden;
  color: variables.$text-secondary;
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

.admin-questions-page__cell--votes,
.admin-questions-page__cell--date {
  color: variables.$text-secondary;
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
