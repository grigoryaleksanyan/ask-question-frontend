<template>
  <v-form
    ref="updateCategory"
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
          Изменить
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
import { ref, watch, onMounted, useTemplateRef } from 'vue';

import type { FaqCategoryResponse } from '@/shared/types';

import { ALERT_TYPES } from '@/shared/config';
import { useAlertStore } from '@/entities/alert';
import { Update as UpdateCategoryApi } from '../api/faq-category-repository';

defineOptions({ name: 'UpdateCategory' });

const { category, isOpen } = defineProps<{
  category: FaqCategoryResponse;
  isOpen?: boolean;
}>();

const emit = defineEmits<{
  success: [];
  cancel: [];
}>();

const alertStore = useAlertStore();

const valid = ref(true);
const name = ref(null as string | null);
const updateCategory = useTemplateRef('updateCategory');

const rules = [
  (v: string) => !!v || 'Обязательное поле!',
  (v: string) => (v && v.trim().length > 0) || 'Поле не должно быть пустым!',
];

watch(
  () => isOpen,
  (newValue) => {
    if (!newValue) {
      updateCategory.value!.reset();
    } else {
      name.value = category.name;
    }
  },
);

onMounted(() => {
  name.value = category.name;
});

async function submitForm() {
  if (updateCategory.value!.validate()) {
    try {
      const updatedCategory = { id: category.id, name: name.value };

      await UpdateCategoryApi(updatedCategory);

      alertStore.addAlert({
        type: ALERT_TYPES.SUCCESS,
        text: 'Категория успешно изменена',
      });

      emit('success', updatedCategory.name);
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
