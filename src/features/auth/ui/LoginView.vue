<template>
  <div class="login-view">
    <h1 class="login-view__title">Вход</h1>
    <p class="login-view__subtitle">Панель администратора</p>
    <Form
      :resolver
      @submit="onFormSubmit">
      <div class="login-view__field">
        <label class="login-view__label">Email</label>
        <FormField
          v-slot="$field"
          name="email"
          initial-value="">
          <InputText
            autocomplete="username"
            class="login-view__input" />
          <Message
            v-if="$field?.invalid"
            severity="error"
            size="small"
            variant="simple">
            {{ $field.error?.message }}
          </Message>
        </FormField>
      </div>
      <div class="login-view__field">
        <label class="login-view__label">Пароль</label>
        <FormField
          v-slot="$field"
          name="password"
          initial-value="">
          <Password
            autocomplete="current-password"
            :feedback="false"
            class="login-view__password"
            input-class="login-view__input" />
          <Message
            v-if="$field?.invalid"
            severity="error"
            size="small"
            variant="simple">
            {{ $field.error?.message }}
          </Message>
        </FormField>
      </div>
      <Button
        type="submit"
        label="Войти"
        severity="primary"
        class="login-view__submit" />
      <p
        v-if="error"
        class="login-view__error">
        {{ error.message }}
      </p>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';

import { Form, FormField } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { z } from 'zod';

import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import Message from 'primevue/message';

import { emailString, requiredString } from '@/shared/lib/zod-schemas';
import { useApiCall } from '@/shared/lib';
import { useAuthStore } from '../store';
import { Login } from '../api/auth-repository';

defineOptions({ name: 'LoginView' });

const router = useRouter();
const route = useRoute();

const authStore = useAuthStore();

const { execute: executeLogin, error } = useApiCall(Login, {
  showPreloader: false,
  onSuccess(user) {
    authStore.setAuthData(user);
    router.push((route.query.redirect as string) || '/admin');
  },
});

const schema = z.object({
  email: emailString(),
  password: requiredString(),
});

const resolver = zodResolver(schema);

async function onFormSubmit({
  valid,
  values,
}: {
  valid: boolean;
  values: Record<string, unknown>;
}) {
  if (!valid) return;

  await executeLogin({
    email: values.email as string,
    password: values.password as string,
  });
}
</script>

<style lang="scss" scoped>
.login-view {
  max-width: 320px;
  padding: 80px 16px;
  margin: 0 auto;
}

.login-view__title {
  margin-bottom: 4px;
  color: variables.$text-primary;
  font-size: 20px;
  font-weight: 500;
  text-align: center;
}

.login-view__subtitle {
  margin-bottom: 24px;
  color: variables.$text-muted;
  font-size: 14px;
  text-align: center;
}

.login-view__field {
  margin-bottom: 16px;
}

.login-view__label {
  display: block;
  margin-bottom: 4px;
  color: variables.$text-secondary;
  font-size: 12px;
}

:deep(.login-view__input) {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid variables.$border-light;
  border-radius: 6px;
  background: variables.$surface-card;
  font-size: 14px;
}

.login-view__password {
  width: 100%;
}

.login-view__submit {
  width: 100%;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
}

.login-view__error {
  margin-top: 8px;
  color: variables.$error-color;
  font-size: 13px;
}
</style>
