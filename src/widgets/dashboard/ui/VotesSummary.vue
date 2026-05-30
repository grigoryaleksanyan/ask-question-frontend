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
            <div
              class="typography__headline--large"
              style="color: #4ecca3; font-weight: bold">
              {{ votes.totalLikes.toLocaleString() }}
            </div>
            <div
              class="typography__body--small mt-1"
              style="color: rgb(0 0 0 / 60%)">
              👍 Лайки
            </div>
          </div>
          <div class="text-center">
            <div
              class="typography__headline--large"
              style="color: #ef5350; font-weight: bold">
              {{ votes.totalDislikes.toLocaleString() }}
            </div>
            <div
              class="typography__body--small mt-1"
              style="color: rgb(0 0 0 / 60%)">
              👎 Дизлайки
            </div>
          </div>
        </div>
        <div
          class="flex align-items-center gap-2 mt-4 w-full"
          style="max-width: 300px">
          <span
            class="typography__body--small"
            style="color: #4ecca3">
            {{ likesPercent }}%
          </span>
          <ProgressBar
            :value="likesPercent"
            :show-value="false"
            style="height: 10px"
            class="flex-grow-1" />
          <span
            class="typography__body--small"
            style="color: #ef5350">
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
