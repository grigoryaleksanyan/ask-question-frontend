<template>
  <div>
    <transition name="overlay">
      <div
        v-if="isOpen"
        class="modal-overlay"
        @click="clickOnOverlay"></div>
    </transition>
    <transition name="modal">
      <div
        v-if="isOpen || forcedSlotRender"
        class="modal-wrapper"
        :class="{ 'modal-hide': forcedSlotRender && !isOpen }">
        <transition name="preloader">
          <div
            v-if="showPreloader"
            class="modal-preloader">
            <SidebarPreloader />
          </div>
        </transition>
        <slot
          :is-open="isOpen"
          :toggle-preloader="togglePreloader"
          :confirm="confirm"
          :close="close">
        </slot>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, onBeforeUnmount, provide, ref } from 'vue';

import type { SidebarModalResult } from '@/shared/types';

interface Props {
  forcedSlotRender?: boolean;
  closeOnEsc?: boolean;
  closeOnClickAway?: boolean;
}

const {
  forcedSlotRender = false,
  closeOnEsc,
  closeOnClickAway,
} = defineProps<Props>();

const SidebarPreloader = defineAsyncComponent(
  () => import('./SidebarPreloader.vue'),
);

const isOpen = ref(false);
const showPreloader = ref(false);

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && !showPreloader.value) {
    close();
  }
}

function clickOnOverlay() {
  if (closeOnClickAway && !showPreloader.value) {
    close();
  }
}

function togglePreloader(status: boolean) {
  showPreloader.value = status;
}

function toggleScroll(value: boolean) {
  document.querySelector('html')!.style.overflowY = value ? 'hidden' : 'auto';
}

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
  toggleScroll(true);

  if (closeOnEsc) {
    document.addEventListener('keydown', handleKeydown);
  }

  return modalPromise;
}

function resolveModal(status: boolean, data: unknown = null) {
  modalController!.resolve({ status, data });
  isOpen.value = false;
  toggleScroll(false);

  if (closeOnEsc) {
    document.removeEventListener('keydown', handleKeydown);
  }
}

function confirm(data: unknown = null) {
  resolveModal(true, data);
}

function close(data: unknown = null) {
  resolveModal(false, data);
}

provide('close', close);

onBeforeUnmount(() => {
  toggleScroll(false);
});

defineExpose({
  open,
});
</script>

<style lang="scss" scoped>
@use './styles/modal-variables';

$modal-width: modal-variables.$modal-width;

$overlay-z-index: 1500;
$wrapper-z-index: $overlay-z-index + 1;
$preloader-z-index: $overlay-z-index + 2;

.modal-overlay {
  position: fixed;
  z-index: $overlay-z-index;
  width: 100%;
  height: 100%;
  background-color: rgb(0 0 0 / 50%);
  inset: 0;
}

.modal-wrapper {
  position: fixed;
  z-index: $wrapper-z-index;
  top: 0;
  right: 0;
  overflow: hidden;
  width: 100%;
  max-width: $modal-width;
  height: 100%;
  border-radius: 16px 0 0 16px;
  background-color: white;
}

.modal-hide {
  display: none;
}

.modal-preloader {
  position: absolute;
  z-index: $preloader-z-index;
  width: 100%;
  height: 100%;
  background-color: rgb(0 0 0 / 20%);
  inset: 0;
}

.overlay-enter-active,
.overlay-leave-active {
  transition: all 0.2s ease;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  transform: translateX(100%);
}

.preloader-enter-active,
.preloader-leave-active {
  transition: all 0.2s ease;
}

.preloader-enter-from,
.preloader-leave-to {
  opacity: 0;
}

@media (width <= $modal-width) {
  .modal-wrapper {
    height: calc(100% - 50px);
    border-radius: 16px 16px 0 0;
    margin-top: 50px;
  }

  .modal-enter-active,
  .modal-leave-active {
    transition: all 0.2s ease;
  }

  .modal-enter-from,
  .modal-leave-to {
    transform: translateY(100%);
  }
}
</style>
