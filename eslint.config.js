import js from '@eslint/js';
import globals from 'globals';
import pluginVue from 'eslint-plugin-vue';
import pluginUnicorn from 'eslint-plugin-unicorn';
import pluginImportX from 'eslint-plugin-import-x';
import eslintConfigPrettier from 'eslint-config-prettier';
import viteConfig from './vite.config.js';

export default [
  {
    ignores: ['**/dist/**', '**/node_modules/**', '**/build/**'],
  },

  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  pluginUnicorn.configs['flat/recommended'],

  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  {
    plugins: {
      'import-x': pluginImportX,
    },

    settings: {
      'import-x/resolver': {
        vite: {
          viteConfig,
        },
      },
    },
  },

  {
    rules: {
      // ---- unicorn: отключение конфликтующих/избыточных правил ----
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/no-null': 'off',
      'unicorn/no-array-reduce': 'off',
      'unicorn/prefer-top-level-await': 'off',
      'unicorn/switch-case-braces': 'off',
      'unicorn/prefer-global-this': 'off',
      'unicorn/no-negated-condition': 'off',
      'unicorn/filename-case': 'off',

      // ---- airbnb-base: best-practices ----
      'array-callback-return': ['error', { allowImplicit: true }],
      'block-scoped-var': 'error',
      'class-methods-use-this': ['error', { exceptMethods: [] }],
      'consistent-return': 'error',
      'default-case': ['error', { commentPattern: '^no default$' }],
      'default-case-last': 'error',
      'default-param-last': 'error',
      'dot-notation': ['error', { allowKeywords: true }],
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'grouped-accessor-pairs': 'error',
      'guard-for-in': 'error',
      'max-classes-per-file': ['error', 1],
      'no-alert': 'warn',
      'no-caller': 'error',
      'no-constructor-return': 'error',
      'no-else-return': ['error', { allowElseIf: false }],
      'no-empty-function': [
        'error',
        { allow: ['arrowFunctions', 'functions', 'methods'] },
      ],
      'no-eval': 'error',
      'no-extend-native': 'error',
      'no-extra-bind': 'error',
      'no-floating-decimal': 'error',
      'no-implied-eval': 'error',
      'no-iterator': 'error',
      'no-labels': ['error', { allowLoop: false, allowSwitch: false }],
      'no-lone-blocks': 'error',
      'no-loop-func': 'off',
      'no-multi-str': 'error',
      'no-new': 'error',
      'no-new-func': 'error',
      'no-new-wrappers': 'error',
      'no-proto': 'error',
      'no-restricted-properties': [
        'error',
        {
          object: 'arguments',
          property: 'callee',
          message: 'arguments.callee is deprecated',
        },
        {
          property: '__defineGetter__',
          message: 'Please use Object.defineProperty instead.',
        },
        {
          property: '__defineSetter__',
          message: 'Please use Object.defineProperty instead.',
        },
        {
          object: 'Math',
          property: 'pow',
          message: 'Use the exponentiation operator (**) instead.',
        },
      ],
      'no-return-assign': ['error', 'always'],
      'no-script-url': 'error',
      'no-sequences': 'error',
      'no-throw-literal': 'off',
      'no-unused-expressions': [
        'error',
        {
          allowShortCircuit: false,
          allowTernary: false,
          allowTaggedTemplates: false,
        },
      ],
      'no-useless-concat': 'error',
      'no-useless-return': 'error',
      'no-void': 'error',
      'no-with': 'error',
      'prefer-promise-reject-errors': ['error', { allowEmptyReject: true }],
      'prefer-regex-literals': ['error', { disallowRedundantWrapping: true }],
      radix: 'error',
      'wrap-iife': ['error', 'outside', { functionPrototypeMethods: false }],
      yoda: 'error',

      // ---- airbnb-base: variables ----
      'no-shadow': 'error',
      'no-undef-init': 'error',
      'no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: true,
        },
      ],
      'no-use-before-define': [
        'error',
        { functions: false, classes: false, variables: true },
      ],

      // ---- airbnb-base: es6 ----
      'arrow-body-style': [
        'error',
        'as-needed',
        { requireReturnForObjectLiteral: false },
      ],
      'arrow-parens': ['error', 'always'],
      'no-confusing-arrow': ['error', { allowParens: true }],
      'no-duplicate-imports': 'off',
      'no-restricted-exports': ['error', { restrictedNamedExports: ['then'] }],
      'no-useless-computed-key': 'error',
      'no-useless-constructor': 'error',
      'no-useless-rename': [
        'error',
        {
          ignoreDestructuring: false,
          ignoreImport: false,
          ignoreExport: false,
        },
      ],
      'object-shorthand': [
        'error',
        'always',
        { ignoreConstructors: false, avoidQuotes: true },
      ],
      'prefer-arrow-callback': [
        'error',
        {
          allowNamedFunctions: false,
          allowUnboundThis: true,
        },
      ],
      'prefer-const': [
        'error',
        { destructuring: 'any', ignoreReadBeforeAssign: true },
      ],
      'prefer-destructuring': [
        'error',
        {
          VariableDeclarator: { array: false, object: true },
          AssignmentExpression: { array: true, object: false },
        },
        { enforceForRenamedProperties: false },
      ],
      'prefer-numeric-literals': 'error',
      'prefer-rest-params': 'error',
      'prefer-spread': 'error',
      'prefer-template': 'error',
      'symbol-description': 'error',
      'template-curly-spacing': 'error',

      // ---- airbnb-base: style (не-форматирование) ----
      camelcase: ['error', { properties: 'never' }],
      'new-cap': [
        'error',
        {
          newIsCap: true,
          capIsNew: false,
        },
      ],
      'no-bitwise': 'error',
      'no-continue': 'error',
      'no-lonely-if': 'off',
      'no-multi-assign': 'error',
      'no-nested-ternary': 'off',
      'no-new-object': 'error',
      'no-plusplus': 'off',
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ForInStatement',
          message:
            'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
        },
        {
          selector: 'LabeledStatement',
          message:
            'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
        },
        {
          selector: 'WithStatement',
          message:
            '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
        },
      ],
      'no-underscore-dangle': [
        'error',
        {
          allow: [],
          allowAfterThis: false,
          allowAfterSuper: false,
          enforceInMethodNames: true,
        },
      ],
      'no-unneeded-ternary': ['error', { defaultAssignment: false }],
      'prefer-exponentiation-operator': 'error',
      'prefer-object-spread': 'error',

      // ---- airbnb-base: node ----
      'global-require': 'off',
      'no-buffer-constructor': 'error',
      'no-new-require': 'error',
      'no-path-concat': 'error',

      // ---- airbnb-base: strict ----
      strict: ['error', 'never'],

      // ---- import-x plugin ----
      'import-x/no-unresolved': 'off',
      'import-x/named': 'error',
      'import-x/export': 'error',
      'import-x/no-named-as-default': 'error',
      'import-x/no-named-as-default-member': 'error',
      'import-x/no-mutable-exports': 'error',
      'import-x/no-amd': 'error',
      'import-x/first': 'error',
      'import-x/no-duplicates': 'error',
      'import-x/extensions': [
        'error',
        'ignorePackages',
        { js: 'never', mjs: 'never', jsx: 'never' },
      ],
      'import-x/newline-after-import': ['error', { count: 1 }],
      'import-x/prefer-default-export': 'off',
      'import-x/no-absolute-path': 'error',
      'import-x/no-dynamic-require': 'error',
      'import-x/no-webpack-loader-syntax': 'error',
      'import-x/no-named-default': 'error',
      'import-x/no-self-import': 'error',
      'import-x/no-useless-path-segments': ['error', { commonjs: true }],
      'import-x/no-relative-packages': 'error',
      'import-x/no-extraneous-dependencies': [
        'error',
        { devDependencies: true },
      ],

      // ---- проектные переопределения ----
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
      'no-return-await': 'off',

      // ---- Vue правила ----
      'vue/camelcase': ['error', { properties: 'always' }],
      'vue/require-name-property': 'error',
      'vue/component-options-name-casing': ['error', 'PascalCase'],
      'vue/match-component-import-name': 'error',
      'vue/component-name-in-template-casing': [
        'error',
        'PascalCase',
        { registeredComponentsOnly: true },
      ],
      'vue/match-component-file-name': [
        'error',
        { extensions: ['vue'], shouldMatchCase: true },
      ],
      'vue/padding-lines-in-component-definition': ['error', 'always'],
      'vue/padding-line-between-blocks': ['error', 'always'],
      'vue/no-empty-component-block': 'error',
      'vue/block-order': ['error', { order: ['template', 'script', 'style'] }],
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
          groups: ['props', 'setup'],
        },
      ],
      'vue/no-unused-emit-declarations': 'error',
      'vue/no-unused-refs': 'error',
      'vue/define-props-destructuring': ['error', { destructure: 'always' }],
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
        { exceptions: [] },
      ],
      'vue/no-import-compiler-macros': 'error',
      'vue/no-ref-object-reactivity-loss': 'error',
      'vue/no-multiple-objects-in-class': 'error',
      'vue/no-root-v-if': 'error',
      'vue/no-template-target-blank': 'error',
      'vue/component-api-style': ['error', ['script-setup']],
      'vue/prefer-define-options': 'error',
      'vue/prefer-use-template-ref': 'error',
      'vue/slot-name-casing': ['error', 'kebab-case'],
    },
  },

  eslintConfigPrettier,
];
