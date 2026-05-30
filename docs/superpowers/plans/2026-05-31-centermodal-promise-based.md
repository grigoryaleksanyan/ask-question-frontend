# CenterModal Promise-Based Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor CenterModal to promise-based API matching SlideOver pattern and migrate all 6 modal instances across 5 files.

**Architecture:** CenterModal wraps PrimeVue Dialog with promise-based `open()` method. Components using CenterModal will use `ref` to call `open()` and receive `{ confirm, close }` via scoped slot.

**Tech Stack:** Vue 3.5 Composition API, TypeScript, PrimeVue 4 Dialog, Vite

---

### Task 1: Refactor CenterModal.vue

**Files:**
- Modify: `src/shared/ui/center-modal/CenterModal.vue`

- [ ] **Step 1: Read current CenterModal.vue**

Read the current implementation from `src/shared/ui/center-modal/CenterModal.vue`.

- [ ] **Step 2: Write new promise-based implementation**

Replace entire content of `src/shared/ui/center-modal/CenterModal.vue`:

```vue
<template>
  <Dialog
    v-model:visible="isVisible"
    modal
    :draggable="false"
    :style="{ maxWidth: '600px' }"
    @hide="onHide">
    <template #header>
      <slot name="header"></slot>
    </template>
    <slot
      :confirm="confirm"
      :close="close"></slot>
    <template #footer>
      <slot name="footer"></slot>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import Dialog from 'primevue/dialog';

defineOptions({ name: 'CenterModal' });

const isVisible = ref(false);
let resolvePromise: ((value: string) => void) | null = null;

function open(): Promise<string> {
  isVisible.value = true;
  return new Promise((resolve) => {
    resolvePromise = resolve;
  });
}

function confirm() {
  isVisible.value = false;
  resolvePromise?.('confirm');
  resolvePromise = null;
}

function close() {
  isVisible.value = false;
  resolvePromise?.('close');
  resolvePromise = null;
}

function onHide() {
  resolvePromise?.('close');
  resolvePromise = null;
}

defineExpose({ open, confirm, close });
</script>

<style lang="scss" scoped>
:global(.p-dark) .p-dialog {
  background: variables.$surface-dark-elevated;
  color: variables.$text-primary-dark;

  .p-dialog-header {
    color: variables.$text-primary-dark;
  }

  .p-dialog-footer {
    color: variables.$text-primary-dark;
  }
}
</style>
```

- [ ] **Step 3: Run lint to verify**

Run: `cd D:\Development\my_projects\ask-question\ask-question-frontend && npm run lint`
Expected: No errors in CenterModal.vue

- [ ] **Step 4: Run typecheck to verify**

Run: `cd D:\Development\my_projects\ask-question\ask-question-frontend && npm run typecheck`
Expected: No type errors in CenterModal.vue

- [ ] **Step 5: Commit**

```bash
cd D:\Development\my_projects\ask-question\ask-question-frontend
git add src/shared/ui/center-modal/CenterModal.vue
git commit -m "refactor(shared): make CenterModal promise-based like SlideOver"
```

---

### Task 2: Migrate AdminFAQPage.vue (2 instances)

**Files:**
- Modify: `src/pages/admin/faq/ui/AdminFAQPage.vue`

- [ ] **Step 1: Read current AdminFAQPage.vue**

Read the file to understand current CenterModal usage (around lines 81-100 and second instance).

- [ ] **Step 2: Update first CenterModal instance (delete category)**

Replace lines ~81-100. Change from:
```vue
<CenterModal
  v-model:is-open="isDeleteCategoryOpen"
  title="Удалить категорию"
  @close="isDeleteCategoryOpen = false">
  <DeleteCategory
    :id="categoryToDeleteId"
    ref="deleteCategoryRef"
    @success="onDeleteCategorySuccess"
    @cancel="isDeleteCategoryOpen = false" />
  <template #footer>
    <Button
      label="Удалить"
      severity="danger"
      @click="deleteCategoryRef?.confirm()" />
    <Button
      label="Отмена"
      severity="secondary"
      @click="isDeleteCategoryOpen = false" />
  </template>
</CenterModal>
```

To:
```vue
<CenterModal ref="deleteCategoryModalRef">
  <template #header>
    <span>Удалить категорию</span>
  </template>
  <DeleteCategory
    :id="categoryToDeleteId"
    ref="deleteCategoryRef"
    @success="onDeleteCategorySuccess"
    @cancel="deleteCategoryModalRef?.close()" />
  <template #footer>
    <Button
      label="Удалить"
      severity="danger"
      @click="deleteCategoryRef?.confirm()" />
    <Button
      label="Отмена"
      severity="secondary"
      @click="deleteCategoryModalRef?.close()" />
  </template>
</CenterModal>
```

- [ ] **Step 3: Update second CenterModal instance (delete question)**

Find and replace the second CenterModal in the same file (for question deletion) with the same pattern: remove `v-model:is-open`, `title`, `@close`; add `ref`; use `#header` slot; update cancel buttons to use `modalRef?.close()`.

- [ ] **Step 4: Update script section - add refs and update open logic**

In the script section, add refs and update the methods that open the modals:

```typescript
const deleteCategoryModalRef = ref<InstanceType<typeof CenterModal> | null>(null);
const deleteQuestionModalRef = ref<InstanceType<typeof CenterModal> | null>(null);

// Update methods that open modals:
function openDeleteCategoryModal(id: string) {
  categoryToDeleteId.value = id;
  deleteCategoryModalRef.value?.open();
}

function openDeleteQuestionModal(id: string) {
  questionToDeleteId.value = id;
  deleteQuestionModalRef.value?.open();
}
```

Also remove `isDeleteCategoryOpen` and `isDeleteQuestionOpen` refs if they exist.

- [ ] **Step 5: Run lint to verify**

Run: `cd D:\Development\my_projects\ask-question\ask-question-frontend && npm run lint`
Expected: No errors in AdminFAQPage.vue

- [ ] **Step 6: Commit**

```bash
cd D:\Development\my_projects\ask-question\ask-question-frontend
git add src/pages/admin/faq/ui/AdminFAQPage.vue
git commit -m "refactor(admin): migrate AdminFAQPage CenterModal to promise-based API"
```

---

### Task 3: Migrate AdminFAQCategoryPage.vue (2 instances)

**Files:**
- Modify: `src/pages/admin/faq/ui/AdminFAQCategoryPage.vue`

- [ ] **Step 1: Read current AdminFAQCategoryPage.vue**

Read the file to find both CenterModal instances (around lines 76-95 and 150-169).

- [ ] **Step 2: Update first CenterModal instance**

Apply same pattern as Task 2: remove props, add ref, use `#header` slot, update cancel buttons.

- [ ] **Step 3: Update second CenterModal instance**

Apply same pattern for the second modal instance.

- [ ] **Step 4: Update script section**

Add modal refs and update open methods to use `modalRef?.open()` instead of setting boolean props.

- [ ] **Step 5: Run lint to verify**

Run: `cd D:\Development\my_projects\ask-question\ask-question-frontend && npm run lint`

- [ ] **Step 6: Commit**

```bash
cd D:\Development\my_projects\ask-question\ask-question-frontend
git add src/pages/admin/faq/ui/AdminFAQCategoryPage.vue
git commit -m "refactor(admin): migrate AdminFAQCategoryPage CenterModal to promise-based API"
```

---

### Task 4: Migrate AdminFeedbackPage.vue (1 instance)

**Files:**
- Modify: `src/pages/admin/feedback/ui/AdminFeedbackPage.vue`

- [ ] **Step 1: Read current AdminFeedbackPage.vue**

Read the file to find CenterModal usage (around lines 18-39).

- [ ] **Step 2: Update CenterModal**

Apply same pattern: remove `v-model:is-open`, `title`, `@close`; add `ref="modalRef"`; use `#header` slot; update cancel buttons to `modalRef?.close()`.

- [ ] **Step 3: Update script section**

Add modal ref and update the method that opens the modal to use `modalRef?.open()`.

- [ ] **Step 4: Run lint to verify**

Run: `cd D:\Development\my_projects\ask-question\ask-question-frontend && npm run lint`

- [ ] **Step 5: Commit**

```bash
cd D:\Development\my_projects\ask-question\ask-question-frontend
git add src/pages/admin/feedback/ui/AdminFeedbackPage.vue
git commit -m "refactor(admin): migrate AdminFeedbackPage CenterModal to promise-based API"
```

---

### Task 5: Migrate AdminAreasPage.vue (1 instance)

**Files:**
- Modify: `src/pages/admin/areas/ui/AdminAreasPage.vue`

- [ ] **Step 1: Read current AdminAreasPage.vue**

Read the file to find CenterModal usage (around lines 53-75).

- [ ] **Step 2: Update CenterModal**

Apply same pattern as previous tasks.

- [ ] **Step 3: Update script section**

Add modal ref and update open method.

- [ ] **Step 4: Run lint to verify**

Run: `cd D:\Development\my_projects\ask-question\ask-question-frontend && npm run lint`

- [ ] **Step 5: Commit**

```bash
cd D:\Development\my_projects\ask-question\ask-question-frontend
git add src/pages/admin/areas/ui/AdminAreasPage.vue
git commit -m "refactor(admin): migrate AdminAreasPage CenterModal to promise-based API"
```

---

### Task 6: Migrate AdminSpeakersPage.vue (1 instance)

**Files:**
- Modify: `src/pages/admin/speakers/ui/AdminSpeakersPage.vue`

- [ ] **Step 1: Read current AdminSpeakersPage.vue**

Read the file to find CenterModal usage (around lines 63-84).

- [ ] **Step 2: Update CenterModal**

Apply same pattern as previous tasks.

- [ ] **Step 3: Update script section**

Add modal ref and update open method.

- [ ] **Step 4: Run lint to verify**

Run: `cd D:\Development\my_projects\ask-question\ask-question-frontend && npm run lint`

- [ ] **Step 5: Commit**

```bash
cd D:\Development\my_projects\ask-question\ask-question-frontend
git add src/pages/admin/speakers/ui/AdminSpeakersPage.vue
git commit -m "refactor(admin): migrate AdminSpeakersPage CenterModal to promise-based API"
```

---

### Task 7: Final verification

- [ ] **Step 1: Run full lint**

Run: `cd D:\Development\my_projects\ask-question\ask-question-frontend && npm run lint`
Expected: No errors

- [ ] **Step 2: Run FSD check**

Run: `cd D:\Development\my_projects\ask-question\ask-question-frontend && npm run fsd:check`
Expected: No errors

- [ ] **Step 3: Run typecheck**

Run: `cd D:\Development\my_projects\ask-question\ask-question-frontend && npm run typecheck`
Expected: No errors

- [ ] **Step 4: Final commit (if any fixes needed)**

```bash
cd D:\Development\my_projects\ask-question\ask-question-frontend
git add -A
git commit -m "fix: final cleanup after CenterModal promise-based migration"
```
