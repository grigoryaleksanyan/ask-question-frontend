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

<script setup lang="ts">
import { ref, watch, onMounted, useTemplateRef } from 'vue';

import type { AreaResponse } from '@/shared/types';

import { ALERT_TYPES } from '@/shared/config';
import { useAlertStore } from '@/entities/alert';
import { Update } from '../api/areas-repository';

defineOptions({ name: 'UpdateArea' });

const { area, isOpen } = defineProps<{
  area: AreaResponse;
  isOpen?: boolean;
}>();

const emit = defineEmits<{
  success: [area: AreaResponse];
  cancel: [];
}>();

const alertStore = useAlertStore();

const valid = ref(true);
const title = ref(null as string | null);
const updateArea = useTemplateRef('updateArea');

const rules = [
  (v: string) => !!v || 'Обязательное поле!',
  (v: string) => (v && v.trim().length > 0) || 'Поле не должно быть пустым!',
];

watch(
  () => isOpen,
  (newValue) => {
    if (!newValue) {
      updateArea.value!.reset();
    } else {
      title.value = area.title;
    }
  },
);

onMounted(() => {
  title.value = area.title;
});

async function submitForm() {
  const { valid: isValid } = await updateArea.value!.validate();

  if (isValid) {
    try {
      const updatedArea = await Update({ id: area.id, title: title.value! });

      alertStore.addAlert({
        type: ALERT_TYPES.SUCCESS,
        text: 'Категория успешно изменена',
      });

      emit('success', updatedArea);
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
