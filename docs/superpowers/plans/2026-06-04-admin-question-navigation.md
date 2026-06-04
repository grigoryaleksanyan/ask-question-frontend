# Admin Question Row Navigation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make clicking a question row in admin list navigate to the detail page, while keeping checkbox-only selection for bulk actions.

**Architecture:** Replace row `@click` handler from `toggleSelect` to `router.push`. Add keyboard navigation (`@keydown.enter`). Add `role="link"` and `tabindex` for accessibility. Checkbox already has `@click.stop` — no change needed there.

**Tech Stack:** Vue 3, Vue Router, TypeScript

---

### Task 1: Replace row click handler with navigation

**Files:**
- Modify: `src/pages/admin/questions/ui/AdminQuestionsPage.vue:55-62` (template row)
- Modify: `src/pages/admin/questions/ui/AdminQuestionsPage.vue:137-152` (script imports)

- [ ] **Step 1: Add router and ROUTES imports**

In `<script setup>`, add after line 152 (`import { useApiCall } from '@/shared/lib';`):

```ts
import { useRouter } from 'vue-router';

import ROUTES from '@/shared/routes';
```

And add after line 156 (`const authStore = useAuthStore();`):

```ts
const router = useRouter();
```

- [ ] **Step 2: Add `navigateToDetail` function**

Add after `clearSelection` function (after line 236):

```ts
function navigateToDetail(id: string) {
  router.push({ name: ROUTES.adminQuestionDetail, params: { id } });
}
```

- [ ] **Step 3: Replace row `@click` handler**

Change line 62 from:

```html
@click="toggleSelect(question.id)">
```

to:

```html
@click="navigateToDetail(question.id)"
    @keydown.enter="navigateToDetail(question.id)"
    tabindex="0"
    role="link">
```

- [ ] **Step 4: Run typecheck**

Run: `npm run typecheck`
Expected: PASS, no errors

- [ ] **Step 5: Run linter**

Run: `npm run lint`
Expected: PASS, no errors

- [ ] **Step 6: Commit**

```bash
git add src/pages/admin/questions/ui/AdminQuestionsPage.vue
git commit -m "feat(client): navigate to question detail on row click in admin list"
```
