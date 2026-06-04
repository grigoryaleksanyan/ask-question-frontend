# Унификация модальных окон

## Проблема

Три базовых модальных компонента (SidebarModal, CenterModal, SlideOver) имеют разные API, а использования модалок по проекту не следуют единому паттерну:

- 2 из 17 использований размещают кнопки действий внутри контента, а не в `#footer`
- `open()` возвращает разные типы (`Promise<{status, data}>` vs `Promise<string>`)
- Scoped data default slot отличается (`{isOpen, togglePreloader, confirm, close}` vs `{confirm, close}`)
- Обёртка с `overflow-y: auto` есть только в SidebarModal
- Prop `closeOnClickAway` есть только в SidebarModal
- Кнопка «Отмена» стилизуется по-разному (`outlined` vs `severity` vs оба)
- Лейбл «Отмена» vs «Закрыть» нестандартизирован
- Часть контент-компонентов получает `modalConfirm`/`modalClose` props, часть — exposed-методы

## Решение

Подход B: оставить 3 компонента, унифицировать интерфейсы.

### 1. Единый контракт базовых компонентов

**Тип:**

```ts
type ModalResult = { status: boolean; data?: unknown }
```

**`open()` возвращает** `Promise<ModalResult>` во всех трёх компонентах:

- `confirm(data?)` → резолвит `{ status: true, data }`
- `close()` → резолвит `{ status: false }`

**Props (общие):**

| Prop | Тип | Default |
|---|---|---|
| `closeOnClickAway` | `boolean` | `true` |

**Scoped data default slot:** `{ confirm, close }` — единообразно.

`isOpen` и `togglePreloader` убираются из scoped data SidebarModal. `togglePreloader` остаётся как exposed-метод.

**Структура шаблона (единообразно):**

```
Component (Dialog/Drawer)
  ├── #header slot
  ├── <div style="overflow-y: auto; overscroll-behavior: none"> — default slot
  └── #footer slot
```

Обёртка с прокруткой добавляется в CenterModal и SlideOver.

**Exposed методы (общие):** `open`, `confirm`, `close`, `togglePreloader`

### 2. Паттерн взаимодействия с контент-компонентами

**Контент-компоненты:**

- Props `modalConfirm` / `modalClose` удаляются
- Экспонируются методы:
  - Create/Update: `submitForm()`, опционально `cancel()`
  - Delete: `confirm()`
- Эмитятся события: `@success`, `@cancel`

**Footer кнопки:**

- Первичная: `@click="contentRef?.submitForm()"` или `@click="contentRef?.confirm()"`
- Отмена: `@click="modalRef?.close()"` — всегда через `close()` модалки

**Стилизация кнопки «Отмена»:** `label="Отмена" outlined severity="secondary"` — везде.

**Поток данных:**

1. Клик по primary → `contentRef.submitForm()` → валидация → API
2. Успех → контент эмитит `@success` → parent: `modalRef.confirm()` + дополнительная логика
3. Отмена → `modalRef.close()` — контент реинициализируется при следующем `open()` через `v-if`

### 3. Стандарт стилизации кнопок

| Тип модалки | Primary | Cancel |
|---|---|---|
| Создание | `label="Создать"` | `label="Отмена" outlined severity="secondary"` |
| Изменение | `label="Изменить"` | аналогично |
| Удаление | `label="Удалить" severity="danger"` | аналогично |
| Отправка | `label="Отправить"` / `label="Сохранить"` | аналогично |

### 4. Исправление исключений

| Компонент | Изменение |
|---|---|
| `QuestionCommentButton` | Кнопки из default slot → в `#footer` SidebarModal |
| `UserProfile` в AdminLayout | Кнопки из компонента → в `#footer` SlideOver, добавить exposed `submitForm()` + `changePassword()` |

### 5. Область изменений

**shared/ui:**

- `SidebarModal.vue` — упростить scoped data до `{ confirm, close }`, `togglePreloader` → exposed
- `CenterModal.vue` — новый возврат `open()`, prop `closeOnClickAway`, обёртка прокрутки, exposed `togglePreloader`
- `SlideOver.vue` — новый возврат `open()`, prop `closeOnClickAway`, обёртка прокрутки, exposed `togglePreloader`
- `index.ts` для каждого — тип `ModalResult`

**entities/features (контент-компоненты):**

- `CreateArea` — убрать `modalConfirm`/`modalClose` props, эмитить `@success`
- `SidebarFeedbackContent` — убрать `modalConfirm`/`modalClose` props, эмитить `@success`
- `DeleteArea` — убрать неиспользуемые `modalConfirm`/`modalClose` props
- `UserProfile` — убрать внутренние кнопки, добавить exposed `submitForm()`, `changePassword()`

**pages (использования):**

- `QuestionCommentButton` — перенести кнопки в `#footer`
- `AdminLayout` — перенести кнопки UserProfile в `#footer` SlideOver
- Все страницы — стандартизировать кнопку «Отмена» (`label="Отмена" outlined severity="secondary"`)
- Все Cancel-обработчики → `modalRef?.close()`

### 6. Список файлов для изменения

| Файл | Изменение |
|---|---|
| `src/shared/ui/sidebar-modal/SidebarModal.vue` | scoped data, exposed, тип возврата |
| `src/shared/ui/sidebar-modal/index.ts` | тип ModalResult |
| `src/shared/ui/center-modal/CenterModal.vue` | тип возврата, closeOnClickAway, overflow wrapper, exposed |
| `src/shared/ui/center-modal/index.ts` | тип ModalResult |
| `src/shared/ui/slide-over/SlideOver.vue` | тип возврата, closeOnClickAway, overflow wrapper, exposed |
| `src/shared/ui/slide-over/index.ts` | тип ModalResult |
| `src/features/feedback/ui/SidebarFeedbackContent.vue` | убрать props, эмитить @success |
| `src/features/feedback/index.ts` | обновить экспорт |
| `src/features/manage-question/ui/QuestionCommentButton.vue` | кнопки в footer |
| `src/entities/area/ui/CreateArea.vue` | убрать props, эмитить @success |
| `src/entities/area/index.ts` | обновить экспорт |
| `src/entities/area/ui/DeleteArea.vue` | убрать неиспользуемые props |
| `src/entities/user/ui/UserProfile.vue` | убрать внутренние кнопки, exposed методы |
| `src/pages/admin/areas/ui/AdminAreasPage.vue` | стандартизация кнопок |
| `src/pages/admin/speakers/ui/AdminSpeakersPage.vue` | стандартизация кнопок |
| `src/pages/admin/feedback/ui/AdminFeedbackPage.vue` | стандартизация кнопок |
| `src/pages/admin/faq/ui/AdminFAQPage.vue` | стандартизация кнопок |
| `src/pages/admin/faq/ui/AdminFAQCategoryPage.vue` | стандартизация кнопок |
| `src/app/layouts/AdminLayout.vue` | UserProfile кнопки в footer |
| `src/app/layouts/DefaultLayout.vue` | стандартизация кнопок |

**Примечание:** Компоненты удаления (DeleteSpeaker, DeleteFeedback, DeleteCategory, DeleteEntryModal) не требуют изменений — они уже не получают `modalConfirm`/`modalClose` и используют exposed + events. Однако их родителей нужно обновить: добавить вызов `modalRef?.confirm()` в обработчик `@success`, чтобы promise разрешался корректно.
