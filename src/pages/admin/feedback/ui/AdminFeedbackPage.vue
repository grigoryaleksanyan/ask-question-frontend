<template>
  <div class="admin-feedback-page text-left p-5 mx-auto">
    <div class="grid">
      <div class="col-12">
        <div class="grid">
          <div class="col-12">
            <h1
              class="typography__headline--small typography__headline--medium--sm">
              Обратная связь
            </h1>
          </div>
        </div>

        <template v-if="feedbacks.length > 0">
          <div class="grid">
            <div
              v-for="feedback in feedbacks"
              :key="feedback.id"
              class="col-12">
              <FeedbackCard
                :feedback="feedback"
                @delete="clickDeleteFeedbackBtn(feedback)" />
            </div>
          </div>
        </template>
        <template v-else>
          <div class="grid">
            <div class="col-12">
              <p class="admin-feedback-page__empty">
                Обратная связь отсутствует
              </p>
            </div>
          </div>
        </template>
      </div>
    </div>

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
  max-width: 1200px;
}

.admin-feedback-page__empty {
  color: variables.$text-muted;
  font-size: 1.125rem;
}
</style>
