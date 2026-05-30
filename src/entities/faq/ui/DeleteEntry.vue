<template>
  <p class="delete-entry__text">Вы действительно хотите удалить запись?</p>
</template>

<script setup lang="ts">
import { useApiCall } from '@/shared/lib';
import { Delete as DeleteEntry } from '../api/faq-entry-repository';

defineOptions({ name: 'DeleteEntry' });

const { id } = defineProps<{
  id: string;
}>();

const emit = defineEmits<{
  success: [id: string];
  cancel: [];
}>();

const { execute: executeDelete } = useApiCall(DeleteEntry, {
  successMessage: 'Запись успешно удалена',
  showPreloader: false,
  onSuccess: () => {
    emit('success', id);
  },
});

async function confirm() {
  await executeDelete(id);
}

function cancel() {
  emit('cancel');
}

defineExpose({
  confirm,
  cancel,
});
</script>

<style lang="scss" scoped>
.delete-entry__text {
  color: variables.$text-primary-dark;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5rem;
}
</style>
