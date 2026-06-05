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

    <SlideOver ref="create-area-modal">
      <template #header>
        <span class="typography__headline--medium">Создать область</span>
      </template>
      <template #default>
        <CreateArea
          ref="create-area"
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
          @click="createAreaModal?.close()" />
      </template>
    </SlideOver>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, useTemplateRef } from 'vue';
import Draggable from 'vuedraggable';

import type { AreaResponse } from '@/shared/dto';

import Button from 'primevue/button';

import { useApiCall, useDeleteConfirmDialog } from '@/shared/lib';

import {
  GetAllAreas,
  SetAreaOrder,
  AreaCard,
  CreateArea,
  DeleteAreaApi,
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

const createAreaModal = useTemplateRef('create-area-modal');
const createAreaRef = useTemplateRef('create-area');

const { confirmDelete: confirmDeleteArea } = useDeleteConfirmDialog({
  apiFn: DeleteAreaApi,
  message: 'Вы действительно хотите удалить область?',
  header: 'Удалить область',
  successMessage: 'Область успешно удалена',
});

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
  createAreaModal.value?.confirm();
}

function successUpdateArea(modifiedArea: AreaResponse) {
  areas.value = areas.value.map((area) =>
    area.id === modifiedArea.id ? modifiedArea : area,
  );
}

async function clickDeleteAreaBtn(area: AreaResponse) {
  const ok = await confirmDeleteArea(area.id);
  if (ok) {
    areas.value = areas.value.filter((a) => a.id !== area.id);
  }
}

fetchData();
</script>

<style lang="scss" scoped>
.admin-areas {
  padding: 24px;
  color: variables.$text-primary-dark;
}

.admin-areas__actions {
  margin-bottom: 16px;
}

.admin-areas__list {
  display: flex;
  flex-wrap: wrap;
  border-radius: 10px;
  gap: 8px;
}
</style>
