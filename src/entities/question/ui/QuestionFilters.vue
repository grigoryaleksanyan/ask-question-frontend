<template>
  <div>
    <div class="grid grid-nogutter justify-content-between">
      <div class="col-6">
        <SelectButton
          v-model="sortOrder"
          :options="sortOptions"
          option-value="value"
          @change="onFilterChange">
          <template #option="{ option }">
            <i
              :class="option.icon"
              style=" color: #717171;font-size: 20px"></i>
          </template>
        </SelectButton>
      </div>
      <div class="col-6 flex justify-content-end">
        <Button
          size="small"
          severity="secondary"
          title="Показать/скрыть блок фильтров"
          @click="toggleFilters">
          <span class="mr-1">Фильтры</span>
          <i
            :class="showFilters ? 'pi pi-filter-slash' : 'pi pi-filter'"
            style=" color: #717171;font-size: 20px"></i>
        </Button>
      </div>
    </div>

    <Transition name="expand">
      <div
        v-show="showFilters"
        class="grid grid-nogutter mt-6 justify-content-center">
        <div class="col-12 question-filters__select-col">
          <Select
            v-model="selectedSpeaker"
            :options="speakerItems"
            option-label="displayName"
            option-value="id"
            placeholder="Спикер"
            show-clear
            size="small"
            @update:model-value="onFilterChange" />
        </div>
        <div class="col-12 question-filters__select-col">
          <Select
            v-model="selectedAreaId"
            :options="areaItems"
            option-label="title"
            option-value="id"
            placeholder="Зона ответственности"
            show-clear
            size="small"
            @update:model-value="onFilterChange" />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

import type { AreaResponse } from '@/shared/types';

import { GetAllAreas } from '@/entities/area';
import { GetAllSpeakers } from '@/entities/user';
import SelectButton from 'primevue/selectbutton';
import Button from 'primevue/button';
import Select from 'primevue/select';

defineOptions({ name: 'QuestionFilters' });

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

const showFilters = ref(false);
const sortOrder = ref<'asc' | 'desc'>('desc');
const selectedSpeaker = ref<string | null>(null);
const selectedAreaId = ref<string | null>(null);
const speakerItems = ref<{ id: string; displayName: string }[]>([]);
const areaItems = ref<AreaResponse[]>([]);

const sortOptions = [
  {
    label: 'Сначала новые',
    value: 'desc',
    icon: 'pi pi-arrow-up',
  },
  {
    label: 'Сначала старые',
    value: 'asc',
    icon: 'pi pi-arrow-down',
  },
];

function toggleFilters() {
  showFilters.value = !showFilters.value;
}

function onFilterChange() {
  emit('change', {
    speakerId: selectedSpeaker.value ?? undefined,
    areaId: selectedAreaId.value ?? undefined,
    sortOrder: sortOrder.value,
  });
}

onMounted(async () => {
  const [speakers, areas] = await Promise.all([
    GetAllSpeakers(),
    GetAllAreas(),
  ]);
  speakerItems.value = speakers.map((s) => ({
    id: s.id,
    displayName: `${s.lastName} ${s.firstName}`,
  }));
  areaItems.value = areas;
});
</script>

<style lang="scss" scoped>
.expand-enter-active,
.expand-leave-active {
  overflow: hidden;
  max-height: 500px;
  opacity: 1;
  transition:
    max-height 0.3s ease,
    opacity 0.3s ease;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}

@media (width >= 600px) {
  .question-filters__select-col {
    width: 50%;
  }
}
</style>
