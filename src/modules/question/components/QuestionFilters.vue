<template>
  <v-container>
    <v-row justify="space-between">
      <v-col cols="6">
        <v-btn-toggle v-model="sortingDirection" borderless>
          <v-btn small title="Сначала новые">
            <v-icon size="20" color="#717171">mdi-arrow-up-thin</v-icon>
          </v-btn>

          <v-btn small title="Сначала старые">
            <v-icon size="20" color="#717171">mdi-arrow-down-thin</v-icon>
          </v-btn>
        </v-btn-toggle>
      </v-col>
      <v-col cols="6" class="d-flex justify-end">
        <v-btn elevation="0" small title="Показать/скрыть блок фильтров" @click="toggleFilters">
          <span class="mr-1"> Фильтры</span>
          <v-icon v-if="!showFilters" size="20" color="#717171"> mdi-filter-outline </v-icon>
          <v-icon v-else size="20" color="#717171"> mdi-filter-remove-outline </v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <v-expand-transition>
      <v-row v-show="showFilters" justify="center" class="mt-6">
        <v-col cols="12" class="col-sm-4">
          <v-select
            :items="speaker"
            label="Спикер"
            outlined
            clearable
            hide-details
            dense
            :menu-props="{ bottom: true, offsetY: true }" />
        </v-col>
        <v-col cols="12" class="col-sm-4">
          <v-select
            :items="zone"
            label="Зона ответственности"
            outlined
            clearable
            hide-details
            dense
            :menu-props="{ bottom: true, offsetY: true }" />
        </v-col>
        <v-col cols="12" class="col-sm-4">
          <v-select
            :items="status"
            label="Статус"
            outlined
            clearable
            hide-details
            dense
            :menu-props="{ bottom: true, offsetY: true }" />
        </v-col>
      </v-row>
    </v-expand-transition>
  </v-container>
</template>

<script>
export default {
  name: 'QuestionFilters',
  data() {
    return {
      showFilters: false,
      sortingDirection: 0,
      speaker: ['Иван', 'Петр'],
      zone: ['Север', 'Юг'],
      status: ['новый', 'в фокусе'],
    };
  },
  methods: {
    toggleFilters() {
      this.showFilters = !this.showFilters;
    },
  },
};
</script>
