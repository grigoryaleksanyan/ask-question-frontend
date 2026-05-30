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
import { ALERT_TYPES } from '@/shared/config';
import { useAlertStore } from '@/entities/alert';
import { Delete as DeleteCategoryApi } from '../api/faq-category-repository';

defineOptions({ name: 'DeleteCategory' });

const { id } = defineProps<{
  id: string;
}>();

const emit = defineEmits<{
  success: [];
  cancel: [];
}>();

const alertStore = useAlertStore();

async function confirm() {
  try {
    await DeleteCategoryApi(id);

    alertStore.addAlert({
      type: ALERT_TYPES.SUCCESS,
      text: 'Категория успешно удалена',
    });

    emit('success');
  } catch (error) {
    const err = error as Error;
    alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: err.message });
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
