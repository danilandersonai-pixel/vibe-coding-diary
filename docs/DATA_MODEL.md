# Data Model

Документ фиксирует текущую модель данных и направление перехода к IndexedDB.

## Storage keys

Текущие ключи `localStorage`:

- `stanza-diary.entries.v1` — записи;
- `stanza-diary.auth.v1` — локальный флаг входа;
- `stanza-diary.settings.v1` — настройки;
- `stanza-diary.seeded.v1` — флаг демо-данных.

## Entry

Запись привязана к календарной дате.

```json
{
  "date": "2026-05-16",
  "did": "Что сделал",
  "learned": "Что изучил",
  "result": "К чему пришёл",
  "failed": "Что не получилось",
  "tags": ["мысли", "планирование"],
  "updatedAt": "2026-05-16T17:00:00.000Z"
}
```

Поля:

- `date` — дата в формате `YYYY-MM-DD`, основной идентификатор записи;
- `did` — блок дневника;
- `learned` — блок дневника;
- `result` — блок дневника;
- `failed` — блок дневника;
- `tags` — массив тегов в нижнем регистре;
- `updatedAt` — дата последнего изменения.

## Settings

```json
{
  "reminders": false,
  "autosave": true
}
```

Будущие настройки:

- `pinEnabled`;
- `autoLockMinutes`;
- `theme`;
- `backupReminder`;
- `defaultTemplateId`.

## IndexedDB target

Планируемая база:

```text
db: stanza-diary
version: 1
stores:
  entries, keyPath: date
  settings, keyPath: key
  meta, keyPath: key
indexes:
  entries.updatedAt
  entries.date
```

Интерфейс хранилища:

```js
getEntries()
saveEntry(entry)
deleteEntry(date)
clearEntries()
getSettings()
saveSettings(settings)
migrateFromLocalStorage()
```

## Migration path

1. Добавить storage repository поверх текущего `localStorage`.
2. Перевести UI на repository API.
3. Добавить IndexedDB adapter.
4. Добавить миграцию из `localStorage`.
5. Оставить экспорт JSON как пользовательский backup.
