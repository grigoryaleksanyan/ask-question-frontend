<template>
  <CenterModalContentWrapper>
    <template #default>
      <p class="text-body-large">
        Вы действительно хотите удалить обратную связь?
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
import { Delete as DeleteFeedbackApi } from '../api/feedback-repository';

defineOptions({ name: 'DeleteFeedbackModal' });

const { id } = defineProps({
  id: { type: String, required: true },
});

const emit = defineEmits(['success', 'cancel']);

const alertStore = useAlertStore();

async function confirm() {
  try {
    await DeleteFeedbackApi(id);

    alertStore.addAlert({
      type: ALERT_TYPES.SUCCESS,
      text: 'Обратная связь успешно удалена',
    });

    emit('success', id);
  } catch (error) {
    alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: error.message });
  }
}

function cancel() {
  emit('cancel');
}
</script>
