<template>
  <v-container fluid>
    <v-row
      align="center"
      style="height: 100vh">
      <v-col
        cols="12"
        class="d-flex justify-center">
        <v-sheet
          class="pa-7"
          width="600"
          color="white"
          elevation="3"
          rounded>
          <h1 class="mb-5">Авторизация</h1>
          <v-text-field
            v-model="controls.email"
            type="email"
            label="Введите Email"
            outlined />
          <v-text-field
            v-model="controls.password"
            type="password"
            label="Введите Пароль"
            outlined />

          <v-btn
            depressed
            color="primary"
            @click="onSubmit">
            Войти
          </v-btn>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapMutations } from 'vuex';

import ALERT_TYPES from '@/modules/alert/constants/alert-types';
import { Login } from '../../repositories/auth-repository';

export default {
  name: 'LoginView',

  data() {
    return {
      controls: {
        email: null,
        password: null,
      },
    };
  },

  methods: {
    ...mapMutations('alert', ['ADD_ALERT']),
    ...mapMutations('auth', ['SET_AUTH_DATA']),

    async onSubmit() {
      try {
        const user = await Login({ login: this.controls.email, password: this.controls.password });

        this.SET_AUTH_DATA(user);

        this.$router.go(-1);
      } catch (error) {
        this.ADD_ALERT({ type: ALERT_TYPES.ERROR, text: error.message });
      }
    },
  },
};
</script>
