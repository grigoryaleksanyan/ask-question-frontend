<template>
  <div
    class="question-card"
    @click="navigateToQuestion">
    <StatusDot
      :color="statusColor"
      class="question-card__status" />

    <div class="question-card__body">
      <p
        class="question-card__text"
        v-html="sliceText(question.text)"></p>

      <div class="question-card__meta">
        {{ metaText }}
        <template v-if="hasComment">
          ·
          <i
            v-tooltip="'Есть комментарий'"
            class="pi pi-comment"
            aria-label="Есть комментарий"></i>
        </template>
      </div>
    </div>

    <div class="question-card__votes">
      <span class="question-card__vote"
        >{{ localLikes }} <i class="pi pi-thumbs-up"></i
      ></span>
      <span class="question-card__vote"
        >{{ localDislikes }} <i class="pi pi-thumbs-down"></i
      ></span>
      <span class="question-card__vote"
        >{{ localViews }} <i class="pi pi-eye"></i
      ></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

import type { QuestionResponse } from '@/shared/dto';

import { StatusDot } from '@/shared/ui/status-dot';

import { getStatusColor } from '../config/question-statuses';

defineOptions({ name: 'QuestionCard' });

const { question } = defineProps<{
  question: QuestionResponse;
}>();

const router = useRouter();

const localLikes = ref(question.likes);
const localDislikes = ref(question.dislikes);
const localViews = ref(question.views);

const hasComment = computed(
  () => question.comment !== null && question.comment !== '',
);

const statusColor = computed(() => getStatusColor(question.status));

const formattedDate = computed(() =>
  new Date(question.created).toLocaleDateString('ru-RU'),
);

const metaText = computed(() => {
  const parts: string[] = [];
  if (question.speakerName) parts.push(question.speakerName);
  if (question.areaTitle) parts.push(question.areaTitle);
  if (formattedDate.value) parts.push(formattedDate.value);
  return parts.join(' · ');
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
</script>

<style lang="scss">
.question-card-more {
  color: variables.$links-color;
}
</style>

<style lang="scss" scoped>
.question-card {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  border: 1px solid variables.$border-light;
  border-radius: 8px;
  background: variables.$surface-card;
  cursor: pointer;
  transition:
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.question-card:hover {
  box-shadow: 0 2px 8px rgb(0 0 0 / 6%);
  transform: translateY(-1px);
}

.question-card__status {
  flex-shrink: 0;
  margin-right: 10px;
}

.question-card__body {
  min-width: 0;
  flex: 1;
}

.question-card__text {
  margin: 0;
  color: variables.$text-primary;
  font-size: 14px;
  line-height: 1.4;
}

.question-card__meta {
  margin-top: 4px;
  color: variables.$text-muted;
  font-size: 12px;

  .pi {
    color: variables.$primary-color;
    font-size: 10px;
  }
}

.question-card__votes {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  align-items: flex-end;
  margin-left: 12px;
  gap: 2px;
}

.question-card__vote {
  display: inline-flex;
  align-items: center;
  color: variables.$text-muted;
  font-size: 12px;
  gap: 4px;
  line-height: 1.5;

  .pi {
    font-size: 10px;
  }
}
</style>
