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
      name="firstName"
      initial-value="">
      <InputText
        type="text"
        placeholder="Имя"
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
      name="patronymic"
      initial-value="">
      <InputText
        type="text"
        placeholder="Отчество"
        class="w-full" />
    </FormField>

    <FormField
      v-slot="$field"
      name="email"
      initial-value="">
      <InputText
        type="text"
        placeholder="Почта"
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
      name="position"
      initial-value="">
      <InputText
        type="text"
        placeholder="Должность"
        class="w-full" />
    </FormField>
  </Form>
</template>

<script setup lang="ts">
import { watch, useTemplateRef } from 'vue';

import { Form, FormField } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { z } from 'zod';

import type { CreateSpeakerResponse } from '@/shared/types';

import InputText from 'primevue/inputtext';
import Message from 'primevue/message';

import { useApiCall } from '@/shared/lib';
import { Create } from '../api/speakers-repository';

defineOptions({ name: 'CreateSpeaker' });

const { isOpen } = defineProps<{
  isOpen?: boolean;
}>();

const emit = defineEmits<{
  success: [speaker: CreateSpeakerResponse];
  cancel: [];
}>();

const { execute: executeCreate } = useApiCall(Create, {
  successMessage: 'Спикер успешно создан',
  onSuccess: (data) => {
    emit('success', data);
  },
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

watch(
  () => isOpen,
  (newValue) => {
    if (!newValue) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (formRef.value as any)?.reset();
    }
  },
);

function submitForm() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (formRef.value as any)?.submit();
}

function cancel() {
  emit('cancel');
}

defineExpose({
  submitForm,
  cancel,
});
</script>
