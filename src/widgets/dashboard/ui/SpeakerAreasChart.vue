<template>
  <Card class="h-full">
    <template #title>
      <span
        class="typography__body--large"
        style="font-weight: bold">
        Области спикеров
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

import type { SpeakerAreaResponse } from '@/shared/types';

import Card from 'primevue/card';

import QUESTION_STATUSES from '@/entities/question/config/question-statuses';

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
  QUESTION_STATUSES.NEW.COLOR,
  QUESTION_STATUSES.IN_FOCUS.COLOR,
  QUESTION_STATUSES.WITH_COMMENT.COLOR,
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
