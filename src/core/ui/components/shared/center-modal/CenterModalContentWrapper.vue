<template>
  <div>
    <v-card-text
      class="pa-7"
      style="max-height: 400px; overflow-y: auto !important">
      <slot> </slot>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions class="px-7 py-5">
      <slot name="actions"> </slot>
    </v-card-actions>
  </div>
</template>

<script>
export default {
  name: 'CenterModalContentWrapper',
};
</script>
