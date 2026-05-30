<template>
  <span class="status-dot">
    <span
      class="status-dot__indicator"
      :style="{ backgroundColor: color }"></span>
    <span
      v-if="label"
      class="status-dot__label"
      :style="{ color }">
      {{ label }}
    </span>
  </span>
</template>

<script setup lang="ts">
defineOptions({ name: 'StatusDot' });

const { color, label = '' } = defineProps<{
  color: string;
  label?: string;
}>();
</script>

<style lang="scss" scoped>
.status-dot {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.status-dot__indicator {
  width: 10px;
  height: 10px;
  flex-shrink: 0;
  border-radius: 50%;
}

.status-dot__label {
  font-size: 14px;
  font-weight: 500;
}
</style>
