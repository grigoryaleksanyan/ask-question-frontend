<template>
  <div class="admin-speakers-page">
    <div class="admin-speakers-page__actions">
      <Button
        label="+ Добавить"
        size="small"
        @click="openCreateSlideOver" />
    </div>

    <div class="admin-speakers-page__list">
      <SpeakerCard
        v-for="speaker in speakers"
        :key="speaker.id"
        :speaker="speaker"
        @update="openUpdateSlideOver(speaker)"
        @delete="openDeleteSlideOver(speaker)" />
    </div>

    <SlideOver ref="create-slide-over">
      <template #header>
        <span class="slide-over-header">Создать спикера</span>
      </template>

      <CreateSpeaker
        ref="create-speaker"
        @success="successCreateSpeaker" />

      <template #footer>
        <Button
          label="Создать"
          @click="createSpeakerRef?.submitForm()" />
        <Button
          label="Закрыть"
          outlined
          severity="secondary"
          @click="createSlideOverRef?.close()" />
      </template>
    </SlideOver>

    <SlideOver ref="update-slide-over">
      <template #header>
        <span class="slide-over-header">Изменить спикера</span>
      </template>

      <UpdateSpeaker
        v-if="currentSpeaker"
        ref="update-speaker"
        :speaker="currentSpeaker"
        @success="successUpdateSpeaker" />

      <template #footer>
        <Button
          label="Изменить"
          @click="updateSpeakerRef?.submitForm()" />
        <Button
          label="Закрыть"
          outlined
          severity="secondary"
          @click="updateSlideOverRef?.close()" />
      </template>
    </SlideOver>

    <SlideOver ref="delete-slide-over">
      <template #header>
        <span class="slide-over-header">Удалить спикера</span>
      </template>

      <DeleteSpeaker
        v-if="currentSpeaker"
        :id="currentSpeaker.id"
        ref="delete-speaker"
        @success="successDeleteSpeaker" />

      <template #footer>
        <Button
          label="Удалить"
          severity="danger"
          @click="deleteSpeakerRef?.confirm()" />
        <Button
          label="Отмена"
          outlined
          severity="secondary"
          @click="deleteSlideOverRef?.close()" />
      </template>
    </SlideOver>
  </div>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';

import type { SpeakerResponse, CreateSpeakerResponse } from '@/shared/types';

import Button from 'primevue/button';

import { useApiCall } from '@/shared/lib';
import {
  GetAllSpeakers,
  SpeakerCard,
  CreateSpeaker,
  UpdateSpeaker,
  DeleteSpeaker,
} from '@/entities/user';

defineOptions({ name: 'AdminSpeakersPage' });

const { execute: executeFetch } = useApiCall(GetAllSpeakers);

const speakers = ref<SpeakerResponse[]>([]);
const currentSpeaker = ref<SpeakerResponse | null>(null);

const createSlideOverRef = useTemplateRef('create-slide-over');
const updateSlideOverRef = useTemplateRef('update-slide-over');
const deleteSlideOverRef = useTemplateRef('delete-slide-over');

const createSpeakerRef = useTemplateRef('create-speaker');
const updateSpeakerRef = useTemplateRef('update-speaker');
const deleteSpeakerRef = useTemplateRef('delete-speaker');

async function fetchData() {
  const result = await executeFetch();
  if (result) {
    speakers.value = result;
  }
}

function openCreateSlideOver() {
  createSpeakerRef.value?.resetForm();
  createSlideOverRef.value?.open();
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function successCreateSpeaker(speaker: CreateSpeakerResponse) {
  fetchData();
  createSlideOverRef.value?.close();
}

function openUpdateSlideOver(speaker: SpeakerResponse) {
  currentSpeaker.value = speaker;
  updateSlideOverRef.value?.open();
}

function successUpdateSpeaker(modifiedSpeaker: SpeakerResponse) {
  speakers.value = speakers.value.map((s) =>
    s.id === modifiedSpeaker.id ? modifiedSpeaker : s,
  );
  updateSlideOverRef.value?.close();
}

function openDeleteSlideOver(speaker: SpeakerResponse) {
  currentSpeaker.value = speaker;
  deleteSlideOverRef.value?.open();
}

function successDeleteSpeaker(speakerId: string) {
  speakers.value = speakers.value.filter((s) => s.id !== speakerId);
  deleteSlideOverRef.value?.close();
}

fetchData();
</script>

<style lang="scss" scoped>
.admin-speakers-page {
  padding: 16px 24px;
}

.admin-speakers-page__actions {
  margin-bottom: 16px;
}

.admin-speakers-page__list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.slide-over-header {
  color: variables.$text-primary-dark;
  font-size: 16px;
  font-weight: 600;
}
</style>
