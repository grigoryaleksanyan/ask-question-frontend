<template>
  <div class="admin-layout">
    <aside
      class="admin-sidebar"
      :class="{ 'admin-sidebar--collapsed': sidebarCollapsed }">
      <div class="admin-sidebar-toggle">
        <Button
          :icon="sidebarCollapsed ? 'pi pi-angle-right' : 'pi pi-angle-left'"
          text
          size="small"
          class="admin-sidebar-toggle-btn"
          @click="sidebarCollapsed = !sidebarCollapsed" />
      </div>
      <DrawerNavigation
        :nav-items="navItems"
        :collapsed="sidebarCollapsed" />
    </aside>

    <div class="admin-main">
      <Toolbar class="app-toolbar">
        <template #start>
          <div class="typography__headline--medium">Панель администратора</div>
        </template>
        <template #end>
          <Menu
            ref="settingsMenu"
            :model="menuItems"
            popup />
          <Button
            icon="pi pi-cog"
            text
            @click="toggleSettingsMenu" />
        </template>
      </Toolbar>

      <div>
        <router-view></router-view>
      </div>
    </div>

    <CenterModal
      title="Профиль пользователя"
      :is-open="showUserProfile"
      @close="showUserProfile = false">
      <UserProfile
        v-if="showUserProfile"
        :is-open="showUserProfile"
        @success="showUserProfile = false"
        @cancel="showUserProfile = false" />
    </CenterModal>
  </div>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { useRouter } from 'vue-router';

import type { NavItem } from '@/shared/types';

import Toolbar from 'primevue/toolbar';
import Button from 'primevue/button';
import Menu from 'primevue/menu';

import { useAuthStore, Logout } from '@/features/auth';
import { useAlertStore } from '@/entities/alert';
import { ALERT_TYPES } from '@/shared/config';

import DrawerNavigation from '@/shared/ui/DrawerNavigation.vue';
import CenterModal from '@/shared/ui/center-modal/CenterModal.vue';
import { UserProfile } from '@/entities/user';

defineOptions({ name: 'AdminLayout' });

const router = useRouter();

const authStore = useAuthStore();
const alertStore = useAlertStore();

const showUserProfile = ref(false);
const sidebarCollapsed = ref(false);

const settingsMenu = useTemplateRef('settingsMenu');

const menuItems = [
  {
    label: 'Профиль',
    command() {
      showUserProfile.value = true;
    },
  },
  {
    label: 'Выйти',
    command() {
      logout();
    },
  },
];

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

function toggleSettingsMenu(event: Event) {
  if (settingsMenu.value) {
    settingsMenu.value.toggle(event);
  }
}

async function logout() {
  try {
    await Logout();

    authStore.removeAuthData();

    router.push('/');

    alertStore.addAlert({ type: ALERT_TYPES.SUCCESS, text: 'Успешный выход' });
  } catch (error) {
    const err = error as Error;
    alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: err.message });
  }
}
</script>

<style lang="scss" scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
}

.admin-sidebar {
  width: 260px;
  flex-shrink: 0;
  padding: 16px 0;
  background-color: #37474f;
  color: white;
  transition: width 0.2s ease;
}

.admin-sidebar--collapsed {
  width: 60px;
}

.admin-sidebar-toggle {
  display: flex;
  justify-content: flex-end;
  padding: 0 8px 8px;
}

.admin-sidebar-toggle-btn {
  color: white !important;
}

.admin-main {
  min-width: 0;
  flex: 1;
}

.app-toolbar {
  background-color: #1f2937;
  color: white;
}
</style>
