<template>
  <v-card
    elevation="2"
    height="100%">
    <v-card-title class="text-body-large font-weight-bold pb-0">
      Области спикеров
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
import type { SpeakerAreaResponse } from '@/shared/types';

defineOptions({ name: 'SpeakerAreasChart' });

const { speakerAreas } = defineProps<{
  speakerAreas: SpeakerAreaResponse[];
}>();

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const speakerNames = computed(() => [
  ...new Set(speakerAreas.map((s) => s.speakerName)),
]);

const areaTitles = computed(() => [
  ...new Set(speakerAreas.map((s) => s.areaTitle)),
]);

const AREA_COLORS = [
  '#5c6bc0',
  '#26a69a',
  '#ffb74d',
  '#ef5350',
  '#66bb6a',
  '#ab47bc',
  '#29b6f6',
  '#8d6e63',
];

const chartData = computed(() => ({
  labels: speakerNames.value,
  datasets: areaTitles.value.map((area, i) => ({
    label: area,
    data: speakerNames.value.map((speaker) => {
      const match = speakerAreas.find(
        (s) => s.speakerName === speaker && s.areaTitle === area,
      );
      return match?.questionCount ?? 0;
    }),
    backgroundColor: AREA_COLORS[i % AREA_COLORS.length],
    borderRadius: 2,
  })),
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y' as const,
  scales: {
    x: {
      stacked: true,
      beginAtZero: true,
      ticks: { stepSize: 1 },
    },
    y: { stacked: true, grid: { display: false } },
  },
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: { usePointStyle: true, pointStyleWidth: 8 },
    },
  },
};
</script>
