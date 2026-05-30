<template>
  <div
    style="max-width: 1200px"
    class="text-left p-5 mx-auto">
    <div class="grid">
      <div class="col-12">
        <h1
          class="typography__headline--small typography__headline--medium--sm">
          Сводка
        </h1>
      </div>
    </div>
    <DashboardWidget />
  </div>
</template>

<script setup lang="ts">
import { DashboardWidget } from '@/widgets/dashboard';

defineOptions({ name: 'AdminMainPage' });
</script>
