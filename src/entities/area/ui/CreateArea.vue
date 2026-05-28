<template>
  <v-form
    ref="createArea"
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

import type { AreaResponse } from '@/shared/types';

import { ALERT_TYPES } from '@/shared/config';
import { useAlertStore } from '@/entities/alert';
import { Create } from '../api/areas-repository';

defineOptions({ name: 'CreateArea' });

const { order, isOpen } = defineProps<{
  order: number;
  isOpen?: boolean;
}>();

const emit = defineEmits<{
  success: [area: AreaResponse];
  cancel: [];
}>();

const alertStore = useAlertStore();

const valid = ref(true);
const title = ref(null as string | null);
const createArea = useTemplateRef('createArea');

const rules = [
  (v: string) => !!v || 'Обязательное поле!',
  (v: string) => (v && v.trim().length > 0) || 'Поле не должно быть пустым!',
];

watch(
  () => isOpen,
  (newValue) => {
    if (!newValue) {
      createArea.value!.reset();
    }
  },
);

async function submitForm() {
  const { valid: isValid } = await createArea.value!.validate();

  if (isValid) {
    try {
      const createdArea = await Create({ title: title.value!, order });

      alertStore.addAlert({
        type: ALERT_TYPES.SUCCESS,
        text: 'Область успешно создана',
      });

      emit('success', createdArea);
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
