<template>
  <div class="question-filters">
    <div class="question-filters__row">
      <div class="question-filters__filters">
        <Select
          v-model="selectedSpeaker"
          :options="speakers"
          :option-label="
            (speaker: SpeakerPublicResponse) =>
              `${speaker.lastName} ${speaker.firstName}`
          "
          option-value="id"
          placeholder="Спикер"
          size="small"
          show-clear
          class="question-filters__select" />

        <Select
          v-model="selectedAreaId"
          :options="areas"
          option-label="title"
          option-value="id"
          placeholder="Область"
          size="small"
          show-clear
          class="question-filters__select" />
      </div>

      <SelectButton
        v-model="sortOrder"
        :options="sortOptions"
        option-label="label"
        option-value="value"
        aria-label="Сортировка"
        class="question-filters__sort">
        <template #option="{ option }">
          <i :class="option.icon" />
        </template>
      </SelectButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

import type { SpeakerPublicResponse, AreaResponse } from '@/shared/dto';

import Select from 'primevue/select';
import SelectButton from 'primevue/selectbutton';

defineOptions({ name: 'QuestionFilters' });

const { areas, speakers } = defineProps<{
  areas: AreaResponse[];
  speakers: SpeakerPublicResponse[];
}>();

const emit = defineEmits<{
  (
    e: 'change',
    filters: {
      speakerId?: string;
      areaId?: string;
      sortOrder: 'asc' | 'desc';
    },
  ): void;
}>();

const sortOptions = [
  { label: 'Сначала новые', icon: 'pi pi-sort-amount-down', value: 'desc' },
  { label: 'Сначала старые', icon: 'pi pi-sort-amount-up', value: 'asc' },
];

const sortOrder = ref<string>('desc');
const selectedSpeaker = ref<string | null>(null);
const selectedAreaId = ref<string | null>(null);

watch([sortOrder, selectedSpeaker, selectedAreaId], () => {
  emit('change', {
    speakerId: selectedSpeaker.value ?? undefined,
    areaId: selectedAreaId.value ?? undefined,
    sortOrder: sortOrder.value as 'asc' | 'desc',
  });
});
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

.question-filters__sort {
  :deep(.p-selectbutton-option) {
    padding: 6px 10px;
  }

  :deep(.p-selectbutton-option-icon) {
    font-size: 14px;
  }
}
</style>
