export default [
  {
    path: '/admin',
    name: 'admin',
    component: () => import(/* webpackChunkName: "admin-main" */ '../ui/views/AdminMainView.vue'),
    meta: {
      layout: 'AdminLayout',
    },
  },

  {
    path: '/admin-questions',
    name: 'admin-questions',
    component: () => import(/* webpackChunkName: "admin-questions" */ '../ui/views/AdminQuestionsView.vue'),
    meta: {
      layout: 'AdminLayout',
    },
  },

  {
    path: '/admin-faq',
    name: 'admin-faq',
    component: () => import(/* webpackChunkName: "admin-faq" */ '../ui/views/AdminFAQView.vue'),
    meta: {
      layout: 'AdminLayout',
    },
    children: [
      {
        path: ':id',
        name: 'admin-faq-category',
        props: (route) => ({
          id: route.params.id,
        }),
        meta: {
          layout: 'AdminLayout',
        },
        component: () => import(/* webpackChunkName: "admin-faq-category" */ '../ui/views/AdminFAQCategoryView.vue'),
      },
    ],
  },

  {
    path: '/admin-speakers',
    name: 'admin-speakers',
    component: () => import(/* webpackChunkName: "admin-speakers" */ '../ui/views/AdminSpeakersView.vue'),
    meta: {
      layout: 'AdminLayout',
    },
  },

  {
    path: '/admin-areas',
    name: 'admin-areas',
    component: () => import(/* webpackChunkName: "admin-areas" */ '../ui/views/AdminAreasView.vue'),
    meta: {
      layout: 'AdminLayout',
    },
  },

  {
    path: '/admin-feedback',
    name: 'admin-feedback',
    component: () => import(/* webpackChunkName: "admin-feedback" */ '../ui/views/AdminFeedbackView.vue'),
    meta: {
      layout: 'AdminLayout',
    },
  },
];
