import type { RouteLocationNormalized, RouteLocationRaw } from 'vue-router';

import ROUTES from '@/shared/routes';

import { useAuthStore } from '@/features/auth';
import { GetUserData } from '@/entities/user';

export default async function checkAuth(
  to: RouteLocationNormalized,
): Promise<true | RouteLocationRaw> {
  const authStore = useAuthStore();

  if (!authStore.getAuthStatus) {
    try {
      const user = await GetUserData();
      authStore.setAuthData(user);
    } catch {
      if (authStore.getSetupRequired === null) {
        await authStore.checkSetupRequired();
      }

      if (authStore.getSetupRequired) {
        return { name: 'setup', query: { redirect: to.fullPath } };
      }

      return { name: 'login', query: { redirect: to.fullPath } };
    }
  }

  if (
    to.meta.requiredRole !== undefined &&
    authStore.userData?.userRoleId !== to.meta.requiredRole
  ) {
    return { name: ROUTES.admin };
  }

  return true;
}
