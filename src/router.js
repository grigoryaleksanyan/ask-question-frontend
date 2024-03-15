// import Vue from 'vue';
// import VueRouter from 'vue-router';

import { createRouter, createWebHistory } from 'vue-router';

import AdminRoutes from '@/modules/admin/routes/index';
import checkAuth from '@/core/middleware/auth-middleware';

// Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/core/ui/views/HomeView.vue'),
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
    component: () => import('@/core/ui/views/NotFoundView.vue'),
    meta: {
      layout: 'EmptyLayout',
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.isProtected) {
    checkAuth(next);
  } else {
    next();
  }
});

export default router;
