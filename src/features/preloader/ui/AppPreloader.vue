<template>
  <div>
    <div
      v-if="showPreloader"
      class="app-preloader">
      <ProgressSpinner
        style="width: 70px; height: 70px"
        :stroke-width="'6'" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { usePreloaderStore } from '../store';

import ProgressSpinner from 'primevue/progressspinner';

defineOptions({ name: 'AppPreloader' });

const preloaderStore = usePreloaderStore();

const { showPreloader } = storeToRefs(preloaderStore);
</script>

<style lang="scss" scoped>
.app-preloader {
  position: fixed;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(0 0 0 / 50%);
  inset: 0;
}
</style>
