<template>
  <v-container>
    <v-card
      to="/card"
      elevation="2"
      color="#E8EAF6">
      <v-card-title class="py-2">
        <v-row
          no-gutters
          class="text-caption text-sm-body-2">
          <v-col
            cols="12"
            sm="6"
            align-self="center">
            <span>кому: {{ question.speaker }}</span>
          </v-col>
          <v-col
            class="d-flex justify-start justify-sm-end"
            cols="12"
            sm="6">
            <QuestionStatusIcon :status="question.status" />
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <div class="d-flex">
          <v-sheet
            :color="color"
            height="auto"
            width="7">
          </v-sheet>
          <v-sheet
            color="white"
            height="auto"
            width="100%"
            class="pa-3">
            <!-- {{ sliceText(question.text) }} -->
            <p
              style="color: grey"
              class="pa-0 ma-0 text-sm-body-1 text-body-2"
              v-html="sliceText(question.text)"></p>
          </v-sheet>
        </div>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="py-1">
        <v-container
          fluid
          class="py-0">
          <v-row
            no-gutters
            align="center">
            <v-col align-self="center">
              <v-icon
                title="Количество просмотров"
                size="20"
                class="mr-2">
                mdi-eye
              </v-icon>
              <span class="text-caption text-sm-body-2">{{ replaceСounter(question.views) }}</span>
            </v-col>
            <v-col class="d-flex justify-end align-center">
              <v-btn
                icon
                class="mr-1"
                @click.prevent="setLike">
                <v-icon
                  title="Понравился"
                  size="20">
                  mdi-thumb-up-outline
                </v-icon>
              </v-btn>
              <span class="text-caption text-sm-body-2 mr-1">{{ replaceСounter(question.likes) }}</span>
              <v-btn
                icon
                class="mr-1"
                @click.prevent="setDislike">
                <v-icon
                  title="Не понравился"
                  size="20">
                  mdi-thumb-down-outline
                </v-icon>
              </v-btn>
              <span class="text-caption text-sm-body-2"> {{ replaceСounter(question.dislikes) }}</span>
            </v-col>
          </v-row>
        </v-container>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import QUESTION_STATUSES from '@/core/constants/question-statuses';

import QuestionStatusIcon from '@/modules/question/components/QuestionStatusIcon.vue';

export default {
  name: 'QuestionCard',
  components: {
    QuestionStatusIcon,
  },
  props: {
    question: {
      type: Object,
      required: true,
    },
  },
  computed: {
    color() {
      switch (this.question.status) {
        case QUESTION_STATUSES.NEW.STATUS_ID:
          return QUESTION_STATUSES.NEW.COLOR;
        case QUESTION_STATUSES.IN_FOCUS.STATUS_ID:
          return QUESTION_STATUSES.IN_FOCUS.COLOR;
        case QUESTION_STATUSES.WITH_COMMENT.STATUS_ID:
          return QUESTION_STATUSES.WITH_COMMENT.COLOR;
        case QUESTION_STATUSES.ANSWERED.STATUS_ID:
          return QUESTION_STATUSES.ANSWERED.COLOR;
        default:
          return QUESTION_STATUSES.ANSWERED.COLOR;
      }
    },
  },
  methods: {
    sliceText(text) {
      const maxTextLength = 300;

      if (text.length < maxTextLength) {
        return text;
      }
      return `${text.slice(0, maxTextLength)}... <b class="question-card-more">подробнее</b>`;
    },
    replaceСounter(value) {
      return value > 999 ? '999+' : value;
    },

    setLike() {},

    setDislike() {},
  },
};
</script>

<style lang="scss">
.question-card-more {
  color: $links-color;
}
</style>
