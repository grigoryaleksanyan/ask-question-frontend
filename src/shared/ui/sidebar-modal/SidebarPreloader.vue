<template>
  <div class="sidebar-preloader">
    <ProgressSpinner
      style="width: 80px; height: 80px"
      stroke-width="4" />
  </div>
</template>

<script setup lang="ts">
import ProgressSpinner from 'primevue/progressspinner';

defineOptions({ name: 'SidebarPreloader' });
</script>

<style lang="scss" scoped>
.sidebar-preloader {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
}
</style>
