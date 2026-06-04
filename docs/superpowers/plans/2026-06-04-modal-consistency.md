# Modal Consistency Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Unify the API and usage patterns of SidebarModal, CenterModal, and SlideOver so all modals have consistent button placement, return types, scoped data, and content interaction.

**Architecture:** Keep 3 separate modal components but unify their interfaces: same `ModalResult` return type, same scoped data `{ confirm, close }`, same `closeOnClickAway` prop, same exposed methods. Content components use exposed methods instead of modalConfirm/modalClose props. Action buttons always go in `#footer` slot.

**Tech Stack:** Vue 3.5, PrimeVue 4 (Drawer, Dialog), TypeScript, SCSS

---

### Task 1: Update shared types — ModalResult

**Files:**
- Modify: `src/shared/types/models.ts`
- Modify: `src/shared/types/index.ts`

- [ ] **Step 1: Rename SidebarModalResult to ModalResult in models.ts**

In `src/shared/types/models.ts`, replace the `SidebarModalResult` interface:

```ts
export interface ModalResult {
  status: boolean;
  data?: unknown;
}
```

- [ ] **Step 2: Update the re-export in index.ts**

In `src/shared/types/index.ts`, change the re-export from `SidebarModalResult` to `ModalResult`:

```ts
  type ModalResult,
```

(replace `type SidebarModalResult` with `type ModalResult` in the export from `./models`)

- [ ] **Step 3: Commit**

```bash
git add src/shared/types/models.ts src/shared/types/index.ts
git commit -m "refactor: rename SidebarModalResult to ModalResult"
```

---

### Task 2: Update SidebarModal base component

**Files:**
- Modify: `src/shared/ui/sidebar-modal/SidebarModal.vue`
- Modify: `src/shared/ui/sidebar-modal/index.ts`

- [ ] **Step 1: Update SidebarModal.vue**

Replace the entire `<script setup>` content with:

```ts
import { ref, computed } from 'vue';

import Drawer from 'primevue/drawer';

import type { ModalResult } from '@/shared/types';

defineOptions({ name: 'SidebarModal' });

interface Props {
  closeOnClickAway?: boolean;
}

const { closeOnClickAway = true } = defineProps<Props>();

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
  resolve: (value: ModalResult) => void;
  reject: (reason?: unknown) => void;
} | null = null;

function open(): Promise<ModalResult> {
  let resolve!: (value: ModalResult) => void;
  let reject!: (reason?: unknown) => void;
  const modalPromise = new Promise<ModalResult>((ok, fail) => {
    resolve = ok;
    reject = fail;
  });

  modalController = { resolve, reject };
  isOpen.value = true;

  return modalPromise;
}

function resolveModal(status: boolean, data?: unknown) {
  modalController!.resolve({ status, data });
  isOpen.value = false;
}

function confirm(data?: unknown) {
  resolveModal(true, data);
}

function close() {
  resolveModal(false);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function togglePreloader(_status: boolean) {}

defineExpose({
  open,
  confirm,
  close,
  togglePreloader,
});
```

Update the template scoped data — remove `isOpen` and `togglePreloader`:

```html
<template>
  <Drawer
    v-model:visible="isVisible"
    position="right"
    modal
    :dismissable="closeOnClickAway"
    style="width: 100%; max-width: 400px">
    <template #header>
      <slot name="header"></slot>
    </template>
    <div style="overflow-y: auto; overscroll-behavior: none">
      <slot
        :confirm="confirm"
        :close="close">
      </slot>
    </div>
    <template #footer>
      <slot name="footer"></slot>
    </template>
  </Drawer>
</template>
```

Update the import — change `SidebarModalResult` to `ModalResult`:
```ts
import type { ModalResult } from '@/shared/types';
```

- [ ] **Step 2: Commit**

```bash
git add src/shared/ui/sidebar-modal/SidebarModal.vue
git commit -m "refactor: unify SidebarModal API — ModalResult, simplified scoped data, exposed methods"
```

---

### Task 3: Update CenterModal base component

**Files:**
- Modify: `src/shared/ui/center-modal/CenterModal.vue`

- [ ] **Step 1: Update CenterModal.vue**

Replace the entire file content with:

```html
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
    <div style="overflow-y: auto; overscroll-behavior: none">
      <slot
        :confirm="confirm"
        :close="close"></slot>
    </div>
    <template #footer>
      <slot name="footer"></slot>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import Dialog from 'primevue/dialog';

import type { ModalResult } from '@/shared/types';

defineOptions({ name: 'CenterModal' });

interface Props {
  closeOnClickAway?: boolean;
}

const { closeOnClickAway = true } = defineProps<Props>();

const isVisible = ref(false);
let modalController: {
  resolve: (value: ModalResult) => void;
  reject: (reason?: unknown) => void;
} | null = null;

function open(): Promise<ModalResult> {
  let resolve!: (value: ModalResult) => void;
  let reject!: (reason?: unknown) => void;
  const modalPromise = new Promise<ModalResult>((ok, fail) => {
    resolve = ok;
    reject = fail;
  });

  modalController = { resolve, reject };
  isVisible.value = true;

  return modalPromise;
}

function confirm(data?: unknown) {
  modalController!.resolve({ status: true, data });
  isVisible.value = false;
  modalController = null;
}

function close() {
  modalController!.resolve({ status: false });
  isVisible.value = false;
  modalController = null;
}

function onHide() {
  if (modalController) {
    modalController.resolve({ status: false });
    modalController = null;
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function togglePreloader(_status: boolean) {}

defineExpose({ open, confirm, close, togglePreloader });
</script>

<style lang="scss" scoped>
:global(.p-dark) .p-dialog {
  background: variables.$surface-dark-elevated;
  color: variables.$text-primary-dark;

  :deep(.p-dialog-header) {
    color: variables.$text-primary-dark;
  }

  :deep(.p-dialog-footer) {
    color: variables.$text-primary-dark;
  }
}
</style>
```

Key changes:
- Return type `Promise<ModalResult>` instead of `Promise<string>`
- `confirm(data?)` and `close()` resolve with `{ status, data }` object
- Added `closeOnClickAway` prop (UI behavior unchanged for Dialog — no dismissable mask by default)
- Added `<div style="overflow-y: auto; overscroll-behavior: none">` wrapper around default slot
- Added `togglePreloader` exposed method
- `onHide` guards against double-resolve

- [ ] **Step 2: Commit**

```bash
git add src/shared/ui/center-modal/CenterModal.vue
git commit -m "refactor: unify CenterModal API — ModalResult, closeOnClickAway, overflow wrapper, exposed togglePreloader"
```

---

### Task 4: Update SlideOver base component

**Files:**
- Modify: `src/shared/ui/slide-over/SlideOver.vue`

- [ ] **Step 1: Update SlideOver.vue**

Replace the entire `<script setup>` content with:

```ts
import { computed, ref } from 'vue';

import Drawer from 'primevue/drawer';

import type { ModalResult } from '@/shared/types';

defineOptions({ name: 'SlideOver' });

interface Props {
  closeOnClickAway?: boolean;
}

const { closeOnClickAway = true } = defineProps<Props>();

const isVisible = ref(false);
let modalController: {
  resolve: (value: ModalResult) => void;
  reject: (reason?: unknown) => void;
} | null = null;

const slideOverWidth = computed(() =>
  window.innerWidth < 600 ? '100%' : '400px',
);

function open(): Promise<ModalResult> {
  let resolve!: (value: ModalResult) => void;
  let reject!: (reason?: unknown) => void;
  const modalPromise = new Promise<ModalResult>((ok, fail) => {
    resolve = ok;
    reject = fail;
  });

  modalController = { resolve, reject };
  isVisible.value = true;

  return modalPromise;
}

function confirm(data?: unknown) {
  modalController!.resolve({ status: true, data });
  isVisible.value = false;
  modalController = null;
}

function close() {
  modalController!.resolve({ status: false });
  isVisible.value = false;
  modalController = null;
}

function onHide() {
  if (modalController) {
    modalController.resolve({ status: false });
    modalController = null;
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function togglePreloader(_status: boolean) {}

defineExpose({ open, confirm, close, togglePreloader });
```

Update the template — add `:dismissable`, add overflow wrapper:

```html
<template>
  <Drawer
    v-model:visible="isVisible"
    position="right"
    modal
    :dismissable="closeOnClickAway"
    :style="{ width: slideOverWidth }"
    class="slide-over"
    @hide="onHide">
    <template #header>
      <slot name="header"></slot>
    </template>
    <div style="overflow-y: auto; overscroll-behavior: none">
      <slot
        :confirm="confirm"
        :close="close"></slot>
    </div>
    <template #footer>
      <slot name="footer"></slot>
    </template>
  </Drawer>
</template>
```

- [ ] **Step 2: Commit**

```bash
git add src/shared/ui/slide-over/SlideOver.vue
git commit -m "refactor: unify SlideOver API — ModalResult, closeOnClickAway, overflow wrapper, exposed togglePreloader"
```

---

### Task 5: Update SidebarFeedbackContent — remove modalConfirm/modalClose

**Files:**
- Modify: `src/features/feedback/ui/SidebarFeedbackContent.vue`

- [ ] **Step 1: Remove modalConfirm/modalClose props, emit @success instead**

In `src/features/feedback/ui/SidebarFeedbackContent.vue`, make these changes:

Remove the props destructuring:
```ts
const { modalConfirm, modalClose } = defineProps<{
  modalConfirm: () => Promise<void>;
  modalClose: () => void;
}>();
```

Replace with:
```ts
const emit = defineEmits<{
  success: [];
}>();
```

Update the `useApiCall` onSuccess callback:
```ts
const { execute: executeCreate } = useApiCall(Create, {
  successMessage: 'Обратная связь отправлена',
  onSuccess: () => {
    emit('success');
  },
});
```

Remove `modalClose` from defineExpose:
```ts
defineExpose({
  submitForm,
});
```

- [ ] **Step 2: Commit**

```bash
git add src/features/feedback/ui/SidebarFeedbackContent.vue
git commit -m "refactor: SidebarFeedbackContent — remove modalConfirm/modalClose, emit success"
```

---

### Task 6: Update CreateArea — remove modalConfirm/modalClose

**Files:**
- Modify: `src/entities/area/ui/CreateArea.vue`

- [ ] **Step 1: Remove modalConfirm/modalClose props, simplify cancel**

In `src/entities/area/ui/CreateArea.vue`, make these changes:

Remove the props:
```ts
const { modalConfirm, modalClose, order } = defineProps<{
  modalConfirm: () => Promise<void>;
  modalClose: () => void;
  order: number;
}>();
```

Replace with:
```ts
const { order } = defineProps<{
  order: number;
}>();
```

The `success` emit already exists. Remove `modalConfirm()` call from onSuccess:
```ts
const { execute: executeCreate } = useApiCall(Create, {
  successMessage: 'Область успешно создана',
  onSuccess: (data) => {
    emit('success', data);
  },
});
```

Update `cancel()` — remove `modalClose()` call, just reset the form:
```ts
function cancel() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (formRef.value as any)?.reset();
}
```

- [ ] **Step 2: Commit**

```bash
git add src/entities/area/ui/CreateArea.vue
git commit -m "refactor: CreateArea — remove modalConfirm/modalClose props"
```

---

### Task 7: Update UserProfile — remove internal buttons, add exposed methods

**Files:**
- Modify: `src/entities/user/ui/UserProfile.vue`

- [ ] **Step 1: Remove internal buttons, add exposed methods**

Remove the "Изменить пароль" button block (lines 40-47):
```html
<template v-if="!showChangePassword">
  <Button
    class="mt-5"
    size="small"
    @click="showChangePassword = true">
    Изменить пароль
  </Button>
</template>
```

Remove the bottom button block (lines 104-117):
```html
<div class="flex gap-2 mt-4">
  <Button
    v-if="showChangePassword"
    :disabled="!$form.valid"
    type="submit">
    Сохранить
  </Button>
  <Button
    severity="secondary"
    outlined
    @click="emit('cancel')">
    Отмена
  </Button>
</div>
```

Add exposed methods and computed after the `resolver` line:
```ts
const isChangingPassword = computed(() => showChangePassword.value);

function changePassword() {
  showChangePassword.value = true;
}

function cancelChangePassword() {
  showChangePassword.value = false;
}

function submitForm() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (formRef.value as any)?.submit();
}

const formRef = useTemplateRef('form');

defineExpose({
  isChangingPassword,
  changePassword,
  cancelChangePassword,
  submitForm,
});
```

Add `useTemplateRef` to imports (it's already imported via `ref, computed` — add `useTemplateRef`):
```ts
import { ref, computed, useTemplateRef } from 'vue';
```

Remove the `emit('cancel')` from the template since the cancel button is removed.

The `@submit="onSubmit"` handler on the Form stays the same. The `onSubmit` function stays the same. The `emit('success')` in the `useApiCall` onSuccess stays the same.

Add `ref="form"` to the `<Form>` element if not already present (it is — line 3).

- [ ] **Step 2: Commit**

```bash
git add src/entities/user/ui/UserProfile.vue
git commit -m "refactor: UserProfile — remove internal buttons, add exposed methods for footer control"
```

---

### Task 8: Update QuestionCommentButton — move buttons to footer

**Files:**
- Modify: `src/features/manage-question/ui/QuestionCommentButton.vue`

- [ ] **Step 1: Restructure template — move buttons from default slot to footer**

Replace the SidebarModal template section (lines 12-38) with:

```html
<SidebarModal ref="sidebarModalRef">
  <template #header>
    <span>Комментарий к вопросу</span>
  </template>
  <template #default>
    <Textarea
      v-model="localComment"
      auto-resize
      rows="4"
      class="w-full"
      placeholder="Введите комментарий..." />
  </template>
  <template #footer>
    <Button
      label="Сохранить"
      @click="saveComment()" />
    <Button
      label="Отмена"
      outlined
      severity="secondary"
      @click="sidebarModalRef?.close()" />
  </template>
</SidebarModal>
```

Update `saveComment` function — remove the `confirm` parameter, use templateRef:

```ts
async function saveComment() {
  const result = await executeSetComment(
    questionId,
    localComment.value || null,
  );
  if (result !== undefined) {
    sidebarModalRef.value?.confirm();
  }
}
```

Remove the `question-comment-button__modal-content` and `question-comment-button__modal-actions` styles since they're no longer needed.

- [ ] **Step 2: Commit**

```bash
git add src/features/manage-question/ui/QuestionCommentButton.vue
git commit -m "refactor: QuestionCommentButton — move action buttons to footer slot"
```

---

### Task 9: Update DefaultLayout — adapt SidebarFeedbackContent, standardize buttons

**Files:**
- Modify: `src/app/layouts/DefaultLayout.vue`

- [ ] **Step 1: Update SidebarFeedbackContent usage and buttons**

Replace the SidebarModal section (lines 42-59) with:

```html
<SidebarModal ref="feedback-modal">
  <template #header>Обратная связь</template>
  <template #default>
    <SidebarFeedbackContent
      ref="feedback-content"
      @success="onFeedbackSuccess" />
  </template>
  <template #footer>
    <Button
      label="Отправить"
      @click="feedbackContent?.submitForm()" />
    <Button
      label="Отмена"
      outlined
      severity="secondary"
      @click="feedbackModal?.close()" />
  </template>
</SidebarModal>
```

Add the `onFeedbackSuccess` handler in the script:

```ts
function onFeedbackSuccess() {
  feedbackModal.value?.confirm();
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/layouts/DefaultLayout.vue
git commit -m "refactor: DefaultLayout — adapt SidebarFeedbackContent, standardize cancel button"
```

---

### Task 10: Update AdminLayout — UserProfile buttons in footer

**Files:**
- Modify: `src/app/layouts/AdminLayout.vue`

- [ ] **Step 1: Update SlideOver with UserProfile footer buttons**

Replace the SlideOver section (lines 38-46) with:

```html
<SlideOver ref="userProfileSlideOver">
  <template #header>
    <span class="typography__headline--medium">Профиль пользователя</span>
  </template>
  <UserProfile
    ref="user-profile"
    @success="onProfileSuccess" />
  <template #footer>
    <template v-if="userProfileRef?.isChangingPassword">
      <Button
        label="Сохранить"
        @click="userProfileRef?.submitForm()" />
      <Button
        label="Отмена"
        outlined
        severity="secondary"
        @click="userProfileRef?.cancelChangePassword()" />
    </template>
    <template v-else>
      <Button
        label="Изменить пароль"
        @click="userProfileRef?.changePassword()" />
      <Button
        label="Отмена"
        outlined
        severity="secondary"
        @click="userProfileSlideOver?.close()" />
    </template>
  </template>
</SlideOver>
```

Add template ref for UserProfile and update script:

```ts
const userProfileRef = useTemplateRef('user-profile');
```

Update `closeUserProfile` and add `onProfileSuccess`:

```ts
function onProfileSuccess() {
  userProfileSlideOver.value?.confirm();
  showUserProfile.value = false;
}

function closeUserProfile() {
  showUserProfile.value = false;
  userProfileSlideOver.value?.close();
}
```

Remove the `:is-open="showUserProfile"` prop from UserProfile since it's not declared in UserProfile's props.

- [ ] **Step 2: Commit**

```bash
git add src/app/layouts/AdminLayout.vue
git commit -m "refactor: AdminLayout — UserProfile buttons in footer, standardize cancel"
```

---

### Task 11: Update AdminAreasPage — remove modal props, standardize buttons

**Files:**
- Modify: `src/pages/admin/areas/ui/AdminAreasPage.vue`

- [ ] **Step 1: Update SidebarModal for CreateArea**

Replace the create SidebarModal (lines 31-51) with:

```html
<SidebarModal ref="create-area-modal">
  <template #header>Создать область</template>
  <template #default>
    <CreateArea
      ref="create-area"
      :order="areas.length"
      @success="successCreateArea" />
  </template>
  <template #footer>
    <Button
      label="Создать"
      @click="createAreaRef?.submitForm()" />
    <Button
      label="Отмена"
      outlined
      severity="secondary"
      @click="createAreaModal?.close()" />
  </template>
</SidebarModal>
```

- [ ] **Step 2: Update CenterModal for DeleteArea**

Replace the delete CenterModal (lines 53-76) with:

```html
<CenterModal ref="delete-area-modal">
  <template #header>Удалить запись</template>
  <template #default>
    <DeleteArea
      v-if="currentArea"
      :id="currentArea.id"
      ref="delete-area"
      @success="successDeleteArea" />
  </template>
  <template #footer>
    <Button
      label="Удалить"
      severity="danger"
      @click="deleteAreaRef?.confirm()" />
    <Button
      label="Отмена"
      outlined
      severity="secondary"
      @click="deleteAreaModalRef?.close()" />
  </template>
</CenterModal>
```

Key changes: removed `:modal-confirm`, `:modal-close`, `@cancel` from DeleteArea. Changed cancel button from `createAreaRef?.cancel()` to `createAreaModal?.close()`.

Update `successCreateArea` to confirm the modal:

```ts
function successCreateArea(area: AreaResponse) {
  areas.value = [...areas.value, area];
  createAreaModal.value?.confirm();
}
```

Update `successDeleteArea` to confirm instead of close:

```ts
function successDeleteArea(areaId: string) {
  areas.value = areas.value.filter((area) => area.id !== areaId);
  deleteAreaModalRef.value?.confirm();
}
```

Add the missing template ref for create-area-modal if needed (it's already defined as `createAreaModal` on line 113).

- [ ] **Step 3: Commit**

```bash
git add src/pages/admin/areas/ui/AdminAreasPage.vue
git commit -m "refactor: AdminAreasPage — remove modal props, standardize buttons, confirm on success"
```

---

### Task 12: Update AdminSpeakersPage — standardize buttons

**Files:**
- Modify: `src/pages/admin/speakers/ui/AdminSpeakersPage.vue`

- [ ] **Step 1: Standardize all modal buttons**

Replace the create SlideOver (lines 19-38) — change "Закрыть" to "Отмена":

```html
<SlideOver ref="create-slide-over">
  <template #header>
    <span class="slide-over-header">Создать спикера</span>
  </template>
  <CreateSpeaker
    ref="create-speaker"
    @success="successCreateSpeaker" />
  <template #footer>
    <Button
      label="Создать"
      @click="createSpeakerRef?.submitForm()" />
    <Button
      label="Отмена"
      outlined
      severity="secondary"
      @click="createSlideOverRef?.close()" />
  </template>
</SlideOver>
```

Replace the update SlideOver (lines 40-61) — change "Закрыть" to "Отмена":

```html
<SlideOver ref="update-slide-over">
  <template #header>
    <span class="slide-over-header">Изменить спикера</span>
  </template>
  <UpdateSpeaker
    v-if="currentSpeaker"
    ref="update-speaker"
    :speaker="currentSpeaker"
    @success="successUpdateSpeaker" />
  <template #footer>
    <Button
      label="Изменить"
      @click="updateSpeakerRef?.submitForm()" />
    <Button
      label="Отмена"
      outlined
      severity="secondary"
      @click="updateSlideOverRef?.close()" />
  </template>
</SlideOver>
```

The delete CenterModal (lines 63-85) is already correct — no changes needed.

Update `successCreateSpeaker` to confirm instead of close:

```ts
function successCreateSpeaker(speaker: CreateSpeakerResponse) {
  fetchData();
  createSlideOverRef.value?.confirm();
}
```

Update `successUpdateSpeaker` to confirm instead of close:

```ts
function successUpdateSpeaker(modifiedSpeaker: SpeakerResponse) {
  speakers.value = speakers.value.map((s) =>
    s.id === modifiedSpeaker.id ? modifiedSpeaker : s,
  );
  updateSlideOverRef.value?.confirm();
}
```

Update `successDeleteSpeaker` to confirm instead of close:

```ts
function successDeleteSpeaker(speakerId: string) {
  speakers.value = speakers.value.filter((s) => s.id !== speakerId);
  deleteModalRef.value?.confirm();
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/admin/speakers/ui/AdminSpeakersPage.vue
git commit -m "refactor: AdminSpeakersPage — standardize cancel button, confirm on success"
```

---

### Task 13: Update AdminFeedbackPage — standardize buttons

**Files:**
- Modify: `src/pages/admin/feedback/ui/AdminFeedbackPage.vue`

- [ ] **Step 1: Update success handler to confirm instead of close**

Update `successDeleteFeedback`:

```ts
function successDeleteFeedback(feedbackId: string) {
  feedbacks.value = feedbacks.value.filter(
    (feedback) => feedback.id !== feedbackId,
  );
  feedbackModalRef.value?.confirm();
}
```

The delete CenterModal template is already correct — no changes needed.

- [ ] **Step 2: Commit**

```bash
git add src/pages/admin/feedback/ui/AdminFeedbackPage.vue
git commit -m "refactor: AdminFeedbackPage — confirm on success"
```

---

### Task 14: Update AdminFAQPage — standardize buttons

**Files:**
- Modify: `src/pages/admin/faq/ui/AdminFAQPage.vue`

- [ ] **Step 1: Standardize delete modal cancel button**

In the delete CenterModal (lines 81-100), add `outlined` to the "Отмена" button:

```html
<Button
  label="Отмена"
  outlined
  severity="secondary"
  @click="deleteCategoryModalRef?.close()" />
```

- [ ] **Step 2: Update success handlers to confirm instead of close**

```ts
function successCreateCategory(category: FaqCategoryResponse) {
  const categoryWithEntries: FaqCategoryWithEntriesResponse = {
    ...category,
    entries: [],
  };
  categories.value = [...categories.value, categoryWithEntries];
  createCategorySlideOver.value?.confirm();
}
```

```ts
function successUpdateCategory(name: string) {
  if (currentCategory.value) {
    const idx = categories.value.findIndex(
      (c) => c.id === currentCategory.value!.id,
    );
    if (idx !== -1) {
      categories.value[idx] = { ...categories.value[idx], name };
    }
  }
  updateCategorySlideOver.value?.confirm();
}
```

```ts
function onDeleteCategorySuccess(id: string) {
  categories.value = categories.value.filter((category) => category.id !== id);
  deleteCategoryModalRef.value?.confirm();
}
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/admin/faq/ui/AdminFAQPage.vue
git commit -m "refactor: AdminFAQPage — standardize cancel button, confirm on success"
```

---

### Task 15: Update AdminFAQCategoryPage — standardize buttons

**Files:**
- Modify: `src/pages/admin/faq/ui/AdminFAQCategoryPage.vue`

- [ ] **Step 1: Standardize delete modal cancel buttons**

In the delete category CenterModal (lines 76-93), add `outlined` to "Отмена":

```html
<Button
  label="Отмена"
  outlined
  severity="secondary"
  @click="deleteCategoryModalRef?.close()" />
```

In the delete entry CenterModal (lines 148-165), add `outlined` to "Отмена":

```html
<Button
  label="Отмена"
  outlined
  severity="secondary"
  @click="deleteEntryModalRef?.close()" />
```

- [ ] **Step 2: Update success handlers to confirm instead of close**

```ts
function successUpdateCategory(name: string) {
  if (category.value) {
    category.value.name = name;
  }
  updateCategorySlideOver.value?.confirm();
}
```

```ts
function successCreateEntry(entry: FaqEntryResponse) {
  category.value?.entries.push(entry);
  createEntrySlideOver.value?.confirm();
}
```

```ts
function successUpdateEntry(updatedEntry: FaqEntryResponse) {
  if (category.value) {
    category.value.entries = category.value.entries.map(
      (e: FaqEntryResponse) => (e.id === updatedEntry.id ? updatedEntry : e),
    );
  }
  updateEntrySlideOver.value?.confirm();
}
```

```ts
function onDeleteCategorySuccess() {
  deleteCategoryModalRef.value?.confirm();
  router.push({ name: 'admin-faq' });
}
```

```ts
function onDeleteEntrySuccess(entryId: string) {
  if (category.value) {
    category.value.entries = category.value.entries.filter(
      (e: FaqEntryResponse) => e.id !== entryId,
    );
  }
  deleteEntryModalRef.value?.confirm();
}
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/admin/faq/ui/AdminFAQCategoryPage.vue
git commit -m "refactor: AdminFAQCategoryPage — standardize cancel button, confirm on success"
```

---

### Task 16: Run verification

- [ ] **Step 1: Run typecheck**

```bash
npm run typecheck
```

Expected: no errors

- [ ] **Step 2: Run lint**

```bash
npm run lint
```

Expected: no errors

- [ ] **Step 3: Run FSD check**

```bash
npm run fsd:check
```

Expected: no errors (the `fsd/insignificant-slice` rule is disabled)

- [ ] **Step 4: Run tests**

```bash
npm run test
```

Expected: all tests pass

- [ ] **Step 5: Fix any issues found, then commit**

If any verification fails, fix the issues and commit the fix.
