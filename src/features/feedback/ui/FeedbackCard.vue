<template>
  <div class="feedback-card">
    <div class="feedback-card__header">
      <span class="feedback-card__theme">{{ feedback.theme }}</span>
      <span class="feedback-card__time">
        {{ new Date(feedback.created).toLocaleDateString() }}
      </span>
    </div>
    <p class="feedback-card__text">{{ feedback.text }}</p>
    <div class="feedback-card__footer">
      <span class="feedback-card__email">{{ feedback.email }}</span>
      <button
        class="feedback-card__delete"
        title="Удалить"
        @click="emit('delete')">
        <i class="pi pi-trash"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FeedbackResponse } from '@/shared/types';

defineOptions({ name: 'FeedbackCard' });

const { feedback } = defineProps<{
  feedback: FeedbackResponse;
}>();

const emit = defineEmits<{
  delete: [];
}>();
</script>

<style lang="scss" scoped>
.feedback-card {
  padding: 12px 14px;
  border: 1px solid variables.$border-dark;
  border-radius: 10px;
  background: variables.$surface-dark-elevated;
}

.feedback-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.feedback-card__theme {
  overflow: hidden;
  color: variables.$text-primary-dark;
  font-size: 14px;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.feedback-card__time {
  flex-shrink: 0;
  margin-left: 8px;
  color: variables.$text-muted;
  font-size: 13px;
}

.feedback-card__text {
  margin-bottom: 6px;
  color: variables.$text-secondary;
  font-size: 14px;
  line-height: 1.5;
  overflow-wrap: break-word;
}

.feedback-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.feedback-card__email {
  overflow: hidden;
  color: variables.$text-muted;
  font-size: 13px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.feedback-card__delete {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border: none;
  border-radius: 4px;
  background: none;
  color: variables.$text-muted;
  cursor: pointer;
  transition: color 0.15s;

  &:hover {
    color: variables.$error-color;
  }
}
</style>
