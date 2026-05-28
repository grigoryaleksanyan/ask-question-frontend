# Миграция Options API → Composition API (`<<script setup>`)

## Цель

Перевести все 26 компонентов на Options API на Composition API с `<script setup>`, устранив при этом паттерны, несовместимые с ESLint-правилами проекта или являющиеся антипаттернами Composition API.

## Подход

**Перевод + минорные улучшения** (подход B): каждый Options API паттерн заменяется Composition API эквивалентом, а также исправляются проблемные паттерны:

- `$emit` в шаблоне → `emit()` из `defineEmits()`
- `this.$refs` → `useTemplateRef()`
- `this.$slots` → `useSlots()`
- Гибрид `setup()` + Options API → чистый `<script setup>`
- `components: { Foo }` → авторезолв через импорт

Не включается: разбиение компонентов, извлечение composables, исправление хардкода данных, реструктуризация.

## Общие правила миграции

| Options API | Composition API | Примечание |
|---|---|---|
| `export default { name: 'X' }` | `defineOptions({ name: 'X' })` | ESLint `vue/prefer-define-options` |
| `components: { Foo }` | `import Foo from '...'` | Авторезолв в `<script setup>` |
| `props: { ... }` | `defineProps({ ... })` + деструктуризация | ESLint `vue/define-props-destructuring` |
| `emits: ['...']` | `defineEmits(['...'])` | |
| `this.$emit('x')` | `emit('x')` | emit из `defineEmits()` |
| `$emit('x')` в шаблоне | `emit('x')` | Убрать $ из шаблона |
| `data() { return { x } }` | `const x = ref(...)` | |
| `computed: { x() {} }` | `const x = computed(() => ...)` | |
| `methods: { fn() {} }` | `const fn = () => { ... }` | Стрелочные функции |
| `this.$refs.name` | `const name = useTemplateRef('name')` | ESLint `vue/prefer-use-template-ref` |
| `this.$route` | `const route = useRoute()` | Из `vue-router` |
| `this.$router` | `const router = useRouter()` | Из `vue-router` |
| `this.$slots.xxx` | `const slots = useSlots()` | Из `vue` |
| `inject: ['close']` | `const close = inject('close')` | Из `vue` |
| `created()` | код на верхнем уровне `<script setup>` | Без хука |
| `mounted()` | `onMounted(() => ...)` | Из `vue` |

Порядок SFC: `<script>` → `<template>` → `<style>` (ESLint `vue/block-order`).

Порядок макросов: `defineOptions` → `defineModel` → `defineProps` → `defineEmits` → `defineSlots`, `defineExpose` последним (ESLint `vue/define-macros-order`).

Пустые строки между секциями макросов (ESLint `vue/padding-lines-in-component-definition`).

Пустая строка между блоками SFC (ESLint `vue/padding-line-between-blocks`).

## Порядок миграции: от простых к сложным

### Уровень 1: Тривиальные (6 компонентов)

Только `export default { name }` → `<script setup>` + `defineOptions({ name })`. Перестановка блоков SFC.

| # | Компонент | Файл |
|---|---|---|
| 1 | EmptyLayout | `src/app/layouts/EmptyLayout.vue` |
| 2 | CenterModalContentWrapper | `src/shared/ui/center-modal/CenterModalContentWrapper.vue` |
| 3 | AdminMainPage | `src/pages/admin/main/ui/AdminMainPage.vue` |
| 4 | SidebarPreloader | `src/shared/ui/sidebar-modal/SidebarPreloader.vue` |
| 5 | RichEditor | `src/shared/ui/rich-editor/RichEditor.vue` |
| 6 | AdminSpeakersPage | `src/pages/admin/speakers/ui/AdminSpeakersPage.vue` |

### Уровень 2: Простые (10 компонентов)

Добавляется: `defineProps`, `defineEmits`, замена `$emit` → `emit()`, `this.$router` → `useRouter()`, `data()` → `ref()`.

| # | Компонент | Файл | Паттерны |
|---|---|---|---|
| 7 | AppLogo | `src/shared/ui/AppLogo.vue` | `data()` → `ref()` |
| 8 | HeaderNavigation | `src/shared/ui/HeaderNavigation.vue` | `props` → `defineProps()` |
| 9 | DrawerNavigation | `src/shared/ui/DrawerNavigation.vue` | `props` → `defineProps()` |
| 10 | CenterModal | `src/shared/ui/center-modal/CenterModal.vue` | `props` + `emits` + `methods ($emit)` |
| 11 | FeedbackCard | `src/features/feedback/ui/FeedbackCard.vue` | `props` + `emits` + `$emit` в шаблоне |
| 12 | EntryCard | `src/entities/faq/ui/EntryCard.vue` | `props` + `emits` + `$emit` в шаблоне |
| 13 | AreaCard | `src/entities/area/ui/AreaCard.vue` | `props` + `emits` + `$emit` в шаблоне |
| 14 | NotFoundPage | `src/pages/errors/ui/NotFoundPage.vue` | `methods (this.$router)` → `useRouter()` |
| 15 | QuestionsPage | `src/pages/questions/ui/QuestionsPage.vue` | `components` → авторезолв |
| 16 | FAQPage | `src/pages/faq/ui/FAQPage.vue` | `components` → авторезолв |

### Уровень 3: Средние (7 компонентов)

Несколько Options API паттернов одновременно: data + computed + methods + inject + slots + lifecycle.

| # | Компонент | Файл | Паттерны |
|---|---|---|---|
| 17 | QuestionIdPage | `src/pages/questions/detail/QuestionIdPage.vue` | `components` → авторезолв |
| 18 | SidebarContentWrapper | `src/shared/ui/sidebar-modal/SidebarContentWrapper.vue` | `inject` → `inject()`, `computed (this.$slots)` → `useSlots()` |
| 19 | QuestionFilters | `src/entities/question/ui/QuestionFilters.vue` | `data()` + `methods` |
| 20 | QuestionStatusIcon | `src/entities/question/ui/QuestionStatusIcon.vue` | `props` + `data()` + `computed` |
| 21 | CategoryCard | `src/entities/faq/ui/CategoryCard.vue` | `props` + `methods (this.$router)` |
| 22 | QuestionIdView | `src/entities/question/ui/QuestionIdView.vue` | `computed` + `methods` |
| 23 | QuestionCard | `src/entities/question/ui/QuestionCard.vue` | `components` + `props` + `computed` + `methods` |

### Уровень 4: Сложные (3 компонента)

Составные паттерны, гибрид setup + Options, this.$refs.

| # | Компонент | Файл | Паттерны |
|---|---|---|---|
| 24 | App.vue | `src/app/entrypoint/App.vue` | `computed (this.$route, defineAsyncComponent)` + `components` |
| 25 | DefaultLayout | `src/app/layouts/DefaultLayout.vue` | `data()` + `computed` + `methods` + `this.$refs` → `useTemplateRef()` |
| 26 | MainPage | `src/pages/main/ui/MainPage.vue` | Гибрид `setup()` + `data` + `created` + `methods` → чистый `<script setup>` |

## Критерии приёмки

1. Ни один `.vue` файл не содержит `export default {` или `defineComponent`
2. Все компоненты используют `<script setup>`
3. Порядок блоков SFC: `<script>` → `<template>` → `<style>`
4. `npm run lint` проходит без ошибок
5. `npm run build` собирается успешно
6. `npm run fsd:check` не показывает новых ошибок (известные ложные срабатывания допустимы)

## Коммит-стратегия

Один коммит на компонент. Формат: `refactor(<scope>): migrate <ComponentName> to Composition API`.

Примеры scope: `app` (для App.vue, layouts), `shared` (для shared/ui), `entities` (для entities/\*), `features` (для features/\*), `pages` (для pages/\*).

## Риски и ограничения

- **QuestionIdView** — содержит хардкод данных. Миграция не исправляет хардкод, только переводит синтаксис.
- **QuestionFilters** — содержит хардкод фильтров. Аналогично, только перевод синтаксиса.
- **SidebarContentWrapper** — использует `@use './styles/modal-variables'` в SCSS. Это не затрагивается миграцией.
- **MainPage** — самый сложный случай: гибрид `setup()` + Options API. Требует внимательной миграции `created()` (вызов fetchData) на верхний уровень `<script setup>`.
