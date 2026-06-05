<template>
  <Avatar
    :label="initials"
    shape="circle"
    class="speaker-avatar" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Avatar from 'primevue/avatar';

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
  background: variables.$surface-dark-border;
  color: variables.$text-muted;
  font-size: 13px;
  font-weight: 500;
}
</style>
