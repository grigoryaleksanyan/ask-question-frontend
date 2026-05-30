import { createApp } from 'vue';
import registerPlugins from '@/app/lib';
import registerGlobalComponents from '@/app/lib/global-components';

import App from './App.vue';

import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '@/app/styles/base.scss';

const app = createApp(App);

registerPlugins(app);
registerGlobalComponents(app);

app.mount('#app');
