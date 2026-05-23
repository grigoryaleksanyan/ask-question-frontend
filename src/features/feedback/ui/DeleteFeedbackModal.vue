<template>
  <CenterModalContentWrapper>
    <template #default>
      <p class="text-body-1">Вы действительно хотите удалить обратную связь?</p>
    </template>
    <template #actions>
      <v-btn
        variant="flat"
        color="primary"
        @click="confirm">
        Удалить
      </v-btn>
      <v-btn
        variant="outlined"
        color="blue-grey"
        @click="cancel">
        Отмена
      </v-btn>
    </template>
  </CenterModalContentWrapper>
</template>

<script>
import { mapMutations } from 'vuex';

import { ALERT_TYPES } from '@/shared/config';
import { Delete as DeleteFeedbackApi } from '../api/feedback-repository';

export default {
  name: 'DeleteFeedbackModal',

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
        await DeleteFeedbackApi(this.id);

        this.ADD_ALERT({
          type: ALERT_TYPES.SUCCESS,
          text: 'Обратная связь успешно удалена',
        });

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
