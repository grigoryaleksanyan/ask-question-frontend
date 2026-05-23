<template>
  <SidebarContentWrapper title="Обратная связь">
    <template #default>
      <v-form
        ref="feedbackForm"
        class="ma-0 pa-0"
        @submit.prevent="submitForm">
        <v-row
          no-gutters
          class="mt-2">
          <v-col cols="12">
            <v-text-field
              v-model="controls.username"
              label="Имя"
              :rules="rules"
              density="compact"
              variant="outlined" />
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="controls.email"
              label="Email"
              :rules="rules"
              density="compact"
              variant="outlined" />
          </v-col>
          <v-col cols="12">
            <v-select
              v-model="controls.theme"
              label="Тема обращения"
              :items="themes"
              :rules="rules"
              variant="outlined"
              :menu-props="{ bottom: true, offsetY: true }" />
          </v-col>
          <v-col cols="12">
            <v-textarea
              v-model="controls.text"
              :rules="rules"
              label="Текст обращения"
              auto-grow
              variant="outlined" />
          </v-col>
        </v-row>
      </v-form>
    </template>
    <template #footer>
      <v-btn
        color="primary"
        @click="submitForm">
        Отправить
      </v-btn>
      <v-btn
        color="primary"
        variant="outlined"
        @click="modalClose">
        Отмена
      </v-btn>

      <v-btn
        color="primary"
        variant="outlined"
        @click="show">
        preloader
      </v-btn>
    </template>
  </SidebarContentWrapper>
</template>

<script setup>
import { reactive, useTemplateRef } from 'vue';

import { ALERT_TYPES } from '@/shared/config';

import { useAlertStore } from '@/entities/alert';
import { usePreloaderStore } from '@/features/preloader';

import { Create } from '../api/feedback-repository';

defineOptions({ name: 'SidebarFeedbackContent' });

const { showPreloader, modalConfirm, modalClose } = defineProps({
  showPreloader: {
    type: Function,
    required: true,
  },

  modalConfirm: {
    type: Function,
    required: true,
  },

  modalClose: {
    type: Function,
    required: true,
  },
});

const alertStore = useAlertStore();
const preloaderStore = usePreloaderStore();

const feedbackForm = useTemplateRef('feedbackForm');

const themes = [
  'Технические проблемы в работе сайта',
  'Предложения, пожелания по работе или содержанию сайта',
];

const controls = reactive({
  username: null,
  email: null,
  theme: null,
  text: null,
});

const rules = [
  (v) => !!v || 'Обязательное поле!',
  (v) => (v && v.trim().length !== 0) || 'Поле не должно быть пустым!',
];

async function submitForm() {
  const { valid } = await feedbackForm.value.validate();

  if (!valid) {
    return;
  }

  try {
    preloaderStore.addLoader();
    await Create(controls);
    alertStore.addAlert({
      type: ALERT_TYPES.SUCCESS,
      text: 'Обратная связь отправлена',
    });
    modalConfirm();
  } catch (error) {
    alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: error.message });
  } finally {
    preloaderStore.removeLoader();
  }
}

function show() {
  showPreloader(true);
  setTimeout(() => {
    showPreloader(false);
  }, 2000);
}
</script>
