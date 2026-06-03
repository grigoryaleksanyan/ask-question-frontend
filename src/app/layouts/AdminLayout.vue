<template>
  <div class="admin-layout">
    <aside class="admin-sidebar">
      <router-link
        to="/admin"
        class="admin-sidebar__logo"
        >A</router-link
      >
      <DrawerNavigation
        :nav-items="navItems"
        dark
        icon-only />
      <button
        v-tooltip.right="'Настройки'"
        class="admin-sidebar__settings"
        @click="toggleSettingsMenu">
        <i class="pi pi-cog"></i>
      </button>
    </aside>

    <div class="admin-main">
      <header class="admin-topbar">
        <div class="admin-topbar__section">{{ sectionName }}</div>
        <div class="admin-topbar__actions">
          <span class="admin-topbar__user">{{ userName }}</span>
        </div>
      </header>
      <div class="admin-content">
        <router-view />
      </div>
    </div>

    <Menu
      ref="settingsMenu"
      :model="menuItems"
      popup />

    <SlideOver ref="userProfileSlideOver">
      <template #header>
        <span class="typography__headline--medium">Профиль пользователя</span>
      </template>
      <UserProfile
        :is-open="showUserProfile"
        @success="closeUserProfile"
        @cancel="closeUserProfile" />
    </SlideOver>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, useTemplateRef } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import type { NavItem } from '@/shared/types';

import Menu from 'primevue/menu';

import { useAuthStore, Logout } from '@/features/auth';
import { useApiCall } from '@/shared/lib';

import DrawerNavigation from '@/shared/ui/DrawerNavigation.vue';
import { SlideOver } from '@/shared/ui/slide-over';
import { UserProfile } from '@/entities/user';

defineOptions({ name: 'AdminLayout' });

const router = useRouter();
const route = useRoute();

const authStore = useAuthStore();

const { execute: executeLogout } = useApiCall(Logout, {
  successMessage: 'Успешный выход',
  showPreloader: false,
  onSuccess() {
    authStore.removeAuthData();
    router.push('/');
  },
});

const showUserProfile = ref(false);
const settingsMenu = useTemplateRef('settingsMenu');
const userProfileSlideOver = useTemplateRef('userProfileSlideOver');

onMounted(() => {
  document.documentElement.classList.add('p-dark');
});

onUnmounted(() => {
  document.documentElement.classList.remove('p-dark');
});

const navItems: NavItem[] = [
  {
    title: 'Сводка',
    icon: 'pi pi-chart-line',
    link: '/admin',
  },
  {
    title: 'Вопросы',
    icon: 'pi pi-user',
    link: '/admin-questions',
  },
  {
    title: 'Записи в FAQ',
    icon: 'pi pi-question',
    link: '/admin-faq',
  },
  {
    title: 'Спикеры',
    icon: 'pi pi-users',
    link: '/admin-speakers',
  },
  {
    title: 'Области',
    icon: 'pi pi-directions',
    link: '/admin-areas',
  },
  {
    title: 'Обратная связь',
    icon: 'pi pi-inbox',
    link: '/admin-feedback',
  },
];

const sectionName = computed(() => {
  const item = navItems.find(
    (i) => route.path === i.link || route.path.startsWith(`${i.link}/`),
  );
  return item?.title ?? 'Панель администратора';
});

const userName = computed(() => {
  const details = authStore.userData?.userDetails;
  if (details) {
    return `${details.firstName} ${details.lastName}`;
  }
  return authStore.userData?.email ?? '';
});

const menuItems = [
  {
    label: 'Профиль',
    command() {
      openUserProfile();
    },
  },
  {
    label: 'Выйти',
    command() {
      logout();
    },
  },
];

function toggleSettingsMenu(event: Event) {
  if (settingsMenu.value) {
    settingsMenu.value.toggle(event);
  }
}

function openUserProfile() {
  showUserProfile.value = true;
  userProfileSlideOver.value?.open();
}

function closeUserProfile() {
  showUserProfile.value = false;
  userProfileSlideOver.value?.close();
}

async function logout() {
  await executeLogout();
}
</script>

<style lang="scss" scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
}

.admin-sidebar {
  display: flex;
  width: 64px;
  flex-direction: column;
  flex-shrink: 0;
  align-items: center;
  padding-top: 16px;
  background: variables.$sidebar-bg;
  color: variables.$text-primary-dark;
  gap: 20px;
}

.admin-sidebar__logo {
  display: flex;
  width: 36px;
  height: 36px;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: variables.$main-color;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
}

.admin-sidebar__settings {
  display: flex;
  width: 36px;
  height: 36px;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  border-radius: 10px;
  margin-top: auto;
  margin-bottom: 16px;
  background: none;
  color: variables.$text-primary-dark;
  cursor: pointer;
  font-size: 16px;
}

.admin-sidebar__settings:hover {
  background: rgb(255 255 255 / 6%);
}

.admin-main {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
}

.admin-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 24px;
  border-bottom: 1px solid variables.$border-dark;
  background: variables.$toolbar-dark-bg;
  color: variables.$text-primary-dark;
}

.admin-topbar__section {
  color: variables.$text-primary-dark;
  font-size: 18px;
  font-weight: 500;
}

.admin-topbar__actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.admin-topbar__user {
  color: variables.$text-primary-dark;
  font-size: 16px;
}

.admin-content {
  overflow: auto;
  min-width: 0;
  flex: 1;
  background: variables.$surface-dark;
}
</style>
