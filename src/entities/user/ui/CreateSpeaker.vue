<template>
  <Form
    ref="form"
    :resolver
    @submit="onSubmit">
    <FormField
      v-slot="$field"
      name="lastName"
      initial-value="">
      <InputText
        type="text"
        placeholder="Фамилия"
        class="w-full dark-input" />
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
      name="firstName"
      initial-value="">
      <InputText
        type="text"
        placeholder="Имя"
        class="w-full dark-input" />
      <Message
        v-if="$field?.invalid"
        severity="error"
        size="small"
        variant="simple">
        {{ $field.error?.message }}
      </Message>
    </FormField>

    <FormField
      name="patronymic"
      initial-value="">
      <InputText
        type="text"
        placeholder="Отчество"
        class="w-full dark-input" />
    </FormField>

    <FormField
      v-slot="$field"
      name="email"
      initial-value="">
      <InputText
        type="text"
        placeholder="Почта"
        class="w-full dark-input" />
      <Message
        v-if="$field?.invalid"
        severity="error"
        size="small"
        variant="simple">
        {{ $field.error?.message }}
      </Message>
    </FormField>

    <FormField
      name="position"
      initial-value="">
      <InputText
        type="text"
        placeholder="Должность"
        class="w-full dark-input" />
    </FormField>

    <div
      v-if="createdCredentials"
      class="create-speaker__credentials">
      <p class="create-speaker__credentials-title">Данные для входа:</p>
      <div class="create-speaker__credentials-row">
        <span><b>Логин:</b> {{ createdCredentials.login }}</span>
      </div>
      <div class="create-speaker__credentials-row">
        <span><b>Пароль:</b> {{ createdCredentials.generatedPassword }}</span>
      </div>
    </div>
  </Form>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';

import { Form, FormField } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { z } from 'zod';

import type { CreateSpeakerResponse } from '@/shared/types';

import InputText from 'primevue/inputtext';
import Message from 'primevue/message';

import { useApiCall } from '@/shared/lib';
import { Create } from '../api/speakers-repository';

defineOptions({ name: 'CreateSpeaker' });

const emit = defineEmits<{
  success: [speaker: CreateSpeakerResponse];
}>();

const createdCredentials = ref<{
  login: string;
  generatedPassword: string;
} | null>(null);

const formRef = useTemplateRef('form');

const { execute: executeCreate } = useApiCall(Create, {
  successMessage: 'Спикер успешно создан',
  onSuccess: (data) => {
    createdCredentials.value = {
      login: data.login,
      generatedPassword: data.generatedPassword,
    };
    emit('success', data);
  },
});

const schema = z.object({
  lastName: z.string().min(1, 'Обязательное поле'),
  firstName: z.string().min(1, 'Обязательное поле'),
  patronymic: z.string(),
  email: z
    .string()
    .min(1, 'Обязательное поле')
    .email('Введите корректный email'),
  position: z.string(),
});

const resolver = zodResolver(schema);

async function onSubmit({
  valid,
  values,
}: {
  valid: boolean;
  values: Record<string, unknown>;
}) {
  if (!valid) return;

  await executeCreate({
    firstName: values.firstName as string,
    lastName: values.lastName as string,
    patronymic: (values.patronymic as string) || null,
    position: (values.position as string) || null,
    email: values.email as string,
  });
}

function resetForm() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (formRef.value as any)?.reset();
  createdCredentials.value = null;
}

function submitForm() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (formRef.value as any)?.submit();
}

defineExpose({
  submitForm,
  resetForm,
});
</script>

<style lang="scss" scoped>
:deep(.dark-input) {
  border-color: variables.$border-dark;
  background: variables.$surface-dark-elevated;
  color: variables.$text-primary-dark;
}

.create-speaker__credentials {
  padding: 12px;
  border: 1px solid variables.$border-dark;
  border-radius: 6px;
  margin-top: 16px;
  background: variables.$surface-dark-elevated;
}

.create-speaker__credentials-title {
  margin-bottom: 8px;
  color: variables.$text-primary-dark;
  font-size: 13px;
  font-weight: 500;
}

.create-speaker__credentials-row {
  margin-top: 4px;
  color: variables.$text-secondary;
  font-size: 13px;
}
</style>
