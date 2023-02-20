<template>
  <v-container
    fluid
    style="max-width: 1000px">
    <v-row no-gutters>
      <v-col
        cols="12"
        class="my-8">
        <h2 class="text-h4 text-sm-h3 text-center">Все вопросы</h2>
      </v-col>
    </v-row>

    <v-row
      no-gutters
      justify="center"
      class="mb-8">
      <v-col
        cols="12"
        class="col-sm-6">
        <v-sheet
          elevation="2"
          rounded
          dark
          color="#49494a"
          class="pa-2">
          <v-text-field
            label="Поиск"
            prepend-inner-icon="mdi-magnify"
            clearable
            solo-inverted
            hide-details
            dense />
        </v-sheet>
      </v-col>
    </v-row>

    <v-row
      no-gutters
      justify="center"
      class="mb-8">
      <v-col
        cols="12"
        class="mb-4">
        <v-tabs
          v-model="model"
          :show-arrows="$vuetify.breakpoint.mobile"
          :icons-and-text="!$vuetify.breakpoint.mobile"
          centered>
          <v-tab
            href="#tab-1"
            style="width: 150px">
            Новые
            <v-icon class="ml-2 ml-sm-0">mdi-new-box</v-icon>
          </v-tab>
          <v-tab
            href="#tab-2"
            style="width: 150px">
            В фокусе
            <v-icon class="ml-2 ml-sm-0">mdi-crosshairs-question</v-icon>
          </v-tab>
          <v-tab
            href="#tab-3"
            style="width: 150px">
            Отвеченные
            <v-icon class="ml-2 ml-sm-0">mdi-bullhorn-outline</v-icon>
          </v-tab>
        </v-tabs>
      </v-col>
      <v-col cols="12">
        <QuestionFilters />

        <v-tabs-items v-model="model">
          <v-tab-item
            v-for="i in 3"
            :key="i"
            :value="`tab-${i}`">
            <QuestionCard
              v-for="question in questions"
              :key="question.id"
              :question="question" />
          </v-tab-item>
        </v-tabs-items>

        <v-col cols="12">
          <p>Вопросы отсутсвуют</p>
          <v-pagination
            v-model="page"
            :length="15"
            :total-visible="7"></v-pagination>
        </v-col>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapMutations } from 'vuex';
import { GetAll } from '@/modules/question/repositories/questions-repository';

import QuestionFilters from '@/modules/question/ui/components/QuestionFilters.vue';
import QuestionCard from '@/modules/question/ui/components/QuestionCard.vue';

export default {
  name: 'QuestionsView',
  components: {
    QuestionFilters,
    QuestionCard,
  },
  data() {
    return {
      model: 'tab-1',
      page: 1,

      questions: [],
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    ...mapMutations('alert', ['ADD_ALERT']),
    async fetchData() {
      try {
        this.questions = await GetAll();
      } catch (error) {
        this.ADD_ALERT({ type: 'success', text: 'Все ок', delay: 5000 });
        this.ADD_ALERT({ type: 'info', text: 'Инфо' });
        setTimeout(() => {
          this.ADD_ALERT({ type: 'warning', text: 'Предупреждение', delay: 15000 });
        }, 3000);
        setTimeout(() => {
          this.ADD_ALERT({ type: 'error', text: error.message });
        }, 2000);
      }
    },
  },
};
</script>
