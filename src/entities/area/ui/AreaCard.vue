<template>
  <div class="area-card">
    <span class="area-card__handle handle">⠷</span>

    <Inplace
      v-model:active="isEditing"
      closable
      @open="startEdit">
      <template #display>
        <span class="area-card__title">{{ area.title }}</span>
        <i
          class="pi pi-pencil area-card__edit"
          @click.stop="startEdit"></i>
      </template>
      <template #content="{ closeCallback }">
        <InputText
          ref="editInputRef"
          v-model="editTitle"
          class="area-card__input"
          @keydown.enter="saveEdit"
          @keydown.escape="cancelEdit" />
        <i
          class="pi pi-times area-card__cancel"
          @click="closeCallback"></i>
      </template>
    </Inplace>

    <i
      v-if="!isEditing"
      class="pi pi-trash area-card__delete"
      @click="emit('delete')"></i>
    <i
      v-else
      class="pi pi-save area-card__save"
      @click="saveEdit"></i>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  nextTick,
  watch,
  useTemplateRef,
  type ComponentPublicInstance,
} from 'vue';

import Inplace from 'primevue/inplace';
import InputText from 'primevue/inputtext';

import type { AreaResponse } from '@/shared/dto';

import { useApiCall } from '@/shared/lib';
import { Update } from '../api/areas-repository';

defineOptions({ name: 'AreaCard' });

const { area } = defineProps<{
  area: AreaResponse;
}>();

const emit = defineEmits<{
  updated: [area: AreaResponse];
  delete: [];
}>();

const isEditing = ref(false);
const editTitle = ref('');
const editInputRef = useTemplateRef<ComponentPublicInstance>('editInputRef');

const { execute: executeUpdate } = useApiCall(Update, {
  successMessage: 'Область изменена',
  showPreloader: false,
});

watch(isEditing, (newVal) => {
  if (!newVal) {
    editTitle.value = '';
  }
});

async function startEdit() {
  isEditing.value = true;
  editTitle.value = area.title;
  await nextTick();
  (editInputRef.value?.$el as HTMLInputElement | undefined)?.focus?.();
}

function cancelEdit() {
  isEditing.value = false;
  editTitle.value = '';
}

async function saveEdit() {
  if (!isEditing.value) return;

  const trimmed = editTitle.value.trim();
  if (!trimmed || trimmed === area.title) {
    cancelEdit();
    return;
  }

  const result = await executeUpdate({ id: area.id, title: trimmed });
  if (!isEditing.value) return; // user cancelled while saving
  if (result) {
    emit('updated', result);
    isEditing.value = false;
    editTitle.value = '';
  }
}
</script>

<style lang="scss" scoped>
.area-card {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border: 1px solid variables.$border-dark;
  border-radius: 10px;
  background: variables.$surface-dark-elevated;
  gap: 10px;
}

.area-card__handle {
  color: variables.$text-secondary;
  cursor: grab;
  font-size: 13px;
}

.area-card__title {
  margin-right: 12px;
  color: variables.$text-primary-dark;
  font-size: 15px;
}

.area-card__input {
  width: fit-content;
  border: 1px solid variables.$main-color;
  margin-right: 10px;
  background: transparent;
  color: variables.$text-primary-dark;
  font-size: 15px;
  outline: none;
}

.area-card__edit {
  color: variables.$text-secondary;
  cursor: pointer;
  font-size: 14px;
}

.area-card__delete {
  color: variables.$text-secondary;
  cursor: pointer;
  font-size: 14px;
}

.area-card__save {
  color: variables.$main-color;
  cursor: pointer;
  font-size: 14px;
}

.area-card__cancel {
  color: variables.$text-secondary;
  cursor: pointer;
  font-size: 14px;
}

.vuedraggable-drag > .area-card {
  transform: rotate(2deg);
}

.vuedraggable-ghost > .area-card {
  opacity: 0.4;
}
</style>
