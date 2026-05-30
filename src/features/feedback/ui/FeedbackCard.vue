<template>
  <Card
    class="shadow-2 feedback-card"
    style="background-color: #e8eaf6">
    <template #title>
      <div class="grid grid-nogutter py-2">
        <div class="col-12 align-self-center">
          <span
            style="overflow-wrap: break-word"
            class="typography__body--large">
            Имя: {{ feedback.username }}
          </span>
          <br />
          <span
            style="overflow-wrap: break-word"
            class="typography__body--large">
            Почта: {{ feedback.email }}
          </span>
        </div>
      </div>
    </template>
    <template #content>
      <div class="flex">
        <div
          style="
            width: 100%;
            max-height: 200px;
            background-color: white;
            overflow-y: scroll;
          "
          class="p-3">
          <p>{{ feedback.theme }}</p>
          <p style="font-style: italic">
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
