<template>
  <nav
    class="app-navigation"
    :class="{
      'app-navigation--horizontal': layout === 'horizontal',
      'app-navigation--vertical': layout === 'vertical',
    }">
    <router-link
      v-for="(item, index) in navItems"
      :key="index"
      :to="item.link"
      class="app-navigation__link">
      <i
        :class="item.icon"
        class="app-navigation__icon"></i>
      <span class="app-navigation__text">{{ item.title }}</span>
    </router-link>
    <div class="app-navigation__divider"></div>
    <router-link
      v-if="isAuthorized"
      to="/admin"
      class="app-navigation__link app-navigation__link--highlight">
      <i class="app-navigation__icon pi pi-cog"></i>
      <span class="app-navigation__text">Админ-панель</span>
    </router-link>
    <router-link
      v-else
      to="/login"
      class="app-navigation__link app-navigation__link--highlight">
      <i class="app-navigation__icon pi pi-sign-in"></i>
      <span class="app-navigation__text">Войти</span>
    </router-link>
  </nav>
</template>

<script setup lang="ts">
import type { NavItem } from '@/shared/dto';

defineOptions({ name: 'AppNavigation' });

const {
  navItems,
  isAuthorized,
  layout = 'horizontal',
} = defineProps<{
  navItems: NavItem[];
  isAuthorized: boolean;
  layout?: 'horizontal' | 'vertical';
}>();
</script>

<style lang="scss" scoped>
.app-navigation {
  display: flex;
}

.app-navigation--horizontal {
  flex-direction: row;
  align-items: center;
  gap: 4px;
}

.app-navigation--vertical {
  flex-direction: column;
  gap: 2px;
}

.app-navigation__link {
  display: flex;
  align-items: center;
  border-radius: 8px;
  color: variables.$text-secondary;
  font-size: 14px;
  gap: 8px;
  text-decoration: none;
  transition:
    background-color 0.2s,
    color 0.2s;
  white-space: nowrap;
}

.app-navigation__link:hover {
  background-color: variables.$surface-bg;
  color: variables.$text-primary;
}

.app-navigation__link.router-link-active {
  color: variables.$main-color;
  font-weight: 500;
}

.app-navigation--horizontal .app-navigation__link {
  padding: 6px 10px;
}

.app-navigation--horizontal .app-navigation__link--highlight {
  padding: 4px 12px;
  border: 1px solid variables.$border-light;
  border-radius: 6px;
  margin-left: 4px;
  font-size: 13px;
}

.app-navigation--horizontal .app-navigation__link--highlight:hover {
  border-color: variables.$main-color;
  background: transparent;
  color: variables.$main-color;
}

.app-navigation--vertical .app-navigation__link {
  padding: 10px 14px;
}

.app-navigation--vertical .app-navigation__link--highlight {
  border: 1px solid variables.$border-light;
  margin-top: 8px;
}

.app-navigation__divider {
  display: none;
}

.app-navigation--vertical .app-navigation__divider {
  display: block;
  height: 1px;
  margin: 4px 0;
  background: variables.$border-light;
}

.app-navigation__icon {
  flex-shrink: 0;
  font-size: 16px;
}

.app-navigation--vertical .app-navigation__icon {
  font-size: 18px;
}
</style>
