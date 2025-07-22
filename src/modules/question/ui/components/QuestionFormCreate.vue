<template>
  <v-card
    elevation="6"
    color="#E8EAF6"
    width="600">
    <v-form
      ref="question-add"
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

<script>
import { mapMutations } from 'vuex';

import ALERT_TYPES from '@/modules/alert/constants/alert-types';
import {
  GetCapctha,
  Create,
} from '@/modules/question/repositories/questions-repository';

import { GetAll } from '@/modules/shared/repositories/areas-repository';

export default {
  name: 'QuestionFormCreate',

  data() {
    return {
      valid: true,
      details: false,

      areas: [],
      capcthaImg: null,
      capctha: null,

      controls: { text: null, author: null, speaker: null, area: null },

      rules: [
        (v) => !!v || 'Обязательное поле!',
        (v) => (v && v.trim().length !== 0) || 'Поле не должно быть пустым!',
      ],
    };
  },

  created() {
    this.GetAllAreas();
  },

  methods: {
    ...mapMutations('alert', ['ADD_ALERT']),

    toggleForm() {
      if (!this.details) {
        this.getCapctha();
      }

      this.details = !this.details;
    },

    showDetails() {
      if (!this.details) {
        this.toggleForm();
      }
    },

    async getCapctha() {
      this.capcthaImg = null;

      try {
        this.capcthaImg = await GetCapctha();
      } catch (error) {
        this.ADD_ALERT({ type: ALERT_TYPES.ERROR, text: error.message });
      }
    },

    async GetAllAreas() {
      try {
        this.areas = await GetAll();
      } catch (error) {
        this.ADD_ALERT({ type: ALERT_TYPES.ERROR, text: error.message });
      }
    },

    async submitForm() {
      const result = await this.$refs['question-add'].validate();

      if (result.valid) {
        try {
          await Create(this.capctha, this.controls);

          this.toggleForm();

          this.$refs['question-add'].reset();

          this.ADD_ALERT({
            type: ALERT_TYPES.SUCCESS,
            text: 'Ваш вопрос успешно добавлен',
          });
        } catch (error) {
          this.getCapctha();

          this.ADD_ALERT({ type: ALERT_TYPES.ERROR, text: error.message });
        }
      }
    },
  },
};
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
