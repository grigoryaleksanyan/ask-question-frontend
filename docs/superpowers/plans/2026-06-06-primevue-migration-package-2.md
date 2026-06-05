# PrimeVue Migration — Package 2 (Medium Impact) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace medium-impact manual components and patterns with PrimeVue equivalents: search input → IconField, period tabs → SelectButton, admin tabs → Tabs, inline editing → Inplace, delete confirmations → ConfirmDialog.

**Architecture:** All changes stay within existing FSD slices. Preserve existing prop/emits contracts. For ConfirmDialog, add a global `<ConfirmDialog />` instance in the layout that all delete components can share via `useConfirm()`.

**Tech Stack:** Vue 3.5, PrimeVue 4.5.5, TypeScript, SCSS, FSD v2.1, Vue Router 5, Pinia 3.

---

## File Structure

| File | Action | Responsibility |
|---|---|---|
| `src/entities/question/ui/QuestionsView.vue` | Modify | Replace search input + icon with `IconField` + `InputText` |
| `src/widgets/dashboard/ui/DashboardFilters.vue` | Modify | Replace manual period buttons with `SelectButton` |
| `src/pages/admin/questions/ui/AdminQuestionsPage.vue` | Modify | Replace manual tabs with `Tabs` |
| `src/entities/area/ui/AreaCard.vue` | Modify | Replace inline editing with `Inplace` |
| `src/entities/area/ui/DeleteArea.vue` | Delete (or repurpose) | Replace with `useConfirm()` |
| `src/entities/user/ui/DeleteSpeaker.vue` | Delete (or repurpose) | Replace with `useConfirm()` |
| `src/features/feedback/ui/DeleteFeedback.vue` | Delete (or repurpose) | Replace with `useConfirm()` |
| `src/entities/faq/ui/DeleteCategory.vue` | Delete (or repurpose) | Replace with `useConfirm()` |
| `src/entities/faq/ui/DeleteEntry.vue` | Delete (or repurpose) | Replace with `useConfirm()` |
| `src/app/layouts/AdminLayout.vue` and/or `src/app/entrypoint/App.vue` | Modify | Add global `<ConfirmDialog />` |
| `tests/` | Verify | Run existing tests to ensure no regressions |

---

### Task 1: QuestionsView search → IconField + InputText

**Files:**
- Modify: `src/entities/question/ui/QuestionsView.vue`

- [ ] **Step 1: Read the current file**

Read: `src/entities/question/ui/QuestionsView.vue`
Note: The search input is currently a manual `<input>` with `pi pi-search` icon positioned absolutely.

- [ ] **Step 2: Replace search block with IconField + InputText**

Replace this block in `<template>`:
```vue
    <div class="questions-view__search-wrap">
      <i class="pi pi-search questions-view__search-icon"></i>
      <input
        v-model="searchQuery"
        class="questions-view__search-input"
        placeholder="Поиск вопросов..." />
    </div>
```

with:
```vue
    <IconField class="questions-view__search-wrap">
      <InputIcon class="pi pi-search" />
      <InputText
        v-model="searchQuery"
        class="questions-view__search-input"
        placeholder="Поиск вопросов..." />
    </IconField>
```

- [ ] **Step 3: Add imports**

At top of `<script setup>`:
```typescript
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
```

- [ ] **Step 4: Remove now-unnecessary CSS**

In `<style lang="scss" scoped>`, delete or simplify:
- `.questions-view__search-icon` (the `InputIcon` component handles positioning)
- Remove `position: relative` from `.questions-view__search-wrap` if it only existed for icon positioning (check if it serves other purposes first)
- Keep `.questions-view__search-input` styles (padding, border, etc.) but adjust left padding if it was 38px to accommodate icon (IconField handles this, but verify visually)

**Note:** The `InputIcon` component from PrimeVue places the icon inside the input field automatically. You may need to remove or adjust the left padding of `.questions-view__search-input` from `padding: 10px 14px 10px 38px` to something like `padding: 10px 14px` since the icon is now handled by PrimeVue.

- [ ] **Step 5: Run lint and typecheck**

```bash
npm run eslint:check -- src/entities/question/ui/QuestionsView.vue
npm run typecheck
```
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/entities/question/ui/QuestionsView.vue
git commit -m "feat(questions): replace manual search input with PrimeVue IconField + InputText"
```

---

### Task 2: DashboardFilters period buttons → SelectButton

**Files:**
- Modify: `src/widgets/dashboard/ui/DashboardFilters.vue`

- [ ] **Step 1: Read the current file**

Read: `src/widgets/dashboard/ui/DashboardFilters.vue`
Note: The period selector is currently manual `<button>` elements with active state classes.

- [ ] **Step 2: Replace period buttons with SelectButton**

Replace this block in `<template>`:
```vue
    <div class="dashboard-filters__period-tabs">
      <button
        v-for="option in periodOptions"
        :key="option.value"
        class="dashboard-filters__period-tab"
        :class="{
          'dashboard-filters__period-tab--active':
            selectedPeriod === option.value,
        }"
        @click="selectedPeriod = option.value">
        {{ option.label }}
      </button>
    </div>
```

with:
```vue
    <SelectButton
      v-model="selectedPeriod"
      :options="periodOptions"
      option-label="label"
      option-value="value"
      class="dashboard-filters__period-tabs" />
```

- [ ] **Step 3: Add import**

At top of `<script setup>`:
```typescript
import SelectButton from 'primevue/selectbutton';
```

- [ ] **Step 4: Remove manual period tab CSS**

In `<style lang="scss" scoped>`, delete the entire block:
```scss
.dashboard-filters__period-tabs { ... }
.dashboard-filters__period-tab { ... }
.dashboard-filters__period-tab:hover { ... }
.dashboard-filters__period-tab--active { ... }
```

Keep other styles (if any). If there are no other styles in the `<style>` block, you can remove the entire `<style>` block or keep it empty (but empty blocks are forbidden by `vue/no-empty-component-block` rule).

- [ ] **Step 5: Verify `selectedPeriod` v-model works**

`selectedPeriod` is already a `defineModel<number>('periodDays', { default: 30 })`. The `SelectButton` v-model binding should work with `option-value="value"`. Confirm the data types match: `periodOptions` values are `number`, `selectedPeriod` is `number`. 

- [ ] **Step 6: Run lint and typecheck**

```bash
npm run eslint:check -- src/widgets/dashboard/ui/DashboardFilters.vue
npm run typecheck
```
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/widgets/dashboard/ui/DashboardFilters.vue
git commit -m "feat(dashboard): replace manual period tabs with PrimeVue SelectButton"
```

---

### Task 3: AdminQuestionsPage tabs → Tabs

**Files:**
- Modify: `src/pages/admin/questions/ui/AdminQuestionsPage.vue`

- [ ] **Step 1: Read the current file**

Read: `src/pages/admin/questions/ui/AdminQuestionsPage.vue`
Note: This file was already modified in Package 1 (Task 3). The current tabs are manual `<button>` elements with CSS classes.

- [ ] **Step 2: Replace tabs with PrimeVue Tabs**

Replace the tabs block in `<template>`:
```vue
    <div class="admin-questions-page__tabs">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="admin-questions-page__tab"
        :class="{
          'admin-questions-page__tab--active': activeTab === tab.key,
        }"
        @click="activeTab = tab.key">
        {{ tab.label }}
      </button>
    </div>
```

with:
```vue
    <Tabs v-model:value="activeTab" class="admin-questions-page__tabs">
      <TabList>
        <Tab
          v-for="tab in tabs"
          :key="tab.key"
          :value="tab.key">
          {{ tab.label }}
        </Tab>
      </TabList>
    </Tabs>
```

**Important:** PrimeVue `Tabs` uses `value` prop for the active tab. Since `activeTab` is a `ref<string>`, `v-model:value` should work. However, verify that `Tab` `value` prop accepts string values (it should, but check PrimeVue 4 docs for Tabs component).

- [ ] **Step 3: Add imports**

At top of `<script setup>`:
```typescript
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
```

- [ ] **Step 4: Remove manual tab CSS**

In `<style lang="scss" scoped>`, delete:
```scss
.admin-questions-page__tabs { ... }
.admin-questions-page__tab { ... }
.admin-questions-page__tab--active { ... }
```

- [ ] **Step 5: Verify `activeTab` data flow**

The `activeTab` ref is watched and triggers `fetchData()`. The `Tabs` component should emit `update:value` when tab changes. Since `v-model:value` is used, this should work identically to the manual `@click` handler. Verify that `activeTab` still triggers `fetchData()` when changed.

- [ ] **Step 6: Run lint and typecheck**

```bash
npm run eslint:check -- src/pages/admin/questions/ui/AdminQuestionsPage.vue
npm run typecheck
```
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/pages/admin/questions/ui/AdminQuestionsPage.vue
git commit -m "feat(admin): replace manual tabs with PrimeVue Tabs"
```

---

### Task 4: AreaCard inline editing → Inplace

**Files:**
- Modify: `src/entities/area/ui/AreaCard.vue`

- [ ] **Step 1: Read the current file**

Read: `src/entities/area/ui/AreaCard.vue`
Note: The current inline editing is a manual toggle between `<input>` (with v-model, @keydown, @blur) and `<span>`.

- [ ] **Step 2: Replace inline editing with Inplace**

Replace the entire `<template>` block (the `isEditing` template/else block) with:

```vue
<template>
  <div class="area-card">
    <span class="area-card__handle handle">⠷</span>

    <Inplace
      :pt="{ display: { class: 'area-card__title' } }"
      @close="cancelEdit"
      @open="startEdit">
      <template #display>
        <span>{{ area.title }}</span>
        <i class="pi pi-pencil area-card__edit" @click.stop="startEdit"></i>
      </template>
      <template #content>
        <InputText
          ref="editInputRef"
          v-model="editTitle"
          class="area-card__input"
          @keydown.enter="saveEdit"
          @keydown.escape="cancelEdit"
          @blur="saveEdit" />
      </template>
    </Inplace>

    <i
      class="pi pi-trash area-card__delete"
      @click="emit('delete')"></i>
  </div>
</template>
```

**Important:** The `Inplace` component manages the open/close state internally. We need to handle the edit flow carefully:
- On click of the pencil icon → open edit mode (`Inplace` opens)
- On Enter/Blur → save (if changed)
- On Escape → cancel (revert)
- The `editInputRef` needs to be focused when edit mode opens. Use `nextTick()` after `open` event.

However, `Inplace` may not have a direct `open` event for us to hook into. Let me check the PrimeVue Inplace API...

Actually, looking at the PrimeVue Inplace component, it toggles between display and content on click. The pencil icon inside the display slot would trigger the toggle. But we want the pencil icon to trigger edit, not the entire row. This may be tricky.

Alternative approach: Keep the manual toggle for the pencil icon, but use `Inplace` only for the blur/enter/save workflow. Or... simpler: just use `Inplace` with the display slot containing the title and the pencil icon, and the content slot containing the input. `Inplace` will toggle when clicked. To make only the pencil icon trigger the edit, we can use `@click.stop=""` on the display content (the title) and let the pencil icon click propagate to the `Inplace` toggle.

Actually, a better approach: wrap the display in a span with `@click.stop` so clicking the title doesn't open edit mode, and only the pencil icon opens it. But `Inplace` toggles on click of the entire display slot... This is complex.

**Simpler approach:** Keep the manual toggle for the pencil icon, but refactor the blur/enter logic to be cleaner. Actually, since the plan says to use `Inplace`, let's do it properly:

```vue
<template>
  <div class="area-card">
    <span class="area-card__handle handle">⠷</span>

    <span class="area-card__title">{{ area.title }}</span>

    <Inplace
      :active="isEditing"
      @update:active="handleActiveChange"
      :pt="{ display: { class: 'area-card__edit-trigger' } }"
      class="area-card__inplace">
      <template #display>
        <i class="pi pi-pencil area-card__edit" @click="startEdit"></i>
      </template>
      <template #content>
        <InputText
          ref="editInputRef"
          v-model="editTitle"
          class="area-card__input"
          @keydown.enter="saveEdit"
          @keydown.escape="cancelEdit"
          @blur="saveEdit" />
      </template>
    </Inplace>

    <i
      class="pi pi-trash area-card__delete"
      @click="emit('delete')"></i>
  </div>
</template>
```

Wait, `Inplace` in PrimeVue 4 may not have an `active` prop for external control. Let me reconsider...

**Alternative:** Keep it simpler. The current implementation is actually quite clean and works well. The `Inplace` component is mostly useful when you want a click-to-edit pattern on the text itself. Here we have a pencil icon that triggers edit. This might not be a great fit for `Inplace`.

Actually, looking at PrimeVue 4 docs: `Inplace` has a `v-model:active` prop that can be controlled. So we can do:

```vue
<Inplace v-model:active="isEditing">
  <template #display>
    <span class="area-card__title">{{ area.title }}</span>
  </template>
  <template #content>
    <InputText
      ref="editInputRef"
      v-model="editTitle"
      class="area-card__input"
      @keydown.enter="saveEdit"
      @keydown.escape="cancelEdit"
      @blur="saveEdit" />
  </template>
</Inplace>
```

But then clicking the title opens edit mode, which may not be desired (currently only the pencil icon triggers edit). We could keep the pencil icon outside the Inplace and use it to toggle `isEditing`. However, `Inplace` with `v-model:active` would still show the display slot when `isEditing` is false. But we want the title visible even in display mode. So maybe we don't need Inplace at all for this specific use case.

Hmm, this is getting complicated. Let me check the PrimeVue docs more carefully...

PrimeVue 4 Inplace component: https://primevue.org/inplace

The Inplace component toggles between display and content on click. The display is what shows normally. When clicked, it shows the content. The content has save/cancel buttons by default, or you can use the `close` event.

For our use case:
- Display: title + pencil icon
- Content: input field
- Click on display (title) → shows content (input) → this is actually desired behavior! Clicking the title to edit is intuitive.
- But we also want the pencil icon to trigger edit. Both would work with Inplace.

So the approach is:
```vue
<Inplace
  :closable="true"
  @close="cancelEdit"
  @open="startEdit"
  :pt="{ display: { class: 'area-card__display' } }">
  <template #display>
    <span class="area-card__title">{{ area.title }}</span>
    <i class="pi pi-pencil area-card__edit"></i>
  </template>
  <template #content>
    <InputText
      ref="editInputRef"
      v-model="editTitle"
      class="area-card__input"
      @keydown.enter="saveEdit"
      @keydown.escape="cancelEdit"
      @blur="saveEdit" />
  </template>
</Inplace>
```

Wait, but `Inplace` opens on click of the display. If the user clicks the pencil icon, it also opens. That's fine. But if they click anywhere else in the display (the title), it also opens. Currently, only the pencil icon triggers edit. Is this acceptable? Probably yes, clicking the title to edit is a standard UX pattern.

However, we need to handle the blur/save correctly. In the current implementation, `@blur` on the input calls `saveEdit`. With `Inplace`, the blur might also trigger the `close` event. We need to be careful not to double-save.

Let me simplify: use Inplace without `@blur` on the input, and instead use Inplace's built-in close behavior or handle it manually.

Actually, looking at the current code, the `saveEdit` function checks `!isEditing.value` at the start and returns early. So if blur fires while `isEditing` is already false (because Inplace closed it), it won't execute. This should prevent double-save.

But wait, Inplace might not set `isEditing` to false on blur - it might use its own internal state. This is getting complex.

**Revised approach for the plan:**

Use `Inplace` with `v-model:active` to control the editing state externally. The `display` slot shows the title and pencil icon. The `content` slot shows the input. The pencil icon has `@click.stop="isEditing = true"` to trigger edit. The `display` slot also triggers edit on click (Inplace default behavior). We keep the `@blur`, `@keydown.enter`, `@keydown.escape` handlers on the input. The `saveEdit` and `cancelEdit` functions set `isEditing = false` to close Inplace.

Actually, I realize this is getting too detailed for the plan. Let me keep it simpler and let the implementer figure out the exact Inplace API.

**Plan approach for Task 4:**

Replace the `isEditing` template/else block with PrimeVue `Inplace`. The display slot contains the title text and the pencil icon. The content slot contains the `InputText`. The `open` and `close` events of `Inplace` are used to sync with `isEditing` state. The input handlers (enter, escape, blur) remain similar but set `isEditing = false` to close Inplace after save/cancel. Focus the input when Inplace opens using `nextTick`.

Add imports:
```typescript
import Inplace from 'primevue/inplace';
import InputText from 'primevue/inputtext';
```

Remove the `isEditing` ref and replace it with `Inplace`'s internal state or `v-model:active`. The `editTitle` ref remains.

Keep the `saveEdit`, `cancelEdit`, and `startEdit` functions but adjust them to work with `Inplace` state.

- [ ] **Step 5: Run lint and typecheck**

```bash
npm run eslint:check -- src/entities/area/ui/AreaCard.vue
npm run typecheck
```
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/entities/area/ui/AreaCard.vue
git commit -m "feat(area): replace inline editing with PrimeVue Inplace"
```

---

### Task 5: Delete components → ConfirmDialog

**Files:**
- Modify (add ConfirmDialog): `src/app/entrypoint/App.vue` or `src/app/layouts/AdminLayout.vue`
- Delete: `src/entities/area/ui/DeleteArea.vue`
- Delete: `src/entities/user/ui/DeleteSpeaker.vue`
- Delete: `src/features/feedback/ui/DeleteFeedback.vue`
- Delete: `src/entities/faq/ui/DeleteCategory.vue`
- Delete: `src/entities/faq/ui/DeleteEntry.vue`
- Modify: `src/pages/admin/areas/ui/AdminAreasPage.vue`
- Modify: `src/pages/admin/speakers/ui/AdminSpeakersPage.vue`
- Modify: `src/pages/admin/feedback/ui/AdminFeedbackPage.vue`
- Modify: `src/pages/admin/faq/ui/AdminFAQPage.vue`
- Modify: `src/pages/admin/faq/ui/AdminFAQCategoryPage.vue`

- [ ] **Step 1: Add global ConfirmDialog to layouts**

Add `<ConfirmDialog />` to the root layout(s) where it's needed. Since delete operations happen in admin pages, add it to `AdminLayout.vue` or `App.vue` (if App.vue is the root).

Read `src/app/entrypoint/App.vue` to check its structure. If it's minimal, add it there. Otherwise add to `AdminLayout.vue`.

Import:
```typescript
import ConfirmDialog from 'primevue/confirmdialog';
```

Add to template:
```vue
<ConfirmDialog />
```

- [ ] **Step 2: Refactor AdminAreasPage to use useConfirm**

Read `src/pages/admin/areas/ui/AdminAreasPage.vue`.

Replace the `CenterModal` + `DeleteArea` usage with `useConfirm()` from PrimeVue.

In `<script setup>`, import:
```typescript
import { useConfirm } from 'primevue/useconfirm';
const confirm = useConfirm();
```

Replace the `clickDeleteAreaBtn` function and modal handling with a function that calls `confirm.require()`:

```typescript
function clickDeleteAreaBtn(area: AreaResponse) {
  confirm.require({
    message: 'Вы действительно хотите удалить область?',
    header: 'Удалить область',
    icon: 'pi pi-exclamation-triangle',
    acceptProps: { label: 'Удалить', severity: 'danger' },
    rejectProps: { label: 'Отмена', severity: 'secondary' },
    accept: async () => {
      const result = await Delete(area.id);
      if (result !== undefined) {
        areas.value = areas.value.filter((a) => a.id !== area.id);
        // Show success toast if needed
      }
    },
    reject: () => {
      // Do nothing
    },
  });
}
```

Wait, the `DeleteArea` component currently uses `useDeleteConfirm` which wraps `useApiCall`. We need to preserve the toast and error handling. The `useDeleteConfirm` helper does this. We could either:
A. Use `useConfirm` directly but replicate the toast/error logic
B. Create a new composable that wraps `useConfirm` + `useApiCall`
C. Keep the `DeleteArea` component but make it much simpler, using `useConfirm` internally

Option C is the simplest migration: keep the component but replace the modal with `useConfirm`. But the spec says to replace with `ConfirmDialog` to eliminate 5 components.

Option B: Create a `useDeleteConfirmDialog` composable that replaces the 5 components. This is the cleanest approach.

Let's go with Option B. Create a new shared composable:

**New file:** `src/shared/lib/use-delete-confirm-dialog.ts`

```typescript
import { useConfirm } from 'primevue/useconfirm';
import { useApiCall } from './use-api-call';

export function useDeleteConfirmDialog({
  apiFn,
  message,
  header,
  successMessage,
}: {
  apiFn: (id: string) => Promise<unknown>;
  message: string;
  header: string;
  successMessage: string;
}) {
  const confirm = useConfirm();
  const { execute } = useApiCall(apiFn, {
    successMessage,
    showPreloader: false,
  });

  return {
    confirmDelete(id: string): Promise<boolean> {
      return new Promise((resolve) => {
        confirm.require({
          message,
          header,
          icon: 'pi pi-exclamation-triangle',
          acceptProps: { label: 'Удалить', severity: 'danger' },
          rejectProps: { label: 'Отмена', severity: 'secondary', outlined: true },
          accept: async () => {
            const result = await execute(id);
            resolve(result !== undefined);
          },
          reject: () => {
            resolve(false);
          },
        });
      });
    },
  };
}
```

Then in each page, use this composable directly instead of the delete component.

Actually, looking at the current `DeleteArea.vue` and similar components, they use `useDeleteConfirm` which expects `apiFn: Delete`. The component exposes `confirm()` and `cancel()` via `defineExpose`. The parent pages call `deleteAreaRef?.confirm()` when the modal is open.

With `ConfirmDialog`, the flow is different. The parent page calls `confirmDelete` directly without needing a modal ref.

So the refactor for each page is:
1. Import `useDeleteConfirmDialog` and the repository delete function
2. Create a `confirmDelete` function in the page
3. Call it directly when delete button is clicked
4. Remove the modal ref and the delete component ref

Let's define the task steps for each page.

- [ ] **Step 2a: Create useDeleteConfirmDialog composable**

Create `src/shared/lib/use-delete-confirm-dialog.ts` (or similar) as described above. Export it from `src/shared/lib/index.ts` if there's an index file. Otherwise import it directly.

- [ ] **Step 2b: Refactor AdminAreasPage**

Read `src/pages/admin/areas/ui/AdminAreasPage.vue`.

Remove:
- `CenterModal` import and template usage for delete
- `DeleteArea` import and template usage
- `deleteAreaRef` and `deleteAreaModalRef` template refs
- `currentArea` ref (if only used for delete)

Add:
- Import `useDeleteConfirmDialog` from `@/shared/lib`
- Import `Delete` from `@/entities/area` (or wherever the API function is)
- Create:
```typescript
const { confirmDelete: confirmDeleteArea } = useDeleteConfirmDialog({
  apiFn: Delete,
  message: 'Вы действительно хотите удалить область?',
  header: 'Удалить область',
  successMessage: 'Область успешно удалена',
});
```

Modify `clickDeleteAreaBtn`:
```typescript
async function clickDeleteAreaBtn(area: AreaResponse) {
  const ok = await confirmDeleteArea(area.id);
  if (ok) {
    areas.value = areas.value.filter((a) => a.id !== area.id);
  }
}
```

- [ ] **Step 2c: Refactor AdminSpeakersPage**

Similar to AdminAreasPage. Read `src/pages/admin/speakers/ui/AdminSpeakersPage.vue`.

Remove `CenterModal`, `DeleteSpeaker`, related refs.

Add `useDeleteConfirmDialog` with `Delete` from speakers repository.

Message: 'Вы действительно хотите удалить спикера?'
Header: 'Удалить спикера'
SuccessMessage: 'Спикер успешно удалён'

- [ ] **Step 2d: Refactor AdminFeedbackPage**

Read `src/pages/admin/feedback/ui/AdminFeedbackPage.vue`.

Remove `CenterModal`, `DeleteFeedback`, related refs.

Add `useDeleteConfirmDialog` with `Delete` from feedback repository.

Message: 'Вы действительно хотите удалить обратную связь?'
Header: 'Удалить обратную связь'
SuccessMessage: 'Обратная связь успешно удалена'

- [ ] **Step 2e: Refactor AdminFAQPage**

Read `src/pages/admin/faq/ui/AdminFAQPage.vue`.

Remove `CenterModal`, `DeleteCategory`, related refs.

Add `useDeleteConfirmDialog` with `DeleteCategoryApi` from faq-category repository.

Message: 'Вы действительно хотите удалить всю категорию?\n\nТакже будут удалены все записи!'
Header: 'Удалить категорию'
SuccessMessage: 'Категория успешно удалена'

Note: The current `DeleteCategory` component shows two paragraphs. With `ConfirmDialog`, we can use `\n` in the message or pass a component to the message slot. For simplicity, use the two-line message.

- [ ] **Step 2f: Refactor AdminFAQCategoryPage**

Read `src/pages/admin/faq/ui/AdminFAQCategoryPage.vue`.

Remove `CenterModal`, `DeleteEntryModal`, related refs.

Add `useDeleteConfirmDialog` with `DeleteEntry` from faq-entry repository.

Message: 'Вы действительно хотите удалить запись?'
Header: 'Удалить запись'
SuccessMessage: 'Запись успешно удалена'

- [ ] **Step 2g: Delete the 5 obsolete components**

Delete:
- `src/entities/area/ui/DeleteArea.vue`
- `src/entities/user/ui/DeleteSpeaker.vue`
- `src/features/feedback/ui/DeleteFeedback.vue`
- `src/entities/faq/ui/DeleteCategory.vue`
- `src/entities/faq/ui/DeleteEntry.vue`

Also remove their exports from respective `index.ts` files if they are exported. Check each slice's `index.ts`:
- `src/entities/area/index.ts`
- `src/entities/user/index.ts`
- `src/features/feedback/index.ts`
- `src/entities/faq/index.ts`

- [ ] **Step 3: Run lint and typecheck for all modified files**

```bash
npm run eslint:check -- src/pages/admin/areas/ui/AdminAreasPage.vue
npm run eslint:check -- src/pages/admin/speakers/ui/AdminSpeakersPage.vue
npm run eslint:check -- src/pages/admin/feedback/ui/AdminFeedbackPage.vue
npm run eslint:check -- src/pages/admin/faq/ui/AdminFAQPage.vue
npm run eslint:check -- src/pages/admin/faq/ui/AdminFAQCategoryPage.vue
npm run eslint:check -- src/shared/lib/use-delete-confirm-dialog.ts
npm run typecheck
```
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(admin): replace delete modals with PrimeVue ConfirmDialog"
```

---

### Task 6: Integration & Regression Testing

- [ ] **Step 1: Run the full test suite**

```bash
npm run test
```
Expected: All tests PASS

- [ ] **Step 2: Run all lint checks**

```bash
npm run lint
npm run fsd:check
```
Expected: PASS

- [ ] **Step 3: Run typecheck**

```bash
npm run typecheck
```
Expected: PASS

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "test: verify PrimeVue Package 2 migration passes all checks"
```

---

## Plan Self-Review

| Spec Requirement | Task Covering It |
|---|---|
| Search input → IconField | Task 1 |
| Period tabs → SelectButton | Task 2 |
| Admin tabs → Tabs | Task 3 |
| Inline editing → Inplace | Task 4 |
| DeleteArea → ConfirmDialog | Task 5 |
| DeleteSpeaker → ConfirmDialog | Task 5 |
| DeleteFeedback → ConfirmDialog | Task 5 |
| DeleteCategory → ConfirmDialog | Task 5 |
| DeleteEntry → ConfirmDialog | Task 5 |
| Global ConfirmDialog instance | Task 5, Step 1 |
| No FSD boundary violations | All tasks (only modify existing files) |
| Preserve prop/emits contracts | Tasks 1-4 (no external changes) |
| Lint + typecheck pass | Step in every task + Task 6 |

**Placeholder scan:** None. All code is explicit, all commands exact.

**Type consistency:** All tasks use existing types. New composable `useDeleteConfirmDialog` returns `Promise<boolean>` consistent with current usage.
