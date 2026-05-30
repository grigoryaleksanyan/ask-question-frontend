<template>
  <div class="p-3">
    <DataTable
      v-model:selection="selected"
      :value="questions"
      table-style="min-width: 100%">
      <Column
        selection-mode="multiple"
        header-style="width: 3rem" />
      <Column
        field="author"
        header="Имя" />
      <Column
        field="areaTitle"
        header="Зона ответственности" />
      <Column
        field="speakerName"
        header="Спикер" />
      <Column
        field="text"
        header="Вопрос" />
      <Column
        field="likes"
        header="Лайки" />
      <Column
        field="dislikes"
        header="Дизлайки" />
      <Column
        field="views"
        header="Просмотры" />
      <Column
        field="status"
        header="Статус" />
      <Column
        field="created"
        header="Дата создания" />
      <Column
        field="answered"
        header="Дата ответа" />
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import type { QuestionResponse } from '@/shared/types';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

import { ALERT_TYPES } from '@/shared/config';
import { GetAllQuestions } from '@/entities/question';
import { useAlertStore } from '@/entities/alert';

defineOptions({ name: 'AdminQuestionsPage' });

const alertStore = useAlertStore();

const questions = ref<QuestionResponse[]>([]);
const selected = ref<QuestionResponse[]>([]);

async function fetchData() {
  try {
    const response = await GetAllQuestions();
    questions.value = response.items;
  } catch (error) {
    const err = error as Error;
    alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: err.message });
  }
}

fetchData();
</script>
