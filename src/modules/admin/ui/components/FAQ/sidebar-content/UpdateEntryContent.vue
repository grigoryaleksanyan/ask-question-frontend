<template>
  <SidebarContentWrapper title="Изменить запись в FAQ">
    <template #default>
      <v-form
        ref="update-entry"
        v-model="valid"
        @submit.prevent="submitForm">
        <v-row
          no-gutters
          class="mt-2">
          <v-col cols="12">
            <v-text-field
              v-model="controls.question"
              :rules="rules"
              label="Вопрос"
              variant="outlined" />
          </v-col>

          <v-col cols="12">
            <RichEditor v-model="controls.answer" />
          </v-col>
        </v-row>
      </v-form>
    </template>
    <template #footer>
      <v-btn
        variant="flat"
        color="primary"
        @click="submitForm">
        Изменить
      </v-btn>
      <v-btn
        variant="outlined"
        color="blue-grey"
        @click="modalClose">
        Отмена
      </v-btn>
    </template>
  </SidebarContentWrapper>
</template>

<script>
import sanitizeHtml from '@/core/helpers/html-sanitize-helper';

import { mapMutations } from 'vuex';

import ALERT_TYPES from '@/modules/alert/constants/alert-types';

import { Update } from '@/modules/faq/repositories/faq-entry-repository';

import RichEditor from '@/core/ui/components/shared/RichEditor.vue';

export default {
  name: 'UpdateEntryContent',

  components: {
    RichEditor,
  },

  props: {
    modalConfirm: {
      type: Function,
      required: true,
    },

    modalClose: {
      type: Function,
      required: true,
    },

    entry: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      valid: false,

      controls: {
        question: null,
        answer: null,
      },

      rules: [(v) => !!v || 'Обязательное поле!', (v) => (v && v.trim().length !== 0) || 'Поле не должно быть пустым!'],
    };
  },

  mounted() {
    this.controls.question = this.entry.question;
    this.controls.answer = this.entry.answer;
  },

  methods: {
    ...mapMutations('alert', ['ADD_ALERT']),
    ...mapMutations('preloader', ['ADD_LOADER', 'REMOVE_LOADER']),

    async submitForm() {
      if (this.$refs['update-entry'].validate()) {
        try {
          this.ADD_LOADER();

          const entry = {
            id: this.entry.id,
            question: this.controls.question,
            answer: sanitizeHtml(this.controls.answer),
          };

          await Update(entry);

          this.ADD_ALERT({ type: ALERT_TYPES.SUCCESS, text: 'Запись успешно изменена' });

          this.modalConfirm({ ...this.entry, question: this.controls.question, answer: this.controls.answer });
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
