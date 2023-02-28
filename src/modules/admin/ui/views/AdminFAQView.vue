<template>
  <v-container
    style="max-width: 1920px"
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
            :key="category.id"
            class="col-12 col-sm-4 col-md-4 col-lg-3 draggable">
            <CategoryCard :title="category.name" />
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
        :order="categories.length"
        :is-open="showCreateCategory"
        @success="successCreateCategory"
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
      categories: [],

      showCreateCategory: false,
    };
  },

  created() {
    this.fetchData();
  },

  methods: {
    ...mapMutations('alert', ['ADD_ALERT']),
    ...mapMutations('preloader', ['ADD_LOADER', 'REMOVE_LOADER']),

    async fetchData() {
      try {
        this.ADD_LOADER();
        this.categories = await GetAll();
      } catch (error) {
        this.ADD_ALERT({ type: ALERT_TYPES.ERROR, text: error.message });
      } finally {
        this.REMOVE_LOADER();
      }
    },

    successCreateCategory(category) {
      this.categories = [...this.categories, category];
      this.showCreateCategory = false;
    },
  },
};
</script>
