<template>
  <div class="area-bar-chart">
    <div class="area-bar-chart__title">Вопросы по областям</div>
    <Bar
      :data="chartData"
      :options="chartOptions"
      style="height: 200px" />
  </div>
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
      backgroundColor: '#6B7CF6',
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
    x: {
      beginAtZero: true,
      ticks: { stepSize: 1, color: '#9BA1B0' },
      grid: { color: '#2A2D35' },
    },
    y: {
      grid: { display: false },
      ticks: { color: '#9BA1B0' },
    },
  },
  plugins: { legend: { display: false } },
};
</script>

<style lang="scss" scoped>
.area-bar-chart {
  height: 100%;
  padding: 14px;
  border: 1px solid variables.$border-dark;
  border-radius: 8px;
  background: variables.$surface-dark-elevated;
}

.area-bar-chart__title {
  color: variables.$text-primary-dark;
  font-size: 15px;
  font-weight: 600;
}
</style>
