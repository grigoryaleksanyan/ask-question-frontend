<template>
  <v-card
    elevation="2"
    height="100%">
    <v-card-title class="text-body-large font-weight-bold pb-0">
      Лайки / Дизлайки
    </v-card-title>
    <v-card-text class="d-flex flex-column align-center justify-center pt-4">
      <div class="d-flex ga-8">
        <div class="text-center">
          <div
            class="text-headline-large font-weight-bold"
            style="color: #4ecca3">
            {{ votes.totalLikes.toLocaleString() }}
          </div>
          <div class="text-body-small text-medium-emphasis mt-1">👍 Лайки</div>
        </div>
        <div class="text-center">
          <div
            class="text-headline-large font-weight-bold"
            style="color: #ef5350">
            {{ votes.totalDislikes.toLocaleString() }}
          </div>
          <div class="text-body-small text-medium-emphasis mt-1">
            👎 Дизлайки
          </div>
        </div>
      </div>
      <div
        class="d-flex align-center ga-2 mt-4 w-100"
        style="max-width: 300px">
        <span
          class="text-body-small"
          style="color: #4ecca3">
          {{ likesPercent }}%
        </span>
        <v-progress-linear
          :model-value="likesPercent"
          height="10"
          rounded
          bg-color="#ef5350"
          color="#4ecca3" />
        <span
          class="text-body-small"
          style="color: #ef5350">
          {{ dislikesPercent }}%
        </span>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { VotesSummaryResponse } from '@/shared/types';

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
