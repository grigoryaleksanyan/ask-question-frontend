import { fileURLToPath, URL } from 'node:url';

import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: fileURLToPath(new URL('./src', import.meta.url)),
      },
    ],
  },
  css: {
    preprocessorOptions: {
      scss: { additionalData: '@use "@/app/styles/variables.scss";' },
    },
  },
  server: {
    port: 5000,
    proxy: { '/api': { target: 'http://localhost:5500', changeOrigin: true } },
  },
});
