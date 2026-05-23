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
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-btn
                size="small"
                color="blue-grey"
                @click="showCreateCategory = true">
                Добавить категорию
                <v-icon
                  end
                  theme="dark">
                  mdi-plus
                </v-icon>
              </v-btn>
            </v-col>
          </v-row>

          <Draggable
            v-model="draggableCategories"
            v-bind="dragOptions"
            class="v-row"
            item-key="id"
            handle=".draggable"
            draggable=".draggable"
            drag-class="vuedraggable-drag"
            ghost-class="vuedraggable-ghost">
            <template #item="{ element }">
              <v-col
                :key="element.id"
                cols="12"
                sm="4"
                md="4"
                lg="3"
                class="draggable">
                <CategoryCard :category="element" />
              </v-col>
            </template>
          </Draggable>
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

<script setup>
import { ref, computed, reactive } from 'vue';
import { useRoute } from 'vue-router';
import Draggable from 'vuedraggable';

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

const categories = ref([]);

const showCreateCategory = ref(false);

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

  async set(newOrderCategories) {
    const oldOrderCategories = [...categories.value];

    categories.value = newOrderCategories;

    try {
      preloaderStore.addLoader();
      const categoryIds = newOrderCategories.map((category) => category.id);
      await SetCategoryOrder(categoryIds);
      alertStore.addAlert({
        type: ALERT_TYPES.SUCCESS,
        text: 'Сортировка применена',
      });
    } catch (error) {
      categories.value = oldOrderCategories;
      alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: error.message });
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
    alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: error.message });
  } finally {
    preloaderStore.removeLoader();
  }
}

function successCreateCategory(category) {
  categories.value = [...categories.value, category];
  showCreateCategory.value = false;
}

if (route.name === 'admin-faq') {
  fetchData();
}
</script>
