# Дизайн: Переход с ручных компонентов на PrimeVue

## Дата

2026-06-05

## Контекст

Проект `ask-question-frontend` использует PrimeVue 4.5.5, но многие UI-элементы реализованы вручную через CSS + нативные HTML-элементы. Это создает дублирование логики, увеличивает объем кода и усложняет поддержку. PrimeVue предоставляет готовые, доступные и стилизованные компоненты, которые покрывают большинство сценариев.

## Цель

Системно заменить ручные компоненты и паттерны на готовые из PrimeVue, сократив технический долг и унифицировав UI. Замены должны сохранять текущий внешний вид и поведение, не нарушая архитектурные границы FSD.

## Принципы

1. **Минимальные изменения**: меняем только компонент, не переписываем бизнес-логику страниц.
2. **Сохранение стилей**: если PrimeVue-компонент не покрывает кастомный дизайн (hover-эффекты, drag-and-drop, цвета), оставляем обертку или откладываем замену.
3. **FSD-соблюдение**: импорты только через public API (`index.ts`), кросс-импорты запрещены.
4. **Поэтапность**: каждый пакет — отдельная ветка/PR, независимое ревью и тестирование.
5. **RichEditor исключен**: заглушка `RichEditor` остается как есть, переход на `Editor` вынесен в отдельную задачу.

## Пакеты реализации

### Пакет 1 — High Impact

Цель: максимальное сокращение ручного кода с очевидными заменами.

| Ручной компонент | Замена PrimeVue | Путь | Обоснование |
|---|---|---|---|
| `SpeakerAvatar.vue` | `Avatar` | `entities/user/ui/SpeakerAvatar.vue` | Готовый компонент для инициалов/изображений, поддержка circle и размеров. |
| `StatusDot.vue` | `Tag` | `shared/ui/status-dot/StatusDot.vue` | `Tag` с кастомным `severity` или inline-стилем покрывает цветной индикатор + текст. |
| `AdminQuestionsPage.vue` — ручная CSS-таблица | `DataTable` | `pages/admin/questions/ui/AdminQuestionsPage.vue` | Убирает ~200 строк CSS и верстки, дает встроенную сортировку, selection, пагинацию, фильтры. |
| `QuestionsView.vue` / `AdminQuestionsPage.vue` — ручная пагинация | `Paginator` | `entities/question/ui/QuestionsView.vue`, `pages/admin/questions/ui/AdminQuestionsPage.vue` | Готовый компонент с навигацией, размером страницы, отображением диапазона. |

**Критерий приемки пакета 1:**
- `SpeakerAvatar` и `StatusDot` отображаются корректно во всех местах использования.
- `AdminQuestionsPage` — таблица функционально эквивалентна текущей (чекбоксы, статусы, комментарии, клик по строке, пагинация).
- Пагинация в `QuestionsView` работает без регрессий.

### Пакет 2 — Medium Impact

Цель: унификация форм, фильтров, интерактивных элементов.

| Ручной компонент/паттерн | Замена PrimeVue | Путь | Обоснование |
|---|---|---|---|
| Поисковый input + `pi-search` | `IconField` + `InputText` | `entities/question/ui/QuestionsView.vue` | Стандартный паттерн input с иконкой. |
| Ручные кнопки периода (7дн/30дн/90дн) | `SelectButton` | `widgets/dashboard/ui/DashboardFilters.vue` | Уже используется в `QuestionsView`, унификация. |
| Ручные табы («Все / Новые / В фокусе / Отвеченные») | `Tabs` или `SelectButton` | `pages/admin/questions/ui/AdminQuestionsPage.vue` | Стандартный accessible tabs. |
| Inline-редактирование `AreaCard` | `Inplace` | `entities/area/ui/AreaCard.vue` | Готовый компонент toggle view/edit с blur/enter обработкой. |
| `DeleteArea`, `DeleteSpeaker`, `DeleteFeedback`, `DeleteCategory`, `DeleteEntry` | `ConfirmDialog` + `useConfirm()` | `entities/area/ui/DeleteArea.vue`, `entities/user/ui/DeleteSpeaker.vue`, `features/feedback/ui/DeleteFeedback.vue`, `entities/faq/ui/DeleteCategory.vue`, `entities/faq/ui/DeleteEntry.vue` | Убирает 5 однотипных компонентов, promise-based подтверждение. |

**Критерий приемки пакета 2:**
- Поиск, фильтры периода, табы — визуально и функционально эквивалентны текущим.
- `AreaCard` — редактирование по клику/enter/blur работает без регрессий.
- Удаление во всех слайсах использует единый `ConfirmDialog` без потери функциональности.

### Пакет 3 — Low Impact (опционально)

Цель: мелкие улучшения, если не ломает кастомный дизайн.

| Ручной компонент/паттерн | Замена PrimeVue | Путь | Обоснование |
|---|---|---|---|
| `AppPreloader.vue` (overlay + spinner) | `BlockUI` | `features/preloader/ui/AppPreloader.vue` | Готовый компонент блокировки UI с индикатором. |
| Ручные разделители (`<div class="...__divider">`) | `Divider` | Разные страницы (`QuestionIdView.vue`, `AdminQuestionsPage.vue` и др.) | Стандартный разделитель. |
| `AppToast.vue` (кастомная обертка) | Стандартный `Toast` или упрощение | `shared/ui/toast/AppToast.vue` | Уменьшение кода, но с потерей кастомного progress-bar. Требует решения. |
| Карточки (`QuestionCard`, `FeedbackCard`, `CategoryCard`, `EntryCard`, `SpeakerCard`, `StatCardsRow`) | `Card` | Разные слайсы | **Опционально**. Текущие карточки сильно кастомизированы (hover, drag, цвета). Замена только если `Card` не ломает дизайн. |
| `QuestionVote.vue` (like/dislike) | `ToggleButton` или `Rating` | `entities/question/ui/QuestionVote.vue` | **Опционально**. Текущий дизайн специфичен, замена не критична. |
| `AppNavigation.vue` | `Menubar` или `Menu` | `shared/ui/AppNavigation.vue` | **Опционально**. Router-link интеграция требует кастомного template. |

**Критерий приемки пакета 3:**
- `BlockUI` покрывает сценарий глобального прелоадера.
- `Divider` не ломает визуальную структуру страниц.
- Карточки и навигация — заменены только если дизайн сохранен.

## Архитектурные ограничения

1. **FSD импорты**: замены выполняются внутри существующих слайсов. Если компонент используется в 2+ слайсах, правим в месте определения (например, `shared/ui/status-dot`), а потребители получают обновление через public API.
2. **Стили**: глобальные SCSS-переменные (`variables.$...`) инжектируются через Vite, не добавляем `@use` вручную. PrimeVue-компоненты стилизуем через `pt` (Pass Through) или scoped `:deep()` только при необходимости.
3. **PrimeVue Forms**: формы (`CreateArea`, `UpdateSpeaker`, `LoginView` и др.) уже используют `@primevue/forms` + Zod. Замена input-компонентов (`InputText`, `Textarea`, `Select`) не затрагивает эту логику.
4. **DataTable**: при замене таблицы в `AdminQuestionsPage` нужно сохранить:
   - `Checkbox` для выбора строк (встроенный `DataTable` selection)
   - `QuestionStatusDropdown` и `QuestionCommentButton` внутри ячеек (через `column` template)
   - Клик по строке для перехода на деталь (`@row-click`)
   - `QuestionBulkActions` при выборе строк (`selection` event)

## Риски и стратегия отката

| Риск | Вероятность | Влияние | Митигация |
|---|---|---|---|
| `DataTable` не покрывает кастомное поведение (row selection + клик + вложенные компоненты) | Средняя | Высокое | Пилот в отдельной ветке, тестирование всех интерактивных сценариев перед merge. |
| `Tag` / `Avatar` стили не совпадают с текущим дизайном | Низкая | Низкое | Обертка с scoped CSS, pt-атрибуты, или откат на ручной компонент. |
| `ConfirmDialog` требует глобального `<ConfirmDialog />` в layout | Средняя | Среднее | Добавить компонент в `App.vue` или `DefaultLayout`/`AdminLayout` как part of пакета 2. |
| Регрессия в мобильном отображении | Средняя | Среднее | Проверка breakpoints после каждого пакета. |

## Out of Scope

- **RichEditor**: остается заглушкой. Переход на `Editor` (PrimeVue) требует отдельного решения о необходимости WYSIWYG, выборе библиотеки (Quill-based `Editor` или другая), и тестирования sanitize/HTML-output. Вынесено за рамки этой задачи.
- **Замена `vue-chartjs` на `Chart` (PrimeVue)**: текущие графики работают корректно, замена не дает значимого выигрыша.
- **Переход с `vuedraggable` на `OrderList`**: drag-and-drop для категорий/областей работает, замена не критична.

## Критерии успеха всего проекта

1. Все компоненты из пакетов 1 и 2 заменены на PrimeVue без функциональных регрессий.
2. Покрытие тестами (если есть) не сломано. Линтеры (`eslint`, `stylelint`, `fsd:check`) проходят.
3. Визуальный diff (ручной или скриншотный) не показывает различий в ключевых сценариях.
4. Пакет 3 выполнен в объеме, который не требует значительных кастомных стилей для PrimeVue-компонентов.

## Порядок реализации

1. Пакет 1 (High Impact) — отдельная ветка, PR, review, merge.
2. Пакет 2 (Medium Impact) — отдельная ветка, PR, review, merge.
3. Пакет 3 (Low Impact) — отдельная ветка, PR, review, merge.

Каждый пакет может быть реализован параллельно с пакетом предыдущего, но merge только после стабилизации предыдущего.
