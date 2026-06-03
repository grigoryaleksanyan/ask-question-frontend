# AGENTS.md

## Команды

- `npm run dev` — dev-сервер на порту 5000, прокси `/api` → `http://localhost:5500`
- `npm run build` — сборка Vite
- `npm run lint` — последовательно: prettier → eslint → stylelint
- `npm run fsd:check` (или `npx steiger ./src`) — валидация FSD через steiger
- `npm run commit` — интерактивный коммит через better-commits (Conventional Commits)
- `npm run test` — Vitest (однократный запуск), `npm run test:watch` — watch-режим
- `npm run typecheck` — проверка типов через vue-tsc
- Тесты: `tests/` (вне `src/`), environment: jsdom, globals: true, setup: `tests/setup.ts` (сброс Pinia через `beforeEach`)

Node >= 22.17.0, npm >= 10.9.2

## Архитектура

Feature-Sliced Design (FSD) v2.1. Валидация через steiger — запускай `npm run fsd:check` после структурных изменений.

```
src/
  app/       — вход, роутер, стили, плагины, перехватчики http-client
    entrypoint/  — main.ts, App.vue
    router/      — маршруты, beforeEach-guard, auth-middleware
    layouts/     — DefaultLayout, EmptyLayout, AdminLayout
    lib/         — registerPlugins, primevue-theme, global-components, http-client-interceptors
    styles/      — base.scss (шрифты), variables.scss (SCSS-переменные), typography.scss
  pages/     — композиции для маршрутов (main, errors, faq, questions, admin/*)
  widgets/   — композитные виджеты: dashboard (графики, статистика)
  features/  — пользовательские действия: auth, feedback, preloader, manage-question
  entities/  — бизнес-модели: area, dashboard, faq, question, user
  shared/    — инфраструктура (api, assets, lib, routes, types, ui)
```

Импорты только сверху вниз: `app → pages → widgets → features → entities → shared`. Кросс-импорты между слайсами одного слоя запрещены. Каждый слайс имеет public API (`index.ts`) — импортируй только через него.

Хранилища — Pinia Composition Stores: `features/preloader/store`, `features/auth/store`. Экспортируются через public API каждого слайса.

## Стек

Vue 3.5 + PrimeVue 4 + PrimeFlex + PrimeIcons + @primevue/forms + Zod + Pinia 3 + Vue Router 5 + Axios + TypeScript. **Composition API** (`<script setup>`), без Options API. Хранилище — **Pinia** (Composition Stores), не Vuex. Vite 8. ESLint 10 (flat config через `typescript-eslint`, без `@eslint/eslintrc`), плагины: `typescript-eslint`, `eslint-plugin-unicorn`, `eslint-plugin-import-x`, `eslint-plugin-vue`. Резолверы алиасов: `eslint-import-resolver-vite`, `eslint-import-resolver-typescript`.

Дополнительные зависимости: chart.js, vue-chartjs, DOMPurify, vuedraggable.

## Стили

- SCSS, глобальные переменные автоинжектируются через Vite — не добавляй `@use "@/app/styles/variables.scss"` вручную в компоненты
- Имена классов — **BEM**: `block__element--modifier` (строго через kebab-case). Паттерн проверяется и ESLint, и Stylelint
- Порядок CSS-свойств — idiomatic-order (stylelint-config-idiomatic-order)

## Prettier

printWidth: 80, singleQuote: true, trailingComma: all, tabWidth: 2, semi: true, bracketSameLine: true, singleAttributePerLine: true, endOfLine: lf

## ESLint-правила (неочевидные)

- ESLint 10 flat config через `typescript-eslint`, без `@eslint/eslintrc`/FlatCompat
- Основные плагины: `typescript-eslint` (recommended), `unicorn` (recommended, часть правил отключена), `import-x` (замена `import`), `vue`
- Отключённые unicorn-правила: `prevent-abbreviations`, `no-null`, `no-array-reduce`, `prefer-top-level-await`, `switch-case-braces`, `prefer-global-this`, `no-negated-condition`, `filename-case`
- `import-x/no-unresolved: error` — проверка резолва импортов через vite-резолвер
- `import-x/no-extraneous-dependencies: error` — devDependencies доступны только из конфигов (`eslint.config.ts`, `vite.config.ts`, `vitest.config.ts`, `.commitlintrc.cjs`, `tests/**`), не из `src/`
- `no-throw-literal: error` — только `throw new Error()`, нельзя `throw "string"`
- `@typescript-eslint/no-shadow: [error, { allow: ['i', 'j', 'k', 'e', 'err', 'error', 'event', '_'] }]` (заменяет `no-shadow`, который отключён)
- `@typescript-eslint/consistent-type-imports: [error, { prefer: 'type-imports' }]` — используй `import type` для типов
- `@typescript-eslint/no-explicit-any: warn` — избегай `any`, предупреждение
- `@typescript-eslint/no-unused-vars: [error, { vars: 'all', args: 'after-used', ignoreRestSiblings: true }]` (заменяет `no-unused-vars`, который отключён)
- `@typescript-eslint/no-useless-constructor: error` (заменяет `no-useless-constructor`, который отключён)
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
- `vue/component-api-style: [error, [script-setup]]` — только `<script setup>`
- `vue/no-import-compiler-macros: error` — запрет импорта compiler macros
- `vue/html-comment-content-spacing: [error, always]`
- `vue/slot-name-casing: [error, kebab-case]`
- `vue/no-template-target-blank: error`
- `vue/match-component-import-name: error`
- `vue/match-component-file-name: [error, { extensions: [vue], shouldMatchCase: true }]`
- `vue/eqeqeq: error`
- `camelcase: [error, { properties: 'never' }]` — базовое JS-правило (properties: never)
- `vue/camelcase: [error, { properties: always }]` — Vue-специфичное правило (перекрывает базовое для Vue-контекста)
- `vue/custom-event-name-casing: [error, kebab-case]`
- `curly: [error, all]`, `no-console: warn`, `no-debugger: error`

## Коммиты

Conventional Commits: типы `build|ci|docs|feat|fix|perf|refactor|revert|style|test|chore`, scope в lowercase, заголовок ≤ 72 символов, без точки в конце. Конфиг better-commits: `.better-commits.jsonc`, commitlint: `.commitlintrc.cjs`. Pre-commit: lint-staged (автофикс: `prettier --write`, `eslint --fix`, `stylelint --fix`), commit-msg: commitlint. Breaking changes отключены.

## API-клиент

`@/shared/api` — axios-инстанс с `withCredentials: true`. Перехватчик 401 — мягкая навигация через `router.push({ name: 'login', query: { redirect: currentRoute } })` в `@/app/lib/http-client-interceptors.ts`, не в shared. Базовый URL из `import.meta.env.BASE_URL`.

## Роутинг

Макет страницы задаётся через `meta.layout` (default: `DefaultLayout`, также `EmptyLayout`, `AdminLayout`). Защищённые маршруты — `meta.isProtected`, проверяется в `router.beforeEach` через `auth-middleware.ts`. В навигационных хранниках можно использовать Pinia-хранилища напрямую (после `app.use(pinia)`).

Маршруты: `/` (main), `/login` (EmptyLayout), `/questions`, `/question/:id`, `/faq`, `/admin`, `/admin-questions`, `/admin-faq`, `/admin-faq/:id` (дочерний маршрут `/admin-faq`), `/admin-speakers`, `/admin-areas`, `/admin-feedback` (все admin — AdminLayout + isProtected), `/:catchAll(.*)` (404, EmptyLayout).

## Глобальные компоненты

Регистрируются в `@/app/lib/global-components.ts`: SidebarModal, SlideOver. Используй напрямую в шаблонах без импорта. CenterModal импортируется напрямую.

## PrimeVue Forms + Zod

PrimeVue подключается в `@/app/lib/primevue-theme.ts` (кастомный Aura-пресет). Валидация форм — через `@primevue/forms` + Zod (замена VeeValidate).

## Shared UI

- `sidebar-modal/` — SidebarModal (promise-based API: open/confirm/close через scoped slot props), SidebarPreloader (не экспортируется из public API)
- `center-modal/` — CenterModal
- `slide-over/` — SlideOver (глобальный компонент)
- `context-menu/` — ContextMenuButton
- `status-dot/` — StatusDot
- `toast/` — AppToast
- `rich-editor/` — RichEditor (**заглушка**, пустой div)
- AppLogo, HeaderNavigation, DrawerNavigation

## Steiger

Правило `fsd/insignificant-slice` **явно отключено** в `steiger.config.ts` — не считается ошибкой.

## Заглушки и неточности

- RichEditor (`shared/ui/rich-editor/`) — пустой div, не реализован
- DefaultLayout — кнопка обратной связи в footer страницы
