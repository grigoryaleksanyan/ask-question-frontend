# AGENTS.md

## Команды

- `npm run dev` — dev-сервер на порту 5000, прокси `/api` → `http://localhost:5500`
- `npm run build` — сборка Vite
- `npm run lint` — последовательно: prettier → eslint → stylelint
- `npm run fsd:check` (или `npx steiger ./src`) — валидация FSD через steiger
- `npm run commit` — интерактивный коммит через better-commits (Conventional Commits)
- Тестов нет, тест-раннер не настроен

Node >= 22.17.0, npm >= 10.9.2

## Архитектура

Feature-Sliced Design (FSD) v2.1. Валидация через steiger — запускай `npm run fsd:check` после структурных изменений.

```
src/
  app/       — вход, роутер, стили, плагины, перехватчики http-client
    entrypoint/  — main.js, App.vue
    router/      — маршруты, beforeEach-guard, auth-middleware
    layouts/     — DefaultLayout, EmptyLayout, AdminLayout
    lib/         — registerPlugins, vuetify, vee-validate, global-components, http-client-interceptors
    styles/      — base.scss (шрифты), variables.scss (SCSS-переменные)
  pages/     — композиции для маршрутов (main, errors, faq, questions, admin/*)
  features/  — пользовательские действия: auth, feedback, preloader
  entities/  — бизнес-модели: alert, faq, question, user, area
  shared/    — инфраструктура (api, config, lib, routes, ui, assets)
```

Импорты только сверху вниз: `app → pages → features → entities → shared`. Кросс-импорты между слайсами одного слоя запрещены. Каждый слайс имеет public API (`index.js`) — импортируй только через него.

Хранилища — Pinia Composition Stores: `features/preloader/store`, `entities/alert/store`, `features/auth/store`. Экспортируются через public API каждого слайса.

## Стек

Vue 3.5 + Vuetify 4 + Pinia 3 + Vue Router 5 + VeeValidate 4 + Axios. **Composition API** (`<script setup>`), без Options API. Без TypeScript. Хранилище — **Pinia** (Composition Stores), не Vuex. Vite 8. ESLint 10 (flat config, без `@eslint/eslintrc`), плагины: `eslint-plugin-unicorn`, `eslint-plugin-import-x`, `eslint-plugin-vue`, `eslint-plugin-vuetify`. Резолвер алиасов: `eslint-import-resolver-vite`.

## Стили

- SCSS, глобальные переменные автоинжектируются через Vite — не добавляй `@use "@/app/styles/variables.scss"` вручную в компоненты
- Имена классов — **BEM**: `block__element--modifier` (строго через kebab-case). Паттерн проверяется и ESLint, и Stylelint
- Порядок CSS-свойств — idiomatic-order (stylelint-config-idiomatic-order)

## Prettier

printWidth: 80, singleQuote: true, trailingComma: all, tabWidth: 2, semi: true, bracketSameLine: true, singleAttributePerLine: true, endOfLine: lf

## ESLint-правила (неочевидные)

- ESLint 10 flat config, без `@eslint/eslintrc`/FlatCompat
- Основные плагины: `unicorn` (recommended, часть правил отключена), `import-x` (замена `import`), `vue`, `vuetify` (`flat/recommended-v4`)
- Отключённые unicorn-правила: `prevent-abbreviations`, `no-null`, `no-array-reduce`, `prefer-top-level-await`, `switch-case-braces`, `prefer-global-this`, `no-negated-condition`, `filename-case`
- `import-x/no-unresolved: error` — проверка резолва импортов через vite-резолвер. Исключения: vuetify subpath-exports (`vuetify/styles`, `vuetify/locale`) — inline disable
- `import-x/no-extraneous-dependencies: error` — devDependencies доступны только из конфигов (`eslint.config.js`, `vite.config.js`, `.commitlintrc.cjs`), не из `src/`
- `no-throw-literal: error` — только `throw new Error()`, нельзя `throw "string"`
- `no-shadow: [error, { allow: ['i', 'j', 'k', 'e', 'err', 'error', 'event', '_'] }]`
- Отключённые airbnb-правила: `class-methods-use-this`, `guard-for-in` (дублирует `no-restricted-syntax`), `consistent-return`
- `max-lines-per-function: [warn, 60]` (skipBlankLines + skipComments)
- `max-depth: [warn, 3]`, `complexity: [warn, 7]`
- `no-param-reassign: [warn, { props: true, ignorePropertyModificationsFor: ['state'] }]` — мутировать `state` в Pinia stores можно
- Порядок блоков в SFC: `<template>` → `<script>` → `<style>` (`vue/block-order`)
- Имена компонентов — PascalCase, кастомные события — kebab-case
- `vue/require-name-property` — требует `defineOptions({ name: 'ComponentName' })` в `<script setup>`
- `vue/prefer-use-template-ref` — используй `useTemplateRef()` вместо `ref()` для template refs
- `vue/no-empty-component-block` — пустые `<script>` или `<style>` блоки запрещены
- `vue/padding-line-between-blocks` — пустая строка между блоками SFC
- `vue/padding-lines-in-component-definition` — пустые строки между секциями defineOptions/defineProps/defineEmits
- `vue/define-macros-order` — порядок: defineOptions → defineModel → defineProps → defineEmits → defineSlots, defineExpose последним
- `vue/define-props-destructuring` — всегда деструктурировать props
- `vue/no-unused-refs`, `vue/no-unused-properties`, `vue/no-unused-emit-declarations` — ошибка при неиспользуемых
- `vue/no-ref-object-reactivity-loss` — ошибка при потере реактивности ref
- `vue/no-restricted-class` — только BEM-классы (regex)
- `vue/prefer-define-options` — использовать defineOptions вместо name в options
- `vue/prefer-true-attribute-shorthand: always`
- `vue/prefer-separate-static-class` — статический класс отдельно от динамического
- `vue/no-multiple-objects-in-class` — один объект в :class
- `vue/no-root-v-if` — нельзя v-if на корневом элементе
- `curly: [error, all]`, `no-console: warn`, `no-debugger: error`

## Коммиты

Conventional Commits: типы `build|ci|docs|feat|fix|perf|refactor|revert|style|test|chore`, scope в lowercase, заголовок ≤ 72 символов, без точки в конце. Конфиг better-commits: `.better-commits.jsonc`, commitlint: `.commitlintrc.cjs`. Pre-commit: lint-staged (автофикс: `prettier --write`, `eslint --fix`, `stylelint --fix`), commit-msg: commitlint. Breaking changes отключены.

## API-клиент

`@/shared/api` — axios-инстанс с `withCredentials: true`. Перехватчик 401 (hard redirect через `window.location.href = '/login'`) подключается в `@/app/lib/http-client-interceptors.js`, не в shared. Базовый URL из `import.meta.env.BASE_URL`.

## Роутинг

Макет страницы задаётся через `meta.layout` (default: `DefaultLayout`, также `EmptyLayout`, `AdminLayout`). Защищённые маршруты — `meta.isProtected`, проверяется в `router.beforeEach` через `auth-middleware.js`. В навигационных хранниках можно использовать Pinia-хранилища напрямую (после `app.use(pinia)`).

Маршруты: `/` (main), `/login` (EmptyLayout), `/questions`, `/question/:id`, `/faq`, `/admin`, `/admin-questions`, `/admin-faq`, `/admin-faq/:id`, `/admin-speakers`, `/admin-areas`, `/admin-feedback` (все admin — AdminLayout + isProtected), `/:catchAll(.*)` (404, EmptyLayout).

## Глобальные компоненты

Регистрируются в `@/app/lib/global-components.js`: SidebarModal, SidebarContentWrapper, CenterModal, CenterModalContentWrapper. Используй их напрямую в шаблонах без импорта.

## VeeValidate

Плагин подключается в `@/app/lib/vee-validate.js`. Зарегистрированы правила: required, email, confirmed, max_value, required-date. Компоненты: VeeForm, VeeField, VeeErrorMessage.

## Shared UI

- `sidebar-modal/` — SidebarModal (promise-based API: open/confirm/close, provide('close')), SidebarContentWrapper (slots: header/default/footer)
- `center-modal/` — CenterModal (v-dialog), CenterModalContentWrapper (slots: default/actions)
- `rich-editor/` — RichEditor (**заглушка**, пустой div)
- AppLogo, HeaderNavigation, DrawerNavigation

## Известные проблемы steiger

`insignificant-slice` на entities и features — ложные срабатывания: steiger не видит Pinia-хранилища и динамические `import()` в роутере.

## Заглушки и неточности

- RichEditor (`shared/ui/rich-editor/`) — пустой div, не реализован
- AdminMainPage, AdminSpeakersPage — заглушки без функционала
- QuestionIdView — хардкод данных, не использует реальный API
- QuestionFilters — хардкод фильтров (speaker, zone)
- `GetCapctha` — опечатка в имени функции и URL (должно быть `GetCaptcha`)
- SidebarFeedbackContent содержит debug-кнопку для тестирования прелоадера
