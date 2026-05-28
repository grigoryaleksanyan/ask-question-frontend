<template>
  <v-form
    ref="createCategory"
    v-model="valid"
    @submit.prevent="submitForm">
    <CenterModalContentWrapper>
      <template #default>
        <v-text-field
          v-model="name"
          :rules="rules"
          variant="outlined"
          label="Название" />
      </template>
      <template #actions>
        <v-btn
          type="submit"
          variant="flat"
          color="primary">
          Создать
        </v-btn>
        <v-btn
          variant="outlined"
          color="blue-grey"
          @click="cancel">
          Отмена
        </v-btn>
      </template>
    </CenterModalContentWrapper>
  </v-form>
</template>

<script setup lang="ts">
import { ref, watch, useTemplateRef } from 'vue';

import type { FaqCategoryResponse } from '@/shared/types';

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

const valid = ref(true);
const name = ref(null as string | null);
const createCategory = useTemplateRef('createCategory');

const rules = [
  (v: string) => !!v || 'Обязательное поле!',
  (v: string) => (v && v.trim().length > 0) || 'Поле не должно быть пустым!',
];

watch(
  () => isOpen,
  (newValue) => {
    if (!newValue) {
      createCategory.value!.reset();
    }
  },
);

async function submitForm() {
  const { valid: isValid } = await createCategory.value!.validate();

  if (isValid) {
    try {
      const createdCategory = await CreateCategoryApi({
        name: name.value!,
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
}

function cancel() {
  emit('cancel');
}
</script>
