<template>
  <Form
    ref="form"
    :resolver
    :initial-values
    @submit="onSubmit">
    <div class="modal-form">
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

      <FormField
        name="additionalInfo"
        initial-value="">
        <Textarea
          placeholder="Дополнительная информация"
          rows="2"
          class="w-full dark-input" />
      </FormField>
    </div>
  </Form>
</template>

<script setup lang="ts">
import { watch, useTemplateRef } from 'vue';

import { Form, FormField } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { z } from 'zod';

import type { SpeakerResponse } from '@/shared/dto';

import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import Textarea from 'primevue/textarea';

import { useApiCall } from '@/shared/lib';
import { Update } from '../api/speakers-repository';

defineOptions({ name: 'UpdateSpeaker' });

const { speaker } = defineProps<{
  speaker: SpeakerResponse;
}>();

const emit = defineEmits<{
  success: [speaker: SpeakerResponse];
}>();

const { execute: executeUpdate, error: updateError } = useApiCall(Update, {
  successMessage: 'Спикер успешно изменён',
});

const formRef = useTemplateRef('form');

const schema = z.object({
  lastName: z.string().min(1, 'Обязательное поле'),
  firstName: z.string().min(1, 'Обязательное поле'),
  patronymic: z.string(),
  email: z
    .string()
    .min(1, 'Обязательное поле')
    .email('Введите корректный email'),
  position: z.string(),
  additionalInfo: z.string(),
});

const resolver = zodResolver(schema);

const initialValues = {
  firstName: speaker.firstName,
  lastName: speaker.lastName,
  patronymic: speaker.patronymic ?? '',
  email: speaker.email,
  position: speaker.position ?? '',
  additionalInfo: speaker.additionalInfo ?? '',
};

function mapFormValues(values: Record<string, unknown>) {
  return {
    firstName: values.firstName as string,
    lastName: values.lastName as string,
    patronymic: (values.patronymic as string) || null,
    position: (values.position as string) || null,
    email: values.email as string,
    additionalInfo: (values.additionalInfo as string) || null,
  };
}

async function onSubmit({
  valid,
  values,
}: {
  valid: boolean;
  values: Record<string, unknown>;
}) {
  if (!valid) return;

  const mapped = mapFormValues(values);

  await executeUpdate({ id: speaker.id, ...mapped });

  if (!updateError.value) {
    emit('success', { ...speaker, ...mapped });
  }
}

watch(
  () => speaker,
  (newValue) => {
    if (newValue) {
      fillForm();
    }
  },
);

function fillForm() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (formRef.value as any)?.setValues({
    firstName: speaker.firstName,
    lastName: speaker.lastName,
    patronymic: speaker.patronymic ?? '',
    email: speaker.email,
    position: speaker.position ?? '',
    additionalInfo: speaker.additionalInfo ?? '',
  });
}

function submitForm() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (formRef.value as any)?.submit();
}

defineExpose({
  submitForm,
  fillForm,
});
</script>

<style lang="scss" scoped>
:deep(.dark-input) {
  border-color: variables.$border-dark;
  background: variables.$surface-dark-elevated;
  color: variables.$text-primary-dark;
}
</style>
