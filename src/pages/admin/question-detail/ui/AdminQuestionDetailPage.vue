<template>
  <div class="admin-question-detail">
    <div
      v-if="question"
      class="admin-question-detail__card">
      <div class="admin-question-detail__header">
        <router-link
          to="/admin-questions"
          class="admin-question-detail__back-link">
          ← К списку вопросов
        </router-link>
      </div>

      <div class="admin-question-detail__status-row">
        <QuestionStatusDropdown
          :status="question.status"
          :question-id="question.id"
          @status-changed="onStatusChanged"
          @error="fetchQuestion" />
        <span class="admin-question-detail__time">
          {{ formatDate(question.created) }}
        </span>
        <span
          v-if="question.answered"
          class="admin-question-detail__answered">
          · Ответ: {{ formatDate(question.answered) }}
        </span>
      </div>

      <p class="admin-question-detail__text">{{ question.text }}</p>

      <div class="admin-question-detail__meta">
        <span
          v-if="question.author"
          class="admin-question-detail__meta-item">
          <i class="pi pi-user"></i> {{ question.author }}
        </span>
        <span
          v-if="question.areaTitle"
          class="admin-question-detail__meta-item">
          <i class="pi pi-tag"></i> {{ question.areaTitle }}
        </span>
        <span
          v-if="question.speakerName"
          class="admin-question-detail__meta-item">
          <i class="pi pi-microphone"></i> {{ question.speakerName }}
        </span>
      </div>

      <div class="admin-question-detail__divider"></div>

      <div class="admin-question-detail__actions">
        <QuestionCommentButton
          :question-id="question.id"
          :comment="question.comment"
          @comment-changed="onCommentChanged"
          @error="fetchQuestion" />
      </div>

      <div
        v-if="question.comment"
        class="admin-question-detail__comment">
        <p class="admin-question-detail__comment-label">Комментарий:</p>
        <p class="admin-question-detail__comment-text">
          {{ question.comment }}
        </p>
      </div>

      <div class="admin-question-detail__divider"></div>

      <div class="admin-question-detail__stats">
        <span class="admin-question-detail__stat">
          <i class="pi pi-eye"></i> {{ question.views }}
        </span>
        <span class="admin-question-detail__stat">
          ▲ {{ question.likes }}
        </span>
        <span class="admin-question-detail__stat">
          ▼ {{ question.dislikes }}
        </span>
      </div>
    </div>

    <div
      v-else-if="isLoading"
      class="admin-question-detail__loading">
      <ProgressSpinner style="width: 64px; height: 64px" />
    </div>

    <div
      v-else
      class="admin-question-detail__empty">
      <p>Вопрос не найден</p>
      <router-link
        to="/admin-questions"
        class="admin-question-detail__back-link">
        ← Вернуться к списку
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

import type {
  QuestionResponse,
  QuestionStatusId as QuestionStatusIdType,
} from '@/shared/types';

import ProgressSpinner from 'primevue/progressspinner';

import { GetById as GetQuestionById } from '@/entities/question';
import {
  QuestionStatusDropdown,
  QuestionCommentButton,
} from '@/features/manage-question';
import { useApiCall } from '@/shared/lib';

defineOptions({ name: 'AdminQuestionDetailPage' });

const route = useRoute();

const question = ref<QuestionResponse | null>(null);
const isLoading = ref(true);

const { execute: executeFetch } = useApiCall(GetQuestionById, {
  showPreloader: false,
});

async function fetchQuestion() {
  isLoading.value = true;
  const id = route.params.id as string;
  const result = await executeFetch(id);
  question.value = result ?? null;
  isLoading.value = false;
}

function onStatusChanged(_id: string, newStatus: QuestionStatusIdType) {
  if (question.value) {
    question.value.status = newStatus;
  }
}

function onCommentChanged(_id: string, newComment: string | null) {
  if (question.value) {
    question.value.comment = newComment;
  }
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

onMounted(() => {
  fetchQuestion();
});
</script>

<style lang="scss" scoped>
.admin-question-detail {
  padding: 24px;
  color: variables.$text-primary-dark;
}

.admin-question-detail__card {
  max-width: 720px;
  padding: 24px;
  border: 1px solid variables.$border-dark;
  border-radius: 10px;
  background: variables.$surface-dark-elevated;
}

.admin-question-detail__back-link {
  display: inline-block;
  color: variables.$main-color;
  font-size: 13px;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

.admin-question-detail__status-row {
  display: flex;
  align-items: center;
  margin-top: 20px;
  gap: 12px;
}

.admin-question-detail__time {
  color: variables.$text-muted;
  font-size: 12px;
}

.admin-question-detail__answered {
  color: variables.$text-muted;
  font-size: 12px;
}

.admin-question-detail__text {
  margin: 20px 0 0;
  color: variables.$text-primary-dark;
  font-size: 18px;
  font-weight: 500;
  line-height: 1.6;
}

.admin-question-detail__meta {
  display: flex;
  flex-wrap: wrap;
  margin-top: 12px;
  color: variables.$text-secondary;
  font-size: 13px;
  gap: 16px;
}

.admin-question-detail__meta-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.admin-question-detail__divider {
  border-top: 1px solid variables.$border-dark;
  margin: 20px 0;
}

.admin-question-detail__actions {
  display: flex;
  gap: 12px;
}

.admin-question-detail__comment {
  padding: 12px;
  border-radius: 4px;
  border-left: 3px solid variables.$main-color;
  margin-top: 12px;
  background: rgb(79 106 246 / 8%);
}

.admin-question-detail__comment-label {
  margin: 0 0 4px;
  color: variables.$text-muted;
  font-size: 12px;
}

.admin-question-detail__comment-text {
  margin: 0;
  color: variables.$text-primary-dark;
  font-size: 14px;
  line-height: 1.5;
}

.admin-question-detail__stats {
  display: flex;
  color: variables.$text-secondary;
  font-size: 14px;
  gap: 20px;
}

.admin-question-detail__stat {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.admin-question-detail__loading {
  padding: 60px 0;
  text-align: center;
}

.admin-question-detail__empty {
  padding: 60px 0;
  color: variables.$text-muted;
  font-size: 16px;
  text-align: center;
}
</style>
