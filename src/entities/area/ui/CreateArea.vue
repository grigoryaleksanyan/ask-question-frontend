<template>
  <Form
    ref="form"
    :resolver
    @submit="onSubmit">
    <div class="create-area">
      <div class="create-area__field">
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
      </div>

      <div class="create-area__field">
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
    </div>
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
import { Create } from '../api/areas-repository';

defineOptions({ name: 'CreateArea' });

const { modalConfirm, modalClose, order } = defineProps<{
  modalConfirm: () => Promise<void>;
  modalClose: () => void;
  order: number;
}>();

const emit = defineEmits<{
  success: [area: AreaResponse];
}>();

const { execute: executeCreate } = useApiCall(Create, {
  successMessage: 'Область успешно создана',
  onSuccess: (data) => {
    emit('success', data);
    modalConfirm();
  },
});

const formRef = useTemplateRef('form');

const schema = z.object({
  title: z.string().min(1, 'Обязательное поле'),
  order: z.coerce.number().int().min(0, 'Минимум 0'),
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

<style lang="scss" scoped>
.create-area {
  display: flex;
  flex-direction: column;
  margin-top: 8px;
  gap: 16px;
}

.create-area__field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.create-area__input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid variables.$border-dark;
  border-radius: 6px;
  background: variables.$surface-dark;
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
