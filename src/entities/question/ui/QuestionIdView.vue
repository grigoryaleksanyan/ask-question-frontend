<template>
  <div style="max-width: 1000px">
    <template v-if="question">
      <div class="grid grid-nogutter">
        <div class="col-12 my-8">
          <h1
            class="typography__headline--large typography__display--small--sm text-center">
            Вопрос
          </h1>
        </div>
      </div>

      <div class="grid grid-nogutter">
        <div class="col-12 flex justify-content-center">
          <div style=" width: 100%;background-color: #2b2b2b">
            <div
              class="flex align-items-center py-5 px-2 question-id-view__header-row"
              style="height: 100%">
              <div style="width: 8.3333%">
                <Button
                  icon="pi pi-arrow-left"
                  style="background-color: white; color: #2b2b2b"
                  @click="goBack" />
              </div>
              <div style="width: 91.6667%">
                <p style="margin: 0; color: white; text-align: center">
                  {{ authorDisplay }}, {{ question.areaTitle || '' }},
                  {{ formattedDate }}
                  <br />
                  кому: {{ question.speakerName }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12">
          <div
            class="p-5 question-id-view__content flex flex-column justify-content-center"
            style=" width: 100%; min-height: 250px;background-color: #e8eaf6">
            <div>
              <div class="flex mb-6">
                <div class="col-12 flex">
                  <div
                    :style="{
                      backgroundColor: color,
                      width: '7px',
                    }"></div>
                  <div
                    style=" flex: 1;background-color: white"
                    class="p-3">
                    <p
                      style="color: grey"
                      class="m-0 typography__body--medium typography__body--large--sm"
                      v-html="question.text"></p>
                  </div>
                </div>
              </div>
              <div class="flex align-items-center">
                <div class="flex align-items-center">
                  <i
                    class="pi pi-eye mr-2"
                    title="Количество просмотров"
                    style="font-size: 20px"></i>
                  <span
                    class="typography__body--small typography__body--medium--sm"
                    >{{ replaceCounter(question.views) }}</span
                  >
                </div>
                <div class="flex justify-content-end align-items-center flex-1">
                  <Button
                    :outlined="question.userVote !== 'Like'"
                    class="mr-1"
                    @click="handleLike">
                    <i
                      class="pi pi-thumbs-up mr-2"
                      title="Понравился"
                      style="font-size: 20px"></i>
                    <span
                      class="typography__body--small typography__body--medium--sm mr-1"
                      >{{ replaceCounter(question.likes) }}</span
                    >
                  </Button>
                  <Button
                    :outlined="question.userVote !== 'Dislike'"
                    severity="danger"
                    class="mr-1"
                    @click="handleDislike">
                    <i
                      class="pi pi-thumbs-down mr-2"
                      title="Не понравился"
                      style="font-size: 20px"></i>
                    <span
                      class="typography__body--small typography__body--medium--sm"
                      >{{ replaceCounter(question.dislikes) }}</span
                    >
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template v-else-if="isLoading">
      <div class="grid grid-nogutter my-8">
        <div class="col-12 text-center">
          <ProgressSpinner style="width: 64px; height: 64px" />
        </div>
      </div>
    </template>

    <template v-else>
      <div class="grid grid-nogutter my-8">
        <div class="col-12 text-center">
          <p style="color: grey; font-size: 22px">Вопрос не найден</p>
        </div>
      </div>
    </template>
  </div>
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

import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';

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
    // intentionally empty - error handled at API level
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
    // intentionally empty - error handled at API level
  }
}

onMounted(() => {
  fetchQuestion();
});
</script>

<style lang="scss" scoped>
.question-id-view__content {
  background-color: #e8eaf6;
}

@media (width >= 600px) {
  .question-id-view__header-row {
    padding-right: 1.25rem;
    padding-left: 1.25rem;
  }

  .question-id-view__content {
    padding: 2rem;
  }
}
</style>
