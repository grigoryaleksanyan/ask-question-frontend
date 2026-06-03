import { createPinia, setActivePinia } from 'pinia';
import { createRouter, createWebHistory, type Router } from 'vue-router';
import { vi } from 'vitest';

import { useAuthStore } from '@/features/auth';

vi.mock('@/entities/user', () => ({
  GetUserData: vi.fn(),
}));

let router: Router;

function setupRouter() {
  router = createRouter({
    history: createWebHistory('/'),
    routes: [
      { path: '/', name: 'main', component: { template: '<div/>' } },
      {
        path: '/login',
        name: 'login',
        component: { template: '<div/>' },
        meta: { layout: 'EmptyLayout' },
      },
      {
        path: '/admin',
        name: 'admin',
        component: { template: '<div/>' },
        meta: { layout: 'AdminLayout', isProtected: true },
      },
      {
        path: '/:catchAll(.*)',
        name: 'not-found',
        component: { template: '<div/>' },
        meta: { layout: 'EmptyLayout' },
      },
    ],
  });

  router.beforeEach((to) => {
    const authStore = useAuthStore();

    if (to.name === 'login' && authStore.getAuthStatus) {
      return { name: 'admin' };
    }

    if (to.meta.isProtected) {
      return true;
    }

    return true;
  });

  return router;
}

describe('router beforeEach guard', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    setupRouter();
  });

  it('редиректит авторизованного с /login на /admin', async () => {
    const authStore = useAuthStore();
    authStore.setAuthData({
      id: '1',
      email: 'admin@askquestion.local',
      userRoleId: 1,
      created: '',
      updated: null,
      userDetails: null,
    } as any);

    await router.push('/login');
    await router.isReady();

    expect(router.currentRoute.value.name).toBe('admin');
  });

  it('пропускает неавторизованного на /login', async () => {
    await router.push('/login');
    await router.isReady();

    expect(router.currentRoute.value.name).toBe('login');
  });
});
