<template>
  <div>
    <v-navigation-drawer v-model="drawer" app temporary dark class="drawer-navigation">
      <DrawerNavigation :nav-items="navItems" />
    </v-navigation-drawer>

    <v-app-bar app dark>
      <v-app-bar-nav-icon class="drawer-navigation-burger" @click="toggleDrawer" />
      <v-app-bar-title>Заголовок</v-app-bar-title>
      <v-spacer></v-spacer>
      <HeaderNavigation :nav-items="navItems" class="header-navigation" />
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <p>Стандартный слой</p>
        <router-view></router-view>
      </v-container>
    </v-main>

    <v-footer app dark>
      @{{ year }} Grigory Aleksanyan
      <v-spacer></v-spacer>
      <v-tooltip left>
        <template #activator="{ on, attrs }">
          <v-btn to="/feedback" dark icon v-bind="attrs" v-on="on">
            <v-icon size="24px">mdi-email-open</v-icon>
          </v-btn>
        </template>
        <span>Обратная связь по порталу</span>
      </v-tooltip>
    </v-footer>
  </div>
</template>

<script>
import DrawerNavigation from '@/core/components/DrawerNavigation.vue';
import HeaderNavigation from '@/core/components/HeaderNavigation.vue';

export default {
  name: 'DefaultLayout',
  components: {
    DrawerNavigation,
    HeaderNavigation,
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
        {
          title: 'FAQ',
          icon: 'mdi-account-question-outline',
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
