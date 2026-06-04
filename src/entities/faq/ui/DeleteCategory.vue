<template>
  <div class="modal-form">
    <p class="text-body-large">
      Вы действительно хотите удалить всю категорию?
    </p>
    <p class="text-body-large delete-category__warning">
      Так же будут удалены все записи!
    </p>
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
.delete-category__warning {
  color: variables.$error-color;
  font-weight: 700;
}
</style>
