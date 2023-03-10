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
              small
              @click="showUpdateCategory = true">
              <v-icon>mdi-pencil-outline</v-icon>
            </v-btn>

            <v-btn
              title="Удалить"
              icon
              small
              @click="showDeleteCategory = true">
              <v-icon>mdi-delete-outline</v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-btn
              color="blue-grey"
              class="white--text"
              @click="showCreateEntry = true">
              Добавить запись
              <v-icon
                right
                dark>
                mdi-note-plus-outline
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
                @update="clickUpdateEntryBtn(entry)"
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

    <SidebarModal
      title="Создать запись в FAQ"
      :is-open="showCreateEntry"
      @close="showCreateEntry = false">
      <CreateEntryContent
        v-if="showCreateEntry"
        :category-id="category.id"
        :order="category.entries.length"
        @success="successCreateEntry"
        @cancel="showCreateEntry = false" />
    </SidebarModal>

    <SidebarModal
      title="Изменить запись в FAQ"
      :is-open="showUpdateEntry"
      @close="showUpdateEntry = false">
      <UpdateEntryContent
        v-if="showUpdateEntry"
        :entry="currentEntry"
        @success="successUpdateEntry"
        @cancel="showUpdateEntry = false" />
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

      showCreateEntry: false,

      showUpdateEntry: false,
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

    successUpdateCategory(name) {
      this.category.name = name;

      this.showUpdateCategory = false;
    },

    successDeleteCategory() {
      this.showDeleteCategory = false;

      this.$router.push({ name: 'admin-faq' });
    },

    successCreateEntry(entry) {
      this.category.entries = [...this.category.entries, entry];
      this.showCreateEntry = false;
    },

    clickUpdateEntryBtn(entry) {
      this.currentEntry = entry;
      this.showUpdateEntry = true;
    },

    successUpdateEntry(modifiedEntry) {
      this.category.entries = this.category.entries.map((entry) =>
        entry.id === modifiedEntry.id ? modifiedEntry : entry,
      );

      this.showUpdateEntry = false;
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
