<template>
  <p class="delete-speaker__text">Вы действительно хотите удалить спикера?</p>
</template>

<script setup lang="ts">
import { useApiCall } from '@/shared/lib';
import { Delete } from '../api/speakers-repository';

defineOptions({ name: 'DeleteSpeaker' });

const { id } = defineProps<{
  id: string;
}>();

const emit = defineEmits<{
  success: [id: string];
}>();

const { execute: executeDelete, error: deleteError } = useApiCall(Delete, {
  successMessage: 'Спикер успешно удалён',
});

async function confirm() {
  await executeDelete(id);

  if (!deleteError.value) {
    emit('success', id);
  }
}

defineExpose({
  confirm,
});
</script>

<style lang="scss" scoped>
.delete-speaker__text {
  color: variables.$text-primary-dark;
  font-size: 14px;
}
</style>
