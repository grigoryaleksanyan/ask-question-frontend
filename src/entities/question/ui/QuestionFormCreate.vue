<template>
  <Card class="shadow-5 question-form-create">
    <template #content>
      <form @submit.prevent="submitForm">
        <div class="p-2">
          <div class="flex align-items-center">
            <div class="col-9 question-form-create__textarea-col">
              <Textarea
                v-model="controls.text"
                auto-resize
                rows="1"
                placeholder="Задайте вопрос"
                class="question-form-create__textarea w-full"
                @change="showDetails" />
            </div>
            <div
              class="flex justify-content-end question-form-create__toggle-col">
              <Button
                title="Дополнительные сведения"
                severity="primary"
                @click="toggleForm">
                <i class="pi pi-user"></i>
              </Button>
            </div>
          </div>

          <Transition name="expand">
            <div v-show="details">
              <div class="p-0 py-2 m-0">
                <Divider />
              </div>
              <div class="p-2">
                <div class="grid grid-nogutter">
                  <div class="col-6">
                    <InputText
                      v-model="controls.author"
                      placeholder="Имя"
                      class="w-full" />
                  </div>
                  <div class="col-6">
                    <Select
                      v-model="controls.areaId"
                      :options="areas"
                      option-label="title"
                      option-value="id"
                      placeholder="Область*"
                      class="w-full" />
                  </div>
                </div>
                <div class="grid grid-nogutter">
                  <div class="col-6 pt-0">
                    <Select
                      v-model="controls.speakerId"
                      :options="speakers"
                      option-label="lastName"
                      option-value="id"
                      placeholder="Спикер*"
                      class="w-full" />
                  </div>
                  <div class="col-6 pt-0">
                    <InputText
                      v-model="captcha"
                      placeholder="Код*"
                      class="w-full" />
                  </div>
                </div>
                <div class="grid grid-nogutter mt-0">
                  <div
                    class="col-6 flex justify-content-center align-self-center">
                    <Button
                      type="submit"
                      severity="primary"
                      label="Отправить" />
                  </div>
                  <div class="col-6 flex justify-content-center">
                    <template v-if="captchaData">
                      <img
                        :src="captchaData"
                        class="question-form-create__captcha"
                        alt="captcha" />
                    </template>
                    <template v-else>
                      <i
                        class="pi pi-refresh question-form-create__spinner"
                        style="height: 48px; color: grey"></i>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </form>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

import type { AreaResponse, SpeakerResponse } from '@/shared/types';

import { GetAllAreas } from '@/entities/area';
import { GetAllSpeakers } from '@/entities/user';
import { useApiCall } from '@/shared/lib';
import { GetCaptcha, Create } from '../api/questions-repository';

import Card from 'primevue/card';
import Textarea from 'primevue/textarea';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import Button from 'primevue/button';
import Divider from 'primevue/divider';

defineOptions({ name: 'QuestionFormCreate' });

const { execute: executeGetCaptcha } = useApiCall(GetCaptcha, {
  showPreloader: false,
});
const { execute: executeFetchAreas } = useApiCall(GetAllAreas, {
  showPreloader: false,
});
const { execute: executeFetchSpeakers } = useApiCall(GetAllSpeakers, {
  showPreloader: false,
});
const { execute: executeSubmit } = useApiCall(Create, {
  successMessage: 'Ваш вопрос успешно добавлен',
  showPreloader: false,
  onSuccess() {
    toggleForm();
    resetForm();
  },
  onError() {
    executeGetCaptcha();
  },
});

const details = ref(false);
const areas = ref<AreaResponse[]>([]);
const speakers = ref<SpeakerResponse[]>([]);
const captchaData = ref<string | null>(null);
const captcha = ref(null as string | null);

const controls = reactive({
  text: null as string | null,
  author: null as string | null,
  speakerId: null as string | null,
  areaId: undefined as string | undefined,
});

function toggleForm() {
  if (!details.value) {
    getCaptcha();
  }

  details.value = !details.value;
}

function showDetails() {
  if (!details.value) {
    toggleForm();
  }
}

async function getCaptcha() {
  captchaData.value = null;
  const result = await executeGetCaptcha();
  if (result) {
    captchaData.value = result;
  }
}

async function fetchAllAreas() {
  const result = await executeFetchAreas();
  if (result) {
    areas.value = result;
  }
}

async function fetchAllSpeakers() {
  const result = await executeFetchSpeakers();
  if (result) {
    speakers.value = result;
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
}

async function submitForm() {
  if (!validate()) return;

  await executeSubmit(captcha.value!, {
    text: controls.text!,
    author: controls.author!,
    areaId: controls.areaId ?? null,
    speakerId: controls.speakerId ?? null,
  });
}

fetchAllAreas();
fetchAllSpeakers();
</script>

<style lang="scss" scoped>
.question-form-create {
  width: 600px;
  background-color: variables.$card-bg;
}

.question-form-create__textarea {
  margin: 3px;
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

.question-form-create__toggle-col {
  max-width: 85px;
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

@media (width >= 600px) {
  .question-form-create__textarea-col {
    width: 83.3333%;
  }
}
</style>
