<template>
  <CenterModalContentWrapper>
    <template #default>
      <p class="text-body-1">Вы действительно хотите удалить область?</p>
    </template>
    <template #actions>
      <v-btn
        color="error"
        class="text-white"
        @click="confirm">
        Удалить
      </v-btn>
      <v-btn
        color="blue-grey"
        class="text-white"
        variant="outlined"
        @click="cancel">
        Отмена
      </v-btn>
    </template>
  </CenterModalContentWrapper>
</template>

<script>
import { mapMutations } from 'vuex';

import ALERT_TYPES from '@/modules/alert/constants/alert-types';
import { Delete } from '@/modules/shared/repositories/areas-repository';

export default {
  name: 'DeleteArea',

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

        this.ADD_ALERT({ type: ALERT_TYPES.SUCCESS, text: 'Область успешно удалена' });

        this.$emit('success', this.id);
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
