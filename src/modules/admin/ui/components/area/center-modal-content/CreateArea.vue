<template>
  <v-form
    ref="create-area"
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
import { Create } from '@/modules/shared/repositories/areas-repository';

export default {
  name: 'CreateArea',

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
      title: null,

      rules: [(v) => !!v || 'Обязательное поле!', (v) => (v && v.trim().length !== 0) || 'Поле не должно быть пустым!'],
    };
  },

  watch: {
    isOpen(newValue) {
      if (!newValue) {
        this.$refs['create-area'].reset();
      }
    },
  },

  methods: {
    ...mapMutations('alert', ['ADD_ALERT']),

    async submitForm() {
      if (this.$refs['create-area'].validate()) {
        try {
          const area = { title: this.title, order: this.order };

          const id = await Create(area);

          area.id = id;

          this.ADD_ALERT({ type: ALERT_TYPES.SUCCESS, text: 'Область успешно создана' });

          this.$emit('success', area);
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
