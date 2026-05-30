<template>
  <Card class="h-full">
    <template #title>
      <span
        class="typography__body--large"
        style="font-weight: bold">
        Вопросы по областям
      </span>
    </template>
    <template #content>
      <Bar
        :data="chartData"
        :options="chartOptions"
        style="height: 200px" />
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
} from 'chart.js';

import type { AreaDistributionResponse } from '@/shared/types';

import Card from 'primevue/card';

defineOptions({ name: 'AreaBarChart' });

const { byArea } = defineProps<{
  byArea: AreaDistributionResponse[];
}>();

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const chartData = computed(() => ({
  labels: byArea.map((a) => a.areaTitle),
  datasets: [
    {
      data: byArea.map((a) => a.count),
      backgroundColor: '#5c6bc0',
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
  plugins: { legend: { display: false } },
};
</script>
