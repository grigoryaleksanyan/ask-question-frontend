<template>
  <v-row density="compact">
    <v-col
      v-for="card in cards"
      :key="card.label"
      cols="6"
      sm="3">
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

const { totalQuestions, answeredQuestions, totalFeedback, totalAreas } =
  defineProps<{
    totalQuestions: number;
    answeredQuestions: number;
    totalFeedback: number;
    totalAreas: number;
  }>();

const cards = computed(() => [
  { label: 'Всего вопросов', value: totalQuestions, color: 'inherit' },
  { label: 'Отвечено', value: answeredQuestions, color: '#4ecca3' },
  { label: 'Обратная связь', value: totalFeedback, color: 'inherit' },
  { label: 'Области', value: totalAreas, color: 'inherit' },
]);
</script>
