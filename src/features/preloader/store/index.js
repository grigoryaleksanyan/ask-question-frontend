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
