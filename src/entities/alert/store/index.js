import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

import generateId from '../lib/pseudorandom-generator';

export const useAlertStore = defineStore('alert', () => {
  const alerts = ref([]);

  const getAlerts = computed(() => alerts.value);

  function addAlert({ type, text, delay }) {
    const id = generateId();

    alerts.value.push({ id, type, text });

    if (type !== 'error') {
      setTimeout(() => {
        removeAlert(id);
      }, delay ?? 3000);
    }
  }

  function removeAlert(id) {
    alerts.value = alerts.value.filter((alert) => alert.id !== id);
  }

  return { alerts, getAlerts, addAlert, removeAlert };
});
