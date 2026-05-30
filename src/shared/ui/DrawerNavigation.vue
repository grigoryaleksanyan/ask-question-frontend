<template>
  <nav
    class="drawer-nav"
    :class="{
      'drawer-nav--dark': dark,
      'drawer-nav--icon-only': iconOnly,
    }">
    <router-link
      v-for="item in navItems"
      :key="item.title"
      v-tooltip.right="iconOnly || collapsed ? item.title : undefined"
      :to="item.link"
      class="drawer-nav-link"
      :class="{
        'drawer-nav-link--collapsed': collapsed && !iconOnly,
        'drawer-nav-link--icon-only': iconOnly,
        'drawer-nav-link--dark': dark,
      }">
      <i
        :class="[item.icon, { 'drawer-nav-link__icon--icon-only': iconOnly }]"
        class="drawer-nav-link__icon"></i>
      <span
        v-if="!collapsed && !iconOnly"
        class="drawer-nav-link__text"
        >{{ item.title }}</span
      >
    </router-link>
  </nav>
</template>

<script setup lang="ts">
import type { NavItem } from '@/shared/types';

defineOptions({ name: 'DrawerNavigation' });

const {
  navItems,
  collapsed = false,
  dark = false,
  iconOnly = false,
} = defineProps<{
  navItems: NavItem[];
  collapsed?: boolean;
  dark?: boolean;
  iconOnly?: boolean;
}>();
</script>

<style lang="scss" scoped>
.drawer-nav-link {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 4px;
  color: variables.$text-secondary;
  font-size: 14px;
  gap: 8px;
  text-decoration: none;
  transition: background-color 0.2s;
  white-space: nowrap;
}

.drawer-nav-link:hover {
  background-color: variables.$surface-bg;
}

.drawer-nav-link.router-link-active {
  color: variables.$main-color;
  font-weight: 500;
}

.drawer-nav-link--dark {
  color: variables.$text-primary-dark;
}

.drawer-nav-link--dark:hover {
  background-color: rgb(255 255 255 / 10%);
}

.drawer-nav-link--dark.router-link-active {
  color: variables.$main-color;
}

.drawer-nav-link--collapsed {
  justify-content: center;
  padding: 8px;
}

.drawer-nav--icon-only {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.drawer-nav-link--icon-only {
  width: 36px;
  height: 36px;
  align-items: center;
  justify-content: center;
  padding: 0;
  border-radius: 6px;
  font-size: 16px;
  gap: 0;
}

.drawer-nav-link--icon-only:hover {
  background-color: variables.$surface-bg;
}

.drawer-nav-link--icon-only.router-link-active {
  background: rgba(variables.$main-color, 0.15);
  color: variables.$main-color;
}

.drawer-nav-link--dark.drawer-nav-link--icon-only {
  color: variables.$text-primary-dark;
}

.drawer-nav-link--dark.drawer-nav-link--icon-only:hover {
  background-color: rgb(255 255 255 / 10%);
}

.drawer-nav-link--dark.drawer-nav-link--icon-only.router-link-active {
  background: rgba(variables.$main-color, 0.15);
  color: variables.$main-color;
}

.drawer-nav-link__icon {
  flex-shrink: 0;
  font-size: 20px;
}

.drawer-nav-link__icon--icon-only {
  font-size: 16px;
}

.drawer-nav-link__text {
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
