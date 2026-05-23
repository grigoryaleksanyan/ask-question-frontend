<template>
  <div class="alert">
    <transition-group name="scroll-y-reverse-transition">
      <AppAlertItem
        v-for="alert in getAlerts"
        :key="alert.id"
        :alert="alert" />
    </transition-group>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useAlertStore } from '../store';
import AppAlertItem from './AppAlertItem.vue';

defineOptions({ name: 'AppAlert' });

const alertStore = useAlertStore();

const { getAlerts } = storeToRefs(alertStore);
</script>

<style lang="scss" scoped>
.alert {
  position: fixed;
  z-index: 1000;
  top: 75px;
  right: 10px;
  width: 370px;
}

@media (width <= 400px) {
  .alert {
    right: unset;
    left: 50%;
    width: 300px;
    transform: translateX(-50%);
  }
}
</style>
