<template>
  <v-container
    style="max-width: 1200px"
    class="text-left pa-5 mx-auto"
    fluid>
    <v-row>
      <v-col cols="12">
        <v-row>
          <v-col
            cols="12"
            class="d-flex align-center">
            <h1 class="text-headline-small text-sm-headline-medium mr-4">
              Спикеры
            </h1>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-btn
              size="small"
              color="blue-grey"
              @click="showCreateSpeaker = true">
              Добавить спикера
              <v-icon
                end
                theme="dark">
                mdi-plus
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <v-row>
          <v-col
            v-for="speaker in speakers"
            :key="speaker.id"
            cols="12"
            sm="6"
            md="4">
            <SpeakerCard
              :speaker="speaker"
              @update="clickUpdateSpeakerBtn(speaker)"
              @delete="clickDeleteSpeakerBtn(speaker)" />
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <CenterModal
      title="Создать спикера"
      :is-open="showCreateSpeaker"
      @close="showCreateSpeaker = false">
      <CreateSpeaker
        :is-open="showCreateSpeaker"
        @success="successCreateSpeaker"
        @cancel="showCreateSpeaker = false" />
    </CenterModal>

    <CenterModal
      title="Изменить спикера"
      :is-open="showUpdateSpeaker"
      @close="showUpdateSpeaker = false">
      <UpdateSpeaker
        v-if="showUpdateSpeaker && currentSpeaker"
        :speaker="currentSpeaker"
        :is-open="showUpdateSpeaker"
        @success="successUpdateSpeaker"
        @cancel="showUpdateSpeaker = false" />
    </CenterModal>

    <CenterModal
      title="Удалить спикера"
      :is-open="showDeleteSpeaker"
      @close="showDeleteSpeaker = false">
      <DeleteSpeaker
        v-if="showDeleteSpeaker && currentSpeaker"
        :id="currentSpeaker.id"
        :is-open="showDeleteSpeaker"
        @success="successDeleteSpeaker"
        @cancel="showDeleteSpeaker = false" />
    </CenterModal>

    <CenterModal
      title="Данные для входа"
      :is-open="showCredentials"
      @close="showCredentials = false">
      <CenterModalContentWrapper>
        <template #default>
          <p class="text-body-large mb-4">
            Спикер успешно создан. Сохраните данные для входа:
          </p>
          <div class="d-flex align-center mb-2">
            <p class="mr-2"><b>Логин:</b> {{ credentials.login }}</p>
            <v-btn
              icon
              variant="text"
              size="small"
              title="Копировать логин"
              @click="copyToClipboard(credentials.login)">
              <v-icon size="18"> mdi-content-copy </v-icon>
            </v-btn>
          </div>
          <div class="d-flex align-center">
            <p class="mr-2">
              <b>Пароль:</b> {{ credentials.generatedPassword }}
            </p>
            <v-btn
              icon
              variant="text"
              size="small"
              title="Копировать пароль"
              @click="copyToClipboard(credentials.generatedPassword)">
              <v-icon size="18"> mdi-content-copy </v-icon>
            </v-btn>
          </div>
        </template>
        <template #actions>
          <v-btn
            variant="flat"
            color="primary"
            @click="showCredentials = false">
            Закрыть
          </v-btn>
        </template>
      </CenterModalContentWrapper>
    </CenterModal>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

import type { SpeakerResponse, CreateSpeakerResponse } from '@/shared/types';

import { ALERT_TYPES } from '@/shared/config';
import {
  GetAllSpeakers,
  SpeakerCard,
  CreateSpeaker,
  UpdateSpeaker,
  DeleteSpeaker,
} from '@/entities/user';
import { useAlertStore } from '@/entities/alert';
import { usePreloaderStore } from '@/features/preloader';

defineOptions({ name: 'AdminSpeakersPage' });

const alertStore = useAlertStore();
const preloaderStore = usePreloaderStore();

const speakers = ref<SpeakerResponse[]>([]);
const currentSpeaker = ref<SpeakerResponse | null>(null);

const showCreateSpeaker = ref(false);
const showUpdateSpeaker = ref(false);
const showDeleteSpeaker = ref(false);
const showCredentials = ref(false);

const credentials = reactive({ login: '', generatedPassword: '' });

async function fetchData() {
  try {
    preloaderStore.addLoader();
    speakers.value = await GetAllSpeakers();
  } catch (error) {
    const err = error as Error;
    alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: err.message });
  } finally {
    preloaderStore.removeLoader();
  }
}

function successCreateSpeaker(speaker: CreateSpeakerResponse) {
  credentials.login = speaker.login;
  credentials.generatedPassword = speaker.generatedPassword;
  showCreateSpeaker.value = false;
  showCredentials.value = true;
  fetchData();
}

function clickUpdateSpeakerBtn(speaker: SpeakerResponse) {
  currentSpeaker.value = speaker;
  showUpdateSpeaker.value = true;
}

function successUpdateSpeaker(modifiedSpeaker: SpeakerResponse) {
  speakers.value = speakers.value.map((s) =>
    s.id === modifiedSpeaker.id ? modifiedSpeaker : s,
  );

  showUpdateSpeaker.value = false;
}

function clickDeleteSpeakerBtn(speaker: SpeakerResponse) {
  currentSpeaker.value = speaker;
  showDeleteSpeaker.value = true;
}

function successDeleteSpeaker(speakerId: string) {
  speakers.value = speakers.value.filter((s) => s.id !== speakerId);
  showDeleteSpeaker.value = false;
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    alertStore.addAlert({
      type: ALERT_TYPES.SUCCESS,
      text: 'Скопировано в буфер обмена',
    });
  } catch {
    alertStore.addAlert({
      type: ALERT_TYPES.ERROR,
      text: 'Не удалось скопировать',
    });
  }
}

fetchData();
</script>
