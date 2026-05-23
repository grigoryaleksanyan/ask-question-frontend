<template>
  <v-toolbar-items>
    <v-btn
      v-for="(item, i) in navItems"
      :key="i"
      variant="text"
      :to="item.link">
      <v-icon
        start
        theme="dark">
        {{ item.icon }}
      </v-icon>
      <div>{{ item.title }}</div>
    </v-btn>
  </v-toolbar-items>
</template>

<script setup>
defineOptions({ name: 'HeaderNavigation' });

const { navItems } = defineProps({
  navItems: {
    type: Array,
    required: true,
  },
});
</script>
