<template>
  <v-container
    style="max-width: 1200px"
    class="text-left pa-5 mx-auto"
    fluid>
    <template v-if="isMainCatalog">
      <v-row>
        <v-col cols="12">
          <v-row>
            <v-col cols="12">
              <h1 class="text-h6 text-sm-h5">Категории FAQ</h1>
            </v-col>

            <Draggable
              v-model="draggableCategories"
              class="col-12 pa-0"
              style="display: flex; flex-wrap: wrap"
              v-bind="dragOptions"
              handle=".draggable"
              draggable=".draggable">
              <v-col
                v-for="category in categories"
                :key="category.id"
                class="col-12 col-sm-4 col-md-4 col-lg-3 draggable">
                <CategoryCard :category="category" />
              </v-col>
              <v-col class="col-12 col-sm-4 col-md-4 col-lg-3">
                <CreateCardButton
                  title="Новая категория"
                  @click="showCreateCategory = true" />
              </v-col>
            </Draggable>
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
    </template>
    <router-view></router-view>
  </v-container>
</template>

<script>
import Draggable from 'vuedraggable';

import { mapMutations } from 'vuex';

import ALERT_TYPES from '@/modules/alert/constants/alert-types';
import { GetAll, SetOrder } from '@/modules/faq/repositories/faq-category-repository';

import CategoryCard from '../components/FAQ/CategoryCard.vue';
import CreateCardButton from '../components/FAQ/CreateCardButton.vue';

import CreateCategory from '../components/FAQ/center-modal-content/CreateCategory.vue';

export default {
  name: 'AdminFAQView',

  components: {
    Draggable,

    CategoryCard,
    CreateCardButton,

    CreateCategory,
  },

  data() {
    return {
      categories: [],

      showCreateCategory: false,

      dragOptions: {
        animation: 150,
        group: 'categories',
        disabled: false,
        forceFallback: true,
      },
    };
  },

  computed: {
    isMainCatalog() {
      return this.$route.name === 'admin-faq';
    },

    draggableCategories: {
      get() {
        return this.categories;
      },
      async set(newOrderCategories) {
        const oldOrderCategories = [...this.categories];

        this.categories = newOrderCategories;

        try {
          this.ADD_LOADER();
          const categoryIds = newOrderCategories.map((category) => category.id);
          await SetOrder(categoryIds);
          this.ADD_ALERT({ type: ALERT_TYPES.SUCCESS, text: 'Сортировка применена' });
        } catch (error) {
          this.categories = oldOrderCategories;
          this.ADD_ALERT({ type: ALERT_TYPES.ERROR, text: error.message });
        } finally {
          this.REMOVE_LOADER();
        }
      },
    },
  },

  created() {
    if (this.isMainCatalog) {
      this.fetchData();
    }
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
