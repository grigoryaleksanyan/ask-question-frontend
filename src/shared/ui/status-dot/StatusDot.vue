<template>
  <Tag
    :value="label"
    class="status-dot"
    :class="{ 'status-dot--no-label': !label }"
    :pt="pt"
    :style="tagStyle">
    <template #icon>
      <span
        class="status-dot__indicator"
        :style="{ backgroundColor: color }"></span>
    </template>
  </Tag>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Tag from 'primevue/tag';

defineOptions({ name: 'StatusDot' });

const { color, label = '' } = defineProps<{
  color: string;
  label?: string;
}>();

const tagStyle = computed(() => {
  const isDotOnly = !label;

  return {
    backgroundColor: 'transparent',
    border: 'none',
    padding: 0,
    fontSize: '14px',
    fontWeight: '500',
    gap: isDotOnly ? '0' : '6px',
    flexShrink: '0',
    display: 'inline-flex',
    alignItems: 'center',
    minWidth: isDotOnly ? '10px' : 'auto',
    width: isDotOnly ? '10px' : 'auto',
    height: isDotOnly ? '10px' : 'auto',
    borderRadius: isDotOnly ? '50%' : '0',
    color: label ? color : 'transparent',
  };
});

const pt = computed(() => ({
  icon: {
    style: {
      margin: 0,
      width: '10px',
      height: '10px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: '0',
    },
  },
  value: {
    style: {
      display: label ? 'inline' : 'none',
      lineHeight: '1',
    },
  },
}));
</script>

<style lang="scss" scoped>
.status-dot__indicator {
  width: 10px;
  height: 10px;
  flex-shrink: 0;
  border-radius: 50%;
}

.status-dot--no-label {
  /* Dot-only modifier for potential parent overrides */
}
</style>
