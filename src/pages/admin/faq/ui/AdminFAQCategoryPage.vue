<template>
  <div>
    <div v-if="category">
      <div class="grid">
        <div class="col-12">
          <div class="grid">
            <div class="col-12 flex align-items-center">
              <h1
                class="typography__headline--small typography__headline--medium--sm mr-4">
                Категория: {{ category.name }}
              </h1>

              <Button
                title="Изменить"
                icon="pi pi-pencil"
                text
                size="small"
                @click="showUpdateCategory = true" />

              <Button
                title="Удалить"
                icon="pi pi-trash"
                text
                size="small"
                severity="danger"
                @click="showDeleteCategory = true" />
            </div>
          </div>

          <div class="grid">
            <div class="col-12">
              <Button
                size="small"
                severity="secondary"
                @click="showCreateEntryModal">
                Добавить запись
                <i class="pi pi-plus ml-2"></i>
              </Button>
            </div>
          </div>
          <Draggable
            v-model="draggableEntries"
            v-bind="dragOptions"
            class="grid"
            item-key="id"
            handle=".handle"
            draggable=".draggable"
            drag-class="vuedraggable-drag"
            ghost-class="vuedraggable-ghost">
            <template #item="{ element }">
              <div
                cols="12"
                class="col-12 draggable">
                <EntryCard
                  :entry="element"
                  @copy-link="copyLink(element)"
                  @update="showUpdateEntryModal(element)"
                  @delete="clickDeleteEntryBtn(element)" />
              </div>
            </template>
          </Draggable>
        </div>
      </div>

      <CenterModal
        title="Изменить категорию "
        :is-open="showUpdateCategory"
        @close="showUpdateCategory = false">
        <UpdateCategory
          v-if="showUpdateCategory"
          ref="update-category"
          :category="category"
          :is-open="showUpdateCategory"
          @success="successUpdateCategory"
          @cancel="showUpdateCategory = false" />
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
      </CenterModal>

      <CenterModal
        title="Удалить категорию "
        :is-open="showDeleteCategory"
        @close="showDeleteCategory = false">
        <DeleteCategory
          v-if="showDeleteCategory"
          :id="id"
          ref="delete-category"
          :is-open="showDeleteCategory"
          @success="successDeleteCategory"
          @cancel="showDeleteCategory = false" />
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
      </CenterModal>

      <SidebarModal ref="createEntryModal">
        <template #header>Создать запись в FAQ</template>
        <template #default="{ confirm, close }">
          <CreateEntryContent
            ref="create-entry-content"
            :modal-confirm="confirm"
            :modal-close="close"
            :category-id="category.id"
            :order="category.entries.length" />
        </template>
        <template #footer>
          <Button
            label="Создать"
            @click="createEntryContent?.submitForm()" />
          <Button
            label="Отмена"
            outlined
            severity="secondary"
            @click="createEntryContent?.modalClose()" />
        </template>
      </SidebarModal>

      <SidebarModal ref="updateEntryModal">
        <template #header>Изменить запись в FAQ</template>
        <template #default="{ confirm, close }">
          <UpdateEntryContent
            ref="update-entry-content"
            :modal-confirm="confirm"
            :modal-close="close"
            :entry="currentEntry!" />
        </template>
        <template #footer>
          <Button
            label="Изменить"
            @click="updateEntryContent?.submitForm()" />
          <Button
            label="Отмена"
            outlined
            severity="secondary"
            @click="updateEntryContent?.modalClose()" />
        </template>
      </SidebarModal>

      <CenterModal
        title="Удалить запись "
        :is-open="showDeleteEntry"
        @close="showDeleteEntry = false">
        <DeleteEntryModal
          v-if="showDeleteEntry && currentEntry"
          :id="currentEntry.id"
          ref="delete-entry"
          :is-open="showDeleteEntry"
          @success="successDeleteEntry"
          @cancel="showDeleteEntry = false" />
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
      </CenterModal>
    </div>
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

import CenterModal from '@/shared/ui/center-modal/CenterModal.vue';

import { useApiCall, copyToClipboard } from '@/shared/lib';
import { useToast } from 'primevue/usetoast';

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
const toast = useToast();
const currentEntry = ref<FaqEntryResponse | null>(null);

const showUpdateCategory = ref(false);
const showDeleteCategory = ref(false);
const showDeleteEntry = ref(false);

const dragOptions = reactive({
  animation: 150,
  group: 'entries',
  disabled: false,
  forceFallback: true,
});

const createEntryModal = useTemplateRef('createEntryModal');
const updateEntryModal = useTemplateRef('updateEntryModal');
const createEntryContent = useTemplateRef('create-entry-content');
const updateEntryContent = useTemplateRef('update-entry-content');
const updateCategoryRef = useTemplateRef('update-category');
const deleteCategoryRef = useTemplateRef('delete-category');
const deleteEntryRef = useTemplateRef('delete-entry');

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

async function showCreateEntryModal() {
  const result = await createEntryModal.value.open();

  if (result.status) {
    const entry = result.data as FaqEntryResponse;
    category.value?.entries.push(entry);
  }
}

async function showUpdateEntryModal(entry: FaqEntryResponse) {
  currentEntry.value = entry;

  const result = await updateEntryModal.value.open();

  if (result.status) {
    const modifiedEntry = result.data as FaqEntryResponse;

    if (category.value) {
      category.value.entries = category.value.entries.map(
        (e: FaqEntryResponse) =>
          e.id === modifiedEntry.id ? modifiedEntry : e,
      );
    }
  }
}

function successUpdateCategory(name: string) {
  if (category.value) {
    category.value.name = name;
  }

  showUpdateCategory.value = false;
}

function successDeleteCategory() {
  showDeleteCategory.value = false;

  router.push({ name: 'admin-faq' });
}

function copyLink(entry: FaqEntryResponse) {
  const link = `${window.location.protocol}//${window.location.host}/faq?id=${entry.id}`;

  copyToClipboard(link)
    .then(() => {
      toast.add({
        severity: 'success',
        detail: 'Ссылка скопирована в буфер обмена',
        group: 'api',
        life: 3000,
      });
    })
    .catch((error: unknown) => {
      const err = error as Error;
      toast.add({
        severity: 'error',
        detail: err.message,
        group: 'api',
        life: undefined,
      });
    });
}

function clickDeleteEntryBtn(entry: FaqEntryResponse) {
  currentEntry.value = entry;
  showDeleteEntry.value = true;
}

function successDeleteEntry(entryId: string) {
  if (category.value) {
    category.value.entries = category.value.entries.filter(
      (e: FaqEntryResponse) => e.id !== entryId,
    );
  }
  showDeleteEntry.value = false;
}

fetchData();
</script>
