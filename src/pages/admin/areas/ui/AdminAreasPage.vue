<template>
  <div
    style="max-width: 1200px"
    class="text-left p-5 mx-auto">
    <div class="grid">
      <div class="col-12">
        <div class="grid">
          <div class="col-12 flex align-items-center">
            <h1
              class="typography__headline--small typography__headline--medium--sm mr-4">
              Области
            </h1>
          </div>
        </div>

        <div class="grid">
          <div class="col-12">
            <Button
              size="small"
              severity="secondary"
              @click="showCreateArea = true">
              Добавить область
              <i class="pi pi-plus ml-2"></i>
            </Button>
          </div>
        </div>

        <Draggable
          v-model="draggableAreas"
          v-bind="dragOptions"
          class="grid"
          item-key="id"
          handle=".handle"
          draggable=".draggable"
          drag-class="vuedraggable-drag"
          ghost-class="vuedraggable-ghost">
          <template #item="{ element }">
            <div
              :key="element.id"
              class="col-12 draggable">
              <AreaCard
                :area="element"
                @update="clickUpdateAreaBtn(element)"
                @delete="clickDeleteAreaBtn(element)" />
            </div>
          </template>
        </Draggable>
      </div>
    </div>

    <CenterModal
      title="Создать область"
      :is-open="showCreateArea"
      @close="showCreateArea = false">
      <CreateArea
        ref="create-area"
        :order="areas.length"
        :is-open="showCreateArea"
        @success="successCreateArea"
        @cancel="showCreateArea = false" />
      <template #footer>
        <Button
          label="Создать"
          @click="createAreaRef?.submitForm()" />
        <Button
          label="Отмена"
          outlined
          severity="secondary"
          @click="createAreaRef?.cancel()" />
      </template>
    </CenterModal>

    <CenterModal
      title="Изменить область "
      :is-open="showUpdateArea"
      @close="showUpdateArea = false">
      <UpdateArea
        v-if="showUpdateArea && currentArea"
        ref="update-area"
        :area="currentArea"
        :is-open="showUpdateArea"
        @success="successUpdateArea"
        @cancel="showUpdateArea = false" />
      <template #footer>
        <Button
          label="Изменить"
          @click="updateAreaRef?.submitForm()" />
        <Button
          label="Отмена"
          outlined
          severity="secondary"
          @click="updateAreaRef?.cancel()" />
      </template>
    </CenterModal>

    <CenterModal
      title="Удалить запись "
      :is-open="showDeleteArea"
      @close="showDeleteArea = false">
      <DeleteArea
        v-if="showDeleteArea && currentArea"
        :id="currentArea.id"
        ref="delete-area"
        :is-open="showDeleteArea"
        @success="successDeleteArea"
        @cancel="showDeleteArea = false" />
      <template #footer>
        <Button
          label="Удалить"
          severity="danger"
          @click="deleteAreaRef?.confirm()" />
        <Button
          label="Отмена"
          outlined
          severity="secondary"
          @click="deleteAreaRef?.cancel()" />
      </template>
    </CenterModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, useTemplateRef } from 'vue';
import Draggable from 'vuedraggable';

import type { AreaResponse } from '@/shared/types';

import Button from 'primevue/button';

import CenterModal from '@/shared/ui/center-modal/CenterModal.vue';

import { useApiCall } from '@/shared/lib';

import {
  GetAllAreas,
  SetAreaOrder,
  AreaCard,
  CreateArea,
  UpdateArea,
  DeleteArea,
} from '@/entities/area';

defineOptions({ name: 'AdminAreasPage' });

const areas = ref<AreaResponse[]>([]);
let oldOrderAreas: AreaResponse[] = [];
const { execute: executeSetOrder } = useApiCall(SetAreaOrder, {
  successMessage: 'Сортировка применена',
  onError: () => {
    areas.value = oldOrderAreas;
  },
});
const { execute: executeFetch } = useApiCall(GetAllAreas);
const currentArea = ref<AreaResponse | null>(null);

const showCreateArea = ref(false);
const showUpdateArea = ref(false);
const showDeleteArea = ref(false);

const createAreaRef = useTemplateRef('create-area');
const updateAreaRef = useTemplateRef('update-area');
const deleteAreaRef = useTemplateRef('delete-area');

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

  async set(newOrderAreas: AreaResponse[]) {
    oldOrderAreas = [...areas.value];
    areas.value = newOrderAreas;
    const areaIds = newOrderAreas.map((area: AreaResponse) => area.id);
    await executeSetOrder(areaIds);
  },
});

async function fetchData() {
  const result = await executeFetch();
  if (result) {
    areas.value = result;
  }
}

function successCreateArea(area: AreaResponse) {
  areas.value = [...areas.value, area];
  showCreateArea.value = false;
}

function clickUpdateAreaBtn(area: AreaResponse) {
  currentArea.value = area;
  showUpdateArea.value = true;
}

function successUpdateArea(modifiedArea: AreaResponse) {
  areas.value = areas.value.map((area) =>
    area.id === modifiedArea.id ? modifiedArea : area,
  );

  showUpdateArea.value = false;
}

function clickDeleteAreaBtn(area: AreaResponse) {
  currentArea.value = area;
  showDeleteArea.value = true;
}

function successDeleteArea(areaId: string) {
  areas.value = areas.value.filter((area) => area.id !== areaId);
  showDeleteArea.value = false;
}

fetchData();
</script>
