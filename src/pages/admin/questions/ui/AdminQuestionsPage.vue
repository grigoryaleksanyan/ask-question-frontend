<template>
  <div class="admin-questions-page">
    <div class="admin-questions-page__tabs">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="admin-questions-page__tab"
        :class="{ 'admin-questions-page__tab--active': activeTab === tab.key }"
        @click="activeTab = tab.key">
        {{ tab.label }} ({{ tab.count }})
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
          class="admin-questions-page__cell admin-questions-page__cell--votes">
          Голоса
        </div>
        <div
          class="admin-questions-page__cell admin-questions-page__cell--date">
          Дата
        </div>
      </div>

      <div
        v-for="question in filteredQuestions"
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
        <div
          class="admin-questions-page__cell admin-questions-page__cell--question">
          {{ question.text }}
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
          class="admin-questions-page__cell admin-questions-page__cell--status">
          <StatusDot
            :color="getStatusColor(question.status)"
            :label="getStatusLabel(question.status)" />
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

import type { QuestionResponse } from '@/shared/types';

import { QuestionStatusId } from '@/shared/types';
import Checkbox from 'primevue/checkbox';

import { GetAllQuestions } from '@/entities/question';
import QUESTION_STATUSES from '@/entities/question/config/question-statuses';
import { StatusDot } from '@/shared/ui/status-dot';
import { useApiCall } from '@/shared/lib';

defineOptions({ name: 'AdminQuestionsPage' });

const { execute: executeFetch } = useApiCall(GetAllQuestions, {
  showPreloader: false,
});

const questions = ref<QuestionResponse[]>([]);
const selectedIds = ref<Set<string>>(new Set());
const activeTab = ref<string>('all');

const tabCounts = computed(() => ({
  all: questions.value.length,
  new: questions.value.filter((q) => q.status === QuestionStatusId.New).length,
  inFocus: questions.value.filter((q) => q.status === QuestionStatusId.InFocus)
    .length,
  withComment: questions.value.filter(
    (q) => q.status === QuestionStatusId.WithComment,
  ).length,
  answered: questions.value.filter(
    (q) => q.status === QuestionStatusId.Answered,
  ).length,
}));

const tabs = computed(() => [
  { key: 'all', label: 'Все', count: tabCounts.value.all },
  { key: 'new', label: 'Новые', count: tabCounts.value.new },
  { key: 'inFocus', label: 'В фокусе', count: tabCounts.value.inFocus },
  {
    key: 'withComment',
    label: 'С комментарием',
    count: tabCounts.value.withComment,
  },
  { key: 'answered', label: 'Отвеченные', count: tabCounts.value.answered },
]);

const filteredQuestions = computed(() => {
  if (activeTab.value === 'all') return questions.value;

  const statusMap: Record<string, QuestionStatusId> = {
    new: QuestionStatusId.New,
    inFocus: QuestionStatusId.InFocus,
    withComment: QuestionStatusId.WithComment,
    answered: QuestionStatusId.Answered,
  };

  const targetStatus = statusMap[activeTab.value];
  return questions.value.filter((q) => q.status === targetStatus);
});

const allSelected = computed(() => {
  const filtered = filteredQuestions.value;
  return (
    filtered.length > 0 && filtered.every((q) => selectedIds.value.has(q.id))
  );
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
  const filtered = filteredQuestions.value;
  const allInFilter = filtered.every((q) => selectedIds.value.has(q.id));

  const next = new Set(selectedIds.value);
  for (const q of filtered) {
    if (allInFilter) {
      next.delete(q.id);
    } else {
      next.add(q.id);
    }
  }
  selectedIds.value = next;
}

function getStatusColor(status: QuestionStatusId): string {
  const entry = Object.values(QUESTION_STATUSES).find(
    (s) => s.STATUS_ID === status,
  );
  return entry?.COLOR ?? '#9ba1b0';
}

function getStatusLabel(status: QuestionStatusId): string {
  const entry = Object.values(QUESTION_STATUSES).find(
    (s) => s.STATUS_ID === status,
  );
  return entry?.TITLE ?? '';
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
  const result = await executeFetch();
  if (result) {
    questions.value = result.items;
  }
}

fetchData();
</script>

<style lang="scss" scoped>
.admin-questions-page {
  padding: 20px 28px;
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
  border-radius: 6px;
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
  border-radius: 8px;
  background: variables.$surface-dark-elevated;
}

.admin-questions-page__header,
.admin-questions-page__row {
  display: grid;
  align-items: center;
  padding: 12px 16px;
  gap: 12px;
  grid-template-columns: 28px 1fr 120px 120px 100px 90px 90px;
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
  font-size: 15px;
}

.admin-questions-page__row--selected {
  background: rgba(variables.$main-color, 0.05);
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

.admin-questions-page__cell--votes,
.admin-questions-page__cell--date {
  color: variables.$text-secondary;
}
</style>
