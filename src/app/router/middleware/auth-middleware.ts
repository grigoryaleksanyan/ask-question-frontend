import { useAuthStore } from '@/features/auth';
import { useToast } from 'primevue/usetoast';
import { GetUserData } from '@/entities/user';
import { TOAST_HANDLED } from '@/shared/lib/use-api-call';

export default async function checkAuth(): Promise<true | { name: string }> {
  const authStore = useAuthStore();

  if (!authStore.getAuthStatus) {
    try {
      const user = await GetUserData();
      authStore.setAuthData(user);
      return true;
    } catch (error) {
      const toast = useToast();
      const err = error as Error;
      toast.add({
        severity: 'error',
        detail: err.message,
        group: 'api',
        life: undefined,
      });
      (error as Record<symbol, boolean>)[TOAST_HANDLED] = true;
      return { name: 'login' };
    }
  }

  return true;
}
