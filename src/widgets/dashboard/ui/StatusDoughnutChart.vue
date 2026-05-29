<template>
  <v-card
    elevation="2"
    height="100%">
    <v-card-title class="text-body-large font-weight-bold pb-0">
      Вопросы по статусам
    </v-card-title>
    <v-card-text class="d-flex flex-column align-center pt-2">
      <Doughnut
        :data="chartData"
        :options="chartOptions"
        style="max-height: 220px" />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import type { StatusDistributionResponse } from '@/shared/types';
import { QuestionStatusId } from '@/shared/types';

defineOptions({ name: 'StatusDoughnutChart' });

const { byStatus } = defineProps<{
  byStatus: StatusDistributionResponse[];
}>();

ChartJS.register(ArcElement, Tooltip, Legend);

const STATUS_LABELS: Record<number, string> = {
  [QuestionStatusId.New]: 'Новые',
  [QuestionStatusId.InFocus]: 'В фокусе',
  [QuestionStatusId.WithComment]: 'С комментарием',
  [QuestionStatusId.Answered]: 'Отвеченные',
};

const STATUS_COLORS: Record<number, string> = {
  [QuestionStatusId.New]: '#5c6bc0',
  [QuestionStatusId.InFocus]: '#26a69a',
  [QuestionStatusId.WithComment]: '#ffb74d',
  [QuestionStatusId.Answered]: '#ef5350',
};

const chartData = computed(() => ({
  labels: byStatus.map((s) => STATUS_LABELS[s.status] ?? `Статус ${s.status}`),
  datasets: [
    {
      data: byStatus.map((s) => s.count),
      backgroundColor: byStatus.map((s) => STATUS_COLORS[s.status] ?? '#999'),
      borderWidth: 0,
    },
  ],
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  cutout: '65%',
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: { padding: 16, usePointStyle: true, pointStyleWidth: 8 },
    },
  },
};
</script>
