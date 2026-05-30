<template>
  <div class="mb-3">
    <Card
      class="shadow-2 cursor-pointer question-card"
      style="background-color: #e8eaf6"
      @click="navigateToQuestion">
      <template #title>
        <div class="grid grid-nogutter py-2">
          <div class="col-12 question-card__speaker-col align-self-center">
            <span class="typography__body--small typography__body--medium--sm"
              >кому: {{ question.speakerName }}</span
            >
          </div>
          <div
            class="col-12 question-card__status-col flex justify-content-start">
            <QuestionStatusIcon :status="question.status" />
          </div>
        </div>
      </template>
      <template #content>
        <div class="flex">
          <div :style="{ backgroundColor: color, width: '7px' }"></div>
          <div
            style=" flex: 1;background-color: white"
            class="p-3">
            <p
              style="color: grey"
              class="m-0 typography__body--medium typography__body--large--sm"
              v-html="sliceText(question.text)"></p>
          </div>
        </div>
      </template>
      <template #footer>
        <Divider />
        <div class="flex align-items-center py-1">
          <div class="flex align-items-center">
            <i
              class="pi pi-eye mr-2"
              title="Количество просмотров"
              style="font-size: 20px"></i>
            <span
              class="typography__body--small typography__body--medium--sm"
              >{{ replaceCounter(localViews) }}</span
            >
          </div>
          <div class="flex justify-content-end align-items-center flex-1">
            <Button
              icon="pi pi-thumbs-up"
              :outlined="localUserVote !== 'Like'"
              class="mr-1"
              @click.stop.prevent="handleLike" />
            <span
              class="typography__body--small typography__body--medium--sm mr-1"
              >{{ replaceCounter(localLikes) }}</span
            >
            <Button
              icon="pi pi-thumbs-down"
              :outlined="localUserVote !== 'Dislike'"
              severity="danger"
              class="mr-1"
              @click.stop.prevent="handleDislike" />
            <span
              class="typography__body--small typography__body--medium--sm"
              >{{ replaceCounter(localDislikes) }}</span
            >
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

import type { QuestionResponse, VoteType } from '@/shared/types';

import { LikeQuestion, DislikeQuestion } from '../api/questions-repository';
import QUESTION_STATUSES from '../config/question-statuses';
import QuestionStatusIcon from './QuestionStatusIcon.vue';

import Card from 'primevue/card';
import Divider from 'primevue/divider';
import Button from 'primevue/button';

defineOptions({ name: 'QuestionCard' });

const { question } = defineProps<{
  question: QuestionResponse;
}>();

const router = useRouter();

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

function navigateToQuestion() {
  router.push(`/question/${question.id}`);
}

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
    // intentionally empty - error handled at API level
  }
}

async function handleDislike() {
  try {
    const result = await DislikeQuestion(question.id);
    localLikes.value = result.likes;
    localDislikes.value = result.dislikes;
    localUserVote.value = result.userVote;
  } catch {
    // intentionally empty - error handled at API level
  }
}
</script>

<style lang="scss">
.question-card-more {
  color: variables.$links-color;
}
</style>

<style lang="scss" scoped>
@media (width >= 600px) {
  .question-card__speaker-col {
    width: 50%;
  }

  .question-card__status-col {
    width: 50%;
    justify-content: end;
  }
}
</style>
