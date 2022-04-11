<template>
  <v-app>
    <component :is="layout" />
  </v-app>
</template>

<script>
export default {
  name: 'App',
  computed: {
    layout() {
      const layout = this.$route.meta.layout || 'DefaultLayout';
      return () => import(`@/core/layouts/${layout}.vue`);
    },
  },
};
</script>
