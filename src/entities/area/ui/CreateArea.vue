<template>
  <Form
    ref="form"
    :resolver
    @submit="onSubmit">
    <div class="modal-form">
      <FormField
        v-slot="$field"
        name="title"
        initial-value="">
        <InputText
          type="text"
          placeholder="Заголовок"
          class="create-area__input" />
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
        name="order"
        :initial-value="String(order)">
        <InputText
          type="text"
          placeholder="Порядок"
          class="create-area__input" />
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

import type { AreaResponse } from '@/shared/dto';

import InputText from 'primevue/inputtext';
import Message from 'primevue/message';

import { useApiCall } from '@/shared/lib';
import { nonNegativeInt, requiredString } from '@/shared/lib/zod-schemas';
import { useFormActions } from '@/shared/lib/use-form-actions';
import { Create } from '../api/areas-repository';

defineOptions({ name: 'CreateArea' });

const { order } = defineProps<{
  order: number;
}>();

const emit = defineEmits<{
  success: [area: AreaResponse];
}>();

const { execute: executeCreate } = useApiCall(Create, {
  successMessage: 'Область успешно создана',
  onSuccess: (data) => {
    emit('success', data);
  },
});

const formRef = useTemplateRef('form');
const { submitForm, resetForm } = useFormActions(formRef);

const schema = z.object({
  title: requiredString(),
  order: nonNegativeInt(),
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

  await executeCreate({
    title: values.title as string,
    order: values.order as number,
  });
}

function cancel() {
  resetForm();
}

defineExpose({
  submitForm,
  cancel,
});
</script>

<style lang="scss" scoped>
.create-area__input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid variables.$border-dark;
  border-radius: 10px;
  background: variables.$surface-dark-elevated;
  color: variables.$text-primary-dark;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: variables.$main-color;
  }

  &::placeholder {
    color: variables.$text-muted;
  }
}
</style>
