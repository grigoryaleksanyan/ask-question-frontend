<template>
  <v-container
    class="text-left pa-5 mx-auto"
    fluid>
    <v-row>
      <v-col cols="12">
        <v-row>
          <v-col cols="12">
            <h1 class="text-h6 text-sm-h5">Категории FAQ</h1>
          </v-col>
          <v-col
            v-for="category in categories"
            :key="category.categoryId"
            class="col-12 col-sm-4 col-md-4 col-lg-3 draggable">
            <CategoryCard :title="category.title" />
          </v-col>
          <v-col class="col-12 col-sm-4 col-md-4 col-lg-3">
            <CreateCategoryCardButton
              title="Новая категория"
              @click="showCreateCategory = true" />
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <CenterModal
      title="Создать категорию "
      :is-open="showCreateCategory"
      @close="showCreateCategory = false">
      <CreateCategory
        @success="showCreateCategory = false"
        @cancel="showCreateCategory = false" />
    </CenterModal>
  </v-container>
</template>

<script>
import { mapMutations } from 'vuex';

import ALERT_TYPES from '@/modules/alert/constants/alert-types';
import { GetAll } from '@/modules/faq/repositories/faq-category-repository';

import CategoryCard from '../components/FAQ/CategoryCard.vue';
import CreateCategoryCardButton from '../components/FAQ/CreateCategoryCardButton.vue';

import CreateCategory from '../components/FAQ/center-modal-content/CreateCategory.vue';

export default {
  name: 'AdminFAQView',

  components: {
    CategoryCard,
    CreateCategoryCardButton,

    CreateCategory,
  },

  data() {
    return {
      categories: [
        {
          categoryId: 1,
          title: 'Удаленная работа',
        },
        {
          categoryId: 2,
          title: 'Трансляция через Wink',
        },
      ],

      showCreateCategory: false,
    };
  },

  created() {
    this.fetchData();
  },

  methods: {
    ...mapMutations('alert', ['ADD_ALERT']),

    async fetchData() {
      try {
        this.categories = await GetAll();
      } catch (error) {
        this.ADD_ALERT({ type: ALERT_TYPES.ERROR, text: error.message });
      }
    },
  },
};
</script>
