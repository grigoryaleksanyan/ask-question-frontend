<template>
  <div
    class="faq-view"
    style="max-width: 1400px">
    <div class="flex">
      <div class="col-12 my-8">
        <h1 class="text-headline-large text-center">
          Часто задаваемые вопросы
        </h1>
      </div>
    </div>

    <template v-if="categories.length > 0">
      <div
        v-for="category in categories"
        :key="category.id"
        class="flex mb-8 justify-center">
        <div class="col-12 sm:col-3">
          <h2 class="text-headline-small mb-3 faq-view__section-title">
            {{ category.name }}
          </h2>
        </div>
        <div class="col-12 sm:col-9">
          <Accordion multiple>
            <AccordionPanel
              v-for="entry in category.entries"
              :key="entry.id"
              :value="entry.id">
              <AccordionHeader>
                <span class="faq-view__question">{{ entry.question }}</span>
              </AccordionHeader>
              <AccordionContent>
                <div v-html="entry.answer"></div>
              </AccordionContent>
            </AccordionPanel>
          </Accordion>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="flex">
        <div class="col-12">
          <p style="color: grey; font-size: 24px; text-align: center">
            Записи отсутсвуют
          </p>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

import type { FaqCategoryWithEntriesResponse } from '@/shared/types';

import { ALERT_TYPES } from '@/shared/config';

import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';

import { useAlertStore } from '@/entities/alert';
import { usePreloaderStore } from '@/features/preloader';

import { GetAllWithEntries } from '../api/faq-category-repository';

defineOptions({ name: 'FAQView' });

const route = useRoute();
const alertStore = useAlertStore();
const preloaderStore = usePreloaderStore();

const categories = ref<FaqCategoryWithEntriesResponse[]>([]);

async function fetchData() {
  try {
    preloaderStore.addLoader();
    categories.value = await GetAllWithEntries();
  } catch (error) {
    const err = error as Error;
    alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: err.message });
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

        ((element as HTMLElement).children[0] as HTMLElement).click();
      }
    }, 100);
  }
});

fetchData();
</script>

<style lang="scss" scoped>
.faq-view__section-title {
  padding-left: 10px;
  border-left: 5px solid variables.$main-color;
}

.faq-view__question {
  font-size: 18px;
}
</style>
