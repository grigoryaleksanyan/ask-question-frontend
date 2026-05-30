<template>
  <div class="speaker-avatar">
    {{ initials }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

defineOptions({ name: 'SpeakerAvatar' });

const { firstName, lastName } = defineProps<{
  firstName: string;
  lastName: string;
}>();

const initials = computed(() =>
  (firstName.charAt(0) + lastName.charAt(0)).toUpperCase(),
);
</script>

<style lang="scss" scoped>
.speaker-avatar {
  display: flex;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: variables.$surface-dark-border;
  color: variables.$text-muted;
  font-size: 13px;
  font-weight: 500;
}
</style>
