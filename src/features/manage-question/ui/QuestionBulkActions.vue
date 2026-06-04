<template>
  <div
    v-show="selectedIds.size > 0"
    class="question-bulk-actions">
    <span class="question-bulk-actions__count">
      Выбрано: {{ selectedIds.size }}
    </span>

    <QuestionExportButton
      :selected-ids="selectedIds"
      :questions="questions" />

    <div class="question-bulk-actions__group">
      <Select
        v-model="targetStatus"
        :options="statusOptions"
        option-label="label"
        option-value="value"
        placeholder="Новый статус"
        class="question-bulk-actions__select" />

      <Button
        label="Изменить статус"
        size="small"
        :disabled="targetStatus === null"
        :loading="isChangingStatus"
        @click="changeStatuses" />
    </div>

    <Button
      label="Удалить"
      severity="danger"
      size="small"
      outlined
      :loading="isDeleting"
      @click="deleteQuestions" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import { QuestionStatusId } from '@/shared/dto';
import type {
  QuestionStatusId as QuestionStatusIdType,
  QuestionResponse,
} from '@/shared/dto';

import { ChangeQuestionStatus, DeleteQuestion } from '@/entities/question';
import QuestionExportButton from './QuestionExportButton.vue';
import { useToast } from 'primevue/usetoast';
import Select from 'primevue/select';
import Button from 'primevue/button';

defineOptions({ name: 'QuestionBulkActions' });

const { selectedIds, questions } = defineProps<{
  selectedIds: Set<string>;
  questions: QuestionResponse[];
}>();

const emit = defineEmits<{
  'action-completed': [];
  'clear-selection': [];
}>();

const toast = useToast();

const targetStatus = ref<QuestionStatusIdType | null>(null);
const isChangingStatus = ref(false);
const isDeleting = ref(false);

const statusOptions = [
  { value: QuestionStatusId.New, label: 'Новый' },
  { value: QuestionStatusId.InFocus, label: 'В фокусе' },
  { value: QuestionStatusId.Answered, label: 'Отвеченный' },
];

async function changeStatuses() {
  if (targetStatus.value === null) {
    return;
  }

  isChangingStatus.value = true;

  const results = await Promise.allSettled(
    [...selectedIds].map((id) => ChangeQuestionStatus(id, targetStatus.value!)),
  );

  const failedCount = results.filter((r) => r.status === 'rejected').length;

  if (failedCount > 0) {
    toast.add({
      severity: 'error',
      detail: `Не удалось изменить статус у ${failedCount} вопросов`,
      group: 'api',
      life: 3000,
    });
  } else {
    toast.add({
      severity: 'success',
      detail: 'Статус изменён',
      group: 'api',
      life: 3000,
    });
  }

  isChangingStatus.value = false;
  targetStatus.value = null;
  emit('action-completed');
  emit('clear-selection');
}

async function deleteQuestions() {
  if (!confirm(`Удалить ${selectedIds.size} вопросов?`)) {
    return;
  }

  isDeleting.value = true;

  const results = await Promise.allSettled(
    [...selectedIds].map((id) => DeleteQuestion(id)),
  );

  const failedCount = results.filter((r) => r.status === 'rejected').length;

  if (failedCount > 0) {
    toast.add({
      severity: 'error',
      detail: `Не удалось удалить ${failedCount} вопросов`,
      group: 'api',
      life: 3000,
    });
  } else {
    toast.add({
      severity: 'success',
      detail: 'Вопросы удалены',
      group: 'api',
      life: 3000,
    });
  }

  isDeleting.value = false;
  emit('action-completed');
  emit('clear-selection');
}
</script>

<style lang="scss" scoped>
.question-bulk-actions {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border: 1px solid variables.$border-dark;
  border-radius: 0 0 10px 10px;
  border-top: none;
  background: variables.$surface-dark-elevated;
  gap: 16px;
}

.question-bulk-actions__count {
  color: variables.$text-secondary;
  font-size: 13px;
}

.question-bulk-actions__group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.question-bulk-actions__select {
  font-size: 13px;
}
</style>
