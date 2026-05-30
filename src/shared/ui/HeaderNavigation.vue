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
    <router-link
      to="/login"
      class="header-nav-login">
      Войти
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
  color: variables.$text-secondary;
  font-size: 14px;
  text-decoration: none;
  white-space: nowrap;
}

.header-nav-link.router-link-active {
  color: variables.$main-color;
  font-weight: 500;
}

.header-nav-login {
  padding: 4px 12px;
  border: 1px solid variables.$border-light;
  border-radius: 6px;
  color: variables.$text-secondary;
  font-size: 13px;
  text-decoration: none;
  white-space: nowrap;
}

.header-nav-login:hover {
  border-color: variables.$main-color;
  color: variables.$main-color;
}
</style>
