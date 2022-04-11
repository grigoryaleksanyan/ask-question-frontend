const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: ['vuetify'],
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "@/core/assets/styles/variables.scss";`,
      },
    },
  },
});
