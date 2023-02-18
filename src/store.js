import Vue from 'vue';
import Vuex from 'vuex';

import preloader from '@/modules/preloader/store';
import alert from '@/modules/alert/store';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    preloader,
    alert,
  },
});
