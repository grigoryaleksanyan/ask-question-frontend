<template>
  <v-row
    density="compact"
    class="align-center">
    <v-col cols="auto">
      <v-btn-toggle
        v-model="selectedPeriod"
        density="compact"
        variant="outlined"
        color="primary"
        divided>
        <v-btn
          size="small"
          :value="7">
          7 дн
        </v-btn>
        <v-btn
          size="small"
          :value="30">
          30 дн
        </v-btn>
        <v-btn
          size="small"
          :value="90">
          90 дн
        </v-btn>
      </v-btn-toggle>
    </v-col>
    <v-col cols="auto">
      <v-select
        v-model="selectedSpeakerId"
        :items="speakerItems"
        item-title="title"
        item-value="value"
        label="Спикер"
        variant="outlined"
        clearable
        hide-details
        density="compact"
        min-width="200"
        :menu-props="{ location: 'bottom' } as Record<string, unknown>" />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

import type { SpeakerResponse } from '@/shared/types';

import { GetAllSpeakers } from '@/entities/user';
import { ALERT_TYPES } from '@/shared/config';
import { useAlertStore } from '@/entities/alert';

defineOptions({ name: 'DashboardFilters' });

const selectedPeriod = defineModel<number>('periodDays', { default: 30 });
const selectedSpeakerId = defineModel<string | null>('speakerId', {
  default: null,
});

const alertStore = useAlertStore();
const speakerItems = ref<{ title: string; value: string | null }[]>([]);

onMounted(async () => {
  try {
    const speakers: SpeakerResponse[] = await GetAllSpeakers();
    speakerItems.value = [
      { title: 'Все спикеры', value: null },
      ...speakers.map((s) => ({
        title: `${s.lastName} ${s.firstName}`,
        value: s.id,
      })),
    ];
  } catch (error) {
    const err = error as Error;
    alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: err.message });
  }
});
</script>
