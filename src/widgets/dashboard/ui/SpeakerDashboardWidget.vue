<template>
  <div class="speaker-dashboard">
    <div v-if="statusCounts">
      <div class="grid">
        <div
          v-for="stat in statCards"
          :key="stat.label"
          class="col-12 md:col-4">
          <div class="speaker-dashboard__card">
            <span
              class="speaker-dashboard__card-count"
              :style="{ color: stat.color }">
              {{ stat.count }}
            </span>
            <span class="speaker-dashboard__card-label">{{ stat.label }}</span>
          </div>
        </div>
      </div>
    </div>

    <h3 class="speaker-dashboard__section-title">Последние вопросы</h3>

    <div v-if="recentQuestions.length > 0">
      <DataTable
        :value="recentQuestions"
        class="speaker-dashboard__table">
        <Column header="Вопрос">
          <template #body="{ data }">
            <router-link
              :to="{
                name: ROUTES.adminQuestionDetail,
                params: { id: data.id },
              }"
              class="speaker-dashboard__question-link">
              {{ data.text }}
            </router-link>
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
        <Column header="Дата">
          <template #body="{ data }">
            {{ relativeTime(data.created) }}
          </template>
        </Column>
      </DataTable>
    </div>
    <div
      v-else
      class="speaker-dashboard__empty">
      Нет вопросов
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

import type { QuestionResponse } from '@/shared/dto';

import { QuestionStatusId } from '@/shared/dto';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

import { GetAllQuestions, questionStatusMap } from '@/entities/question';
import { QuestionStatusDropdown } from '@/features/manage-question';
import { useAuthStore } from '@/features/auth';

import ROUTES from '@/shared/routes';
import { useApiCall } from '@/shared/lib';

defineOptions({ name: 'SpeakerDashboardWidget' });

const authStore = useAuthStore();

const { execute: executeFetch } = useApiCall(GetAllQuestions, {
  showPreloader: false,
});

const questions = ref<QuestionResponse[]>([]);
const statusCounts = ref<Record<QuestionStatusId, number> | null>(null);

const statCards = computed(() => {
  if (!statusCounts.value) return [];
  return [
    {
      label: 'Новые',
      count: statusCounts.value[QuestionStatusId.New] ?? 0,
      color: questionStatusMap[QuestionStatusId.New].color,
    },
    {
      label: 'В фокусе',
      count: statusCounts.value[QuestionStatusId.InFocus] ?? 0,
      color: questionStatusMap[QuestionStatusId.InFocus].color,
    },
    {
      label: 'Отвеченные',
      count: statusCounts.value[QuestionStatusId.Answered] ?? 0,
      color: questionStatusMap[QuestionStatusId.Answered].color,
    },
  ];
});

const recentQuestions = computed(() => questions.value.slice(0, 10));

function onStatusChanged(id: string, newStatus: QuestionStatusId) {
  const question = questions.value.find((q) => q.id === id);
  if (question) {
    question.status = newStatus;
  }
  fetchData();
}

function onActionError() {
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
  const speakerId = authStore.userData?.id;
  if (!speakerId) return;

  const result = await executeFetch({ speakerId, pageSize: 10, page: 1 });
  if (result) {
    questions.value = result.items;
    statusCounts.value = {
      [QuestionStatusId.New]: 0,
      [QuestionStatusId.InFocus]: 0,
      [QuestionStatusId.Answered]: 0,
    };
    for (const q of result.items) {
      statusCounts.value[q.status] = (statusCounts.value[q.status] ?? 0) + 1;
    }
  }
}

onMounted(fetchData);
</script>

<style lang="scss" scoped>
.speaker-dashboard {
  color: variables.$text-primary-dark;
}

.speaker-dashboard__card {
  display: flex;
  flex-direction: column;
  padding: 16px;
  border: 1px solid variables.$border-dark;
  border-radius: 8px;
  background: variables.$toolbar-dark-bg;
  gap: 4px;
}

.speaker-dashboard__card-count {
  font-size: 28px;
  font-weight: 600;
}

.speaker-dashboard__card-label {
  color: variables.$text-primary-dark;
  font-size: 14px;
}

.speaker-dashboard__section-title {
  margin-top: 24px;
  margin-bottom: 12px;
  color: variables.$text-primary-dark;
  font-size: 18px;
  font-weight: 500;
}

.speaker-dashboard__question-link {
  color: variables.$main-color;
  text-decoration: none;
}

.speaker-dashboard__question-link:hover {
  text-decoration: underline;
}

.speaker-dashboard__empty {
  padding: 24px;
  color: variables.$text-primary-dark;
  text-align: center;
}
</style>
