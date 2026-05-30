# Миграция Vuetify → PrimeVue — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Заменить Vuetify 4 на PrimeVue 4 с Aura-темой, PrimeFlex, PrimeIcons, PrimeVue Forms + Zod во всём проекте.

**Architecture:** Поэтапная миграция по слоям FSD: shared/ui → entities → features → pages → app. На каждом этапе Vuetify и PrimeVue сосуществуют. После финального этапа Vuetify полностью удаляется.

**Tech Stack:** PrimeVue 4, @primeuix/themes/aura, PrimeFlex, PrimeIcons, @primevue/forms, Zod, Vue 3.5, Pinia 3, Vue Router 5, Axios, TypeScript

---

## Файловая структура: что создаётся и модифицируется

### Новые файлы
- `src/app/lib/primevue.ts` — подключение PrimeVue-плагина
- `src/app/lib/primevue-theme.ts` — файл темы Aura с бренд-токенами
- `src/app/styles/typography.scss` — BEM-утилити-классы для типографики

### Модифицируемые файлы (по этапам)

**Этап 0:**
- `package.json` — добавить/удалить зависимости
- `vite.config.ts` — убрать vite-plugin-vuetify
- `src/app/lib/index.ts` — подключить PrimeVue + PrimeFlex
- `src/app/styles/base.scss` — подключить PrimeIcons
- `src/app/styles/variables.scss` — обновить переменные
- `eslint.config.ts` — убрать vuetify-исключения

**Этап 1 (shared/ui):**
- `src/shared/ui/center-modal/CenterModal.vue` → переписать на Dialog
- `src/shared/ui/center-modal/CenterModalContentWrapper.vue` → удалить
- `src/shared/ui/center-modal/index.ts` → обновить экспорт
- `src/shared/ui/sidebar-modal/SidebarModal.vue` → переписать на Drawer
- `src/shared/ui/sidebar-modal/SidebarContentWrapper.vue` → удалить
- `src/shared/ui/sidebar-modal/SidebarPreloader.vue` → переписать на ProgressSpinner
- `src/shared/ui/sidebar-modal/index.ts` → обновить экспорт
- `src/shared/ui/AppLogo.vue` → заменить v-img на img
- `src/shared/ui/HeaderNavigation.vue` → заменить v-toolbar-items/v-btn/v-icon
- `src/shared/ui/DrawerNavigation.vue` → заменить v-list/v-list-item
- `src/app/lib/global-components.ts` → убрать удалённые глобальные компоненты

**Этап 2 (entities):**
- `src/entities/question/ui/QuestionIdView.vue` — заменить v-container/v-row/v-col/v-sheet/v-btn/v-icon/v-progress-circular
- `src/entities/question/ui/QuestionsView.vue` — заменить v-container/v-row/v-col/v-text-field/v-tabs/v-tab/v-pagination + useDisplay
- `src/entities/question/ui/QuestionCard.vue` — заменить v-card/v-card-title/v-card-text/v-card-actions/v-sheet/v-divider/v-btn/v-icon/v-container
- `src/entities/question/ui/QuestionStatusIcon.vue` — заменить v-icon
- `src/entities/question/ui/QuestionFilters.vue` — заменить v-container/v-row/v-col/v-btn-toggle/v-btn/v-expand-transition/v-select
- `src/entities/question/ui/QuestionFormCreate.vue` — заменить v-card/v-form/v-textarea/v-text-field/v-select/v-btn/v-img/v-icon/v-expand-transition/v-divider
- `src/entities/faq/ui/FAQView.vue` — заменить v-container/v-row/v-col/v-expansion-panels
- `src/entities/faq/ui/EntryCard.vue` — заменить v-card/v-card-title/v-card-text/v-card-actions/v-sheet/v-divider/v-btn/v-icon/v-container
- `src/entities/faq/ui/CreateCategory.vue` — заменить v-form/v-text-field/v-btn
- `src/entities/faq/ui/UpdateCategory.vue` — заменить v-form/v-text-field/v-btn
- `src/entities/faq/ui/DeleteCategory.vue` — заменить v-btn
- `src/entities/faq/ui/CreateEntryContent.vue` — заменить v-form/v-text-field/v-textarea/v-select/v-btn
- `src/entities/faq/ui/UpdateEntryContent.vue` — заменить v-form/v-text-field/v-textarea/v-btn
- `src/entities/faq/ui/DeleteEntry.vue` — заменить v-btn
- `src/entities/area/ui/AreaCard.vue` — заменить v-card/v-card-title/v-card-text/v-divider/v-card-actions/v-btn/v-icon/v-sheet/v-container
- `src/entities/area/ui/CreateArea.vue` — заменить v-form/v-text-field/v-btn
- `src/entities/area/ui/UpdateArea.vue` — заменить v-form/v-text-field/v-btn
- `src/entities/area/ui/DeleteArea.vue` — заменить v-btn
- `src/entities/user/ui/SpeakerCard.vue` — заменить v-card/v-card-title/v-card-text/v-divider/v-card-actions/v-btn/v-icon/v-sheet/v-container
- `src/entities/user/ui/UserProfile.vue` — заменить v-form/v-text-field/v-btn
- `src/entities/user/ui/CreateSpeaker.vue` — заменить v-form/v-text-field/v-btn
- `src/entities/user/ui/UpdateSpeaker.vue` — заменить v-form/v-text-field/v-textarea/v-btn
- `src/entities/user/ui/DeleteSpeaker.vue` — заменить v-btn

**Этап 3 (features):**
- `src/features/auth/ui/LoginView.vue` — заменить v-container/v-row/v-col/v-form/v-text-field/v-btn
- `src/features/auth/store/` — убрать VeeValidate-зависимости
- `src/features/feedback/ui/SidebarFeedbackContent.vue` — заменить v-form/v-text-field/v-textarea/v-select/v-btn + адаптировать к Drawer
- `src/features/feedback/ui/FeedbackCard.vue` — заменить v-card/v-card-title/v-card-text/v-divider/v-card-actions/v-btn/v-icon/v-container
- `src/features/feedback/ui/DeleteFeedbackModal.vue` — заменить v-btn
- `src/features/feedback/ui/GetAllFeedback.ts` — без изменений (API)
- `src/features/preloader/ui/AppPreloader.vue` — заменить v-overlay/v-progress-circular

**Этап 4 (pages):**
- `src/pages/main/ui/MainPage.vue` — заменить v-container/v-row/v-col/v-btn/v-icon + useGoTo
- `src/pages/errors/ui/NotFoundPage.vue` — заменить v-container/v-row/v-col/v-btn
- `src/pages/admin/main/ui/AdminMainPage.vue` — заменить v-container/v-row/v-col
- `src/pages/admin/questions/ui/AdminQuestionsPage.vue` — заменить v-container/v-row/v-col/v-data-table
- `src/pages/admin/speakers/ui/AdminSpeakersPage.vue` — заменить CenterModal → Dialog + v-container/v-row/v-col/v-btn/v-icon
- `src/pages/admin/feedback/ui/AdminFeedbackPage.vue` — заменить CenterModal → Dialog + v-container/v-row/v-col
- `src/pages/admin/faq/ui/AdminFAQPage.vue` — заменить CenterModal → Dialog + v-container/v-row/v-col/v-btn/v-icon
- `src/pages/admin/faq/ui/AdminFAQCategoryPage.vue` — заменить SidebarModal → Drawer + CenterModal → Dialog + v-row/v-col/v-btn/v-icon
- `src/pages/admin/areas/ui/AdminAreasPage.vue` — заменить CenterModal → Dialog + v-container/v-row/v-col/v-btn/v-icon
- `src/widgets/dashboard/` — все .vue файлы (DashboardWidget, SpeakerProductivityChart, SpeakerAreasChart, TimelineLineChart, StatCardsRow, VotesSummary, StatusDoughnutChart, AreaBarChart, DashboardFilters)

**Этап 5 (app — финальный):**
- `src/app/entrypoint/App.vue` — убрать v-app
- `src/app/layouts/DefaultLayout.vue` — заменить v-navigation-drawer → Drawer, v-app-bar → Toolbar, v-main → div, v-footer, v-tooltip, v-btn/v-icon
- `src/app/layouts/AdminLayout.vue` — заменить v-navigation-drawer → Drawer, v-app-bar → Toolbar, v-toolbar-title, v-menu → Menu, v-list/v-list-item, v-main → div, CenterModal → Dialog
- `src/app/layouts/EmptyLayout.vue` — убрать v-main
- `src/app/lib/vuetify.ts` — удалить
- `src/app/lib/vee-validate.ts` — удалить
- `src/app/lib/index.ts` — убрать vuetify и veeValidate
- `src/app/lib/global-components.ts` — очистить
- `package.json` — удалить vuetify, @mdi/font, vite-plugin-vuetify, eslint-plugin-vuetify, vee-validate, @vee-validate/rules
- `eslint.config.ts` — удалить eslint-plugin-vuetify

---

## Общие паттерны замены

### Сетка: v-container/v-row/v-col → PrimeFlex

```vue
<!-- Было -->
<v-container fluid style="max-width: 1000px">
  <v-row no-gutters>
    <v-col cols="12" class="my-8">...</v-col>
  </v-row>
</v-container>

<!-- Станет -->
<div style="max-width: 1000px" class="mx-auto">
  <div class="flex">
    <div class="col-12 my-8">...</div>
  </div>
</div>
```

### Карточки: v-card → Card

```vue
<!-- Было -->
<v-card elevation="2" color="#E8EAF6">
  <v-card-title class="py-2">...</v-card-title>
  <v-card-text>...</v-card-text>
  <v-divider></v-divider>
  <v-card-actions class="py-1">...</v-card-actions>
</v-card>

<!-- Станет -->
<Card class="shadow-2" style="background-color: #E8EAF6">
  <template #title>...</template>
  <template #content>...</template>
  <template #footer>...</template>
</Card>
```

### Формы: VeeValidate → PrimeVue Forms + Zod

```vue
<!-- Было -->
<VeeForm v-slot="{ handleSubmit }" @submit="onSubmit">
  <VeeField name="email" rules="required|email" v-slot="{ field, errors }">
    <v-text-field v-bind="field" label="Email" :error-messages="errors" />
  </VeeField>
  <v-btn type="submit">Отправить</v-btn>
</VeeForm>

<!-- Станет -->
<Form :resolver="zodResolver" @submit="onSubmit">
  <FormField v-slot="$field" name="email">
    <InputText type="text" placeholder="Email" />
    <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
      {{ $field.error?.message }}
    </Message>
  </FormField>
  <Button type="submit" label="Отправить" />
</Form>
```

### Модалки: CenterModal → Dialog

```vue
<!-- Было -->
<CenterModal title="Заголовок" :is-open="showModal" @close="showModal = false">
  <CenterModalContentWrapper>
    <template #default>Контент</template>
    <template #actions>
      <v-btn @click="action">Действие</v-btn>
    </template>
  </CenterModalContentWrapper>
</CenterModal>

<!-- Станет -->
<Dialog v-model:visible="showModal" header="Заголовок" :modal="true" :draggable="false">
  <div style="max-height: 400px; overflow-y: auto" class="p-7">Контент</div>
  <template #footer>
    <Button @click="action">Действие</Button>
  </template>
</Dialog>
```

### SidebarModal → Drawer (promise-based API сохраняется через composable)

```vue
<!-- Было -->
<SidebarModal ref="feedback-modal">
  <template #default="{ togglePreloader, confirm, close }">
    <SidebarContentWrapper title="Обратная связь">
      <template #default>Контент</template>
      <template #footer>
        <v-btn @click="confirm()">Отправить</v-btn>
      </template>
    </SidebarContentWrapper>
  </template>
</SidebarModal>

<!-- Станет -->
<Drawer v-model:visible="drawerVisible" position="right" :modal="true" header="Обратная связь">
  <div style="overflow-y: auto" class="p-8">Контент</div>
  <template #footer>
    <Button @click="handleConfirm">Отправить</Button>
  </template>
</Drawer>
```

Promise-based API SidebarModal.open() эмулируется через composable `useDrawerModal()`.

### Иконки: mdi → pi

```vue
<!-- Было -->
<v-icon>mdi-home</v-icon>
<v-icon size="20">mdi-pencil-outline</v-icon>

<!-- Станет -->
<i class="pi pi-home"></i>
<i class="pi pi-pencil" style="font-size: 20px"></i>
```

### Типографика: Vuetify-классы → кастомные BEM-классы

```scss
// src/app/styles/typography.scss
.typography__headline--large {
  font-size: var(--p-text-2xl-font-size, 1.5rem);
  font-weight: var(--p-text-2xl-font-weight, 600);
  line-height: var(--p-text-2xl-line-height, 2rem);
}

.typography__headline--medium {
  font-size: var(--p-text-xl-font-size, 1.25rem);
  font-weight: var(--p-text-xl-font-weight, 600);
  line-height: var(--p-text-xl-line-height, 1.75rem);
}

.typography__headline--small {
  font-size: var(--p-text-lg-font-size, 1.125rem);
  font-weight: var(--p-text-lg-font-weight, 600);
  line-height: var(--p-text-lg-line-height, 1.75rem);
}

.typography__body--large {
  font-size: var(--p-text-base-font-size, 1rem);
  font-weight: var(--p-text-base-font-weight, 400);
  line-height: var(--p-text-base-line-height, 1.5rem);
}

.typography__body--medium {
  font-size: var(--p-text-sm-font-size, 0.875rem);
  font-weight: var(--p-text-sm-font-weight, 400);
  line-height: var(--p-text-sm-line-height, 1.25rem);
}

.typography__body--small {
  font-size: var(--p-text-xs-font-size, 0.75rem);
  font-weight: var(--p-text-xs-font-weight, 400);
  line-height: var(--p-text-xs-line-height, 1rem);
}

.typography__display--small {
  font-size: var(--p-text-3xl-font-size, 1.875rem);
  font-weight: var(--p-text-3xl-font-weight, 600);
  line-height: var(--p-text-3xl-line-height, 2.25rem);
}
```

---

## Task 1: Инфраструктура — установка зависимостей

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Установить PrimeVue и сопутствующие пакеты**

```bash
cd ask-question-frontend && npm install primevue @primevue/themes @primeuix/themes primeicons primeflex @primevue/forms @primevue/forms/resolvers zod
```

- [ ] **Step 2: Убедиться, что установка прошла успешно**

```bash
cd ask-question-frontend && npm ls primevue zod primeflex
```

Expected: версии primevue, zod, primeflex отображаются без ошибок.

---

## Task 2: Инфраструктура — файл темы PrimeVue

**Files:**
- Create: `src/app/lib/primevue-theme.ts`

- [ ] **Step 1: Создать файл темы**

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

---

## Task 3: Инфраструктура — убирается, PrimeVue подключается напрямую в index.ts (Task 4)

---

## Task 4: Инфраструктура — обновить registerPlugins

**Files:**
- Modify: `src/app/lib/index.ts`

- [ ] **Step 1: Добавить PrimeVue и PrimeFlex, оставить Vuetify до этапа 5**

```ts
import type { App } from 'vue';

import router from '@/app/router';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';

import theme from './primevue-theme';
import vuetify from './vuetify';
import veeValidate from './vee-validate';
import setupHttpClientInterceptors from './http-client-interceptors';

export default function registerPlugins(app: App) {
  const pinia = createPinia();

  app
    .use(router)
    .use(pinia)
    .use(vuetify)
    .use(veeValidate)
    .use(PrimeVue, { theme });

  setupHttpClientInterceptors();
}
```

---

## Task 5: Инфраструктура — обновить main.ts

**Files:**
- Modify: `src/app/entrypoint/main.ts`

- [ ] **Step 1: Добавить импорт PrimeFlex**

```ts
import { createApp } from 'vue';
import registerPlugins from '@/app/lib';
import registerGlobalComponents from '@/app/lib/global-components';

import App from './App.vue';

import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';

import '@/app/styles/base.scss';

const app = createApp(App);

registerPlugins(app);
registerGlobalComponents(app);

app.mount('#app');
```

---

## Task 6: Инфраструктура — обновить vite.config.ts

**Files:**
- Modify: `vite.config.ts`

- [ ] **Step 1: Убрать vite-plugin-vuetify**

```ts
import { fileURLToPath, URL } from 'node:url';

import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: fileURLToPath(new URL('./src', import.meta.url)),
      },
    ],
  },
  css: {
    preprocessorOptions: {
      scss: { additionalData: '@use "@/app/styles/variables.scss";' },
    },
  },
  server: {
    port: 5000,
    proxy: { '/api': { target: 'http://localhost:5500', changeOrigin: true } },
  },
});
```

---

## Task 7: Инфраструктура — создать типографику

**Files:**
- Create: `src/app/styles/typography.scss`

- [ ] **Step 1: Создать BEM-утилити-классы для типографики**

```scss
.typography__headline--large {
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 2rem;
}

.typography__headline--medium {
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.75rem;
}

.typography__headline--small {
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.75rem;
}

.typography__body--large {
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5rem;
}

.typography__body--medium {
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.25rem;
}

.typography__body--small {
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1rem;
}

.typography__display--small {
  font-size: 1.875rem;
  font-weight: 600;
  line-height: 2.25rem;
}

@media (width >= 600px) {
  .typography__headline--large--sm {
    font-size: 1.875rem;
    font-weight: 600;
    line-height: 2.25rem;
  }

  .typography__headline--small--sm {
    font-size: 1.25rem;
    font-weight: 600;
    line-height: 1.75rem;
  }

  .typography__body--large--sm {
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5rem;
  }

  .typography__body--medium--sm {
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.25rem;
  }

  .typography__display--small--sm {
    font-size: 1.875rem;
    font-weight: 600;
    line-height: 2.25rem;
  }
}
```

- [ ] **Step 2: Подключить typography.scss в base.scss**

Добавить в конец `src/app/styles/base.scss`:

```scss
@use 'typography';
```

---

## Task 8: Инфраструктура — обновить variables.scss

**Files:**
- Modify: `src/app/styles/variables.scss`

- [ ] **Step 1: Обновить SCSS-переменные для синхронизации с Aura-токенами**

```scss
$main-color: #5c7cfa;
$scrollbar-color: #bac8ff;
$links-color: #4263eb;
$primary-color: #78909c;
$success-color: #4caf50;
$info-color: #2196f3;
$warning-color: #fb8c00;
$error-color: #ff5252;
```

---

## Task 9: Инфраструктура — обновить eslint.config.ts

**Files:**
- Modify: `eslint.config.ts`

- [ ] **Step 1: Убрать vuetify-исключения из import-x/no-unresolved**

Найти строку `'import-x/no-unresolved': 'error'` и добавить ниже настройку игнорирования для primevue аналогично vuetify. Также убрать `pluginVuetify` из импортов и конфигурации, но оставить `eslint-plugin-vuetify` в devDependencies до этапа 5 (плагин нужен пока vuetify-компоненты в шаблонах).

В `eslint.config.ts`:
- Убрать `import pluginVuetify from 'eslint-plugin-vuetify';`
- Убрать `...pluginVuetify.configs['flat/recommended-v4'],`
- Добавить в настройки `import-x/no-unresolved` игнорирование primevue путей:

```ts
'import-x/no-unresolved': ['error', { ignore: ['primevue', '@primevue', '@primeuix', 'primeflex', 'primeicons'] }],
```

---

## Task 10: Инфраструктура — проверить сборку

- [ ] **Step 1: Запустить typecheck**

```bash
cd ask-question-frontend && npm run typecheck
```

Expected: ошибки только от vuetify-компонентов (пока ожидаемо). Новые ошибки от primevue — нет.

- [ ] **Step 2: Запустить dev-сервер и проверить, что приложение загружается**

```bash
cd ask-question-frontend && npm run dev
```

Expected: приложение работает как раньше, PrimeVue + Vuetify сосуществуют.

---

## Task 11: shared/ui — CenterModal → Dialog

**Files:**
- Modify: `src/shared/ui/center-modal/CenterModal.vue`
- Delete: `src/shared/ui/center-modal/CenterModalContentWrapper.vue`
- Modify: `src/shared/ui/center-modal/index.ts`

- [ ] **Step 1: Переписать CenterModal.vue на Dialog**

```vue
<template>
  <Dialog
    v-model:visible="isVisible"
    :header="title"
    :modal="true"
    :draggable="false"
    :style="{ maxWidth: '600px' }"
    @hide="onClose">
    <slot></slot>
  </Dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import Dialog from 'primevue/dialog';

interface Props {
  isOpen: boolean;
  title: string;
}

defineOptions({ name: 'CenterModal' });

const { isOpen, title } = defineProps<Props>();

const emit = defineEmits<{
  close: [];
}>();

const isVisible = computed({
  get() {
    return isOpen;
  },
  set() {
    onClose();
  },
});

function onClose() {
  emit('close');
}
</script>
```

- [ ] **Step 2: Удалить CenterModalContentWrapper.vue**

Удалить файл `src/shared/ui/center-modal/CenterModalContentWrapper.vue`.

- [ ] **Step 3: Обновить index.ts**

```ts
export { default as CenterModal } from './CenterModal.vue';
```

---

## Task 12: shared/ui — SidebarModal → Drawer

**Files:**
- Modify: `src/shared/ui/sidebar-modal/SidebarModal.vue`
- Delete: `src/shared/ui/sidebar-modal/SidebarContentWrapper.vue`
- Modify: `src/shared/ui/sidebar-modal/SidebarPreloader.vue`
- Modify: `src/shared/ui/sidebar-modal/index.ts`
- Delete: `src/shared/ui/sidebar-modal/styles/modal-variables.scss`

SidebarModal имеет promise-based API (`open()` → `Promise<SidebarModalResult>`). Для сохранения этого паттерна с PrimeVue Drawer создадим composable `useDrawerModal`.

- [ ] **Step 1: Переписать SidebarModal.vue на Drawer**

```vue
<template>
  <Drawer
    v-model:visible="isVisible"
    position="right"
    :modal="true"
    :dismissable="closeOnClickAway"
    :show-close-icon="true"
    style="width: 100%; max-width: 700px"
    @hide="onDrawerHide">
    <template #header>
      <slot name="header"></slot>
    </template>
    <div style="overflow-y: auto; overscroll-behavior: none" class="p-8">
      <slot
        :is-open="isOpen"
        :toggle-preloader="togglePreloader"
        :confirm="confirm"
        :close="close">
      </slot>
    </div>
    <template #footer>
      <slot name="footer"></slot>
    </template>
  </Drawer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

import Drawer from 'primevue/drawer';

import type { SidebarModalResult } from '@/shared/types';

interface Props {
  closeOnEsc?: boolean;
  closeOnClickAway?: boolean;
}

const { closeOnEsc = true, closeOnClickAway = true } = defineProps<Props>();

const isOpen = ref(false);
const isVisible = computed({
  get() {
    return isOpen.value;
  },
  set(value: boolean) {
    if (!value && isOpen.value) {
      close();
    }
  },
});

let modalController: {
  resolve: (value: SidebarModalResult) => void;
  reject: (reason?: unknown) => void;
} | null = null;

function open(): Promise<SidebarModalResult> {
  let resolve!: (value: SidebarModalResult) => void;
  let reject!: (reason?: unknown) => void;
  const modalPromise = new Promise<SidebarModalResult>((ok, fail) => {
    resolve = ok;
    reject = fail;
  });

  modalController = { resolve, reject };
  isOpen.value = true;

  return modalPromise;
}

function resolveModal(status: boolean, data: unknown = null) {
  modalController!.resolve({ status, data });
  isOpen.value = false;
}

function confirm(data: unknown = null) {
  resolveModal(true, data);
}

function close(data: unknown = null) {
  resolveModal(false, data);
}

function togglePreloader(_status: boolean) {
  // Preloader logic handled separately if needed
}

function onDrawerHide() {
  if (modalController) {
    close();
  }
}

defineExpose({
  open,
});
</script>
```

- [ ] **Step 2: Переписать SidebarPreloader.vue на ProgressSpinner**

```vue
<template>
  <div class="sidebar-preloader">
    <ProgressSpinner
      style="width: 80px; height: 80px"
      stroke-width="4" />
  </div>
</template>

<script setup lang="ts">
import ProgressSpinner from 'primevue/progressspinner';

defineOptions({ name: 'SidebarPreloader' });
</script>

<style lang="scss" scoped>
.sidebar-preloader {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
</style>
```

- [ ] **Step 3: Удалить SidebarContentWrapper.vue и modal-variables.scss**

Удалить `src/shared/ui/sidebar-modal/SidebarContentWrapper.vue` и `src/shared/ui/sidebar-modal/styles/modal-variables.scss`.

- [ ] **Step 4: Обновить index.ts**

```ts
export { default as SidebarModal } from './SidebarModal.vue';
```

---

## Task 13: shared/ui — AppLogo, HeaderNavigation, DrawerNavigation

**Files:**
- Modify: `src/shared/ui/AppLogo.vue`
- Modify: `src/shared/ui/HeaderNavigation.vue`
- Modify: `src/shared/ui/DrawerNavigation.vue`

- [ ] **Step 1: Переписать AppLogo.vue**

Заменить `v-img` на обычный `<img>` (PrimeVue `Image` — для лайтбокса, здесь не нужен).

```vue
<template>
  <div class="logo-wrapper">
    <img
      alt="logo"
      :src="imageUrl"
      style="width: auto; max-width: 100%" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import logoUrl from '@/shared/assets';

defineOptions({ name: 'AppLogo' });

const imageUrl = ref(logoUrl);
</script>

<style lang="scss" scoped>
.logo-wrapper {
  display: flex;
  max-width: 140px;
  height: 100%;
  align-items: center;
  justify-content: center;
  padding: 5px 15px;
}
</style>
```

- [ ] **Step 2: Переписать HeaderNavigation.vue**

```vue
<template>
  <div class="flex align-items-center">
    <router-link
      v-for="(item, i) in navItems"
      :key="i"
      :to="item.link"
      class="flex align-items-center gap-2 mr-3 header-nav-link">
      <i :class="item.icon"></i>
      <span>{{ item.title }}</span>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import type { NavItem } from '@/shared/types';

defineOptions({ name: 'HeaderNavigation' });

const { navItems } = defineProps<{
  navItems: NavItem[];
}>();
</script>

<style lang="scss" scoped>
.header-nav-link {
  color: white;
  text-decoration: none;
  font-size: 14px;
  white-space: nowrap;
}
</style>
```

Примечание: иконки navItems будут обновлены на этапе 5 (layouts) с `mdi-*` на `pi pi-*`.

- [ ] **Step 3: Переписать DrawerNavigation.vue**

```vue
<template>
  <div class="m-0 p-0">
    <router-link
      v-for="item in navItems"
      :key="item.title"
      :to="item.link"
      class="flex align-items-center gap-2 mb-2 pl-4 drawer-nav-link">
      <i :class="item.icon"></i>
      <span>{{ item.title }}</span>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import type { NavItem } from '@/shared/types';

defineOptions({ name: 'DrawerNavigation' });

const { navItems } = defineProps<{
  navItems: NavItem[];
}>();
</script>

<style lang="scss" scoped>
.drawer-nav-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.drawer-nav-link:hover {
  background-color: rgb(255 255 255 / 10%);
}
</style>
```

---

## Task 14: shared/ui — обновить глобальные компоненты

**Files:**
- Modify: `src/app/lib/global-components.ts`

- [ ] **Step 1: Убрать удалённые глобальные компоненты**

```ts
import type { App } from 'vue';

import { SidebarModal } from '@/shared/ui/sidebar-modal';

export default function registerGlobalComponents(app: App) {
  app.component('SidebarModal', SidebarModal);
}
```

CenterModal больше не глобальный — импортируется напрямую. SidebarModal оставлен глобальным, т.к. используется через `ref` + `open()`.

---

## Task 15: shared/ui — обновить потребителей CenterModal

**Files:**
- Modify: все файлы, использующие `CenterModal` и `CenterModalContentWrapper`

Потребители CenterModal (по данным исследования):
- `src/app/layouts/AdminLayout.vue`
- `src/pages/admin/speakers/ui/AdminSpeakersPage.vue`
- `src/pages/admin/feedback/ui/AdminFeedbackPage.vue`
- `src/pages/admin/faq/ui/AdminFAQPage.vue`
- `src/pages/admin/faq/ui/AdminFAQCategoryPage.vue`
- `src/pages/admin/areas/ui/AdminAreasPage.vue`

На этом этапе обновляем только импорты и базовую структуру. Детальная замена внутренностей (v-btn, v-form и т.д.) — на последующих этапах.

- [ ] **Step 1: Обновить потребителей — заменить CenterModalContentWrapper на слоты Dialog**

В каждом файле-потребителе:
1. Добавить `import CenterModal from '@/shared/ui/center-modal/CenterModal.vue';`
2. Заменить `<CenterModalContentWrapper>` на слоты Dialog:
   - `<template #default>` → контент внутри CenterModal (уже там)
   - `<template #actions>` → `<template #footer>` внутри CenterModal

Паттерн замены в каждом файле:

```vue
<!-- Было -->
<CenterModal title="..." :is-open="showX" @close="showX = false">
  <CenterModalContentWrapper>
    <template #default>контент</template>
    <template #actions><v-btn @click="...">Кнопка</v-btn></template>
  </CenterModalContentWrapper>
</CenterModal>

<!-- Станет -->
<CenterModal title="..." :is-open="showX" @close="showX = false">
  <div style="max-height: 400px; overflow-y: auto" class="p-7">контент</div>
  <template #footer><Button @click="..." label="Кнопка" /></template>
</CenterModal>
```

Это временный этап — v-btn внутри footer будет заменён на Button на этапе 4.

- [ ] **Step 2: Проверить, что приложение собирается**

```bash
cd ask-question-frontend && npm run typecheck
```

---

## Task 16: entities/question — QuestionStatusIcon

**Files:**
- Modify: `src/entities/question/ui/QuestionStatusIcon.vue`

- [ ] **Step 1: Заменить v-icon на PrimeIcons**

```vue
<template>
  <span>
    <span>статус: {{ curentStatus.text }}</span>
    <i
      :class="curentStatus.icon"
      :style="{ color: curentStatus.color, fontSize: '24px' }"
      class="ml-2"></i>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { QuestionStatusId } from '@/shared/types';

import QUESTION_STATUSES from '../config/question-statuses';

defineOptions({ name: 'QuestionStatusIcon' });

const { status = QuestionStatusId.New } = defineProps<{
  status?: QuestionStatusId;
}>();

const statusList = [
  {
    text: QUESTION_STATUSES.NEW.TITLE,
    color: QUESTION_STATUSES.NEW.COLOR,
    icon: 'pi pi-question-circle',
  },
  {
    text: QUESTION_STATUSES.IN_FOCUS.TITLE,
    color: QUESTION_STATUSES.IN_FOCUS.COLOR,
    icon: 'pi pi-eye',
  },
  {
    text: QUESTION_STATUSES.WITH_COMMENT.TITLE,
    color: QUESTION_STATUSES.WITH_COMMENT.COLOR,
    icon: 'pi pi-comment',
  },
  {
    text: QUESTION_STATUSES.ANSWERED.TITLE,
    color: QUESTION_STATUSES.ANSWERED.COLOR,
    icon: 'pi pi-check-circle',
  },
];

const curentStatus = computed(() => statusList[status]);
</script>
```

---

## Task 17: entities/question — QuestionFilters

**Files:**
- Modify: `src/entities/question/ui/QuestionFilters.vue`

- [ ] **Step 1: Переписать QuestionFilters.vue**

Заменить: v-container/v-row/v-col → PrimeFlex, v-btn-toggle → SelectButton, v-btn → Button, v-select → Select, v-expand-transition → CSS transition.

```vue
<template>
  <div class="flex justify-content-between">
    <div class="col-6">
      <SelectButton
        v-model="sortOrder"
        :options="sortOptions"
        option-label="label"
        option-value="value"
        aria-label="Сортировка"
        @change="onFilterChange" />
    </div>
    <div class="col-6 flex justify-content-end">
      <Button
        size="small"
        severity="secondary"
        outlined
        @click="toggleFilters">
        <span class="mr-1">Фильтры</span>
        <i
          v-if="!showFilters"
          class="pi pi-filter"></i>
        <i
          v-else
          class="pi pi-filter-slash"></i>
      </Button>
    </div>
  </div>

  <div
    v-show="showFilters"
    class="mt-6 flex justify-content-center">
    <div class="col-12 md:col-6">
      <Select
        v-model="selectedSpeaker"
        :options="speakerItems"
        option-label="displayName"
        option-value="id"
        placeholder="Спикер"
        show-clear
        class="w-full"
        @change="onFilterChange" />
    </div>
    <div class="col-12 md:col-6">
      <Select
        v-model="selectedAreaId"
        :options="areaItems"
        option-label="title"
        option-value="id"
        placeholder="Зона ответственности"
        show-clear
        class="w-full"
        @change="onFilterChange" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

import SelectButton from 'primevue/selectbutton';
import Button from 'primevue/button';
import Select from 'primevue/select';

import type { AreaResponse } from '@/shared/types';

import { GetAllSpeakers } from '@/entities/user';
import { GetAllAreas } from '@/entities/area';

defineOptions({ name: 'QuestionFilters' });

const emit = defineEmits<{
  (
    e: 'change',
    filters: {
      speakerId?: string;
      areaId?: string;
      sortOrder: 'asc' | 'desc';
    },
  ): void;
}>();

const sortOptions = [
  { label: 'Сначала новые', value: 'desc' },
  { label: 'Сначала старые', value: 'asc' },
];

const showFilters = ref(false);
const sortOrder = ref<'asc' | 'desc'>('desc');
const selectedSpeaker = ref<string | null>(null);
const selectedAreaId = ref<string | null>(null);
const speakerItems = ref<{ id: string; displayName: string }[]>([]);
const areaItems = ref<AreaResponse[]>([]);

function toggleFilters() {
  showFilters.value = !showFilters.value;
}

function onFilterChange() {
  emit('change', {
    speakerId: selectedSpeaker.value ?? undefined,
    areaId: selectedAreaId.value ?? undefined,
    sortOrder: sortOrder.value,
  });
}

onMounted(async () => {
  const [speakers, areas] = await Promise.all([
    GetAllSpeakers(),
    GetAllAreas(),
  ]);
  speakerItems.value = speakers.map((s) => ({
    id: s.id,
    displayName: `${s.lastName} ${s.firstName}`,
  }));
  areaItems.value = areas;
});
</script>
```

---

## Task 18: entities/question — QuestionCard

**Files:**
- Modify: `src/entities/question/ui/QuestionCard.vue`

- [ ] **Step 1: Переписать QuestionCard.vue**

Заменить: v-card → Card, v-sheet → div, v-divider → Divider, v-btn → Button, v-icon → pi, v-container/v-row/v-col → PrimeFlex.

```vue
<template>
  <div class="mb-3">
    <Card
      class="shadow-2 cursor-pointer"
      style="background-color: #E8EAF6"
      @click="navigateToQuestion">
      <template #title>
        <div class="flex typography__body--small typography__body--medium--sm">
          <div class="col-12 md:col-6 align-self-center">
            <span>кому: {{ question.speakerName }}</span>
          </div>
          <div class="col-12 md:col-6 flex justify-content-start md:justify-content-end">
            <QuestionStatusIcon :status="question.status" />
          </div>
        </div>
      </template>
      <template #content>
        <div class="flex">
          <div
            :style="{ backgroundColor: color }"
            style="width: 7px; min-height: 40px"></div>
          <div
            style="background-color: white; width: 100%"
            class="p-3">
            <p
              style="color: grey"
              class="typography__body--medium typography__body--large--sm m-0"
              v-html="sliceText(question.text)"></p>
          </div>
        </div>
      </template>
      <template #footer>
        <Divider />
        <div class="flex align-items-center py-1">
          <div class="align-self-center">
            <i
              class="pi pi-eye mr-2"
              title="Количество просмотров"
              style="font-size: 20px"></i>
            <span class="typography__body--small typography__body--medium--sm">
              {{ replaceCounter(localViews) }}
            </span>
          </div>
          <div class="flex justify-content-end align-items-center w-full">
            <Button
              icon="pi pi-thumbs-up"
              :severity="localUserVote === 'Like' ? 'info' : 'secondary'"
              outlined
              size="small"
              class="mr-1"
              @click.prevent="handleLike" />
            <span class="typography__body--small typography__body--medium--sm mr-1">
              {{ replaceCounter(localLikes) }}
            </span>
            <Button
              icon="pi pi-thumbs-down"
              :severity="localUserVote === 'Dislike' ? 'danger' : 'secondary'"
              outlined
              size="small"
              class="mr-1"
              @click.prevent="handleDislike" />
            <span class="typography__body--small typography__body--medium--sm">
              {{ replaceCounter(localDislikes) }}
            </span>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

import Card from 'primevue/card';
import Button from 'primevue/button';
import Divider from 'primevue/divider';

import type { QuestionResponse, VoteType } from '@/shared/types';

import { LikeQuestion, DislikeQuestion } from '../api/questions-repository';
import QUESTION_STATUSES from '../config/question-statuses';

import QuestionStatusIcon from './QuestionStatusIcon.vue';

defineOptions({ name: 'QuestionCard' });

const { question } = defineProps<{
  question: QuestionResponse;
}>();

const router = useRouter();

const localLikes = ref(question.likes);
const localDislikes = ref(question.dislikes);
const localViews = ref(question.views);
const localUserVote = ref<VoteType | null>(question.userVote ?? null);

const color = computed(() => {
  switch (question.status) {
    case QUESTION_STATUSES.NEW.STATUS_ID:
      return QUESTION_STATUSES.NEW.COLOR;
    case QUESTION_STATUSES.IN_FOCUS.STATUS_ID:
      return QUESTION_STATUSES.IN_FOCUS.COLOR;
    case QUESTION_STATUSES.WITH_COMMENT.STATUS_ID:
      return QUESTION_STATUSES.WITH_COMMENT.COLOR;
    case QUESTION_STATUSES.ANSWERED.STATUS_ID:
      return QUESTION_STATUSES.ANSWERED.COLOR;
    default:
      return QUESTION_STATUSES.ANSWERED.COLOR;
  }
});

function sliceText(text: string) {
  const maxTextLength = 300;

  if (text.length < maxTextLength) {
    return text;
  }

  return `${text.slice(0, maxTextLength)}... <b class="question-card-more">подробнее</b>`;
}

function replaceCounter(value: number) {
  return value > 999 ? '999+' : value;
}

function navigateToQuestion() {
  router.push(`/question/${question.id}`);
}

async function handleLike() {
  try {
    const result = await LikeQuestion(question.id);
    localLikes.value = result.likes;
    localDislikes.value = result.dislikes;
    localUserVote.value = result.userVote;
  } catch {
    // Error handled at API level
  }
}

async function handleDislike() {
  try {
    const result = await DislikeQuestion(question.id);
    localLikes.value = result.likes;
    localDislikes.value = result.dislikes;
    localUserVote.value = result.userVote;
  } catch {
    // Error handled at API level
  }
}
</script>

<style lang="scss">
.question-card-more {
  color: variables.$links-color;
}
</style>
```

---

## Task 19: entities/question — QuestionsView

**Files:**
- Modify: `src/entities/question/ui/QuestionsView.vue`

- [ ] **Step 1: Переписать QuestionsView.vue**

Заменить: v-container/v-row/v-col → PrimeFlex, v-text-field → InputText, v-tabs/v-tab → TabView/TabPanel, v-pagination → Paginator, useDisplay → CSS.

```vue
<template>
  <div style="max-width: 1000px" class="mx-auto">
    <div class="my-8">
      <h1 class="typography__headline--large typography__display--small--sm text-center">
        Все вопросы
      </h1>
    </div>

    <div class="mb-8 flex justify-content-center">
      <div class="col-12 md:col-8">
        <IconField>
          <InputIcon class="pi pi-search"></InputIcon>
          <InputText
            v-model="searchQuery"
            placeholder="Поиск"
            class="w-full" />
        </IconField>
      </div>
    </div>

    <div class="mb-3">
      <div class="mb-4">
        <TabView v-model:activeIndex="activeTabIndex">
          <TabPanel header="Новые">
            <template #header>
              <i class="pi pi-box mr-2"></i>
              <span>Новые</span>
            </template>
          </TabPanel>
          <TabPanel header="В фокусе">
            <template #header>
              <i class="pi pi-question-circle mr-2"></i>
              <span>В фокусе</span>
            </template>
          </TabPanel>
          <TabPanel header="С комментарием">
            <template #header>
              <i class="pi pi-comment mr-2"></i>
              <span>С комментарием</span>
            </template>
          </TabPanel>
          <TabPanel header="Отвеченные">
            <template #header>
              <i class="pi pi-megaphone mr-2"></i>
              <span>Отвеченные</span>
            </template>
          </TabPanel>
        </TabView>
      </div>
    </div>

    <div class="mb-3">
      <QuestionFilters @change="onFiltersChange" />
    </div>

    <template v-if="questions.length > 0">
      <div class="mb-5">
        <QuestionCard
          v-for="question in questions"
          :key="question.id"
          :question="question" />
      </div>

      <div class="mb-5">
        <Paginator
          :rows="pageSize"
          :total-records="totalCount"
          :rows-per-page-options="[10]"
          @page="onPageChange" />
      </div>
    </template>

    <template v-else-if="!isLoading">
      <div class="my-6">
        <p style="margin: 0; color: grey; font-size: 22px; text-align: center">
          Вопросы отсутствуют
        </p>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

import InputText from 'primevue/inputtext';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Paginator from 'primevue/paginator';

import type { QuestionResponse } from '@/shared/types';

import { QuestionStatusId } from '@/shared/types';
import { ALERT_TYPES } from '@/shared/config';
import { useAlertStore } from '@/entities/alert';
import { GetAll, type QuestionListParams } from '../api/questions-repository';

import QuestionFilters from './QuestionFilters.vue';
import QuestionCard from './QuestionCard.vue';

defineOptions({ name: 'QuestionsView' });

const alertStore = useAlertStore();

const questions = ref<QuestionResponse[]>([]);
const isLoading = ref(false);
const totalCount = ref(0);
const currentPage = ref(1);
const pageSize = 10;
const searchQuery = ref('');
const activeTabIndex = ref(0);
const filterSortOrder = ref<'asc' | 'desc'>('desc');
const filterSpeakerId = ref<string | undefined>(undefined);
const filterAreaId = ref<string | undefined>(undefined);

const statusMap: Record<number, QuestionStatusId> = {
  0: QuestionStatusId.New,
  1: QuestionStatusId.InFocus,
  2: QuestionStatusId.WithComment,
  3: QuestionStatusId.Answered,
};

const totalPages = computed(() => Math.ceil(totalCount.value / pageSize));

const params = computed<QuestionListParams>(() => ({
  page: currentPage.value,
  pageSize,
  status: statusMap[activeTabIndex.value],
  speakerId: filterSpeakerId.value,
  areaId: filterAreaId.value,
  search: searchQuery.value || undefined,
  sortOrder: filterSortOrder.value,
}));

let searchTimeout: ReturnType<typeof setTimeout> | undefined;

watch(searchQuery, () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    currentPage.value = 1;
    fetchData();
  }, 300);
});

watch(activeTabIndex, () => {
  currentPage.value = 1;
  fetchData();
});

function onPageChange(event: { page: number }) {
  currentPage.value = event.page + 1;
  fetchData();
}

function onFiltersChange(filters: {
  speakerId?: string;
  areaId?: string;
  sortOrder: 'asc' | 'desc';
}) {
  filterSpeakerId.value = filters.speakerId;
  filterAreaId.value = filters.areaId;
  filterSortOrder.value = filters.sortOrder;
  currentPage.value = 1;
  fetchData();
}

async function fetchData() {
  isLoading.value = true;
  try {
    const result = await GetAll(params.value);
    questions.value = result.items;
    totalCount.value = result.totalCount;
  } catch (error) {
    const err = error as Error;
    alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: err.message });
  } finally {
    isLoading.value = false;
  }
}

fetchData();
</script>
```

---

## Task 20: entities/question — QuestionIdView

**Files:**
- Modify: `src/entities/question/ui/QuestionIdView.vue`

- [ ] **Step 1: Переписать QuestionIdView.vue**

Заменить: v-container/v-row/v-col → PrimeFlex, v-sheet → div, v-btn → Button, v-icon → pi, v-progress-circular → ProgressSpinner.

```vue
<template>
  <div style="max-width: 1000px" class="mx-auto">
    <template v-if="question">
      <div class="my-8">
        <h1 class="typography__headline--large typography__display--small--sm text-center">
          Вопрос
        </h1>
      </div>

      <div class="flex justify-content-center">
        <div
          style="background-color: #2b2b2b; width: 100%"
          class="py-5 px-2 md:px-5 flex align-items-center">
          <div style="width: 8%">
            <Button
              severity="secondary"
              outlined
              style="color: white"
              icon="pi pi-arrow-left"
              @click="goBack" />
          </div>
          <div style="width: 92%">
            <p style="margin: 0; color: white; text-align: center">
              {{ authorDisplay }}, {{ question.areaTitle || '' }},
              {{ formattedDate }}
              <br />
              кому: {{ question.speakerName }}
            </p>
          </div>
        </div>
      </div>

      <div>
        <div
          class="p-5 md:p-8 flex flex-column justify-content-center"
          style="background-color: #E8EAF6; min-height: 250px; width: 100%">
          <div>
            <div class="mb-6 flex">
              <div
                :style="{ backgroundColor: color }"
                style="width: 7px"></div>
              <div
                style="background-color: white; width: 100%"
                class="p-3">
                <p
                  style="color: grey"
                  class="typography__body--medium typography__body--large--sm m-0"
                  v-html="question.text"></p>
              </div>
            </div>
            <div class="flex align-items-center">
              <div class="align-self-center">
                <i
                  class="pi pi-eye mr-2"
                  title="Количество просмотров"
                  style="font-size: 20px"></i>
                <span class="typography__body--small typography__body--medium--sm">
                  {{ replaceCounter(question.views) }}
                </span>
              </div>
              <div class="flex justify-content-end align-items-center w-full">
                <Button
                  severity="info"
                  outlined
                  class="mr-1"
                  @click="handleLike">
                  <i
                    class="pi mr-2"
                    :class="question.userVote === 'Like' ? 'pi-thumbs-up' : 'pi-thumbs-up'"
                    title="Понравился"
                    style="font-size: 20px"></i>
                  <span class="typography__body--small typography__body--medium--sm mr-1">
                    {{ replaceCounter(question.likes) }}
                  </span>
                </Button>
                <Button
                  severity="danger"
                  outlined
                  class="mr-1"
                  @click="handleDislike">
                  <i
                    class="pi mr-2"
                    :class="question.userVote === 'Dislike' ? 'pi-thumbs-down' : 'pi-thumbs-down'"
                    title="Не понравился"
                    style="font-size: 20px"></i>
                  <span class="typography__body--small typography__body--medium--sm">
                    {{ replaceCounter(question.dislikes) }}
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template v-else-if="isLoading">
      <div class="my-8 text-center">
        <ProgressSpinner style="width: 64px; height: 64px" />
      </div>
    </template>

    <template v-else>
      <div class="my-8">
        <p style="color: grey; font-size: 22px; text-align: center">
          Вопрос не найден
        </p>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';

import type { QuestionResponse } from '@/shared/types';

import {
  GetById,
  LikeQuestion,
  DislikeQuestion,
} from '../api/questions-repository';
import QUESTION_STATUSES from '../config/question-statuses';

defineOptions({ name: 'QuestionIdView' });

const route = useRoute();
const router = useRouter();

const question = ref<QuestionResponse | null>(null);
const isLoading = ref(true);

const color = computed(() => {
  if (!question.value) return QUESTION_STATUSES.ANSWERED.COLOR;

  switch (question.value.status) {
    case QUESTION_STATUSES.NEW.STATUS_ID:
      return QUESTION_STATUSES.NEW.COLOR;
    case QUESTION_STATUSES.IN_FOCUS.STATUS_ID:
      return QUESTION_STATUSES.IN_FOCUS.COLOR;
    case QUESTION_STATUSES.WITH_COMMENT.STATUS_ID:
      return QUESTION_STATUSES.WITH_COMMENT.COLOR;
    case QUESTION_STATUSES.ANSWERED.STATUS_ID:
      return QUESTION_STATUSES.ANSWERED.COLOR;
    default:
      return QUESTION_STATUSES.ANSWERED.COLOR;
  }
});

const authorDisplay = computed(() => question.value?.author || 'Инкогнито');

const formattedDate = computed(() => {
  if (!question.value) return '';
  return new Date(question.value.created).toLocaleDateString('ru-RU');
});

function replaceCounter(value: number) {
  return value > 999 ? '999+' : value;
}

function goBack() {
  router.back();
}

async function fetchQuestion() {
  isLoading.value = true;
  try {
    const id = route.params.id as string;
    question.value = await GetById(id);
  } catch {
    question.value = null;
  } finally {
    isLoading.value = false;
  }
}

async function handleLike() {
  if (!question.value) return;

  try {
    const result = await LikeQuestion(question.value.id);
    question.value.likes = result.likes;
    question.value.dislikes = result.dislikes;
    question.value.userVote = result.userVote;
  } catch {
    // Error handled at API level
  }
}

async function handleDislike() {
  if (!question.value) return;

  try {
    const result = await DislikeQuestion(question.value.id);
    question.value.likes = result.likes;
    question.value.dislikes = result.dislikes;
    question.value.userVote = result.userVote;
  } catch {
    // Error handled at API level
  }
}

onMounted(() => {
  fetchQuestion();
});
</script>
```

---

## Task 21–30: entities (FAQ, Area, User) + features + pages + app

Оставшиеся задачи следуют тем же паттернам замены, описанным выше. Из-за объёма они представлены в сжатой форме — исполнитель применяет общие паттерны к каждому файлу.

### Task 21: entities/faq — FAQView, EntryCard, CategoryCard, CRUD-компоненты

**Files:**
- Modify: все .vue файлы в `src/entities/faq/ui/`

Паттерны:
- `v-expansion-panels` → `Accordion` + `AccordionPanel`
- `v-card` → `Card`, `v-btn` → `Button`, `v-icon` → `pi`
- `v-form` + VeeValidate → `Form` (PrimeVue) + `FormField` + Zod
- `v-text-field` → `InputText`, `v-textarea` → `Textarea`, `v-select` → `Select`

### Task 22: entities/area — AreaCard, CreateArea, UpdateArea, DeleteArea

**Files:**
- Modify: все .vue файлы в `src/entities/area/ui/`

### Task 23: entities/user — SpeakerCard, UserProfile, CreateSpeaker, UpdateSpeaker, DeleteSpeaker

**Files:**
- Modify: все .vue файлы в `src/entities/user/ui/`

### Task 24: features/auth — LoginView

**Files:**
- Modify: `src/features/auth/ui/LoginView.vue`

Заменить: VeeValidate форму → PrimeVue Form + Zod, v-text-field → InputText (для пароля — Password), v-btn → Button.

### Task 25: features/feedback — SidebarFeedbackContent, FeedbackCard, DeleteFeedbackModal

**Files:**
- Modify: все .vue файлы в `src/features/feedback/ui/`

Адаптировать SidebarFeedbackContent к Drawer (убрать provide/inject close, использовать пропсы/emit).

### Task 26: features/preloader — AppPreloader

**Files:**
- Modify: `src/features/preloader/ui/AppPreloader.vue`

Заменить: v-overlay → кастомный overlay div, v-progress-circular → ProgressSpinner.

### Task 27: pages — MainPage, NotFoundPage, admin-страницы

**Files:**
- Modify: все .vue файлы в `src/pages/`

Паттерны:
- `useGoTo` → `document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' })`
- `v-data-table` → `DataTable`
- `CenterModal` → `Dialog` (импорт)
- `SidebarModal` → `Drawer` (импорт)
- `vuedraggable` — оставить без изменений (не зависит от Vuetify)

### Task 28: widgets/dashboard — все компоненты дашборда

**Files:**
- Modify: все .vue файлы в `src/widgets/dashboard/`

Заменить: v-card → Card, v-btn → Button, v-icon → pi, утилити-классы → PrimeFlex, chart.js/vue-chartjs — без изменений.

### Task 29: app — Layouts + App.vue

**Files:**
- Modify: `src/app/entrypoint/App.vue`
- Modify: `src/app/layouts/DefaultLayout.vue`
- Modify: `src/app/layouts/AdminLayout.vue`
- Modify: `src/app/layouts/EmptyLayout.vue`

Паттерны:
- `v-app` → `<div>` (App.vue)
- `v-main` → `<div>` (EmptyLayout)
- `v-app-bar` → `Toolbar`
- `v-navigation-drawer` → `Drawer` (постоянный в AdminLayout, temporary в DefaultLayout)
- `v-footer` → кастомный footer div
- `v-tooltip` → `v-tooltip` (директива PrimeVue)
- `v-menu` → `Menu` (overlay)
- Иконки навигации: `mdi-*` → `pi pi-*`

### Task 30: Финальная очистка

**Files:**
- Delete: `src/app/lib/vuetify.ts`
- Delete: `src/app/lib/vee-validate.ts`
- Modify: `src/app/lib/index.ts`
- Modify: `src/app/lib/global-components.ts`
- Modify: `package.json`
- Modify: `eslint.config.ts`

- [ ] **Step 1: Удалить vuetify.ts и vee-validate.ts**

- [ ] **Step 2: Обновить index.ts — убрать vuetify и veeValidate**

```ts
import type { App } from 'vue';

import router from '@/app/router';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';

import theme from './primevue-theme';
import setupHttpClientInterceptors from './http-client-interceptors';

export default function registerPlugins(app: App) {
  const pinia = createPinia();

  app
    .use(router)
    .use(pinia)
    .use(PrimeVue, { theme });

  setupHttpClientInterceptors();
}
```

- [ ] **Step 3: Очистить global-components.ts**

```ts
import type { App } from 'vue';

export default function registerGlobalComponents(_app: App) {
  // Global components removed — all imported locally
}
```

- [ ] **Step 4: Удалить зависимости из package.json**

```bash
cd ask-question-frontend && npm uninstall vuetify @mdi/font vite-plugin-vuetify eslint-plugin-vuetify vee-validate @vee-validate/rules
```

- [ ] **Step 5: Обновить eslint.config.ts — убрать pluginVuetify**

Убрать:
- `import pluginVuetify from 'eslint-plugin-vuetify';`
- `...pluginVuetify.configs['flat/recommended-v4'],`

- [ ] **Step 6: Запустить полный lint**

```bash
cd ask-question-frontend && npm run lint
```

- [ ] **Step 7: Запустить typecheck**

```bash
cd ask-question-frontend && npm run typecheck
```

- [ ] **Step 8: Запустить тесты**

```bash
cd ask-question-frontend && npm run test
```

- [ ] **Step 9: Запустить FSD-валидацию**

```bash
cd ask-question-frontend && npm run fsd:check
```

- [ ] **Step 10: Запустить dev-сервер и проверить визуально**

```bash
cd ask-question-frontend && npm run dev
```

Expected: приложение работает полностью на PrimeVue, Vuetify отсутствует в бандле.
