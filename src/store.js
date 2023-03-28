import Vue from 'vue';
import Vuex from 'vuex';

import preloader from '@/modules/preloader/store';
import alert from '@/modules/alert/store';
import auth from '@/modules/auth/store';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    preloader,
    alert,
    auth,
  },
});
