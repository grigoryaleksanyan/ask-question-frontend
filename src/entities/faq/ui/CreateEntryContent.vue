<template>
  <Form
    ref="form"
    :resolver
    @submit="onSubmit">
    <div class="mt-2">
      <div class="col-12">
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
      </div>

      <div class="col-12">
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
    </div>
  </Form>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue';

import { Form, FormField } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { z } from 'zod';

import sanitizeHtml from '@/shared/lib/html-sanitize';

import { useApiCall } from '@/shared/lib';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import Textarea from 'primevue/textarea';

import { Create as CreateEntry } from '../api/faq-entry-repository';

defineOptions({ name: 'CreateEntryContent' });

const { modalConfirm, modalClose, categoryId, order } = defineProps<{
  modalConfirm: () => Promise<void>;
  modalClose: () => void;
  categoryId: string;
  order: number;
}>();

const { execute: executeCreateEntry } = useApiCall(CreateEntry, {
  successMessage: 'Запись успешно создана',
  onSuccess: () => {
    modalConfirm();
  },
});

const formRef = useTemplateRef('form');

const schema = z.object({
  question: z.string().min(1, 'Обязательное поле'),
  answer: z.string().min(1, 'Обязательное поле'),
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

  await executeCreateEntry({
    faqCategoryId: categoryId,
    question: values.question as string,
    answer: sanitizeHtml(values.answer as string),
    order,
  });
}

function submitForm() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (formRef.value as any)?.submit();
}

function cancel() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (formRef.value as any)?.reset();
  modalClose();
}

defineExpose({
  submitForm,
  cancel,
});
</script>
