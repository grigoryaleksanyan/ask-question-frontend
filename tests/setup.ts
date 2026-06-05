import { createPinia, setActivePinia } from 'pinia';
import PrimeVue from 'primevue/config';
import { config } from '@vue/test-utils';

import { loadings } from '@/shared/lib/preloader-state';

config.global.plugins = [
  [PrimeVue, { theme: { preset: {} }, options: { prefix: 'p' } }],
];

beforeEach(() => {
  setActivePinia(createPinia());
  loadings.value = 0;
});
