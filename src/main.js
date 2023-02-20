import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './core/plugins/vuetify';
import httpClient from './core/plugins/http-client';

import '@/core/assets/styles/index.scss';

import '@/core/plugins/global-components';

Vue.config.productionTip = false;
Vue.prototype.httpClient = httpClient;

// eslint-disable-next-line vue/require-name-property
new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
