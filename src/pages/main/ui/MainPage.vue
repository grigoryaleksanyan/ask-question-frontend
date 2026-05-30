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
          <h1 class="main-page__title typography__display--large--sm">
            Ask me
          </h1>
          <p class="main-page__subtitle">Ты не получаешь ответов?</p>
          <p class="main-page__subtitle main-page__subtitle--accent">
            Главная причина в том, что ты не задаешь вопросов.
          </p>
        </div>
        <div class="col-12 flex justify-content-center">
          <QuestionFormCreate />
        </div>
        <div class="col-12 flex justify-content-center mt-12">
          <Button
            class="main-page__scroll-btn"
            icon="pi pi-angle-down"
            rounded
            @click="scrollToPopular" />
        </div>
      </div>
    </VideoBackground>
    <div
      id="popular"
      class="grid my-5 mx-auto main-page__popular">
      <div class="col-12">
        <div class="grid">
          <div class="col-12">
            <h3
              class="typography__headline--large text-center main-page__section-title">
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
import { useApiCall } from '@/shared/lib';

defineOptions({ name: 'MainPage' });

const { execute: executeFetch } = useApiCall(GetPopularQuestions, {
  showPreloader: false,
});

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
  const result = await executeFetch();
  if (result) {
    questions.value = result;
  }
}

fetchData();
</script>

<style lang="scss" scoped>
.main-page__title {
  color: white;
  font-family: variables.$font-display;
  font-size: 4.5rem;
  text-align: center;
  white-space: nowrap;
}

.main-page__subtitle {
  margin-bottom: 5px !important;
  color: white;
  font-size: 1.25rem;
  line-height: 1;
  text-align: center;
}

.main-page__subtitle--accent {
  font-family: variables.$font-display;
  font-size: 1.5rem;
  font-style: italic;
}

.main-page__scroll-btn {
  animation: pulsation 3s infinite;
}

.main-page__popular {
  max-width: 800px;
  min-height: 100vh;
}

.main-page__section-title {
  font-family: variables.$font-display;
  font-weight: 400;
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

@media (width <= 600px) {
  .main-page__title {
    font-size: 3rem;
  }

  .main-page__subtitle {
    font-size: 1rem;
  }

  .main-page__subtitle--accent {
    font-size: 1.125rem;
  }
}
</style>
