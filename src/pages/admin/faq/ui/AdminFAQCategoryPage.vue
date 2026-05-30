<template>
  <div class="admin-faq-category-page">
    <template v-if="category">
      <div class="admin-faq-category-page__header">
        <h1 class="admin-faq-category-page__title">{{ category.name }}</h1>
        <div class="admin-faq-category-page__actions">
          <button
            title="Изменить"
            class="admin-faq-category-page__action"
            @click="openUpdateCategory">
            <i class="pi pi-pencil"></i>
          </button>
          <button
            title="Удалить"
            class="admin-faq-category-page__action admin-faq-category-page__action--danger"
            @click="openDeleteCategory">
            <i class="pi pi-trash"></i>
          </button>
        </div>
      </div>

      <div class="admin-faq-category-page__entries">
        <button
          class="admin-faq-category-page__add-entry"
          @click="openCreateEntry">
          + Добавить запись
        </button>

        <Draggable
          v-model="draggableEntries"
          v-bind="dragOptions"
          item-key="id"
          handle=".drag-handle"
          draggable=".draggable"
          drag-class="vuedraggable-drag"
          ghost-class="vuedraggable-ghost">
          <template #item="{ element, index }">
            <div class="draggable">
              <EntryCard
                :entry="element"
                :is-last="index === category.entries.length - 1"
                @update="openUpdateEntry(element)"
                @delete="openDeleteEntry(element)" />
            </div>
          </template>
        </Draggable>
      </div>

      <SlideOver ref="updateCategorySlideOver">
        <template #header>
          <span class="admin-faq-category-page__slide-over-title">
            Изменить категорию
          </span>
        </template>
        <template #default>
          <UpdateCategory
            v-if="showUpdateCategory"
            ref="update-category"
            :category="category"
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
          <span class="admin-faq-category-page__slide-over-title">
            Удалить категорию
          </span>
        </template>
        <template #default>
          <DeleteCategory
            v-if="showDeleteCategory"
            :id="id"
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

      <SlideOver ref="createEntrySlideOver">
        <template #header>
          <span class="admin-faq-category-page__slide-over-title">
            Создать запись в FAQ
          </span>
        </template>
        <template #default>
          <CreateEntryContent
            v-if="showCreateEntry"
            ref="create-entry-content"
            :category-id="category.id"
            :order="category.entries.length"
            @success="successCreateEntry"
            @cancel="cancelCreateEntry" />
        </template>
        <template #footer>
          <Button
            label="Создать"
            @click="createEntryContentRef?.submitForm()" />
          <Button
            label="Отмена"
            outlined
            severity="secondary"
            @click="createEntryContentRef?.cancel()" />
        </template>
      </SlideOver>

      <SlideOver ref="updateEntrySlideOver">
        <template #header>
          <span class="admin-faq-category-page__slide-over-title">
            Изменить запись в FAQ
          </span>
        </template>
        <template #default>
          <UpdateEntryContent
            v-if="showUpdateEntry && currentEntry"
            ref="update-entry-content"
            :entry="currentEntry"
            @success="successUpdateEntry"
            @cancel="cancelUpdateEntry" />
        </template>
        <template #footer>
          <Button
            label="Изменить"
            @click="updateEntryContentRef?.submitForm()" />
          <Button
            label="Отмена"
            outlined
            severity="secondary"
            @click="updateEntryContentRef?.cancel()" />
        </template>
      </SlideOver>

      <SlideOver ref="deleteEntrySlideOver">
        <template #header>
          <span class="admin-faq-category-page__slide-over-title">
            Удалить запись
          </span>
        </template>
        <template #default>
          <DeleteEntryModal
            v-if="showDeleteEntry && currentEntry"
            :id="currentEntry.id"
            ref="delete-entry"
            @success="successDeleteEntry"
            @cancel="cancelDeleteEntry" />
        </template>
        <template #footer>
          <Button
            label="Удалить"
            severity="danger"
            @click="deleteEntryRef?.confirm()" />
          <Button
            label="Отмена"
            outlined
            severity="secondary"
            @click="deleteEntryRef?.cancel()" />
        </template>
      </SlideOver>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, useTemplateRef } from 'vue';
import { useRouter } from 'vue-router';
import Draggable from 'vuedraggable';

import type {
  FaqCategoryWithEntriesResponse,
  FaqEntryResponse,
} from '@/shared/types';

import Button from 'primevue/button';

import { useApiCall } from '@/shared/lib';

import {
  GetCategoryById,
  SetEntryOrder,
  EntryCard,
  UpdateCategory,
  DeleteCategory,
  DeleteEntryModal,
  CreateEntryContent,
  UpdateEntryContent,
} from '@/entities/faq';

defineOptions({ name: 'AdminFAQCategoryPage' });

const { id } = defineProps<{
  id: string;
}>();

const router = useRouter();
const category = ref<FaqCategoryWithEntriesResponse | null>(null);
let oldOrderEntries: FaqEntryResponse[] = [];
const { execute: executeSetOrder } = useApiCall(SetEntryOrder, {
  successMessage: 'Сортировка применена',
  onError: () => {
    if (category.value) {
      category.value.entries = oldOrderEntries;
    }
  },
});
const { execute: executeFetch } = useApiCall(() => GetCategoryById(id));
const currentEntry = ref<FaqEntryResponse | null>(null);

const showUpdateCategory = ref(false);
const showDeleteCategory = ref(false);
const showCreateEntry = ref(false);
const showUpdateEntry = ref(false);
const showDeleteEntry = ref(false);

const updateCategorySlideOver = useTemplateRef('updateCategorySlideOver');
const deleteCategorySlideOver = useTemplateRef('deleteCategorySlideOver');
const createEntrySlideOver = useTemplateRef('createEntrySlideOver');
const updateEntrySlideOver = useTemplateRef('updateEntrySlideOver');
const deleteEntrySlideOver = useTemplateRef('deleteEntrySlideOver');
const updateCategoryRef = useTemplateRef('update-category');
const deleteCategoryRef = useTemplateRef('delete-category');
const createEntryContentRef = useTemplateRef('create-entry-content');
const updateEntryContentRef = useTemplateRef('update-entry-content');
const deleteEntryRef = useTemplateRef('delete-entry');

const dragOptions = reactive({
  animation: 150,
  group: 'entries',
  disabled: false,
  forceFallback: true,
});

const draggableEntries = computed({
  get() {
    return category.value?.entries ?? [];
  },

  async set(newOrderEntries: FaqEntryResponse[]) {
    if (!category.value) return;

    oldOrderEntries = [...category.value.entries];
    category.value.entries = newOrderEntries;
    const entryIds = newOrderEntries.map((entry: FaqEntryResponse) => entry.id);
    await executeSetOrder(entryIds);
  },
});

async function fetchData() {
  const result = await executeFetch();
  if (result) {
    category.value = result;
  }
}

async function openUpdateCategory() {
  showUpdateCategory.value = true;
  await updateCategorySlideOver.value?.open();
  showUpdateCategory.value = false;
}

function successUpdateCategory(name: string) {
  if (category.value) {
    category.value.name = name;
  }

  updateCategorySlideOver.value?.close();
}

function cancelUpdateCategory() {
  updateCategorySlideOver.value?.close();
}

async function openDeleteCategory() {
  showDeleteCategory.value = true;
  await deleteCategorySlideOver.value?.open();
  showDeleteCategory.value = false;
}

function successDeleteCategory() {
  deleteCategorySlideOver.value?.close();
  router.push({ name: 'admin-faq' });
}

function cancelDeleteCategory() {
  deleteCategorySlideOver.value?.close();
}

async function openCreateEntry() {
  showCreateEntry.value = true;
  await createEntrySlideOver.value?.open();
  showCreateEntry.value = false;
}

function successCreateEntry(entry: FaqEntryResponse) {
  category.value?.entries.push(entry);
  createEntrySlideOver.value?.close();
}

function cancelCreateEntry() {
  createEntrySlideOver.value?.close();
}

function openUpdateEntry(entry: FaqEntryResponse) {
  currentEntry.value = entry;
  showUpdateEntry.value = true;
  updateEntrySlideOver.value?.open();
}

function successUpdateEntry(updatedEntry: FaqEntryResponse) {
  if (category.value) {
    category.value.entries = category.value.entries.map(
      (e: FaqEntryResponse) => (e.id === updatedEntry.id ? updatedEntry : e),
    );
  }

  updateEntrySlideOver.value?.close();
}

function cancelUpdateEntry() {
  updateEntrySlideOver.value?.close();
}

function openDeleteEntry(entry: FaqEntryResponse) {
  currentEntry.value = entry;
  showDeleteEntry.value = true;
  deleteEntrySlideOver.value?.open();
}

function successDeleteEntry(entryId: string) {
  if (category.value) {
    category.value.entries = category.value.entries.filter(
      (e: FaqEntryResponse) => e.id !== entryId,
    );
  }

  deleteEntrySlideOver.value?.close();
}

function cancelDeleteEntry() {
  deleteEntrySlideOver.value?.close();
}

fetchData();
</script>

<style lang="scss" scoped>
.admin-faq-category-page {
  padding: 16px 24px;
}

.admin-faq-category-page__header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  gap: 8px;
}

.admin-faq-category-page__title {
  flex: 1;
  color: variables.$text-primary-dark;
  font-size: 1.125rem;
  font-weight: 500;
}

.admin-faq-category-page__actions {
  display: flex;
  gap: 4px;
}

.admin-faq-category-page__action {
  padding: 4px 8px;
  border: none;
  background: none;
  color: variables.$text-secondary;
  cursor: pointer;
  font-size: 14px;
}

.admin-faq-category-page__action:hover {
  color: variables.$text-primary-dark;
}

.admin-faq-category-page__action--danger:hover {
  color: variables.$error-color;
}

.admin-faq-category-page__entries {
  border: 1px solid variables.$border-dark;
  border-radius: 8px;
  background: variables.$surface-dark-elevated;
}

.admin-faq-category-page__add-entry {
  display: block;
  width: 100%;
  padding: 10px 16px;
  border: none;
  border-bottom: 1px solid variables.$border-dark;
  margin: 0;
  background: none;
  color: variables.$main-color;
  cursor: pointer;
  font-size: 13px;
  text-align: left;
}

.admin-faq-category-page__add-entry:hover {
  background: rgb(255 255 255 / 5%);
}

.admin-faq-category-page__slide-over-title {
  color: variables.$text-primary-dark;
  font-size: 1.25rem;
  font-weight: 500;
}
</style>
