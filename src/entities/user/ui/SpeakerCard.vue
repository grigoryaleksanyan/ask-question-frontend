<template>
  <div
    class="speaker-card"
    :class="{ 'speaker-card--deleted': isDeleted }">
    <SpeakerAvatar
      :first-name="speaker.firstName"
      :last-name="speaker.lastName" />

    <div class="speaker-card__info">
      <span
        class="speaker-card__name"
        :class="{ 'speaker-card__name--deleted': isDeleted }">
        {{ speaker.lastName }} {{ speaker.firstName
        }}{{ speaker.patronymic ? ' ' + speaker.patronymic : '' }}
      </span>

      <span
        v-if="isDeleted"
        class="speaker-card__deleted-label">
        Удалён
      </span>

      <span class="speaker-card__meta">
        <template v-if="speaker.position">{{ speaker.position }} · </template
        >{{ speaker.email }}
      </span>
    </div>

    <ContextMenuButton :items="menuItems" />
  </div>
</template>

<script setup lang="ts">
import type { MenuItem } from 'primevue/menuitem';

import type { SpeakerResponse } from '@/shared/types';

import { ContextMenuButton } from '@/shared/ui/context-menu';

import SpeakerAvatar from './SpeakerAvatar.vue';

defineOptions({ name: 'SpeakerCard' });

const { speaker, isDeleted } = defineProps<{
  speaker: SpeakerResponse;
  isDeleted?: boolean;
}>();

const emit = defineEmits<{
  update: [];
  delete: [];
}>();

const menuItems: MenuItem[] = [
  {
    label: 'Изменить',
    icon: 'pi pi-pencil',
    command: () => emit('update'),
  },
  {
    label: 'Удалить',
    icon: 'pi pi-trash',
    command: () => emit('delete'),
  },
];
</script>

<style lang="scss" scoped>
.speaker-card {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  border: 1px solid variables.$border-dark;
  border-radius: 8px;
  background: variables.$surface-dark-elevated;
  gap: 12px;
}

.speaker-card--deleted {
  opacity: 0.5;
}

.speaker-card__info {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px 8px;
}

.speaker-card__name {
  color: variables.$text-primary-dark;
  font-size: 15px;
  font-weight: 500;
}

.speaker-card__name--deleted {
  text-decoration: line-through;
}

.speaker-card__deleted-label {
  color: variables.$warning-color;
  font-size: 11px;
  font-weight: 500;
}

.speaker-card__meta {
  width: 100%;
  margin-top: 2px;
  color: variables.$text-secondary;
  font-size: 13px;
}
</style>
