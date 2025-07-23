import store from '@/app/store/store';

import ALERT_TYPES from '@/modules/alert/constants/alert-types';
import { GetUserData } from '@/modules/user/repositories/user-repository';

export default async function checkAuth() {
  if (!store.getters['auth/GET_AUTH_STATUS']) {
    try {
      const user = await GetUserData();

      store.commit('auth/SET_AUTH_DATA', user);

      return true;
    } catch (error) {
      store.commit('alert/ADD_ALERT', {
        type: ALERT_TYPES.ERROR,
        text: error.message,
      });

      return {
        name: 'login',
      };
    }
  }

  return true;
}
