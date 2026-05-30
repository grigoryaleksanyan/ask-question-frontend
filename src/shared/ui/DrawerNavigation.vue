<template>
  <nav class="drawer-nav">
    <router-link
      v-for="item in navItems"
      :key="item.title"
      v-tooltip.right="collapsed ? item.title : undefined"
      :to="item.link"
      class="drawer-nav-link"
      :class="{ 'drawer-nav-link--collapsed': collapsed }">
      <i
        :class="item.icon"
        class="drawer-nav-link__icon"></i>
      <span
        v-if="!collapsed"
        class="drawer-nav-link__text"
        >{{ item.title }}</span
      >
    </router-link>
  </nav>
</template>

<script setup lang="ts">
import type { NavItem } from '@/shared/types';

defineOptions({ name: 'DrawerNavigation' });

const { navItems, collapsed = false } = defineProps<{
  navItems: NavItem[];
  collapsed?: boolean;
}>();
</script>

<style lang="scss" scoped>
.drawer-nav-link {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 4px;
  color: white;
  gap: 8px;
  text-decoration: none;
  transition: background-color 0.2s;
  white-space: nowrap;
}

.drawer-nav-link:hover {
  background-color: rgb(255 255 255 / 10%);
}

.drawer-nav-link--collapsed {
  justify-content: center;
  padding: 8px;
}

.drawer-nav-link__icon {
  flex-shrink: 0;
  font-size: 20px;
}

.drawer-nav-link__text {
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
