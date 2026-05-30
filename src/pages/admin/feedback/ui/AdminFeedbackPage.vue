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

    <CenterModal
      title="Удалить обратную связь"
      :is-open="showDeleteFeedback"
      @close="showDeleteFeedback = false">
      <DeleteFeedbackModal
        v-if="showDeleteFeedback && currentFeedback"
        :id="currentFeedback.id"
        ref="delete-feedback"
        @success="successDeleteFeedback"
        @cancel="showDeleteFeedback = false" />
      <template #footer>
        <Button
          label="Удалить"
          severity="danger"
          @click="deleteFeedbackRef?.confirm()" />
        <Button
          label="Отмена"
          outlined
          severity="secondary"
          @click="deleteFeedbackRef?.cancel()" />
      </template>
    </CenterModal>
  </div>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';

import type { FeedbackResponse } from '@/shared/types';

import Button from 'primevue/button';

import CenterModal from '@/shared/ui/center-modal/CenterModal.vue';

import { useApiCall } from '@/shared/lib';

import {
  GetAllFeedback,
  FeedbackCard,
  DeleteFeedbackModal,
} from '@/features/feedback';

defineOptions({ name: 'AdminFeedbackPage' });

const { execute: executeFetchFeedbacks } = useApiCall(GetAllFeedback);

const feedbacks = ref<FeedbackResponse[]>([]);
const currentFeedback = ref<FeedbackResponse | null>(null);
const showDeleteFeedback = ref(false);

const deleteFeedbackRef = useTemplateRef('delete-feedback');

async function fetchData() {
  const result = await executeFetchFeedbacks();
  if (result) {
    feedbacks.value = result;
  }
}

function clickDeleteFeedbackBtn(feedback: FeedbackResponse) {
  currentFeedback.value = feedback;
  showDeleteFeedback.value = true;
}

function successDeleteFeedback(feedbackId: string) {
  feedbacks.value = feedbacks.value.filter(
    (feedback) => feedback.id !== feedbackId,
  );
  showDeleteFeedback.value = false;
}

fetchData();
</script>

<style lang="scss" scoped>
.admin-feedback-page {
  padding: 16px 24px;
}

.admin-feedback-page__list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.admin-feedback-page__empty {
  color: variables.$text-muted;
  font-size: 13px;
}
</style>
