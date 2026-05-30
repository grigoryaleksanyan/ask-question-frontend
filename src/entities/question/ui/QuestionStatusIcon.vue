<template>
  <span class="question-status-icon">
    <span>статус: {{ curentStatus.text }}</span>
    <i
      :class="curentStatus.icon"
      :style="{ color: curentStatus.color, fontSize: '24px' }"
      class="ml-2"></i>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { QuestionStatusId } from '@/shared/types';

import QUESTION_STATUSES from '../config/question-statuses';

defineOptions({ name: 'QuestionStatusIcon' });

const { status = QuestionStatusId.New } = defineProps<{
  status?: QuestionStatusId;
}>();

const statusList = [
  {
    text: QUESTION_STATUSES.NEW.TITLE,
    color: QUESTION_STATUSES.NEW.COLOR,
    icon: 'pi pi-question-circle',
  },
  {
    text: QUESTION_STATUSES.IN_FOCUS.TITLE,
    color: QUESTION_STATUSES.IN_FOCUS.COLOR,
    icon: 'pi pi-eye',
  },
  {
    text: QUESTION_STATUSES.WITH_COMMENT.TITLE,
    color: QUESTION_STATUSES.WITH_COMMENT.COLOR,
    icon: 'pi pi-comment',
  },
  {
    text: QUESTION_STATUSES.ANSWERED.TITLE,
    color: QUESTION_STATUSES.ANSWERED.COLOR,
    icon: 'pi pi-check-circle',
  },
];

const curentStatus = computed(() => statusList[status]);
</script>

<style lang="scss" scoped>
.question-status-icon {
  display: inline-flex;
  align-items: center;
}
</style>
