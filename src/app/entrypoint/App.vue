<template>
  <v-app>
    <component :is="layout" />
    <AppPreloader />
    <AppAlert />
  </v-app>
</template>

<script setup>
import { computed, defineAsyncComponent } from 'vue';
import { useRoute } from 'vue-router';

import { AppPreloader } from '@/features/preloader';
import { AppAlert } from '@/entities/alert';

defineOptions({ name: 'App' });

const route = useRoute();

const layout = computed(() => {
  const layoutName = route.meta.layout || 'DefaultLayout';
  return defineAsyncComponent(() => import(`@/app/layouts/${layoutName}.vue`));
});
</script>
