<template>
  <v-card
    elevation="6"
    color="#E8EAF6"
    width="600">
    <v-form
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
              row-height="1"
              auto-grow
              background-color="white"
              outlined
              hide-details
              no-resize
              placeholder="Задайте вопрос"
              @change="showDetails" />
          </v-col>
          <v-col
            class="d-flex justify-end"
            style="max-width: 85px">
            <v-btn
              depressed
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
                  <v-text-field label="Имя" />
                </v-col>
                <v-col>
                  <v-select
                    label="МРФ/ДЗО*"
                    :rules="rules"
                    :menu-props="{ bottom: true, offsetY: true }" />
                </v-col>
              </v-row>
              <v-row class="mt-0">
                <v-col class="pt-0">
                  <v-select
                    label="Спикер*"
                    :rules="rules"
                    :menu-props="{ bottom: true, offsetY: true }" />
                </v-col>
                <v-col class="pt-0">
                  <v-text-field
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
                    depressed
                    color="primary">
                    Отправить
                  </v-btn>
                </v-col>
                <v-col
                  cols="6"
                  class="d-flex justify-center">
                  <v-img
                    :src="require('@/core/assets/img/captcha.png')"
                    style="width: 100%; max-width: 160px; height: auto"
                    alt="captcha" />
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
export default {
  name: 'QuestionAddForm',
  data() {
    return {
      valid: true,
      details: false,

      rules: [(v) => !!v || 'Обязательное поле!', (v) => (v && v.trim().length !== 0) || 'Поле не должно быть пустым!'],
    };
  },
  methods: {
    toggleForm() {
      this.details = !this.details;
    },

    showDetails() {
      if (!this.details) {
        this.details = true;
      }
    },

    submitForm() {},
  },
};
</script>

<style lang="scss">
.main-form-textarea textarea {
  max-height: 90px !important;
  margin-top: 0 !important;
  margin-right: 1px;
  padding-top: 15px !important;
  padding-bottom: 10px !important;
  overflow-y: auto !important;
  line-height: 1.5em !important;
}

.main-form-textarea textarea::-webkit-scrollbar {
  width: 5px;
}

.main-form-textarea textarea::-webkit-scrollbar-track {
  background: transparent;
}

.main-form-textarea textarea::-webkit-scrollbar-thumb {
  background-color: $scrollbar-color;
  border-radius: 5px;
}
</style>
