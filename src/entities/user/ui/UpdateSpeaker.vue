<template>
  <v-form
    ref="updateSpeaker"
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

        <v-textarea
          v-model="additionalInfo"
          variant="outlined"
          label="Дополнительная информация"
          rows="2" />
      </template>
      <template #actions>
        <v-btn
          type="submit"
          variant="flat"
          color="primary">
          Изменить
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
import { ref, watch, onMounted, useTemplateRef } from 'vue';

import type { SpeakerResponse } from '@/shared/types';

import { ALERT_TYPES } from '@/shared/config';
import { useAlertStore } from '@/entities/alert';
import { Update } from '../api/speakers-repository';

defineOptions({ name: 'UpdateSpeaker' });

const { speaker, isOpen } = defineProps<{
  speaker: SpeakerResponse;
  isOpen?: boolean;
}>();

const emit = defineEmits<{
  success: [speaker: SpeakerResponse];
  cancel: [];
}>();

const alertStore = useAlertStore();

const valid = ref(true);
const firstName = ref(null as string | null);
const lastName = ref(null as string | null);
const patronymic = ref(null as string | null);
const email = ref(null as string | null);
const position = ref(null as string | null);
const additionalInfo = ref(null as string | null);
const updateSpeaker = useTemplateRef('updateSpeaker');

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
      updateSpeaker.value!.reset();
    } else {
      fillForm();
    }
  },
);

onMounted(() => {
  fillForm();
});

function fillForm() {
  firstName.value = speaker.firstName;
  lastName.value = speaker.lastName;
  patronymic.value = speaker.patronymic;
  email.value = speaker.email;
  position.value = speaker.position;
  additionalInfo.value = speaker.additionalInfo;
}

async function submitForm() {
  const { valid: isValid } = await updateSpeaker.value!.validate();

  if (isValid) {
    try {
      await Update({
        id: speaker.id,
        firstName: firstName.value!,
        lastName: lastName.value!,
        patronymic: patronymic.value,
        position: position.value,
        email: email.value!,
        additionalInfo: additionalInfo.value,
      });

      alertStore.addAlert({
        type: ALERT_TYPES.SUCCESS,
        text: 'Спикер успешно изменён',
      });

      emit('success', {
        ...speaker,
        firstName: firstName.value!,
        lastName: lastName.value!,
        patronymic: patronymic.value,
        position: position.value,
        email: email.value!,
        additionalInfo: additionalInfo.value,
      });
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
