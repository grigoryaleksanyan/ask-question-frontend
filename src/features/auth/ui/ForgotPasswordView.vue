<template>
  <div class="forgot-password-view">
    <h1 class="forgot-password-view__title">Восстановление пароля</h1>
    <p class="forgot-password-view__subtitle">
      Введите email, на который зарегистрирована учётная запись. Мы отправим
      ссылку для сброса пароля.
    </p>

    <div
      v-if="isSubmitted"
      class="forgot-password-view__success">
      <p class="forgot-password-view__success-text">
        Если аккаунт с таким email существует, на него отправлена ссылка для
        сброса пароля.
      </p>
      <router-link
        :to="{ name: 'login' }"
        class="forgot-password-view__link">
        Вернуться к входу
      </router-link>
    </div>

    <Form
      v-else
      :resolver
      @submit="onFormSubmit">
      <div class="forgot-password-view__field">
        <label class="forgot-password-view__label">Email</label>
        <FormField
          v-slot="$field"
          name="email"
          initial-value="">
          <InputText
            autocomplete="username"
            class="forgot-password-view__input" />
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
        label="Отправить ссылку"
        class="forgot-password-view__submit" />
      <p
        v-if="error"
        class="forgot-password-view__error">
        {{ error.message }}
      </p>
      <div class="forgot-password-view__footer">
        <router-link
          :to="{ name: 'login' }"
          class="forgot-password-view__link">
          Вернуться к входу
        </router-link>
      </div>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import { Form, FormField } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { z } from 'zod';

import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Message from 'primevue/message';

import { emailString } from '@/shared/lib/zod-schemas';
import { useApiCall } from '@/shared/lib';
import { ForgotPassword } from '../api/auth-repository';

defineOptions({ name: 'ForgotPasswordView' });

const isSubmitted = ref(false);

const { execute: executeForgotPassword, error } = useApiCall(ForgotPassword, {
  showPreloader: false,
  onSuccess() {
    isSubmitted.value = true;
  },
});

const schema = z.object({
  email: emailString(),
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

  await executeForgotPassword({
    email: values.email as string,
  });
}
</script>

<style lang="scss" scoped>
.forgot-password-view {
  max-width: 320px;
  padding: 80px 16px;
  margin: 0 auto;
}

.forgot-password-view__title {
  margin-bottom: 4px;
  color: variables.$text-primary;
  font-size: 20px;
  font-weight: 500;
  text-align: center;
}

.forgot-password-view__subtitle {
  margin-bottom: 24px;
  color: variables.$text-muted;
  font-size: 14px;
  text-align: center;
}

.forgot-password-view__field {
  margin-bottom: 16px;
}

.forgot-password-view__label {
  display: block;
  margin-bottom: 4px;
  color: variables.$text-secondary;
  font-size: 12px;
}

:deep(.forgot-password-view__input) {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid variables.$border-light;
  border-radius: 6px;
  background: variables.$surface-card;
  font-size: 14px;
}

.forgot-password-view__submit {
  width: 100%;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
}

.forgot-password-view__error {
  margin-top: 8px;
  color: variables.$error-color;
  font-size: 13px;
}

.forgot-password-view__success {
  text-align: center;
}

.forgot-password-view__success-text {
  margin-bottom: 16px;
  color: variables.$text-secondary;
  font-size: 14px;
  line-height: 1.5;
}

.forgot-password-view__link {
  color: variables.$primary-color;
  font-size: 13px;
  text-decoration: none;
}

.forgot-password-view__footer {
  margin-top: 12px;
  text-align: center;
}
</style>
