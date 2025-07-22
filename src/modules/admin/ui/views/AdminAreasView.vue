<template>
  <v-container
    style="max-width: 1200px"
    class="text-left pa-5 mx-auto"
    fluid>
    <v-row>
      <v-col cols="12">
        <v-row>
          <v-col
            cols="12"
            class="d-flex align-center">
            <h1 class="text-h6 text-sm-h5 mr-4">Области</h1>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-btn
              size="small"
              color="blue-grey"
              @click="showCreateArea = true">
              Добавить область
              <v-icon
                end
                theme="dark">
                mdi-plus
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <Draggable
          v-model="draggableAreas"
          v-bind="dragOptions"
          class="v-row"
          item-key="id"
          handle=".handle"
          draggable=".draggable"
          drag-class="vuedraggable-drag"
          ghost-class="vuedraggable-ghost">
          <template #item="{ element }">
            <v-col
              :key="element.id"
              cols="12"
              class="draggable">
              <AreaCard
                :area="element"
                @update="clickUpdateAreaBtn(element)"
                @delete="clickDeleteAreaBtn(element)" />
            </v-col>
          </template>
        </Draggable>
      </v-col>
    </v-row>

    <CenterModal
      title="Создать область"
      :is-open="showCreateArea"
      @close="showCreateArea = false">
      <CreateArea
        :order="areas.length"
        :is-open="showCreateArea"
        @success="successCreateArea"
        @cancel="showCreateArea = false" />
    </CenterModal>

    <CenterModal
      title="Изменить область "
      :is-open="showUpdateArea"
      @close="showUpdateArea = false">
      <UpdateArea
        v-if="showUpdateArea"
        :area="currentArea"
        :is-open="showUpdateArea"
        @success="successUpdateArea"
        @cancel="showUpdateArea = false" />
    </CenterModal>

    <CenterModal
      title="Удалить запись "
      :is-open="showDeleteArea"
      @close="showDeleteArea = false">
      <DeleteArea
        v-if="showDeleteArea"
        :id="currentArea.id"
        :is-open="showDeleteArea"
        @success="successDeleteArea"
        @cancel="showDeleteArea = false" />
    </CenterModal>
  </v-container>
</template>

<script>
import Draggable from 'vuedraggable';
import { mapMutations } from 'vuex';

import ALERT_TYPES from '@/modules/alert/constants/alert-types';

import {
  GetAll,
  SetOrder,
} from '@/modules/shared/repositories/areas-repository';

import AreaCard from '../components/area/AreaCard.vue';
import CreateArea from '../components/area/center-modal-content/CreateArea.vue';
import UpdateArea from '../components/area/center-modal-content/UpdateArea.vue';
import DeleteArea from '../components/area/center-modal-content/DeleteArea.vue';

export default {
  name: 'AdminAreasView',

  components: {
    Draggable,
    AreaCard,
    CreateArea,
    UpdateArea,
    DeleteArea,
  },

  data() {
    return {
      areas: [],

      currentArea: null,

      showCreateArea: false,
      showUpdateArea: false,
      showDeleteArea: false,

      dragOptions: {
        animation: 150,
        group: 'areas',
        disabled: false,
        forceFallback: true,
      },
    };
  },

  computed: {
    draggableAreas: {
      get() {
        return this.areas;
      },

      async set(newOrderAreas) {
        const oldOrderAreas = [...this.areas];

        this.areas = newOrderAreas;

        try {
          this.ADD_LOADER();
          const areaIds = newOrderAreas.map((area) => area.id);
          await SetOrder(areaIds);
          this.ADD_ALERT({
            type: ALERT_TYPES.SUCCESS,
            text: 'Сортировка применена',
          });
        } catch (error) {
          this.areas = oldOrderAreas;
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
        this.areas = await GetAll();
      } catch (error) {
        this.ADD_ALERT({ type: ALERT_TYPES.ERROR, text: error.message });
      } finally {
        this.REMOVE_LOADER();
      }
    },

    successCreateArea(area) {
      this.areas = [...this.areas, area];
      this.showCreateArea = false;
    },

    clickUpdateAreaBtn(area) {
      this.currentArea = area;
      this.showUpdateArea = true;
    },

    successUpdateArea(modifiedArea) {
      this.areas = this.areas.map((area) =>
        area.id === modifiedArea.id ? modifiedArea : area,
      );

      this.showUpdateArea = false;
    },

    clickDeleteAreaBtn(area) {
      this.currentArea = area;
      this.showDeleteArea = true;
    },

    successDeleteArea(id) {
      this.areas = this.areas.filter((area) => area.id !== id);
      this.showDeleteArea = false;
    },
  },
};
</script>
