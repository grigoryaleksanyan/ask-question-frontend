<template>
  <Select
    :model-value="status"
    :options="statusOptions"
    option-label="label"
    option-value="value"
    class="question-status-dropdown"
    @update:model-value="onStatusChange">
    <template #value="{ value }">
      <div class="question-status-dropdown__selected">
        <span
          class="question-status-dropdown__dot"
          :style="{ background: getStatusColor(value) }"></span>
        <span class="question-status-dropdown__label">
          {{ getStatusLabel(value) }}
        </span>
      </div>
    </template>
    <template #option="{ option }">
      <div class="question-status-dropdown__option">
        <span
          class="question-status-dropdown__dot"
          :style="{ background: getStatusColor(option.value) }"></span>
        <span>{{ option.label }}</span>
      </div>
    </template>
  </Select>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import { QuestionStatusId } from '@/shared/types';
import type { QuestionStatusId as QuestionStatusIdType } from '@/shared/types';

import {
  ChangeQuestionStatus,
  getStatusColor,
  getStatusLabel,
} from '@/entities/question';
import { useApiCall } from '@/shared/lib';
import Select from 'primevue/select';

defineOptions({ name: 'QuestionStatusDropdown' });

const { status, questionId } = defineProps<{
  status: QuestionStatusIdType;
  questionId: string;
}>();

const emit = defineEmits<{
  'status-changed': [id: string, newStatus: QuestionStatusIdType];
  error: [id: string];
}>();

const localStatus = ref(status);

const { execute: executeChangeStatus } = useApiCall(ChangeQuestionStatus, {
  showPreloader: false,
  successMessage: 'Статус изменён',
  onSuccess() {
    emit('status-changed', questionId, localStatus.value);
  },
  onError() {
    localStatus.value = status;
    emit('error', questionId);
  },
});

const statusOptions = [
  { value: QuestionStatusId.New, label: 'Новый' },
  { value: QuestionStatusId.InFocus, label: 'В фокусе' },
  { value: QuestionStatusId.Answered, label: 'Отвеченный' },
];

async function onStatusChange(newStatus: QuestionStatusIdType) {
  const previousStatus = localStatus.value;
  localStatus.value = newStatus;
  await executeChangeStatus(questionId, newStatus);
  if (localStatus.value !== newStatus) {
    localStatus.value = previousStatus;
  }
}
</script>

<style lang="scss" scoped>
.question-status-dropdown {
  font-size: 12px;
}

.question-status-dropdown__selected,
.question-status-dropdown__option {
  display: flex;
  align-items: center;
  gap: 6px;
}

.question-status-dropdown__dot {
  width: 8px;
  height: 8px;
  flex-shrink: 0;
  border-radius: 50%;
}

.question-status-dropdown__label {
  font-size: 12px;
}
</style>
