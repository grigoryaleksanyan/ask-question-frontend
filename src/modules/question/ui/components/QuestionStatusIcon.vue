<template>
  <span>
    <span>статус: {{ curentStatus.text }}</span>
    <v-icon
      size="24"
      :color="curentStatus.color"
      class="ml-2">
      {{ curentStatus.icon }}
    </v-icon>
  </span>
</template>

<script>
import QUESTION_STATUSES from '@/modules/question/constants/question-statuses';

export default {
  name: 'QuestionStatusIcon',

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
          text: QUESTION_STATUSES.NEW.TITLE,
          color: QUESTION_STATUSES.NEW.COLOR,
          icon: 'mdi-new-box',
        },
        {
          text: QUESTION_STATUSES.IN_FOCUS.TITLE,
          color: QUESTION_STATUSES.IN_FOCUS.COLOR,
          icon: 'mdi-crosshairs-question',
        },
        {
          text: QUESTION_STATUSES.WITH_COMMENT.TITLE,
          color: QUESTION_STATUSES.WITH_COMMENT.COLOR,
          icon: 'mdi-comment-text-multiple-outline',
        },
        {
          text: QUESTION_STATUSES.ANSWERED.TITLE,
          color: QUESTION_STATUSES.ANSWERED.COLOR,
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
