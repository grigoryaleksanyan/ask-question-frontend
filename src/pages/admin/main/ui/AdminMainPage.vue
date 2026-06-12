<template>
  <div class="admin-summary-page">
    <DashboardWidget v-if="isAdmin" />
    <SpeakerDashboardWidget v-else />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { UserRoleId } from '@/shared/dto';

import { useAuthStore } from '@/features/auth';
import { DashboardWidget, SpeakerDashboardWidget } from '@/widgets/dashboard';

defineOptions({ name: 'AdminMainPage' });

const authStore = useAuthStore();

const isAdmin = computed(
  () => authStore.userData?.userRoleId === UserRoleId.Administrator,
);
</script>

<style lang="scss" scoped>
.admin-summary-page {
  padding: 24px;
  color: variables.$text-primary-dark;
}
</style>
