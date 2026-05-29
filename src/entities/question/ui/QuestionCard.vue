<template>
  <v-container>
    <v-card
      :to="'/question/' + question.id"
      elevation="2"
      color="#E8EAF6">
      <v-card-title class="py-2">
        <v-row
          no-gutters
          class="text-body-small text-sm-body-medium">
          <v-col
            class="align-self-center"
            cols="12"
            sm="6">
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
            <p
              style="color: grey"
              class="pa-0 ma-0 text-sm-body-large text-body-medium"
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
            class="align-center"
            no-gutters>
            <v-col class="align-self-center">
              <v-icon
                title="Количество просмотров"
                size="20"
                class="mr-2">
                mdi-eye
              </v-icon>
              <span class="text-body-small text-sm-body-medium">
                {{ replaceCounter(localViews) }}
              </span>
            </v-col>
            <v-col class="d-flex justify-end align-center">
              <v-btn
                icon
                class="mr-1"
                color="primary"
                @click.prevent="handleLike">
                <v-icon
                  title="Понравился"
                  size="20">
                  {{
                    localUserVote === 'Like'
                      ? 'mdi-thumb-up'
                      : 'mdi-thumb-up-outline'
                  }}
                </v-icon>
              </v-btn>
              <span class="text-body-small text-sm-body-medium mr-1">
                {{ replaceCounter(localLikes) }}
              </span>
              <v-btn
                icon
                class="mr-1"
                color="error"
                @click.prevent="handleDislike">
                <v-icon
                  title="Не понравился"
                  size="20">
                  {{
                    localUserVote === 'Dislike'
                      ? 'mdi-thumb-down'
                      : 'mdi-thumb-down-outline'
                  }}
                </v-icon>
              </v-btn>
              <span class="text-body-small text-sm-body-medium">
                {{ replaceCounter(localDislikes) }}
              </span>
            </v-col>
          </v-row>
        </v-container>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

import type { QuestionResponse, VoteType } from '@/shared/types';

import { LikeQuestion, DislikeQuestion } from '../api/questions-repository';
import QUESTION_STATUSES from '../config/question-statuses';

import QuestionStatusIcon from './QuestionStatusIcon.vue';

defineOptions({ name: 'QuestionCard' });

const { question } = defineProps<{
  question: QuestionResponse;
}>();

const localLikes = ref(question.likes);
const localDislikes = ref(question.dislikes);
const localViews = ref(question.views);
const localUserVote = ref<VoteType | null>(question.userVote ?? null);

const color = computed(() => {
  switch (question.status) {
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
});

function sliceText(text: string) {
  const maxTextLength = 300;

  if (text.length < maxTextLength) {
    return text;
  }

  return `${text.slice(0, maxTextLength)}... <b class="question-card-more">подробнее</b>`;
}

function replaceCounter(value: number) {
  return value > 999 ? '999+' : value;
}

async function handleLike() {
  try {
    const result = await LikeQuestion(question.id);
    localLikes.value = result.likes;
    localDislikes.value = result.dislikes;
    localUserVote.value = result.userVote;
  } catch {
    // Error handled at API level
  }
}

async function handleDislike() {
  try {
    const result = await DislikeQuestion(question.id);
    localLikes.value = result.likes;
    localDislikes.value = result.dislikes;
    localUserVote.value = result.userVote;
  } catch {
    // Error handled at API level
  }
}
</script>

<style lang="scss">
.question-card-more {
  color: variables.$links-color;
}
</style>
