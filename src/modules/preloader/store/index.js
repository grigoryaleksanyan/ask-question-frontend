export default {
  namespaced: true,

  state: () => ({
    loadings: 0,
  }),

  mutations: {
    ADD_LOAD(state) {
      state.loadings += 1;
    },

    REMOVE_LOAD(state) {
      if (state.loadings > 0) {
        state.loadings -= 1;
      }
    },
  },

  getters: {
    SHOW_PRELOADER: (state) => !!state.loadings,
  },
};
