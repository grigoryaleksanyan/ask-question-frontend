<template>
  <div class="speaker-productivity-chart">
    <div class="speaker-productivity-chart__title">Продуктивность спикеров</div>
    <div class="speaker-productivity-chart__list">
      <div
        v-for="speaker in topSpeakers"
        :key="speaker.speakerName"
        class="speaker-productivity-chart__item">
        <div class="speaker-productivity-chart__item-header">
          <span class="speaker-productivity-chart__name">
            {{ speaker.speakerName }}
          </span>
          <span class="speaker-productivity-chart__percent">
            {{ speaker.answerRate }}%
          </span>
        </div>
        <div class="speaker-productivity-chart__bar">
          <div
            class="speaker-productivity-chart__bar-fill"
            :class="{
              'speaker-productivity-chart__bar-fill--warning':
                speaker.answerRate < 60,
            }"
            :style="{ width: `${speaker.answerRate}%` }" />
        </div>
        <div class="speaker-productivity-chart__meta">
          <span>{{ speaker.assignedQuestions }} назн.</span>
          <span>{{ speaker.answeredQuestions }} отв.</span>
          <span>~{{ speaker.averageResponseHours }}ч</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SpeakerProductivityResponse } from '@/shared/types';

defineOptions({ name: 'SpeakerProductivityChart' });

const { topSpeakers } = defineProps<{
  topSpeakers: SpeakerProductivityResponse[];
}>();
</script>

<style lang="scss" scoped>
.speaker-productivity-chart {
  padding: 14px;
  border: 1px solid variables.$border-dark;
  border-radius: 8px;
  background: variables.$surface-dark-elevated;
}

.speaker-productivity-chart__title {
  margin-bottom: 14px;
  color: variables.$text-primary-dark;
  font-size: 15px;
  font-weight: 600;
}

.speaker-productivity-chart__list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.speaker-productivity-chart__item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.speaker-productivity-chart__name {
  color: variables.$text-muted;
  font-size: 12px;
}

.speaker-productivity-chart__percent {
  color: variables.$text-secondary;
  font-size: 11px;
}

.speaker-productivity-chart__bar {
  overflow: hidden;
  height: 6px;
  border-radius: 4px;
  background: variables.$border-dark;
}

.speaker-productivity-chart__bar-fill {
  height: 100%;
  border-radius: 4px;
  background: variables.$main-color;
  transition: width 0.3s;

  &--warning {
    background: variables.$warning-color;
  }
}

.speaker-productivity-chart__meta {
  display: flex;
  margin-top: 4px;
  color: variables.$text-secondary;
  font-size: 11px;
  gap: 12px;
}
</style>
