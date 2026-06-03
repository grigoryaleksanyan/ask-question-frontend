<template>
  <div class="setup-view">
    <h1 class="setup-view__title">Первичная настройка</h1>
    <p class="setup-view__subtitle">Создание учётной записи администратора</p>
    <form @submit.prevent="onSubmit">
      <div class="setup-view__field">
        <label class="setup-view__label">Email</label>
        <InputText
          v-model="controls.email"
          autocomplete="username"
          class="setup-view__input" />
      </div>
      <div class="setup-view__field">
        <label class="setup-view__label">Пароль</label>
        <Password
          v-model="controls.password"
          autocomplete="new-password"
          :feedback="false"
          class="setup-view__password"
          input-class="setup-view__input" />
      </div>
      <div class="setup-view__field">
        <label class="setup-view__label">Подтверждение пароля</label>
        <Password
          v-model="controls.confirmPassword"
          autocomplete="new-password"
          :feedback="false"
          class="setup-view__password"
          input-class="setup-view__input" />
      </div>
      <div class="setup-view__field">
        <label class="setup-view__label">Имя</label>
        <InputText
          v-model="controls.firstName"
          class="setup-view__input" />
      </div>
      <div class="setup-view__field">
        <label class="setup-view__label">Фамилия</label>
        <InputText
          v-model="controls.lastName"
          class="setup-view__input" />
      </div>
      <div class="setup-view__field">
        <label class="setup-view__label">Отчество</label>
        <InputText
          v-model="controls.patronymic"
          class="setup-view__input" />
      </div>
      <Button
        type="submit"
        label="Создать администратора"
        severity="primary"
        class="setup-view__submit" />
      <p
        v-if="error"
        class="setup-view__error">
        {{ error.message }}
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

import { useApiCall } from '@/shared/lib';
import { useAuthStore } from '../store';
import { Setup } from '../api/auth-repository';

import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';

defineOptions({ name: 'SetupView' });

const router = useRouter();

const authStore = useAuthStore();

const { execute: executeSetup, error } = useApiCall(Setup, {
  showPreloader: false,
  onSuccess(user) {
    authStore.setAuthData(user);
    router.push('/admin');
  },
});

const controls = reactive({
  email: null as string | null,
  password: null as string | null,
  confirmPassword: null as string | null,
  firstName: null as string | null,
  lastName: null as string | null,
  patronymic: null as string | null,
});

async function onSubmit() {
  if (controls.password !== controls.confirmPassword) {
    return;
  }

  await executeSetup({
    email: controls.email!,
    password: controls.password!,
    firstName: controls.firstName!,
    lastName: controls.lastName!,
    patronymic: controls.patronymic,
  });
}
</script>

<style lang="scss" scoped>
.setup-view {
  max-width: 320px;
  padding: 80px 16px;
  margin: 0 auto;
}

.setup-view__title {
  margin-bottom: 4px;
  color: variables.$text-primary;
  font-size: 20px;
  font-weight: 500;
  text-align: center;
}

.setup-view__subtitle {
  margin-bottom: 24px;
  color: variables.$text-muted;
  font-size: 14px;
  text-align: center;
}

.setup-view__field {
  margin-bottom: 16px;
}

.setup-view__label {
  display: block;
  margin-bottom: 4px;
  color: variables.$text-secondary;
  font-size: 12px;
}

:deep(.setup-view__input) {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid variables.$border-light;
  border-radius: 6px;
  background: variables.$surface-card;
  font-size: 14px;
}

.setup-view__password {
  width: 100%;
}

.setup-view__submit {
  width: 100%;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
}

.setup-view__error {
  margin-top: 8px;
  color: variables.$error-color;
  font-size: 13px;
}
</style>
