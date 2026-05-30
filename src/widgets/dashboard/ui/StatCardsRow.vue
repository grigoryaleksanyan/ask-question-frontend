<template>
  <div class="grid">
    <div
      v-for="card in cards"
      :key="card.label"
      class="col-6 sm:col-3 md:col-4 lg:col">
      <div class="stat-cards-row__card">
        <div class="stat-cards-row__label">
          {{ card.label }}
        </div>
        <div
          class="stat-cards-row__value"
          :style="{ color: card.color }">
          {{ card.value }}
        </div>
      </div>
    </div>
  </div>
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
  { label: 'Всего вопросов', value: totalQuestions, color: '#E5E7EB' },
  {
    label: 'Отвечено',
    value: answeredQuestions,
    color: '#45BF8A',
  },
  { label: 'Неотвечено', value: unansweredQuestions, color: '#E5484F' },
  {
    label: 'Ср. время ответа',
    value: formatHours(averageResponseTimeHours),
    color: '#6B7CF6',
  },
  { label: 'Обратная связь', value: totalFeedback, color: '#E5E7EB' },
  { label: 'Областей', value: totalAreas, color: '#E5E7EB' },
  {
    label: 'Без спикера',
    value: questionsWithoutSpeaker,
    color: questionsWithoutSpeaker > 0 ? '#E5A44F' : '#E5E7EB',
  },
]);
</script>

<style lang="scss" scoped>
.stat-cards-row__card {
  padding: 14px;
  border: 1px solid variables.$border-dark;
  border-radius: 8px;
  background: variables.$surface-dark-elevated;
}

.stat-cards-row__label {
  margin-bottom: 6px;
  color: variables.$text-muted;
  font-size: 11px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  white-space: nowrap;
}

.stat-cards-row__value {
  color: variables.$text-primary-dark;
  font-size: 24px;
  font-weight: 600;
}
</style>
