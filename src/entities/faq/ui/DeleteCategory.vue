<template>
  <CenterModalContentWrapper>
    <template #default>
      <p class="text-body-1">Вы действительно хотите удалить всю категорию?</p>
      <p class="ma-0 text-body-2 font-weight-bold">
        Так же будут удалены все записи!
      </p>
    </template>
    <template #actions>
      <v-btn
        variant="flat"
        color="primary"
        @click="confirm">
        Удалить
      </v-btn>
      <v-btn
        variant="outlined"
        color="blue-grey"
        @click="cancel">
        Отмена
      </v-btn>
    </template>
  </CenterModalContentWrapper>
</template>

<script setup>
import { ALERT_TYPES } from '@/shared/config';
import { useAlertStore } from '@/entities/alert';
import { Delete as DeleteCategoryApi } from '../api/faq-category-repository';

defineOptions({ name: 'DeleteCategory' });

const { id } = defineProps({
  id: { type: String, required: true },
});

const emit = defineEmits(['success', 'cancel']);

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
    alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: error.message });
  }
}

function cancel() {
  emit('cancel');
}
</script>
