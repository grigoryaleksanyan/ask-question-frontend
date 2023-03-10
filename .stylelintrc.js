module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-html/vue',
    'stylelint-config-standard-scss',
    'stylelint-config-recommended-vue/scss',
    'stylelint-config-rational-order',
  ],
  plugins: ['stylelint-scss', 'stylelint-order'],
  files: ['./src/**/*.{vue,css,scss}'],
};
