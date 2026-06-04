<template>
  <div class="question-filters">
    <div class="question-filters__row">
      <button
        class="question-filters__chip"
        :class="{
          'question-filters__chip--active': sortOrder === 'desc',
        }"
        @click="setSortOrder('desc')">
        Сначала новые
      </button>
      <button
        class="question-filters__chip"
        :class="{
          'question-filters__chip--active': sortOrder === 'asc',
        }"
        @click="setSortOrder('asc')">
        Сначала старые
      </button>

      <div class="question-filters__select-wrap">
        <Select
          v-model="selectedSpeaker"
          :options="speakers"
          :option-label="
            (speaker: SpeakerPublicResponse) =>
              `${speaker.lastName} ${speaker.firstName}`
          "
          option-value="id"
          placeholder="Спикер"
          show-clear
          class="question-filters__select"
          @update:model-value="onFilterChange" />
      </div>

      <div class="question-filters__select-wrap">
        <Select
          v-model="selectedAreaId"
          :options="areas"
          option-label="title"
          option-value="id"
          placeholder="Зона"
          show-clear
          class="question-filters__select"
          @update:model-value="onFilterChange" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import type { SpeakerPublicResponse, AreaResponse } from '@/shared/dto';

import Select from 'primevue/select';

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

const sortOrder = ref<'asc' | 'desc'>('desc');
const selectedSpeaker = ref<string | null>(null);
const selectedAreaId = ref<string | null>(null);

function setSortOrder(order: 'asc' | 'desc') {
  sortOrder.value = order;
  onFilterChange();
}

function onFilterChange() {
  emit('change', {
    speakerId: selectedSpeaker.value ?? undefined,
    areaId: selectedAreaId.value ?? undefined,
    sortOrder: sortOrder.value,
  });
}
</script>

<style lang="scss" scoped>
.question-filters__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 16px;
  gap: 8px;
}

.question-filters__chip {
  padding: 5px 12px;
  border: 1px solid variables.$border-light;
  border-radius: 6px;
  background: variables.$surface-card;
  color: variables.$text-secondary;
  cursor: pointer;
  font-size: 13px;
  transition:
    border-color 0.15s,
    background 0.15s;

  &--active {
    border-color: variables.$main-color;
    background: rgb(79 106 246 / 6%);
    color: variables.$main-color;
  }
}

.question-filters__select-wrap {
  min-width: 120px;
}

.question-filters__select {
  font-size: 13px;
}
</style>
