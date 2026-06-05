# PrimeVue Migration — Package 3 (Low Impact) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace two remaining manual patterns with PrimeVue components: Divider and Password.

**Architecture:** Minimal changes to existing components. Replace native elements with PrimeVue equivalents while preserving all functionality and styling.

**Tech Stack:** Vue 3.5, PrimeVue 4.5.5, TypeScript, SCSS, FSD v2.1.

---

## Task 1: Replace manual dividers with PrimeVue Divider

**Files:**
- Modify: `src/entities/question/ui/QuestionIdView.vue`
- Modify: `src/pages/admin/question-detail/ui/AdminQuestionDetailPage.vue`

**Step 1:** In each file, replace `<div class="...__divider"></div>` with `<Divider />` from `primevue/divider`.

**Step 2:** Remove the corresponding `....__divider` CSS blocks from `<style>`.

**Step 3:** Import `Divider` from `primevue/divider` in each file's `<script setup>`.

**Step 4:** Run `eslint:check` and `typecheck` on both files. Commit.

---

## Task 2: Replace manual password toggle with PrimeVue Password

**File:**
- Modify: `src/features/auth/ui/SetupView.vue`

**Step 1:** Replace the two manual password fields (password + confirmPassword) that currently use `InputText` + `button` toggle with `Password` component from `primevue/password`.

**Step 2:** The `Password` component has built-in `toggleMask` prop. Remove `isPasswordVisible` and `isConfirmPasswordVisible` refs.

**Step 3:** Remove the `.setup-view__password-field` and `.setup-view__toggle-password` CSS blocks.

**Step 4:** Run `eslint:check` and `typecheck`. Commit.

---

## Task 3: Integration Testing

- Run `npm run test`, `npm run lint`, `npm run fsd:check`, `npm run typecheck`.
- Expected: all PASS.
- Final commit.
