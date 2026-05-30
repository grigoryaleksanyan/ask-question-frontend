<template>
  <div>
    <div v-if="data">
      <DashboardFilters
        v-model:period-days="periodDays"
        v-model:speaker-id="speakerId" />

      <div class="grid mt-3">
        <div class="col-12">
          <StatCardsRow
            :total-questions="data.totalQuestions"
            :answered-questions="data.answeredQuestions"
            :unanswered-questions="data.unansweredQuestions"
            :average-response-time-hours="data.averageResponseTimeHours"
            :total-feedback="data.totalFeedback"
            :total-areas="data.totalAreas"
            :questions-without-speaker="data.questionsWithoutSpeaker" />
        </div>
      </div>

      <div class="grid mt-3">
        <div class="col-12 md:col-4">
          <StatusDoughnutChart :by-status="data.byStatus" />
        </div>
        <div class="col-12 md:col-8">
          <TimelineLineChart :timeline="data.timeline" />
        </div>
      </div>

      <div class="grid mt-3">
        <div class="col-12">
          <SpeakerProductivityChart :top-speakers="data.topSpeakers" />
        </div>
      </div>

      <div class="grid mt-3">
        <div class="col-12 md:col-6">
          <SpeakerAreasChart :speaker-areas="data.speakerAreas" />
        </div>
        <div class="col-12 md:col-3">
          <AreaBarChart :by-area="data.byArea" />
        </div>
        <div class="col-12 md:col-3">
          <VotesSummary :votes="data.votes" />
        </div>
      </div>
    </div>
    <div
      v-else
      class="flex justify-content-center p-8">
      <ProgressSpinner />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

import type { DashboardSummaryResponse } from '@/shared/types';

import ProgressSpinner from 'primevue/progressspinner';

import { useApiCall } from '@/shared/lib';

import { GetDashboardSummary } from '@/entities/dashboard';

import DashboardFilters from './DashboardFilters.vue';
import StatCardsRow from './StatCardsRow.vue';
import StatusDoughnutChart from './StatusDoughnutChart.vue';
import TimelineLineChart from './TimelineLineChart.vue';
import SpeakerProductivityChart from './SpeakerProductivityChart.vue';
import SpeakerAreasChart from './SpeakerAreasChart.vue';
import AreaBarChart from './AreaBarChart.vue';
import VotesSummary from './VotesSummary.vue';

defineOptions({ name: 'DashboardWidget' });

const { execute: executeFetchDashboard } = useApiCall(GetDashboardSummary);

const data = ref<DashboardSummaryResponse | null>(null);
const periodDays = ref(30);
const speakerId = ref<string | null>(null);

async function fetchData() {
  const result = await executeFetchDashboard(periodDays.value, speakerId.value);
  if (result) {
    data.value = result;
  }
}

watch([periodDays, speakerId], () => {
  fetchData();
});

fetchData();
</script>
