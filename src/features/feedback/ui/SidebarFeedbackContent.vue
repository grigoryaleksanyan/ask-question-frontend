<template>
  <Form
    ref="form"
    :resolver
    @submit="onFormSubmit">
    <div class="modal-form">
      <FormField
        v-slot="$field"
        name="username"
        initial-value="">
        <InputText
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
        v-slot="$field"
        name="email"
        initial-value="">
        <InputText
          placeholder="Email"
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
        name="theme"
        initial-value="">
        <Select
          :options="themes"
          placeholder="Тема обращения"
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
        name="text"
        initial-value="">
        <Textarea
          placeholder="Текст обращения"
          auto-resize
          class="w-full" />
        <Message
          v-if="$field?.invalid"
          severity="error"
          size="small"
          variant="simple">
          {{ $field.error?.message }}
        </Message>
      </FormField>
    </div>
  </Form>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue';

import { Form, FormField } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { z } from 'zod';

import { requiredString, emailString } from '@/shared/lib/zod-schemas';
import { useFormActions } from '@/shared/lib/use-form-actions';
import { useApiCall } from '@/shared/lib';

import { Create } from '../api/feedback-repository';

import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Select from 'primevue/select';
import Message from 'primevue/message';

defineOptions({ name: 'SidebarFeedbackContent' });

const emit = defineEmits<{
  success: [];
}>();

const { execute: executeCreate } = useApiCall(Create, {
  successMessage: 'Обратная связь отправлена',
  onSuccess: () => {
    emit('success');
  },
});

const themes = [
  'Технические проблемы в работе сайта',
  'Предложения, пожелания по работе или содержанию сайта',
];

const schema = z.object({
  username: requiredString(),
  email: emailString(),
  theme: requiredString(),
  text: requiredString(),
});

const resolver = zodResolver(schema);

const formRef = useTemplateRef('form');
const { submitForm } = useFormActions(formRef);

async function onFormSubmit({
  valid,
  values,
}: {
  valid: boolean;
  values: Record<string, unknown>;
}) {
  if (!valid) return;

  await executeCreate({
    username: values.username as string,
    email: values.email as string,
    theme: values.theme as string,
    text: values.text as string,
  });
}

defineExpose({
  submitForm,
});
</script>
