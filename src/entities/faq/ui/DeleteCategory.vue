<template>
  <div>
    <p class="text-body-large">
      Вы действительно хотите удалить всю категорию?
    </p>
    <p class="m-0 text-body-medium font-bold">
      Так же будут удалены все записи!
    </p>
  </div>
</template>

<script setup lang="ts">
import { useApiCall } from '@/shared/lib';
import { Delete as DeleteCategoryApi } from '../api/faq-category-repository';

defineOptions({ name: 'DeleteCategory' });

const { id } = defineProps<{
  id: string;
}>();

const emit = defineEmits<{
  success: [];
  cancel: [];
}>();

const { execute: executeDelete } = useApiCall(DeleteCategoryApi, {
  successMessage: 'Категория успешно удалена',
  showPreloader: false,
  onSuccess: () => {
    emit('success');
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
