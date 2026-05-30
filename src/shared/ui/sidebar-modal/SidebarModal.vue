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
        :is-open="isOpen"
        :toggle-preloader="togglePreloader"
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

import type { SidebarModalResult } from '@/shared/types';

interface Props {
  closeOnClickAway?: boolean;
}

const { closeOnClickAway = true } = defineProps<Props>();

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
  resolve: (value: SidebarModalResult) => void;
  reject: (reason?: unknown) => void;
} | null = null;

function open(): Promise<SidebarModalResult> {
  let resolve!: (value: SidebarModalResult) => void;
  let reject!: (reason?: unknown) => void;
  const modalPromise = new Promise<SidebarModalResult>((ok, fail) => {
    resolve = ok;
    reject = fail;
  });

  modalController = { resolve, reject };
  isOpen.value = true;

  return modalPromise;
}

function resolveModal(status: boolean, data: unknown = null) {
  modalController!.resolve({ status, data });
  isOpen.value = false;
}

function confirm(data: unknown = null) {
  resolveModal(true, data);
}

function close(data: unknown = null) {
  resolveModal(false, data);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function togglePreloader(_status: boolean) {}

defineExpose({
  open,
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
