<template>
  <v-form
    ref="create-entry"
    v-model="valid"
    @submit.prevent="submitForm">
    <SidebarContentWrapper>
      <template #default>
        <v-row
          no-gutters
          class="mt-2">
          <v-col cols="12">
            <v-text-field
              v-model="controls.question"
              :rules="rules"
              label="Вопрос"
              outlined />
          </v-col>

          <v-col cols="12">
            <RichEditor v-model="controls.answer" />
          </v-col>
        </v-row>
      </template>
      <template #footer>
        <v-btn
          type="submit"
          class="mr-2 white--text"
          color="main-color">
          Создать
        </v-btn>
        <v-btn
          color="main-color"
          outlined
          @click="cancel">
          Отмена
        </v-btn>
      </template>
    </SidebarContentWrapper>
  </v-form>
</template>

<script>
import xss from 'xss';

import { mapMutations } from 'vuex';

import ALERT_TYPES from '@/modules/alert/constants/alert-types';

import { Create } from '@/modules/faq/repositories/faq-entry-repository';

import RichEditor from '@/core/ui/components/shared/RichEditor.vue';

export default {
  name: 'CreateEntryContent',

  components: {
    RichEditor,
  },

  props: {
    categoryId: {
      type: String,
      required: true,
    },

    order: {
      type: Number,
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

  methods: {
    ...mapMutations('alert', ['ADD_ALERT']),
    ...mapMutations('preloader', ['ADD_LOADER', 'REMOVE_LOADER']),

    async submitForm() {
      if (this.$refs['create-entry'].validate()) {
        try {
          this.ADD_LOADER();

          const entry = {
            faqCategoryId: this.categoryId,
            question: this.controls.question,
            answer: xss(this.controls.answer),
            order: this.order,
          };

          const id = await Create(entry);

          entry.id = id;
          entry.сreated = new Date();

          this.ADD_ALERT({ type: ALERT_TYPES.SUCCESS, text: 'Запись успешно создана' });

          this.$emit('success', entry);
        } catch (error) {
          this.ADD_ALERT({ type: ALERT_TYPES.ERROR, text: error.message });
        } finally {
          this.REMOVE_LOADER();
        }
      }
    },

    cancel() {
      this.$emit('cancel');
    },
  },
};
</script>
