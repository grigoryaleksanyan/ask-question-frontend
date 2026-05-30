<template>
  <Dialog
    :visible="visible"
    :header="title"
    modal
    :draggable="false"
    :style="{ maxWidth: '600px' }"
    @update:visible="onVisibleUpdate">
    <slot></slot>
    <template #footer>
      <slot name="footer"></slot>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

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

const visible = ref(isOpen);

watch(
  () => isOpen,
  (newVal) => {
    visible.value = newVal;
  },
);

function onVisibleUpdate(value: boolean) {
  console.log('onVisibleUpdate', value);
  if (!value) {
    visible.value = false;
    emit('close');
  }
}
</script>
