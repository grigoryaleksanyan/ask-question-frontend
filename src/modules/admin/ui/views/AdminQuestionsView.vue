<template>
  <v-container fluid>
    <v-row class="pa-3">
      <v-col>
        <v-data-table
          v-model="selected"
          :headers="headers"
          :items="questions"
          item-key="id"
          show-select
          class="elevation-1">
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapMutations } from 'vuex';

import ALERT_TYPES from '@/modules/alert/constants/alert-types';
import { GetAll } from '@/modules/question/repositories/questions-repository';

export default {
  name: 'AdminQuestionsView',

  data() {
    return {
      questions: [],

      selected: [],

      headers: [
        { text: 'Имя', value: 'author' },
        { text: 'Зона ответственности', value: 'zone' },
        { text: 'Спикер', value: 'speaker' },
        { text: 'Вопрос', value: 'text' },
        { text: 'Лайки', value: 'likes' },
        { text: 'Дизлайки', value: 'dislikes' },
        { text: 'Просмотры', value: 'views' },
        { text: 'Статус', value: 'iron' },
        { text: 'Дата создания', value: 'сreated' },
        { text: 'Дата ответа', value: 'iron' },
      ],
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
