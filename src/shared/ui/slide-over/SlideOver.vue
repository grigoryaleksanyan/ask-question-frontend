<template>
  <Drawer
    v-model:visible="isVisible"
    position="right"
    modal
    :dismissable="closeOnClickAway"
    :style="{ width: slideOverWidth }"
    class="slide-over"
    @hide="onHide">
    <template #header>
      <slot name="header"></slot>
    </template>
    <div class="slide-over__content">
      <slot
        :confirm="confirm"
        :close="close"></slot>
    </div>
    <template #footer>
      <slot name="footer"></slot>
    </template>
  </Drawer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

import Drawer from 'primevue/drawer';

import type { ModalResult } from '@/shared/dto';

defineOptions({ name: 'SlideOver' });

const { closeOnClickAway = true } = defineProps<Props>();

interface Props {
  closeOnClickAway?: boolean;
}

const isVisible = ref(false);

let modalController: {
  resolve: (value: ModalResult) => void;
  reject: (reason?: unknown) => void;
} | null = null;

const slideOverWidth = computed(() =>
  window.innerWidth < 600 ? '100%' : '400px',
);

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

function resolveModal(status: boolean, data?: unknown) {
  modalController!.resolve({ status, data });
  isVisible.value = false;
  modalController = null;
}

function confirm(data?: unknown) {
  resolveModal(true, data);
}

function close() {
  resolveModal(false);
}

function onHide() {
  if (modalController) {
    resolveModal(false);
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function togglePreloader(_status: boolean) {}

defineExpose({ open, confirm, close, togglePreloader });
</script>

<style lang="scss" scoped>
.slide-over__content {
  overflow-y: auto;
  overscroll-behavior: none;
}

.slide-over {
  :deep(.p-drawer-footer) {
    border-top: 1px solid var(--p-surface-border);
  }

  :global(.p-dark) & {
    :deep(.p-drawer) {
      background: variables.$surface-dark-elevated;
      color: variables.$text-primary-dark;
    }

    :deep(.p-drawer-header) {
      color: variables.$text-primary-dark;
    }

    :deep(.p-drawer-footer) {
      color: variables.$text-primary-dark;
    }
  }
}
</style>
