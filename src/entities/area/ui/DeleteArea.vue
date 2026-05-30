<template>
  <p class="text-body-large">Вы действительно хотите удалить область?</p>
</template>

<script setup lang="ts">
import { useApiCall } from '@/shared/lib';
import { Delete } from '../api/areas-repository';

defineOptions({ name: 'DeleteArea' });

const { id } = defineProps<{
  id: string;
}>();

const emit = defineEmits<{
  success: [id: string];
  cancel: [];
}>();

const { execute: executeDelete } = useApiCall(Delete, {
  successMessage: 'Область успешно удалена',
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
