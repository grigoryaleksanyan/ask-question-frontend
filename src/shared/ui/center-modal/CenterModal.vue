<template>
  <Dialog
    v-model:visible="isVisible"
    :header="title"
    modal
    :draggable="false"
    :style="{ maxWidth: '600px' }"
    @hide="onClose">
    <slot></slot>
    <template #footer>
      <slot name="footer"></slot>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import Dialog from 'primevue/dialog';

interface Props {
  isOpen: boolean;
  title: string;
}

defineOptions({ name: 'CenterModal' });

const { isOpen, title } = defineProps<Props>();

const emit = defineEmits<{
  close: [];
}>();

const isVisible = computed({
  get() {
    return isOpen;
  },
  set() {
    onClose();
  },
});

function onClose() {
  emit('close');
}
</script>
