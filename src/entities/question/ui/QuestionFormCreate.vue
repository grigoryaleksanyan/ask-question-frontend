<template>
  <div class="question-form-create">
    <Form
      ref="form"
      :resolver
      @submit="onFormSubmit">
      <FormField
        v-slot="$field"
        name="text"
        initial-value="">
        <Textarea
          auto-resize
          rows="2"
          placeholder="Расскажите подробнее о..."
          class="question-form-create__textarea w-full" />
        <Message
          v-if="$field?.invalid"
          severity="error"
          size="small"
          variant="simple">
          {{ $field.error?.message }}
        </Message>
      </FormField>

      <div class="question-form-create__actions">
        <Button
          :type="showDetails ? 'submit' : 'button'"
          severity="primary"
          label="Отправить"
          @click="onButtonClick" />

        <span
          class="question-form-create__details-link"
          @click="toggleDetails">
          + Детали
        </span>
      </div>

      <Transition name="expand">
        <div v-show="showDetails">
          <div class="question-form-create__details">
            <FormField
              name="author"
              initial-value="">
              <InputText
                placeholder="Имя"
                class="w-full" />
            </FormField>

            <FormField
              v-slot="$field"
              name="areaId"
              initial-value="">
              <Select
                :options="areas"
                option-label="title"
                option-value="id"
                placeholder="Область*"
                class="w-full" />
              <Message
                v-if="$field?.invalid"
                severity="error"
                size="small"
                variant="simple">
                {{ $field.error?.message }}
              </Message>
            </FormField>

            <FormField
              v-slot="$field"
              name="speakerId"
              initial-value="">
              <Select
                :options="speakers"
                option-label="lastName"
                option-value="id"
                placeholder="Спикер*"
                class="w-full" />
              <Message
                v-if="$field?.invalid"
                severity="error"
                size="small"
                variant="simple">
                {{ $field.error?.message }}
              </Message>
            </FormField>

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
    </Form>
  </div>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';

import { Form, FormField } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { z } from 'zod';

import type { AreaResponse, SpeakerPublicResponse } from '@/shared/dto';

import { requiredString } from '@/shared/lib/zod-schemas';
import { useFormActions } from '@/shared/lib/use-form-actions';
import { useApiCall } from '@/shared/lib';

import { GetCaptcha, Create } from '../api/questions-repository';

import Textarea from 'primevue/textarea';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import Button from 'primevue/button';
import Message from 'primevue/message';

defineOptions({ name: 'QuestionFormCreate' });

const { areas, speakers } = defineProps<{
  areas: AreaResponse[];
  speakers: SpeakerPublicResponse[];
}>();

const showDetails = ref(false);
const captchaData = ref<string | null>(null);
const captcha = ref(null as string | null);

const schema = z.object({
  text: requiredString(),
  author: z.string(),
  areaId: requiredString(),
  speakerId: requiredString(),
});

const resolver = zodResolver(schema);

const formRef = useTemplateRef('form');
const { resetForm: resetFormAction } = useFormActions(formRef);

const { execute: executeGetCaptcha } = useApiCall(GetCaptcha, {
  showPreloader: false,
});
const { execute: executeSubmit } = useApiCall(Create, {
  successMessage: 'Ваш вопрос успешно добавлен',
  showPreloader: false,
  onSuccess() {
    resetFormAction();
    captcha.value = null;
    showDetails.value = false;
  },
  onError() {
    executeGetCaptcha();
  },
});

function toggleDetails() {
  if (!showDetails.value) {
    getCaptcha();
  }

  showDetails.value = !showDetails.value;
}

function onButtonClick() {
  if (!showDetails.value) {
    toggleDetails();
  }
}

async function getCaptcha() {
  captchaData.value = null;
  const result = await executeGetCaptcha();
  if (result) {
    captchaData.value = result;
  }
}

async function onFormSubmit({
  valid,
  values,
}: {
  valid: boolean;
  values: Record<string, unknown>;
}) {
  if (!valid) return;

  if (!captcha.value?.trim()) return;

  await executeSubmit(captcha.value!, {
    text: values.text as string,
    author: (values.author as string) || null,
    areaId: values.areaId as string,
    speakerId: values.speakerId as string,
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
