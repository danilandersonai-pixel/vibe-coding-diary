---
name: Stanza Terminal
version: 2.0
description: Дизайн-система приложения "Дневник кодера" — личное приложение для рефлексии в обучении программированию.
colors:
  # Базовые поверхности
  background: '#16130a'
  surface: '#16130a'
  surface-dim: '#16130a'
  surface-bright: '#3d392e'
  surface-container-lowest: '#110e06'
  surface-container-low: '#1f1b12'
  surface-container: '#231f15'
  surface-container-high: '#2d2a1f'
  surface-container-highest: '#38342a'

  # Текст
  on-background: '#eae2d2'
  on-surface: '#eae2d2'
  on-surface-variant: '#c4c8ba'
  on-surface-muted: '#8a8170'

  # Инверсия (для светлой темы в будущем)
  inverse-surface: '#eae2d2'
  inverse-on-surface: '#343025'
  inverse-primary: '#4c6631'

  # Контуры
  outline: '#8e9285'
  outline-variant: '#44483d'
  outline-dim: '#2a2620'

  # Primary (терминальная зелень)
  primary: '#b5d493'
  on-primary: '#1f3606'
  primary-container: '#9ab87a'
  on-primary-container: '#304917'
  primary-fixed: '#cdedaa'
  primary-fixed-dim: '#b1d090'

  # Secondary (тёплый янтарь)
  secondary: '#efbf6d'
  on-secondary: '#422c00'
  secondary-container: '#6e4c00'
  on-secondary-container: '#efbe6d'
  secondary-fixed: '#ffdeab'
  secondary-fixed-dim: '#efbf6d'

  # Tertiary (нейтральный бежевый)
  tertiary: '#d4c8b5'
  on-tertiary: '#363022'
  tertiary-container: '#b7ad9b'
  on-tertiary-container: '#484133'

  # Ошибки и опасные действия
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'

  # Состояния (производные)
  state-hover: 'rgba(181, 212, 147, 0.08)'
  state-pressed: 'rgba(181, 212, 147, 0.16)'
  state-focus-ring: '#b5d493'
  state-disabled-bg: 'rgba(234, 226, 210, 0.12)'
  state-disabled-text: 'rgba(234, 226, 210, 0.38)'

typography:
  # Терминальный слой — JetBrains Mono
  display:
    fontFamily: JetBrains Mono
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: JetBrains Mono
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: JetBrains Mono
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  section-label:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0.05em
    textTransform: lowercase
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.1em
  caption:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 14px
    letterSpacing: 0.05em
  code-inline:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px

  # Журнальный слой — Literata (только для пользовательского текста)
  body-lg:
    fontFamily: Literata
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Literata
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Literata
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px

rounded:
  none: '0'
  sm: 0.125rem    # 2px — для чипов и тегов
  DEFAULT: 0.25rem # 4px — кнопки, инпуты
  md: 0.375rem    # 6px — карточки
  lg: 0.5rem      # 8px — модалки
  full: 9999px    # только для индикаторов состояний (точки, бейджи)

spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px        # element-gap
  lg: 24px        # container-padding
  xl: 32px        # stack-gap
  2xl: 48px       # section-margin
  3xl: 64px

borders:
  width: 1px
  style-default: solid
  style-divider: dashed
  pattern-dashed: '4 4'  # 4px штрих, 4px пропуск
---

# Дизайн-система: Stanza Terminal

> Это финальный, источник истины для дизайна и фронтенда приложения «Дневник кодера».
> Все экраны, компоненты и микрокопия должны соответствовать этому документу.
> Изменения — только через явное обсуждение и обновление версии.

## 1. Философия

Дизайн соединяет два мира: **строгую логику терминала разработчика** и **тёплое пространство личного журнала**. Эстетика — «Digital Hermit»: сосредоточенный, приватный, интеллектуально-тёплый.

**Стиль — Minimalist Hybrid.** Уходим от холода стандартных тёмных тем за счёт «тёплого чёрного» с оливковым подтоном и тактильной типографики. Каждый элемент должен ощущаться продуманным и тихим. Терминальные мотивы (моноширинный шрифт, мигающий курсор, пунктирные разделители) уравновешены сериф-шрифтом для длинных размышлений.

**Принцип «единственного декоративного решения».** В каждом экране допустим только один декоративный приём (мигающий курсор, заголовок-индикатор, и т.п.). Если хочется добавить второй — значит, нужно убрать первый. Декорация без функции запрещена.

### Чего избегаем

Нельзя добавлять элементы «для атмосферы», которые не несут смысла:
- Фейковые пути файлов в шапке (типа `// ROOT_DIRECTORY / daily_logs / 2026_05_13.md`)
- Версионные подписи без функции (`AUTH_MODULE_v.01_SECURED`)
- Имена системы для виду (`system_v0.1_` в шапке) — заменяем на реальное название приложения
- Двойные иконки одного смысла (крестик и у «редактировать», и у «удалить»)
- Декоративные пунктирные линии, обрамляющие контент без причины
- Псевдо-терминальные надписи вокруг полей ввода

Если элемент нельзя обосновать функционально — он не нужен.

---

## 2. Цвет

### Базовая палитра

Все цвета используются строго через токены. Никогда не пиши хексы прямо в коде — только переменные.

**Поверхности (от тёмного к светлому):**
- `background` / `surface` `#16130a` — основной фон приложения с тёплым оливковым подтоном
- `surface-container-lowest` `#110e06` — самый глубокий уровень (модалки, dropdown)
- `surface-container-low` `#1f1b12` — поля ввода, инлайн-код
- `surface-container` `#231f15` — карточки записей
- `surface-container-high` `#2d2a1f` — поднятые элементы при hover
- `surface-container-highest` `#38342a` — состояние pressed, активные чипы

**Текст:**
- `on-surface` `#eae2d2` — основной текст, кремовый
- `on-surface-variant` `#c4c8ba` — второстепенный текст
- `on-surface-muted` `#8a8170` — метаданные, плейсхолдеры, подсказки

**Акценты:**
- `primary` `#b5d493` — терминальная зелень. Основные действия, активные состояния, серия дней
- `secondary` `#efbf6d` — янтарь. Section-labels, выделение тегов, индикаторы внимания
- `tertiary` `#d4c8b5` — нейтральный бежевый. Третьестепенные элементы

**Опасность:**
- `error` `#ffb4ab` — текст и иконки для деструктивных действий

### Правила использования

1. **Зелёный — для действий.** Кнопка «Сохранить», тоггл «Включить напоминания», активный пункт навигации, число серии дней. Не используем зелёный для декорации.
2. **Янтарь — для меток.** Все section-labels (`// что сделал`), бейджи тегов, обозначения внимания. Никогда не для кнопок.
3. **Кремовый — для содержания.** Текст записей, заголовки, основная информация.
4. **Приглушённый серый — для метаданных.** Даты, плейсхолдеры, подсказки под полями.
5. **Красный — только для удаления и критических ошибок.** Не для предупреждений.

### Текстура фона

Едва заметная сетка из точек по всему фону:
- Цвет точки: `outline-dim` `#2a2620`
- Размер точки: 1px
- Шаг: 24px
- Реализация: CSS `background-image: radial-gradient(circle at 1px 1px, var(--outline-dim) 1px, transparent 0); background-size: 24px 24px;`

Точки не должны быть назойливыми — это тонкая текстура, которая ощущается, но не отвлекает.

---

## 3. Типография

### Два слоя — два шрифта

**Терминальный слой — JetBrains Mono.** Используется для всей системной информации: навигация, заголовки экранов, section-labels, метаданные (даты, числа), теги, кнопки, плейсхолдеры. Это «голос системы».

**Журнальный слой — Literata.** Используется ИСКЛЮЧИТЕЛЬНО для текста, который написал пользователь — содержимое полей записи. Это «голос человека». Literata разработана Google для длительного чтения на экране.

Это разделение критично. Не смешивай: подсказка под полем — JetBrains Mono, ввод в поле — Literata. Тег — JetBrains Mono, запись с упоминанием тега — Literata.

### Иерархия

| Стиль | Размер | Применение |
|---|---|---|
| `display` | 32/40 | Большие заголовки страниц (опционально) |
| `headline-lg` | 24/32 | Заголовок экрана |
| `headline-md` | 20/28 | Заголовок секции внутри экрана |
| `section-label` | 14/20 | Метки вида `// что сделал` |
| `label-md` | 13/18 | Кнопки, активные элементы |
| `label-sm` | 12/16 | Метаданные, маленькие лейблы (caps) |
| `caption` | 11/14 | Подписи к иконкам в нижней навигации |
| `body-lg` | 18/28 | Текст записей в дневнике (основной) |
| `body-md` | 16/24 | Текст подсказок, описаний |
| `body-sm` | 14/20 | Мелкий текст-проза |
| `code-inline` | 14/20 | Кодовые токены в записях |

### Соглашения

1. **Все section-labels — в формате `// section_name`.** Префикс `//` — это смысловой маркер «комментарий в коде». Строчные буквы. Без двоеточия в конце.
2. **Заголовок активного экрана получает мигающий курсор `_`** в виде декоративного элемента. Только один курсор на экране — у самого важного заголовка.
3. **Метки в моноширинном шрифте через `letter-spacing`** для воздуха, особенно в caps-вариантах (`label-sm`).
4. **Числа — всегда JetBrains Mono.** Даты, количество, счётчики. Даже внутри сериф-текста, если есть число — оно в моноширинном.
5. **В тексте записей разрешён инлайн-код.** Слова вида `git rebase`, `useState`, `--force-with-lease` оборачиваются в стиль `code-inline` с фоном `surface-container-low` и цветом `primary`.

### Чего НЕ делать с типографикой

- Не использовать курсив для целых блоков — это «иишный» приём. Курсив допустим только для коротких эмфатических вставок в Literata.
- Не использовать жирность для подчёркивания внутри блоков пользовательского текста. Дневник — это поток мысли, не статья.
- Не добавлять декоративных надписей вокруг полей ввода (типа `// auth_module_v.01`).

---

## 4. Раскладка и пространство

### Общие правила

- **Mobile-first.** Базовая ширина — 360-414px. Максимальная — 720px по центру на десктопе.
- **Container padding:** 24px по горизонтали на мобилке, 32px на десктопе.
- **Контент — одна колонка.** Никаких сайдбаров, никаких многоколонок.
- **Section margin:** 48px между крупными секциями. Это «дыхание» документа.
- **Stack gap:** 32px между подсекциями внутри одной смысловой группы.
- **Element gap:** 16px между связанными элементами (поле и его подсказка).

### Вертикальный ритм

Дневник — это вертикальное чтение. Не пытайся уплотнить, чтобы влезло больше — наоборот, давай контенту дышать. Лучше прокручивать, чем сжимать.

### Журнальный отступ

Тексты записей (на Literata) получают **левый отступ 24px** относительно section-label-ов. Это даёт визуальный «корешок блокнота» — section-label прижат к левому краю как комментарий, а текст записи отступает как абзац в книге.

### Разделители

- **Все горизонтальные разделители — пунктирные 1px** цветом `outline-variant` `#44483d`.
- Pattern: `4 4` (4px штрих, 4px пропуск).
- Не использовать сплошные линии. Не использовать длинные em-dash в HTML.
- **Между записями в списке — пунктирный разделитель.** Между секциями внутри одной записи — тоже пунктирный, но более приглушённый (можно `outline-dim`).

### Сетка для нижней навигации

На мобилке — фиксированная нижняя панель высотой 64px. Padding снизу учитывает safe-area для iPhone (env(safe-area-inset-bottom)).

---

## 5. Глубина и слои

Никаких теней. Никакого блюра. Глубина создаётся двумя способами:

1. **Тональная заливка.** Поверхности более «высокого» уровня получают чуть более светлый цвет (`surface-container-low` → `surface-container` → `surface-container-high`). Разница 6-12% яркости.
2. **Пунктирные контуры.** Карточки и группы определяются 1px dashed border, не shadow.

### Уровни

- **Уровень 0:** фон `background` `#16130a` + текстура точек
- **Уровень 1:** инпуты, инлайн-код `surface-container-low` `#1f1b12`
- **Уровень 2:** карточки записей `surface-container` `#231f15` с dashed-border `outline-variant`
- **Уровень 3:** hover-состояние карточек `surface-container-high` `#2d2a1f`
- **Уровень 4:** модалки и dropdowns `surface-container-lowest` `#110e06` с dashed-border

---

## 6. Формы

Язык форм — **прямолинейный (rectilinear)**. Углы — мягкие, но не круглые.

- **Кнопки, инпуты:** `rounded` `0.25rem` (4px)
- **Карточки:** `rounded-md` `0.375rem` (6px)
- **Модалки:** `rounded-lg` `0.5rem` (8px)
- **Чипы и теги:** `rounded-sm` `0.125rem` (2px) — почти прямоугольные
- **Полностью круглые элементы — только для индикаторов состояний** (точка-стрик активна, точка-новое-уведомление)

Никаких pill-форм (rounded-full на кнопках или тегах). Это противоречит языку системы.

---

## 7. Состояния интерактивных элементов

Каждый интерактивный элемент должен иметь все четыре состояния:

| Состояние | Что меняется |
|---|---|
| **Default** | Базовый вид |
| **Hover** | Overlay `state-hover` (зелёный 8% прозрачности), курсор `pointer` |
| **Focus** | Outline 2px `primary`, offset 2px |
| **Pressed/Active** | Overlay `state-pressed` (зелёный 16% прозрачности) |
| **Disabled** | Opacity 0.38, курсор `not-allowed`, без hover/pressed |

### Фокус-ринг

Все интерактивные элементы получают видимый focus-ring через клавиатуру. Это требование доступности.

```css
*:focus-visible {
  outline: 2px solid var(--state-focus-ring);
  outline-offset: 2px;
}
```

---

## 8. Компоненты

### 8.1 Кнопки

**Primary Button**
- Фон: `primary` `#b5d493`
- Текст: `on-primary` `#1f3606`
- Шрифт: `label-md` JetBrains Mono, lowercase
- Padding: 14px вертикальный, 24px горизонтальный
- Border-radius: 4px
- Hover: фон `primary-fixed-dim`
- Использование: главное действие на экране («сохранить запись», «отправить ссылку»)

**Secondary Button (Outlined)**
- Фон: transparent
- Border: 1px dashed `outline-variant`
- Текст: `on-surface` `#eae2d2`
- Шрифт: `label-md`
- Padding: 13px / 22px (учитываем 1px border)
- Hover: border переходит на `primary`, цвет текста на `primary`
- Использование: вторичные действия

**Text Button (Tertiary)**
- Фон: transparent
- Текст: `on-surface-muted`, с подчёркиванием при hover на `primary`
- Шрифт: `label-md`
- Использование: ссылки, мелкие действия («очистить фильтры», «выйти из аккаунта»)

**Danger Button**
- Только текст, цвет `error`, с иконкой треугольника-предупреждения слева
- Шрифт: `label-md`
- При нажатии — обязательное подтверждение в модалке
- Использование: «удалить все данные», «удалить запись»

### 8.2 Поля ввода

**Text Input**
- Фон: `surface-container-low`
- Border: 1px dashed `outline-variant`, в фокусе — 1px solid `primary`
- Текст: `on-surface`, JetBrains Mono для технических полей (email, дата), Literata для пользовательского текста
- Padding: 14px вертикальный, 16px горизонтальный
- Placeholder: `on-surface-muted`, italic в Literata, обычный в JetBrains Mono

**Textarea (для полей записи)**
- То же, но с мин-высотой 96px, max-height auto
- Шрифт: Literata `body-lg` (18px/28px)
- Padding слева 16px + 8px для эффекта «левого поля блокнота»
- Resize: vertical only

### 8.3 Section Labels

Все большие смысловые блоки начинаются с маркера:

```
// section_name
```

- Шрифт: `section-label` JetBrains Mono 14px
- Цвет: `secondary` `#efbf6d` (янтарь)
- Строчные буквы
- Префикс `//` — обязательный, без пробела между `//` и текстом не больше одного
- Под лейблом — пунктирная линия `outline-variant` на всю ширину контейнера
- Margin-bottom после лейбла: 24px

### 8.4 Карточки записей

**Свёрнутая карточка**
- Фон: `surface-container`
- Border: 1px dashed `outline-variant`
- Border-radius: 6px (md)
- Padding: 20px
- Содержит:
  - Дата слева в JetBrains Mono, цвет `primary` `#b5d493`
  - Теги по центру (или справа от даты), в стиле компонента Tag
  - Иконка `+` справа для разворачивания, цвет `on-surface-muted`
- Hover: фон → `surface-container-high`, border → `primary`

**Развёрнутая карточка**
- Под верхней строкой — пунктирный разделитель `outline-dim`
- Каждое поле записи — секция с section-label («что сделал», «что изучил» и т.д.)
- Текст полей — Literata `body-lg`, с левым отступом 16px относительно label
- Внизу справа — две ссылки: «редактировать» с иконкой карандаша, «удалить» с иконкой × и цветом `error`
- Иконка `+` справа меняется на `×` (поворот 45°)

### 8.5 Теги (Chips)

- Форма: прямоугольная с `rounded-sm` (2px), почти прямые углы
- Border: 1px dashed `secondary` `#efbf6d` (янтарь)
- Фон: transparent
- Текст: `secondary` `#efbf6d`, JetBrains Mono `label-sm`, lowercase
- Padding: 4px вертикальный, 8px горизонтальный
- В режиме редактирования — добавляется иконка `×` справа для удаления
- При hover в инпуте подсказок — фон `state-hover`

### 8.6 Stat Tile (плитка статистики)

- Фон: transparent (без карточной обёртки)
- Большое число: JetBrains Mono 32px (`display` style), цвет `primary` или `secondary`
- Подпись снизу: `label-sm` `on-surface-muted`, UPPERCASE с letter-spacing 0.1em
- Между числом и подписью — 8px
- Текст-подпись на 2 строки если длинная (`ЗАПИСЕЙ В НЕДЕЛЮ В СРЕДНЕМ`)

### 8.7 Toggle Switch

- Размер: 44px × 24px
- Off: фон `surface-container-high`, кружок `on-surface-muted`
- On: фон `primary`, кружок `on-primary` (тёмный)
- Анимация перехода: 200ms cubic-bezier(0.4, 0, 0.2, 1)

### 8.8 Bottom Navigation

- 4 пункта строго по спецификации: **Сегодня / История / Статистика / Настройки**
- (НЕ LOG/CODE/REF — это была отсебятина Stitch)
- Высота: 64px + safe-area
- Фон: `background` с верхним пунктирным border `outline-variant`
- Каждый пункт: иконка 20px + label `caption` (11px JetBrains Mono)
- Активный пункт: иконка и текст `primary`, неактивный — `on-surface-muted`
- Иконки — линейные, тонкие (1.5px stroke), стиль Phosphor или Lucide

### 8.9 Курсор

Мигающий подчёркивающий курсор `_` появляется **только в одном месте на экране** — после заголовка активного экрана. Это маркер «вы здесь».

- Цвет: `primary`
- Анимация: opacity 1 → 0 → 1, период 1.2s
- Никогда не использовать как декорацию (например, после section-label)

### 8.10 Модалки

- Фон оверлея: `rgba(22, 19, 10, 0.7)` (фон с прозрачностью)
- Контейнер: `surface-container-lowest` `#110e06`
- Border: 1px dashed `outline-variant`
- Border-radius: 8px (lg)
- Max-width: 480px
- Padding: 32px
- Заголовок: `headline-md` JetBrains Mono
- Текст: `body-md` Literata
- Кнопки: горизонтальный ряд, primary справа, secondary слева

---

## 9. Иконки

Используем линейные иконки толщиной stroke 1.5px из набора **Phosphor Icons** (Regular weight) или **Lucide**.

Размеры:
- В кнопках: 16px
- В навигации: 20px
- В заголовках/больших контекстах: 24px

Цвет иконок наследуется от родителя или явно указывается.

### Стандартные иконки приложения

- Редактировать: pencil
- Удалить: trash или x
- Поиск: magnifying-glass
- Фильтр: funnel или sliders
- Настройки: gear
- Назад: arrow-left или chevron-left
- Развернуть: plus (поворачивается в × при развёрнутом состоянии)
- Скачать: download или arrow-down-tray
- Загрузить: upload или arrow-up-tray
- Внешняя ссылка: arrow-square-out
- Предупреждение: warning-triangle

---

## 10. Микрокопия и тон

### Голос приложения

- На «ты» — это личное приложение
- Без восклицательных знаков (приложение не радуется за тебя)
- Без эмодзи в интерфейсе
- Без подбадриваний («молодец!», «ура!»)
- Без обращений «друг», «дорогой»
- Прямо, по делу, спокойно

### Примеры правильной микрокопии

| Контекст | Хорошо | Плохо |
|---|---|---|
| Пустое состояние истории | «Записей пока нет.» | «Здесь пока пусто. Сделай первую запись — и начнётся твоя история!» |
| Сохранение | «Сохранено.» | «Запись успешно сохранена! 🎉» |
| Подтверждение удаления | «Удалить запись от 13 мая? Это необратимо.» | «Вы уверены? Эта запись будет утеряна навсегда! 😱» |
| Ошибка | «Не удалось сохранить. Попробуй ещё раз.» | «Упс! Что-то пошло не так. Не переживай, мы уже работаем над этим.» |
| Плейсхолдер в поле | «коммиты, фичи, эксперименты» | «Например: настроил Telegram-бота, разобрался с переменными окружения...» |
| Подсказка под полем | «новые концепции, библиотеки, термины» | «Запиши, что ты узнал нового сегодня — это поможет тебе закрепить материал!» |

### Section-labels на экранах

| Где | Что писать |
|---|---|
| Главный экран | `// запись на сегодня` |
| Поля записи | `// что сделал`, `// что изучил`, `// к чему пришёл`, `// что не получилось`, `// теги` |
| История | `// записи`, `// фильтры` |
| Статистика | `// сводка`, `// активность за год`, `// объём по дням`, `// активность по неделям`, `// топ тегов` |
| Настройки | `// аккаунт`, `// внешний вид`, `// напоминания`, `// данные`, `// о приложении` |

---

## 11. Экраны — финальные спецификации

Для каждого экрана ниже — точное описание раскладки, чтобы переделать в Stitch предсказуемо.

### 11.1 Главная — `/`

**Структура сверху вниз:**

1. **Шапка приложения** (sticky, 56px):
   - Слева: название приложения «Дневник» в `headline-md` JetBrains Mono
   - Справа: иконка gear (настройки), 20px
   - Снизу — пунктирная линия

2. **Заголовок экрана** (margin-top 32px):
   - `headline-lg` JetBrains Mono: «Сегодня`_`» с мигающим курсором
   - Под ним `label-sm` `on-surface-muted`: дата на русском, например «среда, 13 мая 2026»

3. **Блок статистики** (margin-top 24px, padding-bottom 32px, пунктирная линия снизу):
   - Два StatTile в ряд
   - Слева: число в `primary` (например «0») + лейбл «СЕРИЯ ДНЕЙ»
   - Справа: число в `secondary` + лейбл «ВСЕГО ЗАПИСЕЙ»

4. **Section-label** «// запись на сегодня» (margin-top 48px)

5. **Форма записи** (margin-top 24px):
   - 4 textarea, каждое со своим section-label и подсказкой:
     - `// что сделал` — placeholder «коммиты, фичи, эксперименты»
     - `// что изучил` — placeholder «новые концепции, библиотеки, термины»
     - `// к чему пришёл` — placeholder «инсайты, выводы, решения»
     - `// что не получилось` — placeholder «баги, тупики, на чём застрял»
   - Между полями — gap 32px

6. **Section-label «// теги»** (margin-top 32px):
   - Под label — input для тегов с placeholder «через запятую»
   - Снизу под инпутом могут отображаться добавленные чипы

7. **Primary Button «сохранить запись»** (margin-top 32px, full-width)

8. **Нижняя навигация** (sticky, 64px + safe-area):
   - Сегодня (активна) / История / Статистика / Настройки

**Чего НЕ должно быть:**
- Никаких фейковых путей к файлам в шапке
- Никаких декоративных подписей «// auth_module» или подобных
- Никаких эмодзи настроения

### 11.2 Запись (развёрнутая в истории) — состояние компонента

Это не отдельный экран, а состояние карточки записи на экране Истории.

1. **Карточка** на фоне `surface-container` с dashed border:
   - **Верхняя строка** (always visible):
     - Слева: дата в `primary` JetBrains Mono («13 мая 2026»)
     - По центру/справа: чипы тегов (если есть)
     - Крайний справа: иконка ×/+ для сворачивания
   - **Пунктирный разделитель**
   - **4 секции записи**, каждая:
     - Section-label («что сделал», «что изучил» и т.д.) в `secondary`
     - Под label — текст записи в Literata `body-lg`, цвет `on-surface`
     - Между секциями — gap 24px
   - **Нижняя строка** действий:
     - Слева: ссылка «редактировать» с иконкой pencil (16px), цвет `on-surface-muted`
     - Справа: ссылка «удалить» с иконкой trash или × (16px), цвет `error`

**Чего НЕ должно быть:**
- У «редактировать» НЕ должно быть крестика — только карандаш
- Никаких хлебных крошек / путей к файлу
- Курсивных целых блоков

### 11.3 История — `/history`

1. **Шапка приложения** (та же, что на главной, но с иконкой назад слева)

2. **Заголовок** «История`_`» (`headline-lg` с курсором)

3. **Поиск** (margin-top 24px):
   - Input с иконкой magnifying-glass слева
   - Placeholder «поиск по записям»
   - Padding 14px / 16px

4. **Фильтры** (margin-top 16px):
   - Горизонтальный ряд чипов выбранных тегов с × для удаления
   - Справа от чипов — text button «диапазон дат» с иконкой стрелки вниз
   - Если фильтры активны, справа сверху — text button «очистить»

5. **Section-label** «// записи (всего N)» в `secondary`

6. **Список карточек записей**:
   - Каждая карточка — компонент из 11.2 в свёрнутом или развёрнутом состоянии
   - Между карточками — margin-top 16px (не разделитель — карточки сами имеют border)

7. **Нижняя навигация** — История активна

### 11.4 Статистика — `/stats`

1. **Шапка**

2. **Заголовок** «Статистика`_`»

3. **`// сводка`** — section-label
   - Сетка 2×2 StatTile:
     - «47» / «ВСЕГО ЗАПИСЕЙ» (secondary)
     - «12» / «ТЕКУЩАЯ СЕРИЯ» (primary)
     - «18» / «ЛУЧШАЯ СЕРИЯ» (secondary)
     - «5.2» / «ЗАПИСЕЙ В НЕДЕЛЮ» (primary)

4. **`// активность за год`** — section-label
   - GitHub-style heatmap: 53 недели × 7 дней
   - Тёмные квадраты для пустых дней, оттенки `primary` для заполненных
   - Сверху — лейблы месяцев (`caption`, `on-surface-muted`)
   - Слева — лейблы дней недели (Пн, Ср, Пт)

5. **`// объём по дням`** — section-label
   - Линейный график количества слов за последние 30 дней
   - Цвет линии: `primary`
   - Точки на каждой дате
   - Подписи осей в `caption` `on-surface-muted`
   - Сетка фона — пунктирная, очень приглушённая

6. **`// активность по неделям`** — section-label
   - Столбчатый график: количество записей в неделю за 12 недель
   - Цвет столбцов: `secondary`

7. **`// топ тегов`** — section-label
   - Список из 5 строк, каждая:
     - Слева: имя тега в JetBrains Mono `on-surface`
     - По центру: горизонтальная полоса (% от максимума), фон `surface-container-low`, заполнение `primary`
     - Справа: число использований в `secondary` JetBrains Mono

8. **Нижняя навигация** — Статистика активна

### 11.5 Настройки — `/settings`

(Текущий макет уже почти финальный, нужны только мелкие правки)

1. **Шапка** с иконкой назад

2. **Заголовок** «Настройки`_`»

3. **`// аккаунт`**:
   - Email row: слева label «Email», справа значение `user@example.com` в `on-surface-muted`
   - Text button «выйти из аккаунта»

4. **`// внешний вид`**:
   - Тема — segmented control из 3 кнопок: «Светлая» / «Тёмная» (active) / «Системная»

5. **`// напоминания`**:
   - Row «Включить напоминания» + Toggle Switch
   - Row «Время напоминания» + time input «21:00»
   - Row «Канал» + 2 чекбокса: Браузерные push, Telegram
   - **Карточка Telegram-бота** (когда чекбокс активен):
     - Фон: `surface-container-low`, **solid border** (не dashed — это не группирующий контейнер, а интерактивная карточка), `rounded-md`
     - Padding: 16px
     - Сверху: иконка бота + handle `@CodingJournalBot`
     - Снизу: **Primary Button «привязать аккаунт»** (полная ширина, solid green, не пунктир)

6. **`// данные`**:
   - 3 row с действиями экспорта/импорта
   - Каждое: слева название + иконка, справа secondary button
   - **Удалить все данные** — danger text button с иконкой треугольника-предупреждения, цвет `error`

7. **`// о приложении`**:
   - Версия (read-only text)
   - GitHub (text button с иконкой внешней ссылки)
   - Документация (text button)

8. **Нижняя навигация** — Настройки активна

### 11.6 Вход — `/login`

1. **Центрировано вертикально и горизонтально**, max-width 400px

2. **Заголовок** (большой):
   - Сверху: `> log_book _` в `caption` JetBrains Mono, цвет `primary`, letter-spacing
   - Под ним: «Дневник» в Literata italic, `display` size

3. **Подзаголовок** в `body-md` Literata, `on-surface-muted`:
   «введи email — пришлём ссылку для входа без пароля»

4. **Email input** (margin-top 32px):
   - **Solid border** `outline-variant`, не dashed (это активное поле, не группирующий контейнер)
   - В фокусе — border `primary`
   - Placeholder «you@example.com» в `on-surface-muted` JetBrains Mono
   - Padding 14px / 16px
   - Шрифт значения: JetBrains Mono `body-md`

5. **Primary Button «отправить ссылку»** (margin-top 16px, full-width)

6. **Разделитель «или»** (margin-top 24px):
   - Пунктирная линия с центрированным текстом «или» на фоне

7. **Secondary Button «войти через Google»** (margin-top 24px, full-width):
   - С иконкой Google слева

8. **Никаких декоративных подписей** под формой (`// auth_module_v.01_secured` — НЕТ)

---

## 12. Чек-лист перед утверждением экрана

Когда сгенерил макет в Stitch — проверь по этому списку:

- [ ] Используется правильная палитра (тёплый чёрный, не серый)
- [ ] Шапка без декоративных «system_v0.1» и подобных
- [ ] Все section-labels в формате `// что-то`, lowercase, янтарного цвета
- [ ] Курсор `_` есть ровно в одном месте — после заголовка экрана
- [ ] Все разделители — пунктирные (никаких сплошных линий)
- [ ] Кнопки и инпуты — с `rounded` 4px, теги — `rounded-sm` 2px
- [ ] Никаких pill-форм
- [ ] Текстура точек на фоне присутствует
- [ ] Текст записей — Literata, всё остальное — JetBrains Mono
- [ ] Иконка «редактировать» — карандаш, не крестик
- [ ] Иконка «удалить» — крестик или корзина, цвет `error`
- [ ] Нижняя навигация: Сегодня / История / Статистика / Настройки (4 пункта, правильные имена)
- [ ] Нет блоков «настроения» или эмодзи
- [ ] Нет фейковых путей к файлам, нет «auth_module_v.01» и подобных декоративных надписей
- [ ] Tag chips — прямоугольные с dashed border `secondary`
- [ ] Primary button — solid green с тёмным текстом
- [ ] Поля ввода — фон `surface-container-low`, dashed border (solid при focus)
- [ ] Карточки записей — `surface-container` с dashed border
- [ ] Текст пользователя имеет отступ слева относительно labels (24px)

Если хоть один пункт не выполнен — отправь обратно в Stitch с уточнением, не принимай.

---

## 13. Промпт для Stitch (универсальный)

Этот промпт вставляется в начале каждой генерации экрана:

```
Design system: Stanza Terminal (warm dark, terminal-meets-journal aesthetic).

Strict rules:
- Background #16130a (warm near-black with olive undertone), with 1px dots at 24px spacing in #2a2620
- Two typographic layers: JetBrains Mono for all system text (labels, navigation, metadata, headlines), Literata serif for user-generated content (diary entries) only
- Section labels in format "// section_name" lowercase, color amber #efbf6d, monospace 14px, with dashed underline
- Primary accent color #b5d493 (terminal green) — for primary actions and active states only
- Secondary accent #efbf6d (amber) — for labels and tags only
- Text color #eae2d2 (warm cream)
- All dividers and group borders are 1px DASHED, never solid
- Buttons and inputs: 4px border-radius. Tags/chips: 2px radius (nearly rectangular). NO pill shapes.
- Tags: rectangular, dashed amber border, transparent background, amber monospace text
- Bottom navigation has exactly 4 items: Сегодня / История / Статистика / Настройки (in Russian, lowercase caption labels)
- The active screen title has ONE blinking underscore cursor "_" appended
- NO decorative fake file paths, NO version subscripts, NO "AUTH_MODULE_v.xx" labels, NO "system_v0.x_" headers
- NO mood selectors, NO emoji reactions, NO feeling indicators anywhere
- Edit icon = pencil, Delete icon = trash or × in error red color
- All Russian text uses lowercase for section labels, sentence case for body, UPPERCASE only for tile labels with letter-spacing

Generate ONLY ONE screen per prompt. Do not invent additional UI elements not specified.
```

---

## 14. Запреты (повторно, для памяти)

Это абсолютные запреты, нарушение которых = переделка:

1. ❌ `system_v0.1_` или подобные подписи в шапке вместо названия приложения
2. ❌ Пути к файлам типа `// ROOT_DIRECTORY / daily_logs / 2026_05_13.md`
3. ❌ Подписи `// AUTH_MODULE_v.01_SECURED` или любые декоративные «коды»
4. ❌ Pill-формы (rounded-full) для тегов, кнопок и карточек
5. ❌ Эмодзи настроения, реакции, любые «эмоциональные» индикаторы
6. ❌ Иконка × у действия «редактировать»
7. ❌ Нижняя навигация LOG / CODE / REF
8. ❌ Сплошные линии-разделители вместо пунктирных
9. ❌ Курсив для целых блоков текста
10. ❌ Восклицательные знаки и подбадривания в микрокопии
11. ❌ Тени и блюр для глубины
12. ❌ Использование Lora вместо Literata для тела записей

---

*Версия 2.0 — финальная версия 1, источник истины. Все изменения требуют bump версии.*
