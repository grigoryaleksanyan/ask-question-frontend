<template>
  <div class="not-found-page">
    <div class="not-found-page__content">
      <h1 class="not-found-page__title typography__display--large">404</h1>
      <p class="not-found-page__subtitle typography__display--italic">
        Такой страницы не существует
      </p>
      <Button
        label="Вернуться"
        class="not-found-page__btn mt-6"
        @click="toBack()" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

import Button from 'primevue/button';

defineOptions({ name: 'NotFoundPage' });

const router = useRouter();

function toBack() {
  router.go(-1);
}
</script>

<style lang="scss" scoped>
.not-found-page {
  display: flex;
  height: 100vh;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    160deg,
    variables.$card-bg 0%,
    #dbe4ff 50%,
    variables.$card-bg 100%
  );
}

.not-found-page__content {
  text-align: center;
}

.not-found-page__title {
  margin: 0;
  color: variables.$toolbar-bg;
  font-size: 10rem;
  line-height: 1;
  opacity: 0.15;
}

.not-found-page__subtitle {
  margin: 0;
  color: variables.$toolbar-bg;
}

.not-found-page__btn {
  border-color: variables.$toolbar-bg;
  background-color: variables.$toolbar-bg;
}
</style>
