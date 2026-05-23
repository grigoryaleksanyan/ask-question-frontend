# Vuex → Pinia Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Vuex with Pinia, migrate all components to Composition API (`<script setup>`), rename store methods to camelCase, extract API calls into Pinia actions.

**Architecture:** Modular migration — one store at a time (preloader → alert → auth). Vuex and Pinia coexist during transition. Each store becomes a Composition Store (`defineStore` with setup syntax). Components switch from `mapMutations`/`mapGetters` to `<script setup>` with Pinia store destructuring.

**Tech Stack:** Vue 3, Pinia, Vuetify 3, Vue Router 4, Axios, VeeValidate

---

## File Structure

### New files (Pinia stores replace Vuex modules)
- `src/features/preloader/store/index.js` — overwrite with Pinia composition store
- `src/entities/alert/store/index.js` — overwrite with Pinia composition store
- `src/features/auth/store/index.js` — overwrite with Pinia composition store

### Modified files (FSD public API)
- `src/features/preloader/index.js` — add `usePreloaderStore` export
- `src/entities/alert/index.js` — add `useAlertStore` export
- `src/features/auth/index.js` — add `useAuthStore` export

### Modified files (entry/registration)
- `src/app/lib/index.js` — add `createPinia()`, keep Vuex temporarily
- `src/app/store/store.js` — remove modules one by one during migration, delete at end
- `src/app/router/middleware/auth-middleware.js` — switch to Pinia stores

### Modified files (components — preloader consumers)
- `src/features/preloader/ui/AppPreloader.vue`
- `src/entities/user/ui/UserProfile.vue`
- `src/pages/admin/faq/ui/AdminFAQPage.vue`
- `src/pages/admin/faq/ui/AdminFAQCategoryPage.vue`
- `src/pages/admin/areas/ui/AdminAreasPage.vue`
- `src/pages/admin/feedback/ui/AdminFeedbackPage.vue`
- `src/features/feedback/ui/SidebarFeedbackContent.vue`
- `src/entities/faq/ui/FAQView.vue`
- `src/entities/faq/ui/UpdateEntryContent.vue`
- `src/entities/faq/ui/CreateEntryContent.vue`

### Modified files (components — alert-only consumers)
- `src/entities/alert/ui/AppAlert.vue`
- `src/entities/alert/ui/AppAlertItem.vue`
- `src/pages/admin/questions/ui/AdminQuestionsPage.vue`
- `src/features/feedback/ui/DeleteFeedbackModal.vue`
- `src/entities/question/ui/QuestionFormCreate.vue`
- `src/entities/question/ui/QuestionsView.vue`
- `src/entities/faq/ui/DeleteEntry.vue`
- `src/entities/faq/ui/UpdateCategory.vue`
- `src/entities/faq/ui/DeleteCategory.vue`
- `src/entities/faq/ui/CreateCategory.vue`
- `src/entities/area/ui/CreateArea.vue`
- `src/entities/area/ui/UpdateArea.vue`
- `src/entities/area/ui/DeleteArea.vue`

### Modified files (components — auth consumers)
- `src/features/auth/ui/LoginView.vue`
- `src/app/layouts/AdminLayout.vue`

### Deleted files
- `src/app/store/store.js` — after all modules migrated

---

## Task 1: Install Pinia and register alongside Vuex

**Files:**
- Modify: `package.json`
- Modify: `src/app/lib/index.js`

- [ ] **Step 1: Install Pinia**

Run: `npm install pinia`

- [ ] **Step 2: Register createPinia() in app/lib/index.js**

Current `src/app/lib/index.js`:
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

New `src/app/lib/index.js`:
```js
import router from '@/app/router';
import store from '@/app/store/store';
import { createPinia } from 'pinia';

import vuetify from './vuetify';
import veeValidate from './vee-validate';
import setupHttpClientInterceptors from './http-client-interceptors';

export default function registerPlugins(app) {
  const pinia = createPinia();

  app.use(router).use(pinia).use(store).use(vuetify).use(veeValidate);

  setupHttpClientInterceptors();
}
```

Note: `pinia` registered before `store` so that Pinia stores can be used during Vuex coexistence.

- [ ] **Step 3: Verify dev server starts**

Run: `npm run dev` (then Ctrl+C after confirming it starts without errors)

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json src/app/lib/index.js
git commit -m "feat: install pinia and register alongside vuex"
```

---

## Task 2: Migrate Preloader Store

**Files:**
- Modify: `src/features/preloader/store/index.js`
- Modify: `src/features/preloader/index.js`
- Modify: `src/features/preloader/ui/AppPreloader.vue`
- Modify: `src/app/store/store.js` — remove preloader module

### 2a: Create Pinia store

- [ ] **Step 1: Overwrite preloader store with Pinia composition store**

Current `src/features/preloader/store/index.js`:
```js
export default {
  namespaced: true,

  state: () => ({
    loadings: 0,
  }),

  mutations: {
    ADD_LOADER(state) {
      state.loadings += 1;
    },

    REMOVE_LOADER(state) {
      if (state.loadings > 0) {
        state.loadings -= 1;
      }
    },
  },

  getters: {
    SHOW_PRELOADER: (state) => !!state.loadings,
  },
};
```

New `src/features/preloader/store/index.js`:
```js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const usePreloaderStore = defineStore('preloader', () => {
  const loadings = ref(0);

  const showPreloader = computed(() => !!loadings.value);

  function addLoader() {
    loadings.value += 1;
  }

  function removeLoader() {
    if (loadings.value > 0) {
      loadings.value -= 1;
    }
  }

  return { loadings, showPreloader, addLoader, removeLoader };
});
```

- [ ] **Step 2: Export usePreloaderStore from preloader public API**

Current `src/features/preloader/index.js`:
```js
// eslint-disable-next-line import/prefer-default-export
export { default as AppPreloader } from './ui/AppPreloader.vue';
```

New `src/features/preloader/index.js`:
```js
// eslint-disable-next-line import/prefer-default-export
export { default as AppPreloader } from './ui/AppPreloader.vue';

export { usePreloaderStore } from './store';
```

### 2b: Migrate AppPreloader.vue

- [ ] **Step 3: Migrate AppPreloader.vue to `<script setup>`**

Current:
```vue
<template>
  <v-overlay
    :model-value="SHOW_PRELOADER"
    style="z-index: 9">
    <v-progress-circular
      :size="70"
      :width="6"
      color="primary"
      indeterminate></v-progress-circular>
  </v-overlay>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'AppPreloader',

  computed: {
    ...mapGetters('preloader', ['SHOW_PRELOADER']),
  },
};
</script>
```

New:
```vue
<template>
  <v-overlay
    :model-value="showPreloader"
    style="z-index: 9">
    <v-progress-circular
      :size="70"
      :width="6"
      color="primary"
      indeterminate></v-progress-circular>
  </v-overlay>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { usePreloaderStore } from '@/features/preloader';

const preloaderStore = usePreloaderStore();

const { showPreloader } = storeToRefs(preloaderStore);
</script>
```

Template change: `SHOW_PRELOADER` → `showPreloader`.

### 2c: Remove preloader Vuex module from root store

- [ ] **Step 4: Remove preloader from app/store/store.js**

Current `src/app/store/store.js`:
```js
import { createStore } from 'vuex';

import preloader from '@/features/preloader/store';
import alert from '@/entities/alert/store';
import auth from '@/features/auth/store';

export default createStore({
  modules: {
    preloader,
    alert,
    auth,
  },
});
```

New `src/app/store/store.js`:
```js
import { createStore } from 'vuex';

import alert from '@/entities/alert/store';
import auth from '@/features/auth/store';

export default createStore({
  modules: {
    alert,
    auth,
  },
});
```

- [ ] **Step 5: Run lint**

Run: `npm run lint`

Fix any lint errors before proceeding.

- [ ] **Step 6: Commit**

```bash
git add src/features/preloader/ src/app/store/store.js
git commit -m "feat: migrate preloader store to pinia"
```

---

## Task 3: Migrate Alert Store

**Files:**
- Modify: `src/entities/alert/store/index.js`
- Modify: `src/entities/alert/index.js`
- Modify: `src/entities/alert/ui/AppAlert.vue`
- Modify: `src/entities/alert/ui/AppAlertItem.vue`
- Modify: `src/app/store/store.js` — remove alert module

### 3a: Create Pinia store

- [ ] **Step 1: Overwrite alert store with Pinia composition store**

Current `src/entities/alert/store/index.js`:
```js
import generateId from '../lib/pseudorandom-generator';

export default {
  namespaced: true,

  state: () => ({
    alerts: [],
  }),

  mutations: {
    ADD_ALERT(state, { type, text, delay }) {
      const alert = {
        id: generateId(),
        type,
        text,
        delay,
      };

      state.alerts.push(alert);

      if (alert.type !== 'error') {
        setTimeout(() => {
          state.alerts = state.alerts.filter((el) => el.id !== alert.id);
        }, alert.delay ?? 3000);
      }
    },

    REMOVE_ALERT(state, id) {
      state.alerts = state.alerts.filter((alert) => alert.id !== id);
    },
  },

  getters: {
    GET_ALERTS: (state) => state.alerts,
  },
};
```

New `src/entities/alert/store/index.js`:
```js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

import generateId from '../lib/pseudorandom-generator';

export const useAlertStore = defineStore('alert', () => {
  const alerts = ref([]);

  const getAlerts = computed(() => alerts.value);

  function addAlert({ type, text, delay }) {
    const id = generateId();

    alerts.value.push({ id, type, text });

    if (type !== 'error') {
      setTimeout(() => {
        removeAlert(id);
      }, delay ?? 3000);
    }
  }

  function removeAlert(id) {
    alerts.value = alerts.value.filter((alert) => alert.id !== id);
  }

  return { alerts, getAlerts, addAlert, removeAlert };
});
```

Key change: `setTimeout` now calls `removeAlert()` action instead of directly mutating state — correct Pinia pattern.

- [ ] **Step 2: Export useAlertStore from alert public API**

Current `src/entities/alert/index.js`:
```js
export { default as AppAlert } from './ui/AppAlert.vue';

export { default as AppAlertItem } from './ui/AppAlertItem.vue';
```

New `src/entities/alert/index.js`:
```js
export { default as AppAlert } from './ui/AppAlert.vue';

export { default as AppAlertItem } from './ui/AppAlertItem.vue';

export { useAlertStore } from './store';
```

### 3b: Migrate AppAlert.vue

- [ ] **Step 3: Migrate AppAlert.vue to `<script setup>`**

Current:
```vue
<template>
  <div class="alert">
    <transition-group name="scroll-y-reverse-transition">
      <AppAlertItem
        v-for="alert in GET_ALERTS"
        :key="alert.id"
        :alert="alert" />
    </transition-group>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import AppAlertItem from './AppAlertItem.vue';

export default {
  name: 'AppAlert',

  components: {
    AppAlertItem,
  },

  computed: {
    ...mapGetters('alert', ['GET_ALERTS']),
  },
};
</script>

<style lang="scss" scoped>
.alert {
  position: fixed;
  z-index: 1000;
  top: 75px;
  right: 10px;
  width: 370px;
}

@media (width <= 400px) {
  .alert {
    right: unset;
    left: 50%;
    width: 300px;
    transform: translateX(-50%);
  }
}
</style>
```

New:
```vue
<template>
  <div class="alert">
    <transition-group name="scroll-y-reverse-transition">
      <AppAlertItem
        v-for="alert in getAlerts"
        :key="alert.id"
        :alert="alert" />
    </transition-group>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useAlertStore } from '@/entities/alert';
import AppAlertItem from './AppAlertItem.vue';

const alertStore = useAlertStore();

const { getAlerts } = storeToRefs(alertStore);
</script>

<style lang="scss" scoped>
.alert {
  position: fixed;
  z-index: 1000;
  top: 75px;
  right: 10px;
  width: 370px;
}

@media (width <= 400px) {
  .alert {
    right: unset;
    left: 50%;
    width: 300px;
    transform: translateX(-50%);
  }
}
</style>
```

Template change: `GET_ALERTS` → `getAlerts`. In `<script setup>`, child components registered via import are auto-available — no `components` option needed.

### 3c: Migrate AppAlertItem.vue

- [ ] **Step 4: Migrate AppAlertItem.vue to `<script setup>`**

Current:
```vue
<template>
  <div :class="alertClasses">
    <span class="alert-item-icon">
      <component :is="`${alert.type}-icon`" />
    </span>

    <p class="alert-item-text">{{ alert.text }}</p>

    <button
      type="button"
      title="Закрыть"
      class="alert-item-button"
      @click="REMOVE_ALERT(alert.id)">
      <CloseIcon />
    </button>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

import SuccessIcon from './icons/SuccessIcon.vue';
import InfoIcon from './icons/InfoIcon.vue';
import WarningIcon from './icons/WarningIcon.vue';
import ErrorIcon from './icons/ErrorIcon.vue';

import CloseIcon from './icons/CloseIcon.vue';

export default {
  name: 'AppAlertItem',
  components: { SuccessIcon, InfoIcon, WarningIcon, ErrorIcon, CloseIcon },
  props: { alert: { type: Object, required: true } },

  computed: {
    alertClasses() {
      return { 'alert-item': true, [`alert-item-${this.alert.type}`]: true };
    },
  },

  methods: { ...mapMutations('alert', ['REMOVE_ALERT']) },
};
</script>

<style lang="scss" scoped>
%icon-sizes {
  width: 24px;
  min-width: 24px;
  height: 24px;
  min-height: 24px;
}

.alert-item {
  display: flex;
  width: 100%;
  align-items: center;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 10px;
  background-color: variables.$primary-color;
  box-shadow:
    0 3px 1px -2px rgb(0 0 0 / 20%),
    0 2px 2px 0 rgb(0 0 0 / 14%),
    0 1px 5px 0 rgb(0 0 0 / 12%);
  color: #fff;

  &-success {
    background-color: variables.$success-color;
  }

  &-info {
    background-color: variables.$info-color;
  }

  &-warning {
    background-color: variables.$warning-color;
  }

  &-error {
    background-color: variables.$error-color;
  }
}

.alert-item-icon {
  @extend %icon-sizes;

  margin-right: 10px;
}

.alert-item-text {
  flex-grow: 1;
  margin: 0;
  margin-right: 10px;
}

.alert-item-button {
  @extend %icon-sizes;
}
</style>
```

New:
```vue
<template>
  <div :class="alertClasses">
    <span class="alert-item-icon">
      <component :is="`${alert.type}-icon`" />
    </span>

    <p class="alert-item-text">{{ alert.text }}</p>

    <button
      type="button"
      title="Закрыть"
      class="alert-item-button"
      @click="removeAlert(alert.id)">
      <CloseIcon />
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';

import { useAlertStore } from '@/entities/alert';

import SuccessIcon from './icons/SuccessIcon.vue';
import InfoIcon from './icons/InfoIcon.vue';
import WarningIcon from './icons/WarningIcon.vue';
import ErrorIcon from './icons/ErrorIcon.vue';
import CloseIcon from './icons/CloseIcon.vue';

const props = defineProps({
  alert: { type: Object, required: true },
});

const alertStore = useAlertStore();

const { removeAlert } = alertStore;

const alertClasses = computed(() => ({
  'alert-item': true,
  [`alert-item-${props.alert.type}`]: true,
}));
</script>

<style lang="scss" scoped>
%icon-sizes {
  width: 24px;
  min-width: 24px;
  height: 24px;
  min-height: 24px;
}

.alert-item {
  display: flex;
  width: 100%;
  align-items: center;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 10px;
  background-color: variables.$primary-color;
  box-shadow:
    0 3px 1px -2px rgb(0 0 0 / 20%),
    0 2px 2px 0 rgb(0 0 0 / 14%),
    0 1px 5px 0 rgb(0 0 0 / 12%);
  color: #fff;

  &-success {
    background-color: variables.$success-color;
  }

  &-info {
    background-color: variables.$info-color;
  }

  &-warning {
    background-color: variables.$warning-color;
  }

  &-error {
    background-color: variables.$error-color;
  }
}

.alert-item-icon {
  @extend %icon-sizes;

  margin-right: 10px;
}

.alert-item-text {
  flex-grow: 1;
  margin: 0;
  margin-right: 10px;
}

.alert-item-button {
  @extend %icon-sizes;
}
</style>
```

Template change: `REMOVE_ALERT(alert.id)` → `removeAlert(alert.id)`. `alertClasses` computed now uses `props.alert` instead of `this.alert`.

### 3d: Remove alert Vuex module from root store

- [ ] **Step 5: Remove alert from app/store/store.js**

New `src/app/store/store.js`:
```js
import { createStore } from 'vuex';

import auth from '@/features/auth/store';

export default createStore({
  modules: {
    auth,
  },
});
```

- [ ] **Step 6: Run lint**

Run: `npm run lint`

- [ ] **Step 7: Commit**

```bash
git add src/entities/alert/ src/app/store/store.js
git commit -m "feat: migrate alert store to pinia"
```

---

## Task 4: Migrate Auth Store + Middleware

**Files:**
- Modify: `src/features/auth/store/index.js`
- Modify: `src/features/auth/index.js`
- Modify: `src/features/auth/ui/LoginView.vue`
- Modify: `src/app/layouts/AdminLayout.vue`
- Modify: `src/entities/user/ui/UserProfile.vue`
- Modify: `src/app/router/middleware/auth-middleware.js`
- Delete: `src/app/store/store.js`
- Modify: `src/app/lib/index.js` — remove Vuex

### 4a: Create Pinia store

- [ ] **Step 1: Overwrite auth store with Pinia composition store**

Current `src/features/auth/store/index.js`:
```js
export default {
  namespaced: true,

  state: () => ({
    isAuthorized: false,
    userData: null,
  }),

  mutations: {
    SET_AUTH_DATA: (state, userData) => {
      state.userData = userData;
      state.isAuthorized = true;
    },

    REMOVE_AUTH_DATA: (state) => {
      state.userData = null;
      state.isAuthorized = false;
    },
  },

  getters: {
    GET_AUTH_STATUS: (state) => state.isAuthorized,

    GET_USER_DATA: (state) => state.userData,
  },
};
```

New `src/features/auth/store/index.js`:
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

- [ ] **Step 2: Export useAuthStore from auth public API**

Current `src/features/auth/index.js`:
```js
export { Login, Logout } from './api/auth-repository';
export { default as LoginView } from './ui/LoginView.vue';
```

New `src/features/auth/index.js`:
```js
export { Login, Logout } from './api/auth-repository';

export { default as LoginView } from './ui/LoginView.vue';

export { useAuthStore } from './store';
```

### 4b: Migrate auth-middleware.js

- [ ] **Step 3: Migrate auth-middleware.js to Pinia**

Current `src/app/router/middleware/auth-middleware.js`:
```js
import store from '@/app/store/store';

import { ALERT_TYPES } from '@/shared/config';
import { GetUserData } from '@/entities/user';

export default async function checkAuth() {
  if (!store.getters['auth/GET_AUTH_STATUS']) {
    try {
      const user = await GetUserData();

      store.commit('auth/SET_AUTH_DATA', user);

      return true;
    } catch (error) {
      store.commit('alert/ADD_ALERT', {
        type: ALERT_TYPES.ERROR,
        text: error.message,
      });

      return {
        name: 'login',
      };
    }
  }

  return true;
}
```

New `src/app/router/middleware/auth-middleware.js`:
```js
import { useAuthStore } from '@/features/auth';
import { useAlertStore } from '@/entities/alert';

import { ALERT_TYPES } from '@/shared/config';
import { GetUserData } from '@/entities/user';

export default async function checkAuth() {
  const authStore = useAuthStore();

  if (!authStore.getAuthStatus) {
    try {
      const user = await GetUserData();

      authStore.setAuthData(user);

      return true;
    } catch (error) {
      const alertStore = useAlertStore();

      alertStore.addAlert({
        type: ALERT_TYPES.ERROR,
        text: error.message,
      });

      return {
        name: 'login',
      };
    }
  }

  return true;
}
```

`alertStore` instantiated only in `catch` block (lazy — avoids unnecessary store creation when auth succeeds).

### 4c: Migrate LoginView.vue

- [ ] **Step 4: Migrate LoginView.vue to `<script setup>`**

Current:
```vue
<template>
  <v-container fluid>
    <v-row
      align="center"
      style="height: 100vh">
      <v-col
        cols="12"
        class="d-flex justify-center">
        <v-sheet
          class="pa-7"
          width="600"
          color="white"
          elevation="3"
          rounded>
          <h1 class="mb-5">Авторизация</h1>
          <v-text-field
            v-model="controls.email"
            type="email"
            label="Введите Email"
            variant="outlined" />
          <v-text-field
            v-model="controls.password"
            type="password"
            label="Введите Пароль"
            variant="outlined" />

          <v-btn
            variant="flat"
            color="primary"
            @click="onSubmit">
            Войти
          </v-btn>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapMutations } from 'vuex';

import { ALERT_TYPES } from '@/shared/config';
import { Login } from '../api/auth-repository';

export default {
  name: 'LoginView',

  data() {
    return {
      controls: {
        email: null,
        password: null,
      },
    };
  },

  methods: {
    ...mapMutations('alert', ['ADD_ALERT']),
    ...mapMutations('auth', ['SET_AUTH_DATA']),

    async onSubmit() {
      try {
        const user = await Login({
          login: this.controls.email,
          password: this.controls.password,
        });

        this.SET_AUTH_DATA(user);

        this.$router.go(-1);
      } catch (error) {
        this.ADD_ALERT({ type: ALERT_TYPES.ERROR, text: error.message });
      }
    },
  },
};
</script>
```

New:
```vue
<template>
  <v-container fluid>
    <v-row
      align="center"
      style="height: 100vh">
      <v-col
        cols="12"
        class="d-flex justify-center">
        <v-sheet
          class="pa-7"
          width="600"
          color="white"
          elevation="3"
          rounded>
          <h1 class="mb-5">Авторизация</h1>
          <v-text-field
            v-model="controls.email"
            type="email"
            label="Введите Email"
            variant="outlined" />
          <v-text-field
            v-model="controls.password"
            type="password"
            label="Введите Пароль"
            variant="outlined" />

          <v-btn
            variant="flat"
            color="primary"
            @click="onSubmit">
            Войти
          </v-btn>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

import { useAuthStore } from '@/features/auth';
import { useAlertStore } from '@/entities/alert';
import { ALERT_TYPES } from '@/shared/config';
import { Login } from '@/features/auth';

const router = useRouter();

const authStore = useAuthStore();
const alertStore = useAlertStore();

const controls = reactive({
  email: null,
  password: null,
});

async function onSubmit() {
  try {
    const user = await Login({
      login: controls.email,
      password: controls.password,
    });

    authStore.setAuthData(user);

    router.go(-1);
  } catch (error) {
    alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: error.message });
  }
}
</script>
```

Changes: `this.SET_AUTH_DATA(user)` → `authStore.setAuthData(user)`, `this.ADD_ALERT(...)` → `alertStore.addAlert(...)`, `this.$router.go(-1)` → `router.go(-1)`, `data()` → `reactive()`, `this.controls.email` → `controls.email`.

### 4d: Migrate AdminLayout.vue

- [ ] **Step 5: Migrate AdminLayout.vue to `<script setup>`**

Current:
```vue
<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      color="blue-grey">
      <DrawerNavigation :nav-items="navItems" />
    </v-navigation-drawer>

    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer" />

      <v-toolbar-title class="text-subtitle-1">
        Панель администратора
      </v-toolbar-title>

      <v-menu>
        <template #activator="{ props }">
          <v-btn
            icon
            v-bind="props">
            <v-icon>mdi-cog-outline</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item>
            <v-btn
              variant="flat"
              width="100%"
              @click="showUserProfile = true">
              Профиль
            </v-btn>
          </v-list-item>
          <v-list-item>
            <v-btn
              variant="flat"
              width="100%"
              @click="logout">
              Выйти
            </v-btn>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>

    <CenterModal
      title="Профиль пользователя"
      :is-open="showUserProfile"
      @close="showUserProfile = false">
      <UserProfile
        v-if="showUserProfile"
        :is-open="showUserProfile"
        @success="showUserProfile = false"
        @cancel="showUserProfile = false" />
    </CenterModal>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

import { ALERT_TYPES } from '@/shared/config';

import DrawerNavigation from '@/shared/ui/DrawerNavigation.vue';
import { UserProfile } from '@/entities/user';

import { Logout } from '@/features/auth';

export default {
  name: 'AdminLayout',

  components: {
    DrawerNavigation,
    UserProfile,
  },

  data() {
    return {
      drawer: false,

      showUserProfile: false,

      navItems: [
        {
          title: 'Сводка',
          icon: 'mdi-chart-line',
          link: '/admin',
        },
        {
          title: 'Вопросы',
          icon: 'mdi-account-question',
          link: '/admin-questions',
        },
        {
          title: 'Записи в FAQ',
          icon: 'mdi-frequently-asked-questions',
          link: '/admin-faq',
        },
        {
          title: 'Спикеры',
          icon: 'mdi-account-tie-voice',
          link: '/admin-speakers',
        },
        {
          title: 'Области',
          icon: 'mdi-arrow-decision-outline',
          link: '/admin-areas',
        },
        {
          title: 'Обратная связь',
          icon: 'mdi-email-open-multiple-outline',
          link: '/admin-feedback',
        },
      ],
    };
  },

  methods: {
    ...mapMutations('alert', ['ADD_ALERT']),
    ...mapMutations('auth', ['REMOVE_AUTH_DATA']),

    async logout() {
      try {
        await Logout();

        this.REMOVE_AUTH_DATA();

        this.$router.push('/');

        this.ADD_ALERT({ type: ALERT_TYPES.SUCCESS, text: 'Успешный выход' });
      } catch (error) {
        this.ADD_ALERT({ type: ALERT_TYPES.ERROR, text: error.message });
      }
    },
  },
};
</script>
```

New:
```vue
<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      color="blue-grey">
      <DrawerNavigation :nav-items="navItems" />
    </v-navigation-drawer>

    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer" />

      <v-toolbar-title class="text-subtitle-1">
        Панель администратора
      </v-toolbar-title>

      <v-menu>
        <template #activator="{ props }">
          <v-btn
            icon
            v-bind="props">
            <v-icon>mdi-cog-outline</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item>
            <v-btn
              variant="flat"
              width="100%"
              @click="showUserProfile = true">
              Профиль
            </v-btn>
          </v-list-item>
          <v-list-item>
            <v-btn
              variant="flat"
              width="100%"
              @click="logout">
              Выйти
            </v-btn>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>

    <CenterModal
      title="Профиль пользователя"
      :is-open="showUserProfile"
      @close="showUserProfile = false">
      <UserProfile
        v-if="showUserProfile"
        :is-open="showUserProfile"
        @success="showUserProfile = false"
        @cancel="showUserProfile = false" />
    </CenterModal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { useAuthStore } from '@/features/auth';
import { useAlertStore } from '@/entities/alert';
import { ALERT_TYPES } from '@/shared/config';

import DrawerNavigation from '@/shared/ui/DrawerNavigation.vue';
import CenterModal from '@/shared/ui/center-modal';
import { UserProfile } from '@/entities/user';

import { Logout } from '@/features/auth';

const router = useRouter();

const authStore = useAuthStore();
const alertStore = useAlertStore();

const drawer = ref(false);
const showUserProfile = ref(false);

const navItems = [
  {
    title: 'Сводка',
    icon: 'mdi-chart-line',
    link: '/admin',
  },
  {
    title: 'Вопросы',
    icon: 'mdi-account-question',
    link: '/admin-questions',
  },
  {
    title: 'Записи в FAQ',
    icon: 'mdi-frequently-asked-questions',
    link: '/admin-faq',
  },
  {
    title: 'Спикеры',
    icon: 'mdi-account-tie-voice',
    link: '/admin-speakers',
  },
  {
    title: 'Области',
    icon: 'mdi-arrow-decision-outline',
    link: '/admin-areas',
  },
  {
    title: 'Обратная связь',
    icon: 'mdi-email-open-multiple-outline',
    link: '/admin-feedback',
  },
];

async function logout() {
  try {
    await Logout();

    authStore.removeAuthData();

    router.push('/');

    alertStore.addAlert({ type: ALERT_TYPES.SUCCESS, text: 'Успешный выход' });
  } catch (error) {
    alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: error.message });
  }
}
</script>
```

Note: `CenterModal` import needs to be verified — check what import AdminLayout uses for it currently. It's likely a global component, so may not need explicit import.

### 4e: Migrate UserProfile.vue

- [ ] **Step 6: Migrate UserProfile.vue to `<script setup>`**

Current:
```vue
<template>
  <VeeForm v-slot="{ meta, handleSubmit }">
    <CenterModalContentWrapper>
      <template #default>
        <template v-if="GET_USER_DATA.userRoleId == 2">
          <p><b>ФИО:</b> {{ GET_USER_DATA.userDetails.fullName }}</p>
          <p><b>Почта:</b> {{ GET_USER_DATA.userDetails.email }}</p>
          <p>
            <b>Доп. инфо:</b> {{ GET_USER_DATA.userDetails.additionalInfo }}
          </p>
        </template>

        <p><b>Id:</b> {{ GET_USER_DATA.id }}</p>
        <p><b>Логин:</b> {{ GET_USER_DATA.login }}</p>
        <p><b>Роль:</b> {{ getUserStringRole }}</p>
        <p>
          <b>Создан:</b>
          {{ new Date(GET_USER_DATA.сreated).toLocaleDateString() }}
        </p>
        <p>
          <b>Изменен:</b>
          {{
            GET_USER_DATA.updated
              ? new Date(GET_USER_DATA.updated).toLocaleDateString()
              : '-'
          }}
        </p>

        <template v-if="!showChangePassword">
          <v-btn
            class="mt-5"
            variant="flat"
            size="small"
            @click="showChangePassword = true">
            Изменить пароль
          </v-btn>
        </template>

        <div
          v-show="showChangePassword"
          class="mt-4">
          <VeeField
            v-slot="{ field, errors }"
            name="old-password"
            rules="required">
            <v-text-field
              v-bind="field"
              v-model="controls.password"
              label="Старый пароль"
              density="compact"
              variant="outlined"
              :error-messages="errors" />
          </VeeField>

          <VeeField
            v-slot="{ field, errors }"
            name="new-password"
            rules="required">
            <v-text-field
              v-bind="field"
              v-model="controls.newPassword"
              label="Новый пароль"
              density="compact"
              variant="outlined"
              :error-messages="errors" />
          </VeeField>

          <VeeField
            v-slot="{ field, errors }"
            name="new-password-confirm"
            rules="required|confirmed:@new-password">
            <v-text-field
              v-bind="field"
              v-model="controls.confirmPassword"
              label="Подтвердите новый пароль"
              density="compact"
              variant="outlined"
              :error-messages="errors" />
          </VeeField>
        </div>
      </template>
      <template #actions>
        <v-btn
          v-if="showChangePassword"
          :disabled="!meta.valid"
          color="primary"
          @click="handleSubmit(onSubmit)">
          Сохранить
        </v-btn>
        <v-btn
          color="blue-grey"
          variant="outlined"
          @click="$emit('cancel')">
          Отмена
        </v-btn>
      </template>
    </CenterModalContentWrapper>
  </VeeForm>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { ALERT_TYPES } from '@/shared/config';
import { ChangePassword } from '../api/user-repository';

export default {
  name: 'UserProfile',
  emits: ['success', 'cancel'],

  data() {
    return {
      controls: {
        password: null,
        newPassword: null,
        confirmPassword: null,
      },

      showChangePassword: false,
    };
  },

  computed: {
    ...mapGetters('auth', ['GET_USER_DATA']),

    getUserStringRole() {
      if (this.GET_USER_DATA.userRoleId === 1) {
        return 'Администратор';
      }

      return 'Спикер';
    },
  },

  methods: {
    ...mapMutations('alert', ['ADD_ALERT']),
    ...mapMutations('preloader', ['ADD_LOADER', 'REMOVE_LOADER']),

    async onSubmit() {
      try {
        this.ADD_LOADER();

        await ChangePassword(this.controls);

        this.ADD_ALERT({
          type: ALERT_TYPES.SUCCESS,
          text: 'Пароль успешно изменен',
        });

        this.$emit('success');
      } catch (error) {
        this.ADD_ALERT({ type: ALERT_TYPES.ERROR, text: error.message });
      } finally {
        this.REMOVE_LOADER();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
p {
  margin: 0;
}
</style>
```

New:
```vue
<template>
  <VeeForm v-slot="{ meta, handleSubmit }">
    <CenterModalContentWrapper>
      <template #default>
        <template v-if="getUserData.userRoleId == 2">
          <p><b>ФИО:</b> {{ getUserData.userDetails.fullName }}</p>
          <p><b>Почта:</b> {{ getUserData.userDetails.email }}</p>
          <p>
            <b>Доп. инфо:</b> {{ getUserData.userDetails.additionalInfo }}
          </p>
        </template>

        <p><b>Id:</b> {{ getUserData.id }}</p>
        <p><b>Логин:</b> {{ getUserData.login }}</p>
        <p><b>Роль:</b> {{ getUserStringRole }}</p>
        <p>
          <b>Создан:</b>
          {{ new Date(getUserData.сreated).toLocaleDateString() }}
        </p>
        <p>
          <b>Изменен:</b>
          {{
            getUserData.updated
              ? new Date(getUserData.updated).toLocaleDateString()
              : '-'
          }}
        </p>

        <template v-if="!showChangePassword">
          <v-btn
            class="mt-5"
            variant="flat"
            size="small"
            @click="showChangePassword = true">
            Изменить пароль
          </v-btn>
        </template>

        <div
          v-show="showChangePassword"
          class="mt-4">
          <VeeField
            v-slot="{ field, errors }"
            name="old-password"
            rules="required">
            <v-text-field
              v-bind="field"
              v-model="controls.password"
              label="Старый пароль"
              density="compact"
              variant="outlined"
              :error-messages="errors" />
          </VeeField>

          <VeeField
            v-slot="{ field, errors }"
            name="new-password"
            rules="required">
            <v-text-field
              v-bind="field"
              v-model="controls.newPassword"
              label="Новый пароль"
              density="compact"
              variant="outlined"
              :error-messages="errors" />
          </VeeField>

          <VeeField
            v-slot="{ field, errors }"
            name="new-password-confirm"
            rules="required|confirmed:@new-password">
            <v-text-field
              v-bind="field"
              v-model="controls.confirmPassword"
              label="Подтвердите новый пароль"
              density="compact"
              variant="outlined"
              :error-messages="errors" />
          </VeeField>
        </div>
      </template>
      <template #actions>
        <v-btn
          v-if="showChangePassword"
          :disabled="!meta.valid"
          color="primary"
          @click="handleSubmit(onSubmit)">
          Сохранить
        </v-btn>
        <v-btn
          color="blue-grey"
          variant="outlined"
          @click="emit('cancel')">
          Отмена
        </v-btn>
      </template>
    </CenterModalContentWrapper>
  </VeeForm>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { storeToRefs } from 'pinia';

import { useAuthStore } from '@/features/auth';
import { useAlertStore } from '@/entities/alert';
import { usePreloaderStore } from '@/features/preloader';
import { ALERT_TYPES } from '@/shared/config';
import { ChangePassword } from '@/entities/user';

const emit = defineEmits(['success', 'cancel']);

const authStore = useAuthStore();
const alertStore = useAlertStore();
const preloaderStore = usePreloaderStore();

const { getUserData } = storeToRefs(authStore);

const controls = reactive({
  password: null,
  newPassword: null,
  confirmPassword: null,
});

const showChangePassword = ref(false);

const getUserStringRole = computed(() => {
  if (getUserData.value.userRoleId === 1) {
    return 'Администратор';
  }

  return 'Спикер';
});

async function onSubmit() {
  try {
    preloaderStore.addLoader();

    await ChangePassword(controls);

    alertStore.addAlert({
      type: ALERT_TYPES.SUCCESS,
      text: 'Пароль успешно изменен',
    });

    emit('success');
  } catch (error) {
    alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: error.message });
  } finally {
    preloaderStore.removeLoader();
  }
}
</script>

<style lang="scss" scoped>
p {
  margin: 0;
}
</style>
```

Template changes: `GET_USER_DATA` → `getUserData`, `$emit('cancel')` → `emit('cancel')`.

### 4f: Remove Vuex entirely

- [ ] **Step 7: Delete app/store/store.js and remove Vuex from app/lib/index.js**

New `src/app/lib/index.js`:
```js
import router from '@/app/router';
import { createPinia } from 'pinia';

import vuetify from './vuetify';
import veeValidate from './vee-validate';
import setupHttpClientInterceptors from './http-client-interceptors';

export default function registerPlugins(app) {
  const pinia = createPinia();

  app.use(router).use(pinia).use(vuetify).use(veeValidate);

  setupHttpClientInterceptors();
}
```

Delete `src/app/store/store.js`.

- [ ] **Step 8: Run lint**

Run: `npm run lint`

- [ ] **Step 9: Commit**

```bash
git add src/features/auth/ src/app/layouts/AdminLayout.vue src/entities/user/ui/UserProfile.vue src/app/router/middleware/auth-middleware.js src/app/lib/index.js
git rm src/app/store/store.js
git commit -m "feat: migrate auth store to pinia and remove vuex"
```

---

## Task 5: Migrate remaining alert-only consumer components

These components only use `mapMutations('alert', ['ADD_ALERT'])` (some also use preloader). All follow the same pattern.

**Files:**
- Modify: `src/pages/admin/questions/ui/AdminQuestionsPage.vue`
- Modify: `src/features/feedback/ui/DeleteFeedbackModal.vue`
- Modify: `src/features/feedback/ui/SidebarFeedbackContent.vue`
- Modify: `src/entities/question/ui/QuestionFormCreate.vue`
- Modify: `src/entities/question/ui/QuestionsView.vue`
- Modify: `src/entities/faq/ui/DeleteEntry.vue`
- Modify: `src/entities/faq/ui/UpdateCategory.vue`
- Modify: `src/entities/faq/ui/DeleteCategory.vue`
- Modify: `src/entities/faq/ui/CreateCategory.vue`
- Modify: `src/entities/area/ui/CreateArea.vue`
- Modify: `src/entities/area/ui/UpdateArea.vue`
- Modify: `src/entities/area/ui/DeleteArea.vue`

Each component migration follows this pattern:
1. Replace `<script>` with `<script setup>`
2. Remove `import { mapMutations } from 'vuex'`
3. Add `import { useAlertStore } from '@/entities/alert'` (and `import { usePreloaderStore } from '@/features/preloader'` if it also uses preloader)
4. Add `const alertStore = useAlertStore()` and `const { addAlert } = alertStore`
5. Add `const preloaderStore = usePreloaderStore()` and `const { addLoader, removeLoader } = preloaderStore` if needed
6. Replace `this.ADD_ALERT(...)` → `alertStore.addAlert(...)`
7. Replace `this.ADD_LOADER()` → `preloaderStore.addLoader()`
8. Replace `this.REMOVE_LOADER()` → `preloaderStore.removeLoader()`
9. Convert `data()` → `ref()`/`reactive()`
10. Convert `this.$refs` → `useTemplateRef()` or `ref()` for template refs
11. Convert `this.$emit` → `defineEmits` + `emit()`
12. Convert `props` → `defineProps`
13. Convert `computed` → `computed()` from vue
14. Convert lifecycle hooks (`created` → onMounted or top-level await)
15. Remove `components` option (auto-resolved by `<script setup>`)

### 5a: AdminQuestionsPage.vue

- [ ] **Step 1: Migrate AdminQuestionsPage.vue**

Only uses `ADD_ALERT`. No preloader.

```vue
<template>
  <v-container fluid>
    <v-row class="pa-3">
      <v-col>
        <v-data-table
          v-model="selected"
          :headers="headers"
          :items="questions"
          item-key="id"
          show-select
          class="elevation-1">
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';

import { useAlertStore } from '@/entities/alert';
import { ALERT_TYPES } from '@/shared/config';
import { GetAllQuestions } from '@/entities/question';

const alertStore = useAlertStore();

const questions = ref([]);
const selected = ref([]);

const headers = [
  { title: 'Имя', key: 'author' },
  { title: 'Зона ответственности', key: 'zone' },
  { title: 'Спикер', key: 'speaker' },
  { title: 'Вопрос', key: 'text' },
  { title: 'Лайки', key: 'likes' },
  { title: 'Дизлайки', key: 'dislikes' },
  { title: 'Просмотры', key: 'views' },
  { title: 'Статус', key: 'status' },
  { title: 'Дата создания', key: 'сreated' },
  { title: 'Дата ответа', key: 'iron' },
];

async function fetchData() {
  try {
    questions.value = await GetAllQuestions();
  } catch (error) {
    alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: error.message });
  }
}

onMounted(fetchData);
</script>
```

### 5b: DeleteFeedbackModal.vue

- [ ] **Step 2: Migrate DeleteFeedbackModal.vue**

Only uses `ADD_ALERT`. No preloader.

```vue
<template>
  <CenterModalContentWrapper>
    <template #default>
      <p class="text-body-1">Вы действительно хотите удалить обратную связь?</p>
    </template>
    <template #actions>
      <v-btn
        variant="flat"
        color="primary"
        @click="confirm">
        Удалить
      </v-btn>
      <v-btn
        variant="outlined"
        color="blue-grey"
        @click="cancel">
        Отмена
      </v-btn>
    </template>
  </CenterModalContentWrapper>
</template>

<script setup>
import { useAlertStore } from '@/entities/alert';
import { ALERT_TYPES } from '@/shared/config';
import { Delete as DeleteFeedbackApi } from '@/features/feedback';

const props = defineProps({
  id: { type: String, required: true },
});

const emit = defineEmits(['success', 'cancel']);

const alertStore = useAlertStore();

async function confirm() {
  try {
    await DeleteFeedbackApi(props.id);

    alertStore.addAlert({
      type: ALERT_TYPES.SUCCESS,
      text: 'Обратная связь успешно удалена',
    });

    emit('success', props.id);
  } catch (error) {
    alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: error.message });
  }
}

function cancel() {
  emit('cancel');
}
</script>
```

### 5c: SidebarFeedbackContent.vue

- [ ] **Step 3: Migrate SidebarFeedbackContent.vue**

Uses `ADD_ALERT` + `ADD_LOADER`/`REMOVE_LOADER`.

```vue
<template>
  <SidebarContentWrapper title="Обратная связь">
    <template #default>
      <v-form
        ref="feedbackForm"
        class="ma-0 pa-0"
        @submit.prevent="submitForm">
        <v-row
          no-gutters
          class="mt-2">
          <v-col cols="12">
            <v-text-field
              v-model="controls.username"
              label="Имя"
              :rules="rules"
              density="compact"
              variant="outlined" />
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="controls.email"
              label="Email"
              :rules="rules"
              density="compact"
              variant="outlined" />
          </v-col>
          <v-col cols="12">
            <v-select
              v-model="controls.theme"
              label="Тема обращения"
              :items="themes"
              :rules="rules"
              variant="outlined"
              :menu-props="{ bottom: true, offsetY: true }" />
          </v-col>
          <v-col cols="12">
            <v-textarea
              v-model="controls.text"
              :rules="rules"
              label="Текст обращения"
              auto-grow
              variant="outlined" />
          </v-col>
        </v-row>
      </v-form>
    </template>
    <template #footer>
      <v-btn
        color="primary"
        @click="submitForm">
        Отправить
      </v-btn>
      <v-btn
        color="primary"
        variant="outlined"
        @click="modalClose">
        Отмена
      </v-btn>

      <v-btn
        color="primary"
        variant="outlined"
        @click="show">
        preloader
      </v-btn>
    </template>
  </SidebarContentWrapper>
</template>

<script setup>
import { ref, reactive } from 'vue';

import { useAlertStore } from '@/entities/alert';
import { usePreloaderStore } from '@/features/preloader';
import { ALERT_TYPES } from '@/shared/config';
import { Create } from '@/features/feedback';

const props = defineProps({
  showPreloader: { type: Function, required: true },
  modalConfirm: { type: Function, required: true },
  modalClose: { type: Function, required: true },
});

const alertStore = useAlertStore();
const preloaderStore = usePreloaderStore();

const feedbackForm = ref(null);

const themes = [
  'Технические проблемы в работе сайта',
  'Предложения, пожелания по работе или содержанию сайта',
];

const controls = reactive({
  username: null,
  email: null,
  theme: null,
  text: null,
});

const rules = [
  (v) => !!v || 'Обязательное поле!',
  (v) => (v && v.trim().length !== 0) || 'Поле не должно быть пустым!',
];

async function submitForm() {
  const { valid } = await feedbackForm.value.validate();

  if (!valid) {
    return;
  }

  try {
    preloaderStore.addLoader();
    await Create(controls);
    alertStore.addAlert({
      type: ALERT_TYPES.SUCCESS,
      text: 'Обратная связь отправлена',
    });
    props.modalConfirm();
  } catch (error) {
    alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: error.message });
  } finally {
    preloaderStore.removeLoader();
  }
}

function show() {
  props.showPreloader(true);
  setTimeout(() => {
    props.showPreloader(false);
  }, 2000);
}
</script>
```

Template change: `ref="feedback-form"` → `ref="feedbackForm"` (camelCase for template refs in `<script setup>`). Access via `feedbackForm.value`.

### 5d: QuestionFormCreate.vue

- [ ] **Step 4: Migrate QuestionFormCreate.vue**

Only uses `ADD_ALERT`. No preloader.

```vue
<template>
  <v-card
    elevation="6"
    color="#E8EAF6"
    width="600">
    <v-form
      ref="questionForm"
      v-model="valid"
      @submit.prevent="submitForm">
      <v-container
        fluid
        class="pa-2">
        <v-row
          no-gutters
          align="center">
          <v-col
            cols="9"
            sm="10">
            <v-textarea
              class="main-form-textarea"
              :rules="rules"
              rows="1"
              max-rows="3"
              auto-grow
              bg-color="white"
              variant="outlined"
              hide-details
              no-resize
              placeholder="Задайте вопрос"
              @change="showDetails" />
          </v-col>
          <v-col
            class="d-flex justify-end"
            style="max-width: 85px">
            <v-btn
              title="Дополнительные сведения"
              variant="flat"
              elevation="1"
              color="primary"
              @click="toggleForm">
              <v-icon>mdi-account-question</v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <v-expand-transition>
          <v-row
            v-show="details"
            no-gutters>
            <v-col
              cols="12"
              class="px-0 py-2 ma-0">
              <v-divider />
            </v-col>
            <v-col class="pa-2">
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="controls.author"
                    label="Имя" />
                </v-col>
                <v-col>
                  <v-select
                    v-model="controls.area"
                    :items="areas"
                    item-title="title"
                    item-value="title"
                    label="Область*"
                    :rules="rules"
                    :menu-props="{ bottom: true, offsetY: true }" />
                </v-col>
              </v-row>
              <v-row>
                <v-col class="pt-0">
                  <v-select
                    v-model="controls.speaker"
                    label="Спикер*"
                    :rules="rules"
                    :menu-props="{ bottom: true, offsetY: true }" />
                </v-col>
                <v-col class="pt-0">
                  <v-text-field
                    v-model="capctha"
                    label="Код*"
                    :rules="rules" />
                </v-col>
              </v-row>
              <v-row class="mt-0">
                <v-col
                  cols="6"
                  class="d-flex justify-center"
                  align-self="center">
                  <v-btn
                    type="submit"
                    elevation="1"
                    color="primary">
                    Отправить
                  </v-btn>
                </v-col>
                <v-col
                  cols="6"
                  class="d-flex justify-center">
                  <template v-if="capcthaImg">
                    <v-img
                      :src="capcthaImg"
                      style="width: 100%; max-width: 160px; height: 48px"
                      alt="captcha" />
                  </template>
                  <template v-else>
                    <v-icon
                      color="grey"
                      style="height: 48px">
                      mdi-spin mdi-autorenew
                    </v-icon>
                  </template>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-expand-transition>
      </v-container>
    </v-form>
  </v-card>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';

import { useAlertStore } from '@/entities/alert';
import { ALERT_TYPES } from '@/shared/config';
import { GetAllAreas } from '@/entities/area';
import { GetCapctha, Create } from '@/entities/question';

const alertStore = useAlertStore();

const questionForm = ref(null);
const valid = ref(true);
const details = ref(false);
const areas = ref([]);
const capcthaImg = ref(null);
const capctha = ref(null);

const controls = reactive({ text: null, author: null, speaker: null, area: null });

const rules = [
  (v) => !!v || 'Обязательное поле!',
  (v) => (v && v.trim().length !== 0) || 'Поле не должно быть пустым!',
];

function toggleForm() {
  if (!details.value) {
    getCapctha();
  }

  details.value = !details.value;
}

function showDetails() {
  if (!details.value) {
    toggleForm();
  }
}

async function getCapctha() {
  capcthaImg.value = null;

  try {
    capcthaImg.value = await GetCapctha();
  } catch (error) {
    alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: error.message });
  }
}

async function fetchAllAreas() {
  try {
    areas.value = await GetAllAreas();
  } catch (error) {
    alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: error.message });
  }
}

async function submitForm() {
  const result = await questionForm.value.validate();

  if (result.valid) {
    try {
      await Create(capctha.value, controls);

      toggleForm();

      questionForm.value.reset();

      alertStore.addAlert({
        type: ALERT_TYPES.SUCCESS,
        text: 'Ваш вопрос успешно добавлен',
      });
    } catch (error) {
      getCapctha();

      alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: error.message });
    }
  }
}

onMounted(fetchAllAreas);
</script>

<style lang="scss" scoped>
:deep(.main-form-textarea textarea) {
  margin: 3px;
}

:deep(.main-form-textarea textarea::-webkit-scrollbar) {
  width: 5px;
}

:deep(.main-form-textarea textarea::-webkit-scrollbar-track) {
  background: transparent;
}

:deep(.main-form-textarea textarea::-webkit-scrollbar-thumb) {
  border-radius: 5px;
  background-color: variables.$scrollbar-color;
}
</style>
```

Note: method `GetAllAreas` renamed to `fetchAllAreas` to avoid clash with imported `GetAllAreas` from API. Also renamed from the original `this.GetAllAreas()` which shadowed the import.

### 5e: QuestionsView.vue

- [ ] **Step 5: Migrate QuestionsView.vue**

Only uses `ADD_ALERT`. No preloader.

```vue
<template>
  <v-container
    fluid
    style="max-width: 1000px">
    <v-row no-gutters>
      <v-col
        cols="12"
        class="my-8">
        <h1 class="text-h4 text-sm-h3 text-center">Все вопросы</h1>
      </v-col>
    </v-row>

    <v-row
      no-gutters
      justify="center"
      class="mb-8">
      <v-col
        cols="12"
        sm="8">
        <v-text-field
          label="Поиск"
          variant="solo-inverted"
          prepend-inner-icon="mdi-magnify"
          clearable
          hide-details />
      </v-col>
    </v-row>

    <v-row
      no-gutters
      class="mb-3">
      <v-col
        cols="12"
        class="mb-4">
        <v-tabs
          v-model="model"
          :show-arrows="$vuetify.display.mobile"
          align-tabs="center">
          <v-tab
            value="#tab-1"
            style="width: 150px">
            Новые
            <v-icon class="ml-2 ml-sm-0">mdi-new-box</v-icon>
          </v-tab>
          <v-tab
            value="#tab-2"
            style="width: 150px">
            В фокусе
            <v-icon class="ml-2 ml-sm-0">mdi-crosshairs-question</v-icon>
          </v-tab>
          <v-tab
            value="#tab-3"
            style="width: 150px">
            Отвеченные
            <v-icon class="ml-2 ml-sm-0">mdi-bullhorn-outline</v-icon>
          </v-tab>
        </v-tabs>
      </v-col>
    </v-row>

    <v-row
      no-gutters
      class="mb-3">
      <v-col cols="12">
        <QuestionFilters />
      </v-col>
    </v-row>

    <template v-if="questions.length">
      <v-row
        no-gutters
        class="mb-5">
        <v-col cols="12">
          <v-window v-model="model">
            <v-window-item
              v-for="i in 3"
              :key="i"
              :value="`tab-${i}`">
              <QuestionCard
                v-for="question in questions"
                :key="question.id"
                :question="question" />
            </v-window-item>
          </v-window>
        </v-col>
      </v-row>

      <v-row
        no-gutters
        class="mb-5">
        <v-col cols="12">
          <v-pagination
            v-model="page"
            :length="15"
            :total-visible="7" />
        </v-col>
      </v-row>
    </template>

    <template v-else>
      <v-row
        no-gutters
        class="my-6">
        <v-col cols="12">
          <p
            style="margin: 0; color: grey; font-size: 22px; text-align: center">
            Вопросы отсутсвуют
          </p>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';

import { useAlertStore } from '@/entities/alert';
import { ALERT_TYPES } from '@/shared/config';
import { GetAll } from '@/entities/question';

import QuestionFilters from './QuestionFilters.vue';
import QuestionCard from './QuestionCard.vue';

const alertStore = useAlertStore();

const model = ref('tab-1');
const page = ref(1);
const questions = ref([]);

async function fetchData() {
  try {
    questions.value = await GetAll();
  } catch (error) {
    alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: error.message });
  }
}

onMounted(fetchData);
</script>
```

Note: API import path changes from `../api/questions-repository` to `@/entities/question`. Verify that `GetAll` is exported from `@/entities/question` public API.

### 5f: DeleteEntry.vue

- [ ] **Step 6: Migrate DeleteEntry.vue**

Only uses `ADD_ALERT`.

```vue
<template>
  <CenterModalContentWrapper>
    <template #default>
      <p class="text-body-1">Вы действительно хотите удалить запись?</p>
    </template>
    <template #actions>
      <v-btn
        variant="flat"
        color="primary"
        @click="confirm">
        Удалить
      </v-btn>
      <v-btn
        variant="outlined"
        color="blue-grey"
        @click="cancel">
        Отмена
      </v-btn>
    </template>
  </CenterModalContentWrapper>
</template>

<script setup>
import { useAlertStore } from '@/entities/alert';
import { ALERT_TYPES } from '@/shared/config';
import { Delete as DeleteEntry } from '@/entities/faq';

const props = defineProps({
  id: { type: String, required: true },
});

const emit = defineEmits(['success', 'cancel']);

const alertStore = useAlertStore();

async function confirm() {
  try {
    await DeleteEntry(props.id);

    alertStore.addAlert({
      type: ALERT_TYPES.SUCCESS,
      text: 'Запись успешно удалена',
    });

    emit('success', props.id);
  } catch (error) {
    alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: error.message });
  }
}

function cancel() {
  emit('cancel');
}
</script>
```

### 5g: UpdateCategory.vue

- [ ] **Step 7: Migrate UpdateCategory.vue**

Only uses `ADD_ALERT`.

```vue
<template>
  <CenterModalContentWrapper>
    <template #default>
      <v-text-field
        v-model="name"
        label="Имя"
        variant="outlined" />
    </template>
    <template #actions>
      <v-btn
        variant="flat"
        color="primary"
        @click="submitForm">
        Изменить
      </v-btn>
      <v-btn
        variant="outlined"
        color="blue-grey"
        @click="cancel">
        Отмена
      </v-btn>
    </template>
  </CenterModalContentWrapper>
</template>

<script setup>
import { ref } from 'vue';

import { useAlertStore } from '@/entities/alert';
import { ALERT_TYPES } from '@/shared/config';
import { Update as UpdateCategory } from '@/entities/faq';

const props = defineProps({
  category: { type: Object, required: true },
  isOpen: { type: Boolean, required: true },
});

const emit = defineEmits(['success', 'cancel']);

const alertStore = useAlertStore();

const name = ref(props.category.name);

async function submitForm() {
  try {
    await UpdateCategory({ id: props.category.id, name: name.value });

    alertStore.addAlert({
      type: ALERT_TYPES.SUCCESS,
      text: 'Категория успешно изменена',
    });

    emit('success', name.value);
  } catch (error) {
    alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: error.message });
  }
}

function cancel() {
  emit('cancel');
}
</script>
```

Note: Verify the exact props and API imports from the original file. The exact template may differ — check original `UpdateCategory.vue` content.

### 5h: DeleteCategory.vue

- [ ] **Step 8: Migrate DeleteCategory.vue**

Only uses `ADD_ALERT`.

```vue
<template>
  <CenterModalContentWrapper>
    <template #default>
      <p class="text-body-1">Вы действительно хотите удалить категорию?</p>
    </template>
    <template #actions>
      <v-btn
        variant="flat"
        color="primary"
        @click="confirm">
        Удалить
      </v-btn>
      <v-btn
        variant="outlined"
        color="blue-grey"
        @click="cancel">
        Отмена
      </v-btn>
    </template>
  </CenterModalContentWrapper>
</template>

<script setup>
import { useAlertStore } from '@/entities/alert';
import { ALERT_TYPES } from '@/shared/config';
import { Delete as DeleteCategory } from '@/entities/faq';

const props = defineProps({
  id: { type: String, required: true },
  isOpen: { type: Boolean, required: true },
});

const emit = defineEmits(['success', 'cancel']);

const alertStore = useAlertStore();

async function confirm() {
  try {
    await DeleteCategory(props.id);

    alertStore.addAlert({
      type: ALERT_TYPES.SUCCESS,
      text: 'Категория успешно удалена',
    });

    emit('success', props.id);
  } catch (error) {
    alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: error.message });
  }
}

function cancel() {
  emit('cancel');
}
</script>
```

### 5i: CreateCategory.vue

- [ ] **Step 9: Migrate CreateCategory.vue**

Only uses `ADD_ALERT`.

```vue
<template>
  <CenterModalContentWrapper>
    <template #default>
      <v-text-field
        v-model="name"
        label="Имя"
        variant="outlined" />
    </template>
    <template #actions>
      <v-btn
        variant="flat"
        color="primary"
        @click="submitForm">
        Создать
      </v-btn>
      <v-btn
        variant="outlined"
        color="blue-grey"
        @click="cancel">
        Отмена
      </v-btn>
    </template>
  </CenterModalContentWrapper>
</template>

<script setup>
import { ref } from 'vue';

import { useAlertStore } from '@/entities/alert';
import { ALERT_TYPES } from '@/shared/config';
import { Create as CreateCategory } from '@/entities/faq';

const props = defineProps({
  order: { type: Number, required: true },
  isOpen: { type: Boolean, required: true },
});

const emit = defineEmits(['success', 'cancel']);

const alertStore = useAlertStore();

const name = ref(null);

async function submitForm() {
  try {
    const category = await CreateCategory({ name: name.value, order: props.order });

    alertStore.addAlert({
      type: ALERT_TYPES.SUCCESS,
      text: 'Категория успешно создана',
    });

    emit('success', category);
  } catch (error) {
    alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: error.message });
  }
}

function cancel() {
  emit('cancel');
}
</script>
```

### 5j: CreateArea.vue

- [ ] **Step 10: Migrate CreateArea.vue**

Only uses `ADD_ALERT`.

```vue
<template>
  <CenterModalContentWrapper>
    <template #default>
      <v-text-field
        v-model="title"
        label="Название"
        variant="outlined" />
    </template>
    <template #actions>
      <v-btn
        variant="flat"
        color="primary"
        @click="submitForm">
        Создать
      </v-btn>
      <v-btn
        variant="outlined"
        color="blue-grey"
        @click="cancel">
        Отмена
      </v-btn>
    </template>
  </CenterModalContentWrapper>
</template>

<script setup>
import { ref } from 'vue';

import { useAlertStore } from '@/entities/alert';
import { ALERT_TYPES } from '@/shared/config';
import { Create as CreateArea } from '@/entities/area';

const props = defineProps({
  order: { type: Number, required: true },
  isOpen: { type: Boolean, required: true },
});

const emit = defineEmits(['success', 'cancel']);

const alertStore = useAlertStore();

const title = ref(null);

async function submitForm() {
  try {
    const area = await CreateArea({ title: title.value, order: props.order });

    alertStore.addAlert({
      type: ALERT_TYPES.SUCCESS,
      text: 'Область успешно создана',
    });

    emit('success', area);
  } catch (error) {
    alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: error.message });
  }
}

function cancel() {
  emit('cancel');
}
</script>
```

### 5k: UpdateArea.vue

- [ ] **Step 11: Migrate UpdateArea.vue**

Only uses `ADD_ALERT`.

```vue
<template>
  <CenterModalContentWrapper>
    <template #default>
      <v-text-field
        v-model="title"
        label="Название"
        variant="outlined" />
    </template>
    <template #actions>
      <v-btn
        variant="flat"
        color="primary"
        @click="submitForm">
        Изменить
      </v-btn>
      <v-btn
        variant="outlined"
        color="blue-grey"
        @click="cancel">
        Отмена
      </v-btn>
    </template>
  </CenterModalContentWrapper>
</template>

<script setup>
import { ref } from 'vue';

import { useAlertStore } from '@/entities/alert';
import { ALERT_TYPES } from '@/shared/config';
import { Update as UpdateArea } from '@/entities/area';

const props = defineProps({
  area: { type: Object, required: true },
  isOpen: { type: Boolean, required: true },
});

const emit = defineEmits(['success', 'cancel']);

const alertStore = useAlertStore();

const title = ref(props.area.title);

async function submitForm() {
  try {
    await UpdateArea({ id: props.area.id, title: title.value });

    alertStore.addAlert({
      type: ALERT_TYPES.SUCCESS,
      text: 'Область успешно изменена',
    });

    emit('success', { ...props.area, title: title.value });
  } catch (error) {
    alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: error.message });
  }
}

function cancel() {
  emit('cancel');
}
</script>
```

### 5l: DeleteArea.vue

- [ ] **Step 12: Migrate DeleteArea.vue**

Only uses `ADD_ALERT`.

```vue
<template>
  <CenterModalContentWrapper>
    <template #default>
      <p class="text-body-1">Вы действительно хотите удалить область?</p>
    </template>
    <template #actions>
      <v-btn
        variant="flat"
        color="primary"
        @click="confirm">
        Удалить
      </v-btn>
      <v-btn
        variant="outlined"
        color="blue-grey"
        @click="cancel">
        Отмена
      </v-btn>
    </template>
  </CenterModalContentWrapper>
</template>

<script setup>
import { useAlertStore } from '@/entities/alert';
import { ALERT_TYPES } from '@/shared/config';
import { Delete as DeleteArea } from '@/entities/area';

const props = defineProps({
  id: { type: String, required: true },
  isOpen: { type: Boolean, required: true },
});

const emit = defineEmits(['success', 'cancel']);

const alertStore = useAlertStore();

async function confirm() {
  try {
    await DeleteArea(props.id);

    alertStore.addAlert({
      type: ALERT_TYPES.SUCCESS,
      text: 'Область успешно удалена',
    });

    emit('success', props.id);
  } catch (error) {
    alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: error.message });
  }
}

function cancel() {
  emit('cancel');
}
</script>
```

### 5m: Run lint and commit

- [ ] **Step 13: Run lint**

Run: `npm run lint`

- [ ] **Step 14: Commit**

```bash
git add src/pages/admin/questions/ src/features/feedback/ src/entities/question/ src/entities/faq/ src/entities/area/
git commit -m "feat: migrate remaining components to composition api and pinia"
```

---

## Task 6: Migrate preloader+alert consumer components (admin pages)

These components use both `ADD_ALERT` and `ADD_LOADER`/`REMOVE_LOADER`. They were partially handled in Task 2 (preloader store) but still use Vuex for alert. Now that alert store is also migrated, complete their migration.

**Files:**
- Modify: `src/pages/admin/faq/ui/AdminFAQPage.vue`
- Modify: `src/pages/admin/faq/ui/AdminFAQCategoryPage.vue`
- Modify: `src/pages/admin/areas/ui/AdminAreasPage.vue`
- Modify: `src/pages/admin/feedback/ui/AdminFeedbackPage.vue`
- Modify: `src/entities/faq/ui/FAQView.vue`
- Modify: `src/entities/faq/ui/UpdateEntryContent.vue`
- Modify: `src/entities/faq/ui/CreateEntryContent.vue`

### 6a: AdminFAQPage.vue

- [ ] **Step 1: Migrate AdminFAQPage.vue**

Uses `ADD_ALERT` + `ADD_LOADER`/`REMOVE_LOADER` + Draggable computed setter.

```vue
<template>
  <v-container
    style="max-width: 1200px"
    class="text-left pa-5 mx-auto"
    fluid>
    <template v-if="isMainCatalog">
      <v-row>
        <v-col cols="12">
          <v-row>
            <v-col cols="12">
              <h1 class="text-h6 text-sm-h5">Категории FAQ</h1>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-btn
                size="small"
                color="blue-grey"
                @click="showCreateCategory = true">
                Добавить категорию
                <v-icon
                  end
                  theme="dark">
                  mdi-plus
                </v-icon>
              </v-btn>
            </v-col>
          </v-row>

          <Draggable
            v-model="draggableCategories"
            v-bind="dragOptions"
            class="v-row"
            item-key="id"
            handle=".draggable"
            draggable=".draggable"
            drag-class="vuedraggable-drag"
            ghost-class="vuedraggable-ghost">
            <template #item="{ element }">
              <v-col
                :key="element.id"
                cols="12"
                sm="4"
                md="4"
                lg="3"
                class="draggable">
                <CategoryCard :category="element" />
              </v-col>
            </template>
          </Draggable>
        </v-col>
      </v-row>

      <CenterModal
        title="Создать категорию "
        :is-open="showCreateCategory"
        @close="showCreateCategory = false">
        <CreateCategory
          :order="categories.length"
          :is-open="showCreateCategory"
          @success="successCreateCategory"
          @cancel="showCreateCategory = false" />
      </CenterModal>
    </template>

    <router-view></router-view>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

import Draggable from 'vuedraggable';

import { useAlertStore } from '@/entities/alert';
import { usePreloaderStore } from '@/features/preloader';
import { ALERT_TYPES } from '@/shared/config';
import {
  GetAllCategories,
  SetCategoryOrder,
  CategoryCard,
  CreateCategory,
} from '@/entities/faq';

const route = useRoute();

const alertStore = useAlertStore();
const preloaderStore = usePreloaderStore();

const categories = ref([]);
const showCreateCategory = ref(false);

const dragOptions = {
  animation: 150,
  group: 'categories',
  disabled: false,
  forceFallback: true,
};

const isMainCatalog = computed(() => route.name === 'admin-faq');

const draggableCategories = computed({
  get() {
    return categories.value;
  },

  async set(newOrderCategories) {
    const oldOrderCategories = [...categories.value];

    categories.value = newOrderCategories;

    try {
      preloaderStore.addLoader();
      const categoryIds = newOrderCategories.map((category) => category.id);
      await SetCategoryOrder(categoryIds);
      alertStore.addAlert({
        type: ALERT_TYPES.SUCCESS,
        text: 'Сортировка применена',
      });
    } catch (error) {
      categories.value = oldOrderCategories;
      alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: error.message });
    } finally {
      preloaderStore.removeLoader();
    }
  },
});

async function fetchData() {
  try {
    preloaderStore.addLoader();
    categories.value = await GetAllCategories();
  } catch (error) {
    alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: error.message });
  } finally {
    preloaderStore.removeLoader();
  }
}

function successCreateCategory(category) {
  categories.value = [...categories.value, category];
  showCreateCategory.value = false;
}

onMounted(() => {
  if (isMainCatalog.value) {
    fetchData();
  }
});
</script>
```

### 6b: AdminFAQCategoryPage.vue

- [ ] **Step 2: Migrate AdminFAQCategoryPage.vue**

Uses `ADD_ALERT` + `ADD_LOADER`/`REMOVE_LOADER` + template refs + Draggable computed setter. This is the most complex component.

```vue
<template>
  <div v-if="category">
    <v-row>
      <v-col cols="12">
        <v-row>
          <v-col
            cols="12"
            class="d-flex align-center">
            <h1 class="text-h6 text-sm-h5 mr-4">
              Категория: {{ category.name }}
            </h1>

            <v-btn
              title="Изменить"
              icon
              variant="flat"
              size="x-small"
              @click="showUpdateCategory = true">
              <v-icon size="20">mdi-pencil-outline</v-icon>
            </v-btn>

            <v-btn
              title="Удалить"
              icon
              variant="flat"
              size="x-small"
              @click="showDeleteCategory = true">
              <v-icon size="20">mdi-delete-outline</v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-btn
              size="small"
              color="blue-grey"
              @click="showCreateEntryModal">
              Добавить запись
              <v-icon
                end
                theme="dark">
                mdi-plus
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <Draggable
          v-model="draggableEntries"
          v-bind="dragOptions"
          class="v-row"
          item-key="id"
          handle=".handle"
          draggable=".draggable"
          drag-class="vuedraggable-drag"
          ghost-class="vuedraggable-ghost">
          <template #item="{ element }">
            <v-col
              cols="12"
              class="draggable">
              <EntryCard
                :entry="element"
                @copy-link="copyLink(element)"
                @update="showUpdateEntryModal(element)"
                @delete="clickDeleteEntryBtn(element)" />
            </v-col>
          </template>
        </Draggable>
      </v-col>
    </v-row>

    <CenterModal
      title="Изменить категорию "
      :is-open="showUpdateCategory"
      @close="showUpdateCategory = false">
      <UpdateCategory
        v-if="showUpdateCategory"
        :category="category"
        :is-open="showUpdateCategory"
        @success="successUpdateCategory"
        @cancel="showUpdateCategory = false" />
    </CenterModal>

    <CenterModal
      title="Удалить категорию "
      :is-open="showDeleteCategory"
      @close="showDeleteCategory = false">
      <DeleteCategory
        v-if="showDeleteCategory"
        :id="id"
        :is-open="showDeleteCategory"
        @success="successDeleteCategory"
        @cancel="showDeleteCategory = false" />
    </CenterModal>

    <SidebarModal ref="createEntryModal">
      <template #default="{ confirm, close }">
        <CreateEntryContent
          :modal-confirm="confirm"
          :modal-close="close"
          :category-id="category.id"
          :order="category.entries.length" />
      </template>
    </SidebarModal>

    <SidebarModal ref="updateEntryModal">
      <template #default="{ confirm, close }">
        <UpdateEntryContent
          :modal-confirm="confirm"
          :modal-close="close"
          :entry="currentEntry" />
      </template>
    </SidebarModal>

    <CenterModal
      title="Удалить запись "
      :is-open="showDeleteEntry"
      @close="showDeleteEntry = false">
      <DeleteEntryModal
        v-if="showDeleteEntry"
        :id="currentEntry.id"
        :is-open="showDeleteEntry"
        @success="successDeleteEntry"
        @cancel="showDeleteEntry = false" />
    </CenterModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import Draggable from 'vuedraggable';

import { useAlertStore } from '@/entities/alert';
import { usePreloaderStore } from '@/features/preloader';
import { ALERT_TYPES } from '@/shared/config';

import {
  GetCategoryById,
  SetEntryOrder,
  EntryCard,
  UpdateCategory,
  DeleteCategory,
  DeleteEntryModal,
  CreateEntryContent,
  UpdateEntryContent,
} from '@/entities/faq';

import { copyToClipboard } from '@/shared/lib';

const props = defineProps({
  id: { type: String, required: true },
});

const router = useRouter();

const alertStore = useAlertStore();
const preloaderStore = usePreloaderStore();

const category = ref(null);
const currentEntry = ref(null);

const showUpdateCategory = ref(false);
const showDeleteCategory = ref(false);
const showDeleteEntry = ref(false);

const createEntryModal = ref(null);
const updateEntryModal = ref(null);

const dragOptions = {
  animation: 150,
  group: 'entries',
  disabled: false,
  forceFallback: true,
};

const draggableEntries = computed({
  get() {
    return category.value.entries;
  },

  async set(newOrderEntries) {
    const oldOrderEntries = [...category.value.entries];

    category.value.entries = newOrderEntries;

    try {
      preloaderStore.addLoader();
      const entryIds = newOrderEntries.map((entry) => entry.id);
      await SetEntryOrder(entryIds);
      alertStore.addAlert({
        type: ALERT_TYPES.SUCCESS,
        text: 'Сортировка применена',
      });
    } catch (error) {
      category.value.entries = oldOrderEntries;
      alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: error.message });
    } finally {
      preloaderStore.removeLoader();
    }
  },
});

async function fetchData() {
  try {
    preloaderStore.addLoader();
    category.value = await GetCategoryById(props.id);
  } catch (error) {
    alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: error.message });
  } finally {
    preloaderStore.removeLoader();
  }
}

async function showCreateEntryModal() {
  const result = await createEntryModal.value.open();

  if (result.status) {
    const entry = result.data;
    category.value.entries.push(entry);
  }
}

async function showUpdateEntryModal(entry) {
  currentEntry.value = entry;

  const result = await updateEntryModal.value.open();

  if (result.status) {
    const modifiedEntry = result.data;

    category.value.entries = category.value.entries.map((e) =>
      e.id === modifiedEntry.id ? modifiedEntry : e,
    );
  }
}

function successUpdateCategory(name) {
  category.value.name = name;

  showUpdateCategory.value = false;
}

function successDeleteCategory() {
  showDeleteCategory.value = false;

  router.push({ name: 'admin-faq' });
}

function copyLink(entry) {
  const link = `${window.location.protocol}//${window.location.host}/faq?id=${entry.id}`;

  copyToClipboard(link)
    .then(() => {
      alertStore.addAlert({
        type: ALERT_TYPES.SUCCESS,
        text: 'Ссылка скопирована в буфер обмена',
      });
    })
    .catch((error) => {
      alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: error.message });
    });
}

function clickDeleteEntryBtn(entry) {
  currentEntry.value = entry;
  showDeleteEntry.value = true;
}

function successDeleteEntry(id) {
  category.value.entries = category.value.entries.filter(
    (entry) => entry.id !== id,
  );
  showDeleteEntry.value = false;
}

onMounted(fetchData);
</script>
```

Template ref changes: `ref="create-entry-modal"` → `ref="createEntryModal"`, `ref="update-entry-modal"` → `ref="updateEntryModal"`.

### 6c: AdminAreasPage.vue

- [ ] **Step 3: Migrate AdminAreasPage.vue**

Uses `ADD_ALERT` + `ADD_LOADER`/`REMOVE_LOADER` + Draggable computed setter.

```vue
<template>
  <v-container
    style="max-width: 1200px"
    class="text-left pa-5 mx-auto"
    fluid>
    <v-row>
      <v-col cols="12">
        <v-row>
          <v-col
            cols="12"
            class="d-flex align-center">
            <h1 class="text-h6 text-sm-h5 mr-4">Области</h1>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-btn
              size="small"
              color="blue-grey"
              @click="showCreateArea = true">
              Добавить область
              <v-icon
                end
                theme="dark">
                mdi-plus
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <Draggable
          v-model="draggableAreas"
          v-bind="dragOptions"
          class="v-row"
          item-key="id"
          handle=".handle"
          draggable=".draggable"
          drag-class="vuedraggable-drag"
          ghost-class="vuedraggable-ghost">
          <template #item="{ element }">
            <v-col
              :key="element.id"
              cols="12"
              class="draggable">
              <AreaCard
                :area="element"
                @update="clickUpdateAreaBtn(element)"
                @delete="clickDeleteAreaBtn(element)" />
            </v-col>
          </template>
        </Draggable>
      </v-col>
    </v-row>

    <CenterModal
      title="Создать область"
      :is-open="showCreateArea"
      @close="showCreateArea = false">
      <CreateArea
        :order="areas.length"
        :is-open="showCreateArea"
        @success="successCreateArea"
        @cancel="showCreateArea = false" />
    </CenterModal>

    <CenterModal
      title="Изменить область "
      :is-open="showUpdateArea"
      @close="showUpdateArea = false">
      <UpdateArea
        v-if="showUpdateArea"
        :area="currentArea"
        :is-open="showUpdateArea"
        @success="successUpdateArea"
        @cancel="showUpdateArea = false" />
    </CenterModal>

    <CenterModal
      title="Удалить запись "
      :is-open="showDeleteArea"
      @close="showDeleteArea = false">
      <DeleteArea
        v-if="showDeleteArea"
        :id="currentArea.id"
        :is-open="showDeleteArea"
        @success="successDeleteArea"
        @cancel="showDeleteArea = false" />
    </CenterModal>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

import Draggable from 'vuedraggable';

import { useAlertStore } from '@/entities/alert';
import { usePreloaderStore } from '@/features/preloader';
import { ALERT_TYPES } from '@/shared/config';

import {
  GetAllAreas,
  SetAreaOrder,
  AreaCard,
  CreateArea,
  UpdateArea,
  DeleteArea,
} from '@/entities/area';

const alertStore = useAlertStore();
const preloaderStore = usePreloaderStore();

const areas = ref([]);
const currentArea = ref(null);

const showCreateArea = ref(false);
const showUpdateArea = ref(false);
const showDeleteArea = ref(false);

const dragOptions = {
  animation: 150,
  group: 'areas',
  disabled: false,
  forceFallback: true,
};

const draggableAreas = computed({
  get() {
    return areas.value;
  },

  async set(newOrderAreas) {
    const oldOrderAreas = [...areas.value];

    areas.value = newOrderAreas;

    try {
      preloaderStore.addLoader();
      const areaIds = newOrderAreas.map((area) => area.id);
      await SetAreaOrder(areaIds);
      alertStore.addAlert({
        type: ALERT_TYPES.SUCCESS,
        text: 'Сортировка применена',
      });
    } catch (error) {
      areas.value = oldOrderAreas;
      alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: error.message });
    } finally {
      preloaderStore.removeLoader();
    }
  },
});

async function fetchData() {
  try {
    preloaderStore.addLoader();
    areas.value = await GetAllAreas();
  } catch (error) {
    alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: error.message });
  } finally {
    preloaderStore.removeLoader();
  }
}

function successCreateArea(area) {
  areas.value = [...areas.value, area];
  showCreateArea.value = false;
}

function clickUpdateAreaBtn(area) {
  currentArea.value = area;
  showUpdateArea.value = true;
}

function successUpdateArea(modifiedArea) {
  areas.value = areas.value.map((area) =>
    area.id === modifiedArea.id ? modifiedArea : area,
  );

  showUpdateArea.value = false;
}

function clickDeleteAreaBtn(area) {
  currentArea.value = area;
  showDeleteArea.value = true;
}

function successDeleteArea(id) {
  areas.value = areas.value.filter((area) => area.id !== id);
  showDeleteArea.value = false;
}

onMounted(fetchData);
</script>
```

### 6d: AdminFeedbackPage.vue

- [ ] **Step 4: Migrate AdminFeedbackPage.vue**

Uses `ADD_ALERT` + `ADD_LOADER`/`REMOVE_LOADER`.

```vue
<template>
  <v-container
    style="max-width: 1200px"
    class="text-left pa-5 mx-auto"
    fluid>
    <v-row>
      <v-col cols="12">
        <v-row>
          <v-col cols="12">
            <h1 class="text-h6 text-sm-h5">Обратная связь</h1>
          </v-col>
        </v-row>

        <template v-if="feedbacks.length">
          <v-row>
            <v-col
              v-for="feedback in feedbacks"
              :key="feedback.id"
              cols="12">
              <FeedbackCard
                :feedback="feedback"
                @delete="clickDeleteFeedbackBtn(feedback)" />
            </v-col>
          </v-row>
        </template>
        <template v-else>
          <v-row>
            <v-col cols="12">
              <p>Обратная связь отсутствует</p>
            </v-col>
          </v-row>
        </template>
      </v-col>
    </v-row>

    <CenterModal
      title="Удалить обратную связь"
      :is-open="showDeleteFeedback"
      @close="showDeleteFeedback = false">
      <DeleteFeedbackModal
        v-if="showDeleteFeedback"
        :id="currentFeedback.id"
        @success="successDeleteFeedback"
        @cancel="showDeleteFeedback = false" />
    </CenterModal>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';

import { useAlertStore } from '@/entities/alert';
import { usePreloaderStore } from '@/features/preloader';
import { ALERT_TYPES } from '@/shared/config';

import {
  GetAllFeedback,
  FeedbackCard,
  DeleteFeedbackModal,
} from '@/features/feedback';

const alertStore = useAlertStore();
const preloaderStore = usePreloaderStore();

const feedbacks = ref([]);
const currentFeedback = ref(null);
const showDeleteFeedback = ref(false);

async function fetchData() {
  try {
    preloaderStore.addLoader();
    feedbacks.value = await GetAllFeedback();
  } catch (error) {
    alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: error.message });
  } finally {
    preloaderStore.removeLoader();
  }
}

function clickDeleteFeedbackBtn(feedback) {
  currentFeedback.value = feedback;
  showDeleteFeedback.value = true;
}

function successDeleteFeedback(id) {
  feedbacks.value = feedbacks.value.filter((feedback) => feedback.id !== id);
  showDeleteFeedback.value = false;
}

onMounted(fetchData);
</script>
```

### 6e: FAQView.vue

- [ ] **Step 5: Migrate FAQView.vue**

Uses `ADD_ALERT` + `ADD_LOADER`/`REMOVE_LOADER`.

```vue
<template>
  <v-container
    fluid
    style="max-width: 1400px">
    <v-row no-gutters>
      <v-col
        cols="12"
        class="my-8">
        <h1 class="text-h4 text-sm-h3 text-center">Часто задаваемые вопросы</h1>
      </v-col>
    </v-row>

    <template v-if="categories.length">
      <v-row
        v-for="category in categories"
        :key="category.id"
        justify="center"
        class="mb-8">
        <v-col
          cols="12"
          sm="3">
          <h2 class="text-h6 text-sm-h5 mb-3 section-title">
            {{ category.name }}
          </h2>
        </v-col>
        <v-col
          cols="12"
          sm="9">
          <v-expansion-panels
            selected-class="active-panel"
            variant="accordion">
            <v-expansion-panel
              v-for="entry in category.entries"
              :id="entry.id"
              :key="entry.id">
              <v-expansion-panel-title>
                <span class="question">{{ entry.question }}</span>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <div v-html="entry.answer"></div>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
    </template>

    <template v-else>
      <v-row>
        <v-col cols="12">
          <p style="color: grey; font-size: 24px; text-align: center">
            Записи отсутсвуют
          </p>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

import { useAlertStore } from '@/entities/alert';
import { usePreloaderStore } from '@/features/preloader';
import { ALERT_TYPES } from '@/shared/config';

import { GetAllWithEntries } from '@/entities/faq';

const route = useRoute();

const alertStore = useAlertStore();
const preloaderStore = usePreloaderStore();

const categories = ref([]);

async function fetchData() {
  try {
    preloaderStore.addLoader();
    categories.value = await GetAllWithEntries();
  } catch (error) {
    alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: error.message });
  } finally {
    preloaderStore.removeLoader();
  }
}

onMounted(() => {
  fetchData();

  const { id } = route.query;

  if (id) {
    setTimeout(() => {
      const element = document.getElementById(id);

      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });

        element.children[0].click();
      }
    }, 100);
  }
});
</script>

<style lang="scss" scoped>
.section-title {
  padding-left: 10px;
  border-left: 5px solid variables.$main-color;
}

.question {
  font-size: 18px;
}

.active-panel .question {
  color: variables.$main-color;
}
</style>
```

### 6f: UpdateEntryContent.vue

- [ ] **Step 6: Migrate UpdateEntryContent.vue**

Uses `ADD_ALERT` + `ADD_LOADER`/`REMOVE_LOADER`.

```vue
<template>
  <SidebarContentWrapper title="Изменить запись в FAQ">
    <template #default>
      <v-form
        ref="updateEntryForm"
        v-model="valid"
        @submit.prevent="submitForm">
        <v-row
          no-gutters
          class="mt-2">
          <v-col cols="12">
            <v-text-field
              v-model="controls.question"
              :rules="rules"
              label="Вопрос"
              variant="outlined" />
          </v-col>

          <v-col cols="12">
            <RichEditor v-model="controls.answer" />
          </v-col>
        </v-row>
      </v-form>
    </template>
    <template #footer>
      <v-btn
        variant="flat"
        color="primary"
        @click="submitForm">
        Изменить
      </v-btn>
      <v-btn
        variant="outlined"
        color="blue-grey"
        @click="modalClose">
        Отмена
      </v-btn>
    </template>
  </SidebarContentWrapper>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';

import sanitizeHtml from '@/shared/lib/html-sanitize';

import { useAlertStore } from '@/entities/alert';
import { usePreloaderStore } from '@/features/preloader';
import { ALERT_TYPES } from '@/shared/config';
import RichEditor from '@/shared/ui/rich-editor';

import { Update as UpdateEntry } from '@/entities/faq';

const props = defineProps({
  modalConfirm: { type: Function, required: true },
  modalClose: { type: Function, required: true },
  entry: { type: Object, required: true },
});

const alertStore = useAlertStore();
const preloaderStore = usePreloaderStore();

const updateEntryForm = ref(null);
const valid = ref(false);

const controls = reactive({
  question: null,
  answer: null,
});

const rules = [
  (v) => !!v || 'Обязательное поле!',
  (v) => (v && v.trim().length !== 0) || 'Поле не должно быть пустым!',
];

onMounted(() => {
  controls.question = props.entry.question;
  controls.answer = props.entry.answer;
});

async function submitForm() {
  if (updateEntryForm.value.validate()) {
    try {
      preloaderStore.addLoader();

      const entry = {
        id: props.entry.id,
        question: controls.question,
        answer: sanitizeHtml(controls.answer),
      };

      await UpdateEntry(entry);

      alertStore.addAlert({
        type: ALERT_TYPES.SUCCESS,
        text: 'Запись успешно изменена',
      });

      props.modalConfirm({
        ...props.entry,
        question: controls.question,
        answer: controls.answer,
      });
    } catch (error) {
      alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: error.message });
    } finally {
      preloaderStore.removeLoader();
    }
  }
}
</script>
```

### 6g: CreateEntryContent.vue

- [ ] **Step 7: Migrate CreateEntryContent.vue**

Uses `ADD_ALERT` + `ADD_LOADER`/`REMOVE_LOADER`.

```vue
<template>
  <SidebarContentWrapper title="Создать запись в FAQ">
    <template #default>
      <v-form
        ref="createEntryForm"
        v-model="valid"
        @submit.prevent="submitForm">
        <v-row
          no-gutters
          class="mt-2">
          <v-col cols="12">
            <v-text-field
              v-model="controls.question"
              :rules="rules"
              label="Вопрос"
              variant="outlined" />
          </v-col>

          <v-col cols="12">
            <RichEditor v-model="controls.answer" />
          </v-col>
        </v-row>
      </v-form>
    </template>
    <template #footer>
      <v-btn
        variant="flat"
        color="primary"
        @click="submitForm">
        Создать
      </v-btn>
      <v-btn
        variant="outlined"
        color="blue-grey"
        @click="modalClose">
        Отмена
      </v-btn>
    </template>
  </SidebarContentWrapper>
</template>

<script setup>
import { ref, reactive } from 'vue';

import sanitizeHtml from '@/shared/lib/html-sanitize';

import { useAlertStore } from '@/entities/alert';
import { usePreloaderStore } from '@/features/preloader';
import { ALERT_TYPES } from '@/shared/config';
import RichEditor from '@/shared/ui/rich-editor';

import { Create as CreateEntry } from '@/entities/faq';

const props = defineProps({
  modalConfirm: { type: Function, required: true },
  modalClose: { type: Function, required: true },
  categoryId: { type: String, required: true },
  order: { type: Number, required: true },
});

const alertStore = useAlertStore();
const preloaderStore = usePreloaderStore();

const createEntryForm = ref(null);
const valid = ref(false);

const controls = reactive({
  question: null,
  answer: null,
});

const rules = [
  (v) => !!v || 'Обязательное поле!',
  (v) => (v && v.trim().length !== 0) || 'Поле не должно быть пустым!',
];

async function submitForm() {
  if (createEntryForm.value.validate()) {
    try {
      preloaderStore.addLoader();

      const entry = {
        faqCategoryId: props.categoryId,
        question: controls.question,
        answer: sanitizeHtml(controls.answer),
        order: props.order,
      };

      const id = await CreateEntry(entry);

      entry.id = id;
      entry.сreated = new Date();

      alertStore.addAlert({
        type: ALERT_TYPES.SUCCESS,
        text: 'Запись успешно создана',
      });

      props.modalConfirm(entry);
    } catch (error) {
      alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: error.message });
    } finally {
      preloaderStore.removeLoader();
    }
  }
}
</script>
```

### 6h: Run lint and commit

- [ ] **Step 8: Run lint**

Run: `npm run lint`

- [ ] **Step 9: Commit**

```bash
git add src/pages/admin/ src/entities/faq/
git commit -m "feat: migrate admin pages and faq components to composition api and pinia"
```

---

## Task 7: Finalization

**Files:**
- Modify: `AGENTS.md`
- Uninstall: `vuex` from package.json

- [ ] **Step 1: Uninstall Vuex**

Run: `npm uninstall vuex`

- [ ] **Step 2: Update AGENTS.md**

Replace all references to Vuex with Pinia. Key changes:
- Stack section: `Vuex 4` → `Pinia`
- `Хранилище — **Vuex**, не Pinia` → `Хранилище — **Pinia** (Composition Stores)`
- `Options API` references → `Composition API (<script setup>)`
- Remove `vue/padding-lines-in-component-definition` from ESLint rules (Options API specific)
- Add note about `<script setup>` patterns
- Update known steiger issues: Pinia stores don't trigger `insignificant-slice` the way Vuex mutations did

- [ ] **Step 3: Run steiger**

Run: `npx steiger ./src`

Verify no new FSD violations. Known `insignificant-slice` warnings on entities/features are expected false positives.

- [ ] **Step 4: Run full lint**

Run: `npm run lint`

- [ ] **Step 5: Verify dev server**

Run: `npm run dev`

Confirm the app starts without errors and Vuex is completely removed.

- [ ] **Step 6: Verify no Vuex references remain**

Search the entire `src/` directory for any remaining `vuex`, `mapMutations`, `mapGetters`, `mapActions`, `mapState`, `this.$store`, `createStore` references. All should be gone.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json AGENTS.md
git commit -m "feat: remove vuex, update agents md for pinia and composition api"
```

---

## Self-Review Checklist

1. **Spec coverage:** Each section of the design spec maps to tasks:
   - Preloader store → Task 2
   - Alert store → Task 3
   - Auth store + middleware → Task 4
   - Component migration pattern → Tasks 5, 6
   - FSD public API → Tasks 2, 3, 4
   - Vuex removal → Task 7
   - AGENTS.md update → Task 7

2. **Placeholder scan:** No TBD/TODO found. All code is complete.

3. **Type consistency:** Store method names are consistent:
   - `addAlert`, `removeAlert`, `getAlerts` (alert store)
   - `addLoader`, `removeLoader`, `showPreloader` (preloader store)
   - `setAuthData`, `removeAuthData`, `getAuthStatus`, `getUserData` (auth store)
   All component references use these same names throughout.
