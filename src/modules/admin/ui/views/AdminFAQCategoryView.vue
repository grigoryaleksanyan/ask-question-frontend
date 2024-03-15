<template>
  <div v-if="category">
    <v-row>
      <v-col cols="12">
        <v-row>
          <v-col
            cols="12"
            class="d-flex align-center">
            <h1 class="text-h6 text-sm-h5 mr-4">Категория: {{ category.name }}</h1>

            <v-btn
              title="Изменить"
              class="mr-2"
              icon
              size="small"
              @click="showUpdateCategory = true">
              <v-icon>mdi-pencil-outline</v-icon>
            </v-btn>

            <v-btn
              title="Удалить"
              icon
              size="small"
              @click="showDeleteCategory = true">
              <v-icon>mdi-delete-outline</v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-btn
              size="small"
              color="blue-grey"
              class="text-white"
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
        <v-row>
          <Draggable
            v-model="draggableEntries"
            v-bind="dragOptions"
            class="col-12 pa-0"
            handle=".handle"
            draggable=".draggable"
            drag-class="vuedraggable-drag"
            ghost-class="vuedraggable-ghost">
            <v-col
              v-for="entry in category.entries"
              :key="entry.id"
              cols="12"
              class="draggable">
              <EntryCard
                :entry="entry"
                @copy-link="copyLink(entry)"
                @update="showUpdateEntryModal(entry)"
                @delete="clickDeleteEntryBtn(entry)" />
            </v-col>
          </Draggable>
        </v-row>
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

    <SidebarModal ref="create-entry-modal">
      <template #default="{ confirm, close }">
        <CreateEntryContent
          :modal-confirm="confirm"
          :modal-close="close"
          :category-id="category.id"
          :order="category.entries.length" />
      </template>
    </SidebarModal>

    <SidebarModal ref="update-entry-modal">
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
      <DeleteEntry
        v-if="showDeleteEntry"
        :id="currentEntry.id"
        :is-open="showDeleteEntry"
        @success="successDeleteEntry"
        @cancel="showDeleteEntry = false" />
    </CenterModal>
  </div>
</template>

<script>
import Draggable from 'vuedraggable';
import { mapMutations } from 'vuex';

import ALERT_TYPES from '@/modules/alert/constants/alert-types';

import { GetById } from '@/modules/faq/repositories/faq-category-repository';
import { SetOrder } from '@/modules/faq/repositories/faq-entry-repository';

import copyToClipboard from '../../helpers/copy-to-clipboard';

import UpdateCategory from '../components/FAQ/center-modal-content/UpdateCategory.vue';
import DeleteCategory from '../components/FAQ/center-modal-content/DeleteCategory.vue';

import EntryCard from '../components/FAQ/EntryCard.vue';

import CreateEntryContent from '../components/FAQ/sidebar-content/CreateEntryContent.vue';
import UpdateEntryContent from '../components/FAQ/sidebar-content/UpdateEntryContent.vue';
import DeleteEntry from '../components/FAQ/center-modal-content/DeleteEntry.vue';

export default {
  name: 'AdminFAQCategoryView',

  components: {
    Draggable,
    UpdateCategory,
    DeleteCategory,
    EntryCard,
    CreateEntryContent,
    UpdateEntryContent,
    DeleteEntry,
  },

  props: {
    id: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      category: null,
      currentEntry: null,

      showUpdateCategory: false,
      showDeleteCategory: false,

      showDeleteEntry: false,

      dragOptions: {
        animation: 150,
        group: 'entries',
        disabled: false,
        forceFallback: true,
      },
    };
  },

  computed: {
    draggableEntries: {
      get() {
        return this.category.entries;
      },

      async set(newOrderEntries) {
        const oldOrderEntries = [...this.category.entries];

        this.category.entries = newOrderEntries;

        try {
          this.ADD_LOADER();
          const entryIds = newOrderEntries.map((entry) => entry.id);
          await SetOrder(entryIds);
          this.ADD_ALERT({ type: ALERT_TYPES.SUCCESS, text: 'Сортировка применена' });
        } catch (error) {
          this.category.entries = oldOrderEntries;
          this.ADD_ALERT({ type: ALERT_TYPES.ERROR, text: error.message });
        } finally {
          this.REMOVE_LOADER();
        }
      },
    },
  },

  created() {
    this.fetchData();
  },

  methods: {
    ...mapMutations('alert', ['ADD_ALERT']),
    ...mapMutations('preloader', ['ADD_LOADER', 'REMOVE_LOADER']),

    async fetchData() {
      try {
        this.ADD_LOADER();
        this.category = await GetById(this.id);
      } catch (error) {
        this.ADD_ALERT({ type: ALERT_TYPES.ERROR, text: error.message });
      } finally {
        this.REMOVE_LOADER();
      }
    },

    async showCreateEntryModal() {
      const result = await this.$refs['create-entry-modal'].open();

      if (result.status) {
        const entry = result.data;
        this.category.entries.push(entry);
      }
    },

    async showUpdateEntryModal(currentEntry) {
      this.currentEntry = currentEntry;

      const result = await this.$refs['update-entry-modal'].open();

      if (result.status) {
        const modifiedEntry = result.data;

        this.category.entries = this.category.entries.map((entry) =>
          entry.id === modifiedEntry.id ? modifiedEntry : entry,
        );
      }
    },

    successUpdateCategory(name) {
      this.category.name = name;

      this.showUpdateCategory = false;
    },

    successDeleteCategory() {
      this.showDeleteCategory = false;

      this.$router.push({ name: 'admin-faq' });
    },

    copyLink(entry) {
      const link = `${window.location.protocol}//${window.location.host}/faq?id=${entry.id}`;

      copyToClipboard(link)
        .then(() => {
          this.ADD_ALERT({ type: ALERT_TYPES.SUCCESS, text: 'Ссылка скопирована в буфер обмена' });
        })
        .catch((error) => {
          this.ADD_ALERT({ type: ALERT_TYPES.ERROR, text: error.message });
        });
    },

    clickDeleteEntryBtn(entry) {
      this.currentEntry = entry;
      this.showDeleteEntry = true;
    },

    successDeleteEntry(id) {
      this.category.entries = this.category.entries.filter((entry) => entry.id !== id);
      this.showDeleteEntry = false;
    },
  },
};
</script>
