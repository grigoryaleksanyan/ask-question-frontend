<template>
  <div class="speaker-areas-chart">
    <div class="speaker-areas-chart__title">Области спикеров</div>
    <Bar
      :data="chartData"
      :options="chartOptions"
      style="height: 220px" />
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
  '#6B7CF6',
  '#2AA89A',
  '#E5A44F',
  '#E5484F',
  '#45BF8A',
  '#AB47BC',
  '#29B6F6',
  '#8D6E63',
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
      ticks: { stepSize: 1, color: '#9BA1B0' },
      grid: { color: '#2A2D35' },
    },
    y: {
      stacked: true,
      grid: { display: false },
      ticks: { color: '#9BA1B0' },
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
.speaker-areas-chart {
  height: 100%;
  padding: 14px;
  border: 1px solid variables.$border-dark;
  border-radius: 8px;
  background: variables.$surface-dark-elevated;
}

.speaker-areas-chart__title {
  color: variables.$text-primary-dark;
  font-size: 15px;
  font-weight: 600;
}
</style>
