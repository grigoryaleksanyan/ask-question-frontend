<template>
  <p class="delete-entry__text">Вы действительно хотите удалить запись?</p>
</template>

<script setup lang="ts">
import { useDeleteConfirm } from '@/shared/lib';
import { Delete as DeleteEntry } from '../api/faq-entry-repository';

defineOptions({ name: 'DeleteEntry' });

const { id } = defineProps<{ id: string }>();

const emit = defineEmits<{
  success: [id: string];
  cancel: [];
}>();

const { confirm: doConfirm } = useDeleteConfirm({
  apiFn: DeleteEntry,
  successMessage: 'Запись успешно удалена',
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

<style lang="scss" scoped>
.delete-entry__text {
  color: variables.$text-primary-dark;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5rem;
}
</style>
