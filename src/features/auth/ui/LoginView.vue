<template>
  <div
    class="grid grid-nogutter align-items-center"
    style="height: 100vh">
    <div class="col-12 flex justify-content-center">
      <Card
        class="shadow-3 login-view__card"
        style="width: 600px">
        <template #content>
          <h1 class="mb-5">Авторизация</h1>
          <form @submit.prevent="onSubmit">
            <div class="mb-3">
              <InputText
                v-model="controls.email"
                type="email"
                placeholder="Введите Email"
                class="w-full" />
            </div>
            <div class="mb-3">
              <Password
                v-model="controls.password"
                placeholder="Введите Пароль"
                :feedback="false"
                class="w-full"
                input-class="w-full" />
            </div>
            <Button
              type="submit"
              label="Войти" />
          </form>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

import { useAlertStore } from '@/entities/alert';
import { ALERT_TYPES } from '@/shared/config';
import { useAuthStore } from '../store';
import { Login } from '../api/auth-repository';

import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';

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
      login: controls.email!,
      password: controls.password!,
    });

    authStore.setAuthData(user);

    router.go(-1);
  } catch (error) {
    const err = error as Error;
    alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: err.message });
  }
}
</script>
