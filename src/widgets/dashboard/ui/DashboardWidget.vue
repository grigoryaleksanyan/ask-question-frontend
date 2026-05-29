<template>
  <div>
    <div v-if="data">
      <StatCardsRow
        :total-questions="data.totalQuestions"
        :answered-questions="data.answeredQuestions"
        :total-feedback="data.totalFeedback"
        :total-areas="data.totalAreas" />

      <v-row
        density="compact"
        class="mt-3">
        <v-col
          cols="12"
          md="4">
          <StatusDoughnutChart :by-status="data.byStatus" />
        </v-col>
        <v-col
          cols="12"
          md="8">
          <TimelineLineChart
            v-model="periodDays"
            :timeline="data.timeline"
            @update-period-days="fetchData" />
        </v-col>
      </v-row>

      <v-row
        density="compact"
        class="mt-3">
        <v-col
          cols="12"
          md="4">
          <AreaBarChart :by-area="data.byArea" />
        </v-col>
        <v-col
          cols="12"
          md="4">
          <TopSpeakersChart :top-speakers="data.topSpeakers" />
        </v-col>
        <v-col
          cols="12"
          md="4">
          <VotesSummary :votes="data.votes" />
        </v-col>
      </v-row>
    </div>
    <div
      v-else
      class="d-flex justify-center pa-8">
      <v-progress-circular
        indeterminate
        color="primary" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import type { DashboardSummaryResponse } from '@/shared/types';

import { ALERT_TYPES } from '@/shared/config';
import { GetDashboardSummary } from '@/entities/dashboard';
import { useAlertStore } from '@/entities/alert';
import { usePreloaderStore } from '@/features/preloader';

import StatCardsRow from './StatCardsRow.vue';
import StatusDoughnutChart from './StatusDoughnutChart.vue';
import TimelineLineChart from './TimelineLineChart.vue';
import AreaBarChart from './AreaBarChart.vue';
import TopSpeakersChart from './TopSpeakersChart.vue';
import VotesSummary from './VotesSummary.vue';

defineOptions({ name: 'DashboardWidget' });

const alertStore = useAlertStore();
const preloaderStore = usePreloaderStore();

const data = ref<DashboardSummaryResponse | null>(null);
const periodDays = ref(30);

async function fetchData() {
  try {
    preloaderStore.addLoader();
    data.value = await GetDashboardSummary(periodDays.value);
  } catch (error) {
    const err = error as Error;
    alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: err.message });
  } finally {
    preloaderStore.removeLoader();
  }
}

fetchData();
</script>
