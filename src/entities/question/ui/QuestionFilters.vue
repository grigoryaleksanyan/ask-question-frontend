<template>
  <div class="question-filters">
    <div class="question-filters__row">
      <div class="question-filters__filters">
        <Select
          :model-value="speakerId"
          :options="speakers"
          :option-label="
            (speaker: SpeakerPublicResponse) =>
              `${speaker.lastName} ${speaker.firstName}`
          "
          option-value="id"
          placeholder="Спикер"
          size="small"
          show-clear
          class="question-filters__select"
          @update:model-value="onSpeakerChange" />

        <Select
          :model-value="areaId"
          :options="areas"
          option-label="title"
          option-value="id"
          placeholder="Область"
          size="small"
          show-clear
          class="question-filters__select"
          @update:model-value="onAreaChange" />
      </div>

      <SelectButton
        :model-value="sortOrder"
        :options="sortOptions"
        option-label="label"
        option-value="value"
        aria-label="Сортировка"
        :allow-empty="false"
        class="question-filters__sort"
        :pt="sortSelectButtonPt"
        @update:model-value="onSortChange">
        <template #option="{ option }">
          <i :class="option.icon" />
        </template>
      </SelectButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SpeakerPublicResponse, AreaResponse } from '@/shared/dto';

import Select from 'primevue/select';
import SelectButton from 'primevue/selectbutton';

defineOptions({ name: 'QuestionFilters' });

const { areas, speakers, speakerId, areaId, sortOrder } = defineProps<{
  areas: AreaResponse[];
  speakers: SpeakerPublicResponse[];
  speakerId: string | null;
  areaId: string | null;
  sortOrder: 'asc' | 'desc';
}>();

const emit = defineEmits<{
  (e: 'update:speakerId', value: string | null): void;
  (e: 'update:areaId', value: string | null): void;
  (e: 'update:sortOrder', value: 'asc' | 'desc'): void;
}>();

const sortOptions = [
  { label: 'Сначала новые', icon: 'pi pi-sort-amount-down', value: 'desc' },
  { label: 'Сначала старые', icon: 'pi pi-sort-amount-up', value: 'asc' },
];

const sortSelectButtonPt = {
  pcToggleButton: {
    content: {
      style: {
        padding: '6px 10px',
      },
    },
    icon: {
      style: {
        fontSize: '14px',
      },
    },
  },
};

function onSpeakerChange(value: string | null) {
  emit('update:speakerId', value);
}

function onAreaChange(value: string | null) {
  emit('update:areaId', value);
}

function onSortChange(value: 'asc' | 'desc') {
  emit('update:sortOrder', value);
}
</script>

<style lang="scss" scoped>
.question-filters__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  gap: 6px;
}

.question-filters__filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}

.question-filters__select {
  font-size: 13px;
}
</style>
