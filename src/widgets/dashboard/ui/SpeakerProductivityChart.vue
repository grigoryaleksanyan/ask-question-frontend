<template>
  <v-card elevation="2">
    <v-card-title class="text-body-large font-weight-bold pb-0">
      Продуктивность спикеров
    </v-card-title>
    <v-card-text class="pt-2">
      <Bar
        :data="chartData"
        :options="chartOptions"
        style="height: 220px" />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import type { SpeakerProductivityResponse } from '@/shared/types';

defineOptions({ name: 'SpeakerProductivityChart' });

const { topSpeakers } = defineProps<{
  topSpeakers: SpeakerProductivityResponse[];
}>();

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const chartData = computed(() => ({
  labels: topSpeakers.map((s) => s.speakerName),
  datasets: [
    {
      label: 'Назначено',
      data: topSpeakers.map((s) => s.assignedQuestions),
      backgroundColor: '#5c6bc0',
      borderRadius: 4,
      barThickness: 18,
    },
    {
      label: 'Отвечено',
      data: topSpeakers.map((s) => s.answeredQuestions),
      backgroundColor: '#4ecca3',
      borderRadius: 4,
      barThickness: 18,
    },
  ],
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y' as const,
  scales: {
    x: { beginAtZero: true, ticks: { stepSize: 1 } },
    y: { grid: { display: false } },
  },
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: { usePointStyle: true, pointStyleWidth: 8 },
    },
    tooltip: {
      callbacks: {
        afterBody: (items: { label: string }[]) => {
          const idx = items[0]?.label;
          const speaker = topSpeakers.find((s) => s.speakerName === idx);
          if (!speaker) return '';
          return `Ответов: ${speaker.answerRate}% | Ср. время: ${speaker.averageResponseHours}ч`;
        },
      },
    },
  },
};
</script>
