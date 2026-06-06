# Сохранение состояния фильтров страницы вопросов

## Проблема

При переходе с `/questions` на `/question/:id` и возврате назад сбрасываются: выбранный статус (таб), страница пагинации, фильтры (спикер, область), сортировка, поисковый запрос.

## Решение

Подход A: query-параметры URL. Все параметры фильтрации хранятся в query-строке маршрута `/questions`. Это обеспечивает:

- Сохранение при навигации вперёд/назад (Vue Router)
- Сохранение при F5 (URL содержит состояние)
- Закладки и шаринг ссылок с фильтрами
- Обратная навигация кнопкой браузера автоматически восстанавливает состояние

Область применения: только публичная страница `/questions`.

## URL-параметры

| Параметр     | Тип               | Дефолт   | Описание                                      |
| ------------ | ----------------- | -------- | --------------------------------------------- |
| `status`     | `string`          | `"new"`  | Таб статуса: `new` / `inFocus` / `answered`   |
| `page`       | `number`          | `1`      | Номер страницы пагинации                      |
| `speakerId`  | `string`          | —        | ID выбранного спикера (отсутствует = не выбран)|
| `areaId`     | `string`          | —        | ID выбранной области (отсутствует = не выбрана)|
| `sortOrder`  | `string`          | `"desc"` | Сортировка: `asc` / `desc`                    |
| `search`     | `string`          | —        | Поисковый запрос (отсутствует = пустой)       |

Принципы:

- Таб статуса хранится как строковый ключ (`new`, `inFocus`, `answered`), а не как числовой `QuestionStatusId` — для читаемости URL
- Параметры с дефолтными значениями опускаются из URL
- Пустые параметры не добавляются (нет `?speakerId=`)

Примеры:

- `/questions` — дефолт: новые, страница 1, по убыванию
- `/questions?status=answered&page=3` — отвеченные, страница 3
- `/questions?speakerId=abc123&sortOrder=asc&search=микросервисы` — со спикером, по возрастанию, поиск

## Composable `useQuestionsFilters`

Расположение: `src/entities/question/lib/use-questions-filters/`.

Экспорт через `entities/question/index.ts`.

### Интерфейс

```ts
interface QuestionsFiltersState {
  status: ComputedRef<string>;
  page: ComputedRef<number>;
  speakerId: ComputedRef<string | null>;
  areaId: ComputedRef<string | null>;
  sortOrder: ComputedRef<'asc' | 'desc'>;
  search: ComputedRef<string>;
}

interface QuestionsFiltersActions {
  setStatus(value: string): void;
  setPage(value: number): void;
  setSpeakerId(value: string | null): void;
  setAreaId(value: string | null): void;
  setSortOrder(value: 'asc' | 'desc'): void;
  setSearch(value: string): void;
  resetFilters(): void;
}

function useQuestionsFilters(): QuestionsFiltersState & QuestionsFiltersActions;
```

### Принцип работы

1. **Чтение:** composable читает `route.query`, парсит значения, подставляет дефолты для отсутствующих параметров. Результат — набор `computed` от `route.query`.

2. **Запись:** каждый `set*`-метод вызывает `router.push({ query: updatedQuery })`, обновляя URL. Vue Router реактивно обновляет `route.query`, и `computed` внутри composable пересчитываются.

3. **Единый источник истины:** URL. Все `computed`-ссылки внутри composable вычисляются из `route.query`, а не хранятся как независимые `ref`. Изменение UI → `set*` → обновление URL → `computed` обновляется → UI реактивно перерисовывается.

4. **Фильтрация дефолтов:** при записи в URL параметры с дефолтными значениями (`status=new`, `page=1`, `sortOrder=desc`) опускаются — URL остаётся чистым.

5. **Сброс страницы:** методы `setStatus`, `setSpeakerId`, `setAreaId`, `setSortOrder` автоматически устанавливают `page=1` при изменении значения — это часть бизнес-логики composable. `setPage` и `setSearch` НЕ сбрасывают страницу.

6. **`resetFilters()`** — устанавливает все параметры в дефолты (аналог перехода на `/questions` без query).

7. **Маппинг статуса:** внутри composable маппинг `status` (строка) ↔ `QuestionStatusId` (число) для передачи в `QuestionListParams`. Таб `status` хранится как строка в URL, а в API передаётся число.

### Debounce поиска

`setSearch` вызывается с debounce 300мс. Промежуточное значение для `InputText` хранится как отдельный `ref` внутри `QuestionsView`, а в URL попадает только итоговое значение после debounce.

## Изменения компонентов

### QuestionsView

Основная точка изменений.

1. **Замена локальных ref на composable.** Удаляются: `activeTab`, `currentPage`, `firstRow`, `filterSortOrder`, `filterSpeakerId`, `filterAreaId`, `searchQuery`. Вместо них:

   ```ts
   const {
     status, page, speakerId, areaId, sortOrder, search,
     setStatus, setPage, setSpeakerId, setAreaId, setSortOrder, setSearch,
   } = useQuestionsFilters();
   ```

2. **Связь с UI:**
   - `SelectButton` (табы статуса): при изменении вызывает `setStatus`
   - `Paginator`: `firstRow` вычисляется из `(page - 1) * pageSize`, при изменении `firstRow` вызывает `setPage`
   - `InputText` (поиск): привязан к локальному `searchInput` ref, через debounce вызывает `setSearch`
   - `QuestionFilters`: получает текущие значения как props + emits вызывает `set*`-методы

3. **Единый watch на `params` computed → `fetchData()`:** вместо отдельных `watch` на каждый ref. При любом изменении URL → `params` пересчитывается → `fetchData()`.

4. **Удаление ручных `currentPage = 1`:** composable автоматически сбрасывает страницу при смене фильтров.

5. **Начальный `fetchData()`:** вызывается при монтировании (как сейчас), параметры берутся из composable.

### QuestionFilters

Минимальные изменения.

1. Новые props для текущих значений: `modelSpeakerId`, `modelAreaId`, `modelSortOrder`
2. Внутренние `ref` инициализируются из props вместо хардкода дефолтов
3. Событие `change` сохраняется — `QuestionsView` делегирует его в `set*`-методы composable

### QuestionCard

Без изменений.

### QuestionIdView

Без изменений. Возврат через `<router-link to="/questions">` — Vue Router автоматически восстановит предыдущий URL из history.

## Восстановление scroll-позиции

Механизм: `sessionStorage` по ключу `questions-scroll`.

### Запись

В `QuestionCard.navigateToQuestion()`, перед `router.push()`:

```ts
function navigateToQuestion() {
  sessionStorage.setItem('questions-scroll', String(window.scrollY));
  router.push(`/question/${question.id}`);
}
```

### Чтение

В `QuestionsView.onMounted()`: если в `sessionStorage` есть значение и мы пришли с detail-страницы:

```ts
onMounted(() => {
  const scrollY = sessionStorage.getItem('questions-scroll');
  const cameFromDetail = router.options.history.state.back?.includes('/question/');
  if (scrollY && cameFromDetail) {
    nextTick(() => window.scrollTo(0, Number(scrollY)));
  } else {
    sessionStorage.removeItem('questions-scroll');
  }
  fetchData();
});
```

### Почему sessionStorage

- Scroll-позиция — не бизнес-параметр, не должна быть в закладках
- sessionStorage автоматически очищается при закрытии вкладки
- Один ключ, не зависит от query-параметров — позиция привязана к текущему набору фильтров, который уже в URL

### Почему не keep-alive

`keep-alive` на `<router-view>` сохранил бы компонент целиком, но конфликтует с query-параметрами: при возврате назад URL обновится, а компонент не перемонтируется — нужна ручная синхронизация. Проще перемонтировать и восстановить scroll из sessionStorage.

## Обработка edge cases

- **Невалидные query-параметры:** composable валидирует значения (например, `page` — положительное число, `status` — один из допустимых ключей) и подставляет дефолты при ошибке парсинга
- **Прямой переход по закладке:** `fetchData()` срабатывает при монтировании с параметрами из URL — данные загружаются корректно
- **Навигация из меню в /questions:** scroll не восстанавливается (нет записи в sessionStorage), параметры из URL применяются
