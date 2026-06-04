import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

import type { UserResponse } from '@/shared/dto';

import { SetupRequired as SetupRequiredApi } from '../api/auth-repository';

export const useAuthStore = defineStore('auth', () => {
  const isAuthorized = ref(false);
  const userData = ref<UserResponse | null>(null);
  const setupRequired = ref<boolean | null>(null);

  const getAuthStatus = computed(() => isAuthorized.value);
  const getUserData = computed(() => userData.value);
  const getSetupRequired = computed(() => setupRequired.value);

  function setAuthData(user: UserResponse) {
    userData.value = user;
    isAuthorized.value = true;
    setupRequired.value = false;
  }

  function removeAuthData() {
    userData.value = null;
    isAuthorized.value = false;
  }

  async function checkSetupRequired() {
    try {
      const response = await SetupRequiredApi();
      setupRequired.value = response.setupRequired;
    } catch {
      setupRequired.value = null;
    }
  }

  return {
    isAuthorized,
    userData,
    setupRequired,
    getAuthStatus,
    getUserData,
    getSetupRequired,
    setAuthData,
    removeAuthData,
    checkSetupRequired,
  };
});
