---
name: section-mock-tsx
description: Skill для создания HTML/Tailwind UI-моков внутри секций лендинга (board, chat, doc, kpi, article, checklist, console). Используется как контекст в system-prompt LLM-генератора LandingSpec, когда секция требует mockUi, и как rulebook для агента-разработчика, который реализует SectionMock-компонент.
metadata:
  type: skill
  surface: harness
  pipeline: spec → mockUi-spec → tsx
  related:
    - svg-illustration-skill
    - design-system-kaiten-v01
    - conversion-landing
---

# Section Mock — Skill

> **Что это.** Контракт-руководство, как делать качественный mock-UI внутри секции лендинга. Покрывает 7 шаблонов (`board`, `chat`, `doc`, `kpi`, `article`, `checklist`, `console`), hard-rules (структура / токены / lucide), soft-rules (плотность / контраст / эмодзи), чек-лист самопроверки.
>
> **Кто читает:** LLM в `generate-landing-llm.ts` при mockUi-authoring + агент, который реализует/чинит `SectionMock` компонент в `packages/ui/src/landing/SectionMock.tsx`.
>
> **Эталон:** [`wiki/landings/kaiten-techsupport-reference.md`](../../../../wiki/landings/kaiten-techsupport-reference.md) + `snapshot.html`. Все примеры ниже выведены из этого лендинга. Также — [`wiki/lessons.md`](../../../../wiki/lessons.md) (теги `mock.*`).
>
> **Ключевое отличие от `svg-illustration-skill.md`:** этот skill — про **HTML/Tailwind layered композиции**, которые встроены в React-секции, а не про `<svg>`-сцены как отдельные TSX-файлы. SVG используется только для микро-иконок (lucide).

---

## 0. Когда использовать какой шаблон

| Шаблон | Когда уместен | Эталонная секция в snapshot |
|---|---|---|
| `board` | Hero / «один входящий канал» / любой нарратив про поток задач или сделок | Hero (4 колонки × 2 карточки) |
| `chat` | «контекст не теряется» / любой нарратив про коммуникацию с клиентом | Секция «Контекст не теряется» |
| `checklist` | Подсекция чата или standalone — нарратив про прогресс задачи | Внутри секции «Контекст» |
| `doc` / `article` | «база знаний», «документы», «инструкции» | Секции «База знаний» и «Документы» |
| `kpi` | «аналитика», «отчётность», «дашборд» | Секция «Аналитика» (2×2) |
| `console` | Любой технический mock: API-вызов, лог, terminal | На kaiten-эталоне не используется |

Если секция — `FeatureGrid` / `PricingPlans` / `FAQAccordion` / `LandingFooter`, mockUi НЕ нужен (там визуал — сами карточки/плитки).

---

## 1. Hard rules (структура — обязательны)

### 1.1. Один root-обёртка с window-chrome для крупных шаблонов

`board`, `chat`, `doc`, `article`, `console` — обязаны иметь обёртку:

```tsx
<div
  aria-hidden
  className="relative overflow-hidden rounded-(--radius-3xl) border border-(--color-border-default) bg-(--color-surface-card) shadow-[0_30px_80px_-30px_rgba(125,76,207,0.30)]"
>
  {/* window-chrome */}
  <div className="flex flex-wrap items-center gap-1.5 border-b border-(--color-border-default) bg-(--color-surface-section) px-3 py-2.5">
    <span className="h-2 w-2 rounded-full bg-red-300" />
    <span className="h-2 w-2 rounded-full bg-yellow-300" />
    <span className="h-2 w-2 rounded-full bg-green-300" />
    <div className="ml-2 flex items-center gap-3 text-[11px] text-(--color-text-secondary)">
      <span className="font-medium text-(--color-text-primary)">{activeTab}</span>
      {otherTabs.map((t) => <span key={t}>{t}</span>)}
    </div>
  </div>
  {/* содержимое */}
</div>
```

`kpi` и `checklist` — оборачиваются в карточку без window-chrome (`rounded-(--radius-2xl) border bg-(--color-surface-card) p-6`).

### 1.2. `aria-hidden="true"` на корне mock'а

Mock — декоративный, его текст не озвучивается screen-reader'ом. Альтернативный текст — в `<h2>` рядом.

### 1.3. Только DS-токены, никакого raw-hex

| Запрещено | Используй |
|---|---|
| `bg-[#7d4ccf]` | `bg-(--color-action-primary)` |
| `text-[#2d2d2d]` | `text-(--color-text-primary)` |
| `rounded-[18px]` | `rounded-(--radius-2xl)` |
| `p-[14px]` | `p-3.5` |
| `shadow-lg` (нейтральный) | `shadow-[0_30px_80px_-30px_rgba(125,76,207,0.30)]` (брендовый) для крупных, `shadow-sm` для мелких |

Единственное исключение для arbitrary-value — брендовый drop-shadow и `text-[11.5px]` / `text-[10px]` / `text-[9px]` для small-density typography внутри mock'а (см. §2.1).

### 1.4. Иконки — только inline `<svg>` из lucide, в обязательной капсуле

```tsx
<span
  aria-hidden
  className="inline-flex h-5 w-5 items-center justify-center rounded-(--radius-xl) bg-(--color-action-primary-soft) text-(--color-text-accent)"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-3.5 w-3.5"
  >
    <path d="…lucide path…" />
  </svg>
</span>
```

Размеры капсулы: `h-12 w-12` (feature-card), `h-11 w-11` (step-card), `h-5 w-5` (bullet), `h-9 w-9` (chat-avatar).

### 1.5. Реалистичные тексты — обязательно

Никаких:
- `"Card 1"`, `"Item 1"`, `"Title"`, `"Description goes here"`, `"Lorem ipsum"`.
- Абстрактных `"Tag"`, `"Status"`, `"Label"`.

Только:
- Реальные темы обращений: `«Не приходит код подтверждения»`, `«Нужен акт сверки»`, `«Ошибка в личном кабинете»`.
- Реальные источники: `Telegram · новый клиент`, `Почта · бухгалтерия`.
- Реальные имена клиентов / агентов: `Анна Петрова`, `Команда поддержки`.
- Реальные KPI: `87% закрыто в SLA`, `18 зависли`, `6 перегружены`.

Откуда брать контент: из `brief.audience`, `brief.mainPain`, `brief.proofPoints`, `brief.mainPromise`. Если в брифе нет конкретики — спросить у пользователя ДО генерации, не выдумывать.

### 1.6. Одна семантическая ось цвета на mock

Цветовое кодирование — одна ось: либо приоритет (фиолет/оранж/красный), либо статус (зелёный done / серый todo), либо тип (Bug красный / Question синий). Смешивать оси в одном mock'е запрещено — пользователь не поймёт, что значит цвет.

Соответствия:
- `bg-(--color-action-primary)` — primary / в работе
- `bg-green-100` + `text-green-700` — done / SLA OK
- `bg-orange-100` + `text-amber-800` — в процессе / warning
- `bg-red-100` + `text-red-700` — bug / SLA нарушен
- `bg-blue-100` — info / нейтральная категория

### 1.7. Один root, один mock — никакого «два mock'а в одной секции»

Если секция требует двух разных идей — это две секции. В одну секцию ставится ОДИН mock рядом с текстом.

---

## 2. Soft rules (стиль — настоятельно рекомендуется)

### 2.1. Small-density typography внутри mock'а

Шрифты ВНУТРИ карточек mock'а намеренно мельче базового, чтобы mock читался как «оптический скриншот в уменьшении» и не конкурировал с H2 секции:

| Назначение | Размер |
|---|---|
| Заголовок карточки | `text-[11.5px] font-semibold leading-tight` |
| Мета-строка | `text-[10px] text-(--color-text-secondary)` |
| Бейдж | `text-[9px] font-medium` |
| Чат-сообщение | `text-sm` (это исключение — чат должен быть читаемым) |
| KPI-число | `text-3xl md:text-4xl font-semibold` (это центр внимания) |
| Подпись KPI | `text-sm text-(--color-text-secondary)` |

Spacing внутри карточек: `p-2.5`, `gap-1.5`, `space-y-1`.

### 2.2. Один активный + остальные приглушены

В любом списке (карточки на доске, чек-лист, FAQ) — один элемент явно «живой», остальные приглушены:

```tsx
{items.map((item, i) => (
  <Card
    key={i}
    className={i === activeIndex
      ? 'translate-y-[-2px] shadow-md'
      : 'opacity-60'
    }
  />
))}
```

Это убирает ощущение мёртвого скриншота. Все одинаковые = заглушка; один выделенный = взаимодействие.

### 2.3. Эмодзи — 0 или 1 на mock, в одной из ролей

- Указатель действия: `☝️` в углу активной карточки (`absolute -right-2 -bottom-2 text-lg drop-shadow-sm`) = «можно перетащить».
- Маркер типа: `📌` публичная статья vs `🧑‍💻` внутренний регламент.
- Inline-чекмарк: `✓` в чек-листе (это не эмодзи, символ — допустим в любом количестве).

Нельзя:
- Эмодзи в кнопках, заголовках, бейджах.
- Два разных эмодзи в одном mock'е.
- Эмодзи как замена иконке lucide.

### 2.4. Placeholder-полоски с убывающей шириной

Когда нужно показать «здесь живёт абзац текста» — НЕ пустые div'ы, а полоски:

```tsx
<div className="space-y-1.5">
  <div className="h-2 w-full rounded-full bg-(--color-neutral-200)" />
  <div className="h-2 w-5/6 rounded-full bg-(--color-neutral-200)" />
  <div className="h-2 w-4/6 rounded-full bg-(--color-neutral-200)" />
</div>
```

Соотношения ширин: 100% → 5/6 → 4/6 → 3/4. 3-4 полоски.

### 2.5. Списки — 3 или 4 элемента, не 1 и не 2

Канбан-колонка = 2 карточки (вторая `opacity-60` = «обрезанный кадр», но это исключение для board-шаблона, где важна плотность); чек-лист = 3 пункта (≥1 done + ≥1 todo); KPI = 2×2 = 4 плитки; шаги запуска = 4; bullet-feature = 3-4.

### 2.6. Декорация фона секции с mock'ом

```tsx
<div
  aria-hidden
  className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full opacity-30 blur-3xl bg-(--color-action-primary)"
/>
```

Для Hero — `radial-gradient` через `bg-[radial-gradient(...)]`. Прозрачность 0.22-0.30, не больше. Никогда без `aria-hidden` и `pointer-events-none`.

### 2.7. Reverse-layout zigzag в соседних секциях

Если два body-mock'а идут подряд и у обоих «текст + mock» — во второй секции переверни порядок: `lg:[&>div:first-child]:order-2`. 3+ секции подряд с одинаковым layout — запрещено.

### 2.8. Брендовый drop-shadow на крупных моках

```
shadow-[0_30px_80px_-30px_rgba(125,76,207,0.30)]
```

Только на корневой обёртке крупного mock'а (`board`, `chat`, `doc`, `article`). На внутренних карточках — `shadow-sm` нейтральный или ничего.

---

## 3. Шаблоны (структура каждого)

### 3.1. `board` — канбан-доска

**Контент-форма (JSON spec):**
```ts
{
  template: 'board';
  content: {
    tabs: string[];              // ['Заявки', 'Очередь', 'SLA', 'Ответы']; первый — активный
    activeTab?: string;          // default: tabs[0]
    columns: Array<{
      title: string;             // 'Новые', 'В работе', …
      count?: number;            // 8 — оранжевый бейдж рядом с title
      cards: Array<{
        title: string;           // тема обращения
        meta?: string;           // 'Telegram · новый клиент'
        accent: 'primary' | 'green' | 'orange' | 'red' | 'blue';
        badges?: Array<{ label: string; tone: 'red' | 'amber' | 'emerald' | 'neutral' }>;
        active?: boolean;        // ровно одна карточка во всём mock'е
        dim?: boolean;           // приглушённая (opacity-60); в каждой колонке кроме первой карточки
      }>;
    }>;
    activeEmoji?: '☝️' | '✋' | null; // ноль или один эмодзи на активной карточке
  };
}
```

**Layout-правила:** 3-4 колонки, 2 карточки в колонке (первая = «активная» либо «нормальная», вторая = `dim`). Window-chrome обязателен. Активная карточка ровно одна на весь mock.

### 3.2. `chat` — карточка заявки с диалогом

```ts
{
  template: 'chat';
  content: {
    ticketId: string;            // '#18524'
    ticketTitle: string;         // 'Оплата не прошла'
    ticketSubtitle?: string;     // 'Клиент: Анна Петрова · Telegram'
    messages: Array<{
      role: 'in' | 'out';        // in — серая слева; out — фиолетовая справа
      author?: string;           // 'Клиент' / 'Команда поддержки' (опц.)
      text: string;
    }>;                          // 2-3 сообщения
    checklist?: Array<{          // опционально внизу карточки
      label: string;
      done: boolean;
    }>;                          // если есть — минимум 1 done и 1 todo
  };
}
```

**Layout-правила:** window-chrome + ID/заголовок/подзаголовок + чат-стек + опц. чек-лист. Каждое сообщение ≤ 85% ширины, асимметричный bottom-corner: `rounded-bl-md` (in) / `rounded-br-md` (out).

### 3.3. `checklist` — standalone чек-лист (или вложенный в chat)

```ts
{
  template: 'checklist';
  content: {
    title?: string;              // если standalone
    items: Array<{ label: string; done: boolean }>;  // 3-5; минимум 1 done и 1 todo
  };
}
```

**Layout-правила:** done — `bg-(--color-action-primary) text-white ✓` + текст `line-through text-text-secondary`. Todo — пустой квадрат `border bg-white` + текст обычный.

### 3.4. `doc` / `article` — статья из БЗ или внутренний документ

```ts
{
  template: 'article';
  content: {
    sidebarItems: Array<{ label: string; active: boolean }>; // 4-6; ровно один active
    emoji: '📌' | '🧑‍💻' | '📋' | null;
    badge: { label: string; tone: 'violet' | 'blue' | 'emerald' | 'amber' };
    title: string;               // 'Как восстановить доступ'
    subtitle?: string;
    bodyBars: 3 | 4;             // количество placeholder-полосок
  };
}
```

**Layout-правила:** двухколоночный grid `grid-cols-[120px_1fr]`, слева — сайдбар-навигация (один active item с акцент-цветом фона), справа — карточка статьи с эмодзи + badge + title + subtitle + bars.

### 3.5. `kpi` — 2×2 (или 1×3) сетка плиток

```ts
{
  template: 'kpi';
  content: {
    tiles: Array<{
      value: string;             // '87%' / '124' / '18'
      trend?: { direction: 'up' | 'down'; tone: 'positive' | 'negative' };
      label: string;             // 'закрыто в SLA'
    }>;                          // 3-4 плитки
  };
}
```

**Layout-правила:** каждая плитка — отдельная карточка `rounded-(--radius-2xl) border bg-surface-card p-6`. Число + стрелка на одной baseline (`flex items-baseline gap-2`). Стрелка `▲ text-green-100` / `▼ text-red-100` (НЕ по семантике направления, а по семантике «хорошо/плохо»: 18 зависших с трендом ▼ = хорошо).

### 3.6. `console` — псевдо-терминал / API-вызов / лог

```ts
{
  template: 'console';
  content: {
    title?: string;              // 'API · POST /tickets'
    lines: Array<{
      kind: 'comment' | 'cmd' | 'output' | 'success' | 'error';
      text: string;
    }>;                          // 4-8
  };
}
```

**Layout-правила:** window-chrome + чёрный фон `bg-slate-950 text-slate-100` (исключение из правила «только токены» — для console это часть жанра). Моноширинный шрифт `font-mono text-sm`. Цвета линий:
- `comment` → `text-slate-500`
- `cmd` → `text-slate-100` с префиксом `$`
- `output` → `text-slate-300`
- `success` → `text-green-300`
- `error` → `text-red-300`

---

## 4. Чек-лист самопроверки (перед сдачей mock'а)

Прогони каждый mock через этот чек-лист — он выводится один-в-один из `wiki/lessons.md`:

- [ ] **window-chrome** есть на board/chat/doc/article/console (3 точки + табы, активный таб выделен).
- [ ] **realistic-russian-copy** — нет ни одного «Item 1», «Lorem», «Заголовок». Каждая строка — конкретный пользовательский контент.
- [ ] **accent-bar** на карточках доски/статьи — одна семантическая ось цвета.
- [ ] **active-vs-inactive** — ровно одна активная карточка / открытый аккордеон / done-чек в чек-листе и хотя бы один приглушённый.
- [ ] **lucide-icons** в фиолетовой капсуле `bg-action-primary-soft text-text-accent rounded-(--radius-xl)`. Никаких сторонних иконок.
- [ ] **emoji ≤ 1** на mock, в одной из разрешённых ролей.
- [ ] **DS-tokens-only** — поиск по mock'у не находит `bg-[#`, `text-[#`, `rounded-[`, `p-[`. Исключения: брендовый `shadow-[0_30px_80px…]` и small-density `text-[11.5px]/[10px]/[9px]`.
- [ ] **brand-violet-shadow** на корневой обёртке крупного mock'а.
- [ ] **small-density typography** — заголовки карточек 11.5px, мета 10px, бейджи 9px (для board/chat).
- [ ] **3-4 элемента в списках** — не 1, не 2 (исключение: 2 карточки на канбан-колонке, где вторая `opacity-60`).
- [ ] **placeholder-bars** с убывающей шириной (3-4 шт, не пустые div'ы) — для article/doc.
- [ ] **chat-bubbles** асимметричные — `rounded-bl-md` (in, серый) ↔ `ml-auto rounded-br-md` (out, фиолетовый-soft).
- [ ] **checklist-mixed-states** — ≥1 done и ≥1 todo.
- [ ] **kpi** — число + стрелка тренда + подпись, без графиков.
- [ ] **background-decoration** — radial или blob с `aria-hidden` + `pointer-events-none`, opacity 0.22-0.30.
- [ ] **layout-zigzag** — если предыдущая секция тоже имеет mock «текст+mock», в этой `lg:[&>div:first-child]:order-2`.
- [ ] **distribution** — на лендинге ≤1 крупного Hero-mock'а + 3-5 средних mock'ов на body-секциях. Без mock'а: trust-bar, FAQ, footer.

Если любой пункт не выполнен — фикси перед сдачей.

---

## 5. Anti-patterns (то, что блокирует review)

- Пустые `<div className="h-20 bg-neutral-200" />` как «placeholder».
- Lorem ipsum или абстрактные `«Card 1 · Description · Tag»`.
- Любая иконка кроме lucide (Material, font-awesome, эмодзи как иконка).
- Серый `shadow-2xl` или `shadow-lg` (нейтральный) на крупном mock'е.
- Эмодзи в заголовке секции, кнопке, бейдже.
- Hex-цвета в любом виде (`bg-[#7d4ccf]`, `style={{ background: '#7d4ccf' }}`).
- 2+ эмодзи в одном mock'е.
- Все карточки одинаковые без выделения активной.
- Зебра-полоски / таблицы вместо карточек (если только секция явно про таблицу).
- Графики/sparklines в KPI-плитке (только число + стрелка).
- Mock без `aria-hidden="true"` на корне — он начинает озвучиваться screen-reader'ом.

---

## 6. Связанные источники

- [`wiki/landings/kaiten-techsupport-reference.md`](../../../../wiki/landings/kaiten-techsupport-reference.md) — эталонный лендинг (snapshot.html + распаковка приёмов).
- [`wiki/lessons.md`](../../../../wiki/lessons.md) — теги `mock.*` (одна строка на правило, удобно цитировать в repair-loop).
- [`packages/harness/src/prompts/svg-illustration-skill.md`](./svg-illustration-skill.md) — соседний skill для SVG-сцен (используется для Hero-illustration, когда mockUi не подходит).
- [`packages/harness/src/skills/conversion-landing.md`](../skills/conversion-landing.md) — общий контекст про конверсионные секции.
- [`wiki/design-system/colors.md`](../../../../wiki/design-system/colors.md), [`spacing.md`](../../../../wiki/design-system/spacing.md), [`radius.md`](../../../../wiki/design-system/radius.md) — палитра и токены.
