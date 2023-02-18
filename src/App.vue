<template>
  <v-app>
    <component :is="layout" />
    <AppPreloader />
    <AppAlert />
  </v-app>
</template>

<script>
import AppPreloader from '@/modules/preloader/components/AppPreloader.vue';
import AppAlert from '@/modules/alert/components/AppAlert.vue';

export default {
  name: 'App',
  components: {
    AppPreloader,
    AppAlert,
  },
  computed: {
    layout() {
      const layout = this.$route.meta.layout || 'DefaultLayout';
      return () => import(`@/core/layouts/${layout}.vue`);
    },
  },
};
</script>
