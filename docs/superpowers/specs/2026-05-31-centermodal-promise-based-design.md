# CenterModal Promise-Based Design

Date: 2026-05-31

## Overview

Refactor `CenterModal.vue` to use promise-based API following the same pattern as `SlideOver.vue`. Remove old props-based API (`isOpen`, `title`) and migrate all 6 modal instances across 5 files.

## Architecture

Based on `SlideOver.vue` pattern:
- Uses PrimeVue `Dialog` instead of `Drawer`
- Promise-based API: `open()` returns `Promise<string>`, resolves on `confirm` or `close`
- Methods exposed via `defineExpose`: `open`, `confirm`, `close`

## Component API

### Exposed Methods

```typescript
open(): Promise<string>  // Opens modal, resolves with 'confirm' | 'close'
confirm()                // Resolves 'confirm', closes modal
close()                  // Resolves 'close', closes modal
```

### Slots

- `#header` — Modal header content (replaces `title` prop)
- `#default` (scoped) — Modal body content, receives `{ confirm, close }`
- `#footer` — Modal footer content

## Internal Implementation

- `isVisible: Ref<boolean>` — visibility state
- `resolvePromise: ((value: string) => void) | null` — promise callback
- `open()` — sets `isVisible = true`, returns new `Promise`
- `confirm()` / `close()` — sets `isVisible = false`, calls `resolvePromise('confirm'/'close')`
- `@hide` handler (close via X button or overlay click) — resolves `'close'`

## Migration Plan (5 files)

For each usage, replace:
1. Remove `v-model:is-open`, `:title`, `@close` props/emits
2. Add `ref="modalRef"` and call `modalRef?.open()` to open
3. Move old `title` content to `#header` slot
4. Use scoped default slot with `confirm`/`close` for action buttons

### Files to update

- `src/pages/admin/faq/ui/AdminFAQPage.vue` (2 instances)
- `src/pages/admin/faq/ui/AdminFAQCategoryPage.vue` (2 instances)
- `src/pages/admin/feedback/ui/AdminFeedbackPage.vue` (1 instance)
- `src/pages/admin/areas/ui/AdminAreasPage.vue` (1 instance)
- `src/pages/admin/speakers/ui/AdminSpeakersPage.vue` (1 instance)

## Styling

- Keep `maxWidth: '600px'` style
- Center positioning via PrimeVue Dialog
- Dark theme support via `:global(.p-dark)` selectors (same pattern as SlideOver)
- Remove `draggable="false"` if not needed (Dialog default)

## Acceptance Criteria

- [ ] CenterModal has promise-based API matching SlideOver pattern
- [ ] All 5 usage locations migrated to new API
- [ ] `title` prop removed, header uses slot
- [ ] `isOpen` prop and `close` emit removed
- [ ] ESLint passes (`npm run lint`)
- [ ] FSD check passes (`npm run fsd:check`)
- [ ] TypeScript check passes (`npm run typecheck`)
