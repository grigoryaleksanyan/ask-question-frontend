<template>
  <Form
    v-slot="$form"
    :resolver
    @submit="onSubmit">
    <template v-if="getUserData?.userRoleId === 2">
      <p>
        <b>ФИО:</b>
        {{ getUserData?.userDetails?.lastName }}
        {{ getUserData?.userDetails?.firstName }}
        {{ getUserData?.userDetails?.patronymic }}
      </p>
      <p>
        <b>Должность:</b>
        {{ getUserData?.userDetails?.position }}
      </p>
      <p><b>Доп. инфо:</b> {{ getUserData?.userDetails?.additionalInfo }}</p>
    </template>

    <p><b>Id:</b> {{ getUserData?.id }}</p>
    <p><b>Email:</b> {{ getUserData?.email }}</p>
    <p><b>Роль:</b> {{ getUserStringRole }}</p>
    <p>
      <b>Создан:</b>
      {{
        getUserData?.created
          ? new Date(getUserData.created).toLocaleDateString()
          : ''
      }}
    </p>
    <p>
      <b>Изменен:</b>
      {{
        getUserData?.updated
          ? new Date(getUserData.updated).toLocaleDateString()
          : '-'
      }}
    </p>

    <template v-if="!showChangePassword">
      <Button
        class="mt-5"
        size="small"
        @click="showChangePassword = true">
        Изменить пароль
      </Button>
    </template>

    <div
      v-show="showChangePassword"
      class="mt-4">
      <FormField
        v-slot="$field"
        name="password"
        initial-value="">
        <InputText
          type="password"
          placeholder="Старый пароль"
          class="w-full" />
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
        name="newPassword"
        initial-value="">
        <InputText
          type="password"
          placeholder="Новый пароль"
          class="w-full" />
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
        <InputText
          type="password"
          placeholder="Подтвердите новый пароль"
          class="w-full" />
        <Message
          v-if="$field?.invalid"
          severity="error"
          size="small"
          variant="simple">
          {{ $field.error?.message }}
        </Message>
      </FormField>
    </div>

    <div class="flex gap-2 mt-4">
      <Button
        v-if="showChangePassword"
        :disabled="!$form.valid"
        type="submit">
        Сохранить
      </Button>
      <Button
        severity="secondary"
        outlined
        @click="emit('cancel')">
        Отмена
      </Button>
    </div>
  </Form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';

import { Form, FormField } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { z } from 'zod';

import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Message from 'primevue/message';

import { useApiCall } from '@/shared/lib';
import { useAuthStore } from '@/features/auth';

import { ChangePassword } from '../api/user-repository';

defineOptions({ name: 'UserProfile' });

const emit = defineEmits<{
  success: [];
  cancel: [];
}>();

const { execute: executeChangePassword } = useApiCall(ChangePassword, {
  successMessage: 'Пароль успешно изменен',
  onSuccess: () => {
    emit('success');
  },
});

const authStore = useAuthStore();

const { getUserData } = storeToRefs(authStore);

const showChangePassword = ref(false);

const schema = z
  .object({
    password: z.string().min(1, 'Обязательное поле'),
    newPassword: z.string().min(1, 'Обязательное поле'),
    confirmPassword: z.string().min(1, 'Обязательное поле'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  });

const resolver = zodResolver(schema);

const getUserStringRole = computed(() => {
  if (getUserData.value?.userRoleId === 1) {
    return 'Администратор';
  }

  return 'Спикер';
});

async function onSubmit({
  valid,
  values,
}: {
  valid: boolean;
  values: Record<string, unknown>;
}) {
  if (!valid) return;

  await executeChangePassword({
    password: values.password as string,
    newPassword: values.newPassword as string,
    confirmPassword: values.confirmPassword as string,
  });
}
</script>

<style lang="scss" scoped>
p {
  margin: 0;
}
</style>
