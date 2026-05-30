<template>
  <Card class="shadow-2 feedback-card">
    <template #title>
      <div class="grid grid-nogutter py-2">
        <div class="col-12 align-self-center">
          <span class="typography__body--large feedback-card__field">
            Имя: {{ feedback.username }}
          </span>
          <br />
          <span class="typography__body--large feedback-card__field">
            Почта: {{ feedback.email }}
          </span>
        </div>
      </div>
    </template>
    <template #content>
      <div class="flex">
        <div class="feedback-card__body p-3">
          <p>{{ feedback.theme }}</p>
          <p class="feedback-card__italic">
            {{ feedback.text }}
          </p>
        </div>
      </div>
    </template>
    <template #footer>
      <Divider />
      <div class="flex align-items-center py-1">
        <div>
          <span class="typography__body--small">
            Создана: {{ new Date(feedback.created).toLocaleDateString() }}
          </span>
        </div>
        <div class="flex justify-content-end align-items-center flex-1">
          <Button
            icon="pi pi-trash"
            severity="danger"
            text
            size="small"
            title="Удалить"
            @click="emit('delete')" />
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import type { FeedbackResponse } from '@/shared/types';

import Card from 'primevue/card';
import Divider from 'primevue/divider';
import Button from 'primevue/button';

defineOptions({ name: 'FeedbackCard' });

const { feedback } = defineProps<{
  feedback: FeedbackResponse;
}>();

const emit = defineEmits<{
  delete: [];
}>();
</script>

<style lang="scss" scoped>
.feedback-card {
  background-color: variables.$card-bg;
  transition: box-shadow 0.2s ease;
}

.feedback-card:hover {
  box-shadow: 0 2px 12px rgb(0 0 0 / 8%);
}

.feedback-card__field {
  overflow-wrap: break-word;
}

.feedback-card__body {
  width: 100%;
  max-height: 200px;
  background-color: variables.$card-content-bg;
  overflow-y: scroll;
}

.feedback-card__italic {
  font-style: italic;
}
</style>
