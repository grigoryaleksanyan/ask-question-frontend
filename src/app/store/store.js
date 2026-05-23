import { createStore } from 'vuex';

import preloader from '@/modules/preloader/store';
import alert from '@/entities/alert/store';
import auth from '@/modules/auth/store';

export default createStore({
  modules: {
    preloader,
    alert,
    auth,
  },
});
