<template>
  <v-card
    elevation="2"
    height="100%">
    <v-card-title class="text-body-large font-weight-bold pb-0">
      Вопросы по областям
    </v-card-title>
    <v-card-text class="pt-2">
      <Bar
        :data="chartData"
        :options="chartOptions"
        style="height: 200px" />
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
