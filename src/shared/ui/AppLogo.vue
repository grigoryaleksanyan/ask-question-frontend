<template>
  <div class="logo-wrapper">
    <img
      alt="logo"
      :src="imageUrl"
      style="width: auto; max-width: 100%" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import logoUrl from '@/shared/assets';

defineOptions({ name: 'AppLogo' });

const imageUrl = ref(logoUrl);
</script>

<style lang="scss" scoped>
.logo-wrapper {
  display: flex;
  max-width: 140px;
  height: 100%;
  align-items: center;
  justify-content: center;
  padding: 5px 15px;
}
</style>
