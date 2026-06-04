<template>
  <p class="text-body-large">Вы действительно хотите удалить спикера?</p>
</template>

<script setup lang="ts">
import { useDeleteConfirm } from '@/shared/lib';
import { Delete } from '../api/speakers-repository';

defineOptions({ name: 'DeleteSpeaker' });

const { id } = defineProps<{ id: string }>();

const emit = defineEmits<{
  success: [id: string];
  cancel: [];
}>();

const { confirm: doConfirm } = useDeleteConfirm({
  apiFn: Delete,
  successMessage: 'Спикер успешно удалён',
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
