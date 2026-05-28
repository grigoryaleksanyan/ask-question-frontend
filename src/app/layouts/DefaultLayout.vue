<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      theme="dark"
      temporary
      class="drawer-navigation">
      <DrawerNavigation :nav-items="navItems" />
    </v-navigation-drawer>

    <v-app-bar theme="dark">
      <v-app-bar-nav-icon
        class="drawer-navigation-burger"
        @click="toggleDrawer" />

      <AppLogo />

      <v-spacer></v-spacer>

      <HeaderNavigation
        :nav-items="navItems"
        class="header-navigation" />
    </v-app-bar>

    <v-main style="min-height: 100vh">
      <router-view></router-view>
    </v-main>

    <v-footer theme="dark">
      @{{ year }} Grigory Aleksanyan

      <v-spacer></v-spacer>

      <v-tooltip
        text="Обратная связь по порталу"
        location="start">
        <template #activator="{ props }">
          <v-btn
            icon
            variant="flat"
            v-bind="props"
            @click="showFeedbackModal">
            <v-icon size="24px">mdi-email-open</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
    </v-footer>

    <SidebarModal ref="feedback-modal">
      <template #default="{ togglePreloader, confirm, close }">
        <SidebarFeedbackContent
          :show-preloader="togglePreloader"
          :modal-confirm="confirm"
          :modal-close="close" />
      </template>
    </SidebarModal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue';

import type { NavItem } from '@/shared/types';

import DrawerNavigation from '@/shared/ui/DrawerNavigation.vue';
import HeaderNavigation from '@/shared/ui/HeaderNavigation.vue';
import AppLogo from '@/shared/ui/AppLogo.vue';

import { SidebarFeedbackContent } from '@/features/feedback';

defineOptions({ name: 'DefaultLayout' });

const drawer = ref(false);

const feedbackModal = useTemplateRef('feedback-modal');

const navItems: NavItem[] = [
  {
    title: 'Главная',
    icon: 'mdi-home',
    link: '/',
  },
  {
    title: 'Все вопросы',
    icon: 'mdi-account-question',
    link: '/questions',
  },
  {
    title: 'FAQ',
    icon: 'mdi-frequently-asked-questions',
    link: '/faq',
  },
];

const year = computed(() => new Date().getFullYear());

async function showFeedbackModal() {
  await feedbackModal.value.open();
}

function toggleDrawer() {
  drawer.value = !drawer.value;
}
</script>

<style lang="scss" scoped>
@media (width <= 600px) {
  .header-navigation {
    display: none;
  }
}

@media (width >= 600px) {
  .drawer-navigation,
  .drawer-navigation-burger {
    display: none;
  }
}
</style>
