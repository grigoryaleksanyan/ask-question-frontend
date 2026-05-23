<template>
  <v-app>
    <component :is="layout" />
    <AppPreloader />
    <AppAlert />
  </v-app>
</template>

<script>
import { defineAsyncComponent } from 'vue';

import { AppPreloader } from '@/features/preloader';
import { AppAlert } from '@/entities/alert';

export default {
  name: 'App',

  components: {
    AppPreloader,
    AppAlert,
  },

  computed: {
    layout() {
      const layout = this.$route.meta.layout || 'DefaultLayout';
      return defineAsyncComponent(() => import(`@/app/layouts/${layout}.vue`));
    },
  },
};
</script>
