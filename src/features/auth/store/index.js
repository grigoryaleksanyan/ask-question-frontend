export default {
  namespaced: true,

  state: () => ({
    isAuthorized: false,
    userData: null,
  }),

  mutations: {
    SET_AUTH_DATA: (state, userData) => {
      state.userData = userData;
      state.isAuthorized = true;
    },

    REMOVE_AUTH_DATA: (state) => {
      state.userData = null;
      state.isAuthorized = false;
    },
  },

  getters: {
    GET_AUTH_STATUS: (state) => state.isAuthorized,

    GET_USER_DATA: (state) => state.userData,
  },
};
