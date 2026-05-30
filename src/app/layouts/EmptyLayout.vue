<template>
  <div class="empty-layout">
    <router-view />
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'EmptyLayout' });
</script>

<style lang="scss" scoped>
.empty-layout {
  min-height: 100vh;
  background: variables.$surface-bg;
}
</style>
