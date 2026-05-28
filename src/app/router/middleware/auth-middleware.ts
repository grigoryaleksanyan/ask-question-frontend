import { useAuthStore } from '@/features/auth';
import { useAlertStore } from '@/entities/alert';

import { ALERT_TYPES } from '@/shared/config';
import { GetUserData } from '@/entities/user';

export default async function checkAuth():
  | Promise<true>
  | Promise<{ name: string }> {
  const authStore = useAuthStore();

  if (!authStore.getAuthStatus) {
    try {
      const user = await GetUserData();

      authStore.setAuthData(user);

      return true;
    } catch (error) {
      const alertStore = useAlertStore();
      const err = error as Error;

      alertStore.addAlert({
        type: ALERT_TYPES.ERROR,
        text: err.message,
      });

      return { name: 'login' };
    }
  }

  return true;
}
