import router from '@/app/router';
import store from '@/app/store/store';

import vuetify from './vuetify';
import veeValidate from './vee-validate';
import setupHttpClientInterceptors from './http-client-interceptors';

export default function registerPlugins(app) {
  app.use(router).use(store).use(vuetify).use(veeValidate);

  setupHttpClientInterceptors();
}
