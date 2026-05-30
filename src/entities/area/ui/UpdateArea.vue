<template>
  <Form
    ref="form"
    :resolver
    :initial-values
    @submit="onSubmit">
    <FormField
      v-slot="$field"
      name="title"
      initial-value="">
      <InputText
        type="text"
        placeholder="Заголовок"
        class="w-full" />
      <Message
        v-if="$field?.invalid"
        severity="error"
        size="small"
        variant="simple">
        {{ $field.error?.message }}
      </Message>
    </FormField>
  </Form>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue';

import { Form, FormField } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { z } from 'zod';

import type { AreaResponse } from '@/shared/types';

import InputText from 'primevue/inputtext';
import Message from 'primevue/message';

import { useApiCall } from '@/shared/lib';
import { Update } from '../api/areas-repository';

defineOptions({ name: 'UpdateArea' });

const { area } = defineProps<{
  area: AreaResponse;
}>();

const emit = defineEmits<{
  success: [area: AreaResponse];
  cancel: [];
}>();

const { execute: executeUpdate } = useApiCall(Update, {
  successMessage: 'Категория успешно изменена',
  showPreloader: false,
});
const formRef = useTemplateRef('form');

const schema = z.object({
  title: z.string().min(1, 'Обязательное поле'),
});

const resolver = zodResolver(schema);
const initialValues = { title: area.title };

async function onSubmit({
  valid,
  values,
}: {
  valid: boolean;
  values: Record<string, unknown>;
}) {
  if (!valid) return;

  const updatedArea = await executeUpdate({
    id: area.id,
    title: values.title as string,
  });

  if (updatedArea) {
    emit('success', updatedArea);
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
