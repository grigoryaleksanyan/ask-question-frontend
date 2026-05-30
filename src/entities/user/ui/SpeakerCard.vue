<template>
  <div class="speaker-card p-3 border-round-lg">
    <div class="flex items-center">
      <div class="px-2">
        <div class="text-body-large font-medium">
          {{ speaker.lastName }} {{ speaker.firstName
          }}{{ speaker.patronymic ? ' ' + speaker.patronymic : '' }}
        </div>
        <div
          v-if="speaker.position"
          class="text-body-small speaker-card__muted">
          {{ speaker.position }}
        </div>
        <div class="text-body-small speaker-card__muted">
          {{ speaker.email }}
        </div>
      </div>

      <div class="flex justify-end items-center ml-auto">
        <Divider
          layout="vertical"
          class="mr-3" />

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
import type { SpeakerResponse } from '@/shared/types';

import Button from 'primevue/button';
import Divider from 'primevue/divider';

defineOptions({ name: 'SpeakerCard' });

const { speaker } = defineProps<{
  speaker: SpeakerResponse;
}>();

const emit = defineEmits<{
  update: [];
  delete: [];
}>();
</script>

<style lang="scss" scoped>
.speaker-card {
  position: relative;
  background-color: variables.$card-bg;
  transition: box-shadow 0.2s ease;
}

.speaker-card:hover {
  box-shadow: 0 2px 12px rgb(0 0 0 / 8%);
}

.speaker-card__muted {
  opacity: 0.6;
}
</style>
