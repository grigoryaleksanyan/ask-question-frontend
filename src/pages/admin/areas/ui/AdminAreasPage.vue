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

<script setup>
import { ref, computed, reactive } from 'vue';
import Draggable from 'vuedraggable';

import { ALERT_TYPES } from '@/shared/config';

import {
  GetAllAreas,
  SetAreaOrder,
  AreaCard,
  CreateArea,
  UpdateArea,
  DeleteArea,
} from '@/entities/area';
import { useAlertStore } from '@/entities/alert';
import { usePreloaderStore } from '@/features/preloader';

defineOptions({ name: 'AdminAreasPage' });

const alertStore = useAlertStore();
const preloaderStore = usePreloaderStore();

const areas = ref([]);
const currentArea = ref(null);

const showCreateArea = ref(false);
const showUpdateArea = ref(false);
const showDeleteArea = ref(false);

const dragOptions = reactive({
  animation: 150,
  group: 'areas',
  disabled: false,
  forceFallback: true,
});

const draggableAreas = computed({
  get() {
    return areas.value;
  },

  async set(newOrderAreas) {
    const oldOrderAreas = [...areas.value];

    areas.value = newOrderAreas;

    try {
      preloaderStore.addLoader();
      const areaIds = newOrderAreas.map((area) => area.id);
      await SetAreaOrder(areaIds);
      alertStore.addAlert({
        type: ALERT_TYPES.SUCCESS,
        text: 'Сортировка применена',
      });
    } catch (error) {
      areas.value = oldOrderAreas;
      alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: error.message });
    } finally {
      preloaderStore.removeLoader();
    }
  },
});

async function fetchData() {
  try {
    preloaderStore.addLoader();
    areas.value = await GetAllAreas();
  } catch (error) {
    alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: error.message });
  } finally {
    preloaderStore.removeLoader();
  }
}

function successCreateArea(area) {
  areas.value = [...areas.value, area];
  showCreateArea.value = false;
}

function clickUpdateAreaBtn(area) {
  currentArea.value = area;
  showUpdateArea.value = true;
}

function successUpdateArea(modifiedArea) {
  areas.value = areas.value.map((area) =>
    area.id === modifiedArea.id ? modifiedArea : area,
  );

  showUpdateArea.value = false;
}

function clickDeleteAreaBtn(area) {
  currentArea.value = area;
  showDeleteArea.value = true;
}

function successDeleteArea(areaId) {
  areas.value = areas.value.filter((area) => area.id !== areaId);
  showDeleteArea.value = false;
}

fetchData();
</script>
