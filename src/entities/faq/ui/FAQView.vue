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

    <template v-if="categories.length > 0">
      <v-row
        v-for="category in categories"
        :key="category.id"
        justify="center"
        class="mb-8">
        <v-col
          cols="12"
          sm="3">
          <h2 class="text-h6 text-sm-h5 mb-3 section-title">
            {{ category.name }}
          </h2>
        </v-col>
        <v-col
          cols="12"
          sm="9">
          <v-expansion-panels
            selected-class="active-panel"
            variant="accordion">
            <v-expansion-panel
              v-for="entry in category.entries"
              :id="entry.id"
              :key="entry.id">
              <v-expansion-panel-title>
                <span class="question">{{ entry.question }}</span>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <div v-html="entry.answer"></div>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
    </template>

    <template v-else>
      <v-row>
        <v-col cols="12">
          <p style="color: grey; font-size: 24px; text-align: center">
            Записи отсутсвуют
          </p>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

import { ALERT_TYPES } from '@/shared/config';

import { useAlertStore } from '@/entities/alert';
import { usePreloaderStore } from '@/features/preloader';

import { GetAllWithEntries } from '../api/faq-category-repository';

defineOptions({ name: 'FAQView' });

const route = useRoute();
const alertStore = useAlertStore();
const preloaderStore = usePreloaderStore();

const categories = ref([]);

async function fetchData() {
  try {
    preloaderStore.addLoader();
    categories.value = await GetAllWithEntries();
  } catch (error) {
    alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: error.message });
  } finally {
    preloaderStore.removeLoader();
  }
}

onMounted(() => {
  const { id } = route.query;

  if (id) {
    setTimeout(() => {
      const element = document.querySelector(`#${id}`);

      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });

        element.children[0].click();
      }
    }, 100);
  }
});

fetchData();
</script>

<style lang="scss" scoped>
.section-title {
  padding-left: 10px;
  border-left: 5px solid variables.$main-color;
}

.question {
  font-size: 18px;
}

.active-panel .question {
  color: variables.$main-color;
}
</style>
