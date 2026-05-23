<template>
  <v-overlay
    :model-value="showPreloader"
    style="z-index: 9">
    <v-progress-circular
      :size="70"
      :width="6"
      color="primary"
      indeterminate></v-progress-circular>
  </v-overlay>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { usePreloaderStore } from '../store';

defineOptions({ name: 'AppPreloader' });

const preloaderStore = usePreloaderStore();

const { showPreloader } = storeToRefs(preloaderStore);
</script>
