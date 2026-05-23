# Миграция к FSD v2.1 — План реализации

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Привести структуру `src/` в соответствие со стандартом FSD v2.1: заменить нестандартный слой `modules/` на стандартные `entities/` + `features/`, раздробить god-slice `admin`, добавить public API, устранить кросс-импорты и импорты в обход public API.

**Architecture:** Миграция выполняется послойно, по одному слайсу за раз. Каждый шаг заканчивается рабочим состоянием приложения (lint + steiger проходят). Порядок выбран так, чтобы минимизировать количество файлов, которые нужно править одновременно.

**Tech Stack:** Vue 3 + Vuetify 3 + Vuex 4 + Vue Router 4 + VeeValidate + Axios. Options API, без TypeScript. SCSS с автоинжекцией переменных. Тестов нет — верификация через `npm run lint` и `npm run fsd:check`.

**Steiger:** В данный момент `npm run fsd:check` падает (`steiger` не в PATH). Используем `npx steiger ./src` для проверки. После каждого этапа — запускать `npx steiger ./src` и `npm run lint`.

---

## Итоговая целевая структура

```text
src/
  app/           — без изменений (entrypoint, layouts, lib, router, store, styles)
  entities/      — НОВЫЙ слой
    alert/         — store + ui + config/alert-types
    faq/           — api (faq-category-repository, faq-entry-repository) + ui (FAQView)
    question/      — api (questions-repository) + config (question-statuses) + ui (QuestionCard, QuestionStatusIcon, QuestionFilters)
    user/          — api (user-repository) + ui (UserProfile)
    area/          — api (areas-repository) ← из modules/shared
  features/      — НОВЫЙ слой
    auth/          — api (auth-repository) + store + ui (LoginView)
    feedback/      — api (feedback-repository) + ui (SidebarFeedbackContent)
    preloader/     — store + ui (AppPreloader)
  pages/         — расширение
    main/          — MainPage (уже есть)
    errors/        — NotFoundPage (уже есть)
    questions/     — QuestionsView, QuestionIdView
    faq/           — FAQView → композитная страница
    admin/         — НОВЫЙ слайс-группа с подслайсами
      main/          — AdminMainView
      questions/    — AdminQuestionsView
      faq/          — AdminFAQView + AdminFAQCategoryView + виджеты FAQ
      speakers/     — AdminSpeakersView
      areas/        — AdminAreasView + виджеты Area
      feedback/     — AdminFeedbackView + виджеты Feedback
  shared/        — расширение
    api/           — http-client, index (без бизнес-логики 401)
    assets/        — + index.js (public API)
    config/        — НОВЫЙ сегмент: alert-types
    lib/           — html-sanitize, copy-to-clipboard, pseudorandom-generator
    routes/        — без изменений
    ui/            — без изменений
```

---

## Фаза 1: Быстрые исправления (не затрагивают структуру слоёв)

### Task 1: Добавить public API в `shared/assets`

**Files:**
- Create: `src/shared/assets/index.js`

- [ ] **Step 1: Создать `src/shared/assets/index.js`**

```js
import logo from './logo.svg';

export { logo };
```

Примечание: шрифты, изображения и видео в Vite импортируются через `new URL()`, а не через `import`, поэтому в public API достаточно экспортировать только SVG-файл, который может понадобиться другим компонентам напрямую. Файлы, используемые через `new URL('@/shared/assets/...', import.meta.url)`, не нуждаются в реэкспорте.

- [ ] **Step 2: Запустить steiger**

```bash
npx steiger ./src
```

Ожидание: ошибка `shared/assets` должна исчезнуть.

- [ ] **Step 3: Запустить lint**

```bash
npm run lint
```

Ожидание: без ошибок.

- [ ] **Step 4: Коммит**

```bash
git add src/shared/assets/index.js
git commit -m "feat(shared): add public API for assets segment"
```

---

### Task 2: Переместить `ALERT_TYPES` в `shared/config/`

ALERT_TYPES — константа без бизнес-логики, используется в 21 файле из 8 разных слайсов. Это инфраструктурная константа, не привязанная к домену alert.

**Files:**
- Create: `src/shared/config/alert-types.js`
- Create: `src/shared/config/index.js`
- Modify: все 21 файл, импортирующий `ALERT_TYPES` (заменить путь импорта)
- Delete: `src/modules/alert/constants/alert-types.js`

- [ ] **Step 1: Создать `src/shared/config/alert-types.js`**

```js
export default {
  SUCCESS: 'success',
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
};
```

- [ ] **Step 2: Создать `src/shared/config/index.js`**

```js
export { default as ALERT_TYPES } from './alert-types';
```

- [ ] **Step 3: Обновить все импорты ALERT_TYPES**

Заменить во всех файлах:
```
@/modules/alert/constants/alert-types  →  @/shared/config
```

Полный список файлов для обновления (ищи по grep `alert/constants/alert-types`):

1. `src/app/router/middleware/auth-middleware.js`
2. `src/app/layouts/AdminLayout.vue`
3. `src/modules/admin/ui/views/AdminFAQView.vue`
4. `src/modules/admin/ui/views/AdminFAQCategoryView.vue`
5. `src/modules/admin/ui/views/AdminAreasView.vue`
6. `src/modules/admin/ui/views/AdminFeedbackView.vue`
7. `src/modules/admin/ui/views/AdminQuestionsView.vue`
8. `src/modules/admin/ui/components/FAQ/center-modal-content/CreateCategory.vue`
9. `src/modules/admin/ui/components/FAQ/center-modal-content/DeleteCategory.vue`
10. `src/modules/admin/ui/components/FAQ/center-modal-content/UpdateCategory.vue`
11. `src/modules/admin/ui/components/FAQ/sidebar-content/CreateEntryContent.vue`
12. `src/modules/admin/ui/components/FAQ/sidebar-content/UpdateEntryContent.vue`
13. `src/modules/admin/ui/components/area/center-modal-content/CreateArea.vue`
14. `src/modules/admin/ui/components/area/center-modal-content/DeleteArea.vue`
15. `src/modules/admin/ui/components/area/center-modal-content/UpdateArea.vue`
16. `src/modules/admin/ui/components/feedback/center-modal-content/DeleteFeedback.vue`
17. `src/modules/question/ui/views/QuestionsView.vue`
18. `src/modules/question/ui/components/QuestionFormCreate.vue`
19. `src/modules/faq/ui/views/FAQView.vue`
20. `src/modules/feedback/ui/components/sidebar-content/SidebarFeedbackContent.vue`
21. `src/modules/auth/ui/views/LoginView.vue`
22. `src/modules/user/ui/components/center-modal-content/UserProfile.vue`
23. `src/pages/main/ui/MainPage.vue`

В каждом файле заменить строку импорта:

```js
// Было:
import ALERT_TYPES from '@/modules/alert/constants/alert-types';

// Стало:
import { ALERT_TYPES } from '@/shared/config';
```

- [ ] **Step 4: Удалить `src/modules/alert/constants/alert-types.js`**

```bash
rm src/modules/alert/constants/alert-types.js
```

- [ ] **Step 5: Если директория `src/modules/alert/constants/` пуста — удалить её**

```bash
rmdir src/modules/alert/constants
```

- [ ] **Step 6: Запустить lint + steiger**

```bash
npm run lint && npx steiger ./src
```

Ожидание: без ошибок.

- [ ] **Step 7: Коммит**

```bash
git add -A
git commit -m "refactor(shared): move ALERT_TYPES to shared/config"
```

---

### Task 3: Переместить `copy-to-clipboard` в `shared/lib/`

Утилита общего назначения, не привязанная к домену admin.

**Files:**
- Move: `src/modules/admin/helpers/copy-to-clipboard.js` → `src/shared/lib/copy-to-clipboard.js`
- Modify: `src/shared/lib/index.js` (создать)
- Modify: `src/modules/admin/ui/views/AdminFAQCategoryView.vue` (обновить импорт)
- Delete: `src/modules/admin/helpers/` (если пусто)

- [ ] **Step 1: Создать `src/shared/lib/copy-to-clipboard.js`**

Содержимое — копия `src/modules/admin/helpers/copy-to-clipboard.js`:

```js
export default function copyToClipboard(textToCopy) {
  if (window.isSecureContext && navigator.clipboard) {
    return navigator.clipboard.writeText(textToCopy);
  }

  return new Promise((resolve, reject) => {
    const textArea = document.createElement('textarea');
    textArea.value = textToCopy;

    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';

    document.body.appendChild(textArea);

    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      resolve();
    } catch {
      reject();
    }
  });
}
```

- [ ] **Step 2: Создать `src/shared/lib/index.js`**

```js
export { default as copyToClipboard } from './copy-to-clipboard';
export { default as sanitizeHtml } from './html-sanitize';
```

- [ ] **Step 3: Обновить импорт в `AdminFAQCategoryView.vue`**

```js
// Было:
import copyToClipboard from '../../helpers/copy-to-clipboard';

// Стало:
import copyToClipboard from '@/shared/lib/copy-to-clipboard';
```

- [ ] **Step 4: Удалить `src/modules/admin/helpers/copy-to-clipboard.js` и папку `helpers/`**

```bash
rm src/modules/admin/helpers/copy-to-clipboard.js
rmdir src/modules/admin/helpers
```

- [ ] **Step 5: Запустить lint + steiger**

```bash
npm run lint && npx steiger ./src
```

- [ ] **Step 6: Коммит**

```bash
git add -A
git commit -m "refactor(shared): move copy-to-clipboard to shared/lib"
```

---

### Task 4: Переименовать сегменты `helpers/` → `lib/`

FSD v2.1 рекомендует `lib/` вместо `helpers/`. Остаётся только `modules/alert/helpers/pseudorandom-generator.js`.

**Files:**
- Move: `src/modules/alert/helpers/pseudorandom-generator.js` → `src/modules/alert/lib/pseudorandom-generator.js`
- Modify: `src/modules/alert/store/index.js` (обновить импорт)
- Delete: `src/modules/alert/helpers/`

- [ ] **Step 1: Создать директорию `src/modules/alert/lib/`**

```bash
mkdir src/modules/alert/lib
```

- [ ] **Step 2: Переместить файл**

```bash
mv src/modules/alert/helpers/pseudorandom-generator.js src/modules/alert/lib/pseudorandom-generator.js
```

- [ ] **Step 3: Обновить импорт в `src/modules/alert/store/index.js`**

```js
// Было:
import generateId from '../helpers/pseudorandom-generator';

// Стало:
import generateId from '../lib/pseudorandom-generator';
```

- [ ] **Step 4: Удалить пустую директорию**

```bash
rmdir src/modules/alert/helpers
```

- [ ] **Step 5: Запустить lint + steiger**

```bash
npm run lint && npx steiger ./src
```

- [ ] **Step 6: Коммит**

```bash
git add -A
git commit -m "refactor(alert): rename helpers segment to lib"
```

---

### Task 5: Убрать бизнес-логику из `shared/api/http-client.js`

Обработка 401 (редирект на `/login`) — это доменное поведение auth, а не инфраструктура. Нужно вынести перехватчик в `app/` или в `features/auth/`. Поскольку features/auth ещё не создан, размещаем в `app/lib/`.

**Files:**
- Modify: `src/shared/api/http-client.js` (убрать response interceptor с 401-логикой)
- Create: `src/app/lib/http-client-interceptors.js` (перехватчик 401)
- Modify: `src/app/lib/index.js` (подключить перехватчики при инициализации)

- [ ] **Step 1: Упростить `src/shared/api/http-client.js`**

```js
import axios from 'axios';

const httpClient = axios.create({
  baseURL: import.meta.env.BASE_URL,
  withCredentials: true,
});

httpClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
);

httpClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);

export default httpClient;
```

- [ ] **Step 2: Создать `src/app/lib/http-client-interceptors.js`**

```js
import httpClient from '@/shared/api';

export default function setupHttpClientInterceptors() {
  httpClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        window.location.href = '/login';
      }

      return Promise.reject(error);
    },
  );
}
```

- [ ] **Step 3: Обновить `src/app/lib/index.js` — подключить перехватчики**

```js
import router from '@/app/router';
import store from '@/app/store/store';

import vuetify from './vuetify';
import veeValidate from './vee-validate';
import setupHttpClientInterceptors from './http-client-interceptors';

export default function registerPlugins(app) {
  app.use(router).use(store).use(vuetify).use(veeValidate);

  setupHttpClientInterceptors();
}
```

- [ ] **Step 4: Запустить lint + steiger**

```bash
npm run lint && npx steiger ./src
```

- [ ] **Step 5: Коммит**

```bash
git add -A
git commit -m "refactor(app): extract 401 interceptor from shared to app"
```

---

## Фаза 2: Создание стандартных слоёв и миграция слайсов

Порядок миграции: от нижних слоёв к верхним (entities → features), чтобы каждый следующий слой мог импортировать из уже готовых нижних.

### Task 6: Создать слой `entities/` и мигрировать `modules/alert`

`modules/alert` → `entities/alert`. Alert — доменная модель (сущность с store + UI + константы), используемая по всему приложению.

**Files:**
- Create: `src/entities/alert/` (структура: lib/, store/, ui/)
- Create: `src/entities/alert/index.js` (public API)
- Move: `src/modules/alert/lib/pseudorandom-generator.js` → `src/entities/alert/lib/pseudorandom-generator.js`
- Move: `src/modules/alert/store/index.js` → `src/entities/alert/store/index.js`
- Move: `src/modules/alert/ui/components/AppAlert.vue` → `src/entities/alert/ui/AppAlert.vue`
- Move: `src/modules/alert/ui/components/AppAlertItem.vue` → `src/entities/alert/ui/AppAlertItem.vue`
- Move: `src/modules/alert/ui/components/icons/*.vue` → `src/entities/alert/ui/icons/*.vue`
- Modify: все файлы, импортирующие из `@/modules/alert/`
- Delete: `src/modules/alert/` (после миграции)

- [ ] **Step 1: Создать директории `src/entities/alert/`**

```bash
mkdir -p src/entities/alert/lib
mkdir -p src/entities/alert/store
mkdir -p src/entities/alert/ui/icons
```

- [ ] **Step 2: Переместить файлы**

```bash
mv src/modules/alert/lib/pseudorandom-generator.js src/entities/alert/lib/pseudorandom-generator.js
mv src/modules/alert/store/index.js src/entities/alert/store/index.js
mv src/modules/alert/ui/components/AppAlert.vue src/entities/alert/ui/AppAlert.vue
mv src/modules/alert/ui/components/AppAlertItem.vue src/entities/alert/ui/AppAlertItem.vue
mv src/modules/alert/ui/components/icons/* src/entities/alert/ui/icons/
```

- [ ] **Step 3: Создать public API `src/entities/alert/index.js`**

```js
export { default as AppAlert } from './ui/AppAlert.vue';
```

Примечание: store и lib — внутренние детали слайса, не экспортируются. Доступ к Vuex-модулю alert осуществляется через `store.commit('alert/...')` / `store.getters['alert/...']` без прямого импорта.

- [ ] **Step 4: Обновить импорт в `src/entities/alert/ui/AppAlert.vue`**

Внутренний импорт `AppAlertItem` — обновить относительный путь:

```js
// Было:
import AppAlertItem from './AppAlertItem.vue';

// Стало (относительный путь внутри слайса допустим):
import AppAlertItem from './AppAlertItem.vue';
```

Путь не изменился, т.к. файлы лежат рядом. Но иконки переехали:

```js
// Было:
import SuccessIcon from './icons/SuccessIcon.vue';

// Стало:
import SuccessIcon from './icons/SuccessIcon.vue';
```

Тоже не изменилось. OK.

- [ ] **Step 5: Обновить импорт в `src/entities/alert/store/index.js`**

```js
// Было:
import generateId from '../helpers/pseudorandom-generator';

// Стало:
import generateId from '../lib/pseudorandom-generator';
```

(Уже исправлено в Task 4, но после перемещения нужно убедиться.)

- [ ] **Step 6: Обновить внешние импорты**

Заменить во всех файлах:
```
@/modules/alert/ui/components/AppAlert.vue  →  @/entities/alert
@/modules/alert/store  →  (не нужен — доступ через Vuex)
```

Единственный внешний потребитель `AppAlert.vue` — `src/app/entrypoint/App.vue`:

```js
// Было:
import AppAlert from '@/modules/alert/ui/components/AppAlert.vue';

// Стало:
import { AppAlert } from '@/entities/alert';
```

- [ ] **Step 7: Удалить `src/modules/alert/`**

```bash
rm -rf src/modules/alert
```

- [ ] **Step 8: Запустить lint + steiger**

```bash
npm run lint && npx steiger ./src
```

- [ ] **Step 9: Коммит**

```bash
git add -A
git commit -m "refactor(entities): migrate alert from modules to entities layer"
```

---

### Task 7: Мигрировать `modules/faq` → `entities/faq`

FAQ — доменная модель (категории + записи), используемая и в публичной части, и в админке.

**Files:**
- Create: `src/entities/faq/` (api/, ui/)
- Create: `src/entities/faq/index.js`
- Move: repositories → api/
- Move: FAQView → ui/
- Modify: все файлы, импортирующие из `@/modules/faq/`
- Delete: `src/modules/faq/`

- [ ] **Step 1: Создать директории**

```bash
mkdir -p src/entities/faq/api
mkdir -p src/entities/faq/ui
```

- [ ] **Step 2: Переместить файлы**

```bash
mv src/modules/faq/repositories/faq-category-repository.js src/entities/faq/api/faq-category-repository.js
mv src/modules/faq/repositories/faq-entry-repository.js src/entities/faq/api/faq-entry-repository.js
mv src/modules/faq/ui/views/FAQView.vue src/entities/faq/ui/FAQView.vue
```

- [ ] **Step 3: Создать public API `src/entities/faq/index.js`**

```js
export { GetAll as GetAllCategories, GetAllWithEntries, GetById as GetCategoryById, Create as CreateCategory, Update as UpdateCategory, Delete as DeleteCategory, SetOrder as SetCategoryOrder } from './api/faq-category-repository';
export { GetAll as GetAllEntries, GetById as GetEntryById, Create as CreateEntry, Update as UpdateEntry, Delete as DeleteEntry, SetOrder as SetEntryOrder } from './api/faq-entry-repository';
export { default as FAQView } from './ui/FAQView.vue';
```

Примечание: алиасы (`GetAllCategories`, `GetCategoryById` и т.д.) устраняют конфликты имён между двумя репозиториями. Альтернатива — не реэкспортировать API-функции, а дать потребителям импортировать из `@/entities/faq/api/faq-category-repository`. Но это нарушает public API. Лучше использовать алиасы.

- [ ] **Step 4: Обновить внутренние импорты в FAQView.vue**

```js
// Было:
import { GetAllWithEntries } from '../../repositories/faq-category-repository';

// Стало:
import { GetAllWithEntries } from '../api/faq-category-repository';
```

- [ ] **Step 5: Обновить все внешние импорты**

Ищи по grep `@/modules/faq/` и `modules/faq/repositories`.

Файлы-потребители:
1. `src/modules/admin/ui/views/AdminFAQView.vue`
2. `src/modules/admin/ui/views/AdminFAQCategoryView.vue`
3. `src/modules/admin/ui/components/FAQ/center-modal-content/CreateCategory.vue`
4. `src/modules/admin/ui/components/FAQ/center-modal-content/DeleteCategory.vue`
5. `src/modules/admin/ui/components/FAQ/center-modal-content/UpdateCategory.vue`
6. `src/modules/admin/ui/components/FAQ/sidebar-content/CreateEntryContent.vue`
7. `src/modules/admin/ui/components/FAQ/sidebar-content/UpdateEntryContent.vue`
8. `src/app/router/router.js` (FAQView)

Заменить:

```js
// Было:
import { GetAllWithEntries } from '@/modules/faq/repositories/faq-category-repository';
// Стало:
import { GetAllWithEntries } from '@/entities/faq';
```

```js
// Было:
import { GetAll, SetOrder } from '@/modules/faq/repositories/faq-category-repository';
// Стало:
import { GetAllCategories, SetCategoryOrder } from '@/entities/faq';
```

И так далее для каждого потребителя. В router.js:

```js
// Было:
component: () => import('@/modules/faq/ui/views/FAQView.vue'),
// Стало:
component: () => import('@/entities/faq'),
```

Примечание: динамический `import()` не может деструктурировать, поэтому нужно импортировать весь модуль. Но public API — это Named Exports, а для Vue-компонента нужен `default`. Решение: убрать `FAQView` из публичного API (он используется только в router) и оставить динамический импорт напрямую, либо добавить `export default` в index.js.

Лучший вариант — не экспортировать `FAQView` из entities, а в router использовать прямой путь к UI (позже в Фазе 3 router будет импортировать из pages, а не из entities).

Пока что обновляем только пути:

```js
// Было:
component: () => import('@/modules/faq/ui/views/FAQView.vue'),
// Стало (временно, до Фазы 3):
component: () => import('@/entities/faq/ui/FAQView.vue'),
```

- [ ] **Step 6: Удалить `src/modules/faq/`**

```bash
rm -rf src/modules/faq
```

- [ ] **Step 7: Запустить lint + steiger**

```bash
npm run lint && npx steiger ./src
```

- [ ] **Step 8: Коммит**

```bash
git add -A
git commit -m "refactor(entities): migrate faq from modules to entities layer"
```

---

### Task 8: Мигрировать `modules/question` → `entities/question`

Question — доменная модель с repository + константы + UI-компоненты, используемая в публичных страницах и в админке.

**Files:**
- Create: `src/entities/question/` (api/, config/, ui/)
- Create: `src/entities/question/index.js`
- Move: repositories → api/, constants → config/, ui → ui/
- Modify: все файлы-потребители
- Delete: `src/modules/question/`

- [ ] **Step 1: Создать директории**

```bash
mkdir -p src/entities/question/api
mkdir -p src/entities/question/config
mkdir -p src/entities/question/ui
```

- [ ] **Step 2: Переместить файлы**

```bash
mv src/modules/question/repositories/questions-repository.js src/entities/question/api/questions-repository.js
mv src/modules/question/constants/question-statuses.js src/entities/question/config/question-statuses.js
mv src/modules/question/ui/components/QuestionCard.vue src/entities/question/ui/QuestionCard.vue
mv src/modules/question/ui/components/QuestionStatusIcon.vue src/entities/question/ui/QuestionStatusIcon.vue
mv src/modules/question/ui/components/QuestionFilters.vue src/entities/question/ui/QuestionFilters.vue
mv src/modules/question/ui/components/QuestionFormCreate.vue src/entities/question/ui/QuestionFormCreate.vue
mv src/modules/question/ui/views/QuestionsView.vue src/entities/question/ui/QuestionsView.vue
mv src/modules/question/ui/views/QuestionIdView.vue src/entities/question/ui/QuestionIdView.vue
```

- [ ] **Step 3: Создать public API `src/entities/question/index.js`**

```js
export { GetCapctha, GetAll as GetAllQuestions, GetPopularQuestions, GetById as GetQuestionById, Create as CreateQuestion, Update as UpdateQuestion, Delete as DeleteQuestion } from './api/questions-repository';
export { default as QUESTION_STATUSES } from './config/question-statuses';
export { default as QuestionCard } from './ui/QuestionCard.vue';
export { default as QuestionStatusIcon } from './ui/QuestionStatusIcon.vue';
export { default as QuestionFilters } from './ui/QuestionFilters.vue';
export { default as QuestionFormCreate } from './ui/QuestionFormCreate.vue';
export { default as QuestionsView } from './ui/QuestionsView.vue';
export { default as QuestionIdView } from './ui/QuestionIdView.vue';
```

- [ ] **Step 4: Обновить внутренние импорты в компонентах entities/question**

В `QuestionCard.vue`:
```js
// Было:
import QUESTION_STATUSES from '@/modules/question/constants/question-statuses';
import QuestionStatusIcon from '@/modules/question/ui/components/QuestionStatusIcon.vue';
// Стало:
import QUESTION_STATUSES from '../config/question-statuses';
import QuestionStatusIcon from './QuestionStatusIcon.vue';
```

В `QuestionStatusIcon.vue`:
```js
// Было:
import QUESTION_STATUSES from '@/modules/question/constants/question-statuses';
// Стало:
import QUESTION_STATUSES from '../config/question-statuses';
```

В `QuestionFormCreate.vue`:
```js
// Было:
import ALERT_TYPES from '@/modules/alert/constants/alert-types';
import { GetCapctha, Create } from '@/modules/question/repositories/questions-repository';
import { GetAll } from '@/modules/shared/repositories/areas-repository';
// Стало:
import { ALERT_TYPES } from '@/shared/config';
import { GetCapctha, Create } from '../api/questions-repository';
import { GetAll } from '@/entities/area';
```

(Импорт `@/entities/area` — из Task 9, пока ещё не существует. Если Task 9 ещё не выполнен, используй `@/modules/shared/repositories/areas-repository`.)

В `QuestionsView.vue`:
```js
// Было:
import ALERT_TYPES from '@/modules/alert/constants/alert-types';
import { GetAll } from '@/modules/question/repositories/questions-repository';
import QuestionFilters from '@/modules/question/ui/components/QuestionFilters.vue';
import QuestionCard from '@/modules/question/ui/components/QuestionCard.vue';
// Стало:
import { ALERT_TYPES } from '@/shared/config';
import { GetAll } from '../api/questions-repository';
import QuestionFilters from './QuestionFilters.vue';
import QuestionCard from './QuestionCard.vue';
```

В `QuestionIdView.vue`:
```js
// Было:
import QUESTION_STATUSES from '@/modules/question/constants/question-statuses';
// Стало:
import QUESTION_STATUSES from '../config/question-statuses';
```

- [ ] **Step 5: Обновить внешние импорты**

Файлы-потребители:
1. `src/pages/main/ui/MainPage.vue` — `GetPopularQuestions`, `QuestionCard`, `QuestionFormCreate`
2. `src/modules/admin/ui/views/AdminQuestionsView.vue` — `GetAll`
3. `src/app/router/router.js` — `QuestionsView`, `QuestionIdView`

Пример для `MainPage.vue`:
```js
// Было:
import { GetPopularQuestions } from '@/modules/question/repositories/questions-repository';
import QuestionCard from '@/modules/question/ui/components/QuestionCard.vue';
import QuestionFormCreate from '@/modules/question/ui/components/QuestionFormCreate.vue';
import ALERT_TYPES from '@/modules/alert/constants/alert-types';
// Стало:
import { GetPopularQuestions, QuestionCard, QuestionFormCreate } from '@/entities/question';
import { ALERT_TYPES } from '@/shared/config';
```

Для `AdminQuestionsView.vue`:
```js
// Было:
import { GetAll } from '@/modules/question/repositories/questions-repository';
import ALERT_TYPES from '@/modules/alert/constants/alert-types';
// Стало:
import { GetAllQuestions } from '@/entities/question';
import { ALERT_TYPES } from '@/shared/config';
```

(Используем алиас `GetAllQuestions`, т.к. `GetAll` может конфликтовать с другими репозиториями.)

Для `router.js`:
```js
// Было:
component: () => import('@/modules/question/ui/views/QuestionsView.vue'),
component: () => import('@/modules/question/ui/views/QuestionIdView.vue'),
// Стало (временно, до Фазы 3):
component: () => import('@/entities/question/ui/QuestionsView.vue'),
component: () => import('@/entities/question/ui/QuestionIdView.vue'),
```

- [ ] **Step 6: Удалить `src/modules/question/`**

```bash
rm -rf src/modules/question
```

- [ ] **Step 7: Запустить lint + steiger**

```bash
npm run lint && npx steiger ./src
```

- [ ] **Step 8: Коммит**

```bash
git add -A
git commit -m "refactor(entities): migrate question from modules to entities layer"
```

---

### Task 9: Мигрировать `modules/shared` → `entities/area`

`modules/shared/repositories/areas-repository` — это сущность «область», а не shared-код. Переносим в `entities/area`.

**Files:**
- Create: `src/entities/area/` (api/, ui/)
- Create: `src/entities/area/index.js`
- Move: areas-repository → api/
- Move: AreaCard, CreateArea, UpdateArea, DeleteArea → ui/ (из admin/components/area/)
- Modify: все файлы-потребители
- Delete: `src/modules/shared/`

- [ ] **Step 1: Создать директории**

```bash
mkdir -p src/entities/area/api
mkdir -p src/entities/area/ui
```

- [ ] **Step 2: Переместить repository**

```bash
mv src/modules/shared/repositories/areas-repository.js src/entities/area/api/areas-repository.js
```

- [ ] **Step 3: Переместить UI-компоненты Area из admin**

```bash
mv src/modules/admin/ui/components/area/AreaCard.vue src/entities/area/ui/AreaCard.vue
mv src/modules/admin/ui/components/area/center-modal-content/CreateArea.vue src/entities/area/ui/CreateArea.vue
mv src/modules/admin/ui/components/area/center-modal-content/UpdateArea.vue src/entities/area/ui/UpdateArea.vue
mv src/modules/admin/ui/components/area/center-modal-content/DeleteArea.vue src/entities/area/ui/DeleteArea.vue
```

- [ ] **Step 4: Создать public API `src/entities/area/index.js`**

```js
export { GetAll as GetAllAreas, Create as CreateArea, Update as UpdateArea, Delete as DeleteArea, SetOrder as SetAreaOrder } from './api/areas-repository';
export { default as AreaCard } from './ui/AreaCard.vue';
export { default as CreateArea } from './ui/CreateArea.vue';
export { default as UpdateArea } from './ui/UpdateArea.vue';
export { default as DeleteArea } from './ui/DeleteArea.vue';
```

- [ ] **Step 5: Обновить импорты в компонентах Area**

В `CreateArea.vue`, `UpdateArea.vue`, `DeleteArea.vue` — заменить импорты:

```js
// Было:
import { Create } from '@/modules/shared/repositories/areas-repository';
// Стало:
import { Create } from '../api/areas-repository';
```

(Аналогично для Update, Delete — заменить на `../api/areas-repository`.)

- [ ] **Step 6: Обновить внешние импорты**

Файлы-потребители:
1. `src/entities/question/ui/QuestionFormCreate.vue` — `GetAll` из areas-repository
2. `src/modules/admin/ui/views/AdminAreasView.vue` — `GetAll`, `SetOrder` + компоненты Area

Для `QuestionFormCreate.vue` (если уже мигрирован в entities/question):
```js
// Было:
import { GetAll } from '@/modules/shared/repositories/areas-repository';
// Стало:
import { GetAllAreas } from '@/entities/area';
```

И обновить использование:
```js
// Было:
this.areas = await GetAll();
// Стало:
this.areas = await GetAllAreas();
```

Для `AdminAreasView.vue`:
```js
// Было:
import { GetAll, SetOrder } from '@/modules/shared/repositories/areas-repository';
import AreaCard from '../components/area/AreaCard.vue';
import CreateArea from '../components/area/center-modal-content/CreateArea.vue';
import UpdateArea from '../components/area/center-modal-content/UpdateArea.vue';
import DeleteArea from '../components/area/center-modal-content/DeleteArea.vue';
// Стало:
import { GetAllAreas, SetAreaOrder, AreaCard, CreateArea, UpdateArea, DeleteArea } from '@/entities/area';
```

И обновить вызовы:
```js
// Было:
this.areas = await GetAll();
await SetOrder(areaIds);
// Стало:
this.areas = await GetAllAreas();
await SetAreaOrder(areaIds);
```

- [ ] **Step 7: Удалить `src/modules/shared/`**

```bash
rm -rf src/modules/shared
```

- [ ] **Step 8: Удалить пустую директорию `src/modules/admin/ui/components/area/`**

```bash
rm -rf src/modules/admin/ui/components/area
```

- [ ] **Step 9: Запустить lint + steiger**

```bash
npm run lint && npx steiger ./src
```

- [ ] **Step 10: Коммит**

```bash
git add -A
git commit -m "refactor(entities): migrate area from modules/shared to entities/area"
```

---

### Task 10: Мигрировать `modules/user` → `entities/user`

**Files:**
- Create: `src/entities/user/` (api/, ui/)
- Create: `src/entities/user/index.js`
- Move: user-repository → api/, UserProfile → ui/
- Modify: все файлы-потребители
- Delete: `src/modules/user/`

- [ ] **Step 1: Создать директории**

```bash
mkdir -p src/entities/user/api
mkdir -p src/entities/user/ui
```

- [ ] **Step 2: Переместить файлы**

```bash
mv src/modules/user/repositories/user-repository.js src/entities/user/api/user-repository.js
mv src/modules/user/ui/components/center-modal-content/UserProfile.vue src/entities/user/ui/UserProfile.vue
```

- [ ] **Step 3: Создать public API `src/entities/user/index.js`**

```js
export { GetUserData, ChangePassword } from './api/user-repository';
export { default as UserProfile } from './ui/UserProfile.vue';
```

- [ ] **Step 4: Обновить внутренние импорты в UserProfile.vue**

```js
// Было:
import ALERT_TYPES from '@/modules/alert/constants/alert-types';
import { ChangePassword } from '../../../repositories/user-repository';
// Стало:
import { ALERT_TYPES } from '@/shared/config';
import { ChangePassword } from '../api/user-repository';
```

- [ ] **Step 5: Обновить внешние импорты**

Файлы-потребители:
1. `src/app/router/middleware/auth-middleware.js` — `GetUserData`
2. `src/app/layouts/AdminLayout.vue` — `UserProfile`

Для `auth-middleware.js`:
```js
// Было:
import ALERT_TYPES from '@/modules/alert/constants/alert-types';
import { GetUserData } from '@/modules/user/repositories/user-repository';
// Стало:
import { ALERT_TYPES } from '@/shared/config';
import { GetUserData } from '@/entities/user';
```

Для `AdminLayout.vue`:
```js
// Было:
import UserProfile from '@/modules/user/ui/components/center-modal-content/UserProfile.vue';
// Стало:
import { UserProfile } from '@/entities/user';
```

- [ ] **Step 6: Удалить `src/modules/user/`**

```bash
rm -rf src/modules/user
```

- [ ] **Step 7: Запустить lint + steiger**

```bash
npm run lint && npx steiger ./src
```

- [ ] **Step 8: Коммит**

```bash
git add -A
git commit -m "refactor(entities): migrate user from modules to entities layer"
```

---

### Task 11: Создать слой `features/` и мигрировать `modules/auth`

Auth — пользовательское действие (логин/логаут), используемое в нескольких местах.

**Files:**
- Create: `src/features/auth/` (api/, store/, ui/)
- Create: `src/features/auth/index.js`
- Move: auth-repository → api/, store → store/, LoginView → ui/
- Modify: все файлы-потребители
- Delete: `src/modules/auth/`

- [ ] **Step 1: Создать директории**

```bash
mkdir -p src/features/auth/api
mkdir -p src/features/auth/store
mkdir -p src/features/auth/ui
```

- [ ] **Step 2: Переместить файлы**

```bash
mv src/modules/auth/repositories/auth-repository.js src/features/auth/api/auth-repository.js
mv src/modules/auth/store/index.js src/features/auth/store/index.js
mv src/modules/auth/ui/views/LoginView.vue src/features/auth/ui/LoginView.vue
```

- [ ] **Step 3: Создать public API `src/features/auth/index.js`**

```js
export { Login, Logout } from './api/auth-repository';
export { default as LoginView } from './ui/LoginView.vue';
```

- [ ] **Step 4: Обновить внутренние импорты в LoginView.vue**

```js
// Было:
import ALERT_TYPES from '@/modules/alert/constants/alert-types';
import { Login } from '../../repositories/auth-repository';
// Стало:
import { ALERT_TYPES } from '@/shared/config';
import { Login } from '../api/auth-repository';
```

- [ ] **Step 5: Обновить внешние импорты**

Файлы-потребители:
1. `src/app/router/router.js` — `LoginView`
2. `src/app/layouts/AdminLayout.vue` — `Logout`
3. `src/app/router/middleware/auth-middleware.js` — (уже обновлён в Task 10)

Для `router.js`:
```js
// Было:
component: () => import('@/modules/auth/ui/views/LoginView.vue'),
// Стало (временно, до Фазы 3):
component: () => import('@/features/auth/ui/LoginView.vue'),
```

Для `AdminLayout.vue`:
```js
// Было:
import { Logout } from '@/modules/auth/repositories/auth-repository';
// Стало:
import { Logout } from '@/features/auth';
```

- [ ] **Step 6: Обновить Vuex-модуль в `src/app/store/store.js`**

```js
// Было:
import auth from '@/modules/auth/store';
// Стало:
import auth from '@/features/auth/store';
```

- [ ] **Step 7: Удалить `src/modules/auth/`**

```bash
rm -rf src/modules/auth
```

- [ ] **Step 8: Запустить lint + steiger**

```bash
npm run lint && npx steiger ./src
```

- [ ] **Step 9: Коммит**

```bash
git add -A
git commit -m "refactor(features): migrate auth from modules to features layer"
```

---

### Task 12: Мигрировать `modules/feedback` → `features/feedback`

Feedback — пользовательское действие (отправка фидбека), используется в DefaultLayout.

**Files:**
- Create: `src/features/feedback/` (api/, ui/)
- Create: `src/features/feedback/index.js`
- Move: feedback-repository → api/, SidebarFeedbackContent → ui/
- Modify: все файлы-потребители
- Delete: `src/modules/feedback/`

- [ ] **Step 1: Создать директории**

```bash
mkdir -p src/features/feedback/api
mkdir -p src/features/feedback/ui
```

- [ ] **Step 2: Переместить файлы**

```bash
mv src/modules/feedback/repositories/feedback-repository.js src/features/feedback/api/feedback-repository.js
mv src/modules/feedback/ui/components/sidebar-content/SidebarFeedbackContent.vue src/features/feedback/ui/SidebarFeedbackContent.vue
```

- [ ] **Step 3: Создать public API `src/features/feedback/index.js`**

```js
export { GetAll as GetAllFeedback, Create as CreateFeedback, Delete as DeleteFeedback } from './api/feedback-repository';
export { default as SidebarFeedbackContent } from './ui/SidebarFeedbackContent.vue';
```

- [ ] **Step 4: Обновить внутренние импорты в SidebarFeedbackContent.vue**

```js
// Было:
import ALERT_TYPES from '@/modules/alert/constants/alert-types';
import { Create } from '../../../repositories/feedback-repository';
// Стало:
import { ALERT_TYPES } from '@/shared/config';
import { Create } from '../api/feedback-repository';
```

- [ ] **Step 5: Обновить внешние импорты**

Файлы-потребители:
1. `src/app/layouts/DefaultLayout.vue` — `SidebarFeedbackContent`
2. `src/modules/admin/ui/views/AdminFeedbackView.vue` — `GetAll`
3. `src/modules/admin/ui/components/feedback/center-modal-content/DeleteFeedback.vue` — `Delete`

Для `DefaultLayout.vue`:
```js
// Было:
import SidebarFeedbackContent from '@/modules/feedback/ui/components/sidebar-content/SidebarFeedbackContent.vue';
// Стало:
import { SidebarFeedbackContent } from '@/features/feedback';
```

Для `AdminFeedbackView.vue`:
```js
// Было:
import { GetAll } from '@/modules/feedback/repositories/feedback-repository';
// Стало:
import { GetAllFeedback } from '@/features/feedback';
```

И обновить вызов:
```js
// Было:
this.feedbacks = await GetAll();
// Стало:
this.feedbacks = await GetAllFeedback();
```

Для `DeleteFeedback.vue`:
```js
// Было:
import { Delete } from '@/modules/feedback/repositories/feedback-repository';
// Стало:
import { DeleteFeedback } from '@/features/feedback';
```

И обновить вызов:
```js
// Было:
await Delete(this.id);
// Стало:
await DeleteFeedback(this.id);
```

- [ ] **Step 6: Удалить `src/modules/feedback/`**

```bash
rm -rf src/modules/feedback
```

- [ ] **Step 7: Запустить lint + steiger**

```bash
npm run lint && npx steiger ./src
```

- [ ] **Step 8: Коммит**

```bash
git add -A
git commit -m "refactor(features): migrate feedback from modules to features layer"
```

---

### Task 13: Мигрировать `modules/preloader` → `features/preloader`

**Files:**
- Create: `src/features/preloader/` (store/, ui/)
- Create: `src/features/preloader/index.js`
- Move: store → store/, AppPreloader → ui/
- Modify: `src/app/store/store.js`, `src/app/entrypoint/App.vue`
- Delete: `src/modules/preloader/`

- [ ] **Step 1: Создать директории**

```bash
mkdir -p src/features/preloader/store
mkdir -p src/features/preloader/ui
```

- [ ] **Step 2: Переместить файлы**

```bash
mv src/modules/preloader/store/index.js src/features/preloader/store/index.js
mv src/modules/preloader/ui/components/AppPreloader.vue src/features/preloader/ui/AppPreloader.vue
```

- [ ] **Step 3: Создать public API `src/features/preloader/index.js`**

```js
export { default as AppPreloader } from './ui/AppPreloader.vue';
```

- [ ] **Step 4: Обновить Vuex-модуль в `src/app/store/store.js`**

```js
// Было:
import preloader from '@/modules/preloader/store';
// Стало:
import preloader from '@/features/preloader/store';
```

- [ ] **Step 5: Обновить App.vue**

```js
// Было:
import AppPreloader from '@/modules/preloader/ui/components/AppPreloader.vue';
// Стало:
import { AppPreloader } from '@/features/preloader';
```

- [ ] **Step 6: Удалить `src/modules/preloader/`**

```bash
rm -rf src/modules/preloader
```

- [ ] **Step 7: Запустить lint + steiger**

```bash
npm run lint && npx steiger ./src
```

- [ ] **Step 8: Коммит**

```bash
git add -A
git commit -m "refactor(features): migrate preloader from modules to features layer"
```

---

## Фаза 3: Раздробление god-slice `admin` и реорганизация `pages/`

### Task 14: Раздробить `modules/admin` на pages + entities/виджеты

Это самый объёмный шаг. `modules/admin` содержит 5 бизнес-доменов и 7 views. Разбиваем:

- Admin views → `pages/admin-*` (каждый view становится отдельным page-слайсом)
- FAQ-компоненты админки (CategoryCard, EntryCard, CRUD-модалки) → `entities/faq/ui/` (domain UI)
- Feedback-компоненты админки (FeedbackCard, DeleteFeedback) → `entities/feedback/ui/` или `features/feedback/ui/`
- Маршруты → в `app/router/router.js` напрямую

**Целевая структура `pages/admin`:**

```text
pages/
  admin/
    main/           — AdminMainView + index.js
    questions/      — AdminQuestionsView + index.js
    faq/            — AdminFAQView, AdminFAQCategoryView + index.js
    speakers/       — AdminSpeakersView + index.js
    areas/          — AdminAreasView + index.js
    feedback/       — AdminFeedbackView + index.js
```

**Files:**
- Create: `src/pages/admin/` с 6 подслайсами
- Move: admin views → соответствующие pages
- Move: FAQ UI (CategoryCard, EntryCard, CRUD-модалки) → `entities/faq/ui/`
- Move: Feedback UI (FeedbackCard, DeleteFeedback) → `features/feedback/ui/`
- Modify: `src/app/router/router.js` (переместить маршруты из admin/routes)
- Modify: все импорты
- Delete: `src/modules/admin/`

- [ ] **Step 1: Переместить FAQ-компоненты в `entities/faq/ui/`**

```bash
mv src/modules/admin/ui/components/FAQ/CategoryCard.vue src/entities/faq/ui/CategoryCard.vue
mv src/modules/admin/ui/components/FAQ/EntryCard.vue src/entities/faq/ui/EntryCard.vue
mv src/modules/admin/ui/components/FAQ/center-modal-content/CreateCategory.vue src/entities/faq/ui/CreateCategory.vue
mv src/modules/admin/ui/components/FAQ/center-modal-content/DeleteCategory.vue src/entities/faq/ui/DeleteCategory.vue
mv src/modules/admin/ui/components/FAQ/center-modal-content/UpdateCategory.vue src/entities/faq/ui/UpdateCategory.vue
mv src/modules/admin/ui/components/FAQ/sidebar-content/CreateEntryContent.vue src/entities/faq/ui/CreateEntryContent.vue
mv src/modules/admin/ui/components/FAQ/sidebar-content/UpdateEntryContent.vue src/entities/faq/ui/UpdateEntryContent.vue
```

- [ ] **Step 2: Обновить public API `entities/faq/index.js` — добавить UI-компоненты**

Добавить в конец файла:

```js
export { default as CategoryCard } from './ui/CategoryCard.vue';
export { default as EntryCard } from './ui/EntryCard.vue';
export { default as CreateCategory } from './ui/CreateCategory.vue';
export { default as DeleteCategory } from './ui/DeleteCategory.vue';
export { default as UpdateCategory } from './ui/UpdateCategory.vue';
export { default as CreateEntryContent } from './ui/CreateEntryContent.vue';
export { default as UpdateEntryContent } from './ui/UpdateEntryContent.vue';
```

- [ ] **Step 3: Обновить внутренние импорты в компонентах FAQ**

В `CreateEntryContent.vue`:
```js
// Было:
import ALERT_TYPES from '@/modules/alert/constants/alert-types';
import { Create } from '@/modules/faq/repositories/faq-entry-repository';
import RichEditor from '@/shared/ui/rich-editor';
// Стало:
import { ALERT_TYPES } from '@/shared/config';
import { Create } from '../api/faq-entry-repository';
import RichEditor from '@/shared/ui/rich-editor';
```

В `UpdateEntryContent.vue`:
```js
// Было:
import ALERT_TYPES from '@/modules/alert/constants/alert-types';
import { Update } from '@/modules/faq/repositories/faq-entry-repository';
import RichEditor from '@/shared/ui/rich-editor';
// Стало:
import { ALERT_TYPES } from '@/shared/config';
import { Update } from '../api/faq-entry-repository';
import RichEditor from '@/shared/ui/rich-editor';
```

В `CreateCategory.vue`, `DeleteCategory.vue`, `UpdateCategory.vue` — аналогично: заменить `@/modules/faq/repositories/...` на `../api/...` и `ALERT_TYPES` на `@/shared/config`.

- [ ] **Step 4: Переместить Feedback-компоненты в `features/feedback/ui/`**

```bash
mv src/modules/admin/ui/components/feedback/FeedbackCard.vue src/features/feedback/ui/FeedbackCard.vue
mv src/modules/admin/ui/components/feedback/center-modal-content/DeleteFeedback.vue src/features/feedback/ui/DeleteFeedback.vue
```

- [ ] **Step 5: Обновить public API `features/feedback/index.js` — добавить UI-компоненты**

Добавить:

```js
export { default as FeedbackCard } from './ui/FeedbackCard.vue';
export { default as DeleteFeedbackModal } from './ui/DeleteFeedback.vue';
```

- [ ] **Step 6: Обновить внутренние импорты в DeleteFeedback.vue**

```js
// Было:
import ALERT_TYPES from '@/modules/alert/constants/alert-types';
import { Delete } from '@/modules/feedback/repositories/feedback-repository';
// Стало:
import { ALERT_TYPES } from '@/shared/config';
import { DeleteFeedback } from '../api/feedback-repository';
```

И обновить вызов:
```js
// Было:
await Delete(this.id);
// Стало:
await DeleteFeedback(this.id);
```

- [ ] **Step 7: Создать page-слайсы для admin**

```bash
mkdir -p src/pages/admin/main/ui
mkdir -p src/pages/admin/questions/ui
mkdir -p src/pages/admin/faq/ui
mkdir -p src/pages/admin/speakers/ui
mkdir -p src/pages/admin/areas/ui
mkdir -p src/pages/admin/feedback/ui
```

- [ ] **Step 8: Переместить admin views в pages**

```bash
mv src/modules/admin/ui/views/AdminMainView.vue src/pages/admin/main/ui/AdminMainPage.vue
mv src/modules/admin/ui/views/AdminQuestionsView.vue src/pages/admin/questions/ui/AdminQuestionsPage.vue
mv src/modules/admin/ui/views/AdminFAQView.vue src/pages/admin/faq/ui/AdminFAQPage.vue
mv src/modules/admin/ui/views/AdminFAQCategoryView.vue src/pages/admin/faq/ui/AdminFAQCategoryPage.vue
mv src/modules/admin/ui/views/AdminSpeakersView.vue src/pages/admin/speakers/ui/AdminSpeakersPage.vue
mv src/modules/admin/ui/views/AdminAreasView.vue src/pages/admin/areas/ui/AdminAreasPage.vue
mv src/modules/admin/ui/views/AdminFeedbackView.vue src/pages/admin/feedback/ui/AdminFeedbackPage.vue
```

- [ ] **Step 9: Создать public API для каждого page-слайса**

`src/pages/admin/main/index.js`:
```js
import AdminMainPage from './ui/AdminMainPage.vue';

export default AdminMainPage;
```

`src/pages/admin/questions/index.js`:
```js
import AdminQuestionsPage from './ui/AdminQuestionsPage.vue';

export default AdminQuestionsPage;
```

`src/pages/admin/faq/index.js`:
```js
import AdminFAQPage from './ui/AdminFAQPage.vue';

export default AdminFAQPage;
```

`src/pages/admin/speakers/index.js`:
```js
import AdminSpeakersPage from './ui/AdminSpeakersPage.vue';

export default AdminSpeakersPage;
```

`src/pages/admin/areas/index.js`:
```js
import AdminAreasPage from './ui/AdminAreasPage.vue';

export default AdminAreasPage;
```

`src/pages/admin/feedback/index.js`:
```js
import AdminFeedbackPage from './ui/AdminFeedbackPage.vue';

export default AdminFeedbackPage;
```

- [ ] **Step 10: Обновить импорты во всех admin views (теперь pages)**

Заменить все импорты из `@/modules/...` на новые пути через `@/entities/` и `@/features/`.

Для `AdminFAQPage.vue` (бывший AdminFAQView):
```js
// Было:
import ALERT_TYPES from '@/modules/alert/constants/alert-types';
import { GetAll, SetOrder } from '@/modules/faq/repositories/faq-category-repository';
import CategoryCard from '../components/FAQ/CategoryCard.vue';
import CreateCategory from '../components/FAQ/center-modal-content/CreateCategory.vue';
// Стало:
import { ALERT_TYPES } from '@/shared/config';
import { GetAllCategories, SetCategoryOrder, CategoryCard, CreateCategory } from '@/entities/faq';
```

Обновить вызовы:
```js
// Было:
this.categories = await GetAll();
await SetOrder(categoryIds);
// Стало:
this.categories = await GetAllCategories();
await SetCategoryOrder(categoryIds);
```

Для `AdminFAQCategoryPage.vue` (бывший AdminFAQCategoryView):
```js
// Было:
import ALERT_TYPES from '@/modules/alert/constants/alert-types';
import { GetById, Update as UpdateCategory, Delete as DeleteCategory } from '@/modules/faq/repositories/faq-category-repository';
import { Create as CreateEntry, Update as UpdateEntry } from '@/modules/faq/repositories/faq-entry-repository';
import CategoryCard from '../components/FAQ/CategoryCard.vue';
import EntryCard from '../components/FAQ/EntryCard.vue';
import CreateEntryContent from '../components/FAQ/sidebar-content/CreateEntryContent.vue';
import UpdateEntryContent from '../components/FAQ/sidebar-content/UpdateEntryContent.vue';
import DeleteCategory from '../components/FAQ/center-modal-content/DeleteCategory.vue';
import UpdateCategory from '../components/FAQ/center-modal-content/UpdateCategory.vue';
import copyToClipboard from '../../helpers/copy-to-clipboard';
// Стало:
import { ALERT_TYPES } from '@/shared/config';
import { GetCategoryById, UpdateCategory, DeleteCategory, CategoryCard, EntryCard, DeleteCategory as DeleteCategoryModal, UpdateCategory as UpdateCategoryModal, CreateEntryContent, UpdateEntryContent } from '@/entities/faq';
import { CreateEntry, UpdateEntry } from '@/entities/faq';
import { copyToClipboard } from '@/shared/lib';
```

(Здесь будут конфликты имён — `UpdateCategory` как API-функция и как Vue-компонент. Лучше переименовать экспорты в `entities/faq/index.js`, добавив суффиксы: `UpdateCategoryApi` / `UpdateCategoryForm`. Или не реэкспортировать API-функции, а импортировать их напрямую из `../api/`. Но это нарушает public API. Компромисс: реэкспортировать API-функции с суффиксом `Api`.)

Обновить `entities/faq/index.js` — добавить суффиксы для избежания конфликтов:

```js
export { GetAll as GetAllCategories, GetAllWithEntries, GetById as GetCategoryById, Create as CreateCategoryApi, Update as UpdateCategoryApi, Delete as DeleteCategoryApi, SetOrder as SetCategoryOrder } from './api/faq-category-repository';
export { GetAll as GetAllEntries, GetById as GetEntryById, Create as CreateEntry, Update as UpdateEntry, Delete as DeleteEntry, SetOrder as SetEntryOrder } from './api/faq-entry-repository';
export { default as FAQView } from './ui/FAQView.vue';
export { default as CategoryCard } from './ui/CategoryCard.vue';
export { default as EntryCard } from './ui/EntryCard.vue';
export { default as CreateCategory } from './ui/CreateCategory.vue';
export { default as DeleteCategory } from './ui/DeleteCategory.vue';
export { default as UpdateCategory } from './ui/UpdateCategory.vue';
export { default as CreateEntryContent } from './ui/CreateEntryContent.vue';
export { default as UpdateEntryContent } from './ui/UpdateEntryContent.vue';
```

Тогда импорт в `AdminFAQCategoryPage.vue`:
```js
import { ALERT_TYPES } from '@/shared/config';
import { copyToClipboard } from '@/shared/lib';
import { GetCategoryById, UpdateCategoryApi, DeleteCategoryApi, CategoryCard, EntryCard, DeleteCategory, UpdateCategory as UpdateCategoryForm, CreateEntry, UpdateEntry, CreateEntryContent, UpdateEntryContent } from '@/entities/faq';
```

Для `AdminQuestionsPage.vue`:
```js
// Было:
import ALERT_TYPES from '@/modules/alert/constants/alert-types';
import { GetAll } from '@/modules/question/repositories/questions-repository';
// Стало:
import { ALERT_TYPES } from '@/shared/config';
import { GetAllQuestions } from '@/entities/question';
```

И обновить вызов:
```js
// Было:
this.questions = await GetAll();
// Стало:
this.questions = await GetAllQuestions();
```

Для `AdminAreasPage.vue`:
```js
// Было:
import { GetAll, SetOrder } from '@/modules/shared/repositories/areas-repository';
import AreaCard from '../components/area/AreaCard.vue';
import CreateArea from '../components/area/center-modal-content/CreateArea.vue';
import UpdateArea from '../components/area/center-modal-content/UpdateArea.vue';
import DeleteArea from '../components/area/center-modal-content/DeleteArea.vue';
// Стало:
import { GetAllAreas, SetAreaOrder, AreaCard, CreateArea, UpdateArea, DeleteArea } from '@/entities/area';
```

И обновить вызовы:
```js
// Было:
this.areas = await GetAll();
await SetOrder(areaIds);
// Стало:
this.areas = await GetAllAreas();
await SetAreaOrder(areaIds);
```

Для `AdminFeedbackPage.vue`:
```js
// Было:
import { GetAll } from '@/modules/feedback/repositories/feedback-repository';
import FeedbackCard from '../components/feedback/FeedbackCard.vue';
import DeleteFeedback from '../components/feedback/center-modal-content/DeleteFeedback.vue';
// Стало:
import { GetAllFeedback, FeedbackCard, DeleteFeedbackModal } from '@/features/feedback';
```

- [ ] **Step 11: Обновить маршруты в `src/app/router/router.js`**

Заменить `AdminRoutes` на прямые маршруты:

```js
// Было:
import AdminRoutes from '@/modules/admin/routes/index';
// ...
...AdminRoutes,

// Стало (удалить импорт AdminRoutes, добавить маршруты напрямую):
{
  path: '/admin',
  name: 'admin',
  component: () => import('@/pages/admin/main'),
  meta: { layout: 'AdminLayout', isProtected: true },
},
{
  path: '/admin-questions',
  name: 'admin-questions',
  component: () => import('@/pages/admin/questions'),
  meta: { layout: 'AdminLayout', isProtected: true },
},
{
  path: '/admin-faq',
  name: 'admin-faq',
  component: () => import('@/pages/admin/faq'),
  meta: { layout: 'AdminLayout', isProtected: true },
  children: [
    {
      path: ':id',
      name: 'admin-faq-category',
      props: (route) => ({ id: route.params.id }),
      meta: { layout: 'AdminLayout', isProtected: true },
      component: () => import('@/pages/admin/faq/ui/AdminFAQCategoryPage.vue'),
    },
  ],
},
{
  path: '/admin-speakers',
  name: 'admin-speakers',
  component: () => import('@/pages/admin/speakers'),
  meta: { layout: 'AdminLayout', isProtected: true },
},
{
  path: '/admin-areas',
  name: 'admin-areas',
  component: () => import('@/pages/admin/areas'),
  meta: { layout: 'AdminLayout', isProtected: true },
},
{
  path: '/admin-feedback',
  name: 'admin-feedback',
  component: () => import('@/pages/admin/feedback'),
  meta: { layout: 'AdminLayout', isProtected: true },
},
```

Примечание: для child-маршрута `admin-faq-category` нужен прямой путь к файлу, т.к. `@/pages/admin/faq` уже указывает на `AdminFAQPage`, а не на `AdminFAQCategoryPage`. Поэтому используем `@/pages/admin/faq/ui/AdminFAQCategoryPage.vue`.

- [ ] **Step 12: Удалить `src/modules/admin/`**

```bash
rm -rf src/modules/admin
```

- [ ] **Step 13: Удалить пустые директории `src/modules/`**

```bash
rm -rf src/modules
```

- [ ] **Step 14: Запустить lint + steiger**

```bash
npm run lint && npx steiger ./src
```

- [ ] **Step 15: Коммит**

```bash
git add -A
git commit -m "refactor(pages): break admin god-slice into pages and move UI to entities/features"
```

---

## Фаза 4: Очистка слоя pages

### Task 15: Заполнить пустые page-слайсы и переместить views из entities

Сейчас `pages/faq/` и `pages/questions/` — пустые, а соответствующие views лежат в `entities/`. По FSD, views (страницы) должны быть композицией в `pages/`, а `entities/` — только доменные модели.

**Files:**
- Create: `src/pages/faq/ui/FAQPage.vue` — композитная страница, использующая `entities/faq`
- Create: `src/pages/faq/index.js`
- Create: `src/pages/questions/ui/QuestionsPage.vue` — композитная страница
- Create: `src/pages/questions/ui/QuestionIdPage.vue`
- Create: `src/pages/questions/index.js`
- Modify: `src/app/router/router.js` — обновить маршруты
- Delete: view-файлы из entities (если они стали тривиальными обёртками)

- [ ] **Step 1: Создать `src/pages/faq/ui/FAQPage.vue`**

Эта страница — простая композициая: она импортирует `FAQView` из entities и отдаёт его как есть.

```vue
<template>
  <FAQView />
</template>

<script>
import { FAQView } from '@/entities/faq';

export default {
  name: 'FAQPage',

  components: {
    FAQView,
  },
};
</script>
```

- [ ] **Step 2: Создать `src/pages/faq/index.js`**

```js
import FAQPage from './ui/FAQPage.vue';

export default FAQPage;
```

- [ ] **Step 3: Создать `src/pages/questions/ui/QuestionsPage.vue`**

```vue
<template>
  <QuestionsView />
</template>

<script>
import { QuestionsView } from '@/entities/question';

export default {
  name: 'QuestionsPage',

  components: {
    QuestionsView,
  },
};
</script>
```

- [ ] **Step 4: Создать `src/pages/questions/ui/QuestionIdPage.vue`**

```vue
<template>
  <QuestionIdView />
</template>

<script>
import { QuestionIdView } from '@/entities/question';

export default {
  name: 'QuestionIdPage',

  components: {
    QuestionIdView,
  },
};
</script>
```

- [ ] **Step 5: Создать `src/pages/questions/index.js`**

Здесь проблема: в `pages/questions/` должно быть две страницы, но public API слайса может экспортировать только одну страницу (default export). Решение: добавить отдельный подслайс `pages/questions/detail/`.

```bash
mkdir -p src/pages/questions/detail/ui
```

Переместить `QuestionIdPage.vue` в `src/pages/questions/detail/ui/QuestionIdPage.vue` и создать `src/pages/questions/detail/index.js`:

```js
import QuestionIdPage from './ui/QuestionIdPage.vue';

export default QuestionIdPage;
```

Обновить `src/pages/questions/index.js`:

```js
import QuestionsPage from './ui/QuestionsPage.vue';

export default QuestionsPage;
```

- [ ] **Step 6: Обновить маршруты в `router.js`**

```js
// Было:
component: () => import('@/entities/question/ui/QuestionsView.vue'),
component: () => import('@/entities/question/ui/QuestionIdView.vue'),
component: () => import('@/entities/faq/ui/FAQView.vue'),

// Стало:
component: () => import('@/pages/questions'),
component: () => import('@/pages/questions/detail'),
component: () => import('@/pages/faq'),
```

- [ ] **Step 7: Запустить lint + steiger**

```bash
npm run lint && npx steiger ./src
```

- [ ] **Step 8: Коммит**

```bash
git add -A
git commit -m "refactor(pages): add FAQ and Questions page compositions"
```

---

## Фаза 5: Финальная валидация и обновление AGENTS.md

### Task 16: Финальная валидация и обновление документации

- [ ] **Step 1: Запустить полную проверку**

```bash
npm run lint && npx steiger ./src
```

- [ ] **Step 2: Запустить dev-сервер и проверить, что приложение загружается**

```bash
npm run dev
```

Открыть `http://localhost:5000` и проверить основные маршруты:
- `/` — главная
- `/questions` — все вопросы
- `/faq` — FAQ
- `/login` — авторизация
- `/admin` — админка

- [ ] **Step 3: Обновить `AGENTS.md`**

Заменить секцию архитектуры:

```markdown
## Архитектура

Feature-Sliced Design (FSD) v2.1. Валидация через steiger — запускай `npx steiger ./src` после структурных изменений.

```
src/
  app/       — вход, роутер, хранилище, стили, плагины
  pages/     — композиции для маршрутов (включая admin/*)
  features/  — пользовательские действия (auth, feedback, preloader)
  entities/  — бизнес-модели (alert, faq, question, user, area)
  shared/    — инфраструктура (api, config, lib, routes, ui, assets)
```

Импорты только сверху вниз: `app → pages → features → entities → shared`.
Кросс-импорты между слайсами одного слоя запрещены.
Каждый слайс имеет public API (`index.js`) — импортируй только через него.
```

Обновить секцию про steiger-команду:

```markdown
- `npx steiger ./src` — валидация FSD через steiger
```

Удалить упоминание `npm run fsd:check` (если он не работает).

- [ ] **Step 4: Коммит**

```bash
git add -A
git commit -m "docs: update AGENTS.md for new FSD structure"
```

---

## Сводка задач

| Task | Описание | Файлов затронуто |
|------|----------|-----------------|
| 1 | Public API shared/assets | 1 |
| 2 | ALERT_TYPES → shared/config | ~23 |
| 3 | copy-to-clipboard → shared/lib | 3 |
| 4 | helpers/ → lib/ rename | 2 |
| 5 | Убрать 401 из shared/api | 3 |
| 6 | modules/alert → entities/alert | ~3 |
| 7 | modules/faq → entities/faq | ~10 |
| 8 | modules/question → entities/question | ~8 |
| 9 | modules/shared → entities/area | ~6 |
| 10 | modules/user → entities/user | ~4 |
| 11 | modules/auth → features/auth | ~5 |
| 12 | modules/feedback → features/feedback | ~4 |
| 13 | modules/preloader → features/preloader | ~3 |
| 14 | modules/admin → pages/admin + entities + features | ~25 |
| 15 | Pages: FAQ, Questions | ~8 |
| 16 | Финальная валидация + AGENTS.md | ~2 |
