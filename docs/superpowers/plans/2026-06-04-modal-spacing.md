# Унификация отступов в модальных окнах — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Привести к единообразию отступы между FormField, разделители до кнопок, contentPadding, заголовки и delete-тексты во всех SlideOver и CenterModal.

**Architecture:** CSS-класс `.modal-form` (gap: 1rem) на wrapper контента + стандартизация SlideOver (contentPadding всегда true, footer border-top) и CenterModal (footer border-top). Унификация заголовков через `typography__headline--medium`, delete-текстов через `text-body-large`.

**Tech Stack:** Vue 3, PrimeVue 4, SCSS, BEM, PrimeFlex

---

### Task 1: Создать CSS-класс `.modal-form`

**Files:**
- Create: `src/app/styles/modal-form.scss`
- Modify: `src/app/styles/base.scss:1`

- [ ] **Step 1: Создать файл `src/app/styles/modal-form.scss`**

```scss
.modal-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
```

- [ ] **Step 2: Добавить импорт в `src/app/styles/base.scss`**

Заменить строку 1:
```scss
@use 'typography';
```
на:
```scss
@use 'typography';
@use 'modal-form';
```

- [ ] **Step 3: Запустить dev-сервер и проверить, что класс доступен**

Run: `npm run dev`
Expected: сервер запускается без ошибок, класс `.modal-form` доступен глобально.

- [ ] **Step 4: Commit**

```bash
git add src/app/styles/modal-form.scss src/app/styles/base.scss
git commit -m "feat(client): add .modal-form CSS class for modal spacing"
```

---

### Task 2: Стандартизировать SlideOver — убрать contentPadding, добавить footer separator

**Files:**
- Modify: `src/shared/ui/slide-over/SlideOver.vue`

- [ ] **Step 1: Удалить проп contentPadding и заменить conditional class на постоянный padding**

В `<template>` заменить:
```html
    <div
      :class="{ 'slide-over__content--padded': contentPadding }"
      style="overflow-y: auto; overscroll-behavior: none">
```
на:
```html
    <div
      class="slide-over__content"
      style="overflow-y: auto; overscroll-behavior: none">
```

- [ ] **Step 2: Обновить Props — удалить contentPadding**

Заменить:
```ts
const { closeOnClickAway = true, contentPadding = true } = defineProps<Props>();

interface Props {
  closeOnClickAway?: boolean;
  contentPadding?: boolean;
}
```
на:
```ts
const { closeOnClickAway = true } = defineProps<Props>();

interface Props {
  closeOnClickAway?: boolean;
}
```

- [ ] **Step 3: Обновить `<style>` — заменить conditional класс на постоянный padding, добавить footer separator**

Заменить весь `<style>` блок:
```scss
<style lang="scss" scoped>
.slide-over__content--padded {
  padding: 16px;
}

.slide-over {
  :global(.p-dark) & {
    :deep(.p-drawer) {
      background: variables.$surface-dark-elevated;
      color: variables.$text-primary-dark;
    }

    :deep(.p-drawer-header) {
      color: variables.$text-primary-dark;
    }

    :deep(.p-drawer-footer) {
      color: variables.$text-primary-dark;
    }
  }
}
</style>
```
на:
```scss
<style lang="scss" scoped>
.slide-over__content {
  padding: 1rem;
}

.slide-over {
  :deep(.p-drawer-footer) {
    border-top: 1px solid var(--p-surface-border);
  }

  :global(.p-dark) & {
    :deep(.p-drawer) {
      background: variables.$surface-dark-elevated;
      color: variables.$text-primary-dark;
    }

    :deep(.p-drawer-header) {
      color: variables.$text-primary-dark;
    }

    :deep(.p-drawer-footer) {
      color: variables.$text-primary-dark;
    }
  }
}
</style>
```

- [ ] **Step 4: Проверить, что SlideOver рендерится**

Run: `npm run dev`
Expected: SlideOver открывается с padding: 16px, footer имеет border-top.

- [ ] **Step 5: Commit**

```bash
git add src/shared/ui/slide-over/SlideOver.vue
git commit -m "refactor(client): remove contentPadding prop, add footer separator to SlideOver"
```

---

### Task 3: Стандартизировать CenterModal — добавить footer separator

**Files:**
- Modify: `src/shared/ui/center-modal/CenterModal.vue`

- [ ] **Step 1: Добавить footer separator в `<style>`**

Заменить:
```scss
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
на:
```scss
<style lang="scss" scoped>
:deep(.p-dialog-footer) {
  border-top: 1px solid var(--p-surface-border);
}

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

- [ ] **Step 2: Commit**

```bash
git add src/shared/ui/center-modal/CenterModal.vue
git commit -m "feat(client): add footer separator to CenterModal"
```

---

### Task 4: Обновить SlideOver в DefaultLayout — убрать :content-padding, унифицировать заголовок

**Files:**
- Modify: `src/app/layouts/DefaultLayout.vue:42-45`

- [ ] **Step 1: Удалить `:content-padding="false"` и заменить заголовок**

Заменить:
```html
    <SlideOver
      ref="feedback-modal"
      :content-padding="false">
      <template #header>Обратная связь</template>
```
на:
```html
    <SlideOver ref="feedback-modal">
      <template #header>
        <span class="typography__headline--medium">Обратная связь</span>
      </template>
```

- [ ] **Step 2: Commit**

```bash
git add src/app/layouts/DefaultLayout.vue
git commit -m "refactor(client): unify feedback SlideOver header and remove contentPadding"
```

---

### Task 5: Обновить SlideOver в AdminLayout — унифицировать заголовок

**Files:**
- Modify: `src/app/layouts/AdminLayout.vue:38-41`

- [ ] **Step 1: Заголовок уже использует `typography__headline--medium` — не требует изменений**

Заголовок на строке 40 уже:
```html
<span class="typography__headline--medium">Профиль пользователя</span>
```
Изменений не требуется.

- [ ] **Step 2: Проверить**

Visually: Открыть профиль в админке — заголовок выглядит корректно.

---

### Task 6: Обновить SlideOver в AdminAreasPage — убрать :content-padding, унифицировать заголовок

**Files:**
- Modify: `src/pages/admin/areas/ui/AdminAreasPage.vue:31-34`

- [ ] **Step 1: Удалить `:content-padding="false"`, заменить заголовок**

Заменить:
```html
    <SlideOver
      ref="create-area-modal"
      :content-padding="false">
      <template #header>Создать область</template>
```
на:
```html
    <SlideOver ref="create-area-modal">
      <template #header>
        <span class="typography__headline--medium">Создать область</span>
      </template>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/admin/areas/ui/AdminAreasPage.vue
git commit -m "refactor(client): unify create-area SlideOver header and remove contentPadding"
```

---

### Task 7: Обновить SlideOver в AdminSpeakersPage — унифицировать заголовки, убрать slide-over-header класс

**Files:**
- Modify: `src/pages/admin/speakers/ui/AdminSpeakersPage.vue:19-22,40-43,64-66`
- Modify: `src/pages/admin/speakers/ui/AdminSpeakersPage.vue:182-186`

- [ ] **Step 1: Заменить заголовок create SlideOver**

Заменить:
```html
      <template #header>
        <span class="slide-over-header">Создать спикера</span>
      </template>
```
на:
```html
      <template #header>
        <span class="typography__headline--medium">Создать спикера</span>
      </template>
```

- [ ] **Step 2: Заменить заголовок update SlideOver**

Заменить:
```html
      <template #header>
        <span class="slide-over-header">Изменить спикера</span>
      </template>
```
на:
```html
      <template #header>
        <span class="typography__headline--medium">Изменить спикера</span>
      </template>
```

- [ ] **Step 3: Заменить заголовок delete CenterModal**

Заменить:
```html
      <template #header>
        <span class="slide-over-header">Удалить спикера</span>
      </template>
```
на:
```html
      <template #header>Удалить спикера</template>
```

- [ ] **Step 4: Удалить класс `.slide-over-header` из `<style>`**

Удалить:
```scss
.slide-over-header {
  color: variables.$text-primary-dark;
  font-size: 16px;
  font-weight: 600;
}
```

- [ ] **Step 5: Commit**

```bash
git add src/pages/admin/speakers/ui/AdminSpeakersPage.vue
git commit -m "refactor(client): unify SlideOver/CenterModal headers in speakers page"
```

---

### Task 8: Обновить SlideOver в AdminFAQPage — унифицировать заголовки

**Files:**
- Modify: `src/pages/admin/faq/ui/AdminFAQPage.vue:29-34,55-60`
- Modify: `src/pages/admin/faq/ui/AdminFAQPage.vue:260-264`

- [ ] **Step 1: Заменить заголовок create category SlideOver**

Заменить:
```html
        <span class="admin-faq-page__slide-over-title">
          Создать категорию
        </span>
```
на:
```html
        <span class="typography__headline--medium">
          Создать категорию
        </span>
```

- [ ] **Step 2: Заменить заголовок update category SlideOver**

Заменить:
```html
        <span class="admin-faq-page__slide-over-title">
          Изменить категорию
        </span>
```
на:
```html
        <span class="typography__headline--medium">
          Изменить категорию
        </span>
```

- [ ] **Step 3: Удалить класс `.admin-faq-page__slide-over-title` из `<style>`**

Удалить:
```scss
.admin-faq-page__slide-over-title {
  color: variables.$text-primary-dark;
  font-size: 1.25rem;
  font-weight: 500;
}
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/admin/faq/ui/AdminFAQPage.vue
git commit -m "refactor(client): unify SlideOver headers in FAQ page"
```

---

### Task 9: Обновить SlideOver в AdminFAQCategoryPage — унифицировать заголовки

**Files:**
- Modify: `src/pages/admin/faq/ui/AdminFAQCategoryPage.vue:50-55,96-100,123-128`
- Modify: `src/pages/admin/faq/ui/AdminFAQCategoryPage.vue:396-400`

- [ ] **Step 1: Заменить заголовок update category SlideOver**

Заменить:
```html
          <span class="admin-faq-category-page__slide-over-title">
            Изменить категорию
          </span>
```
на:
```html
          <span class="typography__headline--medium">
            Изменить категорию
          </span>
```

- [ ] **Step 2: Заменить заголовок create entry SlideOver**

Заменить:
```html
          <span class="admin-faq-category-page__slide-over-title">
            Создать запись в FAQ
          </span>
```
на:
```html
          <span class="typography__headline--medium">
            Создать запись в FAQ
          </span>
```

- [ ] **Step 3: Заменить заголовок update entry SlideOver**

Заменить:
```html
          <span class="admin-faq-category-page__slide-over-title">
            Изменить запись в FAQ
          </span>
```
на:
```html
          <span class="typography__headline--medium">
            Изменить запись в FAQ
          </span>
```

- [ ] **Step 4: Удалить класс `.admin-faq-category-page__slide-over-title` из `<style>`**

Удалить:
```scss
.admin-faq-category-page__slide-over-title {
  color: variables.$text-primary-dark;
  font-size: 1.25rem;
  font-weight: 500;
}
```

- [ ] **Step 5: Commit**

```bash
git add src/pages/admin/faq/ui/AdminFAQCategoryPage.vue
git commit -m "refactor(client): unify SlideOver headers in FAQ category page"
```

---

### Task 10: Обновить контент-компоненты — SidebarFeedbackContent

**Files:**
- Modify: `src/features/feedback/ui/SidebarFeedbackContent.vue:1-31`

- [ ] **Step 1: Заменить PrimeFlex grid на `.modal-form`**

Заменить template:
```html
  <form class="m-0 p-0">
    <div class="grid grid-nogutter mt-2">
      <div class="col-12">
        <InputText
          v-model="controls.username"
          placeholder="Имя"
          class="w-full" />
      </div>
      <div class="col-12">
        <InputText
          v-model="controls.email"
          placeholder="Email"
          class="w-full" />
      </div>
      <div class="col-12">
        <Select
          v-model="controls.theme"
          :options="themes"
          placeholder="Тема обращения"
          class="w-full" />
      </div>
      <div class="col-12">
        <Textarea
          v-model="controls.text"
          placeholder="Текст обращения"
          auto-resize
          class="w-full" />
      </div>
    </div>
  </form>
```
на:
```html
  <form class="modal-form">
    <InputText
      v-model="controls.username"
      placeholder="Имя"
      class="w-full" />
    <InputText
      v-model="controls.email"
      placeholder="Email"
      class="w-full" />
    <Select
      v-model="controls.theme"
      :options="themes"
      placeholder="Тема обращения"
      class="w-full" />
    <Textarea
      v-model="controls.text"
      placeholder="Текст обращения"
      auto-resize
      class="w-full" />
  </form>
```

- [ ] **Step 2: Commit**

```bash
git add src/features/feedback/ui/SidebarFeedbackContent.vue
git commit -m "refactor(client): use .modal-form in SidebarFeedbackContent"
```

---

### Task 11: Обновить контент-компоненты — QuestionCommentButton

**Files:**
- Modify: `src/features/manage-question/ui/QuestionCommentButton.vue:12-36`

- [ ] **Step 1: Удалить `:content-padding="false"`, обернуть Textarea в `.modal-form`**

Заменить:
```html
  <SlideOver
    ref="slideOverRef"
    :content-padding="false">
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
```
на:
```html
  <SlideOver ref="slideOverRef">
    <template #header>
      <span class="typography__headline--medium">Комментарий к вопросу</span>
    </template>
    <template #default>
      <div class="modal-form">
        <Textarea
          v-model="localComment"
          auto-resize
          rows="4"
          class="w-full"
          placeholder="Введите комментарий..." />
      </div>
    </template>
```

- [ ] **Step 2: Commit**

```bash
git add src/features/manage-question/ui/QuestionCommentButton.vue
git commit -m "refactor(client): use .modal-form in QuestionCommentButton, unify header"
```

---

### Task 12: Обновить контент-компоненты — CreateArea

**Files:**
- Modify: `src/entities/area/ui/CreateArea.vue:2-44`
- Modify: `src/entities/area/ui/CreateArea.vue:120-132`

- [ ] **Step 1: Заменить `.create-area` на `.modal-form`**

Заменить template:
```html
    <div class="create-area">
      <div class="create-area__field">
        <FormField
          v-slot="$field"
          name="title"
          initial-value="">
          <InputText
            type="text"
            placeholder="Заголовок"
            class="create-area__input" />
          <Message
            v-if="$field?.invalid"
            severity="error"
            size="small"
            variant="simple">
            {{ $field.error?.message }}
          </Message>
        </FormField>
      </div>

      <div class="create-area__field">
        <FormField
          v-slot="$field"
          name="order"
          :initial-value="String(order)">
          <InputText
            type="text"
            placeholder="Порядок"
            class="create-area__input" />
          <Message
            v-if="$field?.invalid"
            severity="error"
            size="small"
            variant="simple">
            {{ $field.error?.message }}
          </Message>
        </FormField>
      </div>
    </div>
```
на:
```html
    <div class="modal-form">
      <FormField
        v-slot="$field"
        name="title"
        initial-value="">
        <InputText
          type="text"
          placeholder="Заголовок"
          class="create-area__input" />
        <Message
          v-if="$field?.invalid"
          severity="error"
          size="small"
          variant="simple">
          {{ $field.error?.message }}
        </Message>
      </FormField>

      <FormField
        v-slot="$field"
        name="order"
        :initial-value="String(order)">
        <InputText
          type="text"
          placeholder="Порядок"
          class="create-area__input" />
        <Message
          v-if="$field?.invalid"
          severity="error"
          size="small"
          variant="simple">
          {{ $field.error?.message }}
        </Message>
      </FormField>
    </div>
```

- [ ] **Step 2: Обновить `<style>` — удалить `.create-area` и `.create-area__field`**

Заменить:
```scss
.create-area {
  display: flex;
  flex-direction: column;
  margin-top: 8px;
  gap: 16px;
}

.create-area__field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.create-area__input {
```
на:
```scss
.create-area__input {
```

- [ ] **Step 3: Commit**

```bash
git add src/entities/area/ui/CreateArea.vue
git commit -m "refactor(client): use .modal-form in CreateArea"
```

---

### Task 13: Обновить контент-компоненты — UserProfile (поля пароля)

**Files:**
- Modify: `src/entities/user/ui/UserProfile.vue:40-93`

- [ ] **Step 1: Заменить `class="mt-4"` на `class="modal-form"` для блока пароля**

Заменить:
```html
    <div
      v-show="showChangePassword"
      class="mt-4">
      <FormField
```
на:
```html
    <div
      v-show="showChangePassword"
      class="modal-form">
      <FormField
```

- [ ] **Step 2: Commit**

```bash
git add src/entities/user/ui/UserProfile.vue
git commit -m "refactor(client): use .modal-form for password fields in UserProfile"
```

---

### Task 14: Обновить контент-компоненты — CreateSpeaker

**Files:**
- Modify: `src/entities/user/ui/CreateSpeaker.vue:2-86`

- [ ] **Step 1: Обернуть FormField в `.modal-form`**

Заменить:
```html
    <FormField
      v-slot="$field"
      name="lastName"
      initial-value="">
```
добавив wrapper перед первым FormField. Заменить начало template (строки 2-86):
```html
    <FormField
      v-slot="$field"
      name="lastName"
      initial-value="">
      <InputText
        type="text"
        placeholder="Фамилия"
        class="w-full dark-input" />
      <Message
        v-if="$field?.invalid"
        severity="error"
        size="small"
        variant="simple">
        {{ $field.error?.message }}
      </Message>
    </FormField>

    <FormField
      v-slot="$field"
      name="firstName"
      initial-value="">
      <InputText
        type="text"
        placeholder="Имя"
        class="w-full dark-input" />
      <Message
        v-if="$field?.invalid"
        severity="error"
        size="small"
        variant="simple">
        {{ $field.error?.message }}
      </Message>
    </FormField>

    <FormField
      name="patronymic"
      initial-value="">
      <InputText
        type="text"
        placeholder="Отчество"
        class="w-full dark-input" />
    </FormField>

    <FormField
      v-slot="$field"
      name="email"
      initial-value="">
      <InputText
        type="text"
        placeholder="Почта"
        class="w-full dark-input" />
      <Message
        v-if="$field?.invalid"
        severity="error"
        size="small"
        variant="simple">
        {{ $field.error?.message }}
      </Message>
    </FormField>

    <FormField
      name="position"
      initial-value="">
      <InputText
        type="text"
        placeholder="Должность"
        class="w-full dark-input" />
    </FormField>

    <div
      v-if="createdCredentials"
      class="create-speaker__credentials">
```
на:
```html
    <div class="modal-form">
      <FormField
        v-slot="$field"
        name="lastName"
        initial-value="">
        <InputText
          type="text"
          placeholder="Фамилия"
          class="w-full dark-input" />
        <Message
          v-if="$field?.invalid"
          severity="error"
          size="small"
          variant="simple">
          {{ $field.error?.message }}
        </Message>
      </FormField>

      <FormField
        v-slot="$field"
        name="firstName"
        initial-value="">
        <InputText
          type="text"
          placeholder="Имя"
          class="w-full dark-input" />
        <Message
          v-if="$field?.invalid"
          severity="error"
          size="small"
          variant="simple">
          {{ $field.error?.message }}
        </Message>
      </FormField>

      <FormField
        name="patronymic"
        initial-value="">
        <InputText
          type="text"
          placeholder="Отчество"
          class="w-full dark-input" />
      </FormField>

      <FormField
        v-slot="$field"
        name="email"
        initial-value="">
        <InputText
          type="text"
          placeholder="Почта"
          class="w-full dark-input" />
        <Message
          v-if="$field?.invalid"
          severity="error"
          size="small"
          variant="simple">
          {{ $field.error?.message }}
        </Message>
      </FormField>

      <FormField
        name="position"
        initial-value="">
        <InputText
          type="text"
          placeholder="Должность"
          class="w-full dark-input" />
      </FormField>

      <div
        v-if="createdCredentials"
        class="create-speaker__credentials">
```

- [ ] **Step 2: Закрыть wrapper div перед `</Form>`**

Заменить:
```html
    </div>
  </Form>
```
(где `</div>` — закрывает credentials) на:
```html
      </div>
    </div>
  </Form>
```

Убедиться, что структура: `<Form>` → `<div class="modal-form">` → FormField* → `<div .create-speaker__credentials>` → `</div>` → `</div>` → `</Form>`.

- [ ] **Step 3: Обновить стиль `.create-speaker__credentials` — убрать margin-top**

Заменить:
```scss
.create-speaker__credentials {
  padding: 12px;
  border: 1px solid variables.$border-dark;
  border-radius: 10px;
  margin-top: 16px;
  background: variables.$surface-dark-elevated;
}
```
на:
```scss
.create-speaker__credentials {
  padding: 12px;
  border: 1px solid variables.$border-dark;
  border-radius: 10px;
  background: variables.$surface-dark-elevated;
}
```

- [ ] **Step 4: Commit**

```bash
git add src/entities/user/ui/CreateSpeaker.vue
git commit -m "refactor(client): use .modal-form in CreateSpeaker"
```

---

### Task 15: Обновить контент-компоненты — UpdateSpeaker

**Files:**
- Modify: `src/entities/user/ui/UpdateSpeaker.vue:2-84`

- [ ] **Step 1: Обернуть FormField в `.modal-form`**

Добавить `<div class="modal-form">` после `<Form ...>` и `</div>` перед `</Form>`:

Заменить:
```html
    <FormField
      v-slot="$field"
      name="lastName"
      initial-value="">
      <InputText
        type="text"
        placeholder="Фамилия"
        class="w-full dark-input" />
```
на:
```html
    <div class="modal-form">
      <FormField
        v-slot="$field"
        name="lastName"
        initial-value="">
        <InputText
          type="text"
          placeholder="Фамилия"
          class="w-full dark-input" />
```

Заменить конец (после последнего FormField):
```html
    </FormField>
  </Form>
```
на:
```html
      </FormField>
    </div>
  </Form>
```

- [ ] **Step 2: Commit**

```bash
git add src/entities/user/ui/UpdateSpeaker.vue
git commit -m "refactor(client): use .modal-form in UpdateSpeaker"
```

---

### Task 16: Обновить контент-компоненты — CreateCategory, UpdateCategory

**Files:**
- Modify: `src/entities/faq/ui/CreateCategory.vue:2-22`
- Modify: `src/entities/faq/ui/UpdateCategory.vue:2-22`

- [ ] **Step 1: Обернуть FormField в `.modal-form` в CreateCategory**

Заменить:
```html
    <FormField
      v-slot="$field"
      name="name"
      initial-value="">
      <InputText
        type="text"
        placeholder="Название"
        class="w-full" />
      <Message
        v-if="$field?.invalid"
        severity="error"
        size="small"
        variant="simple">
        {{ $field.error?.message }}
      </Message>
    </FormField>
```
на:
```html
    <div class="modal-form">
      <FormField
        v-slot="$field"
        name="name"
        initial-value="">
        <InputText
          type="text"
          placeholder="Название"
          class="w-full" />
        <Message
          v-if="$field?.invalid"
          severity="error"
          size="small"
          variant="simple">
          {{ $field.error?.message }}
        </Message>
      </FormField>
    </div>
```

- [ ] **Step 2: Обернуть FormField в `.modal-form` в UpdateCategory**

Та же замена, что и в Step 1 (идентичная структура шаблона).

- [ ] **Step 3: Commit**

```bash
git add src/entities/faq/ui/CreateCategory.vue src/entities/faq/ui/UpdateCategory.vue
git commit -m "refactor(client): use .modal-form in CreateCategory and UpdateCategory"
```

---

### Task 17: Обновить контент-компоненты — CreateEntryContent, UpdateEntryContent

**Files:**
- Modify: `src/entities/faq/ui/CreateEntryContent.vue:2-44`
- Modify: `src/entities/faq/ui/UpdateEntryContent.vue:2-45`

- [ ] **Step 1: Заменить PrimeFlex grid на `.modal-form` в CreateEntryContent**

Заменить:
```html
    <div class="mt-2">
      <div class="col-12">
        <FormField
          v-slot="$field"
          name="question"
          initial-value="">
          <InputText
            type="text"
            placeholder="Вопрос"
            class="w-full" />
          <Message
            v-if="$field?.invalid"
            severity="error"
            size="small"
            variant="simple">
            {{ $field.error?.message }}
          </Message>
        </FormField>
      </div>

      <div class="col-12">
        <FormField
          v-slot="$field"
          name="answer"
          initial-value="">
          <Textarea
            placeholder="Ответ"
            rows="5"
            class="w-full" />
          <Message
            v-if="$field?.invalid"
            severity="error"
            size="small"
            variant="simple">
            {{ $field.error?.message }}
          </Message>
        </FormField>
      </div>
    </div>
```
на:
```html
    <div class="modal-form">
      <FormField
        v-slot="$field"
        name="question"
        initial-value="">
        <InputText
          type="text"
          placeholder="Вопрос"
          class="w-full" />
        <Message
          v-if="$field?.invalid"
          severity="error"
          size="small"
          variant="simple">
          {{ $field.error?.message }}
        </Message>
      </FormField>

      <FormField
        v-slot="$field"
        name="answer"
        initial-value="">
        <Textarea
          placeholder="Ответ"
          rows="5"
          class="w-full" />
        <Message
          v-if="$field?.invalid"
          severity="error"
          size="small"
          variant="simple">
          {{ $field.error?.message }}
        </Message>
      </FormField>
    </div>
```

- [ ] **Step 2: Та же замена в UpdateEntryContent**

Идентичная замена — заменить `<div class="mt-2">` с `<div class="col-12">` на `<div class="modal-form">` без col-12 wrapper'ов.

- [ ] **Step 3: Commit**

```bash
git add src/entities/faq/ui/CreateEntryContent.vue src/entities/faq/ui/UpdateEntryContent.vue
git commit -m "refactor(client): use .modal-form in CreateEntryContent and UpdateEntryContent"
```

---

### Task 18: Унифицировать delete-компоненты — DeleteSpeaker

**Files:**
- Modify: `src/entities/user/ui/DeleteSpeaker.vue:2,38-42`

- [ ] **Step 1: Заменить `.delete-speaker__text` на `text-body-large`**

Заменить:
```html
  <p class="delete-speaker__text">Вы действительно хотите удалить спикера?</p>
```
на:
```html
  <p class="text-body-large">Вы действительно хотите удалить спикера?</p>
```

- [ ] **Step 2: Удалить `<style>` блок целиком**

Удалить:
```scss
<style lang="scss" scoped>
.delete-speaker__text {
  color: variables.$text-primary-dark;
  font-size: 14px;
}
</style>
```

- [ ] **Step 3: Commit**

```bash
git add src/entities/user/ui/DeleteSpeaker.vue
git commit -m "refactor(client): use text-body-large in DeleteSpeaker"
```

---

### Task 19: Унифицировать delete-компоненты — DeleteCategory

**Files:**
- Modify: `src/entities/faq/ui/DeleteCategory.vue:2-7,43-57`

- [ ] **Step 1: Заменить классы на `text-body-large`, добавить gap между параграфами**

Заменить:
```html
  <div class="delete-category">
    <p class="delete-category__text">
      Вы действительно хотите удалить всю категорию?
    </p>
    <p class="delete-category__warning">Так же будут удалены все записи!</p>
  </div>
```
на:
```html
  <div class="modal-form">
    <p class="text-body-large">
      Вы действительно хотите удалить всю категорию?
    </p>
    <p class="text-body-large delete-category__warning">
      Так же будут удалены все записи!
    </p>
  </div>
```

- [ ] **Step 2: Упростить `<style>` — удалить `.delete-category__text`, обновить warning**

Заменить:
```scss
<style lang="scss" scoped>
.delete-category__text {
  color: variables.$text-primary-dark;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5rem;
}

.delete-category__warning {
  margin: 0;
  color: variables.$error-color;
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.25rem;
}
</style>
```
на:
```scss
<style lang="scss" scoped>
.delete-category__warning {
  color: variables.$error-color;
  font-weight: 700;
}
</style>
```

- [ ] **Step 3: Commit**

```bash
git add src/entities/faq/ui/DeleteCategory.vue
git commit -m "refactor(client): use text-body-large and .modal-form in DeleteCategory"
```

---

### Task 20: Унифицировать delete-компоненты — DeleteEntry

**Files:**
- Modify: `src/entities/faq/ui/DeleteEntry.vue:2,38-44`

- [ ] **Step 1: Заменить `.delete-entry__text` на `text-body-large`**

Заменить:
```html
  <p class="delete-entry__text">Вы действительно хотите удалить запись?</p>
```
на:
```html
  <p class="text-body-large">Вы действительно хотите удалить запись?</p>
```

- [ ] **Step 2: Удалить `<style>` блок целиком**

Удалить:
```scss
<style lang="scss" scoped>
.delete-entry__text {
  color: variables.$text-primary-dark;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5rem;
}
</style>
```

- [ ] **Step 3: Commit**

```bash
git add src/entities/faq/ui/DeleteEntry.vue
git commit -m "refactor(client): use text-body-large in DeleteEntry"
```

---

### Task 21: Финальная проверка — lint, typecheck, build

- [ ] **Step 1: Запустить lint**

Run: `npm run lint`
Expected: нет ошибок, связанных с удалёнными классами/пропами.

- [ ] **Step 2: Запустить typecheck**

Run: `npm run typecheck`
Expected: нет ошибок (contentPadding удалён из Props, нигде не используется).

- [ ] **Step 3: Запустить build**

Run: `npm run build`
Expected: успешная сборка.

- [ ] **Step 4: Визуальная проверка**

Открыть все модалки в dev-сервере:
- Обратная связь (DefaultLayout)
- Профиль пользователя (AdminLayout)
- Создать/Изменить область (AdminAreasPage)
- Создать/Изменить/Удалить спикера (AdminSpeakersPage)
- Создать/Изменить/Удалить категорию (AdminFAQPage)
- Изменить категорию / Создать/Изменить/Удалить запись (AdminFAQCategoryPage)
- Удалить обратную связь (AdminFeedbackPage)

Ожидания:
- Все SlideOver: padding 16px, gap 16px между полями, border-top перед кнопками, заголовки `typography__headline--medium`
- Все CenterModal: border-top перед кнопками, delete-текст `text-body-large`
- DeleteCategory: gap между двумя параграфами

- [ ] **Step 5: Финальный commit (если были правки по итогам проверки)**

```bash
git add -A
git commit -m "fix(client): fix modal spacing issues found during visual check"
```
