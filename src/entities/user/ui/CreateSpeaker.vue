<template>
  <v-form
    ref="createSpeaker"
    v-model="valid"
    @submit.prevent="submitForm">
    <CenterModalContentWrapper>
      <template #default>
        <v-text-field
          v-model="lastName"
          :rules="requiredRules"
          variant="outlined"
          label="Фамилия" />

        <v-text-field
          v-model="firstName"
          :rules="requiredRules"
          variant="outlined"
          label="Имя" />

        <v-text-field
          v-model="patronymic"
          variant="outlined"
          label="Отчество" />

        <v-text-field
          v-model="email"
          :rules="emailRules"
          variant="outlined"
          label="Почта" />

        <v-text-field
          v-model="position"
          variant="outlined"
          label="Должность" />
      </template>
      <template #actions>
        <v-btn
          type="submit"
          variant="flat"
          color="primary">
          Создать
        </v-btn>
        <v-btn
          variant="outlined"
          color="blue-grey"
          @click="cancel">
          Отмена
        </v-btn>
      </template>
    </CenterModalContentWrapper>
  </v-form>
</template>

<script setup lang="ts">
import { ref, watch, useTemplateRef } from 'vue';

import type { CreateSpeakerResponse } from '@/shared/types';

import { ALERT_TYPES } from '@/shared/config';
import { useAlertStore } from '@/entities/alert';
import { Create } from '../api/speakers-repository';

defineOptions({ name: 'CreateSpeaker' });

const { isOpen } = defineProps<{
  isOpen?: boolean;
}>();

const emit = defineEmits<{
  success: [speaker: CreateSpeakerResponse];
  cancel: [];
}>();

const alertStore = useAlertStore();

const valid = ref(true);
const firstName = ref(null as string | null);
const lastName = ref(null as string | null);
const patronymic = ref(null as string | null);
const email = ref(null as string | null);
const position = ref(null as string | null);
const createSpeaker = useTemplateRef('createSpeaker');

const requiredRules = [
  (v: string) => !!v || 'Обязательное поле!',
  (v: string) => (v && v.trim().length > 0) || 'Поле не должно быть пустым!',
];

const emailRules = [
  (v: string) => !!v || 'Обязательное поле!',
  (v: string) => (v && v.trim().length > 0) || 'Поле не должно быть пустым!',
  (v: string) => /.+@.+\..+/.test(v) || 'Почта должна быть валидна!',
];

watch(
  () => isOpen,
  (newValue) => {
    if (!newValue) {
      createSpeaker.value!.reset();
    }
  },
);

async function submitForm() {
  const { valid: isValid } = await createSpeaker.value!.validate();

  if (isValid) {
    try {
      const createdSpeaker = await Create({
        firstName: firstName.value!,
        lastName: lastName.value!,
        patronymic: patronymic.value,
        position: position.value,
        email: email.value!,
      });

      alertStore.addAlert({
        type: ALERT_TYPES.SUCCESS,
        text: 'Спикер успешно создан',
      });

      emit('success', createdSpeaker);
    } catch (error) {
      const err = error as Error;
      alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: err.message });
    }
  }
}

function cancel() {
  emit('cancel');
}
</script>
