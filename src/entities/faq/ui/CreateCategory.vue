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

<script setup>
import { ref, watch, useTemplateRef } from 'vue';

import { ALERT_TYPES } from '@/shared/config';
import { useAlertStore } from '@/entities/alert';
import { Create as CreateCategoryApi } from '../api/faq-category-repository';

defineOptions({ name: 'CreateCategory' });

const { order, isOpen } = defineProps({
  order: { type: Number, required: true },
  isOpen: { type: Boolean },
});

const emit = defineEmits(['success', 'cancel']);

const alertStore = useAlertStore();

const valid = ref(true);
const name = ref(null);
const createCategory = useTemplateRef('createCategory');

const rules = [
  (v) => !!v || 'Обязательное поле!',
  (v) => (v && v.trim().length !== 0) || 'Поле не должно быть пустым!',
];

watch(
  () => isOpen,
  (newValue) => {
    if (!newValue) {
      createCategory.value.reset();
    }
  },
);

async function submitForm() {
  if (createCategory.value.validate()) {
    try {
      const category = { name: name.value, order };

      const id = await CreateCategoryApi(category);

      category.id = id;

      alertStore.addAlert({
        type: ALERT_TYPES.SUCCESS,
        text: 'Категория успешно создана',
      });

      emit('success', category);
    } catch (error) {
      alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: error.message });
    }
  }
}

function cancel() {
  emit('cancel');
}
</script>
