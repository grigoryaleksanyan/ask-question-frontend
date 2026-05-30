<template>
  <v-row density="compact">
    <v-col
      v-for="card in cards"
      :key="card.label"
      cols="6"
      sm="3"
      md="4"
      lg>
      <v-card
        elevation="2"
        class="text-center pa-4">
        <div
          class="text-body-small text-medium-emphasis text-uppercase"
          style="letter-spacing: 1px">
          {{ card.label }}
        </div>
        <div
          class="text-headline-large font-weight-bold mt-1"
          :style="{ color: card.color }">
          {{ card.value }}
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { computed } from 'vue';

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
