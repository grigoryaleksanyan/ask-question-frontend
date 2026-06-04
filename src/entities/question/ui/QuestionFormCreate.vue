<template>
  <div class="question-form-create">
    <form @submit.prevent="submitForm">
      <Textarea
        v-model="controls.text"
        auto-resize
        rows="2"
        placeholder="Расскажите подробнее о..."
        class="question-form-create__textarea w-full" />

      <div class="question-form-create__actions">
        <Button
          type="submit"
          severity="primary"
          label="Отправить" />

        <span
          class="question-form-create__details-link"
          @click="toggleDetails">
          + Детали
        </span>
      </div>

      <Transition name="expand">
        <div v-show="showDetails">
          <div class="question-form-create__details">
            <InputText
              v-model="controls.author"
              placeholder="Имя"
              class="w-full" />

            <Select
              v-model="controls.areaId"
              :options="areas"
              option-label="title"
              option-value="id"
              placeholder="Область*"
              class="w-full" />

            <Select
              v-model="controls.speakerId"
              :options="speakers"
              option-label="lastName"
              option-value="id"
              placeholder="Спикер*"
              class="w-full" />

            <div class="question-form-create__captcha-row">
              <InputText
                v-model="captcha"
                placeholder="Код*"
                class="w-full" />

              <template v-if="captchaData">
                <img
                  :src="captchaData"
                  class="question-form-create__captcha"
                  alt="captcha" />
              </template>

              <template v-else>
                <i class="pi pi-refresh question-form-create__spinner"></i>
              </template>
            </div>
          </div>
        </div>
      </Transition>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

import type { AreaResponse, SpeakerPublicResponse } from '@/shared/dto';

import { useApiCall } from '@/shared/lib';
import { GetCaptcha, Create } from '../api/questions-repository';

import Textarea from 'primevue/textarea';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import Button from 'primevue/button';

defineOptions({ name: 'QuestionFormCreate' });

const { areas, speakers } = defineProps<{
  areas: AreaResponse[];
  speakers: SpeakerPublicResponse[];
}>();

const { execute: executeGetCaptcha } = useApiCall(GetCaptcha, {
  showPreloader: false,
});
const { execute: executeSubmit } = useApiCall(Create, {
  successMessage: 'Ваш вопрос успешно добавлен',
  showPreloader: false,
  onSuccess() {
    resetForm();
  },
  onError() {
    executeGetCaptcha();
  },
});

const showDetails = ref(false);
const captchaData = ref<string | null>(null);
const captcha = ref(null as string | null);

const controls = reactive({
  text: null as string | null,
  author: null as string | null,
  speakerId: null as string | null,
  areaId: undefined as string | undefined,
});

function toggleDetails() {
  if (!showDetails.value) {
    getCaptcha();
  }

  showDetails.value = !showDetails.value;
}

async function getCaptcha() {
  captchaData.value = null;
  const result = await executeGetCaptcha();
  if (result) {
    captchaData.value = result;
  }
}

function validate(): boolean {
  return !!(
    controls.text?.trim() &&
    controls.areaId &&
    controls.speakerId &&
    captcha.value?.trim()
  );
}

function resetForm() {
  controls.text = null;
  controls.author = null;
  controls.speakerId = null;
  controls.areaId = undefined;
  captcha.value = null;
  showDetails.value = false;
}

async function submitForm() {
  if (!showDetails.value) {
    toggleDetails();
    return;
  }

  if (!validate()) return;

  await executeSubmit(captcha.value!, {
    text: controls.text!,
    author: controls.author!,
    areaId: controls.areaId ?? null,
    speakerId: controls.speakerId ?? null,
  });
}
</script>

<style lang="scss" scoped>
.question-form-create {
  padding: 16px;
  border: 1px solid variables.$border-light;
  border-radius: 8px;
  background: variables.$surface-card;
}

.question-form-create__textarea::-webkit-scrollbar {
  width: 5px;
}

.question-form-create__textarea::-webkit-scrollbar-track {
  background: transparent;
}

.question-form-create__textarea::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background-color: variables.$scrollbar-color;
}

.question-form-create__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
}

.question-form-create__details-link {
  color: variables.$text-muted;
  cursor: pointer;
  font-size: 13px;
}

.question-form-create__details {
  display: flex;
  flex-direction: column;
  margin-top: 12px;
  gap: 8px;
}

.question-form-create__captcha-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.question-form-create__captcha {
  width: 100%;
  max-width: 160px;
  height: 48px;
}

.question-form-create__spinner {
  animation: pi-spin 1s linear infinite;
  font-size: 24px;
}

@keyframes pi-spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.expand-enter-active,
.expand-leave-active {
  overflow: hidden;
  max-height: 500px;
  opacity: 1;
  transition:
    max-height 0.3s ease,
    opacity 0.3s ease;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
