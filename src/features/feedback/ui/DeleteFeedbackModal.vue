<template>
  <p class="text-body-large">Вы действительно хотите удалить обратную связь?</p>
</template>

<script setup lang="ts">
import { useApiCall } from '@/shared/lib';
import { Delete as DeleteFeedbackApi } from '../api/feedback-repository';

defineOptions({ name: 'DeleteFeedbackModal' });

const { id } = defineProps<{
  id: string;
}>();

const emit = defineEmits<{
  success: [id: string];
  cancel: [];
}>();

const { execute: executeDelete } = useApiCall(DeleteFeedbackApi, {
  successMessage: 'Обратная связь успешно удалена',
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
