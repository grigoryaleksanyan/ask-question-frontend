<template>
  <div class="faq-view">
    <h1 class="faq-view__title">Часто задаваемые вопросы</h1>

    <template v-if="categories.length > 0">
      <div
        v-for="category in categories"
        :key="category.id"
        class="faq-view__category">
        <div class="faq-view__category-label">
          {{ category.name }}
        </div>
        <div class="faq-view__category-entries">
          <Accordion multiple>
            <AccordionPanel
              v-for="entry in category.entries"
              :key="entry.id"
              :value="entry.id">
              <AccordionHeader>
                <span
                  class="faq-view__question"
                  :data-entry-id="entry.id"
                  >{{ entry.question }}</span
                >
              </AccordionHeader>
              <AccordionContent>
                <div
                  class="faq-view__answer"
                  v-html="entry.answer"></div>
              </AccordionContent>
            </AccordionPanel>
          </Accordion>
        </div>
      </div>
    </template>

    <template v-else>
      <p class="faq-view__empty">Записи отсутствуют</p>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

import type { FaqCategoryWithEntriesResponse } from '@/shared/dto';

import { useApiCall } from '@/shared/lib';

import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';

import { GetAllWithEntries } from '../api/faq-category-repository';

defineOptions({ name: 'FAQView' });

const route = useRoute();

const { execute: executeFetchCategories } = useApiCall(GetAllWithEntries);

const categories = ref<FaqCategoryWithEntriesResponse[]>([]);

async function fetchData() {
  const result = await executeFetchCategories();
  if (result) {
    categories.value = result;
  }
}

onMounted(() => {
  const { id } = route.query;

  if (typeof id === 'string') {
    setTimeout(() => {
      const entrySpan = document.querySelector(`[data-entry-id="${id}"]`);

      if (entrySpan) {
        const panel = entrySpan.closest('.p-accordion-panel');

        if (panel) {
          panel.scrollIntoView({ behavior: 'smooth', block: 'start' });

          const headerLink = panel.querySelector<HTMLElement>(
            '.p-accordion-header-link',
          );

          headerLink?.click();
        }
      }
    }, 100);
  }
});

fetchData();
</script>

<style lang="scss" scoped>
.faq-view {
  max-width: 640px;
  padding: 24px 24px 48px;
  margin: 0 auto;
}

@media (width <= 600px) {
  .faq-view {
    padding: 16px 16px 32px;
  }
}

.faq-view__title {
  margin: 0 0 24px;
  color: variables.$text-primary;
  font-size: 24px;
  font-weight: 500;
}

.faq-view__category-label {
  padding-left: 8px;
  border-left: 2px solid variables.$main-color;
  margin-bottom: 10px;
  color: variables.$text-muted;
  font-size: 12px;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.faq-view__category-entries {
  overflow: hidden;
  border: 1px solid variables.$border-light;
  border-radius: 8px;
  margin-bottom: 16px;

  :deep(.p-accordion) {
    border: none;
  }

  :deep(.p-accordion-panel) {
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }
  }

  :deep(.p-accordion-header-link) {
    padding: 14px 16px;
    border: none;
    background: transparent;
  }

  :deep(.p-accordion-content) {
    padding: 0 16px 14px;
    border: none;
  }
}

.faq-view__category-entries
  :deep(.p-accordion-panel[data-p-active='true'])
  .faq-view__question {
  font-weight: 500;
}

.faq-view__question {
  color: variables.$text-primary;
  font-size: 14px;
}

.faq-view__answer {
  color: variables.$text-secondary;
  font-size: 14px;
  line-height: 1.6;
}

.faq-view__empty {
  color: variables.$text-muted;
  font-size: 16px;
  text-align: center;
}
</style>
