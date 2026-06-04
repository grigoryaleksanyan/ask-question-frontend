# Дизайн: Унификация отступов в модальных окнах

## Контекст

В проекте 11 SlideOver и 6 CenterModal с неконсистентными отступами между элементами формы и кнопками действий. Пять проблем:

1. **contentPadding SlideOver** — смешанное использование `true`/`false`, при `false` контент прилипает к краям
2. **Gap между FormField** — CreateArea: `gap: 16px`, CreateSpeaker: нет gap (PrimeVue default), CreateEntryContent: PrimeFlex grid
3. **Отсутствие отступа до кнопок** — ни в одной модалке нет явного разделителя между контентом и footer
4. **Шрифт delete-текстов** — DeleteSpeaker: 14px, остальные: 16px через разные классы
5. **Заголовки SlideOver** — разные подходы: BEM-класс, typography-класс, без обёртки

## Решение

Подход **B — модалка + общий CSS-класс**.

### Параметры дизайна

| Параметр | Значение |
|----------|----------|
| Gap между FormField | `1rem` (16px) |
| Разделитель до кнопок | `border-top: 1px solid` |
| contentPadding SlideOver | Всегда `true`, проп удалён |
| Delete-текст | `text-body-large` для всех |
| Заголовки SlideOver | `typography__headline--medium` для всех |
| Gap между параграфами в DeleteCategory | `0.5rem` (8px) |

### CSS-класс `.modal-form`

Расположение: `src/app/styles/modal-form.scss`, глобально инжектируется через Vite (добавить импорт в `base.scss` или `main.ts` наряду с остальными глобальными стилями).

```scss
.modal-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
```

Применяется на wrapper-элемент контента внутри SlideOver/CenterModal. Контент-компоненты добавляют этот класс вместо инлайн-стилей gap/padding.

### Изменения SlideOver

**Компонент `SlideOver.vue`:**

- Удалить проп `contentPadding` — padding всегда 16px
- Footer: добавить `border-top: 1px solid var(--p-surface-border)` вместо PrimeVue default padding
- Удалить CSS-правило `.slide-over__content--padded`

**Заголовки (11 использований):**

Все заголовки в слоте `#header` используют `typography__headline--medium`. Удалить кастомные BEM-классы (`admin-faq-page__slide-over-title`, `slide-over-header`).

**Контент-компоненты:**

| Компонент | Изменение |
|-----------|-----------|
| `SidebarFeedbackContent` | Заменить PrimeFlex grid на `.modal-form`, убрать `m-0 p-0` |
| `QuestionCommentButton` | Обернуть Textarea в `.modal-form` |
| `CreateArea` | Заменить кастомный `.create-area` (gap: 16px) на `.modal-form` |
| `UserProfile` | Обернуть поля пароля в `.modal-form` |
| `CreateSpeaker` | Обернуть FormField в `.modal-form` |
| `UpdateSpeaker` | Обернуть FormField в `.modal-form` |
| `CreateCategory` | Обернуть FormField в `.modal-form` |
| `UpdateCategory` | Обернуть FormField в `.modal-form` |
| `CreateEntryContent` | Заменить PrimeFlex grid на `.modal-form`, убрать `mt-2` |
| `UpdateEntryContent` | Заменить PrimeFlex grid на `.modal-form`, убрать `mt-2` |

### Изменения CenterModal

**Компонент `CenterModal.vue`:**

- Footer: добавить `border-top: 1px solid var(--p-surface-border)` вместо PrimeVue default padding

**Delete-компоненты:**

| Компонент | Изменение |
|-----------|-----------|
| `DeleteArea` | Нет изменений (уже `text-body-large`) |
| `DeleteSpeaker` | Заменить `.delete-speaker__text` (14px) на `text-body-large`, удалить стиль |
| `DeleteCategory` | Заменить `.delete-category__text` на `text-body-large`, добавить `mb-2` на первый `<p>`, удалить стиль |
| `DeleteEntry` | Заменить `.delete-entry__text` на `text-body-large`, удалить стиль |
| `DeleteFeedback` | Нет изменений (уже `text-body-large`) |

### Файлы

**Новые:**
- `src/app/styles/modal-form.scss` — CSS-класс `.modal-form`

**Изменяемые:**
- `src/shared/ui/slide-over/SlideOver.vue` — убрать contentPadding, footer separator
- `src/shared/ui/center-modal/CenterModal.vue` — footer separator
- 11 контент-компонентов SlideOver (см. таблицу)
- 5 delete-компонентов CenterModal (см. таблицу)
- `src/app/layouts/DefaultLayout.vue` — заголовок SlideOver
- `src/app/layouts/AdminLayout.vue` — заголовок SlideOver
- `src/pages/admin/areas/ui/AdminAreasPage.vue` — заголовок SlideOver
- `src/pages/admin/speakers/ui/AdminSpeakersPage.vue` — заголовок SlideOver
- `src/pages/admin/faq/ui/AdminFAQPage.vue` — заголовки SlideOver
- `src/pages/admin/faq/ui/AdminFAQCategoryPage.vue` — заголовки SlideOver

### Неизменяемое

- Порядок кнопок (действие первым, отмена второй) — уже консистентно
- Выравнивание кнопок (по правому краю) — уже консистентно
- PrimeVue FormField — внутренний spacing полей не трогаем
