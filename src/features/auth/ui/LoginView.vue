<template>
  <v-container fluid>
    <v-row
      class="align-center"
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
            variant="outlined" />
          <v-text-field
            v-model="controls.password"
            type="password"
            label="Введите Пароль"
            variant="outlined" />

          <v-btn
            variant="flat"
            color="primary"
            @click="onSubmit">
            Войти
          </v-btn>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

import { useAlertStore } from '@/entities/alert';
import { ALERT_TYPES } from '@/shared/config';
import { useAuthStore } from '../store';
import { Login } from '../api/auth-repository';

defineOptions({ name: 'LoginView' });

const router = useRouter();

const authStore = useAuthStore();
const alertStore = useAlertStore();

const controls = reactive({
  email: null as string | null,
  password: null as string | null,
});

async function onSubmit() {
  try {
    const user = await Login({
      login: controls.email,
      password: controls.password,
    });

    authStore.setAuthData(user);

    router.go(-1);
  } catch (error) {
    alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: error.message });
  }
}
</script>
