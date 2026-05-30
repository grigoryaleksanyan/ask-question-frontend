<template>
  <div class="question-id-view">
    <template v-if="question">
      <router-link
        to="/questions"
        class="question-id-view__back-link">
        ← Все вопросы
      </router-link>

      <div class="question-id-view__card">
        <div class="question-id-view__status-row">
          <StatusDot
            :color="statusColor"
            :label="statusLabel" />
          <span class="question-id-view__time">{{ formattedDate }}</span>
        </div>

        <p class="question-id-view__text">{{ question.text }}</p>

        <div class="question-id-view__meta">
          <span v-if="question.author">{{ question.author }}</span>
          <span v-if="question.areaTitle"> · {{ question.areaTitle }}</span>
          <span v-if="question.speakerName">
            · спикер: {{ question.speakerName }}
          </span>
        </div>

        <div class="question-id-view__divider"></div>

        <div class="question-id-view__vote-row">
          <QuestionVote
            :likes="question.likes"
            :dislikes="question.dislikes"
            :user-vote="question.userVote"
            @like="handleLike"
            @dislike="handleDislike" />
          <span class="question-id-view__views">
            <i class="pi pi-eye"></i> {{ question.views }}
          </span>
        </div>
      </div>
    </template>

    <template v-else-if="isLoading">
      <div class="question-id-view__loading">
        <ProgressSpinner style="width: 64px; height: 64px" />
      </div>
    </template>

    <template v-else>
      <p class="question-id-view__empty">Вопрос не найден</p>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

import type { QuestionResponse } from '@/shared/types';

import { StatusDot } from '@/shared/ui/status-dot';
import {
  GetById,
  LikeQuestion,
  DislikeQuestion,
} from '../api/questions-repository';
import QUESTION_STATUSES from '../config/question-statuses';

import QuestionVote from './QuestionVote.vue';
import ProgressSpinner from 'primevue/progressspinner';

defineOptions({ name: 'QuestionIdView' });

const route = useRoute();

const question = ref<QuestionResponse | null>(null);
const isLoading = ref(true);

const statusColor = computed(() => {
  if (!question.value) return QUESTION_STATUSES.ANSWERED.COLOR;

  switch (question.value.status) {
    case QUESTION_STATUSES.NEW.STATUS_ID:
      return QUESTION_STATUSES.NEW.COLOR;
    case QUESTION_STATUSES.IN_FOCUS.STATUS_ID:
      return QUESTION_STATUSES.IN_FOCUS.COLOR;
    case QUESTION_STATUSES.WITH_COMMENT.STATUS_ID:
      return QUESTION_STATUSES.WITH_COMMENT.COLOR;
    case QUESTION_STATUSES.ANSWERED.STATUS_ID:
      return QUESTION_STATUSES.ANSWERED.COLOR;
    default:
      return QUESTION_STATUSES.ANSWERED.COLOR;
  }
});

const statusLabel = computed(() => {
  if (!question.value) return '';

  switch (question.value.status) {
    case QUESTION_STATUSES.NEW.STATUS_ID:
      return QUESTION_STATUSES.NEW.TITLE;
    case QUESTION_STATUSES.IN_FOCUS.STATUS_ID:
      return QUESTION_STATUSES.IN_FOCUS.TITLE;
    case QUESTION_STATUSES.WITH_COMMENT.STATUS_ID:
      return QUESTION_STATUSES.WITH_COMMENT.TITLE;
    case QUESTION_STATUSES.ANSWERED.STATUS_ID:
      return QUESTION_STATUSES.ANSWERED.TITLE;
    default:
      return '';
  }
});

const formattedDate = computed(() => {
  if (!question.value) return '';
  return new Date(question.value.created).toLocaleDateString('ru-RU');
});

async function fetchQuestion() {
  isLoading.value = true;
  try {
    const id = route.params.id as string;
    question.value = await GetById(id);
  } catch {
    question.value = null;
  } finally {
    isLoading.value = false;
  }
}

async function handleLike() {
  if (!question.value) return;

  try {
    const result = await LikeQuestion(question.value.id);
    question.value.likes = result.likes;
    question.value.dislikes = result.dislikes;
    question.value.userVote = result.userVote;
  } catch {
    // intentionally empty - error handled at API level
  }
}

async function handleDislike() {
  if (!question.value) return;

  try {
    const result = await DislikeQuestion(question.value.id);
    question.value.likes = result.likes;
    question.value.dislikes = result.dislikes;
    question.value.userVote = result.userVote;
  } catch {
    // intentionally empty - error handled at API level
  }
}

onMounted(() => {
  fetchQuestion();
});
</script>

<style lang="scss" scoped>
.question-id-view {
  max-width: 640px;
  margin: 0 auto;
}

.question-id-view__back-link {
  display: inline-block;
  margin-bottom: 16px;
  color: variables.$main-color;
  font-size: 13px;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

.question-id-view__card {
  padding: 24px;
  border: 1px solid variables.$border-light;
  border-radius: 8px;
  background: variables.$surface-card;
}

.question-id-view__status-row {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  gap: 8px;
}

.question-id-view__time {
  color: variables.$text-muted;
  font-size: 12px;
}

.question-id-view__text {
  margin: 0 0 12px;
  color: variables.$text-primary;
  font-size: 18px;
  font-weight: 500;
  line-height: 1.5;
}

.question-id-view__meta {
  color: variables.$text-muted;
  font-size: 13px;
}

.question-id-view__divider {
  border-top: 1px solid #f0f0f0;
  margin: 20px 0;
}

.question-id-view__vote-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.question-id-view__views {
  display: inline-flex;
  align-items: center;
  color: variables.$text-muted;
  font-size: 13px;
  gap: 4px;
}

.question-id-view__loading {
  padding: 60px 0;
  text-align: center;
}

.question-id-view__empty {
  padding: 60px 0 0;
  color: variables.$text-muted;
  font-size: 16px;
  text-align: center;
}
</style>
