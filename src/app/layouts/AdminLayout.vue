<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      color="blue-grey">
      <DrawerNavigation :nav-items="navItems" />
    </v-navigation-drawer>

    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer" />

      <v-toolbar-title class="text-body-large">
        Панель администратора
      </v-toolbar-title>

      <v-menu>
        <template #activator="{ props }">
          <v-btn
            icon
            v-bind="props">
            <v-icon>mdi-cog-outline</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item>
            <v-btn
              variant="flat"
              width="100%"
              @click="showUserProfile = true">
              Профиль
            </v-btn>
          </v-list-item>
          <v-list-item>
            <v-btn
              variant="flat"
              width="100%"
              @click="logout">
              Выйти
            </v-btn>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>

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
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import type { NavItem } from '@/shared/types';

import { useAuthStore, Logout } from '@/features/auth';
import { useAlertStore } from '@/entities/alert';
import { ALERT_TYPES } from '@/shared/config';

import DrawerNavigation from '@/shared/ui/DrawerNavigation.vue';
import { UserProfile } from '@/entities/user';

defineOptions({ name: 'AdminLayout' });

const router = useRouter();

const authStore = useAuthStore();
const alertStore = useAlertStore();

const drawer = ref(false);
const showUserProfile = ref(false);

const navItems: NavItem[] = [
  {
    title: 'Сводка',
    icon: 'mdi-chart-line',
    link: '/admin',
  },
  {
    title: 'Вопросы',
    icon: 'mdi-account-question',
    link: '/admin-questions',
  },
  {
    title: 'Записи в FAQ',
    icon: 'mdi-frequently-asked-questions',
    link: '/admin-faq',
  },
  {
    title: 'Спикеры',
    icon: 'mdi-account-tie-voice',
    link: '/admin-speakers',
  },
  {
    title: 'Области',
    icon: 'mdi-arrow-decision-outline',
    link: '/admin-areas',
  },
  {
    title: 'Обратная связь',
    icon: 'mdi-email-open-multiple-outline',
    link: '/admin-feedback',
  },
];

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
