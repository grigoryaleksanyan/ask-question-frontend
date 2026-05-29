<template>
  <v-container
    style="max-width: 1200px"
    class="text-left pa-5 mx-auto"
    fluid>
    <v-row>
      <v-col cols="12">
        <h1 class="text-headline-small text-sm-headline-medium">Сводка</h1>
      </v-col>
    </v-row>
    <DashboardWidget />
  </v-container>
</template>

<script setup lang="ts">
import { DashboardWidget } from '@/widgets/dashboard';

defineOptions({ name: 'AdminMainPage' });
</script>
