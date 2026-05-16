---
name: section-mock-tsx
description: Skill для создания специализированных HTML/Tailwind UI-mock-компонентов в `packages/ui/src/landing/mocks/` (board, chat, doc, kpi, article, checklist, console). Используется как контекст в system-prompt LLM-генератора, когда секция нуждается в новом mock'е, и как rulebook для агента-разработчика, который добавляет компонент в `mocks/`.
metadata:
  type: skill
  surface: harness
  pipeline: spec → variant-decision → mock-component
  related:
    - svg-illustration-skill
    - design-system-kaiten-v01
    - conversion-landing
---

# Section Mock — Skill

> **Что это.** Контракт-руководство, как делать качественный mock-UI для секции лендинга. Покрывает 6 шаблонов-архетипов (`board`, `chat`, `doc`, `kpi`, `article`, `checklist`, `console`), hard-rules (структура / токены / lucide), soft-rules (плотность / контраст / эмодзи), чек-лист самопроверки.
>
> **Архитектура:** каждый mock — **отдельный TSX-компонент** в `packages/ui/src/landing/mocks/<Name>Mock.tsx` с захардкоженными доменными данными (никаких `mockUi.content` в spec'е). Spec выбирает mock через enum-поле — например, `HeroSection.visual.variant: 'support-board'` или `MediaCopy.variant: 'kb-public'`. Эталон — [`SupportBoardMock`](../../../ui/src/landing/mocks/SupportBoardMock.tsx), [`RequestCardMock`](../../../ui/src/landing/mocks/RequestCardMock.tsx), [`KnowledgeBaseMock`](../../../ui/src/landing/mocks/KnowledgeBaseMock.tsx).
>
> **Кто читает:** LLM в `generate-landing-llm.ts` (через system prompt — чтобы понимать, какие `variant` доступны и когда просить добавить новый) + агент-разработчик, который реализует новый `<Name>Mock.tsx`.
>
> **Reference:** [`wiki/landings/kaiten-techsupport-reference.md`](../../../../wiki/landings/kaiten-techsupport-reference.md) (всё снято с этого лендинга), [`wiki/lessons.md`](../../../../wiki/lessons.md) (теги `mock.*`).
>
> **Отличие от `svg-illustration-skill.md`:** этот skill — про **HTML/Tailwind layered композиции** как React-компоненты. SVG-skill — про `<svg>`-сцены как отдельные TSX-файлы с AST-валидатором. Они дополняют друг друга: SVG для абстрактных Hero-сцен, mocks для предметных UI-моков.

---

## 0. Когда какой шаблон-архетип

| Архетип | Когда уместен | Пример в репо |
|---|---|---|
| `board` | Hero / нарратив про поток задач или сделок | [`SupportBoardMock`](../../../ui/src/landing/mocks/SupportBoardMock.tsx) |
| `chat` | Нарратив про коммуникацию с клиентом | [`RequestCardMock`](../../../ui/src/landing/mocks/RequestCardMock.tsx) (chat + checklist) |
| `checklist` | Standalone или подсекция чата — прогресс задачи | внутри `RequestCardMock` |
| `doc` / `article` | «База знаний», «документы», «инструкции» | [`KnowledgeBaseMock`](../../../ui/src/landing/mocks/KnowledgeBaseMock.tsx) (variant: 'public' / 'internal') |
| `kpi` | «Аналитика», «отчётность», «дашборд» | _(нужно создать: `AnalyticsKpiMock`)_ |
| `console` | Любой технический mock: API-вызов, лог, terminal | _(нужно создать по запросу)_ |

Один mock-компонент = один сценарий. Если хочется board + chat в одной секции — это две разные секции либо два отдельных mock-компонента.

---

## 1. Hard rules (структура — обязательны)

### 1.1. Структура файла

```tsx
// packages/ui/src/landing/mocks/<Name>Mock.tsx
import { cn } from '../../primitives/cn';

// Опционально — interface для variant-разветвления (без content prop'ов):
interface XxxMockProps {
  variant?: 'a' | 'b';
}

// Опционально — захардкоженные данные на module-level:
const DATA = [/* … */];

/**
 * JSDoc — что mock изображает, в каких секциях используется.
 */
export function XxxMock(/* props */) {
  return (
    <div
      aria-hidden
      className={cn(
        'relative overflow-hidden rounded-(--radius-3xl)',
        'border border-(--color-border-default) bg-(--color-surface-card)',
        'shadow-[0_30px_80px_-30px_rgba(125,76,207,0.30)]',
      )}
    >
      {/* window-chrome (для крупных моков) */}
      {/* содержимое */}
    </div>
  );
}
```

После создания:
1. Экспортируй из `packages/ui/src/landing/mocks/index.ts`.
2. Подключи к точке использования: добавь `variant` enum в `AssetRefSchema` (`packages/harness/src/schemas/landing-spec.ts`) или в schema секции, которая его использует; добавь рендеринг в `HeroVisual` (`packages/ui/src/landing/HeroSection.tsx`) или соответствующий компонент-секцию.

### 1.2. Один root, `aria-hidden="true"` на нём

Mock — декоративный, его текст не озвучивается screen-reader'ом. Альтернативный текст — в `<h2>` секции рядом.

### 1.3. Window-chrome для крупных шаблонов (`board`, `chat`, `doc`, `article`, `console`)

```tsx
<div className="flex flex-wrap items-center gap-1.5 border-b border-(--color-border-default) bg-(--color-surface-section) px-3 py-2.5">
  <span className="h-2 w-2 rounded-full bg-red-300" />
  <span className="h-2 w-2 rounded-full bg-yellow-300" />
  <span className="h-2 w-2 rounded-full bg-green-300" />
  <div className="ml-2 flex flex-wrap items-center gap-3 text-[11px] text-(--color-text-secondary)">
    <span className="font-medium text-(--color-text-primary)">Заявки</span>
    <span>Очередь</span>
    <span>SLA</span>
    <span>Ответы</span>
    <span className="rounded-md border border-(--color-border-default) bg-(--color-surface-page) px-1.5 py-0.5">Фильтры</span>
  </div>
</div>
```

`kpi` и `checklist` — без window-chrome, просто `rounded-(--radius-2xl) border bg-(--color-surface-card) p-6`.

### 1.4. Только DS-токены, никакого raw-hex

| Запрещено | Используй |
|---|---|
| `bg-[#7d4ccf]` | `bg-(--color-action-primary)` |
| `text-[#2d2d2d]` | `text-(--color-text-primary)` |
| `rounded-[18px]` | `rounded-(--radius-2xl)` |
| `p-[14px]` | `p-3.5` |
| `shadow-lg` (нейтральный) | `shadow-[0_30px_80px_-30px_rgba(125,76,207,0.30)]` (брендовый) на корне крупных, `shadow-sm` на внутренних |

Единственные исключения: брендовый drop-shadow и small-density typography (`text-[11.5px]` / `text-[10px]` / `text-[9px]`), см. §2.1.

### 1.5. Иконки — только inline `<svg>` из lucide через primitive `<Icon name="..." />` в обязательной капсуле

```tsx
import { Icon } from '../../primitives/Icon';

<span
  aria-hidden
  className="inline-flex h-11 w-11 items-center justify-center rounded-(--radius-xl) bg-(--color-action-primary-soft) text-(--color-text-accent)"
>
  <Icon name="Inbox" className="h-5 w-5" />
</span>
```

Капсула: `h-12 w-12` (feature-card), `h-11 w-11` (step-card), `h-5 w-5` (bullet), `h-9 w-9` (chat-avatar).

### 1.6. Реалистичные русские тексты — обязательно

Никаких:
- `"Card 1"`, `"Item 1"`, `"Title"`, `"Description goes here"`, `"Lorem ipsum"`.
- Абстрактных `"Tag"`, `"Status"`, `"Label"`.

Только:
- Реальные темы обращений: `«Не приходит код подтверждения»`, `«Нужен акт сверки»`, `«Ошибка в личном кабинете»`.
- Реальные источники: `Telegram · новый клиент`, `Почта · бухгалтерия`.
- Реальные имена клиентов / агентов: `Анна Петрова`, `Команда поддержки`.
- Реальные KPI: `87% закрыто в SLA`, `18 зависли`, `6 перегружены`.

Контент берётся из `brief.audience`, `brief.mainPain`, `brief.proofPoints`, `brief.mainPromise`. Если в брифе нет конкретики — спросить пользователя ДО создания mock'а.

### 1.7. Одна семантическая ось цвета на mock

Цветовое кодирование — одна ось:
- либо приоритет (фиолет/оранж/красный),
- либо статус (зелёный done / серый todo),
- либо тип (Bug красный / Question синий).

Смешивать оси в одном mock'е запрещено.

Соответствия (через DS-токены):
- `bg-(--color-action-primary)` — primary / в работе
- `bg-(--color-green-100)` + `text-green-700` — done / SLA OK
- `bg-(--color-orange-100)` + `text-amber-800` — в процессе / warning
- `bg-(--color-red-100)` + `text-red-700` — bug / SLA нарушен
- `bg-(--color-blue-100)` — info / нейтральная категория

---

## 2. Soft rules (стиль — настоятельно рекомендуется)

### 2.1. Small-density typography внутри mock'а

Шрифты ВНУТРИ карточек mock'а намеренно мельче базового, чтобы mock читался как «оптический скриншот в уменьшении» и не конкурировал с H2 секции:

| Назначение | Размер |
|---|---|
| Заголовок карточки | `text-[11.5px] font-semibold leading-tight` |
| Мета-строка | `text-[10px] text-(--color-text-secondary)` |
| Бейдж | `text-[9px] font-medium` |
| Чат-сообщение | `text-sm` (исключение — чат должен быть читаемым) |
| KPI-число | `text-3xl md:text-4xl font-semibold` (центр внимания) |
| Подпись KPI | `text-sm text-(--color-text-secondary)` |

Spacing внутри карточек: `p-2.5`, `gap-1.5`, `space-y-1`.

### 2.2. Один активный + остальные приглушены

В любом списке (карточки на доске, чек-лист, FAQ) — один элемент явно «живой», остальные приглушены. См. как реализовано в `SupportBoardMock`:

```tsx
interface Ticket {
  // …
  muted?: boolean;
  lifted?: boolean;
}

<div className={cn(
  /* base */,
  t.muted ? 'border-default opacity-60' : 'border-default shadow-sm',
  t.lifted && 'translate-y-[-2px] shadow-md',
)}>
```

### 2.3. Эмодзи — 0 или 1 на mock, в одной из ролей

- Указатель действия: `☝️` в углу активной карточки (`absolute -right-2 -bottom-2 text-lg drop-shadow-sm`) = «можно перетащить».
- Маркер типа: `📌` публичная статья vs `🧑‍💻` внутренний регламент.
- Inline-чекмарк: `✓` в чек-листе (символ, допустим в любом количестве).

Нельзя: эмодзи в кнопках, заголовках, бейджах; два разных эмодзи в одном mock'е; эмодзи как замена иконке lucide.

### 2.4. Placeholder-полоски с убывающей шириной

Когда нужно показать «здесь живёт абзац» — НЕ пустые div'ы, а полоски (как в `KnowledgeBaseMock`):

```tsx
<div className="space-y-1.5">
  <div className="h-2 w-full rounded-full bg-(--color-neutral-200)" />
  <div className="h-2 w-5/6 rounded-full bg-(--color-neutral-200)" />
  <div className="h-2 w-4/6 rounded-full bg-(--color-neutral-200)" />
</div>
```

Соотношения ширин: 100% → 5/6 → 4/6 → 3/4. 3-4 полоски.

### 2.5. Списки — 3 или 4 элемента, не 1 и не 2

Канбан-колонка = 2 карточки (вторая `muted` = «обрезанный кадр» — это исключение для board); чек-лист = 3 пункта (≥1 done + ≥1 todo); KPI = 2×2 = 4 плитки; шаги запуска = 4; bullet-feature = 3-4.

### 2.6. Декорация фона секции с mock'ом

Для Hero — `radial-gradient` (см. реализацию в `HeroSection.tsx`):
```tsx
className="pointer-events-none absolute inset-x-0 -top-32 -z-10 h-[720px] bg-[radial-gradient(60%_60%_at_70%_0%,rgba(125,76,207,0.22)_0%,rgba(125,76,207,0)_60%),radial-gradient(40%_40%_at_15%_30%,rgba(33,150,243,0.10)_0%,rgba(33,150,243,0)_60%)]"
```

Для CTA-баннеров — blob:
```tsx
<div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full opacity-30 blur-3xl bg-(--color-action-primary)" />
```

Прозрачность 0.10-0.30. Всегда с `aria-hidden` и `pointer-events-none`.

### 2.7. Reverse-layout zigzag в соседних секциях

В `MediaCopy` — есть встроенный `reverse: boolean`. Если две `MediaCopy` идут подряд — вторая `reverse: true`. 3+ секций подряд с одинаковым layout — запрещено.

### 2.8. Брендовый drop-shadow на корневой обёртке крупных моков

```
shadow-[0_30px_80px_-30px_rgba(125,76,207,0.30)]
```

На внутренних карточках — `shadow-sm` нейтральный или ничего.

---

## 3. Алгоритм добавления нового специализированного mock-компонента

Когда генератору нужен mock, которого ещё нет в `packages/ui/src/landing/mocks/`:

1. **Подобрать архетип** из §0 — `board` / `chat` / `kpi` / `article` / `checklist` / `console`.
2. **Дать имя по сценарию**, не по архетипу: `AnalyticsKpiMock`, `OnboardingChecklistMock`, `IntegrationConsoleMock` — не `BoardMock2`.
3. **Создать файл** `packages/ui/src/landing/mocks/<Name>Mock.tsx` по шаблону из §1.1, используя структуру существующего mock'а того же архетипа (`SupportBoardMock` для board, `RequestCardMock` для chat+checklist, `KnowledgeBaseMock` для article).
4. **Захардкодить доменные данные** из брифа — на module-level (`const DATA = [...]`) или внутри компонента. Никаких props на content (только опц. `variant` для разветвлений типа `public`/`internal`).
5. **Прогнать через чек-лист §4.**
6. **Экспортировать** из `packages/ui/src/landing/mocks/index.ts`.
7. **Подключить к точке использования.** Если mock нужен в Hero — добавить значение в `AssetRefSchema.variant` (zod) + соответствующий case в `HeroVisual` (`HeroSection.tsx`). Если в `MediaCopy` — добавить значение в `MediaCopyVariantSchema` + case в самой `MediaCopy`. Не плодить новые точки использования без необходимости.
8. **Обновить registry** (`packages/harness/src/registry/index.ts`) — добавить новое значение `variant` в описание HeroSection (или другой секции).
9. **Записать в `wiki/landings/kaiten-techsupport-reference.md`** новую строку таблицы (что иллюстрирует, на основе какого архетипа).

---

## 4. Чек-лист самопроверки (перед PR)

Прогони каждый новый mock через этот чек-лист — соответствует `wiki/lessons.md` теги `mock.*`:

- [ ] `aria-hidden="true"` на корне mock-компонента.
- [ ] **window-chrome** есть на board/chat/doc/article/console (3 точки + активный таб).
- [ ] **realistic-russian-copy** — нет ни одного «Item 1», «Lorem», «Заголовок». Каждая строка — конкретный пользовательский контент.
- [ ] **accent-bar** на карточках доски/статьи — одна семантическая ось цвета.
- [ ] **active-vs-inactive** — ровно одна активная карточка / открытый аккордеон / done-чек в чек-листе и хотя бы один приглушённый.
- [ ] **lucide-icons** через `<Icon name="..." />` в фиолетовой капсуле `bg-action-primary-soft text-text-accent rounded-(--radius-xl)`.
- [ ] **emoji ≤ 1** на mock, в одной из разрешённых ролей.
- [ ] **DS-tokens-only** — grep по файлу не находит `bg-[#`, `text-[#`, `rounded-[`, `p-[`. Исключения: брендовый `shadow-[0_30px_80px…]` и small-density `text-[11.5px]/[10px]/[9px]`.
- [ ] **brand-violet-shadow** на корневой обёртке крупного mock'а.
- [ ] **small-density typography** — заголовки карточек 11.5px, мета 10px, бейджи 9px (для board/chat).
- [ ] **3-4 элемента в списках** — не 1, не 2 (исключение: 2 карточки на канбан-колонке).
- [ ] **placeholder-bars** с убывающей шириной (3-4 шт) — для article/doc.
- [ ] **chat-bubbles** асимметричные — `rounded-bl-md` (in, серый) ↔ `ml-auto rounded-br-md` (out, фиолетовый-soft).
- [ ] **checklist-mixed-states** — ≥1 done и ≥1 todo.
- [ ] **kpi** — число + стрелка тренда + подпись, без графиков.
- [ ] Распределение на лендинге: ≤1 крупного Hero-mock + 3-5 средних mock'ов на body-секциях.

Если любой пункт не выполнен — фикси перед PR.

---

## 5. Anti-patterns (то, что блокирует review)

- Пустые `<div className="h-20 bg-neutral-200" />` как «placeholder».
- Lorem ipsum или абстрактные `«Card 1 · Description · Tag»`.
- Любая иконка кроме lucide.
- Серый `shadow-2xl` или `shadow-lg` (нейтральный) на крупном mock'е.
- Эмодзи в заголовке секции, кнопке, бейдже.
- Hex-цвета в любом виде (`bg-[#7d4ccf]`, `style={{ background: '#7d4ccf' }}`).
- 2+ эмодзи в одном mock'е.
- Все карточки одинаковые без выделения активной.
- Графики/sparklines в KPI-плитке (только число + стрелка).
- Mock без `aria-hidden="true"` на корне.
- Props на content (`tickets: Ticket[]`, `messages: Message[]`) на mock-компоненте. Контент — хардкод; для разветвления — только `variant: 'a' | 'b'`.
- Reuse mock-компонента в двух разных сценариях через `variant` без визуального обоснования (например, board для канбана и для дашборда — это два разных компонента, не один).

---

## 6. Связанные источники

- [`wiki/landings/kaiten-techsupport-reference.md`](../../../../wiki/landings/kaiten-techsupport-reference.md) — эталонный лендинг (snapshot + распаковка приёмов + mapping на `mocks/*`).
- [`wiki/lessons.md`](../../../../wiki/lessons.md) — теги `mock.*` (удобно цитировать в repair-loop).
- [`packages/ui/src/landing/mocks/SupportBoardMock.tsx`](../../ui/src/landing/mocks/SupportBoardMock.tsx) — эталон архетипа `board`.
- [`packages/ui/src/landing/mocks/RequestCardMock.tsx`](../../ui/src/landing/mocks/RequestCardMock.tsx) — эталон `chat` + `checklist`.
- [`packages/ui/src/landing/mocks/KnowledgeBaseMock.tsx`](../../ui/src/landing/mocks/KnowledgeBaseMock.tsx) — эталон `article` с variant.
- [`packages/harness/src/prompts/svg-illustration-skill.md`](./svg-illustration-skill.md) — соседний skill для SVG-сцен.
- [`packages/harness/src/skills/conversion-landing.md`](../skills/conversion-landing.md) — общий контекст про конверсионные секции.
- [`wiki/design-system/colors.md`](../../../../wiki/design-system/colors.md), [`spacing.md`](../../../../wiki/design-system/spacing.md), [`radius.md`](../../../../wiki/design-system/radius.md) — палитра и токены.
