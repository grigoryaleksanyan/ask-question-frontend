<template>
  <div
    style="max-width: 1200px"
    class="text-left p-5 mx-auto">
    <DashboardWidget />
  </div>
</template>

<script setup lang="ts">
import { DashboardWidget } from '@/widgets/dashboard';

defineOptions({ name: 'AdminMainPage' });
</script>
