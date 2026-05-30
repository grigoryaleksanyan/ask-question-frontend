<template>
  <Dialog
    v-model:visible="isVisible"
    modal
    :draggable="false"
    :style="{ maxWidth: '600px' }"
    @hide="onHide">
    <template #header>
      <slot name="header"></slot>
    </template>
    <slot
      :confirm="confirm"
      :close="close"></slot>
    <template #footer>
      <slot name="footer"></slot>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import Dialog from 'primevue/dialog';

defineOptions({ name: 'CenterModal' });

const isVisible = ref(false);
let resolvePromise: ((value: string) => void) | null = null;

function open(): Promise<string> {
  isVisible.value = true;
  return new Promise((resolve) => {
    resolvePromise = resolve;
  });
}

function confirm() {
  isVisible.value = false;
  resolvePromise?.('confirm');
  resolvePromise = null;
}

function close() {
  isVisible.value = false;
  resolvePromise?.('close');
  resolvePromise = null;
}

function onHide() {
  resolvePromise?.('close');
  resolvePromise = null;
}

defineExpose({ open, confirm, close });
</script>

<style lang="scss" scoped>
:global(.p-dark) .p-dialog {
  background: variables.$surface-dark-elevated;
  color: variables.$text-primary-dark;

  :deep(.p-dialog-header) {
    color: variables.$text-primary-dark;
  }

  :deep(.p-dialog-footer) {
    color: variables.$text-primary-dark;
  }
}
</style>
