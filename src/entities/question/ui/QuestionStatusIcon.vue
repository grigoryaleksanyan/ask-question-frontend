<template>
  <StatusDot
    :color="statusColor"
    :label="statusLabel" />
</template>

<script setup lang="ts">
import { computed } from 'vue';

import type { QuestionStatusId } from '@/shared/dto';

import { StatusDot } from '@/shared/ui/status-dot';
import QUESTION_STATUSES, {
  questionStatusMap,
} from '../config/question-statuses';

defineOptions({ name: 'QuestionStatusIcon' });

const { status = QUESTION_STATUSES.NEW.STATUS_ID } = defineProps<{
  status?: QuestionStatusId;
}>();

const statusColor = computed(
  () => questionStatusMap[status]?.color ?? QUESTION_STATUSES.ANSWERED.COLOR,
);
const statusLabel = computed(() => questionStatusMap[status]?.label ?? '');
</script>
