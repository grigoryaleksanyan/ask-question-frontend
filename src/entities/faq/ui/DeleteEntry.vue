<template>
  <p class="text-body-large">Вы действительно хотите удалить запись?</p>
</template>

<script setup lang="ts">
import { ALERT_TYPES } from '@/shared/config';
import { useAlertStore } from '@/entities/alert';
import { Delete as DeleteEntry } from '../api/faq-entry-repository';

defineOptions({ name: 'DeleteEntry' });

const { id } = defineProps<{
  id: string;
}>();

const emit = defineEmits<{
  success: [id: string];
  cancel: [];
}>();

const alertStore = useAlertStore();

async function confirm() {
  try {
    await DeleteEntry(id);

    alertStore.addAlert({
      type: ALERT_TYPES.SUCCESS,
      text: 'Запись успешно удалена',
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

defineExpose({
  confirm,
  cancel,
});
</script>
