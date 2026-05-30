<template>
  <div class="not-found-page">
    <div class="not-found-page__content">
      <span class="not-found-page__code">404</span>
      <p class="not-found-page__subtitle">Страница не найдена</p>
      <Button
        label="Вернуться"
        severity="secondary"
        outlined
        class="not-found-page__btn"
        @click="router.push('/')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

import Button from 'primevue/button';

defineOptions({ name: 'NotFoundPage' });

const router = useRouter();
</script>

<style lang="scss" scoped>
.not-found-page {
  display: flex;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  background: variables.$surface-bg;
}

.not-found-page__content {
  text-align: center;
}

.not-found-page__code {
  color: variables.$border-light;
  font-size: 120px;
  font-weight: 600;
  line-height: 1;
}

.not-found-page__subtitle {
  margin: 8px 0 0;
  color: variables.$text-secondary;
  font-size: 18px;
}

.not-found-page__btn {
  margin-top: 20px;
}
</style>
