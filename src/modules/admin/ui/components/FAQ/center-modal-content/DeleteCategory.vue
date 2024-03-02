<template>
  <CenterModalContentWrapper>
    <template #default>
      <p class="text-body-1">Вы действительно хотите удалить всю категорию?</p>
      <p class="ma-0 text-body-2 font-weight-bold">Так же будут удалены все записи!</p>
    </template>
    <template #actions>
      <v-btn
        color="error"
        class="white--text"
        @click="confirm">
        Удалить
      </v-btn>
      <v-btn
        color="blue-grey"
        class="white--text"
        outlined
        @click="cancel">
        Отмена
      </v-btn>
    </template>
  </CenterModalContentWrapper>
</template>

<script>
import { mapMutations } from 'vuex';

import ALERT_TYPES from '@/modules/alert/constants/alert-types';
import { Delete } from '@/modules/faq/repositories/faq-category-repository';

export default {
  name: 'DeleteCategory',

  props: {
    id: {
      type: String,
      required: true,
    },
  },

  methods: {
    ...mapMutations('alert', ['ADD_ALERT']),

    async confirm() {
      try {
        await Delete(this.id);

        this.ADD_ALERT({ type: ALERT_TYPES.SUCCESS, text: 'Категория успешно удалена' });

        this.$emit('success');
      } catch (error) {
        this.ADD_ALERT({ type: ALERT_TYPES.ERROR, text: error.message });
      }
    },

    cancel() {
      this.$emit('cancel');
    },
  },
};
</script>
