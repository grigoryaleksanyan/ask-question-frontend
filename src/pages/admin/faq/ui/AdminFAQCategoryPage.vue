<template>
  <div>
    <div v-if="category">
      <v-row>
        <v-col cols="12">
          <v-row>
            <v-col
              cols="12"
              class="d-flex align-center">
              <h1 class="text-headline-small text-sm-headline-medium mr-4">
                Категория: {{ category.name }}
              </h1>

              <v-btn
                title="Изменить"
                icon
                variant="flat"
                size="x-small"
                @click="showUpdateCategory = true">
                <v-icon size="20">mdi-pencil-outline</v-icon>
              </v-btn>

              <v-btn
                title="Удалить"
                icon
                variant="flat"
                size="x-small"
                @click="showDeleteCategory = true">
                <v-icon size="20">mdi-delete-outline</v-icon>
              </v-btn>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-btn
                size="small"
                color="blue-grey"
                @click="showCreateEntryModal">
                Добавить запись
                <v-icon
                  end
                  theme="dark">
                  mdi-plus
                </v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <Draggable
            v-model="draggableEntries"
            v-bind="dragOptions"
            class="v-row"
            item-key="id"
            handle=".handle"
            draggable=".draggable"
            drag-class="vuedraggable-drag"
            ghost-class="vuedraggable-ghost">
            <template #item="{ element }">
              <v-col
                cols="12"
                class="draggable">
                <EntryCard
                  :entry="element"
                  @copy-link="copyLink(element)"
                  @update="showUpdateEntryModal(element)"
                  @delete="clickDeleteEntryBtn(element)" />
              </v-col>
            </template>
          </Draggable>
        </v-col>
      </v-row>

      <CenterModal
        title="Изменить категорию "
        :is-open="showUpdateCategory"
        @close="showUpdateCategory = false">
        <UpdateCategory
          v-if="showUpdateCategory"
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
          v-if="showDeleteCategory"
          :id="id"
          :is-open="showDeleteCategory"
          @success="successDeleteCategory"
          @cancel="showDeleteCategory = false" />
      </CenterModal>

      <SidebarModal ref="createEntryModal">
        <template #default="{ confirm, close }">
          <CreateEntryContent
            :modal-confirm="confirm"
            :modal-close="close"
            :category-id="category.id"
            :order="category.entries.length" />
        </template>
      </SidebarModal>

      <SidebarModal ref="updateEntryModal">
        <template #default="{ confirm, close }">
          <UpdateEntryContent
            :modal-confirm="confirm"
            :modal-close="close"
            :entry="currentEntry" />
        </template>
      </SidebarModal>

      <CenterModal
        title="Удалить запись "
        :is-open="showDeleteEntry"
        @close="showDeleteEntry = false">
        <DeleteEntryModal
          v-if="showDeleteEntry"
          :id="currentEntry.id"
          :is-open="showDeleteEntry"
          @success="successDeleteEntry"
          @cancel="showDeleteEntry = false" />
      </CenterModal>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, useTemplateRef } from 'vue';
import { useRouter } from 'vue-router';
import Draggable from 'vuedraggable';

import { ALERT_TYPES } from '@/shared/config';

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

import { copyToClipboard } from '@/shared/lib';
import { useAlertStore } from '@/entities/alert';
import { usePreloaderStore } from '@/features/preloader';

defineOptions({ name: 'AdminFAQCategoryPage' });

const { id } = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const router = useRouter();
const alertStore = useAlertStore();
const preloaderStore = usePreloaderStore();

const category = ref(null);
const currentEntry = ref(null);

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

const draggableEntries = computed({
  get() {
    return category.value.entries;
  },

  async set(newOrderEntries) {
    const oldOrderEntries = [...category.value.entries];

    category.value.entries = newOrderEntries;

    try {
      preloaderStore.addLoader();
      const entryIds = newOrderEntries.map((entry) => entry.id);
      await SetEntryOrder(entryIds);
      alertStore.addAlert({
        type: ALERT_TYPES.SUCCESS,
        text: 'Сортировка применена',
      });
    } catch (error) {
      category.value.entries = oldOrderEntries;
      alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: error.message });
    } finally {
      preloaderStore.removeLoader();
    }
  },
});

async function fetchData() {
  try {
    preloaderStore.addLoader();
    category.value = await GetCategoryById(id);
  } catch (error) {
    alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: error.message });
  } finally {
    preloaderStore.removeLoader();
  }
}

async function showCreateEntryModal() {
  const result = await createEntryModal.value.open();

  if (result.status) {
    const entry = result.data;
    category.value.entries.push(entry);
  }
}

async function showUpdateEntryModal(entry) {
  currentEntry.value = entry;

  const result = await updateEntryModal.value.open();

  if (result.status) {
    const modifiedEntry = result.data;

    category.value.entries = category.value.entries.map((e) =>
      e.id === modifiedEntry.id ? modifiedEntry : e,
    );
  }
}

function successUpdateCategory(name) {
  category.value.name = name;

  showUpdateCategory.value = false;
}

function successDeleteCategory() {
  showDeleteCategory.value = false;

  router.push({ name: 'admin-faq' });
}

function copyLink(entry) {
  const link = `${window.location.protocol}//${window.location.host}/faq?id=${entry.id}`;

  copyToClipboard(link)
    .then(() => {
      alertStore.addAlert({
        type: ALERT_TYPES.SUCCESS,
        text: 'Ссылка скопирована в буфер обмена',
      });
    })
    .catch((error) => {
      alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: error.message });
    });
}

function clickDeleteEntryBtn(entry) {
  currentEntry.value = entry;
  showDeleteEntry.value = true;
}

function successDeleteEntry(entryId) {
  category.value.entries = category.value.entries.filter(
    (e) => e.id !== entryId,
  );
  showDeleteEntry.value = false;
}

fetchData();
</script>
