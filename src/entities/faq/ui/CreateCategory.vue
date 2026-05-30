<template>
  <Form
    ref="form"
    :resolver
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

import { ALERT_TYPES } from '@/shared/config';
import { useAlertStore } from '@/entities/alert';
import { Create as CreateCategoryApi } from '../api/faq-category-repository';

defineOptions({ name: 'CreateCategory' });

const { order, isOpen } = defineProps<{
  order: number;
  isOpen?: boolean;
}>();

const emit = defineEmits<{
  success: [category: FaqCategoryResponse];
  cancel: [];
}>();

const alertStore = useAlertStore();
const formRef = useTemplateRef('form');

const schema = z.object({
  name: z.string().min(1, 'Обязательное поле'),
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

  try {
    const createdCategory = await CreateCategoryApi({
      name: values.name as string,
      order,
    });

    alertStore.addAlert({
      type: ALERT_TYPES.SUCCESS,
      text: 'Категория успешно создана',
    });

    emit('success', createdCategory);
  } catch (error) {
    const err = error as Error;
    alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: err.message });
  }
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
