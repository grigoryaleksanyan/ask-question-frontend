# Delete Confirm Unification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Unify entity deletion across the project using `CenterModal` and a shared `useDeleteConfirm` composable.

**Architecture:** Each of the 6 existing delete points keeps its own Delete component in its FSD layer, but all use a shared `useDeleteConfirm` composable. FAQ deletions migrate from `SlideOver` to `CenterModal`. All Delete components expose a unified contract: `confirm()` + `cancel()` with `success`/`cancel` emits.

**Tech Stack:** Vue 3.5, PrimeVue 4, PrimeVue Dialog (CenterModal), Composition API, Vitest + jsdom, Vue Test Utils (for component tests)

---

## File Structure

### Files to Create
- `src/shared/lib/use-delete-confirm/index.ts` — shared composable
- `tests/shared/lib/use-delete-confirm/index.test.ts` — composable tests

### Files to Modify
- `src/entities/user/ui/DeleteSpeaker.vue` — add cancel(), use composable
- `src/entities/area/ui/DeleteArea.vue` — use composable
- `src/entities/faq/ui/DeleteCategory.vue` — use composable, fix emit type
- `src/entities/faq/ui/DeleteEntry.vue` — use composable
- `src/features/feedback/ui/DeleteFeedbackModal.vue` → rename to `DeleteFeedback.vue` — use composable
- `src/pages/admin/faq/ui/AdminFAQPage.vue` — SlideOver → CenterModal
- `src/pages/admin/faq/ui/AdminFAQCategoryPage.vue` — SlideOver → CenterModal
- `src/features/feedback/index.ts` — update public API export name
- `src/pages/admin/feedback/ui/AdminFeedbackPage.vue` — update import name

### Files to Delete
- `src/features/feedback/ui/DeleteFeedbackModal.vue` (after rename)

---

### Task 1: Create `useDeleteConfirm` composable

**Files:**
- Create: `src/shared/lib/use-delete-confirm/index.ts`
- Test: `tests/shared/lib/use-delete-confirm/index.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useDeleteConfirm } from '@/shared/lib/use-delete-confirm';

// Mock useApiCall
vi.mock('@/shared/lib/use-api-call', () => ({
  useApiCall: vi.fn(),
}));

import { useApiCall } from '@/shared/lib/use-api-call';

describe('useDeleteConfirm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns confirm function that calls apiFn and returns true on success', async () => {
    const mockExecute = vi.fn().mockResolvedValue('deleted');
    (useApiCall as unknown as vi.Mock).mockReturnValue({
      execute: mockExecute,
      isLoading: { value: false },
      error: { value: null },
    });

    const apiFn = vi.fn().mockResolvedValue('result');
    const { confirm } = useDeleteConfirm({
      apiFn,
      successMessage: 'Deleted',
    });

    const result = await confirm('123');

    expect(mockExecute).toHaveBeenCalledWith('123');
    expect(result).toBe(true);
  });

  it('returns false when apiFn fails', async () => {
    const mockExecute = vi.fn().mockResolvedValue(undefined);
    (useApiCall as unknown as vi.Mock).mockReturnValue({
      execute: mockExecute,
      isLoading: { value: false },
      error: { value: null },
    });

    const apiFn = vi.fn();
    const { confirm } = useDeleteConfirm({
      apiFn,
      successMessage: 'Deleted',
    });

    const result = await confirm('123');

    expect(result).toBe(false);
  });

  it('uses showPreloader=false by default', () => {
    const mockExecute = vi.fn();
    (useApiCall as unknown as vi.Mock).mockReturnValue({
      execute: mockExecute,
      isLoading: { value: false },
      error: { value: null },
    });

    const apiFn = vi.fn();
    useDeleteConfirm({
      apiFn,
      successMessage: 'Deleted',
    });

    expect(useApiCall).toHaveBeenCalledWith(
      apiFn,
      expect.objectContaining({
        showPreloader: false,
      }),
    );
  });

  it('accepts custom showPreloader value', () => {
    const mockExecute = vi.fn();
    (useApiCall as unknown as vi.Mock).mockReturnValue({
      execute: mockExecute,
      isLoading: { value: false },
      error: { value: null },
    });

    const apiFn = vi.fn();
    useDeleteConfirm({
      apiFn,
      successMessage: 'Deleted',
      showPreloader: true,
    });

    expect(useApiCall).toHaveBeenCalledWith(
      apiFn,
      expect.objectContaining({
        showPreloader: true,
      }),
    );
  });

  it('returns isLoading and error refs', () => {
    const mockExecute = vi.fn();
    const mockIsLoading = { value: false };
    const mockError = { value: null };
    (useApiCall as unknown as vi.Mock).mockReturnValue({
      execute: mockExecute,
      isLoading: mockIsLoading,
      error: mockError,
    });

    const apiFn = vi.fn();
    const { isLoading, error } = useDeleteConfirm({
      apiFn,
      successMessage: 'Deleted',
    });

    expect(isLoading).toBe(mockIsLoading);
    expect(error).toBe(mockError);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd D:/Development/my_projects/ask-question/ask-question-frontend && npm run test -- --run tests/shared/lib/use-delete-confirm/index.test.ts`
Expected: FAIL with "Cannot find module '@/shared/lib/use-delete-confirm'"

- [ ] **Step 3: Write minimal implementation**

```typescript
import { type Ref } from 'vue';
import { useApiCall, type UseApiCallReturn } from '../use-api-call';

interface UseDeleteConfirmOptions<T = unknown> {
  apiFn: (id: string) => Promise<T>;
  successMessage: string;
  showPreloader?: boolean;
}

interface UseDeleteConfirmReturn {
  confirm: (id: string) => Promise<boolean>;
  isLoading: Ref<boolean>;
  error: Ref<Error | null>;
}

export function useDeleteConfirm<T = unknown>({
  apiFn,
  successMessage,
  showPreloader = false,
}: UseDeleteConfirmOptions<T>): UseDeleteConfirmReturn {
  const { execute, isLoading, error }: UseApiCallReturn<T, [string]> = useApiCall(apiFn, {
    successMessage,
    showPreloader,
  });

  async function confirm(id: string): Promise<boolean> {
    const result = await execute(id);
    return result !== undefined;
  }

  return { confirm, isLoading, error };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd D:/Development/my_projects/ask-question/ask-question-frontend && npm run test -- --run tests/shared/lib/use-delete-confirm/index.test.ts`
Expected: PASS (all 5 tests)

- [ ] **Step 5: Commit**

```bash
cd D:/Development/my_projects/ask-question/ask-question-frontend && git add src/shared/lib/use-delete-confirm/index.ts tests/shared/lib/use-delete-confirm/index.test.ts && git commit -m "feat(shared): add useDeleteConfirm composable for unified deletion"
```

---

### Task 2: Update DeleteSpeaker to use useDeleteConfirm

**Files:**
- Modify: `src/entities/user/ui/DeleteSpeaker.vue`

- [ ] **Step 1: Update script section**

Replace the script with:

```vue
<script setup lang="ts">
import { useDeleteConfirm } from '@/shared/lib';
import { Delete } from '../api/speakers-repository';

defineOptions({ name: 'DeleteSpeaker' });

const { id } = defineProps<{ id: string }>();

const emit = defineEmits<{
  success: [id: string];
  cancel: [];
}>();

const { confirm: doConfirm } = useDeleteConfirm({
  apiFn: Delete,
  successMessage: 'Спикер успешно удалён',
  showPreloader: false,
});

async function confirm() {
  const ok = await doConfirm(id);
  if (ok) {
    emit('success', id);
  }
}

function cancel() {
  emit('cancel');
}

defineExpose({ confirm, cancel });
</script>
```

Note: Template and style sections remain unchanged.

- [ ] **Step 2: Verify the component works**

Run: `cd D:/Development/my_projects/ask-question/ask-question-frontend && npm run typecheck`
Expected: No type errors

- [ ] **Step 3: Commit**

```bash
cd D:/Development/my_projects/ask-question/ask-question-frontend && git add src/entities/user/ui/DeleteSpeaker.vue && git commit -m "refactor(user): unify DeleteSpeaker with useDeleteConfirm"
```

---

### Task 3: Update DeleteArea to use useDeleteConfirm

**Files:**
- Modify: `src/entities/area/ui/DeleteArea.vue`

- [ ] **Step 1: Update script section**

Replace the script with:

```vue
<script setup lang="ts">
import { useDeleteConfirm } from '@/shared/lib';
import { Delete } from '../api/areas-repository';

defineOptions({ name: 'DeleteArea' });

const { id } = defineProps<{ id: string }>();

const emit = defineEmits<{
  success: [id: string];
  cancel: [];
}>();

const { confirm: doConfirm } = useDeleteConfirm({
  apiFn: Delete,
  successMessage: 'Область успешно удалена',
  showPreloader: false,
});

async function confirm() {
  const ok = await doConfirm(id);
  if (ok) {
    emit('success', id);
  }
}

function cancel() {
  emit('cancel');
}

defineExpose({ confirm, cancel });
</script>
```

Note: Template remains unchanged.

- [ ] **Step 2: Verify the component works**

Run: `cd D:/Development/my_projects/ask-question/ask-question-frontend && npm run typecheck`
Expected: No type errors

- [ ] **Step 3: Commit**

```bash
cd D:/Development/my_projects/ask-question/ask-question-frontend && git add src/entities/area/ui/DeleteArea.vue && git commit -m "refactor(area): unify DeleteArea with useDeleteConfirm"
```

---

### Task 4: Update DeleteEntry to use useDeleteConfirm

**Files:**
- Modify: `src/entities/faq/ui/DeleteEntry.vue`

- [ ] **Step 1: Update script section**

Replace the script with:

```vue
<script setup lang="ts">
import { useDeleteConfirm } from '@/shared/lib';
import { Delete as DeleteEntry } from '../api/faq-entry-repository';

defineOptions({ name: 'DeleteEntry' });

const { id } = defineProps<{ id: string }>();

const emit = defineEmits<{
  success: [id: string];
  cancel: [];
}>();

const { confirm: doConfirm } = useDeleteConfirm({
  apiFn: DeleteEntry,
  successMessage: 'Запись успешно удалена',
  showPreloader: false,
});

async function confirm() {
  const ok = await doConfirm(id);
  if (ok) {
    emit('success', id);
  }
}

function cancel() {
  emit('cancel');
}

defineExpose({ confirm, cancel });
</script>
```

Note: Template and style remain unchanged.

- [ ] **Step 2: Verify the component works**

Run: `cd D:/Development/my_projects/ask-question/ask-question-frontend && npm run typecheck`
Expected: No type errors

- [ ] **Step 3: Commit**

```bash
cd D:/Development/my_projects/ask-question/ask-question-frontend && git add src/entities/faq/ui/DeleteEntry.vue && git commit -m "refactor(faq): unify DeleteEntry with useDeleteConfirm"
```

---

### Task 5: Update DeleteCategory to use useDeleteConfirm

**Files:**
- Modify: `src/entities/faq/ui/DeleteCategory.vue`

- [ ] **Step 1: Update script section**

Replace the script with:

```vue
<script setup lang="ts">
import { useDeleteConfirm } from '@/shared/lib';
import { Delete as DeleteCategoryApi } from '../api/faq-category-repository';

defineOptions({ name: 'DeleteCategory' });

const { id } = defineProps<{ id: string }>();

const emit = defineEmits<{
  success: [id: string];
  cancel: [];
}>();

const { confirm: doConfirm } = useDeleteConfirm({
  apiFn: DeleteCategoryApi,
  successMessage: 'Категория успешно удалена',
  showPreloader: false,
});

async function confirm() {
  const ok = await doConfirm(id);
  if (ok) {
    emit('success', id);
  }
}

function cancel() {
  emit('cancel');
}

defineExpose({ confirm, cancel });
</script>
```

Note: Template and style remain unchanged. The emit `success: []` is changed to `success: [id: string]`.

- [ ] **Step 2: Update AdminFAQPage to pass id in success handler**

In `src/pages/admin/faq/ui/AdminFAQPage.vue`, update the `@success` handler for DeleteCategory to accept the id parameter.

Find the handler and update it to:
```vue
@success="onDeleteCategorySuccess"
```

```typescript
function onDeleteCategorySuccess(id: string) {
  categories.value = categories.value.filter((category) => category.id !== id);
  isDeleteCategoryOpen = false;
}
```

- [ ] **Step 3: Verify the component works**

Run: `cd D:/Development/my_projects/ask-question/ask-question-frontend && npm run typecheck`
Expected: No type errors

- [ ] **Step 4: Commit**

```bash
cd D:/Development/my_projects/ask-question/ask-question-frontend && git add src/entities/faq/ui/DeleteCategory.vue src/pages/admin/faq/ui/AdminFAQPage.vue && git commit -m "refactor(faq): unify DeleteCategory with useDeleteConfirm"
```

---

### Task 6: Rename DeleteFeedbackModal to DeleteFeedback and update

**Files:**
- Create: `src/features/feedback/ui/DeleteFeedback.vue` (content from DeleteFeedbackModal.vue with updates)
- Delete: `src/features/feedback/ui/DeleteFeedbackModal.vue`
- Modify: `src/features/feedback/index.ts` — update export
- Modify: `src/pages/admin/feedback/ui/AdminFeedbackPage.vue` — update import

- [ ] **Step 1: Create DeleteFeedback.vue with updated script**

Create `src/features/feedback/ui/DeleteFeedback.vue`:

```vue
<template>
  <p class="text-body-large">Вы действительно хотите удалить обратную связь?</p>
</template>

<script setup lang="ts">
import { useDeleteConfirm } from '@/shared/lib';
import { Delete as DeleteFeedbackApi } from '../api/feedback-repository';

defineOptions({ name: 'DeleteFeedback' });

const { id } = defineProps<{ id: string }>();

const emit = defineEmits<{
  success: [id: string];
  cancel: [];
}>();

const { confirm: doConfirm } = useDeleteConfirm({
  apiFn: DeleteFeedbackApi,
  successMessage: 'Обратная связь успешно удалена',
  showPreloader: false,
});

async function confirm() {
  const ok = await doConfirm(id);
  if (ok) {
    emit('success', id);
  }
}

function cancel() {
  emit('cancel');
}

defineExpose({ confirm, cancel });
</script>
```

- [ ] **Step 2: Delete DeleteFeedbackModal.vue**

```bash
cd D:/Development/my_projects/ask-question/ask-question-frontend && rm src/features/feedback/ui/DeleteFeedbackModal.vue
```

- [ ] **Step 3: Update public API export**

In `src/features/feedback/index.ts`, change:
```typescript
export { default as DeleteFeedbackModal } from './ui/DeleteFeedbackModal.vue';
```
to:
```typescript
export { default as DeleteFeedback } from './ui/DeleteFeedback.vue';
```

- [ ] **Step 4: Update AdminFeedbackPage import**

In `src/pages/admin/feedback/ui/AdminFeedbackPage.vue`, change:
```typescript
import DeleteFeedbackModal from '@/features/feedback/ui/DeleteFeedbackModal.vue';
```
to:
```typescript
import DeleteFeedback from '@/features/feedback/ui/DeleteFeedback.vue';
```

And update the template usage from `<DeleteFeedbackModal>` to `<DeleteFeedback>`, and the ref from `deleteFeedbackModalRef` to `deleteFeedbackRef`.

- [ ] **Step 5: Verify the component works**

Run: `cd D:/Development/my_projects/ask-question/ask-question-frontend && npm run typecheck`
Expected: No type errors

- [ ] **Step 6: Commit**

```bash
cd D:/Development/my_projects/ask-question/ask-question-frontend && git add -A && git commit -m "refactor(feedback): rename DeleteFeedbackModal to DeleteFeedback and unify with useDeleteConfirm"
```

---

### Task 7: Migrate AdminFAQPage from SlideOver to CenterModal

**Files:**
- Modify: `src/pages/admin/faq/ui/AdminFAQPage.vue`

- [ ] **Step 1: Replace SlideOver with CenterModal for DeleteCategory**

Find the SlideOver usage for DeleteCategory and replace it with CenterModal:

Before:
```vue
<SlideOver ref="deleteCategoryRef" title="Удалить категорию" @close="isDeleteCategoryOpen = false">
  <DeleteCategory :id="categoryToDeleteId" @success="..." @cancel="isDeleteCategoryOpen = false" />
  <template #confirm>
    <Button label="Удалить" severity="danger" @click="..." />
  </template>
  <template #cancel>
    <Button label="Отмена" severity="secondary" @click="..." />
  </template>
</SlideOver>
```

After:
```vue
<CenterModal v-model:isOpen="isDeleteCategoryOpen" title="Удалить категорию" @close="isDeleteCategoryOpen = false">
  <DeleteCategory :id="categoryToDeleteId" ref="deleteCategoryRef" @success="onDeleteCategorySuccess" @cancel="isDeleteCategoryOpen = false" />
  <template #footer>
    <Button label="Удалить" severity="danger" @click="deleteCategoryRef?.confirm()" />
    <Button label="Отмена" severity="secondary" @click="deleteCategoryRef?.cancel()" />
  </template>
</CenterModal>
```

Add the ref:
```typescript
const deleteCategoryRef = useTemplateRef('deleteCategoryRef');
```

Update the success handler to accept id:
```typescript
function onDeleteCategorySuccess(id: string) {
  categories.value = categories.value.filter((cat) => cat.id !== id);
  isDeleteCategoryOpen = false;
}
```

- [ ] **Step 2: Verify the page works**

Run: `cd D:/Development/my_projects/ask-question/ask-question-frontend && npm run typecheck`
Expected: No type errors

- [ ] **Step 3: Commit**

```bash
cd D:/Development/my_projects/ask-question/ask-question-frontend && git add src/pages/admin/faq/ui/AdminFAQPage.vue && git commit -m "refactor(faq): migrate AdminFAQPage deletion from SlideOver to CenterModal"
```

---

### Task 8: Migrate AdminFAQCategoryPage from SlideOver to CenterModal

**Files:**
- Modify: `src/pages/admin/faq/ui/AdminFAQCategoryPage.vue`

- [ ] **Step 1: Replace SlideOver for DeleteCategory with CenterModal**

Find the SlideOver for DeleteCategory and replace:

Before:
```vue
<SlideOver ref="deleteCategoryRef" title="Удалить категорию" @close="...">
  <DeleteCategory :id="category?.id || ''" @success="..." @cancel="..." />
  ...
</SlideOver>
```

After:
```vue
<CenterModal v-model:isOpen="isDeleteCategoryOpen" title="Удалить категорию" @close="isDeleteCategoryOpen = false">
  <DeleteCategory :id="category?.id || ''" ref="deleteCategoryRef" @success="onDeleteCategorySuccess" @cancel="isDeleteCategoryOpen = false" />
  <template #footer>
    <Button label="Удалить" severity="danger" @click="deleteCategoryRef?.confirm()" />
    <Button label="Отмена" severity="secondary" @click="deleteCategoryRef?.cancel()" />
  </template>
</CenterModal>
```

Update the success handler:
```typescript
function onDeleteCategorySuccess() {
  router.push({ name: 'admin-faq' });
}
```

- [ ] **Step 2: Replace SlideOver for DeleteEntry with CenterModal**

Similarly, replace the SlideOver for DeleteEntry with CenterModal.

Add state variable:
```typescript
const isDeleteEntryOpen = ref(false);
const entryToDeleteId = ref('');
```

Add CenterModal:
```vue
<CenterModal v-model:isOpen="isDeleteEntryOpen" title="Удалить запись" @close="isDeleteEntryOpen = false">
  <DeleteEntry :id="entryToDeleteId" ref="deleteEntryRef" @success="onDeleteEntrySuccess" @cancel="isDeleteEntryOpen = false" />
  <template #footer>
    <Button label="Удалить" severity="danger" @click="deleteEntryRef?.confirm()" />
    <Button label="Отмена" severity="secondary" @click="deleteEntryRef?.cancel()" />
  </template>
</CenterModal>
```

Update the DeleteEntry button to open the modal:
```typescript
function openDeleteEntryModal(id: string) {
  entryToDeleteId.value = id;
  isDeleteEntryOpen.value = true;
}
```

Update success handler:
```typescript
function onDeleteEntrySuccess(id: string) {
  entries.value = entries.value.filter((entry) => entry.id !== id);
  isDeleteEntryOpen.value = false;
}
```

- [ ] **Step 3: Verify the page works**

Run: `cd D:/Development/my_projects/ask-question/ask-question-frontend && npm run typecheck`
Expected: No type errors

- [ ] **Step 4: Commit**

```bash
cd D:/Development/my_projects/ask-question/ask-question-frontend && git add src/pages/admin/faq/ui/AdminFAQCategoryPage.vue && git commit -m "refactor(faq): migrate AdminFAQCategoryPage deletions from SlideOver to CenterModal"
```

---

### Task 9: Run linting and typecheck

**Files:**
- All modified files

- [ ] **Step 1: Run linting**

```bash
cd D:/Development/my_projects/ask-question/ask-question-frontend && npm run lint
```
Expected: No errors

- [ ] **Step 2: Run typecheck**

```bash
cd D:/Development/my_projects/ask-question/ask-question-frontend && npm run typecheck
```
Expected: No type errors

- [ ] **Step 3: Run FSD check**

```bash
cd D:/Development/my_projects/ask-question/ask-question-frontend && npm run fsd:check
```
Expected: No FSD violations

- [ ] **Step 4: Run tests**

```bash
cd D:/Development/my_projects/ask-question/ask-question-frontend && npm run test
```
Expected: All tests pass

- [ ] **Step 5: Commit any fixes if needed**

```bash
cd D:/Development/my_projects/ask-question/ask-question-frontend && git add -A && git commit -m "chore: fix linting and typecheck issues after deletion unification"
```

---

## Plan Self-Review

**1. Spec coverage:**
- [x] Composable `useDeleteConfirm` created — Task 1
- [x] All 5 Delete components updated — Tasks 2-6
- [x] FAQ migrations SlideOver → CenterModal — Tasks 7-8
- [x] Unified contract (confirm + cancel + success/cancel emits) — All component tasks
- [x] DeleteFeedbackModal renamed to DeleteFeedback — Task 6

**2. Placeholder scan:**
- No "TBD", "TODO", or incomplete steps found
- All code blocks contain complete, copy-pasteable code
- Test expectations are explicit

**3. Type consistency:**
- All Delete components use `success: [id: string]` emit
- All use `useDeleteConfirm` with same pattern
- `useDeleteConfirm` returns `confirm(id)` with `id: string` parameter

**4. FSD compliance:**
- Composable in `shared/lib/` — correct
- Delete components stay in their respective layers (`entities/`, `features/`)
- Pages modified in `pages/`
- No cross-layer import violations

---

Plan complete and saved to `docs/superpowers/plans/2026-05-30-delete-confirm-unification-plan.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
