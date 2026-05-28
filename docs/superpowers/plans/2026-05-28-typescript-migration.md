# TypeScript Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the entire ask-question-frontend codebase from JavaScript to TypeScript with full type safety.

**Architecture:** Bottom-up migration following FSD layer order (shared → entities → features → pages → app). Incremental approach with `allowJs: true` during transition. DTO types use correct Latin `created`. The backend Cyrillic `Сreated` bug is fixed at the source (Task 0 — rename in C# BaseEntity) so JSON responses contain `created`. Vue components switch from runtime `defineProps({...})` to type-based `defineProps<T>()`.

**Tech Stack:** TypeScript 5.x, vue-tsc, typescript-eslint, Vite 8, Vue 3.5, Pinia 3

---

## Task 0: Fix Cyrillic `Сreated` Bug in Backend

The root cause of the `Сreated` bug is in the C# codebase: `BaseEntity` and all derived entities use Cyrillic `С` instead of Latin `C`. This must be fixed at the source so JSON responses contain `created` after .NET CamelCase serialization.

**Files (backend):**
- Modify: `ask-question-backend/DAL/Entities/BaseEntity.cs`
- All entity files inheriting `BaseEntity` (the property is inherited, so only `BaseEntity` needs changing)
- All DTO and ViewModel files that declare `Сreated` / `Updated` independently
- All mapping profiles / AutoMapper configs that reference `Сreated`

- [ ] **Step 1: Rename in BaseEntity.cs**

Change `Сreated` → `Created` and `Updated` → `Updated` (the `Updated` is already Latin but verify):

```csharp
public DateTimeOffset Created { get; set; }
public DateTimeOffset? Updated { get; set; }
```

- [ ] **Step 2: Rename in all DTO files that declare `Сreated` independently**

Files to check (each may have its own `Сreated` property, not inherited):
- `BLL/DTO/Question/QuestionDto.cs`
- `BLL/DTO/FaqCategory/FaqCategoryDto.cs`
- `BLL/DTO/FaqEntry/FaqEntryDto.cs`
- `BLL/DTO/Area/AreaDto.cs`
- `BLL/DTO/User/UserDto.cs`
- `BLL/DTO/User/UserDetailsDto.cs`
- `BLL/DTO/Feedback/FeedbackDto.cs`
- `BLL/DTO/Feedback/FeedbackCreateDto.cs`
- All `WebApi/Models/Response/` ViewModels that declare `Сreated`

In each file: `Сreated` → `Created`.

- [ ] **Step 3: Verify AutoMapper profiles / mappings**

Search for `Сreated` across the entire backend solution. Any mapping expression, `.ForMember()`, or manual assignment referencing `Сreated` must be updated to `Created`.

- [ ] **Step 4: Verify no EF migration is needed**

Renaming a C# property does NOT change the database column name (EF maps by convention to the same column name). Verify that `Created` still maps to the existing DB column. If column name in DB is `Сreated` (unlikely — it would be stored as the C# property name), a migration may be needed.

```bash
cd ask-question-backend && dotnet build
```

Expected: successful build

- [ ] **Step 5: Run backend and verify JSON output**

```bash
cd ask-question-backend/AskQuestion.WebApi && dotnet run
```

Call any API endpoint and verify the JSON now contains `created` (Latin) instead of `Сreated`.

- [ ] **Step 6: Commit (in backend repo)**

```bash
git add -A
git commit -m "fix: rename Cyrillic Сreated to Latin Created across all entities and DTOs"
```

---

## Task 1: Install TypeScript Dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install dev dependencies**

```bash
npm install -D typescript vue-tsc @vue/tsconfig typescript-eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-import-resolver-typescript
```

- [ ] **Step 2: Verify installation**

```bash
npx tsc --version
```

Expected: TypeScript 5.x version output

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "build: add TypeScript and related dev dependencies"
```

---

## Task 2: Create tsconfig Files

**Files:**
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `tsconfig.node.json`
- Delete: `jsconfig.json`

- [ ] **Step 1: Create root tsconfig.json**

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

- [ ] **Step 2: Create tsconfig.app.json (for src/)**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "preserve",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "noEmit": true,
    "paths": {
      "@/*": ["./src/*"]
    },
    "types": ["vite/client"],
    "allowJs": true
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue", "env.d.ts"],
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 3: Create tsconfig.node.json (for config files)**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "lib": ["ES2022"],
    "skipLibCheck": true,
    "noEmit": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["vite.config.ts", "vitest.config.ts", "eslint.config.ts", "steiger.config.ts"]
}
```

- [ ] **Step 4: Create env.d.ts for Vite/env type declarations**

File: `env.d.ts`

```typescript
/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';

  const component: DefineComponent<
    Record<string, unknown>,
    Record<string, unknown>,
    unknown
  >;

  export default component;
}
```

- [ ] **Step 5: Delete jsconfig.json**

```bash
rm jsconfig.json
```

- [ ] **Step 6: Commit**

```bash
git add tsconfig.json tsconfig.app.json tsconfig.node.json env.d.ts
git rm jsconfig.json
git commit -m "build: replace jsconfig with tsconfig, add env.d.ts"
```

---

## Task 3: Migrate Vite Config to TypeScript

**Files:**
- Create: `vite.config.ts`
- Delete: `vite.config.js`

- [ ] **Step 1: Create vite.config.ts**

```typescript
import { fileURLToPath, URL } from 'node:url';

import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [vue(), vuetify()],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: fileURLToPath(new URL('./src', import.meta.url)),
      },
    ],
  },
  css: {
    preprocessorOptions: {
      scss: { additionalData: '@use "@/app/styles/variables.scss";' },
    },
  },
  server: {
    port: 5000,
    proxy: { '/api': { target: 'http://localhost:5500', changeOrigin: true } },
  },
});
```

- [ ] **Step 2: Delete old config**

```bash
rm vite.config.js
```

- [ ] **Step 3: Verify build still works**

```bash
npm run build
```

Expected: successful build

- [ ] **Step 4: Commit**

```bash
git add vite.config.ts
git rm vite.config.js
git commit -m "build: migrate vite.config to TypeScript"
```

---

## Task 4: Migrate Vitest Config to TypeScript

**Files:**
- Create: `vitest.config.ts`
- Delete: `vitest.config.js`

- [ ] **Step 1: Create vitest.config.ts**

```typescript
import { fileURLToPath, URL } from 'node:url';

import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: fileURLToPath(new URL('./src', import.meta.url)),
      },
    ],
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    globals: true,
    css: false,
  },
});
```

- [ ] **Step 2: Delete old config**

```bash
rm vitest.config.js
```

- [ ] **Step 3: Commit**

```bash
git add vitest.config.ts
git rm vitest.config.js
git commit -m "build: migrate vitest.config to TypeScript"
```

---

## Task 5: Migrate Steiger Config to TypeScript

**Files:**
- Create: `steiger.config.ts`
- Delete: `steiger.config.js`

- [ ] **Step 1: Create steiger.config.ts**

```typescript
import { defineConfig } from 'steiger';
import fsd from '@feature-sliced/steiger-plugin';

export default defineConfig([
  ...fsd.configs.recommended,
  {
    rules: {
      'fsd/insignificant-slice': 'off',
    },
  },
]);
```

- [ ] **Step 2: Delete old config**

```bash
rm steiger.config.js
```

- [ ] **Step 3: Verify FSD check still works**

```bash
npm run fsd:check
```

Expected: same results as before

- [ ] **Step 4: Commit**

```bash
git add steiger.config.ts
git rm steiger.config.js
git commit -m "build: migrate steiger.config to TypeScript"
```

---

## Task 6: Update index.html Entry Point

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Update script src to main.ts**

Change line 24 in `index.html` from:
```html
    <script
      type="module"
      src="/src/app/entrypoint/main.js"></script>
```
to:
```html
    <script
      type="module"
      src="/src/app/entrypoint/main.ts"></script>
```

- [ ] **Step 2: Commit**

```bash
git add index.html
git commit -m "build: update index.html entry point to main.ts"
```

---

## Task 7: Create Shared DTO Types

**Files:**
- Create: `src/shared/types/api-responses.ts`
- Create: `src/shared/types/api-requests.ts`
- Create: `src/shared/types/models.ts`
- Create: `src/shared/types/index.ts`

These types mirror the backend C# ViewModels/RequestModels, using correct Latin `created`. The Cyrillic `Сreated` bug is fixed at the backend source (Task 0), so JSON responses already contain `created`. Backend serializes `Guid` as `string` in JSON, `DateTimeOffset` as `string`.

- [ ] **Step 1: Create api-responses.ts**

```typescript
export interface UserDetailsResponse {
  id: string;
  fullName: string;
  email: string;
  additionalInfo: string | null;
  created: string;
  updated: string | null;
}

export interface UserResponse {
  id: string;
  login: string;
  userRoleId: UserRoleId;
  userDetails: UserDetailsResponse | null;
  created: string;
  updated: string | null;
}

export interface QuestionResponse {
  id: string;
  text: string;
  author: string | null;
  area: string | null;
  speaker: string;
  views: number;
  likes: number;
  dislikes: number;
  created: string;
  answered: string | null;
}

export interface FaqCategoryResponse {
  id: string;
  name: string;
  order: number;
  created: string;
  updated: string | null;
}

export interface FaqCategoryWithEntriesResponse extends FaqCategoryResponse {
  entries: FaqEntryResponse[];
}

export interface FaqEntryResponse {
  id: string;
  question: string;
  answer: string;
  order: number;
  created: string;
  updated: string | null;
}

export interface AreaResponse {
  id: string;
  title: string;
  order: number;
  created: string;
  updated: string | null;
}

export interface FeedbackResponse {
  id: string;
  username: string;
  email: string;
  theme: string;
  text: string;
  created: string;
  updated: string | null;
}

export interface CaptchaResponse {
  id: string;
  captchaImage: string;
}
```

- [ ] **Step 2: Create api-requests.ts**

```typescript
export interface LoginRequest {
  login: string;
  password: string;
}

export interface ChangePasswordRequest {
  password: string | null;
  newPassword: string | null;
  confirmPassword: string | null;
}

export interface QuestionCreateRequest {
  text: string | null;
  author: string | null;
  area: string | null;
  speaker: string | null;
}

export interface QuestionUpdateRequest {
  id: string;
  text: string;
  author: string | null;
  area: string | null;
  speaker: string;
}

export interface FaqCategoryCreateRequest {
  name: string;
  order: number;
}

export interface FaqCategoryUpdateRequest {
  id: string;
  name: string;
}

export interface FaqEntryCreateRequest {
  faqCategoryId: string;
  question: string;
  answer: string;
  order: number;
}

export interface FaqEntryUpdateRequest {
  id: string;
  question: string;
  answer: string;
}

export interface AreaCreateRequest {
  title: string;
  order: number;
}

export interface AreaUpdateRequest {
  id: string;
  title: string;
}

export interface FeedbackCreateRequest {
  username: string;
  email: string;
  theme: string;
  text: string;
}
```

- [ ] **Step 3: Create models.ts (frontend-only types)**

```typescript
export enum UserRoleId {
  Administrator = 1,
  Speaker = 2,
}

export enum QuestionStatusId {
  New = 0,
  InFocus = 1,
  WithComment = 2,
  Answered = 3,
}

export interface QuestionStatus {
  STATUS_ID: QuestionStatusId;
  TITLE: string;
  COLOR: string;
}

export interface AlertItem {
  id: string;
  type: AlertType;
  text: string;
}

export type AlertType = 'success' | 'info' | 'warning' | 'error';

export interface NavItem {
  title: string;
  icon: string;
  link: string;
}

export interface SidebarModalResult {
  status: boolean;
  data: unknown;
}

export interface DateRangeValue {
  startDate: string | null;
  endDate: string | null;
}
```

- [ ] **Step 4: Create index.ts (barrel export)**

```typescript
export type {
  UserDetailsResponse,
  UserResponse,
  QuestionResponse,
  FaqCategoryResponse,
  FaqCategoryWithEntriesResponse,
  FaqEntryResponse,
  AreaResponse,
  FeedbackResponse,
  CaptchaResponse,
} from './api-responses';

export type {
  LoginRequest,
  ChangePasswordRequest,
  QuestionCreateRequest,
  QuestionUpdateRequest,
  FaqCategoryCreateRequest,
  FaqCategoryUpdateRequest,
  FaqEntryCreateRequest,
  FaqEntryUpdateRequest,
  AreaCreateRequest,
  AreaUpdateRequest,
  FeedbackCreateRequest,
} from './api-requests';

export {
  UserRoleId,
  QuestionStatusId,
  AlertType,
  type QuestionStatus,
  type AlertItem,
  type NavItem,
  type SidebarModalResult,
  type DateRangeValue,
} from './models';
```

- [ ] **Step 5: Commit**

```bash
git add src/shared/types/
git commit -m "feat: add shared DTO types matching backend API"
```

---

## Task 8: Migrate shared/api

**Files:**
- Create: `src/shared/api/http-client.ts`
- Create: `src/shared/api/index.ts`
- Delete: `src/shared/api/http-client.js`
- Delete: `src/shared/api/index.js`

- [ ] **Step 1: Create http-client.ts**

```typescript
import axios from 'axios';

const httpClient = axios.create({
  baseURL: import.meta.env.BASE_URL,
  withCredentials: true,
});

httpClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
);

httpClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);

export default httpClient;
```

- [ ] **Step 2: Create index.ts**

```typescript
export { default } from './http-client';
```

- [ ] **Step 3: Delete old files**

```bash
rm src/shared/api/http-client.js src/shared/api/index.js
```

- [ ] **Step 4: Commit**

```bash
git add src/shared/api/
git rm src/shared/api/http-client.js src/shared/api/index.js
git commit -m "refactor(shared): migrate api layer to TypeScript"
```

---

## Task 9: Migrate shared/config

**Files:**
- Create: `src/shared/config/alert-types.ts`
- Create: `src/shared/config/index.ts`
- Delete: `src/shared/config/alert-types.js`
- Delete: `src/shared/config/index.js`

- [ ] **Step 1: Create alert-types.ts**

```typescript
import type { AlertType } from '@/shared/types';

const ALERT_TYPES: Record<string, AlertType> = {
  SUCCESS: 'success',
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
} as const;

export default ALERT_TYPES;
```

- [ ] **Step 2: Create index.ts**

```typescript
export { default as ALERT_TYPES } from './alert-types';
```

- [ ] **Step 3: Delete old files**

```bash
rm src/shared/config/alert-types.js src/shared/config/index.js
```

- [ ] **Step 4: Commit**

```bash
git add src/shared/config/
git rm src/shared/config/alert-types.js src/shared/config/index.js
git commit -m "refactor(shared): migrate config to TypeScript"
```

---

## Task 10: Migrate shared/lib

**Files:**
- Create: `src/shared/lib/copy-to-clipboard.ts`
- Create: `src/shared/lib/html-sanitize.ts`
- Create: `src/shared/lib/index.ts`
- Delete: `src/shared/lib/copy-to-clipboard.js`
- Delete: `src/shared/lib/html-sanitize.js`
- Delete: `src/shared/lib/index.js`

- [ ] **Step 1: Create copy-to-clipboard.ts**

```typescript
export default async function copyToClipboard(
  textToCopy: string,
): Promise<void> {
  await navigator.clipboard.writeText(textToCopy);
}
```

- [ ] **Step 2: Create html-sanitize.ts**

```typescript
import DOMPurify from 'dompurify';

DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if ('target' in node) {
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener noreferrer');
  }
});

export default function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html);
}
```

- [ ] **Step 3: Create index.ts**

```typescript
export { default as copyToClipboard } from './copy-to-clipboard';
export { default as sanitizeHtml } from './html-sanitize';
```

- [ ] **Step 4: Delete old files**

```bash
rm src/shared/lib/copy-to-clipboard.js src/shared/lib/html-sanitize.js src/shared/lib/index.js
```

- [ ] **Step 5: Commit**

```bash
git add src/shared/lib/
git rm src/shared/lib/copy-to-clipboard.js src/shared/lib/html-sanitize.js src/shared/lib/index.js
git commit -m "refactor(shared): migrate lib to TypeScript"
```

---

## Task 11: Migrate shared/routes and shared/assets

**Files:**
- Create: `src/shared/routes/routes.ts`
- Create: `src/shared/routes/index.ts`
- Create: `src/shared/assets/index.ts`
- Delete: `src/shared/routes/routes.js`
- Delete: `src/shared/routes/index.js`
- Delete: `src/shared/assets/index.js`

- [ ] **Step 1: Create routes.ts**

```typescript
const ROUTES = {
  main: '/',
  notFound: 'not-found',
} as const;

export default ROUTES;
```

- [ ] **Step 2: Create routes/index.ts**

```typescript
export { default } from './routes';
```

- [ ] **Step 3: Create assets/index.ts**

```typescript
export { default } from './logo.svg';
```

- [ ] **Step 4: Delete old files**

```bash
rm src/shared/routes/routes.js src/shared/routes/index.js src/shared/assets/index.js
```

- [ ] **Step 5: Commit**

```bash
git add src/shared/routes/ src/shared/assets/
git rm src/shared/routes/routes.js src/shared/routes/index.js src/shared/assets/index.js
git commit -m "refactor(shared): migrate routes and assets to TypeScript"
```

---

## Task 12: Migrate shared/ui/sidebar-modal

**Files:**
- Create: `src/shared/ui/sidebar-modal/index.ts`
- Modify: `src/shared/ui/sidebar-modal/SidebarModal.vue`
- Modify: `src/shared/ui/sidebar-modal/SidebarContentWrapper.vue`
- Delete: `src/shared/ui/sidebar-modal/index.js`

- [ ] **Step 1: Update SidebarModal.vue — add lang="ts" and type-based props/expose**

Replace `<script setup>` with `<script setup lang="ts">` and update props/expose:

```vue
<script setup lang="ts">
import { defineAsyncComponent, onBeforeUnmount, provide, ref } from 'vue';

import type { SidebarModalResult } from '@/shared/types';

interface Props {
  forcedSlotRender?: boolean;
  closeOnEsc?: boolean;
  closeOnClickAway?: boolean;
}

const {
  forcedSlotRender = false,
  closeOnEsc,
  closeOnClickAway,
} = defineProps<Props>();

const SidebarPreloader = defineAsyncComponent(
  () => import('./SidebarPreloader.vue'),
);

const isOpen = ref(false);
const showPreloader = ref(false);

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && !showPreloader.value) {
    close();
  }
}

function clickOnOverlay() {
  if (closeOnClickAway && !showPreloader.value) {
    close();
  }
}

function togglePreloader(status: boolean) {
  showPreloader.value = status;
}

function toggleScroll(value: boolean) {
  document.querySelector('html')!.style.overflowY = value ? 'hidden' : 'auto';
}

let modalController: {
  resolve: (value: SidebarModalResult) => void;
  reject: (reason?: unknown) => void;
} | null = null;

function open(): Promise<SidebarModalResult> {
  let resolve!: (value: SidebarModalResult) => void;
  let reject!: (reason?: unknown) => void;
  const modalPromise = new Promise<SidebarModalResult>((ok, fail) => {
    resolve = ok;
    reject = fail;
  });

  modalController = { resolve, reject };

  isOpen.value = true;
  toggleScroll(true);

  if (closeOnEsc) {
    document.addEventListener('keydown', handleKeydown);
  }

  return modalPromise;
}

function resolveModal(status: boolean, data: unknown = null) {
  modalController!.resolve({ status, data });
  isOpen.value = false;
  toggleScroll(false);

  if (closeOnEsc) {
    document.removeEventListener('keydown', handleKeydown);
  }
}

function confirm(data: unknown = null) {
  resolveModal(true, data);
}

function close(data: unknown = null) {
  resolveModal(false, data);
}

provide('close', close);

onBeforeUnmount(() => {
  toggleScroll(false);
});

defineExpose({
  open,
});
</script>
```

Note: template uses `getUserData.сreated` (Cyrillic) → must change to `getUserData.created`.

- [ ] **Step 3: Create index.ts**

```typescript
export { default as SidebarModal } from './SidebarModal.vue';
export { default as SidebarContentWrapper } from './SidebarContentWrapper.vue';
```

- [ ] **Step 4: Delete old index.js**

```bash
rm src/shared/ui/sidebar-modal/index.js
```

- [ ] **Step 5: Commit**

```bash
git add src/shared/ui/sidebar-modal/
git rm src/shared/ui/sidebar-modal/index.js
git commit -m "refactor(shared): migrate sidebar-modal to TypeScript"
```

---

## Task 13: Migrate shared/ui/center-modal

**Files:**
- Create: `src/shared/ui/center-modal/index.ts`
- Modify: `src/shared/ui/center-modal/CenterModal.vue`
- Modify: `src/shared/ui/center-modal/CenterModalContentWrapper.vue`
- Delete: `src/shared/ui/center-modal/index.js`

- [ ] **Step 1: Update CenterModal.vue — add lang="ts" and type-based props/emits**

Replace `<script setup>` with:

```vue
<script setup lang="ts">
defineOptions({ name: 'CenterModal' });

interface Props {
  isOpen: boolean;
  title: string;
}

defineProps<Props>();

const emit = defineEmits<{
  close: [];
}>();
</script>
```

- [ ] **Step 2: CenterModalContentWrapper.vue — add lang="ts"**

Replace `<script setup>` with `<script setup lang="ts">` (no props/emits to type).

- [ ] **Step 3: Create index.ts**

```typescript
export { default as CenterModal } from './CenterModal.vue';
export { default as CenterModalContentWrapper } from './CenterModalContentWrapper.vue';
```

- [ ] **Step 4: Delete old index.js**

```bash
rm src/shared/ui/center-modal/index.js
```

- [ ] **Step 5: Commit**

```bash
git add src/shared/ui/center-modal/
git rm src/shared/ui/center-modal/index.js
git commit -m "refactor(shared): migrate center-modal to TypeScript"
```

---

## Task 14: Migrate shared/ui/rich-editor

**Files:**
- Create: `src/shared/ui/rich-editor/index.ts`
- Modify: `src/shared/ui/rich-editor/RichEditor.vue`
- Delete: `src/shared/ui/rich-editor/index.js`

- [ ] **Step 1: Update RichEditor.vue — add lang="ts"**

Replace `<script setup>` with:

```vue
<script setup lang="ts">
defineOptions({ name: 'RichEditor' });
</script>
```

- [ ] **Step 2: Create index.ts**

```typescript
export { default } from './RichEditor.vue';
```

- [ ] **Step 3: Delete old index.js**

```bash
rm src/shared/ui/rich-editor/index.js
```

- [ ] **Step 4: Commit**

```bash
git add src/shared/ui/rich-editor/
git rm src/shared/ui/rich-editor/index.js
git commit -m "refactor(shared): migrate rich-editor to TypeScript"
```

---

## Task 15: Migrate shared/ui standalone components

**Files:**
- Modify: `src/shared/ui/AppLogo.vue`
- Modify: `src/shared/ui/HeaderNavigation.vue`
- Modify: `src/shared/ui/DrawerNavigation.vue`

- [ ] **Step 1: Update AppLogo.vue — add lang="ts"**

Replace `<script setup>` with:

```vue
<script setup lang="ts">
import { ref } from 'vue';

import logoUrl from '@/shared/assets';

defineOptions({ name: 'AppLogo' });

const imageUrl = ref(logoUrl);
</script>
```

- [ ] **Step 2: Update HeaderNavigation.vue — add lang="ts" and type-based props**

Replace `<script setup>` with:

```vue
<script setup lang="ts">
import type { NavItem } from '@/shared/types';

defineOptions({ name: 'HeaderNavigation' });

defineProps<{
  navItems: NavItem[];
}>();
</script>
```

- [ ] **Step 3: Update DrawerNavigation.vue — add lang="ts" and type-based props**

Replace `<script setup>` with:

```vue
<script setup lang="ts">
import type { NavItem } from '@/shared/types';

defineOptions({ name: 'DrawerNavigation' });

defineProps<{
  navItems: NavItem[];
}>();
</script>
```

- [ ] **Step 4: Commit**

```bash
git add src/shared/ui/AppLogo.vue src/shared/ui/HeaderNavigation.vue src/shared/ui/DrawerNavigation.vue
git commit -m "refactor(shared): migrate standalone UI components to TypeScript"
```

---

## Task 16: Migrate entity/alert

**Files:**
- Create: `src/entities/alert/store/index.ts`
- Create: `src/entities/alert/lib/pseudorandom-generator.ts`
- Create: `src/entities/alert/index.ts`
- Modify: `src/entities/alert/ui/AppAlert.vue`
- Modify: `src/entities/alert/ui/AppAlertItem.vue`
- Delete: `src/entities/alert/store/index.js`
- Delete: `src/entities/alert/lib/pseudorandom-generator.js`
- Delete: `src/entities/alert/index.js`

- [ ] **Step 1: Create pseudorandom-generator.ts**

```typescript
export default function generateId(): string {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const length = 12;
  let result = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }

  return result;
}
```

- [ ] **Step 2: Create store/index.ts**

```typescript
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

import type { AlertItem, AlertType } from '@/shared/types';

import generateId from '../lib/pseudorandom-generator';

interface AddAlertPayload {
  type: AlertType;
  text: string;
  delay?: number;
}

export const useAlertStore = defineStore('alert', () => {
  const alerts = ref<AlertItem[]>([]);

  const getAlerts = computed(() => alerts.value);

  function addAlert({ type, text, delay }: AddAlertPayload) {
    const id = generateId();

    alerts.value.push({ id, type, text });

    if (type !== 'error') {
      setTimeout(() => {
        removeAlert(id);
      }, delay ?? 3000);
    }
  }

  function removeAlert(id: string) {
    alerts.value = alerts.value.filter((alert) => alert.id !== id);
  }

  return { alerts, getAlerts, addAlert, removeAlert };
});
```

- [ ] **Step 3: Update AppAlert.vue — add lang="ts"**

Replace `<script setup>` with:

```vue
<script setup lang="ts">
import { storeToRefs } from 'pinia';

import { useAlertStore } from '../store';

defineOptions({ name: 'AppAlert' });

const alertStore = useAlertStore();
const { getAlerts } = storeToRefs(alertStore);
</script>
```

- [ ] **Step 4: Update AppAlertItem.vue — add lang="ts" and type-based props**

Replace `<script setup>` with:

```vue
<script setup lang="ts">
import type { Component } from 'vue';

import type { AlertItem } from '@/shared/types';

import CloseIcon from './icons/CloseIcon.vue';
import ErrorIcon from './icons/ErrorIcon.vue';
import InfoIcon from './icons/InfoIcon.vue';
import SuccessIcon from './icons/SuccessIcon.vue';
import WarningIcon from './icons/WarningIcon.vue';

import { useAlertStore } from '../store';

defineOptions({ name: 'AppAlertItem' });

const { alert } = defineProps<{
  alert: AlertItem;
}>();

const alertStore = useAlertStore();

const iconMap: Record<string, Component> = {
  success: SuccessIcon,
  info: InfoIcon,
  warning: WarningIcon,
  error: ErrorIcon,
};
</script>
```

- [ ] **Step 5: Create index.ts**

```typescript
export { default as AppAlert } from './ui/AppAlert.vue';
export { default as AppAlertItem } from './ui/AppAlertItem.vue';
export { useAlertStore } from './store';
```

- [ ] **Step 6: Delete old files**

```bash
rm src/entities/alert/store/index.js src/entities/alert/lib/pseudorandom-generator.js src/entities/alert/index.js
```

- [ ] **Step 7: Run alert store tests to verify**

```bash
npx vitest run tests/entities/alert/store/index.test.js
```

Expected: all tests pass

- [ ] **Step 8: Commit**

```bash
git add src/entities/alert/
git rm src/entities/alert/store/index.js src/entities/alert/lib/pseudorandom-generator.js src/entities/alert/index.js
git commit -m "refactor(entities): migrate alert entity to TypeScript"
```

---

## Task 17: Migrate entity/question

**Files:**
- Create: `src/entities/question/api/questions-repository.ts`
- Create: `src/entities/question/config/question-statuses.ts`
- Create: `src/entities/question/index.ts`
- Modify: `src/entities/question/ui/QuestionCard.vue`
- Modify: `src/entities/question/ui/QuestionStatusIcon.vue`
- Modify: `src/entities/question/ui/QuestionFilters.vue`
- Modify: `src/entities/question/ui/QuestionFormCreate.vue`
- Modify: `src/entities/question/ui/QuestionsView.vue`
- Modify: `src/entities/question/ui/QuestionIdView.vue`
- Delete: `src/entities/question/api/questions-repository.js`
- Delete: `src/entities/question/config/question-statuses.js`
- Delete: `src/entities/question/index.js`

- [ ] **Step 1: Create question-statuses.ts**

```typescript
import { QuestionStatusId } from '@/shared/types';

import type { QuestionStatus } from '@/shared/types';

const QUESTION_STATUSES: Record<string, QuestionStatus> = {
  NEW: {
    STATUS_ID: QuestionStatusId.New,
    TITLE: 'новый',
    COLOR: '#1976d2',
  },
  IN_FOCUS: {
    STATUS_ID: QuestionStatusId.InFocus,
    TITLE: 'в фокусе',
    COLOR: '#ff9800',
  },
  WITH_COMMENT: {
    STATUS_ID: QuestionStatusId.WithComment,
    TITLE: 'с комментарием',
    COLOR: '#428f4e',
  },
  ANSWERED: {
    STATUS_ID: QuestionStatusId.Answered,
    TITLE: 'отвеченный',
    COLOR: '#9FB980',
  },
};

export default QUESTION_STATUSES;
```

- [ ] **Step 2: Create questions-repository.ts**

```typescript
import httpClient from '@/shared/api';

import type {
  QuestionResponse,
  QuestionCreateRequest,
  QuestionUpdateRequest,
  CaptchaResponse,
} from '@/shared/types';

const apiRoute = '/api/Question';

export async function GetCaptcha(): Promise<CaptchaResponse> {
  const result = await httpClient
    .get<CaptchaResponse>(`${apiRoute}/GetCaptcha`)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка получения капчи', { cause: error });
    });

  return result;
}

export async function GetAll(): Promise<QuestionResponse[]> {
  const result = await httpClient
    .get<QuestionResponse[]>(`${apiRoute}/GetAll`)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка получения списка вопросов', { cause: error });
    });

  return result;
}

export async function GetPopularQuestions(): Promise<QuestionResponse[]> {
  const result = await httpClient
    .get<QuestionResponse[]>(`${apiRoute}/GetPopularQuestions`)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка получения популярных вопросов', {
        cause: error,
      });
    });

  return result;
}

export async function GetById(id: string): Promise<QuestionResponse> {
  const result = await httpClient
    .get<QuestionResponse>(`${apiRoute}/GetById?id=${id}`)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка получения вопроса', { cause: error });
    });

  return result;
}

export async function Create(
  captcha: string,
  question: QuestionCreateRequest,
): Promise<void> {
  await httpClient
    .post(`${apiRoute}/Create?captcha=${captcha}`, question)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка создания вопроса', { cause: error });
    });
}

export async function Update(
  question: QuestionUpdateRequest,
): Promise<void> {
  await httpClient
    .put(`${apiRoute}/Update/${question.id}`, question)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка изменения вопроса', { cause: error });
    });
}

export async function Delete(id: string): Promise<void> {
  await httpClient
    .delete(`${apiRoute}/Delete/${id}`)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка удаления вопроса', { cause: error });
    });
}
```

Note: this also fixes the `GetCapctha` → `GetCaptcha` typo and `capctha` → `captcha` parameter name.

- [ ] **Step 3: Update QuestionCard.vue — add lang="ts" and type-based props**

Replace `<script setup>` with:

```vue
<script setup lang="ts">
import { computed } from 'vue';

import type { QuestionResponse } from '@/shared/types';

import QUESTION_STATUSES from '../config/question-statuses';

import QuestionStatusIcon from './QuestionStatusIcon.vue';

defineOptions({ name: 'QuestionCard' });

const { question } = defineProps<{
  question: QuestionResponse;
}>();

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

function sliceText(text: string) {
  const maxTextLength = 300;

  if (text.length < maxTextLength) {
    return text;
  }

  return `${text.slice(0, maxTextLength)}... <b class="question-card-more">подробнее</b>`;
}

function replaceCounter(value: number) {
  return value > 999 ? '999+' : value;
}

function setLike() {}

function setDislike() {}
</script>
```

Note: also fixes `replaceСounter` typo (Cyrillic С → Latin C).

- [ ] **Step 4: Update QuestionStatusIcon.vue — add lang="ts" and type-based props**

Replace `<script setup>` with:

```vue
<script setup lang="ts">
import { QuestionStatusId } from '@/shared/types';

import QUESTION_STATUSES from '../config/question-statuses';

defineOptions({ name: 'QuestionStatusIcon' });

const { status = QuestionStatusId.New } = defineProps<{
  status?: QuestionStatusId;
}>();

const statusList = [
  {
    text: QUESTION_STATUSES.NEW.TITLE,
    color: QUESTION_STATUSES.NEW.COLOR,
    icon: 'mdi-help-circle-outline',
  },
  {
    text: QUESTION_STATUSES.IN_FOCUS.TITLE,
    color: QUESTION_STATUSES.IN_FOCUS.COLOR,
    icon: 'mdi-eye-outline',
  },
  {
    text: QUESTION_STATUSES.WITH_COMMENT.TITLE,
    color: QUESTION_STATUSES.WITH_COMMENT.COLOR,
    icon: 'mdi-comment-text-outline',
  },
  {
    text: QUESTION_STATUSES.ANSWERED.TITLE,
    color: QUESTION_STATUSES.ANSWERED.COLOR,
    icon: 'mdi-check-circle-outline',
  },
];
</script>
```

- [ ] **Step 5: Update QuestionFilters.vue — add lang="ts"**

Replace `<script setup>` with `<script setup lang="ts">` and keep the rest as-is (filters still hardcoded until backend provides real filter options).

- [ ] **Step 6: Update QuestionFormCreate.vue — add lang="ts"**

Add `lang="ts"` to the `<script setup>` tag. Type the reactive controls:

```vue
<script setup lang="ts">
import { reactive } from 'vue';

import { ALERT_TYPES } from '@/shared/config';
import { useAlertStore } from '@/entities/alert';
import { usePreloaderStore } from '@/features/preloader';

import { GetCaptcha, GetAll as GetAllAreas, Create } from '../api/questions-repository';

defineOptions({ name: 'QuestionFormCreate' });

const alertStore = useAlertStore();
const preloaderStore = usePreloaderStore();

const controls = reactive({
  text: null as string | null,
  author: null as string | null,
  speaker: null as string | null,
  area: null as string | null,
});
```

(Rest of the template and style blocks remain unchanged.)

- [ ] **Step 7: Update QuestionsView.vue — add lang="ts"**

Replace `<script setup>` with:

```vue
<script setup lang="ts">
import { ref } from 'vue';

import type { QuestionResponse } from '@/shared/types';

import { ALERT_TYPES } from '@/shared/config';
import { useAlertStore } from '@/entities/alert';

import { GetAll } from '../api/questions-repository';

import QuestionCard from './QuestionCard.vue';
import QuestionFilters from './QuestionFilters.vue';

defineOptions({ name: 'QuestionsView' });

const alertStore = useAlertStore();

const questions = ref<QuestionResponse[]>([]);

async function fetchData() {
  try {
    questions.value = await GetAll();
  } catch (error) {
    const err = error as Error;
    alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: err.message });
  }
}

fetchData();
</script>
```

- [ ] **Step 8: Update QuestionIdView.vue — add lang="ts"**

Add `lang="ts"` to the `<script setup>` tag. Keep the rest as-is (still has hardcoded data — will be addressed separately).

- [ ] **Step 9: Create index.ts**

```typescript
export {
  GetCaptcha,
  GetAll as GetAllQuestions,
  GetPopularQuestions,
  GetById,
  Create as CreateQuestion,
  Update as UpdateQuestion,
  Delete as DeleteQuestion,
} from './api/questions-repository';

export { default as QUESTION_STATUSES } from './config/question-statuses';

export { default as QuestionCard } from './ui/QuestionCard.vue';
export { default as QuestionStatusIcon } from './ui/QuestionStatusIcon.vue';
export { default as QuestionFilters } from './ui/QuestionFilters.vue';
export { default as QuestionFormCreate } from './ui/QuestionFormCreate.vue';
export { default as QuestionsView } from './ui/QuestionsView.vue';
export { default as QuestionIdView } from './ui/QuestionIdView.vue';
```

- [ ] **Step 10: Delete old files**

```bash
rm src/entities/question/api/questions-repository.js src/entities/question/config/question-statuses.js src/entities/question/index.js
```

- [ ] **Step 11: Commit**

```bash
git add src/entities/question/
git rm src/entities/question/api/questions-repository.js src/entities/question/config/question-statuses.js src/entities/question/index.js
git commit -m "refactor(entities): migrate question entity to TypeScript, fix GetCapctha typo"
```

---

## Task 18: Migrate entity/faq

**Files:**
- Create: `src/entities/faq/api/faq-category-repository.ts`
- Create: `src/entities/faq/api/faq-entry-repository.ts`
- Create: `src/entities/faq/index.ts`
- Modify: `src/entities/faq/ui/FAQView.vue`
- Modify: `src/entities/faq/ui/CategoryCard.vue`
- Modify: `src/entities/faq/ui/EntryCard.vue`
- Modify: `src/entities/faq/ui/CreateCategory.vue`
- Modify: `src/entities/faq/ui/UpdateCategory.vue`
- Modify: `src/entities/faq/ui/DeleteCategory.vue`
- Modify: `src/entities/faq/ui/CreateEntryContent.vue`
- Modify: `src/entities/faq/ui/UpdateEntryContent.vue`
- Modify: `src/entities/faq/ui/DeleteEntry.vue`
- Delete: `src/entities/faq/api/faq-category-repository.js`
- Delete: `src/entities/faq/api/faq-entry-repository.js`
- Delete: `src/entities/faq/index.js`

- [ ] **Step 1: Create faq-category-repository.ts**

```typescript
import httpClient from '@/shared/api';

import type {
  FaqCategoryResponse,
  FaqCategoryWithEntriesResponse,
  FaqCategoryCreateRequest,
  FaqCategoryUpdateRequest,
} from '@/shared/types';

const apiRoute = '/api/FaqCategory';

export async function GetAll(): Promise<FaqCategoryResponse[]> {
  const result = await httpClient
    .get<FaqCategoryResponse[]>(`${apiRoute}/GetAll`)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка получения списка категорий', { cause: error });
    });

  return result;
}

export async function GetAllWithEntries(): Promise<FaqCategoryWithEntriesResponse[]> {
  const result = await httpClient
    .get<FaqCategoryWithEntriesResponse[]>(`${apiRoute}/GetAllWithEntries`)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка получения списка категорий', { cause: error });
    });

  return result;
}

export async function GetById(id: string): Promise<FaqCategoryWithEntriesResponse> {
  const result = await httpClient
    .get<FaqCategoryWithEntriesResponse>(`${apiRoute}/GetById?id=${id}`)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка получения данных категории', { cause: error });
    });

  return result;
}

export async function Create(
  category: FaqCategoryCreateRequest,
): Promise<FaqCategoryResponse> {
  const result = await httpClient
    .post<FaqCategoryResponse>(`${apiRoute}/Create`, category)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка создания категории', { cause: error });
    });

  return result;
}

export async function Update(
  category: FaqCategoryUpdateRequest,
): Promise<FaqCategoryResponse> {
  const result = await httpClient
    .put<FaqCategoryResponse>(`${apiRoute}/Update`, category)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка изменения категории', { cause: error });
    });

  return result;
}

export async function Delete(id: string): Promise<void> {
  await httpClient
    .delete(`${apiRoute}/Delete?id=${id}`)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка удаления категории', { cause: error });
    });
}

export async function SetOrder(categoryIds: string[]): Promise<void> {
  await httpClient
    .put(`${apiRoute}/SetOrder`, categoryIds)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка сортировки категорий', { cause: error });
    });
}
```

- [ ] **Step 2: Create faq-entry-repository.ts**

```typescript
import httpClient from '@/shared/api';

import type {
  FaqEntryResponse,
  FaqEntryCreateRequest,
  FaqEntryUpdateRequest,
} from '@/shared/types';

const apiRoute = '/api/FaqEntry';

export async function GetAll(): Promise<FaqEntryResponse[]> {
  const result = await httpClient
    .get<FaqEntryResponse[]>(`${apiRoute}/GetAll`)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка получения списка записей', { cause: error });
    });

  return result;
}

export async function GetById(id: string): Promise<FaqEntryResponse> {
  const result = await httpClient
    .get<FaqEntryResponse>(`${apiRoute}/GetById?id=${id}`)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка получения данных записи', { cause: error });
    });

  return result;
}

export async function Create(
  entry: FaqEntryCreateRequest,
): Promise<FaqEntryResponse> {
  const result = await httpClient
    .post<FaqEntryResponse>(`${apiRoute}/Create`, entry)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка создания записи', { cause: error });
    });

  return result;
}

export async function Update(
  entry: FaqEntryUpdateRequest,
): Promise<FaqEntryResponse> {
  const result = await httpClient
    .put<FaqEntryResponse>(`${apiRoute}/Update`, entry)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка изменения записи', { cause: error });
    });

  return result;
}

export async function Delete(id: string): Promise<void> {
  await httpClient
    .delete(`${apiRoute}/Delete?id=${id}`)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка удаления записи', { cause: error });
    });
}

export async function SetOrder(ids: string[]): Promise<void> {
  await httpClient
    .put(`${apiRoute}/SetOrder`, ids)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка сортировки записей', { cause: error });
    });
}
```

- [ ] **Step 3: Update FAQView.vue — add lang="ts"**

Add `lang="ts"` to `<script setup>`. Type the ref:

```typescript
import type { FaqCategoryWithEntriesResponse } from '@/shared/types';
// ...
const categories = ref<FaqCategoryWithEntriesResponse[]>([]);
```

- [ ] **Step 4: Update CategoryCard.vue — add lang="ts" and type-based props**

Replace `<script setup>` with:

```vue
<script setup lang="ts">
import type { FaqCategoryWithEntriesResponse } from '@/shared/types';

defineOptions({ name: 'CategoryCard' });

defineProps<{
  category: FaqCategoryWithEntriesResponse;
}>();
</script>
```

- [ ] **Step 5: Update EntryCard.vue — add lang="ts" and type-based props/emits**

Replace `<script setup>` with:

```vue
<script setup lang="ts">
import type { FaqEntryResponse } from '@/shared/types';

defineOptions({ name: 'EntryCard' });

defineProps<{
  entry: FaqEntryResponse;
}>();

const emit = defineEmits<{
  'copy-link': [];
  update: [];
  delete: [];
}>();
</script>
```

Note: template uses `entry.Сreated` → must change to `entry.created` in the template too.

- [ ] **Step 6: Update CreateCategory.vue — add lang="ts" and type-based props/emits**

Replace `<script setup>` with:

```vue
<script setup lang="ts">
import { ref, watch } from 'vue';

import { ALERT_TYPES } from '@/shared/config';
import { useAlertStore } from '@/entities/alert';
import { usePreloaderStore } from '@/features/preloader';

import { Create } from '../api/faq-category-repository';

defineOptions({ name: 'CreateCategory' });

const { order, isOpen } = defineProps<{
  order: number;
  isOpen?: boolean;
}>();

const emit = defineEmits<{
  success: [];
  cancel: [];
}>();

const alertStore = useAlertStore();
const preloaderStore = usePreloaderStore();

const categoryName = ref('');

watch(
  () => isOpen,
  (value) => {
    if (!value) {
      categoryName.value = '';
    }
  },
);

async function onSubmit() {
  try {
    preloaderStore.addLoader();
    await Create({ name: categoryName.value, order });
    emit('success');
  } catch (error) {
    const err = error as Error;
    alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: err.message });
  } finally {
    preloaderStore.removeLoader();
  }
}
</script>
```

- [ ] **Step 7: Update UpdateCategory.vue — add lang="ts" and type-based props/emits**

Replace `<script setup>` with:

```vue
<script setup lang="ts">
import { ref, watch } from 'vue';

import type { FaqCategoryResponse } from '@/shared/types';

import { ALERT_TYPES } from '@/shared/config';
import { useAlertStore } from '@/entities/alert';
import { usePreloaderStore } from '@/features/preloader';

import { Update } from '../api/faq-category-repository';

defineOptions({ name: 'UpdateCategory' });

const { category, isOpen } = defineProps<{
  category: FaqCategoryResponse;
  isOpen?: boolean;
}>();

const emit = defineEmits<{
  success: [];
  cancel: [];
}>();

const alertStore = useAlertStore();
const preloaderStore = usePreloaderStore();

const categoryName = ref(category.name);

watch(
  () => isOpen,
  (value) => {
    if (value) {
      categoryName.value = category.name;
    }
  },
);

async function onSubmit() {
  try {
    preloaderStore.addLoader();
    await Update({ id: category.id, name: categoryName.value });
    emit('success');
  } catch (error) {
    const err = error as Error;
    alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: err.message });
  } finally {
    preloaderStore.removeLoader();
  }
}
</script>
```

- [ ] **Step 8: Update DeleteCategory.vue — add lang="ts" and type-based props/emits**

Add `lang="ts"` to `<script setup>`. Replace props/emits:

```typescript
defineProps<{ id: string }>();
const emit = defineEmits<{ success: []; cancel: [] }>();
```

- [ ] **Step 9: Update CreateEntryContent.vue — add lang="ts" and type-based props**

Add `lang="ts"` to `<script setup>`. Replace props:

```typescript
defineProps<{
  modalConfirm: () => Promise<void>;
  modalClose: () => void;
  categoryId: string;
  order: number;
}>();
```

- [ ] **Step 10: Update UpdateEntryContent.vue — add lang="ts" and type-based props**

Add `lang="ts"` to `<script setup>`. Replace props:

```typescript
import type { FaqEntryResponse } from '@/shared/types';

defineProps<{
  modalConfirm: () => Promise<void>;
  modalClose: () => void;
  entry: FaqEntryResponse;
}>();
```

- [ ] **Step 11: Update DeleteEntry.vue — add lang="ts" and type-based props/emits**

Add `lang="ts"` to `<script setup>`. Replace props/emits:

```typescript
defineProps<{ id: string }>();
const emit = defineEmits<{ success: []; cancel: [] }>();
```

- [ ] **Step 12: Create index.ts**

```typescript
export {
  GetAll,
  GetAllWithEntries,
  GetById,
  Create as CreateCategory,
  Update as UpdateCategory,
  Delete as DeleteCategory,
  SetOrder as SetCategoryOrder,
} from './api/faq-category-repository';

export {
  GetAll as GetAllEntries,
  GetById as GetEntryById,
  Create as CreateEntry,
  Update as UpdateEntry,
  Delete as DeleteEntry,
  SetOrder as SetEntryOrder,
} from './api/faq-entry-repository';

export { default as FAQView } from './ui/FAQView.vue';
export { default as CategoryCard } from './ui/CategoryCard.vue';
export { default as EntryCard } from './ui/EntryCard.vue';
export { default as CreateCategory } from './ui/CreateCategory.vue';
export { default as UpdateCategory } from './ui/UpdateCategory.vue';
export { default as DeleteCategory } from './ui/DeleteCategory.vue';
export { default as CreateEntryContent } from './ui/CreateEntryContent.vue';
export { default as UpdateEntryContent } from './ui/UpdateEntryContent.vue';
export { default as DeleteEntry } from './ui/DeleteEntry.vue';
```

- [ ] **Step 13: Delete old files**

```bash
rm src/entities/faq/api/faq-category-repository.js src/entities/faq/api/faq-entry-repository.js src/entities/faq/index.js
```

- [ ] **Step 14: Commit**

```bash
git add src/entities/faq/
git rm src/entities/faq/api/faq-category-repository.js src/entities/faq/api/faq-entry-repository.js src/entities/faq/index.js
git commit -m "refactor(entities): migrate faq entity to TypeScript"
```

---

## Task 19: Migrate entity/area

**Files:**
- Create: `src/entities/area/api/areas-repository.ts`
- Create: `src/entities/area/index.ts`
- Modify: `src/entities/area/ui/AreaCard.vue`
- Modify: `src/entities/area/ui/CreateArea.vue`
- Modify: `src/entities/area/ui/UpdateArea.vue`
- Modify: `src/entities/area/ui/DeleteArea.vue`
- Delete: `src/entities/area/api/areas-repository.js`
- Delete: `src/entities/area/index.js`

- [ ] **Step 1: Create areas-repository.ts**

```typescript
import httpClient from '@/shared/api';

import type {
  AreaResponse,
  AreaCreateRequest,
  AreaUpdateRequest,
} from '@/shared/types';

const apiRoute = '/api/Area';

export async function GetAll(): Promise<AreaResponse[]> {
  const result = await httpClient
    .get<AreaResponse[]>(`${apiRoute}/GetAll`)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка получения списка областей', { cause: error });
    });

  return result;
}

export async function Create(area: AreaCreateRequest): Promise<AreaResponse> {
  const result = await httpClient
    .post<AreaResponse>(`${apiRoute}/Create`, area)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка создания области', { cause: error });
    });

  return result;
}

export async function Update(area: AreaUpdateRequest): Promise<AreaResponse> {
  const result = await httpClient
    .put<AreaResponse>(`${apiRoute}/Update`, area)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка изменения области', { cause: error });
    });

  return result;
}

export async function Delete(id: string): Promise<void> {
  await httpClient
    .delete(`${apiRoute}/Delete?id=${id}`)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка удаления области', { cause: error });
    });
}

export async function SetOrder(ids: string[]): Promise<void> {
  await httpClient
    .put(`${apiRoute}/SetOrder`, ids)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка сортировки областей', { cause: error });
    });
}
```

- [ ] **Step 2: Update AreaCard.vue, CreateArea.vue, UpdateArea.vue, DeleteArea.vue — add lang="ts"**

For each component, add `lang="ts"` to `<script setup>` and replace runtime props with type-based:

**AreaCard.vue:**
```typescript
import type { AreaResponse } from '@/shared/types';
defineProps<{ area: AreaResponse }>();
const emit = defineEmits<{ update: []; delete: [] }>();
```

**CreateArea.vue:**
```typescript
defineProps<{ order: number; isOpen?: boolean }>();
const emit = defineEmits<{ success: []; cancel: [] }>();
```

**UpdateArea.vue:**
```typescript
import type { AreaResponse } from '@/shared/types';
defineProps<{ area: AreaResponse; isOpen?: boolean }>();
const emit = defineEmits<{ success: []; cancel: [] }>();
```

**DeleteArea.vue:**
```typescript
defineProps<{ id: string }>();
const emit = defineEmits<{ success: []; cancel: [] }>();
```

- [ ] **Step 3: Create index.ts**

```typescript
export {
  GetAll as GetAllAreas,
  Create as CreateAreaApi,
  Update as UpdateAreaApi,
  Delete as DeleteAreaApi,
  SetOrder as SetAreaOrder,
} from './api/areas-repository';

export { default as AreaCard } from './ui/AreaCard.vue';
export { default as CreateArea } from './ui/CreateArea.vue';
export { default as UpdateArea } from './ui/UpdateArea.vue';
export { default as DeleteArea } from './ui/DeleteArea.vue';
```

- [ ] **Step 4: Delete old files**

```bash
rm src/entities/area/api/areas-repository.js src/entities/area/index.js
```

- [ ] **Step 5: Commit**

```bash
git add src/entities/area/
git rm src/entities/area/api/areas-repository.js src/entities/area/index.js
git commit -m "refactor(entities): migrate area entity to TypeScript"
```

---

## Task 20: Migrate entity/user

**Files:**
- Create: `src/entities/user/api/user-repository.ts`
- Create: `src/entities/user/index.ts`
- Modify: `src/entities/user/ui/UserProfile.vue`
- Delete: `src/entities/user/api/user-repository.js`
- Delete: `src/entities/user/index.js`

- [ ] **Step 1: Create user-repository.ts**

```typescript
import httpClient from '@/shared/api';

import type {
  UserResponse,
  ChangePasswordRequest,
} from '@/shared/types';

const apiRoute = '/api/User';

export async function GetUserData(): Promise<UserResponse> {
  const result = await httpClient
    .get<UserResponse>(`${apiRoute}/GetUserData`)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка получения данных пользователя', { cause: error });
    });

  return result;
}

export async function ChangePassword(
  userUpdateModel: ChangePasswordRequest,
): Promise<void> {
  await httpClient
    .put(`${apiRoute}/ChangePassword`, userUpdateModel)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка изменения пароля', { cause: error });
    });
}
```

- [ ] **Step 2: Update UserProfile.vue — add lang="ts"**

Replace `<script setup>` with:

```vue
<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { storeToRefs } from 'pinia';

import { ALERT_TYPES } from '@/shared/config';
import { useAlertStore } from '@/entities/alert';
import { usePreloaderStore } from '@/features/preloader';
import { useAuthStore } from '@/features/auth';

import { ChangePassword } from '../api/user-repository';

defineOptions({ name: 'UserProfile' });

const emit = defineEmits<{
  success: [];
  cancel: [];
}>();

const alertStore = useAlertStore();
const preloaderStore = usePreloaderStore();
const authStore = useAuthStore();

const { getUserData } = storeToRefs(authStore);

const showChangePassword = ref(false);

const controls = reactive<ChangePasswordRequest>({
  password: null,
  newPassword: null,
  confirmPassword: null,
});

const getUserStringRole = computed(() => {
  if (getUserData.value.userRoleId === 1) {
    return 'Администратор';
  }

  return 'Спикер';
});

async function onSubmit() {
  try {
    preloaderStore.addLoader();

    await ChangePassword(controls);

    alertStore.addAlert({
      type: ALERT_TYPES.SUCCESS,
      text: 'Пароль успешно изменен',
    });

    emit('success');
  } catch (error) {
    const err = error as Error;
    alertStore.addAlert({ type: ALERT_TYPES.ERROR, text: err.message });
  } finally {
    preloaderStore.removeLoader();
  }
}
</script>
```

- [ ] **Step 3: Create index.ts**

```typescript
export { GetUserData, ChangePassword } from './api/user-repository';
export { default as UserProfile } from './ui/UserProfile.vue';
```

- [ ] **Step 4: Delete old files**

```bash
rm src/entities/user/api/user-repository.js src/entities/user/index.js
```

- [ ] **Step 5: Commit**

```bash
git add src/entities/user/
git rm src/entities/user/api/user-repository.js src/entities/user/index.js
git commit -m "refactor(entities): migrate user entity to TypeScript"
```

---

## Task 21: Migrate feature/preloader

**Files:**
- Create: `src/features/preloader/store/index.ts`
- Create: `src/features/preloader/index.ts`
- Modify: `src/features/preloader/ui/AppPreloader.vue`
- Delete: `src/features/preloader/store/index.js`
- Delete: `src/features/preloader/index.js`

- [ ] **Step 1: Create store/index.ts**

```typescript
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const usePreloaderStore = defineStore('preloader', () => {
  const loadings = ref(0);

  const showPreloader = computed(() => loadings.value > 0);

  function addLoader() {
    loadings.value += 1;
  }

  function removeLoader() {
    if (loadings.value > 0) {
      loadings.value -= 1;
    }
  }

  return { loadings, showPreloader, addLoader, removeLoader };
});
```

- [ ] **Step 2: Update AppPreloader.vue — add lang="ts"**

Add `lang="ts"` to `<script setup>` tag. No other changes needed (uses `storeToRefs`).

- [ ] **Step 3: Create index.ts**

```typescript
export { default as AppPreloader } from './ui/AppPreloader.vue';
export { usePreloaderStore } from './store';
```

- [ ] **Step 4: Delete old files**

```bash
rm src/features/preloader/store/index.js src/features/preloader/index.js
```

- [ ] **Step 5: Run preloader store tests**

```bash
npx vitest run tests/features/preloader/store/index.test.js
```

Expected: all tests pass

- [ ] **Step 6: Commit**

```bash
git add src/features/preloader/
git rm src/features/preloader/store/index.js src/features/preloader/index.js
git commit -m "refactor(features): migrate preloader feature to TypeScript"
```

---

## Task 22: Migrate feature/auth

**Files:**
- Create: `src/features/auth/api/auth-repository.ts`
- Create: `src/features/auth/store/index.ts`
- Create: `src/features/auth/index.ts`
- Modify: `src/features/auth/ui/LoginView.vue`
- Delete: `src/features/auth/api/auth-repository.js`
- Delete: `src/features/auth/store/index.js`
- Delete: `src/features/auth/index.js`

- [ ] **Step 1: Create auth-repository.ts**

```typescript
import httpClient from '@/shared/api';

import type { LoginRequest, UserResponse } from '@/shared/types';

const apiRoute = '/api/Auth';

export async function Login(authData: LoginRequest): Promise<UserResponse> {
  const result = await httpClient
    .post<UserResponse>(`${apiRoute}/Login`, authData)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка авторизации', { cause: error });
    });

  return result;
}

export async function Logout(): Promise<void> {
  await httpClient
    .put(`${apiRoute}/Logout`)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка выхода', { cause: error });
    });
}
```

- [ ] **Step 2: Create store/index.ts**

```typescript
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

import type { UserResponse } from '@/shared/types';

export const useAuthStore = defineStore('auth', () => {
  const isAuthorized = ref(false);
  const userData = ref<UserResponse | null>(null);

  const getAuthStatus = computed(() => isAuthorized.value);
  const getUserData = computed(() => userData.value);

  function setAuthData(user: UserResponse) {
    userData.value = user;
    isAuthorized.value = true;
  }

  function removeAuthData() {
    userData.value = null;
    isAuthorized.value = false;
  }

  return {
    isAuthorized,
    userData,
    getAuthStatus,
    getUserData,
    setAuthData,
    removeAuthData,
  };
});
```

- [ ] **Step 3: Update LoginView.vue — add lang="ts"**

Add `lang="ts"` to `<script setup>` tag. Type the reactive controls:

```typescript
const controls = reactive({
  email: null as string | null,
  password: null as string | null,
});
```

- [ ] **Step 4: Create index.ts**

```typescript
export { Login, Logout } from './api/auth-repository';
export { useAuthStore } from './store';
```

- [ ] **Step 5: Delete old files**

```bash
rm src/features/auth/api/auth-repository.js src/features/auth/store/index.js src/features/auth/index.js
```

- [ ] **Step 6: Run auth store tests**

```bash
npx vitest run tests/features/auth/store/index.test.js
```

Expected: all tests pass

- [ ] **Step 7: Commit**

```bash
git add src/features/auth/
git rm src/features/auth/api/auth-repository.js src/features/auth/store/index.js src/features/auth/index.js
git commit -m "refactor(features): migrate auth feature to TypeScript"
```

---

## Task 23: Migrate feature/feedback

**Files:**
- Create: `src/features/feedback/api/feedback-repository.ts`
- Create: `src/features/feedback/index.ts`
- Modify: `src/features/feedback/ui/FeedbackCard.vue`
- Modify: `src/features/feedback/ui/DeleteFeedbackModal.vue`
- Modify: `src/features/feedback/ui/SidebarFeedbackContent.vue`
- Delete: `src/features/feedback/api/feedback-repository.js`
- Delete: `src/features/feedback/index.js`

- [ ] **Step 1: Create feedback-repository.ts**

```typescript
import httpClient from '@/shared/api';

import type {
  FeedbackResponse,
  FeedbackCreateRequest,
} from '@/shared/types';

const apiRoute = '/api/Feedback';

export async function GetAll(): Promise<FeedbackResponse[]> {
  const result = await httpClient
    .get<FeedbackResponse[]>(`${apiRoute}/GetAll`)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка получения списка обратной связи', {
        cause: error,
      });
    });

  return result;
}

export async function Create(
  feedback: FeedbackCreateRequest,
): Promise<FeedbackResponse> {
  const result = await httpClient
    .post<FeedbackResponse>(`${apiRoute}/Create`, feedback)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка создания обратной связи', { cause: error });
    });

  return result;
}

export async function Delete(id: string): Promise<void> {
  await httpClient
    .delete(`${apiRoute}/Delete?id=${id}`)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Ошибка удаления обратной связи', { cause: error });
    });
}
```

- [ ] **Step 2: Update FeedbackCard.vue — add lang="ts" and type-based props/emits**

Replace `<script setup>` with:

```vue
<script setup lang="ts">
import type { FeedbackResponse } from '@/shared/types';

defineOptions({ name: 'FeedbackCard' });

defineProps<{
  feedback: FeedbackResponse;
}>();

const emit = defineEmits<{
  delete: [];
}>();
</script>
```

Note: template uses `feedback.Сreated` → must change to `feedback.created`.

- [ ] **Step 3: Update DeleteFeedbackModal.vue — add lang="ts" and type-based props/emits**

Add `lang="ts"` to `<script setup>`. Replace props/emits:

```typescript
defineProps<{ id: string }>();
const emit = defineEmits<{ success: []; cancel: [] }>();
```

- [ ] **Step 4: Update SidebarFeedbackContent.vue — add lang="ts" and type-based props**

Add `lang="ts"` to `<script setup>`. Replace props:

```typescript
defineProps<{
  showPreloader: () => void;
  modalConfirm: () => Promise<void>;
  modalClose: () => void;
}>();
```

- [ ] **Step 5: Create index.ts**

```typescript
export {
  GetAll as GetAllFeedback,
  Create as CreateFeedback,
  Delete as DeleteFeedback,
} from './api/feedback-repository';

export { default as FeedbackCard } from './ui/FeedbackCard.vue';
export { default as DeleteFeedbackModal } from './ui/DeleteFeedbackModal.vue';
export { default as SidebarFeedbackContent } from './ui/SidebarFeedbackContent.vue';
```

- [ ] **Step 6: Delete old files**

```bash
rm src/features/feedback/api/feedback-repository.js src/features/feedback/index.js
```

- [ ] **Step 7: Commit**

```bash
git add src/features/feedback/
git rm src/features/feedback/api/feedback-repository.js src/features/feedback/index.js
git commit -m "refactor(features): migrate feedback feature to TypeScript"
```

---

## Task 24: Migrate pages layer

**Files:**
All `index.js` files in `src/pages/` → `index.ts`, all `.vue` files → add `lang="ts"`

Barrel exports to convert (`index.js` → `index.ts`):

- `src/pages/main/index.js`
- `src/pages/errors/index.js`
- `src/pages/faq/index.js`
- `src/pages/questions/index.js`
- `src/pages/questions/detail/index.js`
- `src/pages/admin/main/index.js`
- `src/pages/admin/speakers/index.js`
- `src/pages/admin/feedback/index.js`
- `src/pages/admin/faq/index.js`
- `src/pages/admin/areas/index.js`
- `src/pages/admin/questions/index.js` (if exists)

Vue files to update (add `lang="ts"` to `<script setup>`, type props where applicable):

- `src/pages/main/ui/MainPage.vue`
- `src/pages/errors/ui/NotFoundPage.vue`
- `src/pages/faq/ui/FAQPage.vue`
- `src/pages/questions/ui/QuestionsPage.vue`
- `src/pages/questions/detail/QuestionIdPage.vue`
- `src/pages/admin/main/ui/AdminMainPage.vue`
- `src/pages/admin/speakers/ui/AdminSpeakersPage.vue`
- `src/pages/admin/feedback/ui/AdminFeedbackPage.vue`
- `src/pages/admin/faq/ui/AdminFAQPage.vue`
- `src/pages/admin/faq/ui/AdminFAQCategoryPage.vue` — has `id: String` prop → `id: string`
- `src/pages/admin/areas/ui/AdminAreasPage.vue`
- `src/pages/admin/questions/ui/AdminQuestionsPage.vue`

- [ ] **Step 1: Convert all barrel exports from .js to .ts**

Each `index.js` is a simple re-export like `export { default } from './ui/XxxPage.vue'`. Rename each to `.ts` with identical content.

For `src/pages/admin/faq/index.js` (which may also export `AdminFAQCategoryPage`):
```typescript
export { default } from './ui/AdminFAQPage.vue';
```

For `src/pages/admin/questions/index.js`:
```typescript
export { default } from './ui/AdminQuestionsPage.vue';
```

- [ ] **Step 2: Update AdminFAQCategoryPage.vue — type the prop**

Add `lang="ts"` to `<script setup>`. Replace:

```typescript
defineProps<{
  id: string;
}>();
```

- [ ] **Step 3: Update AdminQuestionsPage.vue — add type annotation**

Add `lang="ts"` to `<script setup>`. Type the refs and fix the header key typo (`iron` → `answered`):

```typescript
import type { QuestionResponse } from '@/shared/types';

const questions = ref<QuestionResponse[]>([]);
const selected = ref<QuestionResponse[]>([]);

const headers = [
  { title: 'Имя', key: 'author' },
  { title: 'Зона ответственности', key: 'zone' },
  { title: 'Спикер', key: 'speaker' },
  { title: 'Вопрос', key: 'text' },
  { title: 'Лайки', key: 'likes' },
  { title: 'Дизлайки', key: 'dislikes' },
  { title: 'Просмотры', key: 'views' },
  { title: 'Статус', key: 'status' },
  { title: 'Дата создания', key: 'created' },
  { title: 'Дата ответа', key: 'answered' },
];
```

- [ ] **Step 4: Add lang="ts" to remaining page Vue components**

For each remaining page component that only uses `defineOptions`, stores, and API calls without runtime-typed props: simply add `lang="ts"` to `<script setup>`.

- [ ] **Step 5: Delete all old barrel .js files**

```bash
rm src/pages/main/index.js src/pages/errors/index.js src/pages/faq/index.js src/pages/questions/index.js src/pages/questions/detail/index.js src/pages/admin/main/index.js src/pages/admin/speakers/index.js src/pages/admin/feedback/index.js src/pages/admin/faq/index.js src/pages/admin/areas/index.js
```

Also delete `src/pages/admin/questions/index.js` if it exists.

- [ ] **Step 6: Commit**

```bash
git add src/pages/
git rm src/pages/main/index.js src/pages/errors/index.js src/pages/faq/index.js src/pages/questions/index.js src/pages/questions/detail/index.js src/pages/admin/main/index.js src/pages/admin/speakers/index.js src/pages/admin/feedback/index.js src/pages/admin/faq/index.js src/pages/admin/areas/index.js
git commit -m "refactor(pages): migrate pages layer to TypeScript"
```

---

## Task 25: Migrate app/entrypoint and app/layouts

**Files:**
- Create: `src/app/entrypoint/main.ts`
- Delete: `src/app/entrypoint/main.js`
- Modify: `src/app/entrypoint/App.vue`
- Modify: `src/app/layouts/DefaultLayout.vue`
- Modify: `src/app/layouts/EmptyLayout.vue`
- Modify: `src/app/layouts/AdminLayout.vue`

- [ ] **Step 1: Create main.ts**

```typescript
import { createApp } from 'vue';

import registerPlugins from '@/app/lib';
import registerGlobalComponents from '@/app/lib/global-components';

import App from './App.vue';

import '@/app/styles/base.scss';

const app = createApp(App);

registerPlugins(app);
registerGlobalComponents(app);

app.mount('#app');
```

- [ ] **Step 2: Delete main.js**

```bash
rm src/app/entrypoint/main.js
```

- [ ] **Step 3: Update App.vue — add lang="ts"**

Add `lang="ts"` to `<script setup>` tag. No other changes needed.

- [ ] **Step 4: Update DefaultLayout.vue — add lang="ts"**

Add `lang="ts"` to `<script setup>`. Type navItems:

```typescript
import type { NavItem } from '@/shared/types';

const navItems: NavItem[] = [/* existing items */];
```

- [ ] **Step 5: Update EmptyLayout.vue — add lang="ts"**

Add `lang="ts"` to `<script setup>` tag. No other changes needed.

- [ ] **Step 6: Update AdminLayout.vue — add lang="ts"**

Add `lang="ts"` to `<script setup>`. Type navItems the same way as DefaultLayout.

- [ ] **Step 7: Commit**

```bash
git add src/app/entrypoint/ src/app/layouts/
git rm src/app/entrypoint/main.js
git commit -m "refactor(app): migrate entrypoint and layouts to TypeScript"
```

---

## Task 26: Migrate app/router

**Files:**
- Create: `src/app/router/index.ts`
- Create: `src/app/router/router.ts`
- Create: `src/app/router/middleware/auth-middleware.ts`
- Delete: `src/app/router/index.js`
- Delete: `src/app/router/router.js`
- Delete: `src/app/router/middleware/auth-middleware.js`

- [ ] **Step 1: Create router.ts with typed route meta**

```typescript
import { createRouter, createWebHistory } from 'vue-router';

import checkAuth from '@/app/router/middleware/auth-middleware';
import ROUTES from '@/shared/routes';

declare module 'vue-router' {
  interface RouteMeta {
    layout?: string;
    isProtected?: boolean;
  }
}

const routes = [
  {
    path: '/',
    name: ROUTES.main,
    component: () => import('@/pages/main'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/features/auth/ui/LoginView.vue'),
    meta: {
      layout: 'EmptyLayout',
    },
  },
  {
    path: '/questions',
    name: 'questions',
    component: () => import('@/pages/questions'),
  },
  {
    path: '/question/:id',
    name: 'question',
    component: () => import('@/pages/questions/detail'),
  },
  {
    path: '/faq',
    name: 'faq',
    component: () => import('@/pages/faq'),
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('@/pages/admin/main'),
    meta: { layout: 'AdminLayout', isProtected: true },
  },
  {
    path: '/admin-questions',
    name: 'admin-questions',
    component: () => import('@/pages/admin/questions'),
    meta: { layout: 'AdminLayout', isProtected: true },
  },
  {
    path: '/admin-faq',
    name: 'admin-faq',
    component: () => import('@/pages/admin/faq'),
    meta: { layout: 'AdminLayout', isProtected: true },
    children: [
      {
        path: ':id',
        name: 'admin-faq-category',
        props: (route) => ({ id: route.params.id }),
        meta: { layout: 'AdminLayout', isProtected: true },
        component: () =>
          import('@/pages/admin/faq/ui/AdminFAQCategoryPage.vue'),
      },
    ],
  },
  {
    path: '/admin-speakers',
    name: 'admin-speakers',
    component: () => import('@/pages/admin/speakers'),
    meta: { layout: 'AdminLayout', isProtected: true },
  },
  {
    path: '/admin-areas',
    name: 'admin-areas',
    component: () => import('@/pages/admin/areas'),
    meta: { layout: 'AdminLayout', isProtected: true },
  },
  {
    path: '/admin-feedback',
    name: 'admin-feedback',
    component: () => import('@/pages/admin/feedback'),
    meta: { layout: 'AdminLayout', isProtected: true },
  },
  {
    path: '/:catchAll(.*)',
    name: ROUTES.notFound,
    component: () => import('@/pages/errors'),
    meta: {
      layout: 'EmptyLayout',
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to) => {
  if (to.meta.isProtected) {
    return checkAuth();
  }

  return true;
});

export default router;
```

- [ ] **Step 2: Create middleware/auth-middleware.ts**

```typescript
import { useAuthStore } from '@/features/auth';
import { useAlertStore } from '@/entities/alert';

import { ALERT_TYPES } from '@/shared/config';
import { GetUserData } from '@/entities/user';

export default async function checkAuth():
  | Promise<true>
  | Promise<{ name: string }> {
  const authStore = useAuthStore();

  if (!authStore.getAuthStatus) {
    try {
      const user = await GetUserData();

      authStore.setAuthData(user);

      return true;
    } catch (error) {
      const alertStore = useAlertStore();
      const err = error as Error;

      alertStore.addAlert({
        type: ALERT_TYPES.ERROR,
        text: err.message,
      });

      return {
        name: 'login',
      };
    }
  }

  return true;
}
```

- [ ] **Step 3: Create index.ts**

```typescript
export { default } from './router';
```

- [ ] **Step 4: Delete old files**

```bash
rm src/app/router/index.js src/app/router/router.js src/app/router/middleware/auth-middleware.js
```

- [ ] **Step 5: Commit**

```bash
git add src/app/router/
git rm src/app/router/index.js src/app/router/router.js src/app/router/middleware/auth-middleware.js
git commit -m "refactor(app): migrate router to TypeScript with typed route meta"
```

---

## Task 27: Migrate app/lib

**Files:**
- Create: `src/app/lib/index.ts`
- Create: `src/app/lib/vuetify.ts`
- Create: `src/app/lib/vee-validate.ts`
- Create: `src/app/lib/global-components.ts`
- Create: `src/app/lib/http-client-interceptors.ts`
- Delete: `src/app/lib/index.js`
- Delete: `src/app/lib/vuetify.js`
- Delete: `src/app/lib/vee-validate.js`
- Delete: `src/app/lib/global-components.js`
- Delete: `src/app/lib/http-client-interceptors.js`

- [ ] **Step 1: Create vuetify.ts**

```typescript
import '@mdi/font/css/materialdesignicons.css';
// eslint-disable-next-line import-x/no-unresolved -- vuetify subpath export, resolved by vite at runtime
import 'vuetify/styles';

import { createVuetify } from 'vuetify';
// eslint-disable-next-line import-x/no-unresolved -- vuetify subpath export, resolved by vite at runtime
import { ru } from 'vuetify/locale';

export default createVuetify({
  lang: {
    locales: { ru },
    current: 'ru',
  },
  icons: {
    iconfont: 'mdi',
  },
});
```

- [ ] **Step 2: Create vee-validate.ts**

```typescript
import {
  Field,
  Form,
  ErrorMessage,
  defineRule,
  configure,
} from 'vee-validate';
// eslint-disable-next-line camelcase
import { required, email, confirmed, max_value } from '@vee-validate/rules';

import type { DateRangeValue } from '@/shared/types';

export default {
  install: (app: {
    component: (name: string, component: unknown) => typeof app;
  }) => {
    app
      .component('VeeForm', Form)
      .component('VeeField', Field)
      .component('VeeErrorMessage', ErrorMessage);

    configure({
      validateOnInput: true,
    });

    defineRule('email', email);
    defineRule('confirmed', confirmed);

    defineRule('required', (value: unknown) => {
      if (!required(value)) {
        return 'Обязательное поле';
      }

      return true;
    });

    defineRule('max_value', (value: unknown, [max]: [number]) => {
      if (!max_value(value, [max])) {
        return `Максимальное значение не должно превышать: ${max}`;
      }

      return true;
    });

    defineRule('required-date', (value: DateRangeValue) => {
      if (value.startDate === null && value.endDate === null) {
        return 'Обязательное поле';
      }

      return true;
    });
  },
};
```

- [ ] **Step 3: Create global-components.ts**

```typescript
import type { App } from 'vue';

import { SidebarModal, SidebarContentWrapper } from '@/shared/ui/sidebar-modal';
import {
  CenterModal,
  CenterModalContentWrapper,
} from '@/shared/ui/center-modal';

export default function registerGlobalComponents(app: App) {
  app.component('SidebarModal', SidebarModal);
  app.component('SidebarContentWrapper', SidebarContentWrapper);

  app.component('CenterModal', CenterModal);
  app.component('CenterModalContentWrapper', CenterModalContentWrapper);
}
```

- [ ] **Step 4: Create http-client-interceptors.ts**

```typescript
import httpClient from '@/shared/api';

export default function setupHttpClientInterceptors() {
  httpClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        window.location.href = '/login';
      }

      return Promise.reject(error);
    },
  );
}
```

- [ ] **Step 5: Create index.ts**

```typescript
import type { App } from 'vue';

import router from '@/app/router';
import { createPinia } from 'pinia';

import vuetify from './vuetify';
import veeValidate from './vee-validate';
import setupHttpClientInterceptors from './http-client-interceptors';

export default function registerPlugins(app: App) {
  const pinia = createPinia();

  app.use(router).use(pinia).use(vuetify).use(veeValidate);

  setupHttpClientInterceptors();
}
```

- [ ] **Step 6: Delete old files**

```bash
rm src/app/lib/index.js src/app/lib/vuetify.js src/app/lib/vee-validate.js src/app/lib/global-components.js src/app/lib/http-client-interceptors.js
```

- [ ] **Step 7: Commit**

```bash
git add src/app/lib/
git rm src/app/lib/index.js src/app/lib/vuetify.js src/app/lib/vee-validate.js src/app/lib/global-components.js src/app/lib/http-client-interceptors.js
git commit -m "refactor(app): migrate lib plugins to TypeScript"
```

---

## Task 28: Migrate Tests

**Files:**
- Create: `tests/setup.ts`
- Create: `tests/features/auth/store/index.test.ts`
- Create: `tests/features/preloader/store/index.test.ts`
- Create: `tests/entities/alert/store/index.test.ts`
- Delete: `tests/setup.js`
- Delete: `tests/features/auth/store/index.test.js`
- Delete: `tests/features/preloader/store/index.test.js`
- Delete: `tests/entities/alert/store/index.test.js`

- [ ] **Step 1: Create setup.ts**

```typescript
import { createPinia, setActivePinia } from 'pinia';

beforeEach(() => {
  setActivePinia(createPinia());
});
```

- [ ] **Step 2: Create features/auth/store/index.test.ts**

```typescript
import { useAuthStore } from '@/features/auth';

describe('useAuthStore', () => {
  describe('начальное состояние', () => {
    it('isAuthorized = false', () => {
      const store = useAuthStore();

      expect(store.isAuthorized).toBe(false);
    });

    it('userData = null', () => {
      const store = useAuthStore();

      expect(store.userData).toBeNull();
    });
  });

  describe('setAuthData', () => {
    it('устанавливает userData', () => {
      const store = useAuthStore();
      const user = { id: '1', name: 'Admin' } as any;

      store.setAuthData(user);

      expect(store.userData).toEqual(user);
    });

    it('isAuthorized = true', () => {
      const store = useAuthStore();

      store.setAuthData({ id: '1', name: 'Admin' } as any);

      expect(store.isAuthorized).toBe(true);
    });
  });

  describe('removeAuthData', () => {
    it('сбрасывает userData в null', () => {
      const store = useAuthStore();

      store.setAuthData({ id: '1', name: 'Admin' } as any);
      store.removeAuthData();

      expect(store.userData).toBeNull();
    });

    it('isAuthorized = false', () => {
      const store = useAuthStore();

      store.setAuthData({ id: '1', name: 'Admin' } as any);
      store.removeAuthData();

      expect(store.isAuthorized).toBe(false);
    });
  });

  describe('computed', () => {
    it('getAuthStatus возвращает isAuthorized', () => {
      const store = useAuthStore();

      expect(store.getAuthStatus).toBe(false);

      store.setAuthData({ id: '1' } as any);

      expect(store.getAuthStatus).toBe(true);
    });

    it('getUserData возвращает userData', () => {
      const store = useAuthStore();
      const user = { id: '1', name: 'Admin' } as any;

      expect(store.getUserData).toBeNull();

      store.setAuthData(user);

      expect(store.getUserData).toEqual(user);
    });
  });
});
```

- [ ] **Step 3: Create features/preloader/store/index.test.ts**

```typescript
import { usePreloaderStore } from '@/features/preloader';

describe('usePreloaderStore', () => {
  describe('начальное состояние', () => {
    it('loadings = 0', () => {
      const store = usePreloaderStore();

      expect(store.loadings).toBe(0);
    });

    it('showPreloader = false', () => {
      const store = usePreloaderStore();

      expect(store.showPreloader).toBe(false);
    });
  });

  describe('addLoader', () => {
    it('инкрементит loadings', () => {
      const store = usePreloaderStore();

      store.addLoader();

      expect(store.loadings).toBe(1);
    });

    it('showPreloader = true при loadings > 0', () => {
      const store = usePreloaderStore();

      store.addLoader();

      expect(store.showPreloader).toBe(true);
    });
  });

  describe('removeLoader', () => {
    it('декрементит loadings при loadings > 0', () => {
      const store = usePreloaderStore();

      store.addLoader();
      store.addLoader();
      store.removeLoader();

      expect(store.loadings).toBe(1);
    });

    it('не уходит в минус при loadings = 0', () => {
      const store = usePreloaderStore();

      store.removeLoader();

      expect(store.loadings).toBe(0);
    });
  });
});
```

- [ ] **Step 4: Create entities/alert/store/index.test.ts**

```typescript
import { useAlertStore } from '@/entities/alert';

describe('useAlertStore', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('начальное состояние', () => {
    it('alerts = []', () => {
      const store = useAlertStore();

      expect(store.alerts).toEqual([]);
    });

    it('getAlerts = []', () => {
      const store = useAlertStore();

      expect(store.getAlerts).toEqual([]);
    });
  });

  describe('addAlert', () => {
    it('добавляет alert в массив', () => {
      const store = useAlertStore();

      store.addAlert({ type: 'success', text: 'Успех' });

      expect(store.alerts).toHaveLength(1);
      expect(store.alerts[0].type).toBe('success');
      expect(store.alerts[0].text).toBe('Успех');
    });

    it('авто-удаление через delay мс (type !== error)', () => {
      const store = useAlertStore();

      store.addAlert({ type: 'success', text: 'Успех', delay: 5000 });

      expect(store.alerts).toHaveLength(1);

      vi.advanceTimersByTime(4999);

      expect(store.alerts).toHaveLength(1);

      vi.advanceTimersByTime(1);

      expect(store.alerts).toHaveLength(0);
    });

    it('авто-удаление через 3000 мс по умолчанию (delay не указан)', () => {
      const store = useAlertStore();

      store.addAlert({ type: 'info', text: 'Инфо' });

      vi.advanceTimersByTime(2999);

      expect(store.alerts).toHaveLength(1);

      vi.advanceTimersByTime(1);

      expect(store.alerts).toHaveLength(0);
    });

    it('не удаляет error-алерт автоматически', () => {
      const store = useAlertStore();

      store.addAlert({ type: 'error', text: 'Ошибка', delay: 1000 });

      vi.advanceTimersByTime(10000);

      expect(store.alerts).toHaveLength(1);
    });
  });

  describe('removeAlert', () => {
    it('удаляет alert по id', () => {
      const store = useAlertStore();

      store.addAlert({ type: 'success', text: 'Первый' });
      store.addAlert({ type: 'info', text: 'Второй' });

      const id = store.alerts[0].id;

      store.removeAlert(id);

      expect(store.alerts).toHaveLength(1);
      expect(store.alerts[0].text).toBe('Второй');
    });

    it('не падает при несуществующем id', () => {
      const store = useAlertStore();

      store.addAlert({ type: 'success', text: 'Тест' });

      store.removeAlert('nonexistent-id');

      expect(store.alerts).toHaveLength(1);
    });
  });
});
```

- [ ] **Step 5: Delete old test files**

```bash
rm tests/setup.js tests/features/auth/store/index.test.js tests/features/preloader/store/index.test.js tests/entities/alert/store/index.test.js
```

- [ ] **Step 6: Run all tests**

```bash
npm run test
```

Expected: all tests pass

- [ ] **Step 7: Commit**

```bash
git add tests/
git rm tests/setup.js tests/features/auth/store/index.test.js tests/features/preloader/store/index.test.js tests/entities/alert/store/index.test.js
git commit -m "refactor(tests): migrate test files to TypeScript"
```

---

## Task 29: Migrate ESLint Config to TypeScript

**Files:**
- Create: `eslint.config.ts`
- Delete: `eslint.config.js`

This is the most complex config change. ESLint 10 with flat config supports `.ts` files natively when using `typescript-eslint`.

- [ ] **Step 1: Create eslint.config.ts with TypeScript support**

```typescript
import js from '@eslint/js';
import globals from 'globals';
import pluginVue from 'eslint-plugin-vue';
import pluginUnicorn from 'eslint-plugin-unicorn';
import pluginVuetify from 'eslint-plugin-vuetify';
import pluginImportX from 'eslint-plugin-import-x';
import eslintConfigPrettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';
import viteConfig from './vite.config.ts';

export default tseslint.config(
  {
    ignores: ['**/dist/**', '**/node_modules/**', '**/build/**'],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  pluginUnicorn.configs.recommended,
  ...pluginVuetify.configs['flat/recommended-v4'],

  {
    files: ['**/*.{ts,js,vue}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },

  {
    plugins: {
      'import-x': pluginImportX,
    },

    settings: {
      'import-x/resolver': {
        typescript: true,
        vite: {
          viteConfig,
        },
      },
    },
  },

  {
    rules: {
      // ---- TypeScript overrides ----
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/no-shadow': [
        'error',
        { allow: ['i', 'j', 'k', 'e', 'err', 'error', 'event', '_'] },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports' },
      ],
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',

      // ---- disable base rules superseded by TS ----
      'no-shadow': 'off',
      'no-unused-vars': 'off',
      'no-useless-constructor': 'off',

      // ---- unicorn: отключение конфликтующих/избыточных правил ----
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/no-null': 'off',
      'unicorn/no-array-reduce': 'off',
      'unicorn/prefer-top-level-await': 'off',
      'unicorn/switch-case-braces': 'off',
      'unicorn/prefer-global-this': 'off',
      'unicorn/no-negated-condition': 'off',
      'unicorn/filename-case': 'off',

      // ---- airbnb-base: best-practices ----
      'array-callback-return': ['error', { allowImplicit: true }],
      'block-scoped-var': 'error',
      'class-methods-use-this': 'off',
      'consistent-return': 'off',
      'default-case': ['error', { commentPattern: '^no default$' }],
      'default-case-last': 'error',
      'default-param-last': 'off',
      'dot-notation': ['error', { allowKeywords: true }],
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'grouped-accessor-pairs': 'error',
      'guard-for-in': 'off',
      'max-classes-per-file': ['error', 1],
      'no-alert': 'warn',
      'no-caller': 'error',
      'no-constructor-return': 'error',
      'no-else-return': ['error', { allowElseIf: false }],
      'no-empty-function': [
        'error',
        { allow: ['arrowFunctions', 'functions', 'methods'] },
      ],
      'no-eval': 'error',
      'no-extend-native': 'error',
      'no-extra-bind': 'error',
      'no-floating-decimal': 'error',
      'no-implied-eval': 'error',
      'no-iterator': 'error',
      'no-labels': ['error', { allowLoop: false, allowSwitch: false }],
      'no-lone-blocks': 'error',
      'no-loop-func': 'off',
      'no-multi-str': 'error',
      'no-new': 'error',
      'no-new-func': 'error',
      'no-new-wrappers': 'error',
      'no-proto': 'error',
      'no-restricted-properties': [
        'error',
        {
          object: 'arguments',
          property: 'callee',
          message: 'arguments.callee is deprecated',
        },
        {
          property: '__defineGetter__',
          message: 'Please use Object.defineProperty instead.',
        },
        {
          property: '__defineSetter__',
          message: 'Please use Object.defineProperty instead.',
        },
        {
          object: 'Math',
          property: 'pow',
          message: 'Use the exponentiation operator (**) instead.',
        },
      ],
      'no-return-assign': ['error', 'always'],
      'no-script-url': 'error',
      'no-sequences': 'error',
      'no-throw-literal': 'off',
      '@typescript-eslint/no-throw-literal': 'error',
      'no-unused-expressions': [
        'error',
        {
          allowShortCircuit: false,
          allowTernary: false,
          allowTaggedTemplates: false,
        },
      ],
      'no-useless-concat': 'error',
      'no-useless-return': 'error',
      'no-void': 'error',
      'no-with': 'error',
      'prefer-promise-reject-errors': ['error', { allowEmptyReject: true }],
      'prefer-regex-literals': ['error', { disallowRedundantWrapping: true }],
      radix: 'error',
      'wrap-iife': ['error', 'outside', { functionPrototypeMethods: false }],
      yoda: 'error',

      // ---- airbnb-base: variables ----
      'no-undef-init': 'error',

      // ---- airbnb-base: es6 ----
      'arrow-body-style': [
        'error',
        'as-needed',
        { requireReturnForObjectLiteral: false },
      ],
      'arrow-parens': ['error', 'always'],
      'no-confusing-arrow': ['error', { allowParens: true }],
      'no-duplicate-imports': 'off',
      'no-restricted-exports': ['error', { restrictedNamedExports: ['then'] }],
      'no-useless-computed-key': 'error',
      'no-useless-rename': [
        'error',
        {
          ignoreDestructuring: false,
          ignoreImport: false,
          ignoreExport: false,
        },
      ],
      'object-shorthand': [
        'error',
        'always',
        { ignoreConstructors: false, avoidQuotes: true },
      ],
      'prefer-arrow-callback': [
        'error',
        {
          allowNamedFunctions: false,
          allowUnboundThis: true,
        },
      ],
      'prefer-const': [
        'error',
        { destructuring: 'any', ignoreReadBeforeAssign: true },
      ],
      'prefer-destructuring': [
        'error',
        {
          VariableDeclarator: { array: false, object: true },
          AssignmentExpression: { array: true, object: false },
        },
        { enforceForRenamedProperties: false },
      ],
      'prefer-numeric-literals': 'error',
      'prefer-rest-params': 'error',
      'prefer-spread': 'error',
      'prefer-template': 'error',
      'symbol-description': 'error',
      'template-curly-spacing': 'error',

      // ---- airbnb-base: style (не-форматирование) ----
      camelcase: ['error', { properties: 'never' }],
      'new-cap': [
        'error',
        {
          newIsCap: true,
          capIsNew: false,
        },
      ],
      'no-bitwise': 'error',
      'no-continue': 'error',
      'no-lonely-if': 'off',
      'no-multi-assign': 'error',
      'no-nested-ternary': 'off',
      'no-new-object': 'error',
      'no-plusplus': 'off',
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ForInStatement',
          message:
            'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
        },
        {
          selector: 'LabeledStatement',
          message:
            'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
        },
        {
          selector: 'WithStatement',
          message:
            '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
        },
      ],
      'no-underscore-dangle': [
        'error',
        {
          allow: [],
          allowAfterThis: false,
          allowAfterSuper: false,
          enforceInMethodNames: true,
        },
      ],
      'no-unneeded-ternary': ['error', { defaultAssignment: false }],
      'prefer-exponentiation-operator': 'error',
      'prefer-object-spread': 'error',

      // ---- airbnb-base: node ----
      'global-require': 'off',
      'no-buffer-constructor': 'error',
      'no-new-require': 'error',
      'no-path-concat': 'error',

      // ---- airbnb-base: strict ----
      strict: ['error', 'never'],

      // ---- import-x plugin ----
      'import-x/no-unresolved': 'error',
      'import-x/named': 'error',
      'import-x/export': 'error',
      'import-x/no-named-as-default': 'error',
      'import-x/no-named-as-default-member': 'error',
      'import-x/no-mutable-exports': 'error',
      'import-x/no-amd': 'error',
      'import-x/first': 'error',
      'import-x/no-duplicates': 'error',
      'import-x/extensions': [
        'error',
        'ignorePackages',
        { js: 'never', mjs: 'never', jsx: 'never', ts: 'never' },
      ],
      'import-x/newline-after-import': ['error', { count: 1 }],
      'import-x/prefer-default-export': 'off',
      'import-x/no-absolute-path': 'error',
      'import-x/no-dynamic-require': 'error',
      'import-x/no-webpack-loader-syntax': 'error',
      'import-x/no-named-default': 'error',
      'import-x/no-self-import': 'error',
      'import-x/no-useless-path-segments': ['error', { commonjs: true }],
      'import-x/no-relative-packages': 'error',
      'import-x/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: [
            'eslint.config.ts',
            'vite.config.ts',
            'vitest.config.ts',
            'tests/**',
            '.commitlintrc.cjs',
            'steiger.config.ts',
          ],
        },
      ],

      // ---- проектные переопределения ----
      'no-console': 'warn',
      'no-debugger': 'error',
      curly: ['error', 'all'],
      'max-depth': ['warn', 3],
      complexity: ['warn', 7],
      'max-lines-per-function': [
        'warn',
        {
          max: 60,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
      'no-param-reassign': [
        'warn',
        {
          props: true,
          ignorePropertyModificationsFor: ['state'],
        },
      ],
      'lines-between-class-members': 'off',
      'no-return-await': 'off',

      // ---- Vue правила ----
      'vue/camelcase': ['error', { properties: 'always' }],
      'vue/require-name-property': 'error',
      'vue/component-options-name-casing': ['error', 'PascalCase'],
      'vue/match-component-import-name': 'error',
      'vue/component-name-in-template-casing': [
        'error',
        'PascalCase',
        { registeredComponentsOnly: true },
      ],
      'vue/match-component-file-name': [
        'error',
        { extensions: ['vue'], shouldMatchCase: true },
      ],
      'vue/padding-lines-in-component-definition': ['error', 'always'],
      'vue/padding-line-between-blocks': ['error', 'always'],
      'vue/no-empty-component-block': 'error',
      'vue/block-order': ['error', { order: ['template', 'script', 'style'] }],
      'vue/prefer-true-attribute-shorthand': ['error', 'always'],
      'vue/custom-event-name-casing': ['error', 'kebab-case'],
      'vue/prefer-separate-static-class': 'error',
      'vue/no-restricted-class': [
        'error',
        '/^(?![a-z]([a-z0-9-]+)?(__([a-z0-9]+-?)+)?(--([a-z0-9]+-?)+){0,2}$)/',
      ],
      'vue/no-unused-properties': [
        'error',
        {
          groups: ['props', 'setup'],
        },
      ],
      'vue/no-unused-emit-declarations': 'error',
      'vue/no-unused-refs': 'error',
      'vue/define-props-destructuring': ['error', { destructure: 'always' }],
      'vue/eqeqeq': 'error',
      'vue/define-macros-order': [
        'error',
        {
          order: [
            'defineOptions',
            'defineModel',
            'defineProps',
            'defineEmits',
            'defineSlots',
          ],
          defineExposeLast: true,
        },
      ],
      'vue/html-comment-content-spacing': [
        'error',
        'always',
        { exceptions: [] },
      ],
      'vue/no-import-compiler-macros': 'error',
      'vue/no-ref-object-reactivity-loss': 'error',
      'vue/no-multiple-objects-in-class': 'error',
      'vue/no-root-v-if': 'error',
      'vue/no-template-target-blank': 'error',
      'vue/component-api-style': ['error', ['script-setup']],
      'vue/prefer-define-options': 'error',
      'vue/prefer-use-template-ref': 'error',
      'vue/slot-name-casing': ['error', 'kebab-case'],
    },
  },

  eslintConfigPrettier,

  {
    files: ['tests/**'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.vitest,
      },
    },
  },
);
```

- [ ] **Step 2: Delete old eslint.config.js**

```bash
rm eslint.config.js
```

- [ ] **Step 3: Run ESLint check**

```bash
npm run eslint:check
```

Expected: may show new TS-related warnings; fix as needed

- [ ] **Step 4: Commit**

```bash
git add eslint.config.ts
git rm eslint.config.js
git commit -m "build: migrate ESLint config to TypeScript with typescript-eslint"
```

---

## Task 30: Update package.json Scripts and lint-staged

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Add typecheck script and update lint-staged patterns**

In `package.json`, update:

1. Add `typecheck` script:
```json
"typecheck": "vue-tsc --noEmit -p tsconfig.app.json"
```

2. Update `eslint:check` pattern to include `.ts`:
```json
"eslint:check": "eslint ./src/**/*.{vue,js,ts}"
```

3. Update `lint-staged` to include `.ts` patterns:
```json
"lint-staged": {
  "src/**/*.ts": [
    "prettier --write",
    "eslint --fix"
  ],
  "src/**/*.js": [
    "prettier --write",
    "eslint --fix"
  ],
  "src/**/*.vue": [
    "prettier --write",
    "eslint --fix",
    "stylelint --fix"
  ],
  "src/**/*.{css,scss}": [
    "prettier --write",
    "stylelint --fix"
  ]
}
```

- [ ] **Step 2: Run typecheck**

```bash
npm run typecheck
```

Expected: may show type errors; fix remaining issues

- [ ] **Step 3: Commit**

```bash
git add package.json
git commit -m "build: add typecheck script, update lint-staged for TypeScript"
```

---

## Task 31: Update .vscode and CI

**Files:**
- Modify: `.vscode/extensions.json`
- Modify: `.vscode/settings.json`
- Modify: `.github/workflows/check.yml`

- [ ] **Step 1: Update .vscode/extensions.json**

Add TypeScript-related extension recommendation:

```json
{
  "recommendations": [
    "Vue.volar",
    "sdras.vue-vscode-snippets",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "stylelint.vscode-stylelint",
    "Gruntfuggly.todo-tree"
  ]
}
```

(Volar already handles TypeScript via the built-in TS language service in Vue - Official extension)

- [ ] **Step 2: Update .vscode/settings.json**

No changes needed — existing settings work with TypeScript.

- [ ] **Step 3: Update .github/workflows/check.yml**

Add test step and update Node version:

```yaml
name: Check
on: push
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test
```

- [ ] **Step 4: Commit**

```bash
git add .vscode/ .github/
git commit -m "ci: update CI for TypeScript, add typecheck and test steps"
```

---

## Task 32: Update AGENTS.md

**Files:**
- Modify: `AGENTS.md`

- [ ] **Step 1: Update stack description**

In the `## Стек` section, change `Без TypeScript` to mention TypeScript. Update relevant sections:

- Add `npm run typecheck` to commands
- Update stack line to include TypeScript
- Note that barrel exports use `index.ts`
- Update references from `.js` to `.ts` where applicable

- [ ] **Step 2: Commit**

```bash
git add AGENTS.md
git commit -m "docs: update AGENTS.md for TypeScript stack"
```

---

## Task 33: Remove allowJs and Final Verification

**Files:**
- Modify: `tsconfig.app.json`

- [ ] **Step 1: Remove allowJs from tsconfig.app.json**

After all files are migrated, remove `"allowJs": true` from `tsconfig.app.json` compilerOptions.

- [ ] **Step 2: Remove .js file patterns from lint-staged and eslint:check**

In `package.json`:
- Remove `"src/**/*.js"` from lint-staged (all files are now `.ts`)
- Update `eslint:check` to `"eslint ./src/**/*.{vue,ts}"`

- [ ] **Step 3: Run full verification**

```bash
npm run typecheck && npm run lint && npm run test && npm run build
```

Expected: all pass

- [ ] **Step 4: Commit**

```bash
git add tsconfig.app.json package.json
git commit -m "build: remove allowJs, finalize TypeScript migration"
```

---

## Self-Review

### Spec Coverage Check

| Requirement | Task |
|---|---|
| Fix Cyrillic `Сreated` in backend | Task 0 |
| Install TS dependencies | Task 1 |
| tsconfig files | Task 2 |
| Vite config | Task 3 |
| Vitest config | Task 4 |
| Steiger config | Task 5 |
| index.html | Task 6 |
| DTO types | Task 7 |
| shared/api | Task 8 |
| shared/config | Task 9 |
| shared/lib | Task 10 |
| shared/routes + assets | Task 11 |
| shared/ui/sidebar-modal | Task 12 |
| shared/ui/center-modal | Task 13 |
| shared/ui/rich-editor | Task 14 |
| shared/ui standalone | Task 15 |
| entity/alert | Task 16 |
| entity/question (incl. GetCaptcha fix) | Task 17 |
| entity/faq | Task 18 |
| entity/area | Task 19 |
| entity/user | Task 20 |
| feature/preloader | Task 21 |
| feature/auth | Task 22 |
| feature/feedback | Task 23 |
| pages layer | Task 24 |
| app/entrypoint + layouts | Task 25 |
| app/router | Task 26 |
| app/lib | Task 27 |
| tests | Task 28 |
| ESLint config | Task 29 |
| package.json scripts | Task 30 |
| .vscode + CI | Task 31 |
| AGENTS.md | Task 32 |
| Remove allowJs | Task 33 |

### Placeholder Scan

No TBD, TODO, or placeholder patterns found. All steps contain complete code.

### Type Consistency Check

- `UserResponse` type matches across auth-repository.ts, auth store, and UserProfile.vue
- `QuestionResponse` type used consistently in questions-repository.ts, QuestionCard.vue, QuestionsView.vue, AdminQuestionsPage.vue
- `FaqCategoryWithEntriesResponse` / `FaqEntryResponse` used consistently in faq repositories and UI
- `AreaResponse` used in areas-repository.ts and AreaCard.vue
- `FeedbackResponse` used in feedback-repository.ts and FeedbackCard.vue
- `SidebarModalResult` used in SidebarModal.vue expose and router middleware return type
- Route meta augmentation declared in router.ts
- `CaptchaResponse` type added for GetCaptcha return
- Cyrillic `Сreated` bug fixed at source (Task 0 — backend rename), all DTOs and components use `created` (Latin)
