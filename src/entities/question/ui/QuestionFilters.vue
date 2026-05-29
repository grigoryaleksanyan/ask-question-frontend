<template>
  <v-container>
    <v-row class="justify-space-between">
      <v-col cols="6">
        <v-btn-toggle
          v-model="sortOrder"
          density="compact"
          @update:model-value="onFilterChange">
          <v-btn
            size="small"
            title="Сначала новые"
            value="desc">
            <v-icon
              size="20"
              color="#717171">
              mdi-arrow-up-thin
            </v-icon>
          </v-btn>

          <v-btn
            size="small"
            title="Сначала старые"
            value="asc">
            <v-icon
              size="20"
              color="#717171">
              mdi-arrow-down-thin
            </v-icon>
          </v-btn>
        </v-btn-toggle>
      </v-col>
      <v-col
        cols="6"
        class="d-flex justify-end">
        <v-btn
          elevation="0"
          size="small"
          title="Показать/скрыть блок фильтров"
          @click="toggleFilters">
          <span class="mr-1"> Фильтры</span>
          <v-icon
            v-if="!showFilters"
            size="20"
            color="#717171">
            mdi-filter-outline
          </v-icon>
          <v-icon
            v-else
            size="20"
            color="#717171">
            mdi-filter-remove-outline
          </v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <v-expand-transition>
      <v-row
        v-show="showFilters"
        class="mt-6 justify-center">
        <v-col
          cols="12"
          class="col-sm-6">
          <v-select
            v-model="selectedSpeaker"
            :items="speakerItems"
            item-title="fullName"
            item-value="fullName"
            label="Спикер"
            variant="outlined"
            clearable
            hide-details
            density="compact"
            :menu-props="{ location: 'bottom' } as Record<string, unknown>"
            @update:model-value="onFilterChange" />
        </v-col>
        <v-col
          cols="12"
          class="col-sm-6">
          <v-select
            v-model="selectedArea"
            :items="areaItems"
            item-title="title"
            item-value="title"
            label="Зона ответственности"
            variant="outlined"
            clearable
            hide-details
            density="compact"
            :menu-props="{ location: 'bottom' } as Record<string, unknown>"
            @update:model-value="onFilterChange" />
        </v-col>
      </v-row>
    </v-expand-transition>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

import type { SpeakerResponse, AreaResponse } from '@/shared/types';

import { GetSpeakers } from '../api/questions-repository';
import { GetAllAreas } from '@/entities/area';

defineOptions({ name: 'QuestionFilters' });

const emit = defineEmits<{
  (
    e: 'change',
    filters: {
      speaker?: string;
      area?: string;
      sortOrder: 'asc' | 'desc';
    },
  ): void;
}>();

const showFilters = ref(false);
const sortOrder = ref<'asc' | 'desc'>('desc');
const selectedSpeaker = ref<string | null>(null);
const selectedArea = ref<string | null>(null);
const speakerItems = ref<SpeakerResponse[]>([]);
const areaItems = ref<AreaResponse[]>([]);

function toggleFilters() {
  showFilters.value = !showFilters.value;
}

function onFilterChange() {
  emit('change', {
    speaker: selectedSpeaker.value ?? undefined,
    area: selectedArea.value ?? undefined,
    sortOrder: sortOrder.value,
  });
}

onMounted(async () => {
  const [speakers, areas] = await Promise.all([GetSpeakers(), GetAllAreas()]);
  speakerItems.value = speakers;
  areaItems.value = areas;
});
</script>
