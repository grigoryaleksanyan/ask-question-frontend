<template>
  <div class="votes-summary">
    <div class="votes-summary__title">Лайки / Дизлайки</div>
    <div class="flex flex-column align-items-center pt-4">
      <div class="flex gap-8">
        <div class="text-center">
          <div class="votes-summary__likes">
            {{ votes.totalLikes.toLocaleString() }}
          </div>
          <div class="votes-summary__label mt-1">Лайки</div>
        </div>
        <div class="text-center">
          <div class="votes-summary__dislikes">
            {{ votes.totalDislikes.toLocaleString() }}
          </div>
          <div class="votes-summary__label mt-1">Дизлайки</div>
        </div>
      </div>
      <div
        class="flex align-items-center gap-2 mt-4 w-full votes-summary__progress">
        <span class="votes-summary__likes votes-summary__percent">
          {{ likesPercent }}%
        </span>
        <ProgressBar
          :value="likesPercent"
          :show-value="false"
          style="height: 10px"
          class="flex-grow-1" />
        <span class="votes-summary__dislikes votes-summary__percent">
          {{ dislikesPercent }}%
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import type { VotesSummaryResponse } from '@/shared/types';

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
.votes-summary {
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  padding: 14px;
  border: 1px solid variables.$border-dark;
  border-radius: 8px;
  background: variables.$surface-dark-elevated;
}

.votes-summary__title {
  color: variables.$text-primary-dark;
  font-size: 15px;
  font-weight: 600;
}

.votes-summary__likes {
  color: variables.$chart-answered;
  font-size: 24px;
  font-weight: bold;
}

.votes-summary__dislikes {
  color: variables.$chart-unanswered;
  font-size: 24px;
  font-weight: bold;
}

.votes-summary__percent {
  font-size: 11px;
}

.votes-summary__label {
  color: variables.$text-muted;
  font-size: 12px;
}

.votes-summary__progress {
  max-width: 300px;
}
</style>
