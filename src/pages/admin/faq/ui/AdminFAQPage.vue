<template>
  <div
    style="max-width: 1200px"
    class="text-left p-5 mx-auto">
    <template v-if="isMainCatalog">
      <div class="grid">
        <div class="col-12">
          <div class="grid">
            <div class="col-12">
              <h1
                class="typography__headline--small typography__headline--medium--sm">
                Категории FAQ
              </h1>
            </div>
          </div>

          <div class="grid">
            <div class="col-12">
              <Button
                size="small"
                severity="secondary"
                @click="showCreateCategory = true">
                Добавить категорию
                <i class="pi pi-plus ml-2"></i>
              </Button>
            </div>
          </div>

          <Draggable
            v-model="draggableCategories"
            v-bind="dragOptions"
            class="grid"
            item-key="id"
            handle=".draggable"
            draggable=".draggable"
            drag-class="vuedraggable-drag"
            ghost-class="vuedraggable-ghost">
            <template #item="{ element }">
              <div
                :key="element.id"
                class="col-12 sm:col-4 md:col-4 lg:col-3 draggable">
                <CategoryCard :category="element" />
              </div>
            </template>
          </Draggable>
        </div>
      </div>

      <CenterModal
        title="Создать категорию "
        :is-open="showCreateCategory"
        @close="showCreateCategory = false">
        <CreateCategory
          ref="create-category"
          :order="categories.length"
          :is-open="showCreateCategory"
          @success="successCreateCategory"
          @cancel="showCreateCategory = false" />
        <template #footer>
          <Button
            label="Создать"
            @click="createCategoryRef?.submitForm()" />
          <Button
            label="Отмена"
            outlined
            severity="secondary"
            @click="createCategoryRef?.cancel()" />
        </template>
      </CenterModal>
    </template>

    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, useTemplateRef } from 'vue';
import { useRoute } from 'vue-router';
import Draggable from 'vuedraggable';

import type { FaqCategoryResponse } from '@/shared/types';

import Button from 'primevue/button';

import CenterModal from '@/shared/ui/center-modal/CenterModal.vue';

import { ALERT_TYPES } from '@/shared/config';
import {
  GetAllCategories,
  SetCategoryOrder,
  CategoryCard,
  CreateCategory,
} from '@/entities/faq';
import { useAlertStore } from '@/entities/alert';
import { usePreloaderStore } from '@/features/preloader';

defineOptions({ name: 'AdminFAQPage' });

const route = useRoute();
const alertStore = useAlertStore();
const preloaderStore = usePreloaderStore();

const categories = ref<FaqCategoryResponse[]>([]);

const showCreateCategory = ref(false);

const createCategoryRef = useTemplateRef('create-category');

const dragOptions = reactive({
  animation: 150,
  group: 'categories',
  disabled: false,
  forceFallback: true,
});

const isMainCatalog = computed(() => route.name === 'admin-faq');

const draggableCategories = computed({
  get() {
    return categories.value;
  },

  async set(newOrderCategories: FaqCategoryResponse[]) {
    const oldOrderCategories = [...categories.value];

    categories.value = newOrderCategories;

    try {
      preloaderStore.addLoader();
      const categoryIds = newOrderCategories.map(
        (category: FaqCategoryResponse) => category.id,
      );
      await SetCategoryOrder(categoryIds);
      alertStore.addAlert({
        type: ALERT_TYPES.SUCCESS,
        text: 'Сортировка применена',
      });
    } catch (error) {
      categories.value = oldOrderCategories;
      const err = error as Error;
      alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: err.message });
    } finally {
      preloaderStore.removeLoader();
    }
  },
});

async function fetchData() {
  try {
    preloaderStore.addLoader();
    categories.value = await GetAllCategories();
  } catch (error) {
    const err = error as Error;
    alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: err.message });
  } finally {
    preloaderStore.removeLoader();
  }
}

function successCreateCategory(category: FaqCategoryResponse) {
  categories.value = [...categories.value, category];
  showCreateCategory.value = false;
}

if (route.name === 'admin-faq') {
  fetchData();
}
</script>
