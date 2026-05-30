<template>
  <div
    style="max-width: 1200px"
    class="text-left p-5 mx-auto">
    <div class="grid">
      <div class="col-12">
        <div class="grid">
          <div class="col-12 flex align-items-center">
            <h1
              class="typography__headline--small typography__headline--medium--sm mr-4">
              Спикеры
            </h1>
          </div>
        </div>

        <div class="grid">
          <div class="col-12">
            <Button
              size="small"
              severity="secondary"
              @click="showCreateSpeaker = true">
              Добавить спикера
              <i class="pi pi-plus ml-2"></i>
            </Button>
          </div>
        </div>

        <div class="grid">
          <div
            v-for="speaker in speakers"
            :key="speaker.id"
            class="col-12 sm:col-6 md:col-4">
            <SpeakerCard
              :speaker="speaker"
              @update="clickUpdateSpeakerBtn(speaker)"
              @delete="clickDeleteSpeakerBtn(speaker)" />
          </div>
        </div>
      </div>
    </div>

    <CenterModal
      title="Создать спикера"
      :is-open="showCreateSpeaker"
      @close="showCreateSpeaker = false">
      <CreateSpeaker
        ref="create-speaker"
        :is-open="showCreateSpeaker"
        @success="successCreateSpeaker"
        @cancel="showCreateSpeaker = false" />
      <template #footer>
        <Button
          label="Создать"
          @click="createSpeakerRef?.submitForm()" />
        <Button
          label="Отмена"
          outlined
          severity="secondary"
          @click="createSpeakerRef?.cancel()" />
      </template>
    </CenterModal>

    <CenterModal
      title="Изменить спикера"
      :is-open="showUpdateSpeaker"
      @close="showUpdateSpeaker = false">
      <UpdateSpeaker
        v-if="showUpdateSpeaker && currentSpeaker"
        ref="update-speaker"
        :speaker="currentSpeaker"
        :is-open="showUpdateSpeaker"
        @success="successUpdateSpeaker"
        @cancel="showUpdateSpeaker = false" />
      <template #footer>
        <Button
          label="Изменить"
          @click="updateSpeakerRef?.submitForm()" />
        <Button
          label="Отмена"
          outlined
          severity="secondary"
          @click="updateSpeakerRef?.cancel()" />
      </template>
    </CenterModal>

    <CenterModal
      title="Удалить спикера"
      :is-open="showDeleteSpeaker"
      @close="showDeleteSpeaker = false">
      <DeleteSpeaker
        v-if="showDeleteSpeaker && currentSpeaker"
        :id="currentSpeaker.id"
        ref="delete-speaker"
        :is-open="showDeleteSpeaker"
        @success="successDeleteSpeaker"
        @cancel="showDeleteSpeaker = false" />
      <template #footer>
        <Button
          label="Удалить"
          severity="danger"
          @click="deleteSpeakerRef?.confirm()" />
        <Button
          label="Отмена"
          outlined
          severity="secondary"
          @click="deleteSpeakerRef?.cancel()" />
      </template>
    </CenterModal>

    <CenterModal
      title="Данные для входа"
      :is-open="showCredentials"
      @close="showCredentials = false">
      <div
        style="max-height: 400px; overflow-y: auto"
        class="p-7">
        <p class="typography__body--large mb-4">
          Спикер успешно создан. Сохраните данные для входа:
        </p>
        <div class="flex align-items-center mb-2">
          <p class="mr-2"><b>Логин:</b> {{ credentials.login }}</p>
          <Button
            icon="pi pi-copy"
            text
            size="small"
            title="Копировать логин"
            @click="copyToClipboard(credentials.login)" />
        </div>
        <div class="flex align-items-center">
          <p class="mr-2"><b>Пароль:</b> {{ credentials.generatedPassword }}</p>
          <Button
            icon="pi pi-copy"
            text
            size="small"
            title="Копировать пароль"
            @click="copyToClipboard(credentials.generatedPassword)" />
        </div>
      </div>
      <template #footer>
        <Button
          label="Закрыть"
          @click="showCredentials = false" />
      </template>
    </CenterModal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, useTemplateRef } from 'vue';

import type { SpeakerResponse, CreateSpeakerResponse } from '@/shared/types';

import Button from 'primevue/button';

import CenterModal from '@/shared/ui/center-modal/CenterModal.vue';

import { useApiCall } from '@/shared/lib';
import { useToast } from 'primevue/usetoast';
import {
  GetAllSpeakers,
  SpeakerCard,
  CreateSpeaker,
  UpdateSpeaker,
  DeleteSpeaker,
} from '@/entities/user';

defineOptions({ name: 'AdminSpeakersPage' });

const { execute: executeFetch } = useApiCall(GetAllSpeakers);
const toast = useToast();

const speakers = ref<SpeakerResponse[]>([]);
const currentSpeaker = ref<SpeakerResponse | null>(null);

const showCreateSpeaker = ref(false);
const showUpdateSpeaker = ref(false);
const showDeleteSpeaker = ref(false);
const showCredentials = ref(false);

const credentials = reactive({ login: '', generatedPassword: '' });

const createSpeakerRef = useTemplateRef('create-speaker');
const updateSpeakerRef = useTemplateRef('update-speaker');
const deleteSpeakerRef = useTemplateRef('delete-speaker');

async function fetchData() {
  const result = await executeFetch();
  if (result) {
    speakers.value = result;
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
    toast.add({
      severity: 'success',
      detail: 'Скопировано в буфер обмена',
      group: 'api',
      life: 3000,
    });
  } catch {
    toast.add({
      severity: 'error',
      detail: 'Не удалось скопировать',
      group: 'api',
      life: undefined,
    });
  }
}

fetchData();
</script>
