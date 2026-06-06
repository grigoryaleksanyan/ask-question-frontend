<template>
  <div>
    <component :is="layout" />
    <AppPreloader />
    <AppToast />
    <ConfirmDialog />
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, type Component } from 'vue';
import { useRoute } from 'vue-router';

import { AppPreloader } from '@/features/preloader';
import AppToast from '@/shared/ui/toast/AppToast.vue';
import ConfirmDialog from 'primevue/confirmdialog';

defineOptions({ name: 'App' });

const route = useRoute();

const layoutCache = new Map<string, Component>();

function getLayoutComponent(name: string): Component {
  if (!layoutCache.has(name)) {
    layoutCache.set(
      name,
      defineAsyncComponent(() => import(`@/app/layouts/${name}.vue`)),
    );
  }
  return layoutCache.get(name)!;
}

const layout = computed(() => {
  const layoutName = route.meta.layout || 'DefaultLayout';
  return getLayoutComponent(layoutName);
});
</script>
