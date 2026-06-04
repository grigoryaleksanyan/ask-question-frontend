<template>
  <div class="status-doughnut-chart">
    <div class="status-doughnut-chart__title">Вопросы по статусам</div>
    <div class="status-doughnut-chart__body">
      <Doughnut
        :data="chartData"
        :options="chartOptions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

import type { StatusDistributionResponse } from '@/shared/dto';
import { QuestionStatusId } from '@/shared/dto';

defineOptions({ name: 'StatusDoughnutChart' });

const { byStatus } = defineProps<{
  byStatus: StatusDistributionResponse[];
}>();

ChartJS.register(ArcElement, Tooltip, Legend);

const STATUS_LABELS: Record<number, string> = {
  [QuestionStatusId.New]: 'Новые',
  [QuestionStatusId.InFocus]: 'В фокусе',
  [QuestionStatusId.Answered]: 'Отвеченные',
};

const STATUS_COLORS: Record<number, string> = {
  [QuestionStatusId.New]: '#6B7CF6',
  [QuestionStatusId.InFocus]: '#2AA89A',
  [QuestionStatusId.Answered]: '#45BF8A',
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
      labels: {
        padding: 16,
        usePointStyle: true,
        pointStyleWidth: 8,
        color: '#9BA1B0',
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.status-doughnut-chart {
  display: flex;
  height: 100%;
  flex-direction: column;
  padding: 14px;
  border: 1px solid variables.$border-dark;
  border-radius: 10px;
  background: variables.$surface-dark-elevated;
}

.status-doughnut-chart__title {
  margin-bottom: 20px;
  color: variables.$text-primary-dark;
  font-size: 15px;
  font-weight: 600;
}

.status-doughnut-chart__body {
  position: relative;
  display: flex;
  min-height: 0;
  flex: 1;
  align-items: center;
  justify-content: center;
}
</style>
