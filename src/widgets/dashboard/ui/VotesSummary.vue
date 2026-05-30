<template>
  <Card class="h-full">
    <template #title>
      <span
        class="typography__body--large"
        style="font-weight: bold">
        Лайки / Дизлайки
      </span>
    </template>
    <template #content>
      <div class="flex flex-column align-items-center pt-4">
        <div class="flex gap-8">
          <div class="text-center">
            <div class="typography__headline--large votes-summary__likes">
              {{ votes.totalLikes.toLocaleString() }}
            </div>
            <div class="typography__body--small mt-1 votes-summary__label">
              👍 Лайки
            </div>
          </div>
          <div class="text-center">
            <div class="typography__headline--large votes-summary__dislikes">
              {{ votes.totalDislikes.toLocaleString() }}
            </div>
            <div class="typography__body--small mt-1 votes-summary__label">
              👎 Дизлайки
            </div>
          </div>
        </div>
        <div
          class="flex align-items-center gap-2 mt-4 w-full votes-summary__progress">
          <span class="typography__body--small votes-summary__likes">
            {{ likesPercent }}%
          </span>
          <ProgressBar
            :value="likesPercent"
            :show-value="false"
            style="height: 10px"
            class="flex-grow-1" />
          <span class="typography__body--small votes-summary__dislikes">
            {{ dislikesPercent }}%
          </span>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import type { VotesSummaryResponse } from '@/shared/types';

import Card from 'primevue/card';
import ProgressBar from 'primevue/progressbar';

defineOptions({ name: 'VotesSummary' });

const { votes } = defineProps<{
  votes: VotesSummaryResponse;
}>();

const total = computed(() => votes.totalLikes + votes.totalDislikes);

const likesPercent = computed(() => {
  if (total.value === 0) {
    return 0;
  }
  return Math.round((votes.totalLikes / total.value) * 100);
});

const dislikesPercent = computed(() => {
  if (total.value === 0) {
    return 0;
  }
  return Math.round((votes.totalDislikes / total.value) * 100);
});
</script>

<style lang="scss" scoped>
.votes-summary__likes {
  color: variables.$chart-answered;
  font-weight: bold;
}

.votes-summary__dislikes {
  color: variables.$chart-unanswered;
  font-weight: bold;
}

.votes-summary__label {
  color: variables.$text-secondary;
}

.votes-summary__progress {
  max-width: 300px;
}
</style>
