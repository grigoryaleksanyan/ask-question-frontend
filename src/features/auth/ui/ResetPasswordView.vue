<template>
  <div class="reset-password-view">
    <template v-if="tokenError">
      <h1 class="reset-password-view__title">Ссылка недействительна</h1>
      <p class="reset-password-view__subtitle">
        Ссылка для сброса пароля недействительна или истекла.
      </p>
      <div class="reset-password-view__footer">
        <router-link
          :to="{ name: 'forgot-password' }"
          class="reset-password-view__link">
          Запросить новую ссылку
        </router-link>
      </div>
    </template>

    <template v-else>
      <h1 class="reset-password-view__title">Новый пароль</h1>
      <p class="reset-password-view__subtitle">
        Введите новый пароль для вашей учётной записи.
      </p>
      <Form
        :resolver
        @submit="onFormSubmit">
        <div class="reset-password-view__field">
          <label class="reset-password-view__label">Новый пароль</label>
          <FormField
            v-slot="$field"
            name="newPassword"
            initial-value="">
            <Password
              toggle-mask
              :feedback="false"
              :input-props="{ autocomplete: 'new-password' }"
              class="reset-password-view__password" />
            <Message
              v-if="$field?.invalid"
              severity="error"
              size="small"
              variant="simple">
              {{ $field.error?.message }}
            </Message>
          </FormField>
        </div>
        <div class="reset-password-view__field">
          <label class="reset-password-view__label"> Подтвердите пароль </label>
          <FormField
            v-slot="$field"
            name="confirmPassword"
            initial-value="">
            <Password
              toggle-mask
              :feedback="false"
              :input-props="{ autocomplete: 'new-password' }"
              class="reset-password-view__password" />
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
          label="Сбросить пароль"
          class="reset-password-view__submit" />
        <p
          v-if="error"
          class="reset-password-view__error">
          {{ error.message }}
        </p>
      </Form>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Form, FormField } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { z } from 'zod';

import Password from 'primevue/password';
import Button from 'primevue/button';
import Message from 'primevue/message';

import { passwordString, requiredString } from '@/shared/lib/zod-schemas';
import { withConfirmPassword } from '@/shared/lib/zod-schemas/compositions';
import { useApiCall } from '@/shared/lib';
import { ResetPassword } from '../api/auth-repository';

defineOptions({ name: 'ResetPasswordView' });

const route = useRoute();
const router = useRouter();

const token = computed(() => route.query.token as string | undefined);
const apiTokenError = ref(false);
const tokenError = computed(() => !token.value || apiTokenError.value);

const { execute: executeResetPassword, error } = useApiCall(ResetPassword, {
  showPreloader: false,
  successMessage: 'Пароль успешно изменён',
  onSuccess() {
    router.push({ name: 'login' });
  },
  errorMapper(err) {
    if (
      err.message?.includes('недействительна') ||
      err.message?.includes('истекла')
    ) {
      apiTokenError.value = true;
      return '';
    }
    return err.message;
  },
});

const schema = z
  .object({
    newPassword: passwordString(),
    confirmPassword: requiredString(),
  })
  .pipe(
    withConfirmPassword(
      'newPassword',
      'confirmPassword',
    ) as unknown as z.ZodType,
  );

const resolver = zodResolver(schema);

async function onFormSubmit({
  valid,
  values,
}: {
  valid: boolean;
  values: Record<string, unknown>;
}) {
  if (!valid || !token.value) return;

  await executeResetPassword({
    token: token.value,
    newPassword: values.newPassword as string,
    confirmPassword: values.confirmPassword as string,
  });
}
</script>

<style lang="scss" scoped>
.reset-password-view {
  max-width: 320px;
  padding: 80px 16px;
  margin: 0 auto;
}

.reset-password-view__title {
  margin-bottom: 4px;
  color: variables.$text-primary;
  font-size: 20px;
  font-weight: 500;
  text-align: center;
}

.reset-password-view__subtitle {
  margin-bottom: 24px;
  color: variables.$text-muted;
  font-size: 14px;
  text-align: center;
}

.reset-password-view__field {
  margin-bottom: 16px;
}

.reset-password-view__label {
  display: block;
  margin-bottom: 4px;
  color: variables.$text-secondary;
  font-size: 12px;
}

.reset-password-view__password {
  width: 100%;
}

:deep(.reset-password-view__password input) {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid variables.$border-light;
  border-radius: 6px;
  background: variables.$surface-card;
  font-size: 14px;
}

.reset-password-view__submit {
  width: 100%;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
}

.reset-password-view__error {
  margin-top: 8px;
  color: variables.$error-color;
  font-size: 13px;
}

.reset-password-view__footer {
  margin-top: 12px;
  text-align: center;
}

.reset-password-view__link {
  color: variables.$primary-color;
  font-size: 13px;
  text-decoration: none;
}
</style>
