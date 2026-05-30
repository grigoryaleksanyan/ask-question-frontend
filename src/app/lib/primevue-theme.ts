import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

const BrandPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#f0f4ff',
      100: '#dbe4ff',
      200: '#bac8ff',
      300: '#91a7ff',
      400: '#748ffc',
      500: '#5c7cfa',
      600: '#4c6ef5',
      700: '#4263eb',
      800: '#3b5bdb',
      900: '#364fc7',
      950: '#1e3a8a',
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
