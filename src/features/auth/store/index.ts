import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

import type { UserResponse } from '@/shared/types';

export const useAuthStore = defineStore('auth', () => {
  const isAuthorized = ref(false);
  const userData = ref<UserResponse | null>(null);

  const getAuthStatus = computed(() => isAuthorized.value);
  const getUserData = computed(() => userData.value);

  function setAuthData(user: UserResponse) {
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
