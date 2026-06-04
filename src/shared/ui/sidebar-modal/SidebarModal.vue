<template>
  <Drawer
    v-model:visible="isVisible"
    position="right"
    modal
    :dismissable="closeOnClickAway"
    style="width: 100%; max-width: 400px">
    <template #header>
      <slot name="header"></slot>
    </template>
    <div style="overflow-y: auto; overscroll-behavior: none">
      <slot
        :confirm="confirm"
        :close="close">
      </slot>
    </div>
    <template #footer>
      <slot name="footer"></slot>
    </template>
  </Drawer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

import Drawer from 'primevue/drawer';

import type { ModalResult } from '@/shared/types';

defineOptions({ name: 'SidebarModal' });

const { closeOnClickAway = true } = defineProps<Props>();

interface Props {
  closeOnClickAway?: boolean;
}

const isOpen = ref(false);

const isVisible = computed({
  get() {
    return isOpen.value;
  },
  set(value: boolean) {
    if (!value && isOpen.value) {
      close();
    }
  },
});

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
  isOpen.value = true;

  return modalPromise;
}

function resolveModal(status: boolean, data?: unknown) {
  modalController!.resolve({ status, data });
  isOpen.value = false;
}

function confirm(data?: unknown) {
  resolveModal(true, data);
}

function close() {
  resolveModal(false);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function togglePreloader(_status: boolean) {}

defineExpose({
  open,
  confirm,
  close,
  togglePreloader,
});
</script>

<style lang="scss" scoped>
:global(.p-dark) :deep(.p-drawer) {
  background: variables.$surface-dark-elevated;
  color: variables.$text-primary-dark;
}

:global(.p-dark) :deep(.p-drawer-header) {
  color: variables.$text-primary-dark;
}

:global(.p-dark) :deep(.p-drawer-footer) {
  color: variables.$text-primary-dark;
}
</style>
