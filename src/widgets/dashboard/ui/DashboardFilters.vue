<template>
  <div class="flex align-items-center">
    <div class="col-auto">
      <SelectButton
        v-model="selectedPeriod"
        :options="periodOptions"
        option-label="label"
        option-value="value"
        size="small" />
    </div>
    <div class="col-auto">
      <Select
        v-model="selectedSpeakerId"
        :options="speakerItems"
        option-label="title"
        option-value="value"
        placeholder="Спикер"
        show-clear
        style="min-width: 200px" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

import type { SpeakerResponse } from '@/shared/types';

import SelectButton from 'primevue/selectbutton';
import Select from 'primevue/select';

import { GetAllSpeakers } from '@/entities/user';
import { useApiCall } from '@/shared/lib';

defineOptions({ name: 'DashboardFilters' });

const selectedPeriod = defineModel<number>('periodDays', { default: 30 });
const selectedSpeakerId = defineModel<string | null>('speakerId', {
  default: null,
});

const { execute: executeFetchSpeakers } = useApiCall(GetAllSpeakers, {
  showPreloader: false,
});

const periodOptions = [
  { label: '7 дн', value: 7 },
  { label: '30 дн', value: 30 },
  { label: '90 дн', value: 90 },
];

const speakerItems = ref<{ title: string; value: string | null }[]>([]);

onMounted(async () => {
  const speakers: SpeakerResponse[] | undefined = await executeFetchSpeakers();
  if (speakers) {
    speakerItems.value = [
      { title: 'Все спикеры', value: null },
      ...speakers.map((s) => ({
        title: `${s.lastName} ${s.firstName}`,
        value: s.id,
      })),
    ];
  }
});
</script>
