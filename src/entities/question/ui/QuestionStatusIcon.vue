<template>
  <span>
    <span>статус: {{ curentStatus.text }}</span>
    <v-icon
      size="24"
      :color="curentStatus.color"
      class="ml-2">
      {{ curentStatus.icon }}
    </v-icon>
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
    icon: 'mdi-help-circle-outline',
  },
  {
    text: QUESTION_STATUSES.IN_FOCUS.TITLE,
    color: QUESTION_STATUSES.IN_FOCUS.COLOR,
    icon: 'mdi-eye-outline',
  },
  {
    text: QUESTION_STATUSES.WITH_COMMENT.TITLE,
    color: QUESTION_STATUSES.WITH_COMMENT.COLOR,
    icon: 'mdi-comment-text-outline',
  },
  {
    text: QUESTION_STATUSES.ANSWERED.TITLE,
    color: QUESTION_STATUSES.ANSWERED.COLOR,
    icon: 'mdi-check-circle-outline',
  },
];

const curentStatus = computed(() => statusList[status]);
</script>
