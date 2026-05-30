<template>
  <Form
    ref="form"
    :resolver
    :initial-values
    @submit="onSubmit">
    <FormField
      v-slot="$field"
      name="name"
      initial-value="">
      <InputText
        type="text"
        placeholder="Название"
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
import { watch, useTemplateRef } from 'vue';

import { Form, FormField } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { z } from 'zod';

import type { FaqCategoryResponse } from '@/shared/types';

import InputText from 'primevue/inputtext';
import Message from 'primevue/message';

import { useApiCall } from '@/shared/lib';
import { Update as UpdateCategoryApi } from '../api/faq-category-repository';

defineOptions({ name: 'UpdateCategory' });

const { category, isOpen } = defineProps<{
  category: FaqCategoryResponse;
  isOpen?: boolean;
}>();

const emit = defineEmits<{
  success: [name: string];
  cancel: [];
}>();

const { execute: executeUpdate } = useApiCall(UpdateCategoryApi, {
  successMessage: 'Категория успешно изменена',
  showPreloader: false,
});
const formRef = useTemplateRef('form');

const schema = z.object({
  name: z.string().min(1, 'Обязательное поле'),
});

const resolver = zodResolver(schema);
const initialValues = { name: category.name };

async function onSubmit({
  valid,
  values,
}: {
  valid: boolean;
  values: Record<string, unknown>;
}) {
  if (!valid) return;

  const name = values.name as string;
  const result = await executeUpdate({ id: category.id, name });

  if (result) {
    emit('success', name);
  }
}

watch(
  () => isOpen,
  (newValue) => {
    if (!newValue) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (formRef.value as any)?.reset();
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (formRef.value as any)?.setValues({ name: category.name });
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
