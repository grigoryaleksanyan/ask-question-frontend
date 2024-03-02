<template>
  <SidebarContentWrapper title="Обратная связь">
    <template #default>
      <v-form
        ref="feedback-form"
        v-model="valid"
        class="ma-0 pa-0"
        @submit.prevent="submitForm">
        <v-row
          no-gutters
          class="mt-2">
          <v-col cols="12">
            <v-text-field
              v-model="controls.username"
              label="Имя"
              :rules="rules"
              dense
              outlined />
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="controls.email"
              label="Email"
              :rules="rules"
              dense
              outlined />
          </v-col>
          <v-col cols="12">
            <v-select
              v-model="controls.theme"
              label="Тема обращения"
              :items="themes"
              :rules="rules"
              dense
              outlined
              :menu-props="{ bottom: true, offsetY: true }" />
          </v-col>
          <v-col cols="12">
            <v-textarea
              v-model="controls.text"
              :rules="rules"
              label="Текст обращения"
              auto-grow
              outlined />
          </v-col>
        </v-row>
      </v-form>
    </template>
    <template #footer>
      <v-btn
        class="white--text"
        color="main-color"
        @click="submitForm">
        Отправить
      </v-btn>
      <v-btn
        color="main-color"
        outlined
        @click="modalClose">
        Отмена
      </v-btn>
    </template>
  </SidebarContentWrapper>
</template>

<script>
import { mapMutations } from 'vuex';

import ALERT_TYPES from '@/modules/alert/constants/alert-types';

import { Create } from '../../../repositories/feedback-repository';

export default {
  name: 'SidebarFeedbackContent',

  props: {
    modalConfirm: {
      type: Function,
      required: true,
    },

    modalClose: {
      type: Function,
      required: true,
    },
  },

  data() {
    return {
      valid: true,

      themes: ['Технические проблемы в работе сайта', 'Предложения, пожелания по работе или содержанию сайта'],

      controls: {
        username: null,
        email: null,
        theme: null,
        text: null,
      },

      rules: [(v) => !!v || 'Обязательное поле!', (v) => (v && v.trim().length !== 0) || 'Поле не должно быть пустым!'],
    };
  },

  methods: {
    ...mapMutations('alert', ['ADD_ALERT']),
    ...mapMutations('preloader', ['ADD_LOADER', 'REMOVE_LOADER']),

    async submitForm() {
      if (this.$refs['feedback-form'].validate()) {
        try {
          this.ADD_LOADER();
          await Create(this.controls);
          this.ADD_ALERT({ type: ALERT_TYPES.SUCCESS, text: 'Обратная связь отправлена' });
          this.modalConfirm();
        } catch (error) {
          this.ADD_ALERT({ type: ALERT_TYPES.ERROR, text: error.message });
        } finally {
          this.REMOVE_LOADER();
        }
      }
    },
  },
};
</script>
