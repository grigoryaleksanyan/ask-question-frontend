import { createStore } from 'vuex';

import preloader from '@/modules/preloader/store';
import alert from '@/modules/alert/store';
import auth from '@/modules/auth/store';

export default createStore({
  modules: {
    preloader,
    alert,
    auth,
  },
});
