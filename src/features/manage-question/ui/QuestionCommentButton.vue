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

  <SidebarModal ref="sidebarModalRef">
    <template #header>
      <span>Комментарий к вопросу</span>
    </template>

    <template #default="{ confirm, close }">
      <div class="question-comment-button__modal-content">
        <Textarea
          v-model="localComment"
          auto-resize
          rows="4"
          class="w-full"
          placeholder="Введите комментарий..." />

        <div class="question-comment-button__modal-actions">
          <Button
            label="Сохранить"
            @click="saveComment(confirm)" />
          <Button
            label="Отмена"
            severity="secondary"
            outlined
            @click="close()" />
        </div>
      </div>
    </template>
  </SidebarModal>
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

const sidebarModalRef = useTemplateRef('sidebarModalRef');
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
  await sidebarModalRef.value?.open();
}

async function saveComment(confirm?: (data?: unknown) => void) {
  const result = await executeSetComment(
    questionId,
    localComment.value || null,
  );
  if (result !== undefined && confirm) {
    confirm();
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

.question-comment-button__modal-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.question-comment-button__modal-actions {
  display: flex;
  gap: 8px;
}
</style>
