import router from '@/app/routes';
import store from '@/app/store/store';

import vuetify from './vuetify';
import veeValidate from './vee-validate';

export default function registerPlugins(app) {
  app.use(router).use(store).use(vuetify).use(veeValidate);
}
