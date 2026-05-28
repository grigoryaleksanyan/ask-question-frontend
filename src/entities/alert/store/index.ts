import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

import type { AlertItem, AlertType } from '@/shared/types';

import generateId from '../lib/pseudorandom-generator';

interface AddAlertPayload {
  type: AlertType;
  text: string;
  delay?: number;
}

export const useAlertStore = defineStore('alert', () => {
  const alerts = ref<AlertItem[]>([]);

  const getAlerts = computed(() => alerts.value);

  function addAlert({ type, text, delay }: AddAlertPayload) {
    const id = generateId();

    alerts.value.push({ id, type, text });

    if (type !== 'error') {
      setTimeout(() => {
        removeAlert(id);
      }, delay ?? 3000);
    }
  }

  function removeAlert(id: string) {
    alerts.value = alerts.value.filter((alert) => alert.id !== id);
  }

  return { alerts, getAlerts, addAlert, removeAlert };
});
