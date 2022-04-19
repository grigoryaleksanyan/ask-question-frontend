<template>
  <span>
    <span>статус: {{ curentStatus.text }}</span>
    <v-icon size="24" :color="curentStatus.color" class="ml-2"> {{ curentStatus.icon }} </v-icon>
  </span>
</template>

<script>
import { Q_NEW_COLOR, Q_FOCUS_COLOR, Q_COMMENT_COLOR, Q_ANSWERED_COLOR } from '@/core/constants/question-status-colors';

export default {
  name: 'QuestionStatus',
  props: {
    status: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      statusList: [
        {
          text: 'новый',
          color: Q_NEW_COLOR,
          icon: 'mdi-new-box',
        },
        {
          text: 'в фокусе',
          color: Q_FOCUS_COLOR,
          icon: 'mdi-crosshairs-question',
        },
        {
          text: 'с комментарием',
          color: Q_COMMENT_COLOR,
          icon: 'mdi-comment-text-multiple-outline',
        },
        {
          text: 'отвеченный',
          color: Q_ANSWERED_COLOR,
          icon: 'mdi-bullhorn-outline',
        },
      ],
    };
  },
  computed: {
    curentStatus() {
      return this.statusList[this.status];
    },
  },
};
</script>
