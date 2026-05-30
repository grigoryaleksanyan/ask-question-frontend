<template>
  <div class="timeline-line-chart">
    <div class="timeline-line-chart__title">Динамика вопросов</div>
    <div class="timeline-line-chart__body">
      <Line
        :data="chartData"
        :options="chartOptions" />
    </div>
  </div>
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

const newColor = '#6B7CF6';
const answeredColor = '#45BF8A';

const chartData = computed(() => ({
  labels: timeline.map((p) => {
    const parts = p.date.split('-');
    return `${parts[2]}.${parts[1]}`;
  }),
  datasets: [
    {
      label: 'Новые',
      data: timeline.map((p) => p.newCount),
      borderColor: newColor,
      backgroundColor: `${newColor}26`,
      fill: true,
      tension: 0.3,
      pointRadius: 2,
    },
    {
      label: 'Отвеченные',
      data: timeline.map((p) => p.answeredCount),
      borderColor: answeredColor,
      backgroundColor: `${answeredColor}26`,
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
    x: {
      grid: { display: false },
      ticks: { color: '#9BA1B0' },
    },
    y: {
      beginAtZero: true,
      ticks: { stepSize: 1, color: '#9BA1B0' },
      grid: { color: '#2A2D35' },
    },
  },
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        usePointStyle: true,
        pointStyleWidth: 8,
        color: '#9BA1B0',
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.timeline-line-chart {
  display: flex;
  height: 100%;
  flex-direction: column;
  padding: 14px;
  border: 1px solid variables.$border-dark;
  border-radius: 8px;
  background: variables.$surface-dark-elevated;
}

.timeline-line-chart__title {
  color: variables.$text-primary-dark;
  font-size: 15px;
  font-weight: 600;
}

.timeline-line-chart__body {
  position: relative;
  min-height: 0;
  flex: 1;
}
</style>
