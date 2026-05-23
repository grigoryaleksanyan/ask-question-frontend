import router from '@/app/router';
import { createPinia } from 'pinia';

import vuetify from './vuetify';
import veeValidate from './vee-validate';
import setupHttpClientInterceptors from './http-client-interceptors';

export default function registerPlugins(app) {
  const pinia = createPinia();

  app.use(router).use(pinia).use(vuetify).use(veeValidate);

  setupHttpClientInterceptors();
}
