<template>
  <v-sheet
    class="speaker-card pa-3 rounded-lg"
    color="#E8EAF6">
    <v-row
      class="align-center"
      no-gutters>
      <v-col class="px-2">
        <div class="text-body-large font-weight-medium">
          {{ speaker.lastName }} {{ speaker.firstName
          }}{{ speaker.patronymic ? ' ' + speaker.patronymic : '' }}
        </div>
        <div
          v-if="speaker.position"
          class="text-body-small text-medium-emphasis">
          {{ speaker.position }}
        </div>
        <div class="text-body-small text-medium-emphasis">
          {{ speaker.email }}
        </div>
      </v-col>

      <v-col class="d-flex justify-end align-center">
        <v-divider
          vertical
          class="mr-3" />

        <v-btn
          title="Изменить"
          icon
          variant="text"
          size="small"
          @click="emit('update')">
          <v-icon size="20"> mdi-pencil-outline </v-icon>
        </v-btn>

        <v-btn
          title="Удалить"
          icon
          variant="text"
          size="small"
          @click="emit('delete')">
          <v-icon size="20"> mdi-delete-outline </v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script setup lang="ts">
import type { SpeakerResponse } from '@/shared/types';

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
}
</style>
