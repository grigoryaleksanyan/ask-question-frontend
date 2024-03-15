import router from '@/router';
import store from '@/store';

import vuetify from './vuetify';
import veeValidate from './vee-validate';

export default function registerPlugins(app) {
  app.use(router).use(store).use(vuetify).use(veeValidate);
}
