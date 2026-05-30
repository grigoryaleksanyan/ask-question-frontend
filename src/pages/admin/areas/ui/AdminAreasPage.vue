<template>
  <div class="admin-areas">
    <div class="admin-areas__actions">
      <Button
        label="+ Добавить"
        size="small"
        @click="showCreateAreaModal" />
    </div>

    <Draggable
      v-model="draggableAreas"
      v-bind="dragOptions"
      class="admin-areas__list"
      item-key="id"
      handle=".handle"
      draggable=".draggable"
      drag-class="vuedraggable-drag"
      ghost-class="vuedraggable-ghost">
      <template #item="{ element }">
        <div
          :key="element.id"
          class="draggable">
          <AreaCard
            :area="element"
            @updated="successUpdateArea"
            @delete="clickDeleteAreaBtn(element)" />
        </div>
      </template>
    </Draggable>

    <SidebarModal ref="create-area-modal">
      <template #header>Создать область</template>
      <template #default="{ confirm, close }">
        <CreateArea
          ref="create-area"
          :modal-confirm="confirm"
          :modal-close="close"
          :order="areas.length"
          @success="successCreateArea" />
      </template>
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
    </SidebarModal>

    <CenterModal
      title="Удалить запись"
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
const showDeleteArea = ref(false);

const createAreaModal = useTemplateRef('create-area-modal');
const createAreaRef = useTemplateRef('create-area');
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

async function showCreateAreaModal() {
  await createAreaModal.value?.open();
}

function successCreateArea(area: AreaResponse) {
  areas.value = [...areas.value, area];
}

function successUpdateArea(modifiedArea: AreaResponse) {
  areas.value = areas.value.map((area) =>
    area.id === modifiedArea.id ? modifiedArea : area,
  );
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

<style lang="scss" scoped>
.admin-areas {
  max-width: 1200px;
  padding: 16px 24px;
  margin: 0 auto;
  text-align: left;
}

.admin-areas__actions {
  margin-bottom: 16px;
}

.admin-areas__list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
