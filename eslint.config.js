import path from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import globals from 'globals';
import pluginVue from 'eslint-plugin-vue';
import eslintConfigPrettier from 'eslint-config-prettier';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const compat = new FlatCompat({
  baseDirectory: dirname,
});

export default [
  {
    ignores: ['**/dist/**', '**/node_modules/**', '**/build/**'],
  },

  // Подключение готовых наборов правил
  js.configs.recommended,
  ...compat.extends('eslint-config-airbnb-base'),
  ...pluginVue.configs['flat/recommended'],

  // Установка глобальных конфигураций для проекта
  // Обязательно идет после добавления готовых наборов правил
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },

    settings: {
      'import/resolver': {
        alias: {
          map: [['@', './src']],
        },
      },
    },
  },

  // Настроенные вручную и переопределенные правила
  {
    rules: {
      ...eslintConfigPrettier.rules,
      // Правила для JS
      'no-console': 'warn',
      'no-debugger': 'error',
      curly: ['error', 'all'],
      'max-depth': ['warn', 3],
      complexity: ['warn', 7],
      'max-lines-per-function': [
        'warn',
        {
          max: 60,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
      'no-param-reassign': [
        'warn',
        {
          props: true,
          ignorePropertyModificationsFor: ['state'],
        },
      ],
      'lines-between-class-members': 'off',
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: true,
        },
      ],
      'no-use-before-define': [
        'error',
        {
          functions: false,
          classes: false,
          variables: true,
        },
      ],
      // Правила для Vue
      'vue/camelcase': [
        'error',
        {
          properties: 'always',
        },
      ],
      'vue/require-name-property': 'error',
      'vue/component-options-name-casing': ['error', 'PascalCase'],
      'vue/match-component-import-name': 'error',
      'vue/component-name-in-template-casing': [
        'error',
        'PascalCase',
        {
          registeredComponentsOnly: true,
        },
      ],
      'vue/match-component-file-name': [
        'error',
        {
          extensions: ['vue'],
          shouldMatchCase: true,
        },
      ],
      'vue/padding-lines-in-component-definition': ['error', 'always'],
      'vue/padding-line-between-blocks': ['error', 'always'],
      'vue/no-empty-component-block': 'error',
      'vue/block-order': [
        'error',
        {
          order: ['template', 'script', 'style'],
        },
      ],
      'vue/prefer-true-attribute-shorthand': ['error', 'always'],
      'vue/custom-event-name-casing': ['error', 'kebab-case'],
      'vue/prefer-separate-static-class': 'error',
      'vue/no-restricted-class': [
        'error',
        '/^(?![a-z]([a-z0-9-]+)?(__([a-z0-9]+-?)+)?(--([a-z0-9]+-?)+){0,2}$)/',
      ],
      'vue/no-unused-properties': [
        'error',
        {
          groups: ['props', 'data', 'computed', 'methods', 'setup'],
          deepData: true,
        },
      ],
      'vue/no-unused-emit-declarations': 'error',
      'vue/no-unused-refs': 'error',
      'vue/define-props-destructuring': [
        'error',
        {
          destructure: 'always',
        },
      ],
      'vue/eqeqeq': 'error',
      'vue/define-macros-order': [
        'error',
        {
          order: [
            'defineOptions',
            'defineModel',
            'defineProps',
            'defineEmits',
            'defineSlots',
          ],
          defineExposeLast: true,
        },
      ],
      'vue/html-comment-content-spacing': [
        'error',
        'always',
        {
          exceptions: [],
        },
      ],
      'vue/no-import-compiler-macros': 'error',
      'vue/no-ref-object-reactivity-loss': 'error',
      'vue/no-multiple-objects-in-class': 'error',
      'vue/no-root-v-if': 'error',
      'vue/no-template-target-blank': 'error',
      'vue/no-this-in-before-route-enter': 'error',
      'vue/prefer-define-options': 'error',
      'vue/prefer-use-template-ref': 'error',
      'vue/slot-name-casing': ['error', 'kebab-case'],
    },
  },
];
