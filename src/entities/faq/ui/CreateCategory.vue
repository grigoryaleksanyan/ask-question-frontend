<template>
  <Form
    ref="form"
    :resolver
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
import { Create as CreateCategoryApi } from '../api/faq-category-repository';

defineOptions({ name: 'CreateCategory' });

const { order } = defineProps<{
  order: number;
}>();

const emit = defineEmits<{
  success: [category: FaqCategoryResponse];
  cancel: [];
}>();

const { execute: executeCreate } = useApiCall(CreateCategoryApi, {
  successMessage: 'Категория успешно создана',
  showPreloader: false,
});
const formRef = useTemplateRef('form');
const { submitForm } = useFormActions(formRef);

const schema = z.object({
  name: requiredString(),
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

  const createdCategory = await executeCreate({
    name: values.name as string,
    order,
  });

  if (createdCategory) {
    emit('success', createdCategory);
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
