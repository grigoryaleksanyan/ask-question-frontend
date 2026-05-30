<template>
  <Form
    ref="form"
    :resolver
    :initial-values
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

import type { FaqEntryResponse } from '@/shared/types';

import { ALERT_TYPES } from '@/shared/config';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import Textarea from 'primevue/textarea';

import { useAlertStore } from '@/entities/alert';
import { usePreloaderStore } from '@/features/preloader';

import { Update as UpdateEntry } from '../api/faq-entry-repository';

defineOptions({ name: 'UpdateEntryContent' });

const { modalConfirm, modalClose, entry } = defineProps<{
  modalConfirm: () => Promise<void>;
  modalClose: () => void;
  entry: FaqEntryResponse;
}>();

const alertStore = useAlertStore();
const preloaderStore = usePreloaderStore();
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

  try {
    preloaderStore.addLoader();

    await UpdateEntry({
      id: entry.id,
      question: values.question as string,
      answer: sanitizeHtml(values.answer as string),
    });

    alertStore.addAlert({
      type: ALERT_TYPES.SUCCESS,
      text: 'Запись успешно изменена',
    });

    modalConfirm();
  } catch (error) {
    const err = error as Error;
    alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: err.message });
  } finally {
    preloaderStore.removeLoader();
  }
}

function submitForm() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (formRef.value as any)?.submit();
}

function cancel() {
  modalClose();
}

defineExpose({
  submitForm,
  cancel,
});
</script>
