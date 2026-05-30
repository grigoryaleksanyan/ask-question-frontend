<template>
  <Drawer
    v-model:visible="isVisible"
    position="right"
    modal
    :style="{ width: slideOverWidth }"
    class="slide-over"
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
  </Drawer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

import Drawer from 'primevue/drawer';

defineOptions({ name: 'SlideOver' });

const isVisible = ref(false);
let resolvePromise: ((value: string) => void) | null = null;

const slideOverWidth = computed(() =>
  window.innerWidth < 600 ? '100%' : '400px',
);

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
.slide-over {
  :deep(.p-drawer-content) {
    padding: 16px;
  }
}
</style>
