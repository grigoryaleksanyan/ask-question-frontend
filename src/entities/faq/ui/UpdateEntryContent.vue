<template>
  <SidebarContentWrapper title="Изменить запись в FAQ">
    <template #default>
      <v-form
        ref="updateEntry"
        v-model="valid"
        @submit.prevent="submitForm">
        <v-row
          no-gutters
          class="mt-2">
          <v-col cols="12">
            <v-text-field
              v-model="controls.question"
              :rules="rules"
              label="Вопрос"
              variant="outlined" />
          </v-col>

          <v-col cols="12">
            <RichEditor v-model="controls.answer" />
          </v-col>
        </v-row>
      </v-form>
    </template>
    <template #footer>
      <v-btn
        variant="flat"
        color="primary"
        @click="submitForm">
        Изменить
      </v-btn>
      <v-btn
        variant="outlined"
        color="blue-grey"
        @click="modalClose">
        Отмена
      </v-btn>
    </template>
  </SidebarContentWrapper>
</template>

<script setup>
import { ref, reactive, onMounted, useTemplateRef } from 'vue';

import sanitizeHtml from '@/shared/lib/html-sanitize';

import { ALERT_TYPES } from '@/shared/config';
import RichEditor from '@/shared/ui/rich-editor';

import { useAlertStore } from '@/entities/alert';
import { usePreloaderStore } from '@/features/preloader';

import { Update as UpdateEntry } from '../api/faq-entry-repository';

defineOptions({ name: 'UpdateEntryContent' });

const { modalConfirm, modalClose, entry } = defineProps({
  modalConfirm: {
    type: Function,
    required: true,
  },

  modalClose: {
    type: Function,
    required: true,
  },

  entry: {
    type: Object,
    required: true,
  },
});

const alertStore = useAlertStore();
const preloaderStore = usePreloaderStore();

const updateEntry = useTemplateRef('updateEntry');

const valid = ref(false);

const controls = reactive({
  question: null,
  answer: null,
});

const rules = [
  (v) => !!v || 'Обязательное поле!',
  (v) => (v && v.trim().length > 0) || 'Поле не должно быть пустым!',
];

onMounted(() => {
  controls.question = entry.question;
  controls.answer = entry.answer;
});

async function submitForm() {
  if (updateEntry.value.validate()) {
    try {
      preloaderStore.addLoader();

      const entryData = {
        id: entry.id,
        question: controls.question,
        answer: sanitizeHtml(controls.answer),
      };

      await UpdateEntry(entryData);

      alertStore.addAlert({
        type: ALERT_TYPES.SUCCESS,
        text: 'Запись успешно изменена',
      });

      modalConfirm({
        ...entry,
        question: controls.question,
        answer: controls.answer,
      });
    } catch (error) {
      alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: error.message });
    } finally {
      preloaderStore.removeLoader();
    }
  }
}
</script>
