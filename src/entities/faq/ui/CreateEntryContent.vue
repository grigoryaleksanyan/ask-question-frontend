<template>
  <SidebarContentWrapper title="Создать запись в FAQ">
    <template #default>
      <v-form
        ref="createEntry"
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
        Создать
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

<script setup lang="ts">
import { ref, reactive, useTemplateRef } from 'vue';

import sanitizeHtml from '@/shared/lib/html-sanitize';

import { ALERT_TYPES } from '@/shared/config';
import RichEditor from '@/shared/ui/rich-editor';

import { useAlertStore } from '@/entities/alert';
import { usePreloaderStore } from '@/features/preloader';

import { Create as CreateEntry } from '../api/faq-entry-repository';

defineOptions({ name: 'CreateEntryContent' });

const { modalConfirm, modalClose, categoryId, order } = defineProps<{
  modalConfirm: () => Promise<void>;
  modalClose: () => void;
  categoryId: string;
  order: number;
}>();

const alertStore = useAlertStore();
const preloaderStore = usePreloaderStore();

const createEntry = useTemplateRef('createEntry');

const valid = ref(false);

const controls = reactive({
  question: null as string | null,
  answer: null as string | null,
});

const rules = [
  (v: string) => !!v || 'Обязательное поле!',
  (v: string) => (v && v.trim().length > 0) || 'Поле не должно быть пустым!',
];

async function submitForm() {
  if (createEntry.value!.validate()) {
    try {
      preloaderStore.addLoader();

      const entry = {
        faqCategoryId: categoryId,
        question: controls.question,
        answer: sanitizeHtml(controls.answer),
        order,
      };

      const id = await CreateEntry(entry);

      entry.id = id;
      entry.created = new Date();

      alertStore.addAlert({
        type: ALERT_TYPES.SUCCESS,
        text: 'Запись успешно создана',
      });

      modalConfirm();
    } catch (error) {
      const err = error as Error;
      alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: err.message });
    } finally {
      preloaderStore.removeLoader();
    }
  }
}
</script>
