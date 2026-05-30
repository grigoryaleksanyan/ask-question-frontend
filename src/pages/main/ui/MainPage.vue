<template>
  <div class="main-page">
    <div class="main-page__hero">
      <h1 class="main-page__title">Задайте вопрос</h1>
      <p class="main-page__subtitle">
        Платформа для сбора вопросов спикерам вашей организации
      </p>
      <QuestionFormCreate />
    </div>

    <div class="main-page__popular">
      <div class="main-page__section-label">Популярные вопросы</div>
      <div class="main-page__questions">
        <QuestionCard
          v-for="question in questions"
          :key="question.id"
          :question="question" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import type { QuestionResponse } from '@/shared/types';

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

const questions = ref<QuestionResponse[]>([]);

async function fetchData() {
  const result = await executeFetch();
  if (result) {
    questions.value = result;
  }
}

fetchData();
</script>

<style lang="scss" scoped>
.main-page__hero {
  max-width: 640px;
  padding: 80px 24px 48px;
  margin: 0 auto;
  text-align: center;
}

.main-page__title {
  margin-bottom: 12px;
  color: variables.$text-primary;
  font-size: 32px;
  font-weight: 500;
  letter-spacing: -0.5px;
}

.main-page__subtitle {
  margin-bottom: 40px;
  color: variables.$text-secondary;
  font-size: 16px;
  line-height: 1.6;
}

.main-page__popular {
  max-width: 640px;
  padding: 0 24px 48px;
  margin: 0 auto;
}

.main-page__section-label {
  margin-bottom: 16px;
  color: variables.$text-muted;
  font-size: 12px;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.main-page__questions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

@media (width <= 600px) {
  .main-page__hero {
    padding: 40px 16px;
  }

  .main-page__title {
    font-size: 24px;
  }

  .main-page__subtitle {
    font-size: 14px;
  }
}
</style>
