<template>
  <p class="text-body-large">Вы действительно хотите удалить обратную связь?</p>
</template>

<script setup lang="ts">
import { useDeleteConfirm } from '@/shared/lib';
import { Delete as DeleteFeedbackApi } from '../api/feedback-repository';

defineOptions({ name: 'DeleteFeedback' });

const { id } = defineProps<{ id: string }>();

const emit = defineEmits<{
  success: [id: string];
  cancel: [];
}>();

const { confirm: doConfirm } = useDeleteConfirm({
  apiFn: DeleteFeedbackApi,
  successMessage: 'Обратная связь успешно удалена',
  showPreloader: false,
});

async function confirm() {
  const ok = await doConfirm(id);
  if (ok) {
    emit('success', id);
  }
}

function cancel() {
  emit('cancel');
}

defineExpose({ confirm, cancel });
</script>
