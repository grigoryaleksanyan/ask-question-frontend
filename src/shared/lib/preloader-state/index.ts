import { ref, computed } from 'vue';

export const loadings = ref(0);

export const showPreloader = computed(() => loadings.value > 0);

export function addLoader() {
  loadings.value += 1;
}

export function removeLoader() {
  if (loadings.value > 0) {
    loadings.value -= 1;
  }
}
