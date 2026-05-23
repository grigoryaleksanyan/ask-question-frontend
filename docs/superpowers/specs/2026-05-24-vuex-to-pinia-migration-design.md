# Vuex → Pinia: дизайн миграции

## Контекст

Проект ask-question-frontend использует Vuex 4 с 3 namespaced-модулями (preloader, alert, auth). Все компоненты на Options API, взаимодействие через `mapMutations`/`mapGetters`. Ни один модуль не содержит actions — асинхронная логика в компонентах. SSR нет, Vuex-плагинов нет.

## Цель

Заменить Vuex на Pinia, перевести компоненты на Composition API (`<script setup>`), переименовать методы в camelCase, вынести API-вызовы из компонентов в Pinia-actions.

## Подход

Модульная миграция — по одному store за раз. Vuex и Pinia сосуществуют в течение перехода. Vuex удаляется после миграции последнего store.

Порядок: preloader → alert → auth (от простого к сложному).

## Pinia-stores

Все stores — Composition Stores (`defineStore` с setup-синтаксисом).

### usePreloaderStore (`features/preloader/store`)

```js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const usePreloaderStore = defineStore('preloader', () => {
  const loadings = ref(0);
  const showPreloader = computed(() => !!loadings.value);

  function addLoader() { loadings.value++; }
  function removeLoader() { if (loadings.value > 0) loadings.value--; }

  return { loadings, showPreloader, addLoader, removeLoader };
});
```

### useAlertStore (`entities/alert/store`)

```js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { generateId } from '@/entities/alert/lib/pseudorandom-generator';

export const useAlertStore = defineStore('alert', () => {
  const alerts = ref([]);
  const getAlerts = computed(() => alerts.value);

  function addAlert({ type, text, delay }) {
    const id = generateId();
    alerts.value.push({ id, type, text });
    if (type !== 'error') {
      setTimeout(() => { removeAlert(id); }, delay ?? 3000);
    }
  }

  function removeAlert(id) {
    alerts.value = alerts.value.filter((a) => a.id !== id);
  }

  return { alerts, getAlerts, addAlert, removeAlert };
});
```

`setTimeout` перенесён из mutation в action — корректно для Pinia.

### useAuthStore (`features/auth/store`)

```js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const isAuthorized = ref(false);
  const userData = ref(null);
  const getAuthStatus = computed(() => isAuthorized.value);
  const getUserData = computed(() => userData.value);

  function setAuthData(user) {
    userData.value = user;
    isAuthorized.value = true;
  }

  function removeAuthData() {
    userData.value = null;
    isAuthorized.value = false;
  }

  return { isAuthorized, userData, getAuthStatus, getUserData, setAuthData, removeAuthData };
});
```

Auth-store получит дополнительные actions для API-операций (login, logout, checkAuth) при миграции зависимых компонентов.

## Паттерн миграции компонентов

### Замена mapGetters/mapMutations

**Было (Options API):**
```js
import { mapMutations, mapGetters } from 'vuex';

export default {
  computed: { ...mapGetters('preloader', ['SHOW_PRELOADER']) },
  methods: {
    ...mapMutations('alert', ['ADD_ALERT']),
    ...mapMutations('preloader', ['ADD_LOADER', 'REMOVE_LOADER']),
  },
}
```

**Станет (`<script setup>`):**
```vue
<script setup>
import { useAlertStore } from '@/entities/alert';
import { usePreloaderStore } from '@/features/preloader';
import { storeToRefs } from 'pinia';

const alertStore = useAlertStore();
const { addAlert } = alertStore;

const preloaderStore = usePreloaderStore();
const { showPreloader } = storeToRefs(preloaderStore);
const { addLoader, removeLoader } = preloaderStore;
</script>
```

- `storeToRefs` — для реактивных свойств (state, computed)
- Прямая деструктуризация — для actions

### Вынос API-вызовов в actions

При миграции каждого компонента API-вызовы переносятся из методов компонента в store-actions. Компонент вызывает action, action инкапсулирует: preloader → API → alert → preloader.

**Было:**
```js
async fetchQuestions() {
  this.ADD_LOADER();
  try {
    const { data } = await questionApi.getQuestions(this.filters);
    this.questions = data;
  } catch { this.ADD_ALERT({ type: 'error', text: '...' }); }
  finally { this.REMOVE_LOADER(); }
}
```

**Станет (в store):**
```js
async fetchQuestions(filters) {
  const preloaderStore = usePreloaderStore();
  const alertStore = useAlertStore();
  preloaderStore.addLoader();
  try {
    const { data } = await questionApi.getQuestions(filters);
    return data;
  } catch {
    alertStore.addAlert({ type: 'error', text: '...' });
  } finally {
    preloaderStore.removeLoader();
  }
}
```

**В компоненте:**
```vue
<script setup>
const data = await questionStore.fetchQuestions(filters);
</script>
```

## FSD Public API

Каждый слайс экспортирует store через public API (`index.js`):

- `entities/alert/index.js` — `export { useAlertStore } from './store'`
- `features/preloader/index.js` — `export { usePreloaderStore } from './store'`
- `features/auth/index.js` — `export { useAuthStore } from './store'`

Импорты в компонентах только через public API: `import { useAlertStore } from '@/entities/alert'`.

## Middleware

`auth-middleware.js` — единственный файл с прямым доступом к store вне компонентов.

**Было:**
```js
import store from '@/app/store/store';
store.getters['auth/GET_AUTH_STATUS']
store.commit('auth/SET_AUTH_DATA', user)
store.commit('alert/ADD_ALERT', { type, text })
```

**Станет:**
```js
import { useAuthStore } from '@/features/auth';
import { useAlertStore } from '@/entities/alert';

const authStore = useAuthStore();
const alertStore = useAlertStore();
authStore.getAuthStatus
authStore.setAuthData(user)
alertStore.addAlert({ type, text })
```

Pinia stores доступны вне `setup()` после `app.use(pinia)`. Middleware вызывается в `router.beforeEach` — после инициализации, поэтому безопасно.

## Порядок миграции

### Шаг 1: Инфраструктура
- Установить `pinia`
- Зарегистрировать `createPinia()` в `app/lib/index.js` (рядом с Vuex)
- Vuex и Pinia сосуществуют

### Шаг 2: Preloader store (простой)
- Создать `usePreloaderStore` в `features/preloader/store`
- Экспортировать через `features/preloader/index.js`
- Обновить `AppPreloader.vue` + 8 компонентов с `ADD_LOADER`/`REMOVE_LOADER` → Composition API
- Удалить Vuex-модуль `preloader` из `app/store/store.js`

### Шаг 3: Alert store (средний)
- Создать `useAlertStore` в `entities/alert/store`
- Экспортировать через `entities/alert/index.js`
- Обновить `AppAlert.vue`, `AppAlertItem.vue` + ~16 компонентов с `ADD_ALERT` → Composition API
- Удалить Vuex-модуль `alert` из `app/store/store.js`

### Шаг 4: Auth store (сложный)
- Создать `useAuthStore` в `features/auth/store`
- Экспортировать через `features/auth/index.js`
- Обновить `LoginView.vue`, `AdminLayout.vue`, `UserProfile.vue` → Composition API
- Обновить `auth-middleware.js` — заменить прямой импорт Vuex-store на Pinia-stores
- Удалить Vuex-модуль `auth` из `app/store/store.js`

### Шаг 5: Финализация
- Удалить `vuex` из зависимостей
- Удалить `app/store/store.js`
- Убрать `app.use(store)` из `app/lib/index.js`
- Обновить AGENTS.md (удалить упоминания Vuex, добавить Pinia)
- Запустить `npm run lint` и `npx steiger ./src`

## Риски

1. **ESLint-правила для Options API** — при переходе на Composition API часть правил (padding-lines-in-component-definition и др.) перестанут применяться. Нужно проверить/обновить ESLint-конфиг.
2. **AGENTS.md** — требует обновления: стек (Pinia вместо Vuex), стиль (Composition API вместо Options API), ESLint-правила.
3. **Steiger** — после миграции steiger может увидеть слайсы иначе (Pinia-импорты вместо Vuex). Ложные срабатывания `insignificant-slice` уже известны.
4. **Вынос API в actions** — некоторые API-вызовы принадлежат entity-домену (question, faq, area), но для них нет stores. Решение: создавать stores по мере необходимости или оставлять API-вызовы в компонентах для тех доменов, где store не нужен.
