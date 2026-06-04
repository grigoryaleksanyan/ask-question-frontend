<template>
  <div class="flex align-items-center gap-3">
    <div class="dashboard-filters__period-tabs">
      <button
        v-for="option in periodOptions"
        :key="option.value"
        class="dashboard-filters__period-tab"
        :class="{
          'dashboard-filters__period-tab--active':
            selectedPeriod === option.value,
        }"
        @click="selectedPeriod = option.value">
        {{ option.label }}
      </button>
    </div>
    <Select
      v-model="selectedSpeakerId"
      :options="speakerItems"
      option-label="title"
      option-value="value"
      placeholder="Спикер"
      show-clear
      style="min-width: 200px" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

import type { SpeakerResponse } from '@/shared/dto';

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

<style lang="scss" scoped>
.dashboard-filters__period-tabs {
  display: flex;
  gap: 4px;
}

.dashboard-filters__period-tab {
  padding: 10px 16px;
  border: none;
  border-radius: 10px;
  background: variables.$surface-dark-elevated;
  color: variables.$text-secondary;
  cursor: pointer;
  font-size: 14px;
  transition:
    background 0.15s,
    color 0.15s;

  &:hover {
    color: variables.$text-primary-dark;
  }

  &--active {
    background: rgba(variables.$main-color, 0.15);
    color: variables.$main-color;
    font-weight: 500;
  }
}
</style>
