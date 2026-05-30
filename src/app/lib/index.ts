import type { App } from 'vue';

import router from '@/app/router';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';

import theme from './primevue-theme';
import setupHttpClientInterceptors from './http-client-interceptors';

export default function registerPlugins(app: App) {
  const pinia = createPinia();

  app.use(router).use(pinia).use(PrimeVue, { theme });

  setupHttpClientInterceptors();
}
