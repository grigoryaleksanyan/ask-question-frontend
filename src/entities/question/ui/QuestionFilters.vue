<template>
  <v-container>
    <v-row class="justify-space-between">
      <v-col cols="6">
        <v-btn-toggle
          v-model="sortingDirection"
          density="compact">
          <v-btn
            size="small"
            title="Сначала новые">
            <v-icon
              size="20"
              color="#717171">
              mdi-arrow-up-thin
            </v-icon>
          </v-btn>

          <v-btn
            size="small"
            title="Сначала старые">
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
          class="col-sm-4">
          <v-select
            :items="speaker"
            label="Спикер"
            variant="outlined"
            clearable
            hide-details
            density="compact"
            :menu-props="{ bottom: true, offsetY: true }" />
        </v-col>
        <v-col
          cols="12"
          class="col-sm-4">
          <v-select
            :items="zone"
            label="Зона ответственности"
            variant="outlined"
            clearable
            hide-details
            density="compact"
            :menu-props="{ bottom: true, offsetY: true }" />
        </v-col>
        <v-col
          cols="12"
          class="col-sm-4">
          <v-select
            :items="status"
            label="Статус"
            variant="outlined"
            clearable
            hide-details
            density="compact"
            :menu-props="{ bottom: true, offsetY: true }" />
        </v-col>
      </v-row>
    </v-expand-transition>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineOptions({ name: 'QuestionFilters' });

const showFilters = ref(false);

const sortingDirection = ref(0);

const speaker = ['Иван', 'Петр'];

const zone = ['Север', 'Юг'];

const status = ['новый', 'в фокусе'];

function toggleFilters() {
  showFilters.value = !showFilters.value;
}
</script>
