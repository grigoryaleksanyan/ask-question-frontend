import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vuetify()],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: fileURLToPath(new URL('./src', import.meta.url)),
      },
      { find: /^~(.*)$/, replacement: '$1' },
    ],
  },
  css: {
    preprocessorOptions: {
      scss: { additionalData: '@use "@/core/assets/styles/variables.scss";' },
    },
  },
  server: {
    port: 5000,

    proxy: { '/api': { target: 'http://localhost:5500', changeOrigin: true } },
  },
});
