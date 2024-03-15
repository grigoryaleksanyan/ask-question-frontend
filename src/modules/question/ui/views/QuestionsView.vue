<template>
  <v-container
    fluid
    style="max-width: 1000px">
    <v-row no-gutters>
      <v-col
        cols="12"
        class="my-8">
        <h1 class="text-h4 text-sm-h3 text-center">Все вопросы</h1>
      </v-col>
    </v-row>

    <v-row
      no-gutters
      justify="center"
      class="mb-8">
      <v-col
        cols="12"
        sm="8">
        <v-text-field
          label="Поиск"
          variant="solo-inverted"
          prepend-inner-icon="mdi-magnify"
          clearable
          hide-details />
      </v-col>
    </v-row>

    <v-row
      no-gutters
      class="mb-3">
      <v-col
        cols="12"
        class="mb-4">
        <v-tabs
          v-model="model"
          :show-arrows="$vuetify.display.mobile"
          align-tabs="center">
          <v-tab
            value="#tab-1"
            style="width: 150px">
            Новые
            <v-icon class="ml-2 ml-sm-0">mdi-new-box</v-icon>
          </v-tab>
          <v-tab
            value="#tab-2"
            style="width: 150px">
            В фокусе
            <v-icon class="ml-2 ml-sm-0">mdi-crosshairs-question</v-icon>
          </v-tab>
          <v-tab
            value="#tab-3"
            style="width: 150px">
            Отвеченные
            <v-icon class="ml-2 ml-sm-0">mdi-bullhorn-outline</v-icon>
          </v-tab>
        </v-tabs>
      </v-col>
    </v-row>

    <v-row
      no-gutters
      class="mb-3">
      <v-col cols="12">
        <QuestionFilters />
      </v-col>
    </v-row>

    <template v-if="questions.length">
      <v-row
        no-gutters
        class="mb-5">
        <v-col cols="12">
          <v-window v-model="model">
            <v-window-item
              v-for="i in 3"
              :key="i"
              :value="`tab-${i}`">
              <QuestionCard
                v-for="question in questions"
                :key="question.id"
                :question="question" />
            </v-window-item>
          </v-window>
        </v-col>
      </v-row>

      <v-row
        no-gutters
        class="mb-5">
        <v-col cols="12">
          <v-pagination
            v-model="page"
            :length="15"
            :total-visible="7" />
        </v-col>
      </v-row>
    </template>

    <template v-else>
      <v-row
        no-gutters
        class="my-6">
        <v-col cols="12">
          <p style="margin: 0; color: grey; font-size: 22px; text-align: center">Вопросы отсутсвуют</p>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script>
import { mapMutations } from 'vuex';

import ALERT_TYPES from '@/modules/alert/constants/alert-types';
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
        this.ADD_ALERT({ type: ALERT_TYPES.ERROR, text: error.message });
      }
    },
  },
};
</script>
