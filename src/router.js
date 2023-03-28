import Vue from 'vue';
import VueRouter from 'vue-router';

import AdminRoutes from '@/modules/admin/routes/index';
import checkAuth from '@/core/middleware/auth-middleware';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "home" */ '@/core/ui/views/HomeView.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '@/modules/auth/ui/views/LoginView.vue'),
    meta: {
      layout: 'EmptyLayout',
    },
  },
  {
    path: '/questions',
    name: 'questions',
    component: () => import(/* webpackChunkName: "questions" */ '@/modules/question/ui/views/QuestionsView.vue'),
  },
  {
    path: '/question/:id',
    name: 'question',
    component: () => import(/* webpackChunkName: "question" */ '@/modules/question/ui/views/QuestionIdView.vue'),
  },
  {
    path: '/faq',
    name: 'faq',
    component: () => import(/* webpackChunkName: "questions" */ '@/modules/faq/ui/views/FAQView.vue'),
  },

  ...AdminRoutes,

  {
    path: '*',
    component: () => import(/* webpackChunkName: "not-found" */ '@/core/ui/views/NotFoundView.vue'),
    meta: {
      layout: 'EmptyLayout',
    },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
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
