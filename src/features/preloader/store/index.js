import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const usePreloaderStore = defineStore('preloader', () => {
  const loadings = ref(0);

  const showPreloader = computed(() => !!loadings.value);

  function addLoader() {
    loadings.value += 1;
  }

  function removeLoader() {
    if (loadings.value > 0) {
      loadings.value -= 1;
    }
  }

  return { loadings, showPreloader, addLoader, removeLoader };
});
