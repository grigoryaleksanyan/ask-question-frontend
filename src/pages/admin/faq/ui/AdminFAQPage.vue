<template>
  <div class="admin-faq-page">
    <template v-if="isMainCatalog">
      <div class="admin-faq-page__actions">
        <Button
          label="+ Добавить"
          size="small"
          @click="openCreateCategory" />
      </div>

      <Draggable
        v-model="draggableCategories"
        v-bind="dragOptions"
        item-key="id"
        handle=".drag-handle"
        draggable=".draggable"
        drag-class="vuedraggable-drag"
        ghost-class="vuedraggable-ghost">
        <template #item="{ element }">
          <div class="draggable">
            <CategoryCard
              :category="element"
              @update="clickUpdateCategoryBtn(element)"
              @delete="clickDeleteCategoryBtn(element)" />
          </div>
        </template>
      </Draggable>

      <SlideOver ref="createCategorySlideOver">
        <template #header>
          <span class="admin-faq-page__slide-over-title">
            Создать категорию
          </span>
        </template>
        <template #default>
          <CreateCategory
            v-if="showCreateCategory"
            ref="create-category"
            :order="categories.length"
            @success="successCreateCategory"
            @cancel="cancelCreateCategory" />
        </template>
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
      </SlideOver>

      <SlideOver ref="updateCategorySlideOver">
        <template #header>
          <span class="admin-faq-page__slide-over-title">
            Изменить категорию
          </span>
        </template>
        <template #default>
          <UpdateCategory
            v-if="showUpdateCategory && currentCategory"
            ref="update-category"
            :category="currentCategory"
            @success="successUpdateCategory"
            @cancel="cancelUpdateCategory" />
        </template>
        <template #footer>
          <Button
            label="Изменить"
            @click="updateCategoryRef?.submitForm()" />
          <Button
            label="Отмена"
            outlined
            severity="secondary"
            @click="updateCategoryRef?.cancel()" />
        </template>
      </SlideOver>

      <SlideOver ref="deleteCategorySlideOver">
        <template #header>
          <span class="admin-faq-page__slide-over-title">
            Удалить категорию
          </span>
        </template>
        <template #default>
          <DeleteCategory
            v-if="showDeleteCategory && currentCategory"
            :id="currentCategory.id"
            ref="delete-category"
            @success="successDeleteCategory"
            @cancel="cancelDeleteCategory" />
        </template>
        <template #footer>
          <Button
            label="Удалить"
            severity="danger"
            @click="deleteCategoryRef?.confirm()" />
          <Button
            label="Отмена"
            outlined
            severity="secondary"
            @click="deleteCategoryRef?.cancel()" />
        </template>
      </SlideOver>
    </template>

    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, useTemplateRef } from 'vue';
import { useRoute } from 'vue-router';
import Draggable from 'vuedraggable';

import type {
  FaqCategoryWithEntriesResponse,
  FaqCategoryResponse,
} from '@/shared/types';

import Button from 'primevue/button';

import { useApiCall } from '@/shared/lib';
import {
  GetAllWithEntriesForAdmin,
  SetCategoryOrder,
  CategoryCard,
  CreateCategory,
  UpdateCategory,
  DeleteCategory,
} from '@/entities/faq';

defineOptions({ name: 'AdminFAQPage' });

const route = useRoute();
const categories = ref<FaqCategoryWithEntriesResponse[]>([]);
let oldOrderCategories: FaqCategoryWithEntriesResponse[] = [];
const { execute: executeSetOrder } = useApiCall(SetCategoryOrder, {
  successMessage: 'Сортировка применена',
  onError: () => {
    categories.value = oldOrderCategories;
  },
});
const { execute: executeFetch } = useApiCall(GetAllWithEntriesForAdmin);

const currentCategory = ref<FaqCategoryWithEntriesResponse | null>(null);

const showCreateCategory = ref(false);
const showUpdateCategory = ref(false);
const showDeleteCategory = ref(false);

const createCategorySlideOver = useTemplateRef('createCategorySlideOver');
const updateCategorySlideOver = useTemplateRef('updateCategorySlideOver');
const deleteCategorySlideOver = useTemplateRef('deleteCategorySlideOver');
const createCategoryRef = useTemplateRef('create-category');
const updateCategoryRef = useTemplateRef('update-category');
const deleteCategoryRef = useTemplateRef('delete-category');

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

  async set(newOrderCategories: FaqCategoryWithEntriesResponse[]) {
    oldOrderCategories = [...categories.value];
    categories.value = newOrderCategories;
    const categoryIds = newOrderCategories.map(
      (category: FaqCategoryWithEntriesResponse) => category.id,
    );
    await executeSetOrder(categoryIds);
  },
});

async function fetchData() {
  const result = await executeFetch();
  if (result) {
    categories.value = result;
  }
}

async function openCreateCategory() {
  showCreateCategory.value = true;
  await createCategorySlideOver.value?.open();
  showCreateCategory.value = false;
}

function successCreateCategory(category: FaqCategoryResponse) {
  const categoryWithEntries: FaqCategoryWithEntriesResponse = {
    ...category,
    entries: [],
  };
  categories.value = [...categories.value, categoryWithEntries];
  createCategorySlideOver.value?.close();
}

function cancelCreateCategory() {
  createCategorySlideOver.value?.close();
}

function clickUpdateCategoryBtn(cat: FaqCategoryWithEntriesResponse) {
  currentCategory.value = cat;
  openUpdateCategory();
}

async function openUpdateCategory() {
  showUpdateCategory.value = true;
  await updateCategorySlideOver.value?.open();
  showUpdateCategory.value = false;
}

function successUpdateCategory(name: string) {
  if (currentCategory.value) {
    const idx = categories.value.findIndex(
      (c) => c.id === currentCategory.value!.id,
    );
    if (idx !== -1) {
      categories.value[idx] = { ...categories.value[idx], name };
    }
  }

  updateCategorySlideOver.value?.close();
}

function cancelUpdateCategory() {
  updateCategorySlideOver.value?.close();
}

function clickDeleteCategoryBtn(cat: FaqCategoryWithEntriesResponse) {
  currentCategory.value = cat;
  openDeleteCategory();
}

async function openDeleteCategory() {
  showDeleteCategory.value = true;
  await deleteCategorySlideOver.value?.open();
  showDeleteCategory.value = false;
}

function successDeleteCategory() {
  if (currentCategory.value) {
    categories.value = categories.value.filter(
      (c) => c.id !== currentCategory.value!.id,
    );
  }

  deleteCategorySlideOver.value?.close();
}

function cancelDeleteCategory() {
  deleteCategorySlideOver.value?.close();
}

if (route.name === 'admin-faq') {
  fetchData();
}
</script>

<style lang="scss" scoped>
.admin-faq-page {
  padding: 16px 24px;
}

.admin-faq-page__actions {
  margin-bottom: 16px;
}

.admin-faq-page__slide-over-title {
  color: variables.$text-primary-dark;
  font-size: 1.25rem;
  font-weight: 500;
}
</style>
