<template>
  <Card>
    <template #title>
      <span
        class="typography__body--large"
        style="font-weight: bold">
        Продуктивность спикеров
      </span>
    </template>
    <template #content>
      <Bar
        :data="chartData"
        :options="chartOptions"
        style="height: 220px" />
    </template>
  </Card>
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

import Card from 'primevue/card';

import QUESTION_STATUSES from '@/entities/question/config/question-statuses';

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
      backgroundColor: QUESTION_STATUSES.NEW.COLOR,
      borderRadius: 4,
      barThickness: 18,
    },
    {
      label: 'Отвечено',
      data: topSpeakers.map((s) => s.answeredQuestions),
      backgroundColor: QUESTION_STATUSES.ANSWERED.COLOR,
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
