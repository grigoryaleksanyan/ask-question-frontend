<template>
  <v-form
    ref="update-area"
    v-model="valid"
    @submit.prevent="submitForm">
    <CenterModalContentWrapper>
      <template #default>
        <v-text-field
          v-model="title"
          :rules="rules"
          variant="outlined"
          label="Заголовок" />
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
import { Update } from '@/modules/shared/repositories/areas-repository';

export default {
  name: 'UpdateArea',

  props: {
    area: {
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
      title: null,

      rules: [
        (v) => !!v || 'Обязательное поле!',
        (v) => (v && v.trim().length !== 0) || 'Поле не должно быть пустым!',
      ],
    };
  },

  watch: {
    isOpen(newValue) {
      if (!newValue) {
        this.$refs['update-area'].reset();
      } else {
        this.title = this.area.title;
      }
    },
  },

  mounted() {
    this.title = this.area.title;
  },

  methods: {
    ...mapMutations('alert', ['ADD_ALERT']),

    async submitForm() {
      if (this.$refs['update-area'].validate()) {
        try {
          const area = { id: this.area.id, title: this.title };

          await Update(area);

          this.ADD_ALERT({
            type: ALERT_TYPES.SUCCESS,
            text: 'Категория успешно изменена',
          });

          this.$emit('success', { ...this.area, title: this.title });
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
