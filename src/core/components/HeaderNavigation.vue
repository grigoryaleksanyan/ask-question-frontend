<template>
  <v-toolbar-items>
    <v-btn v-for="(item, i) in navItems" :key="i" text :to="item.link">
      <v-icon left dark>{{ item.icon }}</v-icon>
      <div>{{ item.title }}</div>
    </v-btn>
  </v-toolbar-items>
</template>

<script>
export default {
  name: 'HeaderNavigation',
  props: {
    navItems: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {};
  },
};
</script>
