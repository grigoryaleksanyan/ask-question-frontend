import { defineStore } from 'pinia';

import {
  showPreloader,
  addLoader,
  removeLoader,
} from '@/shared/lib/preloader-state';

export const usePreloaderStore = defineStore('preloader', () => ({
  showPreloader,
  addLoader,
  removeLoader,
}));
