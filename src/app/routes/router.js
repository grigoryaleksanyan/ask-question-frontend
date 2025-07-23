import { createRouter, createWebHistory } from 'vue-router';

import AdminRoutes from '@/modules/admin/routes/index';
import checkAuth from '@/app/routes/middleware/auth-middleware';
import ROUTES from '@/shared/routes';

const routes = [
  {
    path: '/',
    name: ROUTES.main,
    component: () => import('@/pages/main'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/modules/auth/ui/views/LoginView.vue'),
    meta: {
      layout: 'EmptyLayout',
    },
  },
  {
    path: '/questions',
    name: 'questions',
    component: () => import('@/modules/question/ui/views/QuestionsView.vue'),
  },
  {
    path: '/question/:id',
    name: 'question',
    component: () => import('@/modules/question/ui/views/QuestionIdView.vue'),
  },
  {
    path: '/faq',
    name: 'faq',
    component: () => import('@/modules/faq/ui/views/FAQView.vue'),
  },

  ...AdminRoutes,

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
    return checkAuth();
  }

  return true;
});

export default router;
