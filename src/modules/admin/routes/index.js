export default [
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../ui/views/AdminMainView.vue'),
    meta: {
      layout: 'AdminLayout',
      isProtected: true,
    },
  },

  {
    path: '/admin-questions',
    name: 'admin-questions',
    component: () => import('../ui/views/AdminQuestionsView.vue'),
    meta: {
      layout: 'AdminLayout',
      isProtected: true,
    },
  },

  {
    path: '/admin-faq',
    name: 'admin-faq',
    component: () => import('../ui/views/AdminFAQView.vue'),
    meta: {
      layout: 'AdminLayout',
      isProtected: true,
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
          isProtected: true,
        },
        component: () => import('../ui/views/AdminFAQCategoryView.vue'),
      },
    ],
  },

  {
    path: '/admin-speakers',
    name: 'admin-speakers',
    component: () => import('../ui/views/AdminSpeakersView.vue'),
    meta: {
      layout: 'AdminLayout',
      isProtected: true,
    },
  },

  {
    path: '/admin-areas',
    name: 'admin-areas',
    component: () => import('../ui/views/AdminAreasView.vue'),
    meta: {
      layout: 'AdminLayout',
      isProtected: true,
    },
  },

  {
    path: '/admin-feedback',
    name: 'admin-feedback',
    component: () => import('../ui/views/AdminFeedbackView.vue'),
    meta: {
      layout: 'AdminLayout',
      isProtected: true,
    },
  },
];
