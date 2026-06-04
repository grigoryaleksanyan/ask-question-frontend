# Admin Question Row Navigation

## Problem

In the admin questions list (`/admin-questions`), clicking a row toggles checkbox selection. There is no way to navigate to the question detail page (`/admin-questions/:id`) from the list.

## Decision

Click on a question row navigates to the detail page. Selection for bulk actions is performed exclusively via the checkbox in the first column.

## Approach

Programmatic navigation via `@click` + `router.push` (Approach A). Reason: minimal changes, no conflict with nested interactive elements (checkbox, status dropdown, comment button).

## Changes

### File: `src/pages/admin/questions/ui/AdminQuestionsPage.vue`

1. **Row click handler**
   - Replace `@click="toggleSelect(question.id)"` with `@click="navigateToDetail(question.id)"`
   - Add function:
     ```ts
     function navigateToDetail(id: string) {
       router.push({ name: ROUTES.adminQuestionDetail, params: { id } });
     }
     ```

2. **Selection**
   - Checkbox `@click.stop` remains unchanged — still toggles `selectedIds`
   - Row click no longer calls `toggleSelect`
   - Visual class `admin-questions-page__row--selected` bound to `selectedIds.has()` — unchanged

3. **Hover styling**
   - Add `cursor: pointer` on row
   - Add hover background (subtle) to indicate clickability

4. **Accessibility**
   - Add `tabindex="0"` and `@keydown.enter` on row for keyboard navigation
   - Add `role="link"` for semantic meaning

5. **Unchanged**
   - `@click.stop` on status, comment, and checkbox cells
   - Status filter tabs
   - `QuestionBulkActions`
   - Route `/admin-questions/:id` (already exists)
   - Route constant `ROUTES.adminQuestionDetail` (already exists)

## Scope

Single file change: `AdminQuestionsPage.vue`.
