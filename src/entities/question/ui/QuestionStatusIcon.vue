<template>
  <StatusDot
    :color="statusColor"
    :label="statusLabel" />
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { QuestionStatusId } from '@/shared/types';

import { StatusDot } from '@/shared/ui/status-dot';
import QUESTION_STATUSES from '../config/question-statuses';

defineOptions({ name: 'QuestionStatusIcon' });

const { status = QuestionStatusId.New } = defineProps<{
  status?: QuestionStatusId;
}>();

const statusMap: Record<QuestionStatusId, { color: string; label: string }> = {
  [QuestionStatusId.New]: {
    color: QUESTION_STATUSES.NEW.COLOR,
    label: QUESTION_STATUSES.NEW.TITLE,
  },
  [QuestionStatusId.InFocus]: {
    color: QUESTION_STATUSES.IN_FOCUS.COLOR,
    label: QUESTION_STATUSES.IN_FOCUS.TITLE,
  },
  [QuestionStatusId.WithComment]: {
    color: QUESTION_STATUSES.WITH_COMMENT.COLOR,
    label: QUESTION_STATUSES.WITH_COMMENT.TITLE,
  },
  [QuestionStatusId.Answered]: {
    color: QUESTION_STATUSES.ANSWERED.COLOR,
    label: QUESTION_STATUSES.ANSWERED.TITLE,
  },
};

const statusColor = computed(
  () => statusMap[status]?.color ?? QUESTION_STATUSES.ANSWERED.COLOR,
);
const statusLabel = computed(() => statusMap[status]?.label ?? '');
</script>
