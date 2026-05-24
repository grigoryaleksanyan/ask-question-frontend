import '@mdi/font/css/materialdesignicons.css';
// eslint-disable-next-line import-x/no-unresolved -- vuetify subpath export, resolved by vite at runtime
import 'vuetify/styles';

import { createVuetify } from 'vuetify';
// eslint-disable-next-line import-x/no-unresolved -- vuetify subpath export, resolved by vite at runtime
import { ru } from 'vuetify/locale';

export default createVuetify({
  lang: {
    locales: { ru },
    current: 'ru',
  },
  icons: {
    iconfont: 'mdi',
  },
});
