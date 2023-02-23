import Vue from 'vue';
import VueRouter from 'vue-router';

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
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
