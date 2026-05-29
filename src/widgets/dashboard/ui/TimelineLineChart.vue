<template>
  <v-card
    elevation="2"
    height="100%">
    <v-card-title class="d-flex justify-space-between align-center pa-3">
      <span class="text-body-large font-weight-bold">Динамика вопросов</span>
      <v-btn-toggle
        v-model="selectedPeriod"
        density="compact"
        variant="outlined"
        color="primary"
        divided>
        <v-btn
          size="x-small"
          :value="7"
          >7 дн</v-btn
        >
        <v-btn
          size="x-small"
          :value="30"
          >30 дн</v-btn
        >
        <v-btn
          size="x-small"
          :value="90"
          >90 дн</v-btn
        >
      </v-btn-toggle>
    </v-card-title>
    <v-card-text class="pt-0">
      <Line
        :data="chartData"
        :options="chartOptions"
        style="height: 200px" />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
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

const selectedPeriod = defineModel<number>({ default: 30 });

const { timeline } = defineProps<{
  timeline: TimelinePointResponse[];
}>();

const emit = defineEmits<{
  'update-period-days': [periodDays: number];
}>();

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
);

watch(selectedPeriod, (value) => {
  if (value === 7 || value === 30 || value === 90) {
    emit('update-period-days', value);
  }
});

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
