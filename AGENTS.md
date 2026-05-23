# AGENTS.md

## Команды

- `npm run dev` — dev-сервер на порту 5000, прокси `/api` → `http://localhost:5500`
- `npm run lint` — последовательно: prettier → eslint → stylelint
- `npm run fsd:check` — валидация Feature-Sliced Design через steiger
- `npm run commit` — интерактивный коммит через commitizen (Conventional Commits)
- Тестов нет, тест-раннер не настроен

## Архитектура

Feature-Sliced Design (FSD). Валидация через steiger — запускай `npm run fsd:check` после структурных изменений.

```
src/
  app/       — вход, роутер, хранилище, стили, плагины
  modules/   — бизнес-модули (auth, question, faq, admin, …)
  pages/     — композиции для маршрутов
  shared/    — переиспользуемый код (api, ui, routes, assets)
```

## Стек

Vue 3 + Vuetify 3 + Vuex 4 + Vue Router 4 + VeeValidate + Axios. **Options API**, без Composition API и `<script setup>`. Без TypeScript. Хранилище — **Vuex**, не Pinia.

## Стили

- SCSS, глобальные переменные автоинжектируются: `@use "@/app/styles/variables.scss"` — не добавляй `@use` вручную в компоненты
- Имена классов — **BEM**: `block__element--modifier` (строго через kebab-case). Паттерн проверяется и ESLint, и Stylelint
- Порядок CSS-свойств — idiomatic-order (stylelint-config-idiomatic-order)

## ESLint-правила (неочевидные)

- Максимум 40 строк на функцию (`max-lines-per-function`)
- Порядок блоков в SFC: `<template>` → `<script>` → `<style>`
- Имена компонентов — PascalCase, кастомные события — kebab-case
- `vue/padding-lines-in-component-definition` — пустые строки между секциями опций
- `vue/padding-line-between-blocks` — пустая строка между блоками SFC
- `vue/no-empty-component-block` — пустые блоки запрещены
- `no-param-reassign` — warn, но `state` в Vuex-мутациях разрешён

## Коммиты

Conventional Commits: типы `build|ci|docs|feat|fix|perf|refactor|revert|style|test`, scope в lowercase, заголовок ≤ 72 символов, без точки в конце. Pre-commit: lint-staged.

## API-клиент

`@/shared/api/http-client.js` — axios с `withCredentials: true`. При 401 — редирект на `/login`. Базовый URL из `import.meta.env.BASE_URL`.

## Роутинг

Макет страницы задаётся через `meta.layout` (например `'EmptyLayout'`). Защищённые маршруты — `meta.isProtected`, проверяется в `router.beforeEach`.
