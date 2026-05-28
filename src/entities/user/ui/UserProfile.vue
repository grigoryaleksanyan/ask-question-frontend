<template>
  <VeeForm v-slot="{ meta, handleSubmit }">
    <CenterModalContentWrapper>
      <template #default>
        <template v-if="getUserData?.userRoleId === 2">
          <p><b>ФИО:</b> {{ getUserData?.userDetails?.fullName }}</p>
          <p><b>Почта:</b> {{ getUserData?.userDetails?.email }}</p>
          <p>
            <b>Доп. инфо:</b> {{ getUserData?.userDetails?.additionalInfo }}
          </p>
        </template>

        <p><b>Id:</b> {{ getUserData?.id }}</p>
        <p><b>Логин:</b> {{ getUserData?.login }}</p>
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
          <v-btn
            class="mt-5"
            variant="flat"
            size="small"
            @click="showChangePassword = true">
            Изменить пароль
          </v-btn>
        </template>

        <div
          v-show="showChangePassword"
          class="mt-4">
          <VeeField
            v-slot="{ field, errors }"
            name="old-password"
            rules="required">
            <v-text-field
              v-bind="field"
              v-model="controls.password"
              label="Старый пароль"
              density="compact"
              variant="outlined"
              :error-messages="errors" />
          </VeeField>

          <VeeField
            v-slot="{ field, errors }"
            name="new-password"
            rules="required">
            <v-text-field
              v-bind="field"
              v-model="controls.newPassword"
              label="Новый пароль"
              density="compact"
              variant="outlined"
              :error-messages="errors" />
          </VeeField>

          <VeeField
            v-slot="{ field, errors }"
            name="new-password-confirm"
            rules="required|confirmed:@new-password">
            <v-text-field
              v-bind="field"
              v-model="controls.confirmPassword"
              label="Подтвердите новый пароль"
              density="compact"
              variant="outlined"
              :error-messages="errors" />
          </VeeField>
        </div>
      </template>
      <template #actions>
        <v-btn
          v-if="showChangePassword"
          :disabled="!meta.valid"
          color="primary"
          @click="handleSubmit(onSubmit)">
          Сохранить
        </v-btn>
        <v-btn
          color="blue-grey"
          variant="outlined"
          @click="emit('cancel')">
          Отмена
        </v-btn>
      </template>
    </CenterModalContentWrapper>
  </VeeForm>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { storeToRefs } from 'pinia';

import type { ChangePasswordRequest } from '@/shared/types';

import { ALERT_TYPES } from '@/shared/config';
import { useAlertStore } from '@/entities/alert';
import { usePreloaderStore } from '@/features/preloader';
import { useAuthStore } from '@/features/auth';

import { ChangePassword } from '../api/user-repository';

defineOptions({ name: 'UserProfile' });

const emit = defineEmits<{
  success: [];
  cancel: [];
}>();

const alertStore = useAlertStore();
const preloaderStore = usePreloaderStore();
const authStore = useAuthStore();

const { getUserData } = storeToRefs(authStore);

const showChangePassword = ref(false);

const controls = reactive<ChangePasswordRequest>({
  password: null,
  newPassword: null,
  confirmPassword: null,
});

const getUserStringRole = computed(() => {
  if (getUserData.value?.userRoleId === 1) {
    return 'Администратор';
  }

  return 'Спикер';
});

async function onSubmit() {
  try {
    preloaderStore.addLoader();

    await ChangePassword(controls);

    alertStore.addAlert({
      type: ALERT_TYPES.SUCCESS,
      text: 'Пароль успешно изменен',
    });

    emit('success');
  } catch (error) {
    const err = error as Error;
    alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: err.message });
  } finally {
    preloaderStore.removeLoader();
  }
}
</script>

<style lang="scss" scoped>
p {
  margin: 0;
}
</style>
