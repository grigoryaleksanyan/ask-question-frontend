<template>
  <v-form
    ref="create-category"
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
          Создать
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
import { Create } from '@/modules/faq/repositories/faq-category-repository';

export default {
  name: 'CreateCategory',

  props: {
    order: {
      type: Number,
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
        this.$refs['create-category'].reset();
      }
    },
  },

  methods: {
    ...mapMutations('alert', ['ADD_ALERT']),

    async submitForm() {
      if (this.$refs['create-category'].validate()) {
        try {
          const category = { name: this.name, order: this.order };

          const id = await Create(category);

          category.id = id;

          this.ADD_ALERT({
            type: ALERT_TYPES.SUCCESS,
            text: 'Категория успешно создана',
          });

          this.$emit('success', category);
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
