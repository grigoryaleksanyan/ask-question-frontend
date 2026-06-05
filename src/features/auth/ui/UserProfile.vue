<template>
  <Form
    ref="form"
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

    <div
      v-show="showChangePassword"
      class="modal-form">
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
  </Form>
</template>

<script setup lang="ts">
import { ref, computed, useTemplateRef } from 'vue';
import { storeToRefs } from 'pinia';

import { Form, FormField } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { z } from 'zod';

import InputText from 'primevue/inputtext';
import Message from 'primevue/message';

import { requiredString, withConfirmPassword } from '@/shared/lib/zod-schemas';
import { useFormActions } from '@/shared/lib/use-form-actions';
import { useApiCall } from '@/shared/lib';
import { useAuthStore } from '../store';
import { ChangePassword } from '@/entities/user';

defineOptions({ name: 'UserProfile' });

const emit = defineEmits<{
  success: [];
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

const schema = withConfirmPassword(
  'newPassword',
  'confirmPassword',
)(
  z.object({
    password: requiredString(),
    newPassword: requiredString(),
    confirmPassword: requiredString(),
  }),
);

const resolver = zodResolver(schema);

const formRef = useTemplateRef('form');
const { submitForm } = useFormActions(formRef);

const isChangingPassword = computed(() => showChangePassword.value);

function changePassword() {
  showChangePassword.value = true;
}

function cancelChangePassword() {
  showChangePassword.value = false;
}

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

defineExpose({
  isChangingPassword,
  changePassword,
  cancelChangePassword,
  submitForm,
});
</script>

<style lang="scss" scoped>
p {
  margin: 0;
}
</style>
