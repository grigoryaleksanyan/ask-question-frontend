<template>
  <Card class="entry-card">
    <template #title>
      <div class="flex text-body-large">
        <div class="col-12 self-center">
          <span class="entry-card__title">{{ entry.question }}</span>
        </div>
        <div class="col-12 sm:col-6 flex justify-start sm:justify-end"></div>
      </div>
    </template>
    <template #content>
      <div class="flex">
        <div class="entry-card__answer p-3">
          <div v-html="entry.answer"></div>
        </div>
      </div>
    </template>
    <template #footer>
      <Divider />
      <div class="flex items-center py-1">
        <div class="m-0">
          <span class="text-body-small">
            Создана: {{ new Date(entry.created).toLocaleDateString() }}
          </span>
        </div>
        <div class="flex justify-end items-center ml-auto">
          <Button
            title="Переместить"
            class="handle"
            icon="pi pi-arrows"
            severity="secondary"
            text
            rounded
            size="small" />

          <Button
            title="Скопировать ссылку на запись"
            icon="pi pi-link"
            severity="secondary"
            text
            rounded
            size="small"
            @click="emit('copy-link')" />

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
    </template>
  </Card>
</template>

<script setup lang="ts">
import type { FaqEntryResponse } from '@/shared/types';

import Card from 'primevue/card';
import Button from 'primevue/button';
import Divider from 'primevue/divider';

defineOptions({ name: 'EntryCard' });

const { entry } = defineProps<{
  entry: FaqEntryResponse;
}>();

const emit = defineEmits<{
  'copy-link': [];
  update: [];
  delete: [];
}>();
</script>

<style lang="scss" scoped>
.entry-card {
  position: relative;
  background-color: variables.$card-bg;
  transition: box-shadow 0.2s ease;
}

.entry-card:hover {
  box-shadow: 0 2px 12px rgb(0 0 0 / 8%);
}

.entry-card__title {
  overflow-wrap: break-word;
}

.entry-card__answer {
  width: 100%;
  max-height: 200px;
  border-radius: 4px;
  background-color: variables.$card-content-bg;
  overflow-y: scroll;
}

.vuedraggable-drag > .entry-card {
  transform: rotate(2deg);
}

.vuedraggable-ghost > .entry-card::after {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(230 230 230);
  content: '';
}
</style>
