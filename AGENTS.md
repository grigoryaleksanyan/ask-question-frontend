# AGENTS.md

## Команды

- `npm run dev` — dev-сервер на порту 5000, прокси `/api` → `http://localhost:5500`
- `npm run build` — сборка Vite
- `npm run lint` — последовательно: prettier → eslint → stylelint
- `npm run fsd:check` (или `npx steiger ./src`) — валидация FSD через steiger
- `npm run commit` — интерактивный коммит через better-commits (Conventional Commits)
- `npm run test` — Vitest (однократный запуск), `npm run test:watch` — watch-режим
- `npm run typecheck` — проверка типов через vue-tsc
- `npm run preview` — Vite preview
- `npm run prettier:check` — проверка форматирования Prettier
- `npm run eslint:check` — проверка ESLint без автофикса
- `npm run stylelint:check` — проверка Stylelint без автофикса
- Тесты: `tests/` (вне `src/`), environment: jsdom, globals: true, setup: `tests/setup.ts` (сброс Pinia через `beforeEach`), css: false

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
     styles/      — base.scss (шрифты), variables.scss (SCSS-переменные), typography.scss, modal-form.scss
  pages/     — композиции для маршрутов (main, errors, faq, questions, question-detail, admin/*)
  widgets/   — композитные виджеты: dashboard (графики, статистика)
  features/  — пользовательские действия: auth, feedback, preloader, manage-question
  entities/  — бизнес-модели: area, dashboard, faq, question, user
  shared/    — инфраструктура (api, assets, dto, lib, routes, ui)
```

Импорты только сверху вниз: `app → pages → widgets → features → entities → shared`. Кросс-импорты между слайсами одного слоя запрещены. Каждый слайс имеет public API (`index.ts`) — импортируй только через него.

Хранилища — Pinia Composition Stores: `features/preloader/store`, `features/auth/store`. Экспортируются через public API каждого слайса.

## Стек

Vue 3.5 + PrimeVue 4 + PrimeFlex + PrimeIcons + @primevue/forms + @primeuix/themes + Zod + Pinia 3 + Vue Router 5 + Axios + TypeScript. **Composition API** (`<script setup>`), без Options API. Хранилище — **Pinia** (Composition Stores), не Vuex. Vite 8. ESLint 10 (flat config через `typescript-eslint`, без `@eslint/eslintrc`), плагины: `typescript-eslint`, `eslint-plugin-unicorn`, `eslint-plugin-import-x`, `eslint-plugin-vue`. Резолверы алиасов: `eslint-import-resolver-vite`, `eslint-import-resolver-typescript`.

Дополнительные зависимости: chart.js, vue-chartjs, DOMPurify, vuedraggable, docx, exceljs, file-saver.

При построении интерфейсов прежде чем писать свою реализацию, необходимо проверить, нет ли готовых компонентов в PrimeVue.

## Стили

- SCSS, глобальные переменные автоинжектируются через Vite — не добавляй `@use "@/app/styles/variables.scss"` вручную в компоненты
- Имена классов — **BEM**: `block__element--modifier` (строго через kebab-case). Паттерн проверяется и ESLint, и Stylelint
- Порядок CSS-свойств — idiomatic-order (stylelint-config-idiomatic-order). Extends: `stylelint-config-standard`, `stylelint-config-recommended-vue/scss`, `stylelint-config-idiomatic-order`. Плагины: `stylelint-order`, `stylelint-scss`. Правило `selector-class-pattern` с BEM-regex. Правило `import-notation: string` для SCSS-импортов

## Prettier

printWidth: 80, singleQuote: true, trailingComma: all, tabWidth: 2, semi: true, bracketSameLine: true, bracketSpacing: true, singleAttributePerLine: true, endOfLine: lf

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

Conventional Commits: типы `build|ci|docs|feat|fix|perf|refactor|revert|style|test|chore`, scope в lowercase (`general`, `client`, `server`, `none`), заголовок ≤ 72 символов, без точки в конце. Конфиг better-commits: `.better-commits.jsonc`, commitlint: `.commitlintrc.cjs`. Pre-commit: lint-staged (автофикс: `prettier --write`, `eslint --fix`, `stylelint --fix`), commit-msg: commitlint. Breaking changes отключены.

## API-клиент

`@/shared/api` — axios-инстанс с `withCredentials: true`. Перехватчик 401 — мягкая навигация через `router.push({ name: 'login', query: { redirect: currentRoute } })` в `@/app/lib/http-client-interceptors.ts`, не в shared. Базовый URL из `import.meta.env.BASE_URL`. Auth-middleware передаёт `redirect: to.fullPath` в query при редиректе на `/setup` и `/login`.

## Роутинг

Макет страницы задаётся через `meta.layout` (default: `DefaultLayout`, также `EmptyLayout`, `AdminLayout`). Защищённые маршруты — `meta.isProtected`, проверяется в `router.beforeEach` через `auth-middleware.ts`.

**Дополнительная логика beforeEach:**
1. Проверка `setupRequired` — если `null`, вызывается `authStore.checkSetupRequired()`
2. Если авторизован и идёт на `/login` — редирект на `/admin`
3. Если идёт на `/setup`, но setup не нужен — редирект на `/login`
4. Если идёт на `/login`, но setup нужен — редирект на `/setup`
5. Затем стандартная проверка `isProtected`

**auth-middleware.ts**: при ошибке проверки авторизации проверяет `setupRequired` и редиректит на `/setup` или `/login`.

Маршруты: `/` (main), `/login` (EmptyLayout), `/setup` (EmptyLayout), `/questions`, `/question/:id`, `/faq`, `/admin`, `/admin-questions`, `/admin-questions/:id` (AdminLayout, isProtected), `/admin-faq`, `/admin-faq/:id` name=`admin-faq-category` (AdminLayout, isProtected), `/admin-speakers`, `/admin-areas`, `/admin-feedback` (все admin — AdminLayout + isProtected), `/:catchAll(.*)` (404, EmptyLayout).

## Глобальные компоненты

Регистрируются в `@/app/lib/global-components.ts`: SlideOver. Используй напрямую в шаблонах без импорта. CenterModal импортируется напрямую.

## PrimeVue Forms + Zod

PrimeVue подключается в `@/app/lib/primevue-theme.ts` (кастомный Aura-пресет). Валидация форм — через `@primevue/forms` + Zod (замена VeeValidate).

## Shared UI

- `center-modal/` — CenterModal
- `slide-over/` — SlideOver (глобальный компонент, promise-based API: `confirm` и `close` через scoped slot props, `open` — через template ref / `defineExpose`; проп `closeOnClickAway: boolean`, default `true`)
- `context-menu/` — ContextMenuButton
- `status-dot/` — StatusDot
- `toast/` — AppToast
- `rich-editor/` — RichEditor (**заглушка**, пустой div)
- AppLogo, AppNavigation, DrawerNavigation

## Shared lib — composables и утилиты

| Composable/утилита | Путь | Описание |
|---|---|---|
| `useApiCall` | `shared/lib/use-api-call/` | Универсальный composable для API-вызовов: автоматически показывает/скрывает прелоадер, показывает toast при успехе/ошибке. Возвращает `execute`, `isLoading`, `error`, `data`. Опции: `successMessage`, `errorMapper`, `onSuccess`, `onError`, `showPreloader` (default: `true`). Экспортирует `TOAST_HANDLED` symbol для маркировки обработанных ошибок |
| `useDeleteConfirm` | `shared/lib/use-delete-confirm/` | Обёртка над `useApiCall` для подтверждения удаления. Возвращает `confirm(id: string): Promise<boolean>` |
| `useDeleteConfirmDialog` | `shared/lib/use-delete-confirm-dialog.ts` | Диалог подтверждения удаления через CenterModal |
| `useFormActions` | `shared/lib/use-form-actions/` | Утилиты для работы с формами (сброс, валидация, состояния) |
| `copyToClipboard` | `shared/lib/copy-to-clipboard.ts` | Копирование текста в буфер обмена через `navigator.clipboard` |
| `sanitizeHtml` | `shared/lib/html-sanitize.ts` | Санитизация HTML через DOMPurify с автоматическим `target="_blank"` + `rel="noopener noreferrer"` |
| `preloader-state` | `shared/lib/preloader-state/` | Реактивный счётчик загрузок: `showPreloader` (computed), `addLoader()`, `removeLoader()`. Используется `features/preloader/store` |
| `zod-schemas` | `shared/lib/zod-schemas/` | Примитивы и композиции Zod-схем для валидации форм (`primitives.ts`, `compositions.ts`) |

## Entities — config

- `entities/question/config/question-statuses.ts` — маппинг статусов (New/InFocus/Answered) с цветами и названиями: `QUESTION_STATUSES`, `questionStatusMap`, `getStatusColor()`, `getStatusLabel()`
- `entities/question/ui/` — QuestionCard, QuestionFilters, QuestionFormCreate, QuestionIdView, QuestionStatusIcon, QuestionsView, QuestionVote
- `entities/question/api/` — questions-repository.ts
- `entities/area/ui/` — AreaCard, CreateArea, UpdateArea
- `entities/area/api/` — areas-repository.ts
- `entities/faq/ui/` — CategoryCard, CreateCategory, CreateEntryContent, EntryCard, FAQView, UpdateCategory, UpdateEntryContent
- `entities/faq/api/` — faq-category-repository.ts, faq-entry-repository.ts
- `entities/user/ui/` — CreateSpeaker, SpeakerAvatar, SpeakerCard, UpdateSpeaker
- `entities/user/api/` — speakers-repository.ts, user-repository.ts
- `entities/dashboard/api/` — dashboard-repository.ts

## Features — компоненты

- `auth/` — аутентификация (store, LoginView, SetupView, UserProfile — форма смены пароля и данные пользователя; `api/auth-repository.ts` — Login, Logout, SetupRequired, Setup)
- `feedback/` — FeedbackCard, SidebarFeedbackContent; `api/feedback-repository.ts` — GetAll, Create, Delete
- `manage-question/` — QuestionBulkActions, QuestionCommentButton, QuestionExportButton, QuestionStatusDropdown; `lib/export-docx.ts`, `lib/export-xlsx.ts` (экспорт вопросов в DOCX/XLSX)
- `preloader/` — прелоадер (store, AppPreloader UI-компонент)

## Auth store — расширения

`features/auth/store` (`useAuthStore`) дополнительно содержит:
- `setupRequired: ref<boolean | null>(null)` — флаг первичной настройки
- `getSetupRequired` computed
- `checkSetupRequired()` — запрос `GET /api/Auth/SetupRequired`
- `setAuthData()` устанавливает `setupRequired = false`

## Shared dto — типы и DTO

Каталог `shared/dto/` (ранее `shared/types/`):

- `models.ts` — энумы (`UserRoleId`, `QuestionStatusId`), интерфейсы (`QuestionStatus`, `NavItem`, `ModalResult`, `DateRangeValue`)
- `api-requests.ts` — типы запросов: `LoginRequest`, `ChangePasswordRequest`, `SetupRequest`, `QuestionCreateRequest`, `QuestionUpdateRequest`, `FaqCategoryCreateRequest`, `FaqCategoryUpdateRequest`, `FaqEntryCreateRequest`, `FaqEntryUpdateRequest`, `AreaCreateRequest`, `AreaUpdateRequest`, `FeedbackCreateRequest`, `SpeakerCreateRequest`, `SpeakerUpdateRequest`, `QuestionStatusChangeRequest`, `QuestionCommentRequest`
- `api-responses.ts` — типы ответов: `SetupRequiredResponse`, `UserDetailsResponse`, `UserResponse`, `VoteResultResponse`, `VoteType`, `QuestionResponse`, `FaqCategoryResponse`, `FaqCategoryWithEntriesResponse`, `FaqEntryResponse`, `AreaResponse`, `FeedbackResponse`, `PaginatedResponse<T>`, `SpeakerPublicResponse`, `SpeakerResponse`, `CreateSpeakerResponse`, `DashboardSummaryResponse`, `StatusDistributionResponse`, `TimelinePointResponse`, `AreaDistributionResponse`, `SpeakerProductivityResponse`, `SpeakerAreaResponse`, `VotesSummaryResponse`

## Steiger

Правило `fsd/insignificant-slice` **явно отключено** в `steiger.config.ts` — не считается ошибкой.

## Widgets — dashboard

9 компонентов: AreaBarChart, DashboardFilters, DashboardWidget, SpeakerAreasChart, SpeakerProductivityChart, StatCardsRow, StatusDoughnutChart, TimelineLineChart, VotesSummary.

## Shared routes

`shared/routes/routes.ts` — именованные константы маршрутов: `main`, `notFound`, `adminQuestionDetail`.

## Shared assets

`shared/assets/` — fonts/, img/, logo.svg, index.ts.

## Заглушки и неточности

- RichEditor (`shared/ui/rich-editor/`) — пустой div, не реализован
- DefaultLayout — кнопка обратной связи в footer страницы
