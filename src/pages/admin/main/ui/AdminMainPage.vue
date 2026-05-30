<template>
  <div
    style="max-width: 1200px"
    class="admin-summary-page">
    <DashboardWidget />
  </div>
</template>

<script setup lang="ts">
import { DashboardWidget } from '@/widgets/dashboard';

defineOptions({ name: 'AdminMainPage' });
</script>

<style lang="scss" scoped>
.admin-summary-page {
  padding: 24px;
  color: variables.$text-primary-dark;
}
</style>
