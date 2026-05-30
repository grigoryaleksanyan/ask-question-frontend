<template>
  <div class="grid">
    <div
      v-for="card in cards"
      :key="card.label"
      class="col-6 sm:col-3 md:col-4 lg:col">
      <Card>
        <template #content>
          <div class="text-center p-4">
            <div
              class="typography__body--small text-uppercase"
              style=" color: rgb(0 0 0 / 60%);letter-spacing: 1px">
              {{ card.label }}
            </div>
            <div
              class="typography__headline--large mt-1"
              :style="{ color: card.color, fontWeight: 'bold' }">
              {{ card.value }}
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import Card from 'primevue/card';

defineOptions({ name: 'StatCardsRow' });

const {
  totalQuestions,
  answeredQuestions,
  unansweredQuestions,
  averageResponseTimeHours,
  totalFeedback,
  totalAreas,
  questionsWithoutSpeaker,
} = defineProps<{
  totalQuestions: number;
  answeredQuestions: number;
  unansweredQuestions: number;
  averageResponseTimeHours: number;
  totalFeedback: number;
  totalAreas: number;
  questionsWithoutSpeaker: number;
}>();

function formatHours(hours: number): string {
  if (hours === 0) return '—';
  if (hours < 24) return `${Math.round(hours)}ч`;
  const days = Math.floor(hours / 24);
  const remainHours = Math.round(hours % 24);
  return remainHours > 0 ? `${days}д ${remainHours}ч` : `${days}д`;
}

const cards = computed(() => [
  { label: 'Всего вопросов', value: totalQuestions, color: 'inherit' },
  { label: 'Отвечено', value: answeredQuestions, color: '#4ecca3' },
  { label: 'Неотвечено', value: unansweredQuestions, color: '#ef5350' },
  {
    label: 'Ср. время ответа',
    value: formatHours(averageResponseTimeHours),
    color: '#5c6bc0',
  },
  { label: 'Обратная связь', value: totalFeedback, color: 'inherit' },
  { label: 'Областей', value: totalAreas, color: 'inherit' },
  {
    label: 'Без спикера',
    value: questionsWithoutSpeaker,
    color: questionsWithoutSpeaker > 0 ? '#ffb74d' : 'inherit',
  },
]);
</script>
