<template>
  <div>
    <div v-if="data">
      <DashboardFilters
        v-model:period-days="periodDays"
        v-model:speaker-id="speakerId" />

      <v-row
        density="compact"
        class="mt-3">
        <v-col cols="12">
          <StatCardsRow
            :total-questions="data.totalQuestions"
            :answered-questions="data.answeredQuestions"
            :unanswered-questions="data.unansweredQuestions"
            :average-response-time-hours="data.averageResponseTimeHours"
            :total-feedback="data.totalFeedback"
            :total-areas="data.totalAreas"
            :questions-without-speaker="data.questionsWithoutSpeaker" />
        </v-col>
      </v-row>

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
          <TimelineLineChart :timeline="data.timeline" />
        </v-col>
      </v-row>

      <v-row
        density="compact"
        class="mt-3">
        <v-col cols="12">
          <SpeakerProductivityChart :top-speakers="data.topSpeakers" />
        </v-col>
      </v-row>

      <v-row
        density="compact"
        class="mt-3">
        <v-col
          cols="12"
          md="6">
          <SpeakerAreasChart :speaker-areas="data.speakerAreas" />
        </v-col>
        <v-col
          cols="12"
          md="3">
          <AreaBarChart :by-area="data.byArea" />
        </v-col>
        <v-col
          cols="12"
          md="3">
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
import { ref, watch } from 'vue';

import type { DashboardSummaryResponse } from '@/shared/types';

import { ALERT_TYPES } from '@/shared/config';
import { GetDashboardSummary } from '@/entities/dashboard';
import { useAlertStore } from '@/entities/alert';
import { usePreloaderStore } from '@/features/preloader';

import DashboardFilters from './DashboardFilters.vue';
import StatCardsRow from './StatCardsRow.vue';
import StatusDoughnutChart from './StatusDoughnutChart.vue';
import TimelineLineChart from './TimelineLineChart.vue';
import SpeakerProductivityChart from './SpeakerProductivityChart.vue';
import SpeakerAreasChart from './SpeakerAreasChart.vue';
import AreaBarChart from './AreaBarChart.vue';
import VotesSummary from './VotesSummary.vue';

defineOptions({ name: 'DashboardWidget' });

const alertStore = useAlertStore();
const preloaderStore = usePreloaderStore();

const data = ref<DashboardSummaryResponse | null>(null);
const periodDays = ref(30);
const speakerId = ref<string | null>(null);

async function fetchData() {
  try {
    preloaderStore.addLoader();
    data.value = await GetDashboardSummary(periodDays.value, speakerId.value);
  } catch (error) {
    const err = error as Error;
    alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: err.message });
  } finally {
    preloaderStore.removeLoader();
  }
}

watch([periodDays, speakerId], () => {
  fetchData();
});

fetchData();
</script>
