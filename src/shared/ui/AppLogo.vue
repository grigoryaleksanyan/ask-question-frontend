<template>
  <div class="logo-wrapper">
    <router-link
      to="/"
      class="logo-wrapper__link">
      <img
        alt="logo"
        :src="imageUrl"
        class="logo-wrapper__img" />
    </router-link>
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

.logo-wrapper__link {
  display: flex;
  height: 100%;
  align-items: center;
}

.logo-wrapper__img {
  width: auto;
  max-width: 100%;
  height: 32px;
}
</style>
