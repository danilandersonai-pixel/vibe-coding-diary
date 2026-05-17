# Data Model

Документ фиксирует текущую модель данных и направление перехода к IndexedDB.

## Storage keys

Текущие ключи `localStorage`:

- `stanza-diary.entries.v1` — записи;
- `stanza-diary.settings.v1` — настройки;
- `stanza-diary.seeded.v1` — флаг демо-данных;
- `stanza-diary.pin.v1` — запись PIN-блокировки `{ hash, salt }` или отсутствует.

Удалённые ключи (миграция):

- `stanza-diary.auth.v1` — стирается при старте, был бутафорским флагом «вошёл».

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

- `autoLockMinutes`;
- `theme`;
- `backupReminder`;
- `defaultTemplateId`.

## PIN record (с 0.2.0)

```json
{
  "hash": "f3a8...d2",
  "salt": "Yk0v8q...=="
}
```

- `hash` — `SHA-256("<pin>::<salt>")` в hex;
- `salt` — 16 случайных байт через `crypto.getRandomValues`, в base64;
- Отсутствие ключа = PIN не задан, дневник открывается без блокировки.

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
