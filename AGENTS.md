# AGENTS.md

## Команды

- `npm run dev` — dev-сервер на порту 5000, прокси `/api` → `http://localhost:5500`
- `npm run lint` — последовательно: prettier → eslint → stylelint
- `npx steiger ./src` — валидация FSD через steiger
- `npm run commit` — интерактивный коммит через commitizen (Conventional Commits)
- Тестов нет, тест-раннер не настроен

## Архитектура

Feature-Sliced Design (FSD) v2.1. Валидация через steiger — запускай `npx steiger ./src` после структурных изменений.

```
src/
  app/       — вход, роутер, хранилище, стили, плагины, перехватчики http-client
  pages/     — композиции для маршрутов (main, errors, faq, questions, admin/*)
  features/  — пользовательские действия: auth, feedback, preloader
  entities/  — бизнес-модели: alert, faq, question, user, area
  shared/    — инфраструктура (api, config, lib, routes, ui, assets)
```

Импорты только сверху вниз: `app → pages → features → entities → shared`. Кросс-импорты между слайсами одного слоя запрещены. Каждый слайс имеет public API (`index.js`) — импортируй только через него.

## Стек

Vue 3 + Vuetify 3 + Vuex 4 + Vue Router 4 + VeeValidate + Axios. **Options API**, без Composition API и `<script setup>`. Без TypeScript. Хранилище — **Vuex**, не Pinia.

## Стили

- SCSS, глобальные переменные автоинжектируются через Vite — не добавляй `@use "@/app/styles/variables.scss"` вручную в компоненты
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

`@/shared/api` — axios-инстанс с `withCredentials: true`. Перехватчик 401 (редирект на `/login`) подключается в `@/app/lib/http-client-interceptors.js`, не в shared. Базовый URL из `import.meta.env.BASE_URL`.

## Роутинг

Макет страницы задаётся через `meta.layout` (например `'EmptyLayout'`, `'AdminLayout'`). Защищённые маршруты — `meta.isProtected`, проверяется в `router.beforeEach`.

## Известные проблемы steiger

`insignificant-slice` на entities и features — ложные срабатывания: steiger не видит Vuex-мутации (`store.commit('alert/ADD_ALERT')`) и динамические `import()` в роутере.
