module.exports = {
  extends: [
    'stylelint-config-html/vue',
    'stylelint-config-recommended-scss',
    'stylelint-config-recommended-vue/scss',
    'stylelint-config-rational-order',
    'stylelint-prettier/recommended',
  ],
  plugins: ['stylelint-order', 'stylelint-scss'],
  files: ['./src/**/*.{vue,scss}'],
};
