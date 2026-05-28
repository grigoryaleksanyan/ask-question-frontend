# Commitizen → Better-Commits Migration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Заменить commitizen + cz-customizable + @commitlint/cli на единый инструмент better-commits с сохранением всех текущих правил Conventional Commits (типы, scopes, лимит заголовка 72 символа, запрет breaking changes).

**Architecture:** better-commits объединяет интерактивный TUI для создания коммитов и валидацию формата в одном инструменте, устраняя необходимость в отдельном commitlint. Конфигурация переезжает из двух файлов (`configs/git/commitizen.cjs` + `configs/git/commitlint.cjs`) в один `.better-commits.jsonc`. Husky-хук `commit-msg` удаляется, так как валидация встроена в TUI.

**Tech Stack:** better-commits 1.23+, husky 9, lint-staged 17

---

## Сравнение подходов

| Аспект | Было (commitizen + commitlint) | Станет (better-commits) |
|--------|-------------------------------|-------------------------|
| Интерактивный коммит | `git-cz` (commitizen + cz-customizable) | `better-commits` |
| Валидация формата | `@commitlint/cli` через husky `commit-msg` хук | Встроена в TUI |
| Конфиг | 2 файла (`.cjs`) | 1 файл (`.jsonc`) |
| Пакеты | 3 пакета (commitizen, cz-customizable, @commitlint/cli) | 1 пакет (better-commits) |
| Защита от `git commit -m "..."` | Да (commitlint хук) | Нет* |

\* Если коммитить напрямую через `git commit -m "..."`, better-commits не валидирует формат. Это осознанный компромисс — команда `npm run commit` гарантирует валидный формат. При необходимости можно сохранить commitlint параллельно, но это не рекомендуется, так как дублирует функциональность.

---

## Текущая конфигурация (для справки)

**commitizen** (`configs/git/commitizen.cjs`):
- 10 типов: build, ci, docs, feat, fix, perf, refactor, revert, style, test, chore
- 3 scope: general, client, server
- allowCustomScopes: true
- subjectLimit: 72
- allowBreakingChanges: false
- Подсказки на русском языке

**commitlint** (`configs/git/commitlint.cjs`):
- header-max-length: 72
- scope-case: lower-case
- subject-empty: never
- subject-full-stop: never '.'
- type-case: lower-case
- type-empty: never
- type-enum: тот же список типов

**Husky:**
- `commit-msg`: `npx commitlint -g './configs/git/commitlint.cjs' --edit $1`
- `pre-commit`: `npx lint-staged` (не затрагивается)

---

### Task 1: Удалить старые пакеты

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Удалить commitizen, cz-customizable, @commitlint/cli из devDependencies**

```bash
npm uninstall commitizen cz-customizable @commitlint/cli
```

- [ ] **Step 2: Удалить секцию `config` из package.json**

В `package.json` удалить весь блок:

```json
"config": {
  "commitizen": {
    "path": "./node_modules/cz-customizable"
  },
  "cz-customizable": {
    "config": "./configs/git/commitizen.cjs"
  }
},
```

- [ ] **Step 3: Обновить скрипт `commit` в package.json**

Заменить:

```json
"commit": "git-cz"
```

на:

```json
"commit": "better-commits"
```

- [ ] **Step 4: Проверить, что package.json корректен**

```bash
npm pkg get scripts.commit
```

Expected: `better-commits`

---

### Task 2: Установить better-commits

**Files:**
- Modify: `package.json` (через npm install)

- [ ] **Step 1: Установить better-commits как devDependency**

```bash
npm install -D better-commits
```

- [ ] **Step 2: Проверить установку**

```bash
npx better-commits --help
```

Expected: вывод справки better-commits

---

### Task 3: Создать конфигурацию .better-commits.jsonc

**Files:**
- Create: `.better-commits.jsonc`

- [ ] **Step 1: Создать файл .better-commits.jsonc**

Создать файл `.better-commits.jsonc` в корне проекта с содержимым, эквивалентным текущей конфигурации:

```jsonc
{
  "check_status": true,
  "check_status_autocomplete": true,

  "commit_type": {
    "enable": true,
    "initial_value": "feat",
    "max_items": 20,
    "infer_type_from_branch": true,
    "append_emoji_to_label": false,
    "append_emoji_to_commit": false,
    "emoji_commit_position": "Start",
    "autocomplete": true,
    "options": [
      {
        "value": "build",
        "label": "build",
        "hint": "Общие правки проекта или изменения внешних зависимостей",
      },
      {
        "value": "ci",
        "label": "ci",
        "hint": "Настройка CI и работа со скриптами",
      },
      {
        "value": "docs",
        "label": "docs",
        "hint": "Обновление документации",
      },
      {
        "value": "feat",
        "label": "feat",
        "hint": "Добавление нового функционала",
      },
      {
        "value": "fix",
        "label": "fix",
        "hint": "Исправление ошибок",
      },
      {
        "value": "perf",
        "label": "perf",
        "hint": "Изменения направленные на улучшение производительности",
      },
      {
        "value": "refactor",
        "label": "refactor",
        "hint": "Правки кода без исправления ошибок или добавления новых функций",
      },
      {
        "value": "revert",
        "label": "revert",
        "hint": "Откат на предыдущие коммиты",
      },
      {
        "value": "style",
        "label": "style",
        "hint": "Правки по кодстайлу (табы, отступы, точки, запятые и т.д.)",
      },
      {
        "value": "test",
        "label": "test",
        "hint": "Добавление тестов",
      },
      {
        "value": "chore",
        "label": "chore",
        "hint": "Общие правки проекта или изменения внешних зависимостей",
      },
    ],
  },

  "commit_scope": {
    "enable": true,
    "custom_scope": true,
    "initial_value": "general",
    "infer_scope_from_branch": true,
    "max_items": 20,
    "autocomplete": true,
    "options": [
      { "value": "general", "label": "general" },
      { "value": "client", "label": "client" },
      { "value": "server", "label": "server" },
      { "value": "", "label": "none" },
    ],
  },

  "check_ticket": {
    "infer_ticket": true,
    "confirm_ticket": true,
    "add_to_title": false,
    "prepend_hashtag": "Never",
    "surround": "",
    "title_position": "start",
  },

  "commit_title": {
    "max_size": 72,
  },

  "commit_body": {
    "enable": true,
    "required": false,
    "split_by_period": false,
  },

  // breaking-change убран из options, т.к. allowBreakingChanges был false
  "commit_footer": {
    "enable": true,
    "initial_value": [],
    "options": ["closes", "trailer", "deprecated", "custom"],
  },

  "breaking_change": {
    "add_exclamation_to_title": false,
  },

  "confirm_with_editor": false,
  "confirm_commit": true,
  "cache_last_value": true,
  "print_commit_output": true,
}
```

> **Примечание:** Опция `overrides.shell` для Windows не добавлена по умолчанию. Если при многострочных коммитах на Windows возникнут проблемы, добавьте:
> ```jsonc
> "overrides": {
>   "shell": "c:\\Program Files\\Git\\bin\\bash.exe"
> }
> ```

- [ ] **Step 2: Проверить, что better-commits подхватывает конфиг**

```bash
npx better-commits --dry-run
```

Expected: запуск TUI с отображением русских подсказок в типах коммитов

---

### Task 4: Удалить husky commit-msg хук

**Files:**
- Delete: `.husky/commit-msg`

- [ ] **Step 1: Удалить файл .husky/commit-msg**

Хук вызывал commitlint, который больше не нужен. better-commits валидирует формат встроенными средствами.

```bash
rm .husky/commit-msg
```

- [ ] **Step 2: Проверить, что хук удалён**

```bash
ls .husky/
```

Expected: только `pre-commit` и `.gitignore` (без `commit-msg`)

---

### Task 5: Удалить старые конфигурационные файлы

**Files:**
- Delete: `configs/git/commitizen.cjs`
- Delete: `configs/git/commitlint.cjs`

- [ ] **Step 1: Удалить configs/git/commitizen.cjs**

```bash
rm configs/git/commitizen.cjs
```

- [ ] **Step 2: Удалить configs/git/commitlint.cjs**

```bash
rm configs/git/commitlint.cjs
```

- [ ] **Step 3: Проверить, остался ли каталог configs/git/ пустым**

```bash
ls configs/git/
```

Если каталог пуст — удалить его:

```bash
rmdir configs/git/
```

Аналогично проверить `configs/`:

```bash
ls configs/
```

Если пуст — удалить:

```bash
rmdir configs/
```

---

### Task 6: Обновить AGENTS.md

**Files:**
- Modify: `AGENTS.md`

- [ ] **Step 1: Обновить описание команды `npm run commit`**

Заменить:

```
- `npm run commit` — интерактивный коммит через commitizen (Conventional Commits)
```

на:

```
- `npm run commit` — интерактивный коммит через better-commits (Conventional Commits)
```

- [ ] **Step 2: Обновить секцию «Коммиты»**

Заменить:

```
Conventional Commits: типы `build|ci|docs|feat|fix|perf|refactor|revert|style|test|chore`, scope в lowercase, заголовок ≤ 72 символов, без точки в конце. Конфиг commitlint: `configs/git/commitlint.cjs`, commitizen: `configs/git/commitizen.cjs`. Pre-commit: lint-staged.
```

на:

```
Conventional Commits: типы `build|ci|docs|feat|fix|perf|refactor|revert|style|test|chore`, scope в lowercase, заголовок ≤ 72 символов, без точки в конце. Конфиг better-commits: `.better-commits.jsonc`. Pre-commit: lint-staged. Breaking changes отключены.
```

---

### Task 7: Добавить .better-commits.jsonc в .gitignore (опционально)

**Files:**
- Modify: `.gitignore` (если принято решение не коммитить конфиг)

> **Решение:** Рекомендуется **закоммитить** `.better-commits.jsonc`, чтобы вся команда использовала одинаковую конфигурацию. Не добавляйте его в `.gitignore`. Пропустите этот таск.

- [ ] **Step 1: Пропущен** — конфиг должен быть в репозитории

---

### Task 8: Финальная проверка

**Files:** — нет изменений

- [ ] **Step 1: Проверить, что npm run commit запускает better-commits**

```bash
npm run commit
```

Expected: запуск TUI better-commits с русскими подсказками, списком типов (feat, fix, и т.д.), scopes (general, client, server + custom)

- [ ] **Step 2: Проверить, что pre-commit хук работает**

Создать тестовый коммит через `npm run commit` и убедиться, что lint-staged отрабатывает корректно.

- [ ] **Step 3: Проверить, что прямые git commit -m больше не валидируются**

```bash
git commit -m "bad message"
```

Expected: коммит проходит без ошибки (commitlint удалён). Это ожидаемое поведение.

- [ ] **Step 4: Откатить тестовые коммиты (если создавались)**

```bash
git reset HEAD~1
```

---

## Итого изменений

| Файл | Действие |
|------|----------|
| `package.json` | Изменить: скрипт `commit`, удалить `config`, обновить `devDependencies` |
| `.better-commits.jsonc` | Создать: новый конфиг |
| `.husky/commit-msg` | Удалить |
| `configs/git/commitizen.cjs` | Удалить |
| `configs/git/commitlint.cjs` | Удалить |
| `configs/git/` | Удалить (если пуст) |
| `configs/` | Удалить (если пуст) |
| `AGENTS.md` | Обновить: ссылки на commitizen → better-commits |
