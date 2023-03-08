<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      app>
      <DrawerNavigation :nav-items="navItems" />
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer" />

      <v-toolbar-title class="text-subtitle-1"> Панель администратора </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn
        depressed
        @click="logout">
        Выйти
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

import ALERT_TYPES from '@/modules/alert/constants/alert-types';

import { Logout } from '@/modules/auth/repositories/auth-repository';

import DrawerNavigation from '@/core/ui/components/DrawerNavigation.vue';

export default {
  name: 'AdminLayout',

  components: {
    DrawerNavigation,
  },

  data() {
    return {
      drawer: false,

      navItems: [
        {
          title: 'Сводка',
          icon: 'mdi-chart-line',
          link: '/admin',
        },
        {
          title: 'Список вопросов',
          icon: 'mdi-comment-question-outline',
          link: '/admin-questions',
        },
        {
          title: 'Записи в FAQ',
          icon: 'mdi-account-question-outline',
          link: '/admin-faq',
        },
        {
          title: 'Список спикеров',
          icon: 'mdi-account-tie-voice',
          link: '/admin-speakers',
        },
        {
          title: 'Обратная связь',
          icon: 'mdi-email-open-multiple-outline',
          link: '/admin-feedback',
        },
      ],
    };
  },

  methods: {
    ...mapMutations('alert', ['ADD_ALERT']),

    async logout() {
      try {
        await Logout();

        this.$router.push('/');

        this.ADD_ALERT({ type: ALERT_TYPES.SUCCESS, text: 'Успешный выход' });
      } catch (error) {
        this.ADD_ALERT({ type: ALERT_TYPES.ERROR, text: error.message });
      }
    },
  },
};
</script>
