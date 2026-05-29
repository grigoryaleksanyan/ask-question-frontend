<template>
  <v-card
    elevation="2"
    height="100%">
    <v-card-title class="text-body-large font-weight-bold pb-0">
      Топ спикеров
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
import type { SpeakerStatsResponse } from '@/shared/types';

defineOptions({ name: 'TopSpeakersChart' });

const { topSpeakers } = defineProps<{
  topSpeakers: SpeakerStatsResponse[];
}>();

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const COLORS = ['#4ecca3', '#26a69a', '#66bb6a', '#81c784', '#a5d6a7'];

const chartData = computed(() => ({
  labels: topSpeakers.map((s) => s.speakerName),
  datasets: [
    {
      data: topSpeakers.map((s) => s.answeredCount),
      backgroundColor: topSpeakers.map((_, i) => COLORS[i % COLORS.length]),
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
