<template>
  <Form
    ref="form"
    :resolver
    :initial-values
    @submit="onSubmit">
    <div class="modal-form">
      <FormField
        v-slot="$field"
        name="question"
        initial-value="">
        <InputText
          type="text"
          placeholder="Вопрос"
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
        name="answer"
        initial-value="">
        <Textarea
          placeholder="Ответ"
          rows="5"
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

import sanitizeHtml from '@/shared/lib/html-sanitize';

import type { FaqEntryResponse } from '@/shared/dto';

import { useApiCall } from '@/shared/lib';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import Textarea from 'primevue/textarea';

import { Update as UpdateEntry } from '../api/faq-entry-repository';

defineOptions({ name: 'UpdateEntryContent' });

const { entry } = defineProps<{
  entry: FaqEntryResponse;
}>();

const emit = defineEmits<{
  success: [entry: FaqEntryResponse];
  cancel: [];
}>();

const { execute: executeUpdateEntry } = useApiCall(UpdateEntry, {
  successMessage: 'Запись успешно изменена',
});

const formRef = useTemplateRef('form');

const schema = z.object({
  question: z.string().min(1, 'Обязательное поле'),
  answer: z.string().min(1, 'Обязательное поле'),
});

const resolver = zodResolver(schema);
const initialValues = { question: entry.question, answer: entry.answer };

async function onSubmit({
  valid,
  values,
}: {
  valid: boolean;
  values: Record<string, unknown>;
}) {
  if (!valid) return;

  const updatedEntry = await executeUpdateEntry({
    id: entry.id,
    question: values.question as string,
    answer: sanitizeHtml(values.answer as string),
  });

  if (updatedEntry) {
    emit('success', updatedEntry);
  }
}

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
