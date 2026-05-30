<template>
  <form class="m-0 p-0">
    <div class="grid grid-nogutter mt-2">
      <div class="col-12">
        <InputText
          v-model="controls.username"
          placeholder="Имя"
          class="w-full" />
      </div>
      <div class="col-12">
        <InputText
          v-model="controls.email"
          placeholder="Email"
          class="w-full" />
      </div>
      <div class="col-12">
        <Select
          v-model="controls.theme"
          :options="themes"
          placeholder="Тема обращения"
          class="w-full" />
      </div>
      <div class="col-12">
        <Textarea
          v-model="controls.text"
          placeholder="Текст обращения"
          auto-resize
          class="w-full" />
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive } from 'vue';

import { ALERT_TYPES } from '@/shared/config';

import { useAlertStore } from '@/entities/alert';
import { usePreloaderStore } from '@/features/preloader';

import { Create } from '../api/feedback-repository';

import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Select from 'primevue/select';

defineOptions({ name: 'SidebarFeedbackContent' });

const { showPreloader, modalConfirm, modalClose } = defineProps<{
  showPreloader: (show: boolean) => void;
  modalConfirm: () => Promise<void>;
  modalClose: () => void;
}>();

const alertStore = useAlertStore();
const preloaderStore = usePreloaderStore();

const themes = [
  'Технические проблемы в работе сайта',
  'Предложения, пожелания по работе или содержанию сайта',
];

const controls = reactive({
  username: null as string | null,
  email: null as string | null,
  theme: null as string | null,
  text: null as string | null,
});

function validate(): boolean {
  return !!(
    controls.username?.trim() &&
    controls.email?.trim() &&
    controls.theme?.trim() &&
    controls.text?.trim()
  );
}

async function submitForm() {
  if (!validate()) {
    return;
  }

  try {
    preloaderStore.addLoader();
    await Create({
      username: controls.username!,
      email: controls.email!,
      theme: controls.theme!,
      text: controls.text!,
    });
    alertStore.addAlert({
      type: ALERT_TYPES.SUCCESS,
      text: 'Обратная связь отправлена',
    });
    modalConfirm();
  } catch (error) {
    const err = error as Error;
    alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: err.message });
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

defineExpose({
  submitForm,
  show,
  modalClose,
});
</script>
