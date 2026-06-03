<template>
  <div class="setup-view">
    <h1 class="setup-view__title">Первичная настройка</h1>
    <p class="setup-view__subtitle">Создание учётной записи администратора</p>
    <Form
      :resolver
      @submit="onSubmit">
      <FormField
        v-slot="$field"
        name="email"
        initial-value="">
        <label class="setup-view__label">Email</label>
        <InputText
          type="text"
          autocomplete="username"
          class="setup-view__input" />
        <Message
          v-if="$field?.invalid"
          severity="error"
          size="small"
          variant="simple">
          {{ $field.error?.message }}
        </Message>
      </FormField>

      <FormField
        v-slot="$field"
        name="password"
        initial-value="">
        <label class="setup-view__label">Пароль</label>
        <div class="setup-view__password-field">
          <InputText
            :type="isPasswordVisible ? 'text' : 'password'"
            autocomplete="new-password"
            class="setup-view__input" />
          <button
            type="button"
            class="setup-view__toggle-password"
            @click="isPasswordVisible = !isPasswordVisible">
            <i :class="isPasswordVisible ? 'pi pi-eye-slash' : 'pi pi-eye'" />
          </button>
        </div>
        <Message
          v-if="$field?.invalid"
          severity="error"
          size="small"
          variant="simple">
          {{ $field.error?.message }}
        </Message>
      </FormField>

      <FormField
        v-slot="$field"
        name="confirmPassword"
        initial-value="">
        <label class="setup-view__label">Подтверждение пароля</label>
        <div class="setup-view__password-field">
          <InputText
            :type="isConfirmPasswordVisible ? 'text' : 'password'"
            autocomplete="new-password"
            class="setup-view__input" />
          <button
            type="button"
            class="setup-view__toggle-password"
            @click="isConfirmPasswordVisible = !isConfirmPasswordVisible">
            <i
              :class="
                isConfirmPasswordVisible ? 'pi pi-eye-slash' : 'pi pi-eye'
              " />
          </button>
        </div>
        <Message
          v-if="$field?.invalid"
          severity="error"
          size="small"
          variant="simple">
          {{ $field.error?.message }}
        </Message>
      </FormField>

      <FormField
        v-slot="$field"
        name="firstName"
        initial-value="">
        <label class="setup-view__label">Имя</label>
        <InputText
          type="text"
          class="setup-view__input" />
        <Message
          v-if="$field?.invalid"
          severity="error"
          size="small"
          variant="simple">
          {{ $field.error?.message }}
        </Message>
      </FormField>

      <FormField
        v-slot="$field"
        name="lastName"
        initial-value="">
        <label class="setup-view__label">Фамилия</label>
        <InputText
          type="text"
          class="setup-view__input" />
        <Message
          v-if="$field?.invalid"
          severity="error"
          size="small"
          variant="simple">
          {{ $field.error?.message }}
        </Message>
      </FormField>

      <FormField
        name="patronymic"
        initial-value="">
        <label class="setup-view__label">Отчество</label>
        <InputText
          type="text"
          class="setup-view__input" />
      </FormField>

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
    </Form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { Form, FormField } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { z } from 'zod';

import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Message from 'primevue/message';

import { useApiCall } from '@/shared/lib';
import { useAuthStore } from '../store';
import { Setup } from '../api/auth-repository';

defineOptions({ name: 'SetupView' });

const router = useRouter();

const authStore = useAuthStore();

const isPasswordVisible = ref(false);
const isConfirmPasswordVisible = ref(false);

const { execute: executeSetup, error } = useApiCall(Setup, {
  showPreloader: false,
  onSuccess(user) {
    authStore.setAuthData(user);
    router.push('/admin');
  },
});

const schema = z
  .object({
    email: z
      .string()
      .min(1, 'Обязательное поле')
      .email('Введите корректный email'),
    password: z.string().min(6, 'Минимум 6 символов'),
    confirmPassword: z.string().min(1, 'Обязательное поле'),
    firstName: z.string().min(1, 'Обязательное поле'),
    lastName: z.string().min(1, 'Обязательное поле'),
    patronymic: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  });

const resolver = zodResolver(schema);

async function onSubmit({
  valid,
  values,
}: {
  valid: boolean;
  values: Record<string, unknown>;
}) {
  if (!valid) return;

  await executeSetup({
    email: values.email as string,
    password: values.password as string,
    confirmPassword: values.confirmPassword as string,
    firstName: values.firstName as string,
    lastName: values.lastName as string,
    patronymic: (values.patronymic as string) || null,
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

:deep(.p-formfield) {
  margin-bottom: 10px;
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

.setup-view__password-field {
  position: relative;
  display: flex;
  align-items: center;
}

.setup-view__toggle-password {
  position: absolute;
  right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border: none;
  background: transparent;
  color: variables.$text-secondary;
  cursor: pointer;
}

.setup-view__submit {
  width: 100%;
  border-radius: 6px;
  margin-top: 16px;
  font-size: 14px;
  font-weight: 500;
}

.setup-view__error {
  margin-top: 8px;
  color: variables.$error-color;
  font-size: 13px;
}
</style>
