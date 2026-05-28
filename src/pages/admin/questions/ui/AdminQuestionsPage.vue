<template>
  <v-container fluid>
    <v-row class="pa-3">
      <v-col>
        <v-data-table
          v-model="selected"
          :headers="headers"
          :items="questions"
          item-key="id"
          show-select
          class="elevation-1">
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import type { QuestionResponse } from '@/shared/types';
import { ALERT_TYPES } from '@/shared/config';
import { GetAllQuestions } from '@/entities/question';
import { useAlertStore } from '@/entities/alert';

defineOptions({ name: 'AdminQuestionsPage' });

const alertStore = useAlertStore();

const questions = ref<QuestionResponse[]>([]);
const selected = ref<QuestionResponse[]>([]);

const headers = [
  { title: 'Имя', key: 'author' },
  { title: 'Зона ответственности', key: 'zone' },
  { title: 'Спикер', key: 'speaker' },
  { title: 'Вопрос', key: 'text' },
  { title: 'Лайки', key: 'likes' },
  { title: 'Дизлайки', key: 'dislikes' },
  { title: 'Просмотры', key: 'views' },
  { title: 'Статус', key: 'status' },
  { title: 'Дата создания', key: 'created' },
  { title: 'Дата ответа', key: 'answered' },
];

async function fetchData() {
  try {
    questions.value = await GetAllQuestions();
  } catch (error) {
    const err = error as Error;
    alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: err.message });
  }
}

fetchData();
</script>
