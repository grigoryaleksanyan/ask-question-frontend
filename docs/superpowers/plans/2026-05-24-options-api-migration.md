# Options API → Composition API Migration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate all 26 Vue components from Options API to Composition API (`<<script setup>`), fixing ESLint-incompatible patterns along the way.

**Architecture:** Direct translation of each Options API feature to its Composition API equivalent, with minor improvements (replace `$emit` in templates with `emit()`, `this.$refs` with `useTemplateRef()`, `this.$slots` with `useSlots()`, restructure hybrid `setup()+Options` into pure `<script setup>`). No component splitting, no composable extraction, no hardcoded data fixes.

**Tech Stack:** Vue 3.5 + Vuetify 4 + Pinia 3 + Vue Router 5 + VeeValidate 4 + Axios. Composition API only.

---

## Global rules (apply to ALL tasks)

1. **SFC block order:** `<script>` → `<template>` → `<style>` (ESLint `vue/block-order`)
2. **`defineOptions({ name: 'X' })`** is required in every `<script setup>` component (ESLint `vue/require-name-property` + `vue/prefer-define-options`)
3. **Macro order:** `defineOptions` → `defineModel` → `defineProps` → `defineEmits` → `defineSlots`, `defineExpose` last (ESLint `vue/define-macros-order`)
4. **Padding lines** between macro sections (ESLint `vue/padding-lines-in-component-definition`)
5. **Padding line** between SFC blocks (ESLint `vue/padding-line-between-blocks`)
6. **Props destructuring** is required (ESLint `vue/define-props-destructuring`)
7. **No empty blocks** — if `<style>` or `<script>` has no content, remove it (ESLint `vue/no-empty-component-block`)
8. After each component: run `npm run lint` and verify no errors
9. After each level: run `npm run build` and verify successful build

---

## Level 1: Trivial (6 components — only `export default { name }`)

Pattern is identical for all: replace `export default { name: 'X' }` with `<script setup>` containing `defineOptions({ name: 'X' })`, reorder SFC blocks.

### Task 1: EmptyLayout

**Files:**
- Modify: `src/app/layouts/EmptyLayout.vue`

- [ ] **Step 1: Rewrite component**

```vue
<script setup>
defineOptions({ name: 'EmptyLayout' });
</script>

<template>
  <v-main>
    <router-view />
  </v-main>
</template>
```

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/app/layouts/EmptyLayout.vue
git commit -m "refactor(app): migrate EmptyLayout to Composition API"
```

---

### Task 2: CenterModalContentWrapper

**Files:**
- Modify: `src/shared/ui/center-modal/CenterModalContentWrapper.vue`

- [ ] **Step 1: Rewrite component**

```vue
<script setup>
defineOptions({ name: 'CenterModalContentWrapper' });
</script>

<template>
  <div>
    <v-card-text
      class="pa-7"
      style="max-height: 400px; overflow-y: auto !important">
      <slot> </slot>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions class="px-7 py-5">
      <slot name="actions"> </slot>
    </v-card-actions>
  </div>
</template>
```

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/shared/ui/center-modal/CenterModalContentWrapper.vue
git commit -m "refactor(shared): migrate CenterModalContentWrapper to Composition API"
```

---

### Task 3: AdminMainPage

**Files:**
- Modify: `src/pages/admin/main/ui/AdminMainPage.vue`

- [ ] **Step 1: Rewrite component**

```vue
<script setup>
defineOptions({ name: 'AdminMainPage' });
</script>

<template>
  <div>AdminMainView</div>
</template>
```

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/pages/admin/main/ui/AdminMainPage.vue
git commit -m "refactor(pages): migrate AdminMainPage to Composition API"
```

---

### Task 4: SidebarPreloader

**Files:**
- Modify: `src/shared/ui/sidebar-modal/SidebarPreloader.vue`

- [ ] **Step 1: Rewrite component**

```vue
<script setup>
defineOptions({ name: 'SidebarPreloader' });
</script>

<template>
  <div class="circles"></div>
</template>

<style lang="scss" scoped>
$pr-color: black;
$pr-border-width: 4px;
$pr-circles-dimensions: 80px;
$pr-main-circles-dimensions: $pr-circles-dimensions - $pr-border-width * 2;

.circles {
  position: relative;
  top: calc(50% - 40px);
  left: calc(50% - 40px);
  width: $pr-circles-dimensions;
  height: $pr-circles-dimensions;

  &::before,
  &::after {
    position: absolute;
    display: block;
    border-width: $pr-border-width;
    border-style: solid;
    border-radius: 50%;
    content: '';
  }

  &::before {
    top: 0;
    left: 0;
    width: $pr-main-circles-dimensions;
    height: $pr-main-circles-dimensions;
    border-color: $pr-color;
    animation: circles-scale 1s linear 0s infinite;
  }

  &::after {
    top: 0;
    left: 0;
    width: $pr-main-circles-dimensions;
    height: $pr-main-circles-dimensions;
    border-color: $pr-color;
    animation: circles-scale 1s linear 0.5s infinite;
    opacity: 0;
  }

  @keyframes circles-scale {
    0% {
      opacity: 0;
      transform: scale(0);
    }

    50% {
      opacity: 1;
      transform: scale(0.7);
    }

    100% {
      opacity: 0;
      transform: scale(1);
    }
  }
}
</style>
```

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/shared/ui/sidebar-modal/SidebarPreloader.vue
git commit -m "refactor(shared): migrate SidebarPreloader to Composition API"
```

---

### Task 5: RichEditor

**Files:**
- Modify: `src/shared/ui/rich-editor/RichEditor.vue`

- [ ] **Step 1: Rewrite component**

```vue
<script setup>
defineOptions({ name: 'RichEditor' });
</script>

<template>
  <div></div>
</template>
```

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/shared/ui/rich-editor/RichEditor.vue
git commit -m "refactor(shared): migrate RichEditor to Composition API"
```

---

### Task 6: AdminSpeakersPage

**Files:**
- Modify: `src/pages/admin/speakers/ui/AdminSpeakersPage.vue`

- [ ] **Step 1: Rewrite component**

```vue
<script setup>
defineOptions({ name: 'AdminSpeakersPage' });
</script>

<template>
  <v-container
    style="max-width: 1200px"
    class="text-left pa-5 mx-auto"
    fluid>
    <v-row>
      <v-col cols="12">
        <v-row>
          <v-col cols="12">
            <h1 class="text-h6 text-sm-h5">Спикеры</h1>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-btn
              size="small"
              color="blue-grey">
              Добавить спикера
              <v-icon
                end
                theme="dark">
                mdi-plus
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
```

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/pages/admin/speakers/ui/AdminSpeakersPage.vue
git commit -m "refactor(pages): migrate AdminSpeakersPage to Composition API"
```

---

### Level 1 verification

- [ ] **Run build**

Run: `npm run build`
Expected: Successful build

---

## Level 2: Simple (10 components — props/emits, minimal logic)

### Task 7: AppLogo

**Files:**
- Modify: `src/shared/ui/AppLogo.vue`

- [ ] **Step 1: Rewrite component**

Migration: `data()` → `ref()`.

```vue
<script setup>
import { ref } from 'vue';

defineOptions({ name: 'AppLogo' });

const imageUrl = ref(
  new URL('@/shared/assets/logo.svg', import.meta.url).href,
);
</script>

<template>
  <div class="logo-wrapper">
    <v-img
      alt="logo"
      width="auto"
      :src="imageUrl">
    </v-img>
  </div>
</template>

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

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/shared/ui/AppLogo.vue
git commit -m "refactor(shared): migrate AppLogo to Composition API"
```

---

### Task 8: HeaderNavigation

**Files:**
- Modify: `src/shared/ui/HeaderNavigation.vue`

- [ ] **Step 1: Rewrite component**

Migration: `props` → `defineProps()` with destructuring.

```vue
<script setup>
defineOptions({ name: 'HeaderNavigation' });

const { navItems } = defineProps({
  navItems: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <v-toolbar-items>
    <v-btn
      v-for="(item, i) in navItems"
      :key="i"
      variant="text"
      :to="item.link">
      <v-icon
        start
        theme="dark">
        {{ item.icon }}
      </v-icon>
      <div>{{ item.title }}</div>
    </v-btn>
  </v-toolbar-items>
</template>
```

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/shared/ui/HeaderNavigation.vue
git commit -m "refactor(shared): migrate HeaderNavigation to Composition API"
```

---

### Task 9: DrawerNavigation

**Files:**
- Modify: `src/shared/ui/DrawerNavigation.vue`

- [ ] **Step 1: Rewrite component**

Migration: `props` → `defineProps()` with destructuring.

```vue
<script setup>
defineOptions({ name: 'DrawerNavigation' });

const { navItems } = defineProps({
  navItems: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <v-list
    nav
    class="ma-0 pa-0">
    <v-list-item
      v-for="item in navItems"
      :key="item.title"
      :to="item.link"
      :prepend-icon="item.icon"
      :title="item.title"
      link
      class="mb-0 pl-4">
    </v-list-item>
  </v-list>
</template>
```

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/shared/ui/DrawerNavigation.vue
git commit -m "refactor(shared): migrate DrawerNavigation to Composition API"
```

---

### Task 10: CenterModal

**Files:**
- Modify: `src/shared/ui/center-modal/CenterModal.vue`

- [ ] **Step 1: Rewrite component**

Migration: `props` → `defineProps()`, `emits` → `defineEmits()`, `methods { close() { this.$emit } }` → `emit()` function.

```vue
<script setup>
defineOptions({ name: 'CenterModal' });

const { isOpen, title } = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },

  title: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['close']);

function close() {
  emit('close');
}
</script>

<template>
  <v-dialog
    :model-value="isOpen"
    persistent
    max-width="600">
    <v-card>
      <v-card-title class="d-flex justify-space-between">
        <h4 class="text-truncate">
          {{ title }}
        </h4>
        <v-btn
          class="pa-0"
          elevation="0"
          min-width="40"
          max-width="40"
          min-height="40"
          max-height="40"
          width="40"
          height="40"
          style="border-radius: 8px"
          @click="close">
          <v-icon>mdi-plus mdi-rotate-45</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <slot> </slot>
    </v-card>
  </v-dialog>
</template>
```

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/shared/ui/center-modal/CenterModal.vue
git commit -m "refactor(shared): migrate CenterModal to Composition API"
```

---

### Task 11: FeedbackCard

**Files:**
- Modify: `src/features/feedback/ui/FeedbackCard.vue`

- [ ] **Step 1: Rewrite component**

Migration: `props` → `defineProps()`, `emits` → `defineEmits()`, `$emit('delete')` in template → `emit('delete')`.

```vue
<script setup>
defineOptions({ name: 'FeedbackCard' });

const { feedback } = defineProps({
  feedback: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['delete']);
</script>

<template>
  <v-card
    elevation="2"
    color="#E8EAF6">
    <v-card-title class="py-2">
      <v-row
        no-gutters
        class="text-body-1">
        <v-col
          cols="12"
          align-self="center">
          <span style="overflow-wrap: break-word">
            Имя: {{ feedback.username }}
          </span>
          <br />
          <span style="overflow-wrap: break-word">
            Почта: {{ feedback.email }}
          </span>
        </v-col>
        <v-col
          class="d-flex justify-start justify-sm-end"
          cols="12"
          sm="6">
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text>
      <div class="d-flex">
        <v-sheet
          style="overflow-y: scroll"
          color="white"
          max-height="200px"
          width="100%"
          class="pa-3">
          <div>
            <p>
              {{ feedback.theme }}
            </p>
            <p class="font-italic">
              {{ feedback.text }}
            </p>
          </div>
        </v-sheet>
      </div>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions class="py-1">
      <v-container
        fluid
        class="py-0">
        <v-row
          no-gutters
          align="center">
          <v-col>
            <span class="text-caption">
              Создана: {{ new Date(feedback.сreated).toLocaleDateString() }}
            </span>
          </v-col>
          <v-col class="d-flex justify-end align-center">
            <v-btn
              title="Удалить"
              icon
              variant="text"
              size="small"
              @click="emit('delete')">
              <v-icon size="20">mdi-delete-outline</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card-actions>
  </v-card>
</template>
```

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/features/feedback/ui/FeedbackCard.vue
git commit -m "refactor(features): migrate FeedbackCard to Composition API"
```

---

### Task 12: EntryCard

**Files:**
- Modify: `src/entities/faq/ui/EntryCard.vue`

- [ ] **Step 1: Rewrite component**

Migration: `props` → `defineProps()`, `emits` → `defineEmits()`, `$emit(...)` in template → `emit(...)`.

```vue
<script setup>
defineOptions({ name: 'EntryCard' });

const { entry } = defineProps({
  entry: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['copy-link', 'update', 'delete']);
</script>

<template>
  <v-card
    class="entry-card"
    elevation="2"
    color="#E8EAF6">
    <v-card-title class="py-2">
      <v-row
        no-gutters
        class="text-body-1">
        <v-col
          cols="12"
          align-self="center">
          <span style="overflow-wrap: break-word">{{ entry.question }}</span>
        </v-col>
        <v-col
          class="d-flex justify-start justify-sm-end"
          cols="12"
          sm="6">
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text>
      <div class="d-flex">
        <v-sheet
          style="overflow-y: scroll"
          color="white"
          max-height="200px"
          width="100%"
          class="pa-3">
          <div v-html="entry.answer"></div>
        </v-sheet>
      </div>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions class="py-1">
      <v-container
        fluid
        class="py-0">
        <v-row
          no-gutters
          align="center">
          <v-col>
            <span class="text-caption">
              Создана: {{ new Date(entry.сreated).toLocaleDateString() }}
            </span>
          </v-col>
          <v-col class="d-flex justify-end align-center">
            <v-btn
              title="Переместить"
              class="handle"
              icon
              variant="text"
              size="small">
              <v-icon size="20"> mdi-arrow-all </v-icon>
            </v-btn>

            <v-btn
              title="Скопировать ссылку на запись"
              icon
              variant="text"
              size="small"
              @click="emit('copy-link')">
              <v-icon size="20">mdi-link</v-icon>
            </v-btn>

            <v-btn
              title="Изменить"
              icon
              variant="text"
              size="small"
              @click="emit('update')">
              <v-icon size="20">mdi-pencil-outline</v-icon>
            </v-btn>

            <v-btn
              title="Удалить"
              icon
              variant="text"
              size="small"
              @click="emit('delete')">
              <v-icon size="20">mdi-delete-outline</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card-actions>
  </v-card>
</template>

<style lang="scss" scoped>
.entry-card {
  position: relative;
}

.vuedraggable-drag > .entry-card {
  transform: rotate(2deg);
}

.vuedraggable-ghost > .entry-card::after {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(230 230 230);
  content: '';
}
</style>
```

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/entities/faq/ui/EntryCard.vue
git commit -m "refactor(entities): migrate EntryCard to Composition API"
```

---

### Task 13: AreaCard

**Files:**
- Modify: `src/entities/area/ui/AreaCard.vue`

- [ ] **Step 1: Rewrite component**

Migration: `props` → `defineProps()`, `emits` → `defineEmits()`, `$emit(...)` in template → `emit(...)`.

```vue
<script setup>
defineOptions({ name: 'AreaCard' });

const { area } = defineProps({
  area: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['update', 'delete']);
</script>

<template>
  <v-sheet
    class="area-card pa-3 rounded-lg"
    color="#E8EAF6">
    <v-row
      no-gutters
      align="center">
      <v-col class="px-2">
        <span> {{ area.title }} </span>
      </v-col>

      <v-col class="d-flex justify-end align-center">
        <v-divider
          vertical
          class="mr-3" />

        <v-btn
          title="Переместить"
          class="handle"
          icon
          variant="text"
          size="small">
          <v-icon size="20"> mdi-arrow-all </v-icon>
        </v-btn>

        <v-btn
          title="Изменить"
          icon
          variant="text"
          size="small"
          @click="emit('update')">
          <v-icon size="20"> mdi-pencil-outline </v-icon>
        </v-btn>

        <v-btn
          title="Удалить"
          icon
          variant="text"
          size="small"
          @click="emit('delete')">
          <v-icon size="20"> mdi-delete-outline </v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<style lang="scss" scoped>
.area-card {
  position: relative;
}

.vuedraggable-drag > .area-card {
  transform: rotate(2deg);
}

.vuedraggable-ghost > .area-card::after {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  background-color: rgb(230 230 230);
  content: '';
}
</style>
```

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/entities/area/ui/AreaCard.vue
git commit -m "refactor(entities): migrate AreaCard to Composition API"
```

---

### Task 14: NotFoundPage

**Files:**
- Modify: `src/pages/errors/ui/NotFoundPage.vue`

- [ ] **Step 1: Rewrite component**

Migration: `methods { toBack() { this.$router.go(-1) } }` → `useRouter()`.

```vue
<script setup>
import { useRouter } from 'vue-router';

defineOptions({ name: 'NotFoundPage' });

const router = useRouter();

function toBack() {
  router.go(-1);
}
</script>

<template>
  <v-container fluid>
    <v-row
      align="center"
      style="height: 100vh">
      <v-col
        cols="12"
        class="d-flex flex-column align-center">
        <h1 class="text-h6 text-sm-h4 mb-8">
          Такой страницы не существует &#128577;
        </h1>
        <v-btn
          variant="flat"
          @click="toBack()">
          Вернуться
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
```

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/pages/errors/ui/NotFoundPage.vue
git commit -m "refactor(pages): migrate NotFoundPage to Composition API"
```

---

### Task 15: QuestionsPage

**Files:**
- Modify: `src/pages/questions/ui/QuestionsPage.vue`

- [ ] **Step 1: Rewrite component**

Migration: `components: { QuestionsView }` → auto-resolve via import.

```vue
<script setup>
import { QuestionsView } from '@/entities/question';

defineOptions({ name: 'QuestionsPage' });
</script>

<template>
  <QuestionsView />
</template>
```

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/pages/questions/ui/QuestionsPage.vue
git commit -m "refactor(pages): migrate QuestionsPage to Composition API"
```

---

### Task 16: FAQPage

**Files:**
- Modify: `src/pages/faq/ui/FAQPage.vue`

- [ ] **Step 1: Rewrite component**

Migration: `components: { FAQView }` → auto-resolve via import.

```vue
<script setup>
import { FAQView } from '@/entities/faq';

defineOptions({ name: 'FAQPage' });
</script>

<template>
  <FAQView />
</template>
```

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/pages/faq/ui/FAQPage.vue
git commit -m "refactor(pages): migrate FAQPage to Composition API"
```

---

### Level 2 verification

- [ ] **Run build**

Run: `npm run build`
Expected: Successful build

---

## Level 3: Medium (7 components — data/computed/methods/inject/slots)

### Task 17: QuestionIdPage

**Files:**
- Modify: `src/pages/questions/detail/QuestionIdPage.vue`

- [ ] **Step 1: Rewrite component**

Migration: `components: { QuestionIdView }` → auto-resolve via import.

```vue
<script setup>
import { QuestionIdView } from '@/entities/question';

defineOptions({ name: 'QuestionIdPage' });
</script>

<template>
  <QuestionIdView />
</template>
```

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/pages/questions/detail/QuestionIdPage.vue
git commit -m "refactor(pages): migrate QuestionIdPage to Composition API"
```

---

### Task 18: SidebarContentWrapper

**Files:**
- Modify: `src/shared/ui/sidebar-modal/SidebarContentWrapper.vue`

- [ ] **Step 1: Rewrite component**

Migration: `inject: ['close']` → `inject('close')`, `props` → `defineProps()`, `computed { this.$slots.footer }` → `useSlots()`, reorder SFC blocks.

Key change: `this.$slots.footer` in computed becomes `slots.footer` from `useSlots()`.

```vue
<script setup>
import { computed, inject, useSlots } from 'vue';

defineOptions({ name: 'SidebarContentWrapper' });

const close = inject('close');

const { title, headerHeight, footerHeight } = defineProps({
  title: { type: String, default: '' },
  headerHeight: { type: Number, default: 75 },
  footerHeight: { type: Number, default: 70 },
});

const slots = useSlots();

const header = computed(() => `${headerHeight}px`);

const content = computed(
  () => `calc(100% - ${header.value} - ${footer.value})`,
);

const footer = computed(
  () => `${slots.footer ? footerHeight : 0}px`,
);
</script>

<template>
  <div class="modal-form-wrapper">
    <div
      class="modal-header"
      :style="{ height: header }">
      <span class="modal-title">
        <slot name="header"> {{ title }} </slot>
      </span>
      <button
        class="modal-close-button"
        type="button"
        title="Закрыть"
        @click="close">
        <svg
          class="button-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
        </svg>
      </button>
    </div>
    <div
      class="modal-content"
      :style="{ height: content }">
      <slot> </slot>
    </div>
    <div
      v-if="slots.footer"
      class="modal-footer"
      :style="{ height: footer }">
      <slot name="footer"> </slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use './styles/modal-variables';

$header-paddings: modal-variables.$header-paddings;
$content-paddings: modal-variables.$content-paddings;
$footer-paddings: modal-variables.$footer-paddings;
$section-mobile-paddings: modal-variables.$section-mobile-paddings;
$modal-width: modal-variables.$modal-width;

.modal-form-wrapper {
  height: 100%;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $header-paddings;
}

.modal-title {
  overflow: hidden;
  margin-right: 10px;
  font-size: 22px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.modal-close-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border-radius: 8px;
  background-color: #f5f5f5;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgb(225 225 225 / 90%);
  }
}

.button-icon {
  width: 20px;
  height: 20px;
}

.modal-content {
  padding: $content-paddings;
  overflow-y: auto;
  overscroll-behavior: none;
  scrollbar-gutter: stable;
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: $footer-paddings;
  box-shadow: 0 -1px 0 0 rgba(#000, 0.1);
  gap: 12px;
}

@media (width <= $modal-width) {
  .modal-header {
    padding: $section-mobile-paddings;
  }

  .modal-content {
    padding: $section-mobile-paddings;
  }

  .modal-footer {
    justify-content: center;
    padding: $section-mobile-paddings;
  }
}
</style>
```

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/shared/ui/sidebar-modal/SidebarContentWrapper.vue
git commit -m "refactor(shared): migrate SidebarContentWrapper to Composition API"
```

---

### Task 19: QuestionFilters

**Files:**
- Modify: `src/entities/question/ui/QuestionFilters.vue`

- [ ] **Step 1: Rewrite component**

Migration: `data()` → `ref()`, `methods` → functions.

```vue
<script setup>
import { ref } from 'vue';

defineOptions({ name: 'QuestionFilters' });

const showFilters = ref(false);
const sortingDirection = ref(0);
const speaker = ref(['Иван', 'Петр']);
const zone = ref(['Север', 'Юг']);
const status = ref(['новый', 'в фокусе']);

function toggleFilters() {
  showFilters.value = !showFilters.value;
}
</script>

<template>
  <v-container>
    <v-row justify="space-between">
      <v-col cols="6">
        <v-btn-toggle
          v-model="sortingDirection"
          density="compact">
          <v-btn
            size="small"
            title="Сначала новые">
            <v-icon
              size="20"
              color="#717171">
              mdi-arrow-up-thin
            </v-icon>
          </v-btn>

          <v-btn
            size="small"
            title="Сначала старые">
            <v-icon
              size="20"
              color="#717171">
              mdi-arrow-down-thin
            </v-icon>
          </v-btn>
        </v-btn-toggle>
      </v-col>
      <v-col
        cols="6"
        class="d-flex justify-end">
        <v-btn
          elevation="0"
          size="small"
          title="Показать/скрыть блок фильтров"
          @click="toggleFilters">
          <span class="mr-1"> Фильтры</span>
          <v-icon
            v-if="!showFilters"
            size="20"
            color="#717171">
            mdi-filter-outline
          </v-icon>
          <v-icon
            v-else
            size="20"
            color="#717171">
            mdi-filter-remove-outline
          </v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <v-expand-transition>
      <v-row
        v-show="showFilters"
        justify="center"
        class="mt-6">
        <v-col
          cols="12"
          class="col-sm-4">
          <v-select
            :items="speaker"
            label="Спикер"
            variant="outlined"
            clearable
            hide-details
            density="compact"
            :menu-props="{ bottom: true, offsetY: true }" />
        </v-col>
        <v-col
          cols="12"
          class="col-sm-4">
          <v-select
            :items="zone"
            label="Зона ответственности"
            variant="outlined"
            clearable
            hide-details
            density="compact"
            :menu-props="{ bottom: true, offsetY: true }" />
        </v-col>
        <v-col
          cols="12"
          class="col-sm-4">
          <v-select
            :items="status"
            label="Статус"
            variant="outlined"
            clearable
            hide-details
            density="compact"
            :menu-props="{ bottom: true, offsetY: true }" />
        </v-col>
      </v-row>
    </v-expand-transition>
  </v-container>
</template>
```

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/entities/question/ui/QuestionFilters.vue
git commit -m "refactor(entities): migrate QuestionFilters to Composition API"
```

---

### Task 20: QuestionStatusIcon

**Files:**
- Modify: `src/entities/question/ui/QuestionStatusIcon.vue`

- [ ] **Step 1: Rewrite component**

Migration: `props` → `defineProps()`, `data()` → `ref()`, `computed` → `computed()`.

Note: `statusList` is static data — does not need to be reactive. Make it a plain `const` array.

```vue
<script setup>
import { computed } from 'vue';

import QUESTION_STATUSES from '../config/question-statuses';

defineOptions({ name: 'QuestionStatusIcon' });

const { status } = defineProps({
  status: {
    type: Number,
    default: 0,
  },
});

const statusList = [
  {
    text: QUESTION_STATUSES.NEW.TITLE,
    color: QUESTION_STATUSES.NEW.COLOR,
    icon: 'mdi-new-box',
  },
  {
    text: QUESTION_STATUSES.IN_FOCUS.TITLE,
    color: QUESTION_STATUSES.IN_FOCUS.COLOR,
    icon: 'mdi-crosshairs-question',
  },
  {
    text: QUESTION_STATUSES.WITH_COMMENT.TITLE,
    color: QUESTION_STATUSES.WITH_COMMENT.COLOR,
    icon: 'mdi-comment-text-multiple-outline',
  },
  {
    text: QUESTION_STATUSES.ANSWERED.TITLE,
    color: QUESTION_STATUSES.ANSWERED.COLOR,
    icon: 'mdi-bullhorn-outline',
  },
];

const curentStatus = computed(() => statusList[status]);
</script>

<template>
  <span>
    <span>статус: {{ curentStatus.text }}</span>
    <v-icon
      size="24"
      :color="curentStatus.color"
      class="ml-2">
      {{ curentStatus.icon }}
    </v-icon>
  </span>
</template>
```

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/entities/question/ui/QuestionStatusIcon.vue
git commit -m "refactor(entities): migrate QuestionStatusIcon to Composition API"
```

---

### Task 21: CategoryCard

**Files:**
- Modify: `src/entities/faq/ui/CategoryCard.vue`

- [ ] **Step 1: Rewrite component**

Migration: `props` → `defineProps()`, `methods { clickOnCard() { this.$router.push } }` → `useRouter()`.

```vue
<script setup>
import { useRouter } from 'vue-router';

defineOptions({ name: 'CategoryCard' });

const { category } = defineProps({
  category: {
    type: Object,
    required: true,
  },
});

const router = useRouter();

function clickOnCard() {
  router.push({
    name: 'admin-faq-category',
    params: { id: category.id },
  });
}
</script>

<template>
  <div
    tabindex="0"
    class="card"
    @click="clickOnCard"
    @keypress.enter="clickOnCard">
    <div class="card-info-block">
      <span class="card-info-block-title">{{ category.name }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card {
  position: relative;
  display: flex;
  overflow: hidden;
  width: 100%;
  height: 116px;
  justify-content: center;
  padding: 15px;
  border: 1px solid #d3d4db;
  border-radius: 12px;
  background-color: #e8eaf6;
  cursor: pointer;
  transition: all 0.2s linear;
}

.card-info-block {
  display: flex;
  align-items: center;
}

.card-info-block-title {
  margin-right: 10px;
  color: #000;
}

.card-info-block-icon {
  width: 20px;
  height: 20px;
}

.card-info-block-title,
.card-info-block-icon {
  transition: all 0.2s linear;
}

.card:hover {
  box-shadow: 0 0 15px 0 rgb(180 180 180 / 65%);

  .card-info-block-title {
    color: #2b82e6;
  }

  .card-info-block-icon {
    color: #2b82e6;
  }
}

.vuedraggable-drag > .card {
  transform: rotate(3deg);
}

.vuedraggable-ghost > .card::after {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(230 230 230);
  content: '';
}
</style>
```

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/entities/faq/ui/CategoryCard.vue
git commit -m "refactor(entities): migrate CategoryCard to Composition API"
```

---

### Task 22: QuestionIdView

**Files:**
- Modify: `src/entities/question/ui/QuestionIdView.vue`

- [ ] **Step 1: Rewrite component**

Migration: `computed` → `computed()`, `methods` → functions.

```vue
<script setup>
import { computed } from 'vue';

import QUESTION_STATUSES from '../config/question-statuses';

defineOptions({ name: 'QuestionIdView' });

const color = computed(() => {
  switch (1) {
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

function replaceСounter(value) {
  return value > 999 ? '999+' : value;
}
</script>

<template>
  <v-container
    fluid
    style="max-width: 1000px">
    <v-row no-gutters>
      <v-col
        cols="12"
        class="my-8">
        <h1 class="text-h4 text-sm-h3 text-center">Вопрос</h1>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col
        cols="12"
        class="d-flex justify-center">
        <v-sheet
          color="#2b2b2b"
          width="100%">
          <v-row
            no-gutters
            class="py-5 px-2 px-sm-5"
            align="center"
            style="height: 100%">
            <v-col cols="1">
              <v-btn
                color="white"
                icon>
                <v-icon>mdi-24px mdi-arrow-left-circle-outline </v-icon>
              </v-btn>
            </v-col>
            <v-col cols="11">
              <p style="margin: 0; color: white; text-align: center">
                Инкогнито, Корпорaтивный центр, 04.02.2023 <br />
                кому: Меньшов Кирилл
              </p>
            </v-col>
          </v-row>
        </v-sheet>
      </v-col>
      <v-col cols="12">
        <v-sheet
          class="pa-5 pa-sm-8 d-flex flex-column justify-center"
          min-height="250px"
          color="#E8EAF6"
          width="100%">
          <div>
            <v-row
              no-gutters
              class="mb-6">
              <v-col
                cols="12"
                class="d-flex">
                <v-sheet
                  :color="color"
                  height="auto"
                  width="7">
                </v-sheet>
                <v-sheet
                  color="white"
                  height="auto"
                  width="100%"
                  class="pa-3">
                  <p
                    style="color: grey"
                    class="pa-0 ma-0 text-sm-body-1 text-body-2">
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Esse excepturi dolore ducimus eos eaque. Aut, explicabo.
                    Amet, quia, vero sunt optio laudantium perspiciatis ducimus
                    accusantium magnam dolore tempora ipsum nemo.
                  </p>
                </v-sheet>
              </v-col>
            </v-row>
            <v-row
              no-gutters
              align="center">
              <v-col align-self="center">
                <v-icon
                  title="Количество просмотров"
                  size="20"
                  class="mr-2">
                  mdi-eye
                </v-icon>
                <span class="text-caption text-sm-body-2">{{
                  replaceСounter(99)
                }}</span>
              </v-col>
              <v-col class="d-flex justify-end align-center">
                <v-btn
                  class="mr-1"
                  variant="outlined"
                  color="primary">
                  <v-icon
                    class="mr-2"
                    title="Понравился"
                    size="20">
                    mdi-thumb-up-outline
                  </v-icon>
                  <span class="text-caption text-sm-body-2 mr-1">{{
                    replaceСounter(1)
                  }}</span>
                </v-btn>
                <v-btn
                  class="mr-1"
                  variant="outlined"
                  color="error">
                  <v-icon
                    class="mr-2"
                    title="Не понравился"
                    size="20">
                    mdi-thumb-down-outline
                  </v-icon>
                  <span class="text-caption text-sm-body-2">
                    {{ replaceСounter(99) }}</span
                  >
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>
```

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/entities/question/ui/QuestionIdView.vue
git commit -m "refactor(entities): migrate QuestionIdView to Composition API"
```

---

### Task 23: QuestionCard

**Files:**
- Modify: `src/entities/question/ui/QuestionCard.vue`

- [ ] **Step 1: Rewrite component**

Migration: `components: { QuestionStatusIcon }` → auto-resolve via import, `props` → `defineProps()`, `computed` → `computed()`, `methods` → functions.

```vue
<script setup>
import { computed } from 'vue';

import QUESTION_STATUSES from '../config/question-statuses';

import QuestionStatusIcon from './QuestionStatusIcon.vue';

defineOptions({ name: 'QuestionCard' });

const { question } = defineProps({
  question: { type: Object, required: true },
});

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

function sliceText(text) {
  const maxTextLength = 300;

  if (text.length < maxTextLength) {
    return text;
  }
  return `${text.slice(0, maxTextLength)}... <b class="question-card-more">подробнее</b>`;
}

function replaceСounter(value) {
  return value > 999 ? '999+' : value;
}

function setLike() {}

function setDislike() {}
</script>

<template>
  <v-container>
    <v-card
      to="/question/123"
      elevation="2"
      color="#E8EAF6">
      <v-card-title class="py-2">
        <v-row
          no-gutters
          class="text-caption text-sm-body-2">
          <v-col
            cols="12"
            sm="6"
            align-self="center">
            <span>кому: {{ question.speaker }}</span>
          </v-col>
          <v-col
            class="d-flex justify-start justify-sm-end"
            cols="12"
            sm="6">
            <QuestionStatusIcon :status="question.status" />
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <div class="d-flex">
          <v-sheet
            :color="color"
            height="auto"
            width="7">
          </v-sheet>
          <v-sheet
            color="white"
            height="auto"
            width="100%"
            class="pa-3">
            <p
              style="color: grey"
              class="pa-0 ma-0 text-sm-body-1 text-body-2"
              v-html="sliceText(question.text)"></p>
          </v-sheet>
        </div>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="py-1">
        <v-container
          fluid
          class="py-0">
          <v-row
            no-gutters
            align="center">
            <v-col align-self="center">
              <v-icon
                title="Количество просмотров"
                size="20"
                class="mr-2">
                mdi-eye
              </v-icon>
              <span class="text-caption text-sm-body-2">
                {{ replaceСounter(question.views) }}
              </span>
            </v-col>
            <v-col class="d-flex justify-end align-center">
              <v-btn
                icon
                class="mr-1"
                @click.prevent="setLike">
                <v-icon
                  title="Понравился"
                  size="20">
                  mdi-thumb-up-outline
                </v-icon>
              </v-btn>
              <span class="text-caption text-sm-body-2 mr-1">
                {{ replaceСounter(question.likes) }}
              </span>
              <v-btn
                icon
                class="mr-1"
                @click.prevent="setDislike">
                <v-icon
                  title="Не понравился"
                  size="20">
                  mdi-thumb-down-outline
                </v-icon>
              </v-btn>
              <span class="text-caption text-sm-body-2">
                {{ replaceСounter(question.dislikes) }}
              </span>
            </v-col>
          </v-row>
        </v-container>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<style lang="scss">
.question-card-more {
  color: variables.$links-color;
}
</style>
```

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/entities/question/ui/QuestionCard.vue
git commit -m "refactor(entities): migrate QuestionCard to Composition API"
```

---

### Level 3 verification

- [ ] **Run build**

Run: `npm run build`
Expected: Successful build

---

## Level 4: Complex (3 components — composite patterns, hybrid setup+Options)

### Task 24: App.vue

**Files:**
- Modify: `src/app/entrypoint/App.vue`

- [ ] **Step 1: Rewrite component**

Migration: `computed { layout() { this.$route.meta.layout, defineAsyncComponent } }` → `useRoute()` + `computed()`, `components` → auto-resolve via import.

```vue
<script setup>
import { computed, defineAsyncComponent } from 'vue';
import { useRoute } from 'vue-router';

import { AppPreloader } from '@/features/preloader';
import { AppAlert } from '@/entities/alert';

defineOptions({ name: 'App' });

const route = useRoute();

const layout = computed(() => {
  const layoutName = route.meta.layout || 'DefaultLayout';
  return defineAsyncComponent(() =>
    import(`@/app/layouts/${layoutName}.vue`),
  );
});
</script>

<template>
  <v-app>
    <component :is="layout" />
    <AppPreloader />
    <AppAlert />
  </v-app>
</template>
```

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/app/entrypoint/App.vue
git commit -m "refactor(app): migrate App to Composition API"
```

---

### Task 25: DefaultLayout

**Files:**
- Modify: `src/app/layouts/DefaultLayout.vue`

- [ ] **Step 1: Rewrite component**

Migration: `data()` → `ref()`, `computed` → `computed()`, `methods { showFeedbackModal() { this.$refs['feedback-modal'].open() } }` → `useTemplateRef()`, `components` → auto-resolve via import.

Key change: `ref="feedback-modal"` in template + `this.$refs['feedback-modal']` → `useTemplateRef('feedback-modal')`.

```vue
<script setup>
import { computed, ref, useTemplateRef } from 'vue';

import DrawerNavigation from '@/shared/ui/DrawerNavigation.vue';
import HeaderNavigation from '@/shared/ui/HeaderNavigation.vue';
import AppLogo from '@/shared/ui/AppLogo.vue';

import { SidebarFeedbackContent } from '@/features/feedback';

defineOptions({ name: 'DefaultLayout' });

const drawer = ref(false);

const feedbackModal = useTemplateRef('feedback-modal');

const navItems = [
  {
    title: 'Главная',
    icon: 'mdi-home',
    link: '/',
  },
  {
    title: 'Все вопросы',
    icon: 'mdi-account-question',
    link: '/questions',
  },
  {
    title: 'FAQ',
    icon: 'mdi-frequently-asked-questions',
    link: '/faq',
  },
];

const year = computed(() => new Date().getFullYear());

async function showFeedbackModal() {
  await feedbackModal.value.open();
}

function toggleDrawer() {
  drawer.value = !drawer.value;
}
</script>

<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      theme="dark"
      temporary
      class="drawer-navigation">
      <DrawerNavigation :nav-items="navItems" />
    </v-navigation-drawer>

    <v-app-bar theme="dark">
      <v-app-bar-nav-icon
        class="drawer-navigation-burger"
        @click="toggleDrawer" />

      <AppLogo />

      <v-spacer></v-spacer>

      <HeaderNavigation
        :nav-items="navItems"
        class="header-navigation" />
    </v-app-bar>

    <v-main style="min-height: 100vh">
      <router-view></router-view>
    </v-main>

    <v-footer theme="dark">
      @{{ year }} Grigory Aleksanyan

      <v-spacer></v-spacer>

      <v-tooltip
        text="Обратная связь по порталу"
        location="start">
        <template #activator="{ props }">
          <v-btn
            icon
            variant="flat"
            v-bind="props"
            @click="showFeedbackModal">
            <v-icon size="24px">mdi-email-open</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
    </v-footer>

    <SidebarModal ref="feedback-modal">
      <template #default="{ togglePreloader, confirm, close }">
        <SidebarFeedbackContent
          :show-preloader="togglePreloader"
          :modal-confirm="confirm"
          :modal-close="close" />
      </template>
    </SidebarModal>
  </div>
</template>

<style lang="scss" scoped>
@media (width <= 600px) {
  .header-navigation {
    display: none;
  }
}

@media (width >= 600px) {
  .drawer-navigation,
  .drawer-navigation-burger {
    display: none;
  }
}
</style>
```

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/app/layouts/DefaultLayout.vue
git commit -m "refactor(app): migrate DefaultLayout to Composition API"
```

---

### Task 26: MainPage

**Files:**
- Modify: `src/pages/main/ui/MainPage.vue`

- [ ] **Step 1: Rewrite component**

Migration: Hybrid `setup()` + Options API (`data`, `created`, `methods`) → pure `<script setup>`. `setup() { useGoTo() }` → top-level. `data()` → `ref()`. `created()` → top-level call. `methods` → functions. `components` → auto-resolve via import.

Key change: `created() { this.fetchData() }` becomes a top-level call `fetchData()`. The `this.ADD_ALERT` reference in the original code appears to be a bug (should use `alertStore.addAlert`). Looking at the AdminLayout reference, the pattern is `alertStore.addAlert(...)`.

```vue
<script setup>
import { ref } from 'vue';
import { useGoTo } from 'vuetify';

import VideoBackground from 'vue-responsive-video-background-player';

import {
  GetPopularQuestions,
  QuestionCard,
  QuestionFormCreate,
} from '@/entities/question';
import { useAlertStore } from '@/entities/alert';
import { ALERT_TYPES } from '@/shared/config';

defineOptions({ name: 'MainPage' });

const goTo = useGoTo();
const alertStore = useAlertStore();

const backgroundVideo = ref(
  new URL('@/shared/assets/video/background.mp4', import.meta.url).href,
);
const backgroundPoster = ref(
  new URL('@/shared/assets/img/poster.jpg', import.meta.url).href,
);
const questions = ref([]);
const headerHeight = ref(64);

async function fetchData() {
  try {
    questions.value = await GetPopularQuestions();
  } catch (error) {
    alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: error.message });
  }
}

fetchData();
</script>

<template>
  <v-container
    fluid
    class="pa-0">
    <VideoBackground
      style="height: 100vh"
      :src="backgroundVideo"
      :poster="backgroundPoster"
      overlay="linear-gradient(0deg, rgb(0, 0, 0, 0.5), rgb(0, 0, 0, 0.5))">
      <v-row
        align-content="center"
        class="pa-3"
        style="height: 100vh">
        <v-col cols="12">
          <h1 class="portal-title">Ask me</h1>
          <p class="additional-text">Ты не получаешь ответов?</p>
          <p class="additional-text">
            Главная причина в том, что ты не задаешь вопросов.
          </p>
        </v-col>
        <v-col
          cols="12"
          class="d-flex justify-center">
          <QuestionFormCreate />
        </v-col>
        <v-col
          cols="12"
          class="d-flex justify-center mt-12">
          <v-btn
            class="btn-to-popular-question"
            color="rgba(255, 255, 255, 0.5)"
            icon
            @click="goTo('#popular', { offset: -headerHeight })">
            <v-icon>mdi-arrow-down-drop-circle-outline</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </VideoBackground>
    <v-row
      id="popular"
      class="my-5 mx-auto"
      style="max-width: 800px; min-height: 100vh">
      <v-col cols="12">
        <v-row>
          <v-col cols="12">
            <h3 class="text-h4 text-sm-h3 text-center">Популярные вопросы</h3>
          </v-col>
          <v-col cols="12">
            <QuestionCard
              v-for="question in questions"
              :key="question.id"
              :question="question" />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="scss" scoped>
.portal-title {
  color: white;
  font-size: 6em;
  text-align: center;
  white-space: nowrap;
}

.additional-text {
  margin-bottom: 5px !important;
  color: white;
  font-size: 1.5em;
  line-height: 1;
  text-align: center;
}

@media (width <= 600px) {
  .portal-title {
    font-size: 3em;
  }

  .additional-text {
    font-size: 1em;
  }
}

.btn-to-popular-question {
  animation: pulsation 3s infinite;
}

@keyframes pulsation {
  0% {
    transform: scale(1.2, 1.2);
  }

  50% {
    transform: scale(0.9, 0.9);
  }

  100% {
    transform: scale(1.2, 1.2);
  }
}
</style>
```

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/pages/main/ui/MainPage.vue
git commit -m "refactor(pages): migrate MainPage to Composition API"
```

---

### Level 4 verification

- [ ] **Run build**

Run: `npm run build`
Expected: Successful build

- [ ] **Run FSD check**

Run: `npm run fsd:check`
Expected: No new errors (known false positives on entities/features are acceptable)

- [ ] **Verify no Options API components remain**

Search for `export default {` in all `.vue` files. Expected: zero results.

```bash
rg "export default \{" --include="*.vue" src/
```
