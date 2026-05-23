<template>
  <v-card
    elevation="6"
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
          no-gutters
          align="center">
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
                    :menu-props="{ bottom: true, offsetY: true }" />
                </v-col>
              </v-row>
              <v-row>
                <v-col class="pt-0">
                  <v-select
                    v-model="controls.speaker"
                    label="Спикер*"
                    :rules="rules"
                    :menu-props="{ bottom: true, offsetY: true }" />
                </v-col>
                <v-col class="pt-0">
                  <v-text-field
                    v-model="capctha"
                    label="Код*"
                    :rules="rules" />
                </v-col>
              </v-row>
              <v-row class="mt-0">
                <v-col
                  cols="6"
                  class="d-flex justify-center"
                  align-self="center">
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
                  <template v-if="capcthaImg">
                    <v-img
                      :src="capcthaImg"
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

<script setup>
import { ref, reactive, useTemplateRef } from 'vue';

import { GetAllAreas } from '@/entities/area';
import { ALERT_TYPES } from '@/shared/config';
import { useAlertStore } from '@/entities/alert';
import { GetCapctha, Create } from '../api/questions-repository';

defineOptions({ name: 'QuestionFormCreate' });

const alertStore = useAlertStore();

const valid = ref(true);
const details = ref(false);
const areas = ref([]);
const capcthaImg = ref(null);
const capctha = ref(null);

const controls = reactive({
  text: null,
  author: null,
  speaker: null,
  area: null,
});

const rules = [
  (v) => !!v || 'Обязательное поле!',
  (v) => (v && v.trim().length !== 0) || 'Поле не должно быть пустым!',
];

const questionAdd = useTemplateRef('questionAdd');

function toggleForm() {
  if (!details.value) {
    getCapctha();
  }

  details.value = !details.value;
}

function showDetails() {
  if (!details.value) {
    toggleForm();
  }
}

async function getCapctha() {
  capcthaImg.value = null;

  try {
    capcthaImg.value = await GetCapctha();
  } catch (error) {
    alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: error.message });
  }
}

async function fetchAllAreas() {
  try {
    areas.value = await GetAllAreas();
  } catch (error) {
    alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: error.message });
  }
}

async function submitForm() {
  const result = await questionAdd.value.validate();

  if (result.valid) {
    try {
      await Create(capctha.value, controls);

      toggleForm();

      questionAdd.value.reset();

      alertStore.addAlert({
        type: ALERT_TYPES.SUCCESS,
        text: 'Ваш вопрос успешно добавлен',
      });
    } catch (error) {
      getCapctha();

      alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: error.message });
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
