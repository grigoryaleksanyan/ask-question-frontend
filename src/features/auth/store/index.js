import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const isAuthorized = ref(false);
  const userData = ref(null);

  const getAuthStatus = computed(() => isAuthorized.value);
  const getUserData = computed(() => userData.value);

  function setAuthData(user) {
    userData.value = user;
    isAuthorized.value = true;
  }

  function removeAuthData() {
    userData.value = null;
    isAuthorized.value = false;
  }

  return {
    isAuthorized,
    userData,
    getAuthStatus,
    getUserData,
    setAuthData,
    removeAuthData,
  };
});

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
