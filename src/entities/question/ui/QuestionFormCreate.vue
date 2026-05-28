<template>
  <v-card
    elevation="5"
    color="#E8EAF6"
    width="600">
    <v-form
      ref="questionAdd"
      v-model="valid"
      @submit.prevent="submitForm">
      <v-container
        fluid
        class="pa-2">
        <v-row
          class="align-center"
          no-gutters>
          <v-col
            cols="9"
            sm="10">
            <v-textarea
              class="main-form-textarea"
              :rules="rules"
              rows="1"
              max-rows="3"
              auto-grow
              bg-color="white"
              variant="outlined"
              hide-details
              no-resize
              placeholder="Задайте вопрос"
              @change="showDetails" />
          </v-col>
          <v-col
            class="d-flex justify-end"
            style="max-width: 85px">
            <v-btn
              title="Дополнительные сведения"
              variant="flat"
              elevation="1"
              color="primary"
              @click="toggleForm">
              <v-icon>mdi-account-question</v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <v-expand-transition>
          <v-row
            v-show="details"
            no-gutters>
            <v-col
              cols="12"
              class="px-0 py-2 ma-0">
              <v-divider />
            </v-col>
            <v-col class="pa-2">
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="controls.author"
                    label="Имя" />
                </v-col>
                <v-col>
                  <v-select
                    v-model="controls.area"
                    :items="areas"
                    item-title="title"
                    item-value="title"
                    label="Область*"
                    :rules="rules"
                    :menu-props="
                      { location: 'bottom' } as Record<string, unknown>
                    " />
                </v-col>
              </v-row>
              <v-row>
                <v-col class="pt-0">
                  <v-select
                    v-model="controls.speaker"
                    label="Спикер*"
                    :rules="rules"
                    :menu-props="
                      { location: 'bottom' } as Record<string, unknown>
                    " />
                </v-col>
                <v-col class="pt-0">
                  <v-text-field
                    v-model="captcha"
                    label="Код*"
                    :rules="rules" />
                </v-col>
              </v-row>
              <v-row class="mt-0">
                <v-col
                  cols="6"
                  class="d-flex justify-center align-self-center">
                  <v-btn
                    type="submit"
                    elevation="1"
                    color="primary">
                    Отправить
                  </v-btn>
                </v-col>
                <v-col
                  cols="6"
                  class="d-flex justify-center">
                  <template v-if="captchaData?.captchaImage">
                    <v-img
                      :src="captchaData.captchaImage"
                      style="width: 100%; max-width: 160px; height: 48px"
                      alt="captcha" />
                  </template>
                  <template v-else>
                    <v-icon
                      color="grey"
                      style="height: 48px">
                      mdi-spin mdi-autorenew
                    </v-icon>
                  </template>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-expand-transition>
      </v-container>
    </v-form>
  </v-card>
</template>

<script setup lang="ts">
import { ref, reactive, useTemplateRef } from 'vue';

import type { AreaResponse, CaptchaResponse } from '@/shared/types';

import { GetAllAreas } from '@/entities/area';
import { ALERT_TYPES } from '@/shared/config';
import { useAlertStore } from '@/entities/alert';
import { GetCaptcha, Create } from '../api/questions-repository';

defineOptions({ name: 'QuestionFormCreate' });

const alertStore = useAlertStore();

const valid = ref(true);
const details = ref(false);
const areas = ref<AreaResponse[]>([]);
const captchaData = ref<CaptchaResponse | null>(null);
const captcha = ref(null as string | null);

const controls = reactive({
  text: null as string | null,
  author: null as string | null,
  speaker: null as string | null,
  area: undefined as string | undefined,
});

const rules = [
  (v: string) => !!v || 'Обязательное поле!',
  (v: string) => (v && v.trim().length > 0) || 'Поле не должно быть пустым!',
];

const questionAdd = useTemplateRef('questionAdd');

function toggleForm() {
  if (!details.value) {
    getCaptcha();
  }

  details.value = !details.value;
}

function showDetails() {
  if (!details.value) {
    toggleForm();
  }
}

async function getCaptcha() {
  captchaData.value = null;

  try {
    captchaData.value = await GetCaptcha();
  } catch (error) {
    const err = error as Error;
    alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: err.message });
  }
}

async function fetchAllAreas() {
  try {
    areas.value = await GetAllAreas();
  } catch (error) {
    const err = error as Error;
    alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: err.message });
  }
}

async function submitForm() {
  const result = await questionAdd.value!.validate();

  if (result.valid) {
    try {
      await Create(captchaData.value!.id, {
        text: controls.text!,
        author: controls.author!,
        area: controls.area ?? null,
        speaker: controls.speaker!,
      });

      toggleForm();

      questionAdd.value!.reset();

      alertStore.addAlert({
        type: ALERT_TYPES.SUCCESS,
        text: 'Ваш вопрос успешно добавлен',
      });
    } catch (error) {
      getCaptcha();

      const err = error as Error;
      alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: err.message });
    }
  }
}

fetchAllAreas();
</script>

<style lang="scss" scoped>
:deep(.main-form-textarea textarea) {
  margin: 3px;
}

:deep(.main-form-textarea textarea::-webkit-scrollbar) {
  width: 5px;
}

:deep(.main-form-textarea textarea::-webkit-scrollbar-track) {
  background: transparent;
}

:deep(.main-form-textarea textarea::-webkit-scrollbar-thumb) {
  border-radius: 5px;
  background-color: variables.$scrollbar-color;
}
</style>
