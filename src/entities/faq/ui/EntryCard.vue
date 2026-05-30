<template>
  <div
    class="entry-card"
    :class="{ 'entry-card--last': isLast }">
    <span class="entry-card__drag-handle drag-handle">⠷</span>
    <span class="entry-card__question">{{ entry.question }}</span>
    <button
      title="Изменить"
      class="entry-card__action"
      @click="emit('update')">
      <i class="pi pi-pencil"></i>
    </button>
    <button
      title="Удалить"
      class="entry-card__action entry-card__action--danger"
      @click="emit('delete')">
      <i class="pi pi-trash"></i>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { FaqEntryResponse } from '@/shared/types';

defineOptions({ name: 'EntryCard' });

const { entry, isLast } = defineProps<{
  entry: FaqEntryResponse;
  isLast?: boolean;
}>();

const emit = defineEmits<{
  update: [];
  delete: [];
}>();
</script>

<style lang="scss" scoped>
.entry-card {
  display: flex;
  align-items: center;
  padding: 10px 16px 10px 32px;
  border-bottom: 1px solid rgba(variables.$border-dark, 0.5);
  gap: 8px;
}

.entry-card--last {
  border-bottom: none;
}

.entry-card__drag-handle {
  color: variables.$text-secondary;
  cursor: grab;
  font-size: 10px;
}

.entry-card__question {
  overflow: hidden;
  flex: 1;
  color: variables.$text-primary-dark;
  font-size: 13px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.entry-card__action {
  padding: 4px;
  border: none;
  background: none;
  color: variables.$text-secondary;
  cursor: pointer;
  font-size: 12px;
}

.entry-card__action:hover {
  color: variables.$text-primary-dark;
}

.entry-card__action--danger:hover {
  color: variables.$error-color;
}

.vuedraggable-drag > .entry-card {
  transform: rotate(2deg);
}

.vuedraggable-ghost > .entry-card {
  opacity: 0.5;
}
</style>
