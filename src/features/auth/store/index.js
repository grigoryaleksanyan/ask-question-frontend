/* eslint-disable import/prefer-default-export */
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
