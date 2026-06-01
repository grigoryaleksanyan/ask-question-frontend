import type { RouteLocationNormalized, RouteLocationRaw } from 'vue-router';

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
      return true;
    } catch {
      return { name: 'login', query: { redirect: to.fullPath } };
    }
  }

  return true;
}
