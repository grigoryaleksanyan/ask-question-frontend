<template>
  <div>
    <component :is="layout" />
    <AppPreloader />
    <AppToast />
    <ConfirmDialog />
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';
import { useRoute } from 'vue-router';

import { AppPreloader } from '@/features/preloader';
import AppToast from '@/shared/ui/toast/AppToast.vue';
import ConfirmDialog from 'primevue/confirmdialog';

defineOptions({ name: 'App' });

const route = useRoute();

const layout = computed(() => {
  const layoutName = route.meta.layout || 'DefaultLayout';
  return defineAsyncComponent(() => import(`@/app/layouts/${layoutName}.vue`));
});
</script>
