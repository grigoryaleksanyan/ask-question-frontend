<template>
  <v-list
    nav
    class="ma-0 pa-0">
    <v-list-item
      v-for="item in navItems"
      :key="item.title"
      :to="item.link"
      :prepend-icon="item.icon"
      :title="item.title"
      link
      class="mb-0 pl-4">
    </v-list-item>
  </v-list>
</template>

<script>
export default {
  name: 'DrawerNavigation',

  props: {
    navItems: {
      type: Array,
      required: true,
    },
  },
};
</script>
