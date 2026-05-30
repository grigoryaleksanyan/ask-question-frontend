<template>
  <p class="text-body-large">Вы действительно хотите удалить спикера?</p>
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
  cancel: [];
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

function cancel() {
  emit('cancel');
}

defineExpose({
  confirm,
  cancel,
});
</script>
