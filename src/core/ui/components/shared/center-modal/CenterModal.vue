<template>
  <v-dialog
    :model-value="isOpen"
    persistent
    max-width="600">
    <v-card>
      <v-card-title class="d-flex justify-space-between">
        <h4 class="text-truncate">
          {{ title }}
        </h4>
        <v-btn
          class="pa-0"
          elevation="0"
          min-width="40"
          max-width="40"
          min-height="40"
          max-height="40"
          width="40"
          height="40"
          style="border-radius: 8px"
          @click="close">
          <v-icon>mdi-plus mdi-rotate-45</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <slot> </slot>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'CenterModal',

  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },
  },

  methods: {
    close() {
      this.$emit('close');
    },
  },
};
</script>
