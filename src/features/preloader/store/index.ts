import { defineStore } from 'pinia';

import {
  loadings,
  showPreloader,
  addLoader,
  removeLoader,
} from '@/shared/lib/preloader-state';

export const usePreloaderStore = defineStore('preloader', () => ({
  loadings,
  showPreloader,
  addLoader,
  removeLoader,
}));
