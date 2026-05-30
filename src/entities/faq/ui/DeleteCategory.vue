<template>
  <div class="delete-category">
    <p class="delete-category__text">
      Вы действительно хотите удалить всю категорию?
    </p>
    <p class="delete-category__warning">Так же будут удалены все записи!</p>
  </div>
</template>

<script setup lang="ts">
import { useDeleteConfirm } from '@/shared/lib';
import { Delete as DeleteCategoryApi } from '../api/faq-category-repository';

defineOptions({ name: 'DeleteCategory' });

const { id } = defineProps<{ id: string }>();

const emit = defineEmits<{
  success: [id: string];
  cancel: [];
}>();

const { confirm: doConfirm } = useDeleteConfirm({
  apiFn: DeleteCategoryApi,
  successMessage: 'Категория успешно удалена',
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
.delete-category__text {
  color: variables.$text-primary-dark;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5rem;
}

.delete-category__warning {
  margin: 0;
  color: variables.$error-color;
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.25rem;
}
</style>
