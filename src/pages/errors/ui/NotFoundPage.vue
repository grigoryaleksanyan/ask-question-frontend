<template>
  <v-container fluid>
    <v-row
      class="align-center"
      style="height: 100vh">
      <v-col
        cols="12"
        class="d-flex flex-column align-center">
        <h1 class="text-headline-small text-sm-headline-large mb-8">
          Такой страницы не существует &#128577;
        </h1>
        <v-btn
          variant="flat"
          @click="toBack()">
          Вернуться
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

defineOptions({ name: 'NotFoundPage' });

const router = useRouter();

function toBack() {
  router.go(-1);
}
</script>
