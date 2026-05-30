<template>
  <Card class="h-full">
    <template #title>
      <span
        class="typography__body--large"
        style="font-weight: bold">
        Динамика вопросов
      </span>
    </template>
    <template #content>
      <Line
        :data="chartData"
        :options="chartOptions"
        style="height: 200px" />
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from 'chart.js';

import type { TimelinePointResponse } from '@/shared/types';

import Card from 'primevue/card';

defineOptions({ name: 'TimelineLineChart' });

const { timeline } = defineProps<{
  timeline: TimelinePointResponse[];
}>();

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
);

const chartData = computed(() => ({
  labels: timeline.map((p) => {
    const parts = p.date.split('-');
    return `${parts[2]}.${parts[1]}`;
  }),
  datasets: [
    {
      label: 'Новые',
      data: timeline.map((p) => p.newCount),
      borderColor: '#5c6bc0',
      backgroundColor: 'rgba(92,107,192,0.15)',
      fill: true,
      tension: 0.3,
      pointRadius: 2,
    },
    {
      label: 'Отвеченные',
      data: timeline.map((p) => p.answeredCount),
      borderColor: '#26a69a',
      backgroundColor: 'rgba(38,166,154,0.15)',
      fill: true,
      tension: 0.3,
      pointRadius: 2,
    },
  ],
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: { grid: { display: false } },
    y: { beginAtZero: true, ticks: { stepSize: 1 } },
  },
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: { usePointStyle: true, pointStyleWidth: 8 },
    },
  },
};
</script>
