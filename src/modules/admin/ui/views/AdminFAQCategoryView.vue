<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-row>
          <v-col
            cols="12"
            class="d-flex">
            <h1 class="text-h6 text-sm-h5 mr-4">Категория: {{ category.name }}</h1>

            <v-btn
              title="Изменить"
              class="mr-2"
              icon
              small
              @click="showUpdateCategory = true">
              <v-icon>mdi-pencil-outline</v-icon>
            </v-btn>
            <v-btn
              title="Удалить"
              icon
              small
              @click="showDeleteCategory = true">
              <v-icon>mdi-delete-outline</v-icon>
            </v-btn>
          </v-col>

          <v-col>
            <v-simple-table>
              <template #default>
                <thead>
                  <tr>
                    <th class="text-left">Вопрос</th>
                    <th class="text-left">Ответ</th>
                    <th class="text-left">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="entry in entries"
                    :key="entry.id">
                    <td
                      class="py-2"
                      style="max-width: 400px; vertical-align: top">
                      {{ entry.title }}
                    </td>
                    <td
                      class="py-2"
                      style="vertical-align: top"
                      v-html="entry.description"></td>
                    <td
                      class="py-2"
                      style="vertical-align: top">
                      <div class="d-flex align-center">
                        <v-btn
                          title="Изменить"
                          class="mr-2"
                          icon
                          small>
                          <v-icon>mdi-pencil-outline</v-icon>
                        </v-btn>
                        <v-btn
                          title="Удалить"
                          icon
                          small>
                          <v-icon>mdi-delete-outline</v-icon>
                        </v-btn>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <CenterModal
      title="Изменить категорию "
      :is-open="showUpdateCategory"
      @close="showUpdateCategory = false">
      <UpdateCategory
        :category="category"
        :is-open="showUpdateCategory"
        @success="successUpdateCategory"
        @cancel="showUpdateCategory = false" />
    </CenterModal>

    <CenterModal
      title="Удалить категорию "
      :is-open="showDeleteCategory"
      @close="showDeleteCategory = false">
      <DeleteCategory
        :id="id"
        :is-open="showDeleteCategory"
        @success="successDeleteCategory"
        @cancel="showDeleteCategory = false" />
    </CenterModal>
  </div>
</template>

<script>
import { GetById } from '@/modules/faq/repositories/faq-category-repository';

import UpdateCategory from '../components/FAQ/center-modal-content/UpdateCategory.vue';
import DeleteCategory from '../components/FAQ/center-modal-content/DeleteCategory.vue';

export default {
  name: 'AdminFAQCategoryView',

  components: {
    UpdateCategory,
    DeleteCategory,
  },

  props: {
    id: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      category: {},

      showUpdateCategory: false,
      showDeleteCategory: false,

      entries: [
        {
          id: 1,
          title: 'Расскажите о режиме уделенной работы. Как долго продлится и какие есть ограничения?',
          description:
            '<p style="color: red;">Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti beatae quam possimus ad! Amet esse, fugiat explicabo facilis, odio necessitatibus ex eaque libero et iure labore non, voluptatum accusamus dolore!</p> <p style="color: red;">Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti beatae quam possimus ad! Amet esse, fugiat explicabo facilis, odio necessitatibus ex eaque libero et iure labore non, voluptatum accusamus dolore!</p>',
        },
      ],
    };
  },

  created() {
    this.fetchData();
  },

  methods: {
    async fetchData() {
      this.category = await GetById(this.id);
    },

    successUpdateCategory(name) {
      this.category.name = name;

      this.showUpdateCategory = false;
    },

    successDeleteCategory() {
      this.showDeleteCategory = false;

      this.$router.push({ name: 'admin-faq' });
    },
  },
};
</script>
