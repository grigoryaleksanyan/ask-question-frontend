<template>
  <v-container
    fluid
    style="max-width: 1000px">
    <template v-if="question">
      <v-row no-gutters>
        <v-col
          cols="12"
          class="my-8">
          <h1 class="text-headline-large text-sm-display-small text-center">
            Вопрос
          </h1>
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
              class="py-5 px-2 px-sm-5 align-center"
              style="height: 100%">
              <v-col cols="1">
                <v-btn
                  color="white"
                  icon
                  @click="goBack">
                  <v-icon>mdi-24px mdi-arrow-left-circle-outline</v-icon>
                </v-btn>
              </v-col>
              <v-col cols="11">
                <p style="margin: 0; color: white; text-align: center">
                  {{ authorDisplay }}, {{ question.area || '' }},
                  {{ formattedDate }}
                  <br />
                  кому: {{ question.speaker }}
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
                      class="pa-0 ma-0 text-sm-body-large text-body-medium"
                      v-html="question.text"></p>
                  </v-sheet>
                </v-col>
              </v-row>
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
                    {{ replaceCounter(question.views) }}
                  </span>
                </v-col>
                <v-col class="d-flex justify-end align-center">
                  <v-btn
                    class="mr-1"
                    variant="outlined"
                    color="primary"
                    @click="handleLike">
                    <v-icon
                      class="mr-2"
                      title="Понравился"
                      size="20">
                      {{
                        question.userVote === 'Like'
                          ? 'mdi-thumb-up'
                          : 'mdi-thumb-up-outline'
                      }}
                    </v-icon>
                    <span class="text-body-small text-sm-body-medium mr-1">
                      {{ replaceCounter(question.likes) }}
                    </span>
                  </v-btn>
                  <v-btn
                    class="mr-1"
                    variant="outlined"
                    color="error"
                    @click="handleDislike">
                    <v-icon
                      class="mr-2"
                      title="Не понравился"
                      size="20">
                      {{
                        question.userVote === 'Dislike'
                          ? 'mdi-thumb-down'
                          : 'mdi-thumb-down-outline'
                      }}
                    </v-icon>
                    <span class="text-body-small text-sm-body-medium">
                      {{ replaceCounter(question.dislikes) }}
                    </span>
                  </v-btn>
                </v-col>
              </v-row>
            </div>
          </v-sheet>
        </v-col>
      </v-row>
    </template>

    <template v-else-if="isLoading">
      <v-row
        no-gutters
        class="my-8">
        <v-col
          cols="12"
          class="text-center">
          <v-progress-circular
            indeterminate
            size="64" />
        </v-col>
      </v-row>
    </template>

    <template v-else>
      <v-row
        no-gutters
        class="my-8">
        <v-col
          cols="12"
          class="text-center">
          <p style="color: grey; font-size: 22px">Вопрос не найден</p>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import type { QuestionResponse } from '@/shared/types';

import {
  GetById,
  LikeQuestion,
  DislikeQuestion,
} from '../api/questions-repository';
import QUESTION_STATUSES from '../config/question-statuses';

defineOptions({ name: 'QuestionIdView' });

const route = useRoute();
const router = useRouter();

const question = ref<QuestionResponse | null>(null);
const isLoading = ref(true);

const color = computed(() => {
  if (!question.value) return QUESTION_STATUSES.ANSWERED.COLOR;

  switch (question.value.status) {
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

const authorDisplay = computed(() => question.value?.author || 'Инкогнито');

const formattedDate = computed(() => {
  if (!question.value) return '';
  return new Date(question.value.created).toLocaleDateString('ru-RU');
});

function replaceCounter(value: number) {
  return value > 999 ? '999+' : value;
}

function goBack() {
  router.back();
}

async function fetchQuestion() {
  isLoading.value = true;
  try {
    const id = route.params.id as string;
    question.value = await GetById(id);
  } catch {
    question.value = null;
  } finally {
    isLoading.value = false;
  }
}

async function handleLike() {
  if (!question.value) return;

  try {
    const result = await LikeQuestion(question.value.id);
    question.value.likes = result.likes;
    question.value.dislikes = result.dislikes;
    question.value.userVote = result.userVote;
  } catch {
    // Error handled at API level
  }
}

async function handleDislike() {
  if (!question.value) return;

  try {
    const result = await DislikeQuestion(question.value.id);
    question.value.likes = result.likes;
    question.value.dislikes = result.dislikes;
    question.value.userVote = result.userVote;
  } catch {
    // Error handled at API level
  }
}

onMounted(() => {
  fetchQuestion();
});
</script>
