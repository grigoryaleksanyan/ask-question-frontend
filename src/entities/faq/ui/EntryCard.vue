<template>
  <v-card
    class="entry-card"
    elevation="2"
    color="#E8EAF6">
    <v-card-title class="py-2">
      <v-row
        no-gutters
        class="text-body-large">
        <v-col
          class="align-self-center"
          cols="12">
          <span style="overflow-wrap: break-word">{{ entry.question }}</span>
        </v-col>
        <v-col
          class="d-flex justify-start justify-sm-end"
          cols="12"
          sm="6">
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text>
      <div class="d-flex">
        <v-sheet
          style="overflow-y: scroll"
          color="white"
          max-height="200px"
          width="100%"
          class="pa-3">
          <div v-html="entry.answer"></div>
        </v-sheet>
      </div>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions class="py-1">
      <v-container
        fluid
        class="py-0">
        <v-row
          class="align-center"
          no-gutters>
          <v-col>
            <span class="text-body-small">
              Создана: {{ new Date(entry.сreated).toLocaleDateString() }}
            </span>
          </v-col>
          <v-col class="d-flex justify-end align-center">
            <v-btn
              title="Переместить"
              class="handle"
              icon
              variant="text"
              size="small">
              <v-icon size="20"> mdi-arrow-all </v-icon>
            </v-btn>

            <v-btn
              title="Скопировать ссылку на запись"
              icon
              variant="text"
              size="small"
              @click="emit('copy-link')">
              <v-icon size="20">mdi-link</v-icon>
            </v-btn>

            <v-btn
              title="Изменить"
              icon
              variant="text"
              size="small"
              @click="emit('update')">
              <v-icon size="20">mdi-pencil-outline</v-icon>
            </v-btn>

            <v-btn
              title="Удалить"
              icon
              variant="text"
              size="small"
              @click="emit('delete')">
              <v-icon size="20">mdi-delete-outline</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card-actions>
  </v-card>
</template>

<script setup>
defineOptions({ name: 'EntryCard' });

const { entry } = defineProps({
  entry: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['copy-link', 'update', 'delete']);
</script>

<style lang="scss" scoped>
.entry-card {
  position: relative;
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
