<template>
  <div
    class="question-list-item"
    @click="navigate">
    <StatusDot :color="statusColor" />
    <div class="question-list-item__content">
      <div class="question-list-item__text">{{ question.text }}</div>
      <div class="question-list-item__meta">
        <span v-if="question.author">{{ question.author }}</span>
        <span v-if="question.areaTitle"> · {{ question.areaTitle }}</span>
        <span> · {{ formattedDate }}</span>
      </div>
    </div>
    <div class="question-list-item__votes">
      <span>▲ {{ question.likes }}</span>
      <span>▽ {{ question.dislikes }}</span>
      <span>◎ {{ question.views }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';

import type { QuestionResponse } from '@/shared/types';

import { StatusDot } from '@/shared/ui/status-dot';

import QUESTION_STATUSES from '../config/question-statuses';

defineOptions({ name: 'QuestionListItem' });

const { question } = defineProps<{
  question: QuestionResponse;
}>();

const router = useRouter();

const statusColor = computed(() => {
  switch (question.status) {
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

const formattedDate = computed(() =>
  new Date(question.created).toLocaleDateString('ru-RU'),
);

function navigate() {
  router.push(`/question/${question.id}`);
}
</script>

<style lang="scss" scoped>
.question-list-item {
  display: flex;
  align-items: flex-start;
  padding: 14px 16px;
  border-bottom: 1px solid #f0f0f0;
  color: variables.$text-primary;
  cursor: pointer;
  gap: 12px;

  &:hover {
    background: variables.$surface-bg;
  }
}

.question-list-item__content {
  min-width: 0;
  flex: 1;
}

.question-list-item__text {
  color: variables.$text-primary;
  font-size: 14px;
}

.question-list-item__meta {
  margin-top: 4px;
  color: variables.$text-muted;
  font-size: 12px;
}

.question-list-item__votes {
  display: flex;
  flex-shrink: 0;
  color: variables.$text-muted;
  font-size: 12px;
  gap: 12px;
}
</style>
