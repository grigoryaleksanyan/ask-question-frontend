<template>
  <CenterModalContentWrapper>
    <template #default>
      <v-text-field
        v-model="title"
        label="Название" />
    </template>
    <template #actions>
      <v-btn
        color="primary"
        class="white--text"
        @click="create">
        Создать
      </v-btn>
      <v-btn
        color="blue-grey"
        class="white--text"
        @click="cancel">
        Отмена
      </v-btn>
    </template>
  </CenterModalContentWrapper>
</template>

<script>
import { mapMutations } from 'vuex';

import ALERT_TYPES from '@/modules/alert/constants/alert-types';
import { Create } from '@/modules/faq/repositories/faq-category-repository';

export default {
  name: 'CreateCategory',

  data() {
    return {
      title: null,
    };
  },

  methods: {
    ...mapMutations('alert', ['ADD_ALERT']),

    async create() {
      try {
        const category = { title: this.title };

        await Create(category);

        this.ADD_ALERT({ type: ALERT_TYPES.SUCCESS, text: 'Категория успешно создана' });
      } catch (error) {
        this.ADD_ALERT({ type: ALERT_TYPES.ERROR, text: error.message });
      }
    },

    success() {
      this.$emit('success');
    },

    cancel() {
      this.$emit('cancel');
    },
  },
};
</script>
