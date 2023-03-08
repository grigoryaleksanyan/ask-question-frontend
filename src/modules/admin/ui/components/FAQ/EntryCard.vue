<template>
  <v-card
    elevation="2"
    color="#E8EAF6">
    <v-card-title class="py-2">
      <v-row
        no-gutters
        class="text-body-1">
        <v-col
          cols="12"
          align-self="center">
          <span style="word-break: break-word">{{ entry.question }}</span>
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
          no-gutters
          align="center">
          <v-col>
            <span class="text-caption"> Создана: {{ new Date(entry.сreated).toLocaleDateString() }} </span>
          </v-col>
          <v-col class="d-flex justify-end align-center">
            <v-icon
              style="cursor: move"
              title="Переместить"
              size="20"
              class="mr-2 handle">
              mdi-arrow-all
            </v-icon>
            <v-btn
              title="Изменить"
              class="mr-1"
              icon
              small
              @click="$emit('update')">
              <v-icon size="20">mdi-pencil-outline</v-icon>
            </v-btn>
            <v-btn
              title="Удалить"
              icon
              small
              @click="$emit('delete')">
              <v-icon size="20">mdi-delete-outline</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'EntryCard',

  props: {
    entry: {
      type: Object,
      required: true,
    },
  },
};
</script>
