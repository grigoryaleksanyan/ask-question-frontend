<template>
  <div>
    <Drawer
      v-model:visible="drawerVisible"
      position="left"
      modal
      class="drawer-navigation">
      <template #header><span>Навигация</span></template>
      <DrawerNavigation :nav-items="navItems" />
    </Drawer>

    <Toolbar class="app-toolbar">
      <template #start>
        <Button
          icon="pi pi-bars"
          class="drawer-navigation-burger p-button-text"
          @click="drawerVisible = true" />
        <AppLogo />
      </template>
      <template #end>
        <HeaderNavigation
          :nav-items="navItems"
          class="header-navigation" />
      </template>
    </Toolbar>

    <div style="min-height: 100vh">
      <router-view></router-view>
    </div>

    <footer class="app-footer">
      <span>@{{ year }} Grigory Aleksanyan</span>
      <div class="flex-grow-1"></div>
      <Button
        v-tooltip:left="'Обратная связь по порталу'"
        icon="pi pi-envelope"
        text
        class="app-footer__feedback-btn"
        @click="showFeedbackModal" />
    </footer>

    <SidebarModal ref="feedback-modal">
      <template #header>Обратная связь</template>
      <template #default="{ confirm, close }">
        <SidebarFeedbackContent
          ref="feedback-content"
          :modal-confirm="confirm"
          :modal-close="close" />
      </template>
      <template #footer>
        <Button
          label="Отправить"
          @click="feedbackContent?.submitForm()" />
        <Button
          label="Отмена"
          outlined
          @click="feedbackContent?.modalClose()" />
      </template>
    </SidebarModal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue';

import type { NavItem } from '@/shared/types';

import Drawer from 'primevue/drawer';
import Toolbar from 'primevue/toolbar';
import Button from 'primevue/button';

import DrawerNavigation from '@/shared/ui/DrawerNavigation.vue';
import HeaderNavigation from '@/shared/ui/HeaderNavigation.vue';
import AppLogo from '@/shared/ui/AppLogo.vue';

import { SidebarFeedbackContent } from '@/features/feedback';

defineOptions({ name: 'DefaultLayout' });

const drawerVisible = ref(false);

const feedbackModal = useTemplateRef('feedback-modal');
const feedbackContent = useTemplateRef('feedback-content');

const navItems: NavItem[] = [
  {
    title: 'Главная',
    icon: 'pi pi-home',
    link: '/',
  },
  {
    title: 'Все вопросы',
    icon: 'pi pi-user',
    link: '/questions',
  },
  {
    title: 'FAQ',
    icon: 'pi pi-question',
    link: '/faq',
  },
];

const year = computed(() => new Date().getFullYear());

async function showFeedbackModal() {
  await feedbackModal.value.open();
}
</script>

<style lang="scss" scoped>
.app-toolbar {
  border-bottom: 1px solid variables.$border-light;
  background-color: variables.$toolbar-bg;
  color: variables.$text-primary;
}

.app-footer {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  border-top: 1px solid variables.$border-light;
  background-color: variables.$toolbar-bg;
  color: variables.$text-muted;
}

.app-footer__feedback-btn {
  color: variables.$text-secondary;
}

.drawer-navigation {
  :deep(.p-drawer-content) {
    background-color: variables.$toolbar-bg;
  }
}

.drawer-navigation-burger {
  color: variables.$text-primary !important;
}

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
