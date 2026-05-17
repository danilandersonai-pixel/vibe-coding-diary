# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project context

Stanza Diary (`stanza-diary`) — локальный PWA-ежедневник в стиле Stanza Terminal. Vanilla JS, без сборщика, без фреймворка. Все данные хранятся в браузере (`localStorage`).

Язык проекта — русский: вся UI-копия, документация, имена тегов и пользовательский текст на русском. Идентификаторы в коде — на английском. При написании UI-строк, сообщений и документов отвечать и писать **на русском**.

## Commands

```bash
npm run dev              # python3 -m http.server 4173 — локальный сервер для PWA
npm run check            # node --check app.js && node --check sw.js
npm run check:manifest   # проверка JSON-валидности manifest.webmanifest
```

PWA (`sw.js`) регистрируется только при запуске через сервер, не через `file://`. Тестов нет.

## Architecture

Это **монолитное статическое приложение**. Точка входа — `index.html`. Вся логика в одном файле `app.js` (~860 строк), вся разметка — в одном `index.html`, все стили — в одном `styles.css`.

Ключевые роли файлов:

- `app.js` — глобальный объект `state`, рендеры (`renderAll`, `renderCalendar`, `renderHistory`, `renderStats`, `renderWeeklyOverview`), хранилище, импорт/экспорт, шаблоны, автосейв, навигация по экранам.
- `index.html` — все экраны (login / today / history / stats / settings / edit) в виде `<section class="view" data-view="...">`. Переключение через `setView()` добавляет/снимает класс `is-active`.
- `styles.css` — дизайн-система Stanza Terminal (см. `reference/DESIGN.md`). JetBrains Mono + Literata + Material Symbols.
- `sw.js` + `manifest.webmanifest` — PWA-обёртка (cache-first для статики).
- `reference/` — **HTML-макеты дизайнера, не подключаются в рантайме**. Источник правды для верстки экранов.
- `docs/` — главный источник архитектурных решений и плана. Перед нетривиальными изменениями читать соответствующий документ.

### Storage layer

Данные хранятся в `localStorage` под версионированными ключами (объявлены в начале `app.js`):

- `stanza-diary.entries.v1` — записи (объект `{ "YYYY-MM-DD": Entry }`)
- `stanza-diary.settings.v1` — настройки
- `stanza-diary.pin.v1` — PIN-блокировка `{ hash, salt }` (с 0.2.0; отсутствует если PIN не задан)
- `stanza-diary.seeded.v1` — флаг демо-данных
- `stanza-diary.auth.v1` — **удалённый** legacy-ключ, стирается при старте через `LEGACY_AUTH_KEY`

Схему записи см. в [docs/DATA_MODEL.md](docs/DATA_MODEL.md). При импорте всё прогоняется через `normalizeEntries()` — не доверять входным JSON напрямую.

**Важно:** Storage repository пока **не существует** как отдельный слой — `app.js` обращается к `localStorage` напрямую. Этап 2 roadmap планирует вынести его в `storage/repository.js` перед миграцией на IndexedDB. Если делаешь крупный рефакторинг хранилища — сначала прочитай [docs/IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md) §2 и [docs/DECISIONS.md](docs/DECISIONS.md) §003.

### View system

`state.view` хранит активный экран (`today` | `history` | `stats` | `settings` | `edit`). `setView()` — единственный путь смены экрана; он же дёргает `renderAll()`. Не добавляй параллельный механизм навигации — расширяй `setView`.

### Autosave

Поля формы записи на `input` дёргают `queueAutosave()` (debounce 550 мс). Статус автосейва — отдельный микро-стейт-машина в `setAutosaveStatus(status)` со значениями `saved | saving | error | off`. При ручном `submit` очередь сбрасывается через `clearQueuedAutosave()`. Если меняешь поля записи — следи, чтобы новые поля попадали в `entryFromFields()`, `fillEntryForm()`, `emptyEntry()` и `normalizeEntries()` одновременно.

## Architectural rules (из docs/)

Эти правила взяты из [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) и [docs/DECISIONS.md](docs/DECISIONS.md) — соблюдать при любых изменениях:

- **UI не должен напрямую знать детали хранилища.** При вводе новых функций предпочитать обращение к функциям над прямым `localStorage.getItem/setItem`, чтобы будущая миграция на IndexedDB была проще.
- **Импорт данных проходит через `normalizeEntries()`.** Не парсить пользовательский JSON в обход нормализации.
- **AI-функции не подключать** до появления приватности и управления ключами (см. [docs/DECISIONS.md](docs/DECISIONS.md) §002 и [docs/PRIVACY.md](docs/PRIVACY.md)). Идеи AI собираются в `docs/IDEAS.md`, но в код не идут.
- **Vanilla JS — осознанный выбор**, не временное состояние. Не предлагать React/Vite без обсуждения — это решение задокументировано в DECISIONS §001.
- **Локальная автоматизация разрешена** (шаблоны дня, недельный обзор, напоминания), AI-автоматизация — нет.

## Documentation conventions

При изменении функциональности обновлять:

- `CHANGELOG.md` — формат близок к Keep a Changelog, версии в `package.json`.
- `ROADMAP.md` — отмечать выполненные пункты `[x]` в соответствующем этапе.
- `docs/ARCHITECTURE.md` / `docs/DATA_MODEL.md` — если меняется структура файлов или схема данных.
- `docs/DECISIONS.md` — при принятии новых архитектурных решений добавлять пронумерованную запись с датой и причинами.

Все документы — на русском. Стиль документов — короткие декларативные предложения, маркированные списки.

## Verification checklist

После изменений в JS/JSON-файлах:

```bash
npm run check                                    # после правок app.js или sw.js
npm run check:manifest                           # после правок manifest.webmanifest
python3 -c "import json; json.load(open('package.json'))"  # после правок package.json
```

UI-изменения проверять в браузере через `npm run dev` — типичные регрессии: смена `data-view`/`data-nav` атрибутов ломает навигацию, добавление поля в форму без обновления всех четырёх связанных функций (см. Autosave выше) ломает сохранение.
