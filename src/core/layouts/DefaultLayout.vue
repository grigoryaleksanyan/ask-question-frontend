<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      app
      temporary
      dark
      class="drawer-navigation">
      <DrawerNavigation :nav-items="navItems" />
    </v-navigation-drawer>

    <v-app-bar
      app
      dark>
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

    <v-footer dark>
      @{{ year }} Grigory Aleksanyan
      <v-spacer></v-spacer>

      <v-tooltip left>
        <template #activator="{ on, attrs }">
          <v-btn
            dark
            icon
            v-bind="attrs"
            v-on="on"
            @click="showFeedback = true">
            <v-icon size="24px">mdi-email-open</v-icon>
          </v-btn>
        </template>
        <span>Обратная связь по порталу</span>
      </v-tooltip>
    </v-footer>

    <SidebarModal
      :is-open="showFeedback"
      title="Обратная связь по порталу"
      @close="showFeedback = false">
      <SidebarFeedbackContent
        @success="success"
        @cancel="showFeedback = false" />
    </SidebarModal>
  </div>
</template>

<script>
import DrawerNavigation from '@/core/components/DrawerNavigation.vue';
import HeaderNavigation from '@/core/components/HeaderNavigation.vue';
import AppLogo from '@/core/components/AppLogo.vue';

import SidebarModal from '@/modules/shared/components/base/sidebar/SidebarModal.vue';
import SidebarFeedbackContent from '@/modules/SidebarFeedbackContent.vue';

export default {
  name: 'DefaultLayout',
  components: {
    DrawerNavigation,
    HeaderNavigation,
    AppLogo,

    SidebarModal,
    SidebarFeedbackContent,
  },
  data() {
    return {
      drawer: false,
      navItems: [
        {
          title: 'Главная',
          icon: 'mdi-apps',
          link: '/',
        },
        {
          title: 'Все вопросы',
          icon: 'mdi-comment-question-outline',
          link: '/questions',
        },
      ],

      showFeedback: false,
    };
  },
  computed: {
    year() {
      const now = new Date();
      return now.getFullYear();
    },
  },
  methods: {
    success() {
      this.showFeedback = false;
    },
    toggleDrawer() {
      this.drawer = !this.drawer;
    },
  },
};
</script>

<style lang="scss" scoped>
@media (max-width: 600px) {
  .header-navigation {
    display: none;
  }
}
@media (min-width: 600px) {
  .drawer-navigation,
  .drawer-navigation-burger {
    display: none;
  }
}
</style>
