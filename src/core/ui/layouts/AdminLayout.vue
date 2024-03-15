<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      color="blue-grey">
      <DrawerNavigation :nav-items="navItems" />
    </v-navigation-drawer>

    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer" />

      <v-toolbar-title class="text-subtitle-1"> Панель администратора </v-toolbar-title>

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

<script>
import { mapMutations } from 'vuex';

import ALERT_TYPES from '@/modules/alert/constants/alert-types';

import DrawerNavigation from '@/core/ui/components/DrawerNavigation.vue';
import UserProfile from '@/modules/user/ui/components/center-modal-content/UserProfile.vue';

import { Logout } from '@/modules/auth/repositories/auth-repository';

export default {
  name: 'AdminLayout',

  components: {
    DrawerNavigation,
    UserProfile,
  },

  data() {
    return {
      drawer: false,

      showUserProfile: false,

      navItems: [
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
      ],
    };
  },

  methods: {
    ...mapMutations('alert', ['ADD_ALERT']),
    ...mapMutations('auth', ['REMOVE_AUTH_DATA']),

    async logout() {
      try {
        await Logout();

        this.REMOVE_AUTH_DATA();

        this.$router.push('/');

        this.ADD_ALERT({ type: ALERT_TYPES.SUCCESS, text: 'Успешный выход' });
      } catch (error) {
        this.ADD_ALERT({ type: ALERT_TYPES.ERROR, text: error.message });
      }
    },
  },
};
</script>
