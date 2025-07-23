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

<script>
import DrawerNavigation from '@/shared/ui/DrawerNavigation.vue';
import HeaderNavigation from '@/shared/ui/HeaderNavigation.vue';
import AppLogo from '@/shared/ui/AppLogo.vue';

import SidebarFeedbackContent from '@/modules/feedback/ui/components/sidebar-content/SidebarFeedbackContent.vue';

export default {
  name: 'DefaultLayout',

  components: {
    DrawerNavigation,
    HeaderNavigation,
    AppLogo,
    SidebarFeedbackContent,
  },

  data() {
    return {
      drawer: false,
      navItems: [
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
      ],
    };
  },

  computed: {
    year() {
      const now = new Date();
      return now.getFullYear();
    },
  },

  methods: {
    async showFeedbackModal() {
      await this.$refs['feedback-modal'].open();
    },

    toggleDrawer() {
      this.drawer = !this.drawer;
    },
  },
};
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
