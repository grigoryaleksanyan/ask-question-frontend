import { createPinia, setActivePinia } from 'pinia';

import { loadings } from '@/shared/lib/preloader-state';

beforeEach(() => {
  setActivePinia(createPinia());
  loadings.value = 0;
});
