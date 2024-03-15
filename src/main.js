import { createApp } from 'vue';
import registerPlugins from '@/core/plugins';
import registerGlobalComponents from '@/core/plugins/global-components';

import App from './App.vue';
import httpClient from './core/plugins/http-client';

import '@/core/assets/styles/index.scss';

const app = createApp(App);

registerPlugins(app);
registerGlobalComponents(app);

app.config.globalProperties.$httpClient = httpClient;

app.mount('#app');
