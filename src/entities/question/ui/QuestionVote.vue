<template>
  <div class="question-vote">
    <button
      class="question-vote__btn"
      :class="{ 'question-vote__btn--active-up': userVote === 'Like' }"
      @click="$emit('like')">
      <i class="pi pi-thumbs-up"></i>
      <span class="question-vote__count">{{ likes }}</span>
    </button>
    <button
      class="question-vote__btn"
      :class="{ 'question-vote__btn--active-down': userVote === 'Dislike' }"
      @click="$emit('dislike')">
      <i class="pi pi-thumbs-down"></i>
      <span class="question-vote__count--muted">{{ dislikes }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { VoteType } from '@/shared/dto';

defineOptions({ name: 'QuestionVote' });

const {
  likes,
  dislikes,
  userVote = null,
} = defineProps<{
  likes: number;
  dislikes: number;
  userVote?: VoteType | null;
}>();

defineEmits<{
  like: [];
  dislike: [];
}>();
</script>

<style lang="scss" scoped>
.question-vote {
  display: flex;
  align-items: center;
  gap: 16px;
}

.question-vote__btn {
  display: flex;
  align-items: center;
  padding: 0;
  border: none;
  background: none;
  color: variables.$text-muted;
  cursor: pointer;
  font-size: 18px;
  gap: 6px;

  &--active-up {
    color: variables.$main-color;
  }

  &--active-down {
    color: variables.$warning-color;
  }
}

.question-vote__count {
  color: variables.$text-primary;
  font-size: 14px;
  font-weight: 500;

  &--muted {
    color: variables.$text-secondary;
    font-size: 14px;
  }
}
</style>
