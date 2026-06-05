<template>
  <Form
    ref="form"
    :resolver
    :initial-values
    @submit="onSubmit">
    <div class="modal-form">
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
    </div>
  </Form>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue';

import { Form, FormField } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { z } from 'zod';

import type { FaqCategoryResponse } from '@/shared/dto';

import InputText from 'primevue/inputtext';
import Message from 'primevue/message';

import { useApiCall, requiredString, useFormActions } from '@/shared/lib';
import { Update as UpdateCategoryApi } from '../api/faq-category-repository';

defineOptions({ name: 'UpdateCategory' });

const { category } = defineProps<{
  category: FaqCategoryResponse;
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
const { submitForm } = useFormActions(formRef);

const schema = z.object({
  name: requiredString(),
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

function cancel() {
  emit('cancel');
}

defineExpose({
  submitForm,
  cancel,
});
</script>
