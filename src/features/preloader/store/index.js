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

export default {
  namespaced: true,

  state: () => ({
    loadings: 0,
  }),

  mutations: {
    ADD_LOADER(state) {
      state.loadings += 1;
    },

    REMOVE_LOADER(state) {
      if (state.loadings > 0) {
        state.loadings -= 1;
      }
    },
  },

  getters: {
    SHOW_PRELOADER: (state) => !!state.loadings,
  },
};
