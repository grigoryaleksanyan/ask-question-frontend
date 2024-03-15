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
        { title: 'Имя', key: 'author' },
        { title: 'Зона ответственности', key: 'zone' },
        { title: 'Спикер', key: 'speaker' },
        { title: 'Вопрос', key: 'text' },
        { title: 'Лайки', key: 'likes' },
        { title: 'Дизлайки', key: 'dislikes' },
        { title: 'Просмотры', key: 'views' },
        { title: 'Статус', key: 'status' },
        { title: 'Дата создания', key: 'сreated' },
        { title: 'Дата ответа', key: 'iron' },
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
