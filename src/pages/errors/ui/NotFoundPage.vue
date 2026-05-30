<template>
  <div
    class="grid align-items-center"
    style="height: 100vh">
    <div class="col-12 flex flex-column align-items-center">
      <h1
        class="typography__headline--small typography__headline--large--sm mb-8">
        Такой страницы не существует &#128577;
      </h1>
      <Button
        label="Вернуться"
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
