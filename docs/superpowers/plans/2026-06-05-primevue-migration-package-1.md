# PrimeVue Migration — Package 1 (High Impact) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the four highest-impact manual components with PrimeVue equivalents: SpeakerAvatar → Avatar, StatusDot → Tag, AdminQuestionsPage table → DataTable, and manual pagination → Paginator.

**Architecture:** Keep all changes within existing FSD slices. No cross-layer imports. Maintain existing prop/emits contracts so parent components require zero changes. DataTable will use PrimeVue's built-in selection and row-click APIs; Paginator will use `first` index binding instead of page number.

**Tech Stack:** Vue 3.5, PrimeVue 4.5.5, TypeScript, SCSS, FSD v2.1, Vue Router 5, Pinia 3.

---

## File Structure

| File | Action | Responsibility |
|---|---|---|
| `src/entities/user/ui/SpeakerAvatar.vue` | Modify | Replace custom initials circle with `Avatar` |
| `src/shared/ui/status-dot/StatusDot.vue` | Modify | Replace custom dot+label with `Tag` |
| `src/pages/admin/questions/ui/AdminQuestionsPage.vue` | Modify | Replace CSS-grid table with `DataTable` + `Paginator` |
| `src/entities/question/ui/QuestionsView.vue` | Modify | Replace manual pagination buttons with `Paginator` |
| `tests/` | Verify | Run existing tests to ensure no regressions |

---

### Task 1: SpeakerAvatar → Avatar

**Files:**
- Modify: `src/entities/user/ui/SpeakerAvatar.vue`

- [ ] **Step 1: Read the current file**

Read: `src/entities/user/ui/SpeakerAvatar.vue`
Expected content: custom `div` with initials and manual circle styling.

- [ ] **Step 2: Replace template and script with Avatar component**

```vue
<template>
  <Avatar
    :label="initials"
    shape="circle"
    class="speaker-avatar" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Avatar from 'primevue/avatar';

defineOptions({ name: 'SpeakerAvatar' });

const { firstName, lastName } = defineProps<{
  firstName: string;
  lastName: string;
}>();

const initials = computed(() =>
  (firstName.charAt(0) + lastName.charAt(0)).toUpperCase(),
);
</script>

<style lang="scss" scoped>
.speaker-avatar {
  background: variables.$surface-dark-border;
  color: variables.$text-muted;
  font-size: 13px;
  font-weight: 500;
}
</style>
```

- [ ] **Step 3: Verify no new imports are needed beyond PrimeVue**

Check: `Avatar` is imported from `primevue/avatar`. No changes to `index.ts` or consumers.

- [ ] **Step 4: Run lint and typecheck**

```bash
npm run eslint:check -- src/entities/user/ui/SpeakerAvatar.vue
npm run typecheck
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/entities/user/ui/SpeakerAvatar.vue
git commit -m "feat(user): replace manual SpeakerAvatar with PrimeVue Avatar"
```

---

### Task 2: StatusDot → Tag

**Files:**
- Modify: `src/shared/ui/status-dot/StatusDot.vue`

- [ ] **Step 1: Read the current file**

Read: `src/shared/ui/status-dot/StatusDot.vue`
Expected: `span` with inline colored dot and optional label.

- [ ] **Step 2: Replace with Tag component**

```vue
<template>
  <Tag
    :value="label"
    :pt="{ root: { style: { backgroundColor: color, color: 'white' } } }"
    class="status-dot" />
</template>

<script setup lang="ts">
import Tag from 'primevue/tag';

defineOptions({ name: 'StatusDot' });

const { color, label = '' } = defineProps<{
  color: string;
  label?: string;
}>();
</script>

<style lang="scss" scoped>
.status-dot {
  font-size: 14px;
  font-weight: 500;
}
</style>
```

- [ ] **Step 3: Verify consumers**

Check: `StatusDot` is consumed in `QuestionCard.vue`, `QuestionIdView.vue`, and `QuestionsView.vue` (via import from `@/shared/ui/status-dot`). Confirm they still pass `color` and `label`.

- [ ] **Step 4: Run lint and typecheck**

```bash
npm run eslint:check -- src/shared/ui/status-dot/StatusDot.vue
npm run typecheck
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/shared/ui/status-dot/StatusDot.vue
git commit -m "feat(shared): replace manual StatusDot with PrimeVue Tag"
```

---

### Task 3: AdminQuestionsPage table → DataTable + Paginator

**Files:**
- Modify: `src/pages/admin/questions/ui/AdminQuestionsPage.vue`

- [ ] **Step 1: Read the current file**

Read: `src/pages/admin/questions/ui/AdminQuestionsPage.vue`
Note: Current file is ~448 lines with manual CSS-grid table, custom pagination, and manual checkbox logic.

- [ ] **Step 2: Add imports for DataTable, Column, and Paginator**

At the top of `<script setup>`, add:

```typescript
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Paginator from 'primevue/paginator';
```

Remove the import for `Checkbox` (DataTable handles selection internally).

- [ ] **Step 3: Change selection state from `Set<string>` to `QuestionResponse[]`**

In `<script setup>`, replace:

```typescript
const selectedIds = ref<Set<string>>(new Set());
```

with:

```typescript
const selectedQuestions = ref<QuestionResponse[]>([]);
```

Add computed `selectedIds` for backward compatibility with `QuestionBulkActions`:

```typescript
const selectedIds = computed(() => new Set(selectedQuestions.value.map((q) => q.id)));
```

- [ ] **Step 4: Remove manual `allSelected`, `toggleSelect`, `toggleAll`, `clearSelection`**

Delete these functions and computed properties. DataTable will manage selection via `v-model:selection`.

- [ ] **Step 5: Replace the entire `<template>` table section with DataTable**

Replace the `<div class="admin-questions-page__table">` block and the `<div class="admin-questions-page__pagination">` block with:

```vue
<template>
  <div class="admin-questions-page">
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

    <DataTable
      v-model:selection="selectedQuestions"
      :value="questions"
      data-key="id"
      selection-mode="multiple"
      class="admin-questions-page__table"
      @row-click="navigateToDetail">
      <Column selection-mode="multiple" header-style="width: 3rem" />
      <Column field="text" header="Вопрос">
        <template #body="{ data }">
          <router-link
            :to="{
              name: ROUTES.adminQuestionDetail,
              params: { id: data.id },
            }"
            class="admin-questions-page__question-link">
            {{ data.text }}
          </router-link>
        </template>
      </Column>
      <Column field="areaTitle" header="Область">
        <template #body="{ data }">
          {{ data.areaTitle ?? '—' }}
        </template>
      </Column>
      <Column field="speakerName" header="Спикер">
        <template #body="{ data }">
          {{ data.speakerName || '—' }}
        </template>
      </Column>
      <Column header="Статус">
        <template #body="{ data }">
          <QuestionStatusDropdown
            :status="data.status"
            :question-id="data.id"
            @status-changed="onStatusChanged"
            @error="onActionError" />
        </template>
      </Column>
      <Column header="💬">
        <template #body="{ data }">
          <QuestionCommentButton
            :question-id="data.id"
            :comment="data.comment"
            @comment-changed="onCommentChanged"
            @error="onActionError" />
        </template>
      </Column>
      <Column field="likes" header="▲" />
      <Column header="Дата">
        <template #body="{ data }">
          {{ relativeTime(data.created) }}
        </template>
      </Column>
    </DataTable>

    <Paginator
      v-model:first="firstRow"
      :rows="pageSize"
      :total-records="totalCount"
      template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
      class="admin-questions-page__pagination" />

    <QuestionBulkActions
      :selected-ids="selectedIds"
      :questions="questions"
      @action-completed="fetchData"
      @clear-selection="clearSelection" />
  </div>
</template>
```

- [ ] **Step 6: Add `firstRow` ref and sync it with `currentPage`**

In `<script setup>`, add:

```typescript
const firstRow = ref(0);
```

Add a watcher:

```typescript
watch(currentPage, (newPage) => {
  firstRow.value = (newPage - 1) * pageSize;
});

watch(firstRow, (newFirst) => {
  currentPage.value = Math.floor(newFirst / pageSize) + 1;
});
```

- [ ] **Step 7: Add `clearSelection` function back (emitted by QuestionBulkActions)**

```typescript
function clearSelection() {
  selectedQuestions.value = [];
}
```

- [ ] **Step 8: Remove manual table and pagination CSS from `<style>`**

Delete the `.admin-questions-page__table`, `.admin-questions-page__header`, `.admin-questions-page__row`, and `.admin-questions-page__pagination` blocks. Keep only the tabs styles and any DataTable-specific overrides if needed.

- [ ] **Step 9: Verify QuestionBulkActions contract**

`QuestionBulkActions` expects `selectedIds: Set<string>` and `questions: QuestionResponse[]`. Our `selectedIds` computed property returns a `Set<string>`, so the contract is preserved. No changes needed in `QuestionBulkActions.vue`.

- [ ] **Step 10: Run lint and typecheck**

```bash
npm run eslint:check -- src/pages/admin/questions/ui/AdminQuestionsPage.vue
npm run typecheck
```

Expected: PASS

- [ ] **Step 11: Commit**

```bash
git add src/pages/admin/questions/ui/AdminQuestionsPage.vue
git commit -m "feat(admin): replace manual table with PrimeVue DataTable and Paginator"
```

---

### Task 4: QuestionsView pagination → Paginator

**Files:**
- Modify: `src/entities/question/ui/QuestionsView.vue`

- [ ] **Step 1: Read the current file**

Read: `src/entities/question/ui/QuestionsView.vue`
Note: Lines 258–293 contain the manual pagination block with `<button>` elements and `currentPage` ref.

- [ ] **Step 2: Add Paginator import**

At top of `<script setup>`:

```typescript
import Paginator from 'primevue/paginator';
```

- [ ] **Step 3: Replace manual pagination block**

Find and replace this block:

```vue
<div class="questions-view__pagination">
  <button
    class="questions-view__page-btn"
    :disabled="currentPage <= 1"
    @click="currentPage--">
    ‹
  </button>
  <span class="questions-view__page-info">
    {{ currentPage }} / {{ totalPages }}
  </span>
  <button
    class="questions-view__page-btn"
    :disabled="currentPage >= totalPages"
    @click="currentPage++">
    ›
  </button>
</div>
```

with:

```vue
<Paginator
  v-model:first="firstRow"
  :rows="pageSize"
  :total-records="totalCount"
  template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
  class="questions-view__pagination" />
```

- [ ] **Step 4: Add `firstRow` ref and sync with `currentPage`**

Add:

```typescript
const firstRow = ref(0);
```

Add watchers:

```typescript
watch(currentPage, (newPage) => {
  firstRow.value = (newPage - 1) * pageSize;
});

watch(firstRow, (newFirst) => {
  currentPage.value = Math.floor(newFirst / pageSize) + 1;
});
```

- [ ] **Step 5: Remove manual pagination CSS**

In `<style lang="scss" scoped>`, delete `.questions-view__pagination`, `.questions-view__page-btn`, and `.questions-view__page-info` blocks. Keep `.questions-view` and other unrelated styles.

- [ ] **Step 6: Run lint and typecheck**

```bash
npm run eslint:check -- src/entities/question/ui/QuestionsView.vue
npm run typecheck
```

Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/entities/question/ui/QuestionsView.vue
git commit -m "feat(questions): replace manual pagination with PrimeVue Paginator"
```

---

### Task 5: Integration & Regression Testing

- [ ] **Step 1: Run the full test suite**

```bash
npm run test
```

Expected: All tests PASS (or same results as before migration)

- [ ] **Step 2: Run all lint checks**

```bash
npm run lint
npm run fsd:check
```

Expected: PASS

- [ ] **Step 3: Run dev server and manual smoke test**

```bash
npm run dev
```

Verify:
1. Speaker avatars still show initials correctly in any view that uses them (e.g., SpeakerCard, admin lists)
2. Status dots still show correct colors and labels (e.g., in QuestionsView, QuestionCard, QuestionIdView)
3. Admin questions table loads, shows data, checkboxes work, row click navigates, status dropdown and comment button function, bulk actions appear when rows are selected.
4. QuestionsView pagination works (next/prev/page links), page count correct.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "test: verify PrimeVue Package 1 migration passes all checks"
```

---

## Plan Self-Review

| Spec Requirement | Task Covering It |
|---|---|
| SpeakerAvatar → Avatar | Task 1 |
| StatusDot → Tag | Task 2 |
| AdminQuestionsPage table → DataTable | Task 3 |
| QuestionsView pagination → Paginator | Task 4 |
| AdminQuestionsPage pagination → Paginator (inside DataTable) | Task 3 |
| No FSD boundary violations | All tasks (only modify existing files) |
| Preserve prop/emits contracts | Task 3 (selectedIds computed), Task 4 |
| Lint + typecheck pass | Step in every task + Task 5 |
| RichEditor excluded | Not in this plan |

**Placeholder scan:** None. All code is explicit, all commands exact.

**Type consistency:** `selectedIds` remains `Set<string>` for `QuestionBulkActions`. `selectedQuestions` is `QuestionResponse[]`. `firstRow` is `number`. Consistent across tasks.
