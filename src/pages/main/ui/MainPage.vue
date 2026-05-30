<template>
  <div class="pa-0">
    <VideoBackground
      style="height: 100vh"
      :src="backgroundVideo"
      :poster="backgroundPoster"
      overlay="linear-gradient(0deg, rgb(0, 0, 0, 0.5), rgb(0, 0, 0, 0.5))">
      <div
        class="grid p-3 align-content-center"
        style="height: 100vh">
        <div class="col-12">
          <h1 class="portal-title">Ask me</h1>
          <p class="additional-text">Ты не получаешь ответов?</p>
          <p class="additional-text">
            Главная причина в том, что ты не задаешь вопросов.
          </p>
        </div>
        <div class="col-12 flex justify-content-center">
          <QuestionFormCreate />
        </div>
        <div class="col-12 flex justify-content-center mt-12">
          <Button
            class="btn-to-popular-question"
            icon="pi pi-angle-down"
            rounded
            @click="scrollToPopular" />
        </div>
      </div>
    </VideoBackground>
    <div
      id="popular"
      class="grid my-5 mx-auto"
      style="max-width: 800px; min-height: 100vh">
      <div class="col-12">
        <div class="grid">
          <div class="col-12">
            <h3 class="typography__headline--large text-center">
              Популярные вопросы
            </h3>
          </div>
          <div class="col-12">
            <QuestionCard
              v-for="question in questions"
              :key="question.id"
              :question="question" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import VideoBackground from 'vue-responsive-video-background-player';

import type { QuestionResponse } from '@/shared/types';

import Button from 'primevue/button';

import {
  GetPopularQuestions,
  QuestionCard,
  QuestionFormCreate,
} from '@/entities/question';
import { useAlertStore } from '@/entities/alert';
import { ALERT_TYPES } from '@/shared/config';

defineOptions({ name: 'MainPage' });

const alertStore = useAlertStore();

const backgroundVideo = ref(
  new URL('@/shared/assets/video/background.mp4', import.meta.url).href,
);
const backgroundPoster = ref(
  new URL('@/shared/assets/img/poster.jpg', import.meta.url).href,
);
const questions = ref<QuestionResponse[]>([]);

function scrollToPopular() {
  document.querySelector('#popular')?.scrollIntoView({ behavior: 'smooth' });
}

async function fetchData() {
  try {
    questions.value = await GetPopularQuestions();
  } catch (error) {
    const err = error as Error;
    alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: err.message });
  }
}

fetchData();
</script>

<style lang="scss" scoped>
.portal-title {
  color: white;
  font-size: 6em;
  text-align: center;
  white-space: nowrap;
}

.additional-text {
  margin-bottom: 5px !important;
  color: white;
  font-size: 1.5em;
  line-height: 1;
  text-align: center;
}

@media (width <= 600px) {
  .portal-title {
    font-size: 3em;
  }

  .additional-text {
    font-size: 1em;
  }
}

.btn-to-popular-question {
  animation: pulsation 3s infinite;
}

@keyframes pulsation {
  0% {
    transform: scale(1.2, 1.2);
  }

  50% {
    transform: scale(0.9, 0.9);
  }

  100% {
    transform: scale(1.2, 1.2);
  }
}
</style>
