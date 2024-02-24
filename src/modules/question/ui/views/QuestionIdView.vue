<template>
  <v-container
    fluid
    style="max-width: 1000px">
    <v-row no-gutters>
      <v-col
        cols="12"
        class="my-8">
        <h1 class="text-h4 text-sm-h3 text-center">Вопрос</h1>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col
        cols="12"
        class="d-flex justify-center">
        <v-sheet
          color="#2b2b2b"
          width="100%">
          <v-row
            no-gutters
            class="py-5 px-2 px-sm-5"
            align="center"
            style="height: 100%">
            <v-col cols="1">
              <v-btn
                color="white"
                icon>
                <v-icon>mdi-24px mdi-arrow-left-circle-outline </v-icon>
              </v-btn>
            </v-col>
            <v-col cols="11">
              <p style="margin: 0; color: white; text-align: center">
                Инкогнито, Корпорaтивный центр, 04.02.2023 <br />
                кому: Меньшов Кирилл
              </p>
            </v-col>
          </v-row>
        </v-sheet>
      </v-col>
      <v-col cols="12">
        <v-sheet
          class="pa-5 pa-sm-8 d-flex flex-column justify-center"
          min-height="250px"
          color="#E8EAF6"
          width="100%">
          <div>
            <v-row
              no-gutters
              class="mb-6">
              <v-col
                cols="12"
                class="d-flex">
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
                  <p
                    style="color: grey"
                    class="pa-0 ma-0 text-sm-body-1 text-body-2">
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Esse excepturi dolore ducimus eos eaque.
                    Aut, explicabo. Amet, quia, vero sunt optio laudantium perspiciatis ducimus accusantium magnam
                    dolore tempora ipsum nemo.
                  </p>
                </v-sheet>
              </v-col>
            </v-row>
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
                <span class="text-caption text-sm-body-2">{{ replaceСounter(99) }}</span>
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
                <span class="text-caption text-sm-body-2 mr-1">{{ replaceСounter(99) }}</span>
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
                <span class="text-caption text-sm-body-2"> {{ replaceСounter(99) }}</span>
              </v-col>
            </v-row>
          </div>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import QUESTION_STATUSES from '@/modules/question/constants/question-statuses';

export default {
  name: 'QuestionIdView',

  computed: {
    color() {
      switch (1) {
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
    replaceСounter(value) {
      return value > 999 ? '999+' : value;
    },
  },
};
</script>
