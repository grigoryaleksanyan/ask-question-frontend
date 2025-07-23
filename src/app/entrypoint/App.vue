<template>
  <v-app>
    <component :is="layout" />
    <AppPreloader />
    <AppAlert />
  </v-app>
</template>

<script>
import { defineAsyncComponent } from 'vue';

import AppPreloader from '@/modules/preloader/ui/components/AppPreloader.vue';
import AppAlert from '@/modules/alert/ui/components/AppAlert.vue';

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
