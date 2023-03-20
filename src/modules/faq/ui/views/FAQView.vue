<template>
  <v-container
    fluid
    style="max-width: 1400px">
    <v-row no-gutters>
      <v-col
        cols="12"
        class="my-8">
        <h1 class="text-h4 text-sm-h3 text-center">Часто задаваемые вопросы</h1>
      </v-col>
    </v-row>

    <template v-if="categories.length">
      <v-row
        v-for="category in categories"
        :key="category.id"
        justify="center"
        class="mb-8">
        <v-col
          cols="12"
          sm="3">
          <h2 class="text-h6 text-sm-h5 mb-3 section-title">{{ category.name }}</h2>
        </v-col>
        <v-col
          cols="12"
          sm="9">
          <v-expansion-panels
            active-class="active-panel"
            hover
            flat
            accordion>
            <v-expansion-panel
              v-for="entry in category.entries"
              :id="entry.id"
              :key="entry.id">
              <v-expansion-panel-header>
                <span class="question">{{ entry.question }}</span>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <div v-html="entry.answer"></div>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
    </template>

    <template v-else>
      <v-row>
        <v-col cols="12">
          <p style="color: grey; font-size: 24px; text-align: center">Записей пока нет</p>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>
<script>
import { mapMutations } from 'vuex';

import ALERT_TYPES from '@/modules/alert/constants/alert-types';

import { GetAllWithEntries } from '../../repositories/faq-category-repository';

export default {
  name: 'FAQView',

  data() {
    return {
      categories: [],
    };
  },

  created() {
    this.fetchData();
  },

  mounted() {
    const { id } = this.$route.query;

    if (id) {
      setTimeout(() => {
        const element = document.getElementById(id);

        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });

          element.children[0].click();
        }
      }, 100);
    }
  },

  methods: {
    ...mapMutations('alert', ['ADD_ALERT']),
    ...mapMutations('preloader', ['ADD_LOADER', 'REMOVE_LOADER']),

    async fetchData() {
      try {
        this.ADD_LOADER();
        this.categories = await GetAllWithEntries();
      } catch (error) {
        this.ADD_ALERT({ type: ALERT_TYPES.ERROR, text: error.message });
      } finally {
        this.REMOVE_LOADER();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.section-title {
  padding-left: 10px;
  border-left: 5px solid $main-color;
}

.question {
  font-size: 18px;
}

.active-panel .question {
  color: $main-color;
}
</style>
