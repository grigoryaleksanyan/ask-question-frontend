<template>
  <div class="flex align-items-center">
    <router-link
      v-for="(item, i) in navItems"
      :key="i"
      :to="item.link"
      class="flex align-items-center gap-2 mr-3 header-nav-link">
      <i :class="item.icon"></i>
      <span>{{ item.title }}</span>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import type { NavItem } from '@/shared/types';

defineOptions({ name: 'HeaderNavigation' });

const { navItems } = defineProps<{
  navItems: NavItem[];
}>();
</script>

<style lang="scss" scoped>
.header-nav-link {
  color: white;
  font-size: 14px;
  text-decoration: none;
  white-space: nowrap;
}
</style>
