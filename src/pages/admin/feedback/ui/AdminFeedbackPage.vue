<template>
  <div class="admin-feedback-page">
    <div
      v-if="feedbacks.length > 0"
      class="admin-feedback-page__list">
      <FeedbackCard
        v-for="feedback in feedbacks"
        :key="feedback.id"
        :feedback="feedback"
        @delete="clickDeleteFeedbackBtn(feedback)" />
    </div>
    <p
      v-else
      class="admin-feedback-page__empty">
      Обратная связь отсутствует
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import type { FeedbackResponse } from '@/shared/dto';

import { useApiCall, useDeleteConfirmDialog } from '@/shared/lib';

import {
  GetAllFeedback,
  deleteFeedbackApi as DeleteFeedbackApi,
  FeedbackCard,
} from '@/features/feedback';

defineOptions({ name: 'AdminFeedbackPage' });

const { execute: executeFetchFeedbacks } = useApiCall(GetAllFeedback);

const feedbacks = ref<FeedbackResponse[]>([]);

const { confirmDelete: confirmDeleteFeedback } = useDeleteConfirmDialog({
  apiFn: DeleteFeedbackApi,
  message: 'Вы действительно хотите удалить обратную связь?',
  header: 'Удалить обратную связь',
  successMessage: 'Обратная связь успешно удалена',
});

async function fetchData() {
  const result = await executeFetchFeedbacks();
  if (result) {
    feedbacks.value = result;
  }
}

async function clickDeleteFeedbackBtn(feedback: FeedbackResponse) {
  const ok = await confirmDeleteFeedback(feedback.id);
  if (ok) {
    feedbacks.value = feedbacks.value.filter((f) => f.id !== feedback.id);
  }
}

fetchData();
</script>

<style lang="scss" scoped>
.admin-feedback-page {
  padding: 24px;
  color: variables.$text-primary-dark;
}

.admin-feedback-page__list {
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  gap: 8px;
}

.admin-feedback-page__empty {
  color: variables.$text-muted;
  font-size: 13px;
}
</style>
