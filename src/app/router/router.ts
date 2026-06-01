import { createRouter, createWebHistory } from 'vue-router';

import checkAuth from '@/app/router/middleware/auth-middleware';
import ROUTES from '@/shared/routes';

declare module 'vue-router' {
  interface RouteMeta {
    layout?: string;
    isProtected?: boolean;
  }
}

const routes = [
  {
    path: '/',
    name: ROUTES.main,
    component: () => import('@/pages/main'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/features/auth/ui/LoginView.vue'),
    meta: {
      layout: 'EmptyLayout',
    },
  },
  {
    path: '/questions',
    name: 'questions',
    component: () => import('@/pages/questions'),
  },
  {
    path: '/question/:id',
    name: 'question',
    component: () => import('@/pages/questions/detail'),
  },
  {
    path: '/faq',
    name: 'faq',
    component: () => import('@/pages/faq'),
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('@/pages/admin/main'),
    meta: { layout: 'AdminLayout', isProtected: true },
  },
  {
    path: '/admin-questions',
    name: 'admin-questions',
    component: () => import('@/pages/admin/questions'),
    meta: { layout: 'AdminLayout', isProtected: true },
  },
  {
    path: '/admin-faq',
    name: 'admin-faq',
    component: () => import('@/pages/admin/faq'),
    meta: { layout: 'AdminLayout', isProtected: true },
    children: [
      {
        path: ':id',
        name: 'admin-faq-category',
        props: (route: { params: { id: string } }) => ({
          id: route.params.id,
        }),
        meta: { layout: 'AdminLayout', isProtected: true },
        component: () =>
          import('@/pages/admin/faq/ui/AdminFAQCategoryPage.vue'),
      },
    ],
  },
  {
    path: '/admin-speakers',
    name: 'admin-speakers',
    component: () => import('@/pages/admin/speakers'),
    meta: { layout: 'AdminLayout', isProtected: true },
  },
  {
    path: '/admin-areas',
    name: 'admin-areas',
    component: () => import('@/pages/admin/areas'),
    meta: { layout: 'AdminLayout', isProtected: true },
  },
  {
    path: '/admin-feedback',
    name: 'admin-feedback',
    component: () => import('@/pages/admin/feedback'),
    meta: { layout: 'AdminLayout', isProtected: true },
  },

  {
    path: '/:catchAll(.*)',
    name: ROUTES.notFound,
    component: () => import('@/pages/errors'),
    meta: {
      layout: 'EmptyLayout',
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to) => {
  if (to.meta.isProtected) {
    return checkAuth(to);
  }

  return true;
});

export default router;
