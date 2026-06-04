<template>
  <button
    class="question-comment-button"
    :class="{
      'question-comment-button--has-comment': comment !== null,
    }"
    :title="comment ? 'Комментарий есть' : 'Добавить комментарий'"
    @click="openModal">
    <i class="pi pi-comment"></i>
  </button>

  <SlideOver ref="slideOverRef">
    <template #header>
      <span class="typography__headline--medium">Комментарий к вопросу</span>
    </template>
    <template #default>
      <div class="modal-form">
        <Textarea
          v-model="localComment"
          auto-resize
          rows="4"
          class="w-full"
          placeholder="Введите комментарий..." />
      </div>
    </template>
    <template #footer>
      <Button
        label="Сохранить"
        @click="saveComment()" />
      <Button
        label="Отмена"
        outlined
        severity="secondary"
        @click="slideOverRef?.close()" />
    </template>
  </SlideOver>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';

import { SetQuestionComment } from '@/entities/question';
import { useApiCall } from '@/shared/lib';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';

defineOptions({ name: 'QuestionCommentButton' });

const { questionId, comment } = defineProps<{
  questionId: string;
  comment: string | null;
}>();

const emit = defineEmits<{
  'comment-changed': [id: string, newComment: string | null];
  error: [id: string];
}>();

const slideOverRef = useTemplateRef('slideOverRef');
const localComment = ref(comment ?? '');

const { execute: executeSetComment } = useApiCall(SetQuestionComment, {
  showPreloader: false,
  successMessage: 'Комментарий сохранён',
  onSuccess() {
    emit('comment-changed', questionId, localComment.value || null);
  },
  onError() {
    emit('error', questionId);
  },
});

async function openModal() {
  localComment.value = comment ?? '';
  await slideOverRef.value?.open();
}

async function saveComment() {
  const result = await executeSetComment(
    questionId,
    localComment.value || null,
  );
  if (result !== undefined) {
    slideOverRef.value?.confirm();
  }
}
</script>

<style lang="scss" scoped>
.question-comment-button {
  display: flex;
  width: 28px;
  height: 28px;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  border-radius: 6px;
  background: none;
  color: variables.$text-muted;
  cursor: pointer;
  font-size: 14px;
  transition:
    color 0.15s,
    background 0.15s;

  &:hover {
    background: rgb(0 0 0 / 4%);
  }

  &--has-comment {
    color: variables.$main-color;
  }
}
</style>
