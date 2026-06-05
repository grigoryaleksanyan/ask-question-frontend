<template>
  <Form
    ref="form"
    :resolver
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

import { useApiCall, requiredString, useFormActions } from '@/shared/lib';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import Textarea from 'primevue/textarea';

import { Create as CreateEntry } from '../api/faq-entry-repository';

defineOptions({ name: 'CreateEntryContent' });

const { categoryId, order } = defineProps<{
  categoryId: string;
  order: number;
}>();

const emit = defineEmits<{
  success: [entry: FaqEntryResponse];
  cancel: [];
}>();

const { execute: executeCreateEntry } = useApiCall(CreateEntry, {
  successMessage: 'Запись успешно создана',
});

const formRef = useTemplateRef('form');
const { submitForm } = useFormActions(formRef);

const schema = z.object({
  question: requiredString(),
  answer: requiredString(),
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

  const entry = await executeCreateEntry({
    faqCategoryId: categoryId,
    question: values.question as string,
    answer: sanitizeHtml(values.answer as string),
    order,
  });

  if (entry) {
    emit('success', entry);
  }
}

function cancel() {
  emit('cancel');
}

defineExpose({
  submitForm,
  cancel,
});
</script>
