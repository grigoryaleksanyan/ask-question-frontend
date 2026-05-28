# Исправление конфигураций линтеров

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Устранить проблемы в конфигурациях ESLint, Stylelint, lint-staged и better-commits, выявленные при аудите.

**Architecture:** Точечные правки конфигурационных файлов без изменения исходного кода приложения. Порядок: ESLint → Stylelint → lint-staged → better-commits → финальная верификация.

**Tech Stack:** ESLint 10 (flat config), Stylelint 17, Prettier 3, lint-staged 17, better-commits

---

### Task 1: Подключить eslint-import-resolver-vite вместо typescript

**Files:**
- Modify: `eslint.config.js:28-43`

Резолвер `typescript` используется в проекте без TypeScript. `eslint-import-resolver-vite` установлен, но не подключён — он нативно понимает алиасы Vite из `vite.config.*`.

- [ ] **Step 1: Прочитать vite.config для получения алиасов**

Запустить: `ls vite.config.*`
Определить, какие алиасы определены в Vite (ожидается `@` → `./src`).

- [ ] **Step 2: Заменить резолвер в eslint.config.js**

Заменить блок `settings`:

```js
settings: {
  'import-x/resolver': {
    typescript: {
      alwaysTryTypes: false,
      paths: {
        '@': ['./src'],
      },
    },
  },
},
```

на:

```js
settings: {
  'import-x/resolver': {
    vite: {
      configPath: './vite.config.js',
    },
  },
},
```

- [ ] **Step 3: Убедиться, что eslint-import-resolver-vite корректно резолвит алиасы**

Запустить: `npm run eslint:check`
Ожидание: 3 warning (`vue/no-v-html`), 0 errors.

- [ ] **Step 4: Удалить eslint-import-resolver-typescript из devDependencies**

Запустить: `npm uninstall eslint-import-resolver-typescript`

- [ ] **Step 5: Запустить eslint:check после удаления**

Запустить: `npm run eslint:check`
Ожидание: 3 warning, 0 errors.

- [ ] **Step 6: Commit**

```bash
git add eslint.config.js package.json package-lock.json
git commit -m "chore(lint): switch import resolver from typescript to vite"
```

---

### Task 2: Включить import-x/no-unresolved и проверить

**Files:**
- Modify: `eslint.config.js:259`

Правило `import-x/no-unresolved: off` отключает проверку существования импортируемых модулей. С корректным vite-резолвером (из Task 1) его можно включить.

- [ ] **Step 1: Включить правило**

Заменить в `eslint.config.js`:

```js
'import-x/no-unresolved': 'off',
```

на:

```js
'import-x/no-unresolved': 'error',
```

- [ ] **Step 2: Запустить eslint:check и проанализировать ошибки**

Запустить: `npm run eslint:check`
Ожидание: могут появиться ошибки на динамических импортах в роутере или на глобальных компонентах. Зафиксировать список.

- [ ] **Step 3: Если есть ложные срабатывания — добавить ignores для конкретных строк или отключить с пояснением**

Если ошибки есть на валидных динамических `import()` — добавить inline `// eslint-disable-next-line import-x/no-unresolved` с комментарием-причиной. Если ошибок нет — перейти к Step 4.

- [ ] **Step 4: Commit**

```bash
git add eslint.config.js
git commit -m "chore(lint): enable import-x/no-unresolve rule"
```

---

### Task 3: Подключить или удалить eslint-plugin-vuetify

**Files:**
- Modify: `eslint.config.js` (если подключаем)
- Modify: `package.json` (если удаляем)

`eslint-plugin-vuetify@2.7.2` установлен, но не используется в конфигурации. Нужно решить: подключить или удалить.

- [ ] **Step 1: Проверить, какие правила даёт eslint-plugin-vuetify**

Запустить: `npm info eslint-plugin-vuetify` — оценить актуальность для Vuetify 4.
Если плагин устарел или несовместим с Vuetify 4 — перейти к удалению (Step 2a). Если полезен — подключить (Step 2b).

- [ ] **Step 2a: Удалить плагин (если несовместим)**

Запустить: `npm uninstall eslint-plugin-vuetify`
Запустить: `npm run eslint:check` — проверить, что всё работает.

- [ ] **Step 2b: Подключить плагин (если совместим)**

Добавить в `eslint.config.js` после `pluginUnicorn.configs['flat/recommended']`:

```js
import pluginVuetify from 'eslint-plugin-vuetify';

// в массив конфигов:
pluginVuetify.configs['flat/recommended'],
```

Запустить: `npm run eslint:check` — проверить, что нет новых ошибок кроме ожидаемых.

- [ ] **Step 3: Commit**

```bash
git add eslint.config.js package.json package-lock.json
git commit -m "chore(lint): configure eslint-plugin-vuetify"
```

---

### Task 4: Ограничить import-x/no-extraneous-dependencies

**Files:**
- Modify: `eslint.config.js:282-285`

Текущая настройка `devDependencies: true` разрешает импорт дев-зависимостей из любого файла. Нужно ограничить.

- [ ] **Step 1: Заменить конфигурацию правила**

Заменить:

```js
'import-x/no-extraneous-dependencies': [
  'error',
  { devDependencies: true },
],
```

на:

```js
'import-x/no-extraneous-dependencies': [
  'error',
  {
    devDependencies: [
      'eslint.config.js',
      'vite.config.js',
      '**/vite.config.*',
      '.commitlintrc.cjs',
      '.better-commits.jsonc',
    ],
  },
],
```

- [ ] **Step 2: Запустить eslint:check**

Запустить: `npm run eslint:check`
Ожидание: не должно быть новых ошибок, т.к. src/ не импортирует devDeps напрямую. Если есть — проанализировать и добавить путь в массив.

- [ ] **Step 3: Commit**

```bash
git add eslint.config.js
git commit -m "chore(lint): restrict no-extraneous-dependencies to config files"
```

---

### Task 5: Исправить no-throw-literal и ecmaVersion

**Files:**
- Modify: `eslint.config.js:116,19`

- [ ] **Step 1: Включить no-throw-literal**

Заменить:

```js
'no-throw-literal': 'off',
```

на:

```js
'no-throw-literal': 'error',
```

- [ ] **Step 2: Обновить ecmaVersion**

Заменить:

```js
ecmaVersion: 2022,
```

на:

```js
ecmaVersion: 'latest',
```

- [ ] **Step 3: Запустить eslint:check**

Запустить: `npm run eslint:check`
Ожидание: если `no-throw-literal` даёт ошибки в src/ — исправить код (заменить `throw 'string'` на `throw new Error('string')`). Зафиксировать результат.

- [ ] **Step 4: Commit**

```bash
git add eslint.config.js src/
git commit -m "chore(lint): enable no-throw-literal, update ecmaVersion to latest"
```

---

### Task 6: Ослабить избыточные правила для Composition API проекта

**Files:**
- Modify: `eslint.config.js:60,68,61,136`

Эти правила избыточны для проекта на Vue Composition API:

- `class-methods-use-this: error` — в проекте почти нет классов
- `guard-for-in: error` — дублирует `no-restricted-syntax` ForInStatement
- `consistent-return: error` — часто вынуждает `return undefined`
- `no-shadow: error` — без allow для функций даёт ложные срабатывания

- [ ] **Step 1: Ослабить правила**

Замены в `eslint.config.js`:

```js
'class-methods-use-this': 'off',
```

```js
'guard-for-in': 'off',
```

```js
'consistent-return': 'off',
```

```js
'no-shadow': ['error', { allow: ['i', 'j', 'k', 'e', 'err', 'error', 'event', '_'] }],
```

- [ ] **Step 2: Запустить eslint:check**

Запустить: `npm run eslint:check`
Ожидание: предупреждения и ошибки не должны увеличиться.

- [ ] **Step 3: Commit**

```bash
git add eslint.config.js
git commit -m "chore(lint): relax rules irrelevant to composition api project"
```

---

### Task 7: Синхронизировать BEM-regex между ESLint и Stylelint

**Files:**
- Modify: `eslint.config.js:333-334`
- Modify: `.stylelintrc.json:11`

BEM-паттерн определён в двух местах с разными regex-синтаксисом. Нужно привести к идентичной логике.

ESLint: `/^(?![a-z]([a-z0-9-]+)?(__([a-z0-9]+-?)+)?(--([a-z0-9]+-?)+){0,2}$)/`
Stylelint: `^[a-z]([a-z0-9-]+)?(__([a-z0-9]+-?)+)?(--([a-z0-9]+-?)+){0,2}$`

ESLint-regex использует негативный lookahead (совпадает с НЕ-BEM), Stylelint-regex — позитивный (совпадает с BEM). Логически они идентичны, но синтаксис различается. Это нормально (разные движки), но нужно убедиться, что паттерны эквивалентны.

- [ ] **Step 1: Проверить эквивалентность паттернов**

В текущем виде:
- Stylelint: совпадает с корректным BEM → валидные классы проходят
- ESLint: совпадает с НЕ-BEM → валидные классы не совпадают с regex → нет ошибки

Логика эквивалентна. Добавить комментарий в оба файла для документирования связи.

- [ ] **Step 2: Добавить комментарии**

В `eslint.config.js` перед правилом `vue/no-restricted-class`:

```js
// BEM-паттерн (негативный lookahead) — синхронизирован с .stylelintrc.json selector-class-pattern
'vue/no-restricted-class': [
```

В `.stylelintrc.json` добавить комментарий через `$comment` (Stylelint не поддерживает JSON-комментарии, поэтому использовать `_comment` как необрабатываемое поле или переключить на `.stylelintrc.js` — но это нарушит сложившуюся конвенцию). Вместо этого — добавить `description` в package.json lint-скрипты не требуется. Проще всего оставить как есть, т.к. паттерны эквивалентны.

Решение: не менять файлы, т.к. паттерны логически эквивалентны, а JSON-формат Stylelint не поддерживает комментарии. Документировать связь через AGENTS.md при обновлении.

- [ ] **Step 3: Skip commit (no changes)**

---

### Task 8: Автофикс в lint-staged вместо --check

**Files:**
- Modify: `package.json:67-80`

Текущий `lint-staged` только проверяет форматирование, но не исправляет. Это создаёт плохой DX: коммит падает, но не фиксит.

- [ ] **Step 1: Заменить --check на --write в lint-staged**

Заменить в `package.json`:

```json
"lint-staged": {
  "src/**/*.js": [
    "prettier --check",
    "eslint"
  ],
  "src/**/*.vue": [
    "prettier --check",
    "eslint",
    "stylelint"
  ],
  "src/**/*.{css,scss}": [
    "prettier --check",
    "stylelint"
  ]
}
```

на:

```json
"lint-staged": {
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

- [ ] **Step 2: Проверить, что lint-staged корректно работает**

Запустить: `npx lint-staged --diff="HEAD"` (или закоммитить тестовый файл и проверить pre-commit hook).
Ожидание: файлы автофиксятся, коммит проходит.

- [ ] **Step 3: Commit**

```bash
git add package.json
git commit -m "chore(lint): auto-fix in lint-staged instead of check-only"
```

---

### Task 9: Исправить описание chore в better-commits

**Files:**
- Modify: `.better-commits.jsonc:68`

`build` и `chore` имеют одинаковый hint: "Общие правки проекта или изменения внешних зависимостей".

- [ ] **Step 1: Заменить hint для chore**

Заменить:

```jsonc
{
  "value": "chore",
  "label": "chore",
  "hint": "Общие правки проекта или изменения внешних зависимостей",
},
```

на:

```jsonc
{
  "value": "chore",
  "label": "chore",
  "hint": "Рутинные задачи, не влияющие на продакшен-код",
},
```

- [ ] **Step 2: Commit**

```bash
git add .better-commits.jsonc
git commit -m "fix(commit): differentiate chore hint from build"
```

---

### Task 10: Финальная верификация

**Files:** Нет изменений

- [ ] **Step 1: Запустить полный lint**

Запустить: `npm run lint`
Ожидание: Prettier pass, ESLint ≤3 warning (no-v-html), Stylelint pass.

- [ ] **Step 2: Запустить FSD-проверку**

Запустить: `npm run fsd:check`
Ожидание: No problems found.

- [ ] **Step 3: Запустить сборку**

Запустить: `npm run build`
Ожидание: Успешная сборка без ошибок.
