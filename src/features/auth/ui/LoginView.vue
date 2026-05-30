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
                autocomplete="username"
                placeholder="Введите Email"
                class="w-full" />
            </div>
            <div class="mb-3">
              <Password
                v-model="controls.password"
                placeholder="Введите Пароль"
                autocomplete="current-password"
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

import { useApiCall } from '@/shared/lib';
import { useAuthStore } from '../store';
import { Login } from '../api/auth-repository';

import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';

defineOptions({ name: 'LoginView' });

const router = useRouter();

const authStore = useAuthStore();

const { execute: executeLogin } = useApiCall(Login, {
  showPreloader: false,
  onSuccess(user) {
    authStore.setAuthData(user);
    router.go(-1);
  },
});

const controls = reactive({
  email: null as string | null,
  password: null as string | null,
});

async function onSubmit() {
  await executeLogin({
    login: controls.email!,
    password: controls.password!,
  });
}
</script>
