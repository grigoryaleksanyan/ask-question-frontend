<template>
  <v-app>
    <component :is="layout" />
    <AppPreloader />
  </v-app>
</template>

<script>
import AppPreloader from '@/modules/preloader/components/AppPreloader.vue';

export default {
  name: 'App',
  components: {
    AppPreloader,
  },
  computed: {
    layout() {
      const layout = this.$route.meta.layout || 'DefaultLayout';
      return () => import(`@/core/layouts/${layout}.vue`);
    },
  },
};
</script>
