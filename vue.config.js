const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "@/core/assets/styles/variables.scss";`,
      },
    },
  },
});
