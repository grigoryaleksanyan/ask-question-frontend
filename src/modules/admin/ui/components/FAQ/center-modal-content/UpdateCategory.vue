<template>
  <v-form
    ref="update-category"
    v-model="valid"
    @submit.prevent="submitForm">
    <CenterModalContentWrapper>
      <template #default>
        <v-text-field
          v-model="name"
          :rules="rules"
          variant="outlined"
          label="Название" />
      </template>
      <template #actions>
        <v-btn
          type="submit"
          variant="flat"
          color="primary">
          Изменить
        </v-btn>
        <v-btn
          variant="outlined"
          color="blue-grey"
          @click="cancel">
          Отмена
        </v-btn>
      </template>
    </CenterModalContentWrapper>
  </v-form>
</template>

<script>
import { mapMutations } from 'vuex';

import ALERT_TYPES from '@/modules/alert/constants/alert-types';
import { Update } from '@/modules/faq/repositories/faq-category-repository';

export default {
  name: 'UpdateCategory',

  props: {
    category: {
      type: Object,
      required: true,
    },

    isOpen: {
      type: Boolean,
    },
  },

  data() {
    return {
      valid: true,
      name: null,

      rules: [
        (v) => !!v || 'Обязательное поле!',
        (v) => (v && v.trim().length !== 0) || 'Поле не должно быть пустым!',
      ],
    };
  },

  watch: {
    isOpen(newValue) {
      if (!newValue) {
        this.$refs['update-category'].reset();
      } else {
        this.name = this.category.name;
      }
    },
  },

  mounted() {
    this.name = this.category.name;
  },

  methods: {
    ...mapMutations('alert', ['ADD_ALERT']),

    async submitForm() {
      if (this.$refs['update-category'].validate()) {
        try {
          const category = { id: this.category.id, name: this.name };

          await Update(category);

          this.ADD_ALERT({
            type: ALERT_TYPES.SUCCESS,
            text: 'Категория успешно изменена',
          });

          this.$emit('success', category.name);
        } catch (error) {
          this.ADD_ALERT({ type: ALERT_TYPES.ERROR, text: error.message });
        }
      }
    },

    cancel() {
      this.$emit('cancel');
    },
  },
};
</script>
