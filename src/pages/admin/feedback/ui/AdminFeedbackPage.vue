<template>
  <v-container
    style="max-width: 1200px"
    class="text-left pa-5 mx-auto"
    fluid>
    <v-row>
      <v-col cols="12">
        <v-row>
          <v-col cols="12">
            <h1 class="text-headline-small text-sm-headline-medium">
              Обратная связь
            </h1>
          </v-col>
        </v-row>

        <template v-if="feedbacks.length > 0">
          <v-row>
            <v-col
              v-for="feedback in feedbacks"
              :key="feedback.id"
              cols="12">
              <FeedbackCard
                :feedback="feedback"
                @delete="clickDeleteFeedbackBtn(feedback)" />
            </v-col>
          </v-row>
        </template>
        <template v-else>
          <v-row>
            <v-col cols="12">
              <p>Обратная связь отсутствует</p>
            </v-col>
          </v-row>
        </template>
      </v-col>
    </v-row>

    <CenterModal
      title="Удалить обратную связь"
      :is-open="showDeleteFeedback"
      @close="showDeleteFeedback = false">
      <DeleteFeedbackModal
        v-if="showDeleteFeedback && currentFeedback"
        :id="currentFeedback.id"
        @success="successDeleteFeedback"
        @cancel="showDeleteFeedback = false" />
    </CenterModal>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import type { FeedbackResponse } from '@/shared/types';

import { ALERT_TYPES } from '@/shared/config';

import {
  GetAllFeedback,
  FeedbackCard,
  DeleteFeedbackModal,
} from '@/features/feedback';
import { useAlertStore } from '@/entities/alert';
import { usePreloaderStore } from '@/features/preloader';

defineOptions({ name: 'AdminFeedbackPage' });

const alertStore = useAlertStore();
const preloaderStore = usePreloaderStore();

const feedbacks = ref<FeedbackResponse[]>([]);
const currentFeedback = ref<FeedbackResponse | null>(null);
const showDeleteFeedback = ref(false);

async function fetchData() {
  try {
    preloaderStore.addLoader();
    feedbacks.value = await GetAllFeedback();
  } catch (error) {
    const err = error as Error;
    alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: err.message });
  } finally {
    preloaderStore.removeLoader();
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
