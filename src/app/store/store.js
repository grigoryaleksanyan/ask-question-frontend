import { createStore } from 'vuex';

import preloader from '@/features/preloader/store';
import alert from '@/entities/alert/store';
import auth from '@/features/auth/store';

export default createStore({
  modules: {
    preloader,
    alert,
    auth,
  },
});
