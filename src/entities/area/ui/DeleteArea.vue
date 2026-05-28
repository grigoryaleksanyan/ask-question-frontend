<template>
  <CenterModalContentWrapper>
    <template #default>
      <p class="text-body-large">Вы действительно хотите удалить область?</p>
    </template>
    <template #actions>
      <v-btn
        variant="flat"
        color="primary"
        @click="confirm">
        Удалить
      </v-btn>
      <v-btn
        variant="outlined"
        color="blue-grey"
        @click="cancel">
        Отмена
      </v-btn>
    </template>
  </CenterModalContentWrapper>
</template>

<script setup lang="ts">
import { ALERT_TYPES } from '@/shared/config';
import { useAlertStore } from '@/entities/alert';
import { Delete } from '../api/areas-repository';

defineOptions({ name: 'DeleteArea' });

const { id } = defineProps<{
  id: string;
}>();

const emit = defineEmits<{
  success: [];
  cancel: [];
}>();

const alertStore = useAlertStore();

async function confirm() {
  try {
    await Delete(id);

    alertStore.addAlert({
      type: ALERT_TYPES.SUCCESS,
      text: 'Область успешно удалена',
    });

    emit('success', id);
  } catch (error) {
    const err = error as Error;
    alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: err.message });
  }
}

function cancel() {
  emit('cancel');
}
</script>
