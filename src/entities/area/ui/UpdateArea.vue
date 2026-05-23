<template>
  <v-form
    ref="updateArea"
    v-model="valid"
    @submit.prevent="submitForm">
    <CenterModalContentWrapper>
      <template #default>
        <v-text-field
          v-model="title"
          :rules="rules"
          variant="outlined"
          label="Заголовок" />
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

<script setup>
import { ref, watch, onMounted, useTemplateRef } from 'vue';

import { ALERT_TYPES } from '@/shared/config';
import { useAlertStore } from '@/entities/alert';
import { Update } from '../api/areas-repository';

defineOptions({ name: 'UpdateArea' });

const { area, isOpen } = defineProps({
  area: { type: Object, required: true },
  isOpen: { type: Boolean },
});

const emit = defineEmits(['success', 'cancel']);

const alertStore = useAlertStore();

const valid = ref(true);
const title = ref(null);
const updateArea = useTemplateRef('updateArea');

const rules = [
  (v) => !!v || 'Обязательное поле!',
  (v) => (v && v.trim().length !== 0) || 'Поле не должно быть пустым!',
];

watch(
  () => isOpen,
  (newValue) => {
    if (!newValue) {
      updateArea.value.reset();
    } else {
      title.value = area.title;
    }
  },
);

onMounted(() => {
  title.value = area.title;
});

async function submitForm() {
  if (updateArea.value.validate()) {
    try {
      const updatedArea = { id: area.id, title: title.value };

      await Update(updatedArea);

      alertStore.addAlert({
        type: ALERT_TYPES.SUCCESS,
        text: 'Категория успешно изменена',
      });

      emit('success', { ...area, title: title.value });
    } catch (error) {
      alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: error.message });
    }
  }
}

function cancel() {
  emit('cancel');
}
</script>
