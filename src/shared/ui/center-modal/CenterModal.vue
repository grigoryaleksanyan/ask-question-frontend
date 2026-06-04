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
    <div style="overflow-y: auto; overscroll-behavior: none">
      <slot
        :confirm="confirm"
        :close="close"></slot>
    </div>
    <template #footer>
      <slot name="footer"></slot>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import Dialog from 'primevue/dialog';

import type { ModalResult } from '@/shared/dto';

defineOptions({ name: 'CenterModal' });

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { closeOnClickAway = true } = defineProps<Props>();

interface Props {
  closeOnClickAway?: boolean;
}

const isVisible = ref(false);
let modalController: {
  resolve: (value: ModalResult) => void;
  reject: (reason?: unknown) => void;
} | null = null;

function open(): Promise<ModalResult> {
  let resolve!: (value: ModalResult) => void;
  let reject!: (reason?: unknown) => void;
  const modalPromise = new Promise<ModalResult>((ok, fail) => {
    resolve = ok;
    reject = fail;
  });

  modalController = { resolve, reject };
  isVisible.value = true;

  return modalPromise;
}

function confirm(data?: unknown) {
  modalController!.resolve({ status: true, data });
  isVisible.value = false;
  modalController = null;
}

function close() {
  modalController!.resolve({ status: false });
  isVisible.value = false;
  modalController = null;
}

function onHide() {
  if (modalController) {
    modalController.resolve({ status: false });
    modalController = null;
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function togglePreloader(_status: boolean) {}

defineExpose({ open, confirm, close, togglePreloader });
</script>

<style lang="scss" scoped>
:deep(.p-dialog-footer) {
  border-top: 1px solid var(--p-surface-border);
}

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
