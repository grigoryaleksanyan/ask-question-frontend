import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

const BrandPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#EEF1FE',
      100: '#D9DFFD',
      200: '#B3BFFB',
      300: '#8D9FF9',
      400: '#6B80F7',
      500: '#4F6AF6',
      600: '#3D56CC',
      700: '#2E42A3',
      800: '#1F2F79',
      900: '#101B50',
      950: '#080D28',
    },
  },
});

export default {
  preset: BrandPreset,
  options: {
    prefix: 'p',
    darkModeSelector: '.p-dark',
    cssLayer: false,
  },
};
