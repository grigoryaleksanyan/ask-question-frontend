# Миграция Vuetify → PrimeVue

## Цель

Заменить UI-библиотеку Vuetify 4 на PrimeVue 4 с переходом на Aura-тему, PrimeFlex, PrimeIcons, PrimeVue Forms + Zod. Обновить визуальный стиль проекта с возможностью лёгкой перекраски под разные бренды (мультибренд / белый лейбл).

## Мотивация

- **Современный дизайн:** Vuetify выглядит устаревшим, PrimeVue Aura — свежий минималистичный стиль
- **Кастомизация:** Aura-тема с дизайн-токенами через `definePreset` — полный контроль над палитрой
- **Функциональность:** PrimeVue предлагает компоненты, которых нет в Vuetify (Drawer, Editor и др.)
- **Размер бандла:** Vuetify тяжёлый; PrimeVue с tree-shaking легче

## Подход

**Поэтапная миграция по слоям FSD** (подход B): `shared/ui` → `entities` → `features` → `pages` → `app`. На каждом этапе Vuetify и PrimeVue сосуществуют. Мигрируются сначала самые переиспользуемые компоненты, затем зависимые слои.

Не включается: рефакторинг бизнес-логики, изменение FSD-структуры, реализация заглушек (RichEditor, AdminSpeakersPage и др.).

## Стек миграции

| Было | Станет |
|---|---|
| Vuetify 4 | PrimeVue 4 |
| @mdi/font | PrimeIcons |
| VeeValidate 4 | PrimeVue Forms + Zod |
| vuetify/styles + SCSS-переменные | Aura тема + PrimeFlex |
| vite-plugin-vuetify | убирается (PrimeVue свой автоимпорт) |
| eslint-plugin-vuetify | убирается |

## Дизайн-система и тема

### Базовый пресет

Aura (`@primeuix/themes/aura`) — кастомизируется через `definePreset`.

### Файл темы

`src/app/lib/primevue-theme.ts`:

```ts
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

const BrandPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#f0f4ff',
      100: '#dbe4ff',
      200: '#bac8ff',
      300: '#91a7ff',
      400: '#748ffc',
      500: '#5c7cfa',
      600: '#4c6ef5',
      700: '#4263eb',
      800: '#3b5bdb',
      900: '#364fc7',
      950: '#1e3a8a',
    },
  },
});

export default {
  preset: BrandPreset,
  options: {
    prefix: 'p',
    darkModeSelector: '.p-dark',
    cssLayer: false,
  },
};
```

Перекраска под бренд = замена палитры `primary` в одном месте.

### Dark mode

Управляется классом `.p-dark` на `<html>`. Переключатель — в layout.

### SCSS-переменные проекта

`src/app/styles/variables.scss` синхронизируется с дизайн-токенами PrimeVue через CSS-переменные: `var(--p-primary-500)`, `var(--p-surface-100)` и т.д.

### Иконки

PrimeIcons заменяют MDI. Маппинг основных иконок:

| MDI | PrimeIcons |
|---|---|
| `mdi-home` | `pi pi-home` |
| `mdi-pencil-outline` | `pi pi-pencil` |
| `mdi-delete-outline` | `pi pi-trash` |
| `mdi-plus` | `pi pi-plus` |
| `mdi-magnify` | `pi pi-search` |
| `mdi-filter-outline` | `pi pi-filter` |
| `mdi-filter-remove-outline` | `pi pi-filter-slash` |
| `mdi-cog-outline` | `pi pi-cog` |
| `mdi-chart-line` | `pi pi-chart-line` |
| `mdi-eye` / `mdi-eye-outline` | `pi pi-eye` |
| `mdi-thumb-up` / `mdi-thumb-up-outline` | `pi pi-thumbs-up` |
| `mdi-thumb-down` / `mdi-thumb-down-outline` | `pi pi-thumbs-down` |
| `mdi-arrow-left-circle-outline` | `pi pi-arrow-left` |
| `mdi-content-copy` | `pi pi-copy` |
| `mdi-email-open` | `pi pi-envelope` |
| `mdi-autorenew` | `pi pi-refresh` |
| `mdi-frequently-asked-questions` | `pi pi-question` |
| `mdi-account-question` | `pi pi-user` |
| `mdi-account-tie-voice` | `pi pi-users` |
| `mdi-arrow-decision-outline` | `pi pi-directions` |
| `mdi-email-open-multiple-outline` | `pi pi-inbox` |
| `mdi-comment-text-outline` | `pi pi-comment` |
| `mdi-bullhorn-outline` | `pi pi-megaphone` |
| `mdi-crosshairs-question` | `pi pi-question-circle` |
| `mdi-new-box` | `pi pi-box` |
| `mdi-arrow-up-thin` | `pi pi-arrow-up` |
| `mdi-arrow-down-thin` | `pi pi-arrow-down` |
| `mdi-arrow-all` | `pi pi-arrows` |
| `mdi-link` | `pi pi-link` |
| `mdi-help-circle-outline` | `pi pi-question-circle` |
| `mdi-check-circle-outline` | `pi pi-check-circle` |
| `mdi-arrow-down-drop-circle-outline` | `pi pi-angle-down` |

Размер иконок: PrimeIcons управляются через CSS (`font-size`), а не модификаторами класса как в MDI (`mdi-24px`). Анимация `mdi-spin` → CSS `animation: spin 1s linear infinite`.

### PrimeFlex — замена утилити-классов

| Vuetify | PrimeFlex |
|---|---|
| `d-flex` | `flex` |
| `flex-column` | `flex-column` |
| `pa-4` | `p-4` |
| `px-2` | `px-2` |
| `py-5` | `py-5` |
| `ma-2` | `m-2` |
| `mx-auto` | `mx-auto` |
| `mt-4` | `mt-4` |
| `mb-3` | `mb-3` |
| `align-center` | `align-items-center` |
| `justify-center` | `justify-content-center` |
| `justify-end` | `justify-content-end` |
| `justify-space-between` | `justify-content-between` |
| `text-center` | `text-center` |
| `text-headline-large` | кастомный CSS-класс / типографика темы |
| `text-body-large` | кастомный CSS-класс / типографика темы |
| `font-weight-bold` | `font-bold` |
| `elevation-2` | `shadow-2` |
| `rounded-lg` | `border-round-lg` |
| `w-100` | `w-full` |
| `v-spacer` | `flex-grow-1` |

Сетка:

| Vuetify | PrimeFlex |
|---|---|
| `v-container` | `div` + `container` (или без wrapper) |
| `v-row` | `div` + `flex` / `grid` |
| `v-col cols="12" sm="6"` | `div` + `col-12 md:col-6` |
| `v-col cols="12" sm="8"` | `div` + `col-12 md:col-8` |

## Маппинг компонентов Vuetify → PrimeVue

| Vuetify | PrimeVue | Примечания |
|---|---|---|
| `v-app` | убрать | PrimeVue не требует wrapper |
| `v-main` | убрать | Layout-контейнер — кастомный CSS |
| `v-app-bar` | `Toolbar` | |
| `v-app-bar-nav-icon` | `Button` + `icon` prop | Кастомная кнопка-гамбургер |
| `v-navigation-drawer` | `Drawer` | `position="left"`, постоянная или overlay |
| `v-toolbar-title` | slot внутри `Toolbar` | |
| `v-toolbar-items` | slot внутри `Toolbar` | |
| `v-container` | `div` + PrimeFlex | |
| `v-row` | `div` + `flex` / `grid` | PrimeFlex |
| `v-col` | `div` + `col-*` | PrimeFlex |
| `v-card` | `Card` | |
| `v-card-title` | `Card` > `title` slot | |
| `v-card-text` | `Card` > `content` slot | |
| `v-card-actions` | `Card` > `footer` slot | Или `flex` + `Button` |
| `v-btn` | `Button` | |
| `v-btn-toggle` | `SelectButton` | |
| `v-form` | `Form` (`@primevue/forms`) | + Zod resolver |
| `v-text-field` | `InputText` | + `FloatLabel` при необходимости |
| `v-textarea` | `Textarea` | |
| `v-select` | `Select` | |
| `v-data-table` | `DataTable` | |
| `v-pagination` | `Paginator` | |
| `v-icon` | `i class="pi pi-*"` | PrimeIcons |
| `v-img` | `Image` | |
| `v-sheet` | `div` + стили | Декоративный wrapper, прямого аналога нет |
| `v-divider` | `Divider` | |
| `v-tabs` / `v-tab` | `Tabs` / `TabList` / `Tab` / `TabPanels` / `TabPanel` | |
| `v-list` / `v-list-item` | `Menu` / кастомный список | |
| `v-dialog` | `Dialog` | |
| `v-overlay` | `Drawer` / кастомный overlay | |
| `v-progress-circular` | `ProgressSpinner` | |
| `v-progress-linear` | `ProgressBar` | |
| `v-expand-transition` | CSS transition / `Collapse` | |
| `v-spacer` | `flex-grow-1` | PrimeFlex |
| `v-tooltip` | `v-tooltip` (директива) | `v-tooltip="'текст'"` |
| `v-menu` | `Menu` | Overlay-меню |

### Composables

| Vuetify | Замена |
|---|---|
| `useDisplay` | CSS медиа-запросы + PrimeFlex responsive |
| `useGoTo` | нативный `element.scrollIntoView()` |

## Стратегия миграции по слоям FSD

### Этап 0: Инфраструктура

- Установить: `primevue`, `@primevue/themes`, `@primeuix/themes/aura`, `primeicons`, `primeflex`, `@primevue/forms`, `@primevue/forms/resolvers`, `zod`
- Создать `src/app/lib/primevue-theme.ts` — файл темы
- Создать `src/app/lib/primevue.ts` — подключение плагина
- Обновить `vite.config.ts`: убрать `vite-plugin-vuetify`
- Обновить `src/app/lib/registerPlugins.ts`: подключить PrimeVue, PrimeFlex
- Обновить `eslint.config.ts`: убрать vuetify-исключения из `import-x/no-unresolved`; `eslint-plugin-vuetify` остаётся до этапа 5
- Обновить `src/app/styles/base.scss`: подключить PrimeIcons CSS

На этом этапе Vuetify и PrimeVue сосуществуют.

### Этап 1: shared/ui

- `CenterModal` → `Dialog` (PrimeVue); `CenterModalContentWrapper` упраздняется — `Dialog` имеет слоты `header`/`default`/`footer`
- `SidebarModal` → `Drawer` (PrimeVue); `SidebarContentWrapper` упраздняется — `Drawer` имеет слоты `header`/`default`/`footer`
- Удалить из `src/app/lib/global-components.ts`: `SidebarModal`, `SidebarContentWrapper`, `CenterModal`, `CenterModalContentWrapper`
- Обновить потребителей (в `features/feedback/` и др.) на использование `Drawer`/`Dialog` напрямую
- `RichEditor` — заглушка, не трогаем
- `AppLogo` — заменить `v-img` → `Image`
- `HeaderNavigation` — заменить `v-toolbar-items` → slot в `Toolbar`, `v-btn` → `Button`
- `DrawerNavigation` — заменить `v-list`/`v-list-item` → `Menu` или кастомный список

### Этап 2: entities

- `alert/` — уже без Vuetify (чистый HTML/SVG), не трогаем
- `question/` — заменить `v-icon` → PrimeIcons, `v-card` → `Card`, утилити-классы → PrimeFlex, `useDisplay` → CSS/PrimeFlex responsive
- `faq/` — заменить `v-card` → `Card`, `v-btn` → `Button`, утилити-классы → PrimeFlex
- `area/` — заменить `v-card` → `Card`, `v-divider` → `Divider`, `v-btn` → `Button`
- `user/` — заменить `v-text-field` → `InputText`

### Этап 3: features

- `auth/` — формы: VeeValidate + `v-text-field` → `Form` (PrimeVue) + `InputText` + Zod resolver
- `feedback/` — формы в sidebar: аналогичная замена форм; `SidebarModal` → `Drawer` (уже на этапе 1)
- `preloader/` — `v-overlay` + `v-progress-circular` → кастомный overlay + `ProgressSpinner`

### Этап 4: pages

- Все страницы: замена сетки (`v-container`/`v-row`/`v-col` → PrimeFlex), карточек, утилити-классов
- `MainPage` — `useGoTo` → `scrollIntoView()`
- `QuestionsView` — `useDisplay` → CSS/PrimeFlex, `v-tabs` → `Tabs`, `v-pagination` → `Paginator`
- `AdminQuestionsPage` — `v-data-table` → `DataTable`
- Админ-страницы — замена форм, карточек, утилити-классов

### Этап 5: app (финальный)

- `DefaultLayout`, `AdminLayout`, `EmptyLayout` — `v-app-bar` → `Toolbar`, `v-navigation-drawer` → `Drawer`, убрать `v-app`/`v-main`
- `App.vue` — убрать `v-app`
- Удалить `src/app/lib/vuetify.ts`
- Удалить из зависимостей: `vuetify`, `@mdi/font`, `vite-plugin-vuetify`, `eslint-plugin-vuetify`, `vee-validate`, `@vee-validate/rules`
- Удалить `src/app/lib/vee-validate.ts`
- Финальная проверка: `npm run lint`, `npm run typecheck`, `npm run fsd:check`, `npm run test`

## Риски и митигация

| Риск | Митигация |
|---|---|
| Временное увеличение бандла (2 UI-библиотеки) | Этапы идут быстро друг за другом; после этапа 5 Vuetify удаляется полностью |
| Расхождение стилей между старыми и новыми компонентами | Этап 0 фиксирует тему; новые компоненты сразу используют токены |
| Поломка глобальных компонентов (SidebarModal, CenterModal) | Этап 1 мигрирует их первыми; все потребители обновляются сразу |
| VeeValidate → PrimeVue Forms: потеря правил валидации | Все правила переносятся в Zod-схемы; `required`, `email`, `confirmed`, `max_value`, `required-date` — есть прямые аналоги в Zod |
| `useDisplay` → нет прямого аналога | PrimeFlex responsive-классы + `window.matchMedia()` для JS-логики |
| Типографика Vuetify (`text-headline-large` и т.д.) — нет 1:1 в PrimeFlex | Создать набор BEM-утилитарных классов в `variables.scss`: `typography__headline--large`, `typography__headline--medium`, `typography__headline--small`, `typography__body--large`, `typography__body--medium`, `typography__body--small`, `typography__display--small`. Значения — через CSS-переменные темы Aura |
