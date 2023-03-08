import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import ru from 'vuetify/lib/locale/ru';

// eslint-disable-next-line import/no-extraneous-dependencies
import '@mdi/font/css/materialdesignicons.css';

import { TiptapVuetifyPlugin } from 'tiptap-vuetify';
import 'tiptap-vuetify/dist/main.css';

Vue.use(Vuetify);

const vuetify = new Vuetify({
  lang: {
    locales: { ru },
    current: 'ru',
  },
  icons: {
    iconfont: 'mdi',
  },
  theme: {
    dark: false,
    themes: {
      options: {
        customProperties: true,
      },
      light: {
        'main-color': '#7e57c2',
      },
    },
  },
});

Vue.use(TiptapVuetifyPlugin, {
  vuetify,
  iconsGroup: 'mdi',
});

export default vuetify;
