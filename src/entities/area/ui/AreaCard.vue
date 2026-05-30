<template>
  <div class="area-card p-3 border-round-lg">
    <div class="flex items-center">
      <div class="px-2">
        <span>{{ area.title }}</span>
      </div>

      <div class="flex justify-end items-center ml-auto">
        <Divider
          layout="vertical"
          class="mr-3" />

        <Button
          title="Переместить"
          class="handle"
          icon="pi pi-arrows-alt"
          severity="secondary"
          text
          rounded
          size="small" />

        <Button
          title="Изменить"
          icon="pi pi-pencil"
          severity="secondary"
          text
          rounded
          size="small"
          @click="emit('update')" />

        <Button
          title="Удалить"
          icon="pi pi-trash"
          severity="secondary"
          text
          rounded
          size="small"
          @click="emit('delete')" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AreaResponse } from '@/shared/types';

import Button from 'primevue/button';
import Divider from 'primevue/divider';

defineOptions({ name: 'AreaCard' });

const { area } = defineProps<{
  area: AreaResponse;
}>();

const emit = defineEmits<{
  update: [];
  delete: [];
}>();
</script>

<style lang="scss" scoped>
.area-card {
  position: relative;
  background-color: variables.$card-bg;
  transition: box-shadow 0.2s ease;
}

.area-card:hover {
  box-shadow: 0 2px 12px rgb(0 0 0 / 8%);
}

.vuedraggable-drag > .area-card {
  transform: rotate(2deg);
}

.vuedraggable-ghost > .area-card::after {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  background-color: rgb(230 230 230);
  content: '';
}
</style>
