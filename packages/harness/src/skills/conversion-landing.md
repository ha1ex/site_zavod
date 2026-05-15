---
name: conversion-landing
description: Универсальные правила создания и аудита конверсионных SaaS-лендингов для Buffalo LLM harness. Покрывает page types, awareness levels, hero, секции, копирайт, визуал, формы/CTA, social proof, antipatterns, бенчмарки 2026, чек-листы create и audit (100-point scorecard). Используется как контекст в system prompt LLM-генератора и как rulebook для людей, которые правят LandingSpec вручную.
metadata:
  type: skill
  surface: harness
  pipeline: brief → spec → tsx
  related:
    - design-system-kaiten-v01
    - content-marketing
---

# Buffalo — Conversion Landing Skill

> **Что это.** Контракт-руководство для всех, кто собирает или правит лендинги
> через Buffalo harness. Покрывает full lifecycle: discovery → page type →
> awareness → структура секций → копи → визуал → CTA → проверка.
>
> **Кто читает:** LLM в `generate-landing-llm.ts` (как часть system prompt) и
> человек/агент, который вручную правит `content/briefs/*.json` или `LandingSpec`.
>
> **Два режима:**
> - **Create mode (§0.A)** — новый лендинг из брифа.
> - **Audit mode (§0.B)** — 100-балльный score по готовому LandingSpec/TSX.
>
> **Источники:** B.I.A.S. (growth.design), Julian Shapiro Startup Handbook,
> CXL, Demand Curve, Joanna Wiebe (Copyhackers), Nielsen Norman Group,
> Eugene Schwartz (*Breakthrough Advertising*), SaaS Hero 2026, StoryBrand
> (Donald Miller), Mafia-Skills landing-page-mastery. Полный список — §16.

---

## 0. Режимы

### 0.A Create mode — новый лендинг из брифа

```
1. Discovery
   ├─ Brief (см. BriefSchema): product, audience, market, primaryGoal,
   │  mainPain, mainPromise, proofPoints, tone, cta, pageArchetype.
   ├─ Intent траффика: hot bottom-funnel / mid-funnel / brand
   └─ Awareness level аудитории (§2)

2. Page type → структура секций (§1, §4)
   Выбрать один из 8 SaaS-типов → шаблон секций. Не «универсальный для всех».

3. Awareness level → copy framework (§2)
   Определить стадию Schwartz → AIDA / PAS / BAB / StoryBrand / Direct.

4. Hero (§3)
   Отвечает на «что/для кого/результат» за 5 секунд. Один primary CTA.
   Большой product visual справа (IllustrationSpec). LCP ≤ 2,5 s.

5. Body sections (§4 каталог)
   Каждая секция = одна задача (USP / proof / FAQ / pricing).
   Не плодить «и ещё посмотрите блог».

6. Copy (§5)
   Conversion Equation, Feature → Benefit Transformation, CTA hierarchy,
   Voice-of-customer, инфостиль.

7. Visual (§6)
   USP horizontal layout, SVG product-UI мокапы, Hero showcase.
   Tone-палитра — из Kaiten DS (violet / purple / blue / green / orange / red).

8. CTA + микрокопи (§7)
   Primary CTA как outcome-action, не «Submit». Trust-line micro-fineprint.

9. Pre-merge (§14)
   Pre-merge checklist. Прогон через harness validators
   (schema / brand / a11y / visual / ast).
```

### 0.B Audit mode — score готового LandingSpec/TSX

```
1. Input: путь к LandingSpec JSON или к собранному TSX в /generated/landings/<slug>/.

2. Прогон по 7 категориям (§15) — 100 баллов:
   Hero (20) / Value Prop (15) / Social Proof (15) / CTA (15) /
   Copy (15) / Design & UX (10) / Tech Perf (10).

3. Score → tier:
   90–100 — minor tweaks, готов к публикации.
   75–89  — solid, точечные правки.
   60–74  — significant rewrite одной-двух секций.
   < 60   — complete redesign по §0.A.

4. Output: см. §15.D — markdown-отчёт с critical/high/medium priority.
```

---

## 1. Page type matrix — 8 типов SaaS-лендингов

Каждый тип имеет свою цель, свою структуру секций, свой copy framework.
**Никогда** не делаем универсальный шаблон «один на всех» — конверсия страдает,
когда intent трафика не совпадает со структурой страницы.

| # | Тип | Buyer intent | Структура (порядок секций) | Copy framework |
|---|-----|--------------|---------------------------|----------------|
| 1 | **Homepage** | Brand-aware, многоцелевой | Hero → Logos → USP 4× → How it works → Features (bento) → Social proof → FAQ → Final CTA | StoryBrand или AIDA |
| 2 | **Feature page** | Ищет конкретную фичу | Hero (фича в H1) → Problem agitation → How it works (3 шага) → USP 4× → Demo/screenshot → Social proof → FAQ → CTA | PAS |
| 3 | **Use-case / JTBD** | Ищет решение задачи | Hero (job в H1) → Pain points (3) → Solution → Walkthrough → USP → Testimonials → Pricing teaser → FAQ → CTA | PAS или BAB |
| 4 | **Comparison / vs-конкурент** | Сравнивает альтернативы | Hero (vs-positioning) → Comparison table → Switching story → Testimonials → FAQ → CTA с migration offer | Direct comparison |
| 5 | **Testimonials / Customers** | Социальная валидация | Hero (numbers) → 6–12 цитат → Case study cards → Industry breakdown → CTA | Social proof first |
| 6 | **Launch / What's new** | Existing + new visitors | Hero (announcement) → Demo video/GIF → What changed → Why it matters → Migration path → Testimonials early adopters → CTA | AIDA |
| 7 | **Integration** | Ищет «продукт + X» | Hero (логотипы обоих) → How it works (2-way diagram) → 3 use-cases → Setup steps → FAQ → CTA | Direct |
| 8 | **Pricing** | Buying stage | Hero (clear positioning) → 3-tier table → Feature comparison → FAQ (refunds/cancellation) → Testimonials → Guarantee → CTA | Direct + Risk reversal |

**Антипаттерн.** PPC-трафик не ведём на homepage — только на лендинг под кампанию
(CXL). Homepage = brand traffic, не paid.

**Маппинг в Buffalo.** В нашем `BriefSchema.pageArchetype` сейчас три значения:
`saas` (≈ Homepage/Feature), `waitlist` (≈ Launch), `enterprise` (≈ Pricing/Comparison).
Этого мало — на этапе 3-4 расширим до 8 типов через `Brief.pageType` или
discriminated union archetype'ов.

---

## 2. Awareness levels → copy framework (Schwartz)

5 стадий узнаваемости проблемы/решения. Стадия определяет, **с чего начинать
H1 и Hero**.

| Стадия | Что знает читатель | Hero начинается с… | Framework |
|--------|--------------------|--------------------|-----------|
| **Unaware** | Не знает, что у него проблема | Story-driven hook, метафора, неожиданная цифра | StoryBrand / story-led AIDA |
| **Problem-aware** | Знает проблему, не знает решений | Описание боли + последствие | **PAS** |
| **Solution-aware** | Знает категории решений, сравнивает | «До/после» переход + продукт как мост | **BAB** |
| **Product-aware** | Знает продукт, выбирает между фичами/тарифами | Конкретный benefit + proof | Feature-Benefit Transformation |
| **Most-aware** | Готов покупать, ищет повод | Offer, urgency, guarantee | Direct CTA + Risk reversal |

**Как определять стадию.** Ключевая фраза кампании / источник трафика:

- Брендовый запрос («buffalo signup») → most-aware.
- «Buffalo vs Webflow» → product-aware.
- «Landing builder for SaaS» → solution-aware.
- «Как ускорить тесты лендингов» → problem-aware.
- Cold inbound, top-funnel → unaware.

**Mid-funnel правило.** Unaware / problem-aware — **не** начинать с фичи.
Сначала эмпатия + проблема, потом продукт. Иначе CR падает на ~40% (CXL).

---

## 3. Hero (above the fold) — 80% результата

Пользователь проводит ~57% времени просмотра выше fold'а. Если в первом
экране непонятно «что это, для кого, что я получу» — он уходит.

- **Hero отвечает на 3 вопроса за 5 секунд:** что это, для кого, какой результат.
- **Один primary CTA выше fold**, без скролла. На мобиле 375×667 кнопка
  видна целиком; на 1280×720 слева текст + CTA, справа большой product visual.
- **LCP ≤ 2,5 s.** При 4 s — bounce rate +90% (Demand Curve).

### 3.A Industry-standard Hero layout (default для всех типов кроме vs)

Так делают Linear / Stripe / Notion / Vercel / Cron. Хорошо ложится на наш
`HeroSection` из `LandingSpec`.

```
┌──────────────────────────────────────────────────────────────────┐
│  H1 (1–2 строки, идеал 25–35 знаков, ≤ 60 предел)                │
│  Subheading (1 строка, ≤ 70 знаков)                              │
│                                                                  │
│  [Primary CTA]   Secondary text-link (опц.)                       │
│  Trust-line · через · разделитель                                │     [LARGE PRODUCT VISUAL]
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Жёсткие правила левой колонки:**

- **Eyebrow / kicker — опционален.** Если К1-фраза уже в H1 буквально — kicker
  только дублирует. Убираем.
- **H1 — 1–2 строки максимум на десктопе.** Идеал 25–35 знаков, предел 60.
  Длинный H1 с перечислением и em-dash на десктопе разваливается на 3 строки,
  на мобиле — на 4. Расширения уходят в subheading.
- **Subheading — одна строка.** Не абзац. Идеал 50–70 знаков, предел 200
  (по schema). Одна мысль: либо что внутри (охват), либо как (процесс).
- **Primary CTA + secondary text-link в одной строке.** Primary — solid violet,
  secondary — ghost text-link или outline.
- **Trust-line — micro-fineprint под кнопкой.** 12–13 px, muted. 2–3 бенефита
  через `·`-разделитель: «Бесплатно · Без рекламы · Удалить аккаунт в 1 клик».
  Не отдельным абзацем над кнопкой.

**Правила правой колонки:**

- **Большой product visual.** Не одиночная стоковая картинка. Композиция из
  собственных мокапов / иллюстраций / device-frame, с лёгким glow halo.
  Делается через `IllustrationSpec` (scene = `device_showcase` / `isometric_dashboard`).
- **Никакой формы в Hero.** Кнопка ведёт на signup-flow или открывает sheet/modal.

### 3.B vs-страницы (`/vs/<brand>`) — конкурентный контраст

Наследует §3.A, но имеет свою структуру под сравнительный intent.

- **Eyebrow «Альтернатива {Бренду}»** — допустим, оптимально drop если К-фраза
  в H1 уже содержит имя конкурента.
- **H1 ≤ 45 знаков**, формула: `[Продукт как альтернатива] [бренду]`.
  Пример: «Buffalo vs Webflow: SSR-лендинги без CMS».
- **Subheading — одна строка ≤ 90 знаков.** Главное отличие, не маркетинг-вода.
- **Visual** — split-card с конкурентным контрастом (стилизованная типографика
  имени конкурента слева, наш mockup справа; `vs` или `→` посередине; glow
  halo brand-tinted). Без actual logo конкурента — licensing risk.

---

## 4. Каталог секций (15 типов)

Что включает каждая секция, для каких типов страниц обязательна (✓), допустима
(○), запрещена (✕). См. §1 для page types.

| # | Секция | Цель | Home | Feat | UC | vs | Test | Lnch | Intg | Pric |
|---|--------|------|------|------|----|----|------|------|------|------|
| 1 | **Announcement Bar** | Срочность / новость наверху | ○ | ○ | ○ | ○ | ✕ | ✓ | ✕ | ○ |
| 2 | **Hero** | 80% результата, см. §3 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| 3 | **Logo Bar** | Soc proof одной строкой | ○ | ✕ | ✓ | ○ | ✕ | ✕ | ○ | ○ |
| 4 | **Problem Agitation** | Эмпатия, боль, последствие | ○ | ✓ | ✓ | ✕ | ✕ | ✕ | ✕ | ✕ |
| 5 | **Solution / Benefits (USP)** | USP-карточки (§6.A) | ✓ | ✓ | ✓ | ○ | ✕ | ✓ | ○ | ○ |
| 6 | **How It Works** | 3-шаговая последовательность | ✓ | ✓ | ✓ | ✕ | ✕ | ○ | ✓ | ✕ |
| 7 | **Features (bento grid)** | Нелинейный охват возможностей | ✓ | ○ | ○ | ✕ | ✕ | ○ | ✕ | ○ |
| 8 | **Testimonials** | Цитаты + photo + attribution | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ○ | ✓ |
| 9 | **Comparison Table** | Сравнение с альтернативами | ○ | ✕ | ✕ | ✓ | ✕ | ✕ | ✕ | ✓ |
| 10 | **Pricing** | 3 tier + переключатель год/мес | ○ | ✕ | ✕ | ○ | ✕ | ○ | ✕ | ✓ |
| 11 | **FAQ** | 5–7 вопросов, объекции | ✓ | ✓ | ✓ | ✓ | ✕ | ✓ | ✓ | ✓ |
| 12 | **Founder's Note** | Гуманизация, для unaware | ○ | ✕ | ○ | ✕ | ○ | ✕ | ✕ | ✕ |
| 13 | **Guarantee** | Risk reversal перед оплатой | ✕ | ✕ | ✕ | ○ | ✕ | ✕ | ✕ | ✓ |
| 14 | **Final CTA Block** | Повтор главной кнопки | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| 15 | **Footer** | Юридическое + nav | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

**Ядро (на всех):** Hero, Final CTA, Footer.
**Опциональные:** Announcement Bar, Founder's Note, Comparison Table, Guarantee.
**Никогда:** Pricing на feature-странице (отвлекает), Comparison на use-case
(преждевременно).

### 4.A Маппинг каталога на Buffalo LandingSpec

На момент написания skill наш `SectionSchema` содержит 6 типов из 15:

| Секция каталога §4 | LandingSpec.component | Статус |
|--------------------|------------------------|--------|
| Hero | `HeroSection` | ✅ implemented |
| Solution / Benefits | `FeatureGrid` (как USP-grid) | ✅ implemented (cap 8 items) |
| Features (bento) | `FeatureGrid` (3-колоночный режим) | ✅ через `columns` prop |
| Pricing | `PricingPlans` | ✅ implemented (2-4 plans) |
| FAQ | `FAQAccordion` | ✅ implemented (2-12 items) |
| Final CTA Block | `FinalCta` | ✅ implemented |
| Footer | `LandingFooter` | ✅ implemented |
| Announcement Bar | — | ⏳ TODO (этап 3) |
| Logo Bar | — | ⏳ TODO |
| Problem Agitation | — | ⏳ TODO |
| How It Works | — | ⏳ TODO (можно эмулировать через FeatureGrid columns=3) |
| Testimonials | — | ⏳ TODO (этап 3) |
| Comparison Table | — | ⏳ TODO (этап 4, для vs-страниц) |
| Founder's Note | — | ⏳ TODO |
| Guarantee | — | ⏳ TODO |

При генерации LandingSpec для page type, где секция требуется (✓), но её
компонента ещё нет в registry, — **не выдумываем**. Либо эмулируем через
FeatureGrid с явной структурой (3 шага = 3 items), либо помечаем как gap
в LandingSpec.meta и оставляем на ручной TSX-этап.

---

## 5. Копирайт — правила

База: voice-of-customer + инфостиль Ильяхова (стоп-слова из §11).

### 5.A Conversion Equation

```
CR = (Desire × Clarity) / (Effort + Confusion)
```

Каждое изменение либо **усиливает Desire/Clarity**, либо **снижает
Effort/Confusion**. Если правка не двигает ни одно — она не нужна.

### 5.B Headline (H1) = описание продукта, не слоган

**Тест:** если человек прочитает только H1 — поймёт ли он, что мы продаём?

- ❌ «Финансы — это просто» — слоган, провал.
- ✅ «Учёт расходов с QR-чеками и совместным бюджетом» — описание.

**Формулы H1 (выбрать одну под awareness §2):**

| Awareness | Формула | Пример |
|-----------|---------|--------|
| Unaware | Curiosity gap: `[Неожиданное утверждение] + [Контекст]` | «Деньги уходят, и вы не помните куда. Найдём за 3 минуты в день» |
| Problem-aware | Pain-agitate: `[Боль] + [Последствие] + [Намёк]` | «Хаос в расходах = минус 50 000 ₽ в год. Уберите его учётом за 10 секунд» |
| Solution-aware | Specific outcome: `[Глагол] + [Результат] + [Сроки]` | «Запланируйте бюджет на 12 месяцев — за 5 минут» |
| Product-aware | Feature → benefit: `[Фича]: [Benefit]` | «Сканер чеков: расход в трекере за 3 секунды» |
| Most-aware | Direct offer + guarantee | «Создайте аккаунт бесплатно — удалить можно в 1 клик» |
| Comparison/vs | `[Мы] как альтернатива [бренду]: [главный benefit]` | «Buffalo vs Webflow: SSR-лендинги без CMS» |

**Длина (жёстко).** H1 идеал 25–35 знаков, предел по schema 80. Subheading
идеал 50–70 знаков, по schema 10..200. Чем короче H1 — тем громче.

**Семантика кампании.** H1 буквально содержит ключевую фразу Direct/Ads-кампании
или primary keyword страницы. Если кампания на «приложение для учёта расходов» —
слова «учёт расходов» в H1.

**❌ Длинные H1 с em-dash и перечислением** на десктопе разваливаются на 2–3
строки, на мобиле — на 4. Перечисления переносим в subheading.

### 5.C Feature → Benefit Transformation (мандат 2026)

Новый стандарт индустрии. Каждая фича на странице проходит через 3-уровневую
трансформацию:

```
Уровень 1 (плохо):  «У нас AES-256 шифрование»
Уровень 2 (норма):  «Защитите данные с AES-256 шифрованием»
Уровень 3 (топ):    «Получите SOC2 за дни вместо месяцев — данные защищены AES-256»
                     ↑ outcome              ↑ time-frame    ↑ mechanism
```

**Формула:** `[Outcome для пользователя] + [Time-frame / сравнение] — [Mechanism]`

Применять ко всем USP-карточкам (§6.A), к feature-bento, к bullets в How It Works.

### 5.D CTA hierarchy + микрокопи

**Иерархия силы (лучшее → худшее):**

1. **Персонализация + результат:** «Получить мой план бюджета» (+202% vs generic)
2. **Результат + срок:** «Создать аккаунт — за 1 минуту»
3. **Действие + benefit:** «Попробовать бесплатно 14 дней»
4. **Простое действие:** «Начать»
5. ❌ **Generic:** «Отправить», «Узнать больше», «Подробнее»

**Микрокопи под кнопкой (обязательно — снимает страх):**
- «Без карты», «Без рекламы», «Можно удалить в 1 клик»
- «Бесплатно — навсегда»
- «2 минуты на регистрацию»

**Повтор CTA:** в Hero, в mid-section (после 3-й секции), в Final CTA.
Всегда одно и то же действие — одна цель страницы (§5.E).

### 5.E Один CTA = одна цель страницы

Несколько offers снижают CR на ~266% (CXL).

- **Один primary action.** «И ещё посмотрите цены / блог / отзывы» — выкидывать
  или выносить на отдельную страницу. Demo-link допустим как text-link
  рядом (secondary, не button).
- **CTA — глагол с явным результатом** (§5.D иерархию).
- **CTA повторяется** в Hero, mid-section и финальном блоке, но это та же
  единственная цель.

### 5.F Voice-of-customer + базовые правила

- **Voice-of-customer** (Joanna Wiebe): использовать слова, которыми клиент сам
  описывает проблему — из интервью, support-тикетов, отзывов. Не наши
  внутренние термины.
- **Бенефит > фича.** Не «12-месячный прогноз», а «увидите, что будет с
  деньгами в декабре».
- **Цифры > прилагательных.** «20 категорий, ввод за 3 тапа» вместо «удобный
  учёт». «-32% к бюджету на еду» вместо «отличная экономия».
- **Глагол сильнее существительного.** «Запланируйте бюджет», не
  «осуществите планирование бюджета».
- **Один абзац = одна мысль.** Подлежащее и сказуемое в начале.
- **Reading level — 5–7 grade.** Простой язык конвертит ×6 vs «профессиональный»
  (12.9% vs 2.1%, SaaS Hero 2026).

---

## 6. Визуал — правила

### 6.A USP-карточки: иллюстрация + сжатая копи (horizontal layout)

Сетка USP (обычно 4 карточки 2×2 или 3 в линию) — главное визуальное
объяснение продукта **после Hero**. Здесь читатель решает, листать или
закрывать.

```
┌─────────────────────────┐ ┌─────────────────────────┐
│  ┌────┐                 │ │  ┌────┐                 │
│  │SVG │  H3 заголовок   │ │  │SVG │  H3 заголовок   │
│  │1/3 │  Тело 1–2 стр.  │ │  │1/3 │  Тело 1–2 стр.  │
│  └────┘                 │ │  └────┘                 │
└─────────────────────────┘ └─────────────────────────┘
```

- **Layout — горизонтальный.** Иллюстрация ~1/3 ширины карточки слева на
  tone-tinted gradient-панели, текст 2/3 справа. Вертикальный layout с маленьким
  lucide-icon — fallback для PoC, не для финального лендинга.
- **Иллюстрация — миниатюрный product-UI мокап.** См. §6.B.
- **Tone-палитра — из Kaiten DS.** По одному tone на карточку — 4 карточки
  не должны сливаться в монохром:
  - `violet` (primary brand)
  - `purple`
  - `blue`
  - `green`
  - `lime`
  - `orange`
  - `red` (только для warning/danger контекстов)
- **Title (H3) ≤ 35 знаков**, начинается с цифры или сильного глагола.
  В schema — поле `items[].title` 2..60.
- **Body ≤ 90 знаков** в horizontal-layout (поле ~34ch). Один факт + одно
  следствие, через `→` или `—`. **Применять §5.C Feature→Benefit
  Transformation** к каждой карточке — outcome-first, не feature-first.

### 6.B Стиль SVG-иллюстраций (обязательно)

Единое визуальное правило для **всех** маркетинговых SVG-иллюстраций.
Разделяет **иконки** (мелкие глифы — lucide или собственный set,
stroke-based, ≤24×24) и **иллюстрации** (крупные маркетинговые, 80×64+ px).

**Что такое product-UI мокап в SVG:**

- **Карточки внутри карточки.** Минимум 1 «карточка» с rounded corners,
  background + border. Часто 2 слоя (передний + фоновый сдвинутый — даёт
  ощущение глубины).
- **Skeleton-линии вместо текста.** Серые rounded rects (`fill-foreground/[0.15-0.35]`).
- **Pill-бейджи и chip'ы** для статусов / категорий / меток.
- **Цветные точки** (3 px радиус) для категорий / счетов / типов.
- **Avatar-кружки с градиентом** для людей / партнёров (опционально).
- **Tooltip-пузырьки** с иконкой + skeleton-цифрой («−32%» поверх bar-чарта).
- **Иконка-чекмарка** на цветном кружке — для success-состояний.

**Что НЕ делаем:**
- ❌ Абстрактные пиктограммы (enlarged lucide-icon как картинка).
- ❌ Тонкие stroke-only outline в стиле undraw / open-doodles.
- ❌ Реалистичные фотографии / 3D / sticker-style.

**Технические правила:**
- viewBox **120×96** (5:4) — стандарт для USP-card. До 160×120 для Hero.
- Базовая палитра — `currentColor`. Унаследует tone родительской панели.
- `className="fill-background"` для theme-aware фона карточек.
- Без `stroke-only` outline. Каждая фигура — `fill` + опциональный `stroke`.
- `drop-shadow-md` для верхнего слоя в layered композиции.
- **Никаких текстовых лейблов внутри SVG** — i18n + ресайз. Skeleton-rects.

### 6.C Hero showcase composition

Hero справа — не одиночный mockup, а **композиция из 2 mockup'ов / devices**.
В Buffalo это `IllustrationSpec`:

- **scene:** `device_showcase` или `isometric_dashboard`.
- **devices**: 1 основной (laptop / phone) + 1 акцентный под наклоном.
- **palette.accent** — из brand-color брифа (Kaiten violet по умолчанию).
- **glow** — enabled, центр ~ верхний правый угол сцены, brand-tinted.
- **decorations** ≤ 3 — лёгкие blob/sparkle. Никаких сложных illustration overlays.

**Композиционные правила:**
- **Один — основной**, центрированный, в полную ширину сцены.
- **Один — акцентный**, под наклоном `-rotate-[5deg]`, меньше по ширине
  (~58%), opacity ~95%, позиция `absolute -left-X -top-Y`.
- **Glow halo** за композицией: brand-tinted, blur-3xl, размер `-inset-10`,
  форма rounded ~42%.
- **Warm accent** на противоположной стороне: `bg-orange-500/[0.10]`,
  меньшего размера (`size-48`).
- **Контейнер** — `relative mx-auto w-full max-w-[440px]`.

**Релевантность подбора (КРИТИЧНО для CR).** Каждый лендинг — **УНИКАЛЬНАЯ
пара устройств/мокапов**, отражающая ключевую фразу страницы. Цель — visual
buyer-relevant: «прочитал H1 → увидел справа именно то, что обещано».

Анти-паттерн: одинаковый Hero showcase на нескольких лендингах = read-once-skip-rest.

**vs-страницы** — `IllustrationSpec.scene = metaphor` с split-card композицией
(имя конкурента слева как стилизованная типографика, наш mockup справа,
glow halo brand-tinted).

---

## 7. CTA, формы и микро-trust

### 7.A LandingSpec CTA-разметка

В Buffalo формы как таковой нет — CTA-кнопка ведёт на signup-flow вне страницы.
В `HeroSection.primaryCta` и `FinalCta.primaryCta` обязательны: `{ label, href }`.
`secondaryCta` опционален и nullable.

Правила:
- **Primary CTA** — outcome action (§5.D), label 2–4 слова, ≤ 40 знаков
  (по schema).
- **Secondary CTA** — text-link или outline-button. Допустим в Hero как «Демо
  без регистрации» / «Смотреть пример». Не делать вторую solid-кнопку — глаз
  не понимает, куда смотреть, CR падает.
- **Микрокопи** под primary CTA — отдельная строка (subtitle / описание секции
  под кнопкой), 2–3 бенефита через `·`.

### 7.B Если в будущем добавим формы (signup, lead-magnet)

| Полей | Approx CR |
|-------|-----------|
| 1 (email only) | ~13% |
| 2–3 | ~10% |
| 4 | ~8% |
| 5 | ~6% |
| 6+ | <5% |

**Правила формы:**
- ≤ 4 полей → +120% CR (NN/G). Если нельзя сократить ниже 5 — **multi-step**
  (+86% vs single-page, HubSpot 2026).
- **Magic Link primary** где возможно — убирает «пароль».
- **Trust-line под формой:** «без рекламы», «удалить аккаунт в 1 клик», «без
  передачи данных третьим лицам».
- **Никаких pre-checked checkbox'ов согласия.** Юзер уходит, ещё и злой.
- **Inline-валидация** — ошибка сразу под полем, не на submit.
- **Submit-кнопка — outcome-CTA**, не «Submit».

---

## 8. Социальные доказательства

Testimonials → +34% CR (NN/G). Trust signals → +37% CR (SaaS Hero 2026).
**Размещение — рядом с CTA**, не отдельной страницей.

### 8.A Типы социального доказательства

| Тип | Где размещать | Сила |
|-----|---------------|------|
| **Video testimonial** | Между Hero и Pricing | ★★★★★ |
| **Цитата + photo + name + role/city** | Около CTA, секция Testimonials | ★★★★ |
| **Quantified result** («-32% на еду за квартал») | В Hero subheading или USP | ★★★★ |
| **Числа пользователей** («1 200 пар ведут общий бюджет») | Logo Bar, Hero, Final CTA | ★★★ |
| **Logo Bar** (узнаваемые бренды) | Под Hero | ★★★ — только если бренды реально узнаваемые |
| **G2 / Capterra / Trustpilot badge** | Hero или Pricing | ★★★ (B2B) |
| **Security badges** (SOC2, GDPR) | Около формы | ★★ (enterprise) |
| **Анонимный «довольный клиент»** | — | 0 — не работает |

### 8.B Правила

- **Имя + город / роль** на каждой цитате. Анонимные не работают.
- **Цифры > прилагательные.** «1 200 пар» > «много пользователей».
- **Если отзывов нет** — placeholder с явной пометкой «Пример — собираем
  реальные отзывы». **Не фейковать.**
- **Photo / avatar обязательно** на цитате (даже сгенерированный из инициалов).

---

## 9. Психологические якоря (этично)

Из growth.design / B.I.A.S. и Cialdini. Усилители — **не** dark patterns.

| Якорь | Применение | Пример |
|-------|------------|--------|
| **Loss aversion** | «Не теряйте контроль» сильнее «получите контроль» | Hero pain-points |
| **Social proof** | Цифры пользователей рядом с CTA | «1 200 пар уже ведут бюджет» |
| **Anchoring** | Сначала сложность, потом простота продукта | Problem agitation → Solution |
| **Peak-end rule** | Последний шаг регистрации + welcome-email | Magic Link + first-run experience |
| **Default bias** | Что стоит по умолчанию — то и выберут | Primary CTA solid, secondary — text-link |
| **Reciprocity** | Сначала дать ценность (демо, lead-magnet), потом просить | Demo до регистрации |
| **Scarcity (real only)** | Реальные дедлайны / места | Запуски новых фич с датой |
| **Authority** | Founder's Note, expertise signals | Авторы блога с био |

**❌ Dark patterns запрещены.** Black mirror test (growth.design): если тебе
самому будет противно от того, как продукт уговаривает — переделать. Запрещено:
- ❌ Таймеры, которые перезагружаются
- ❌ «Только 3 места осталось» при unlimited supply
- ❌ Пре-чекнутые чекбоксы согласия
- ❌ Скрытые цены / лестничные подписки
- ❌ Roach motel (легко зайти — сложно отписаться)

---

## 10. Mobile-first + производительность

83% трафика — mobile (но desktop конвертит на 8% лучше). Hero должен работать
на 375×667 (iPhone SE), потом адаптируется на десктоп.

### 10.A Производительность

| Метрика | Цель | Critical |
|---------|------|----------|
| **LCP** (Largest Contentful Paint) | ≤ 2,5 s | > 4 s → bounce +90% |
| **CLS** (Cumulative Layout Shift) | ≤ 0,1 | > 0,25 |
| **INP** (Interaction to Next Paint) | ≤ 200 ms | > 500 ms |
| **TTFB** | ≤ 600 ms | > 1,8 s |
| **Lighthouse Performance** | ≥ 90 | < 70 |

### 10.B Mobile правила

- **Hero на 375×667** виден полностью без скролла.
- **CTA-кнопка** — min 44×44 px touch target, sticky на mobile рекомендуется
  (+12–32% CR).
- **Изображения** — Next.js `<Image>` с фиксированными размерами (анти-CLS),
  `priority` только на hero image.
- **Шрифты** — `font-display: swap`, preload основных весов.
- **Не делать** arbitrary Tailwind-классов с URL (`bg-[url(...)]`) — Turbopack
  ломается; используем `<Image>` + CSS overlay.

---

## 11. Anti-patterns — не делать никогда

1. **Generic H1 без описания продукта** («Превратите финансы в спокойствие»).
   Тест: прочитавший только H1 не поймёт продукт.
2. **Несколько primary CTA на странице** — снижает CR на 266% (CXL). Один
   primary, остальные — text-links.
3. **Форма-карточка в Hero** для SaaS (это паттерн email-leadgen, не SaaS).
4. **Stock-photo вместо product visual** — никто не верит. Только собственные
   mockup'ы / SVG-иллюстрации (§6).
5. **Одинаковый Hero showcase** на нескольких лендингах. У каждого — уникальная
   пара устройств/мокапов под ключевую фразу.
6. **PPC-трафик на homepage** — homepage = brand-traffic. Под кампанию = свой
   лендинг.
7. **Длинная форма без multi-step** — 6+ полей single-page = CR <5%.
8. **Анонимные отзывы / фейк-цифры** — «довольный клиент» без имени/города
   не работает. Не фейковать — лучше honest placeholder.
9. **Dark patterns** — fake таймеры, fake-scarcity, pre-checked consent,
   roach motel.
10. **Stop-слова Редполитики** в копи: *просто, легко, удобно, надёжный,
    оптимальный, инновационный, революционный, лидер №1, выигрыш, AI-magic,
    10x, революционный, превосходный*. Англ.: *revolutionary, seamless,
    next-gen, world-class, best-in-class, AI-powered* без proof.
11. **Stroke-only outline иллюстрации** в стиле undraw — не наш визуальный
    язык. Только flat product-UI mockup (§6.B).
12. **Текстовые лейблы внутри SVG** — i18n + ресайз. Используем skeleton-rects.
13. **Invented компоненты или props** — LLM должен использовать только
    зарегистрированные в registry. Если нужного нет — оставить gap, не
    выдумывать.

---

## 12. Benchmarks 2026 (one-glance таблица)

| Метрика | Median | Top 10% | Источник |
|---------|--------|---------|----------|
| **SaaS landing CR** | 3,8% | ≥ 10% | SaaS Hero 2026 |
| **B2B SaaS demo-request CR** | 2,5% | 6–9% | Demand Curve |
| **Form CR (4 fields)** | 10% | — | NN/G + Default |
| **Form CR (multi-step)** | +86% vs single | — | HubSpot 2026 |
| **Headline с числом** | +15% CR | — | SaaS Hero |
| **Hero video** | +80% CR | — | SaaS Hero (only top performers) |
| **Personalized CTA** | +202% CR | — | HubSpot |
| **Reading level 5–7 grade** | 12,9% CR | — | SaaS Hero |
| **Reading level professional** | 2,1% CR | — | SaaS Hero (×6 хуже) |
| **AI-personalized landing** | +37% vs human-written | — | HubSpot |
| **Testimonials присутствие** | +34% CR | — | NN/G |
| **Trust signals около CTA** | +37% CR | — | SaaS Hero |
| **Mobile traffic share** | 83% | — | SaaS Hero |
| **LCP target** | ≤ 2,5 s | ≤ 1,8 s | Core Web Vitals |
| **CLS target** | ≤ 0,1 | ≤ 0,05 | Core Web Vitals |
| **Lighthouse Performance** | ≥ 90 | ≥ 95 | — |

**Ориентир Buffalo.** Сгенерированный лендинг должен набирать ≥ 75/100 в
audit-mode (§15) при первой попытке. Repair-loop поднимает оставшихся до ≥ 85.

---

## 13. Аналитика и атрибуция

Каждый сгенерированный лендинг — атрибутирован, чтобы знать его performance.

- **landingSlug** в `generated/landings/<slug>/manifest.json` (имя папки = slug).
- **Источник брифа** хранится в `manifest.brief.sourcePath` / `brief.id`.
- **Event конверсии** — для встроенных CTA href, у которых есть UTM-параметры:
  `utm_source=buffalo`, `utm_medium=landing`, `utm_campaign=<slug>`.
- **Если несколько форм/CTA** на странице — у всех проброшен один `landing_slug`.
- **Бенчмарк** сохраняется в `manifest.benchmark.{auditScore, lcp, cls, inp}`
  по результату последнего прогона validators.

---

## 14. Pre-merge checklist (CREATE mode)

**Hero / выше fold (§3)**
- [ ] H1 описывает продукт буквально, идеал 25–35 знаков (≤ 80 предел schema), 1–2 строки на десктопе
- [ ] H1 содержит ключевую фразу кампании / primary keyword (§5.B)
- [ ] H1 формула соответствует awareness level (§2)
- [ ] Subheading — одна строка, ≤ 70 знаков идеал (10..200 по schema)
- [ ] Eyebrow отсутствует, если К-фраза уже в H1 буквально
- [ ] Один primary CTA — кнопка с outcome-label (§5.D), secondary как text-link или null
- [ ] Trust-line — micro-fineprint (12–13 px, `·`-разделитель)
- [ ] Справа — большой product visual через `IllustrationSpec`
- [ ] Hero виден полностью на 375×667 без скролла

**Page type & structure (§1, §4)**
- [ ] Тип страницы определён (Homepage / Feature / Use-case / vs / Testimonials / Launch / Integration / Pricing)
- [ ] Секции соответствуют ✓/○/✕ матрице §4 для этого типа
- [ ] Awareness level определён (§2), framework copy выбран
- [ ] Если секции из каталога нет в registry — gap явный, не выдумываем компонент

**Hero showcase (§6.C)**
- [ ] `IllustrationSpec` с уникальной композицией под К-фразу
- [ ] Один основной + один акцентный device под наклоном
- [ ] Glow halo (brand-tinted) + warm accent на противоположной стороне
- [ ] palette.accent соответствует Kaiten violet (или brand-override из брифа)

**USP-карточки (§6.A)**
- [ ] 3–4 USP с конкретикой (цифры, не прилагательные)
- [ ] Horizontal layout, иллюстрация ~1/3 слева на tone-панели
- [ ] Иллюстрации — кастомные SVG product-UI мокап (§6.B), не lucide-абстракции
- [ ] Tone-палитра — 4 разных tone из Kaiten, не сливаются
- [ ] Title (H3) ≤ 35 знаков, начинается с цифры или сильного глагола
- [ ] Body ≤ 90 знаков, **Feature → Benefit Transformation (§5.C) применён**

**Копи (§5)**
- [ ] Voice-of-customer: язык пользователя, не наш
- [ ] Бенефиты, а не фичи; цифры, а не прилагательные
- [ ] Reading level 5–7 grade (проверить glvrd.ru ≥ 7 для RU; Hemingway ≤ 7 для EN)
- [ ] Нет стоп-слов Редполитики (§11.10)
- [ ] CTA повторён в Hero, mid-section, Final CTA — одно и то же действие

**Социальное доказательство (§8)**
- [ ] Минимум 3 testimonial с именем + городом/ролью + photo (если секция есть в registry)
- [ ] Цифры пользователей где-то на странице
- [ ] Если отзывов нет — явный placeholder «Пример — собираем реальные»
- [ ] Trust signals рядом с CTA (badges / numbers / micro-fineprint)

**SEO**
- [ ] `seo.title` ≤ 60 знаков, в первой половине — ключевая фраза
- [ ] `seo.description` ≤ 160 знаков, по schema 10..160
- [ ] (опц.) JSON-LD: WebPage + BreadcrumbList + FAQPage (если FAQ);
      vs-страницы дополнительно SoftwareApplication

**Производительность (§10)**
- [ ] LCP ≤ 2,5 s (PageSpeed Insights на preview)
- [ ] CLS ≤ 0,1, INP ≤ 200 ms
- [ ] Lighthouse Performance ≥ 90
- [ ] Mobile-perfect на 375×667 и 390×844
- [ ] Build green (`pnpm build`)

**Harness validators**
- [ ] `pnpm harness validate <slug>` зелёный (schema / brand / a11y / visual / ast)
- [ ] Нет invented components / invented props
- [ ] Каждое поле в LandingSpec соответствует schema length-constraints

---

## 15. AUDIT mode — 100-балльный scorecard

Прогон готовой страницы. Считается score по 7 категориям, формируется отчёт
с critical/high/medium-приоритезацией.

### 15.A Категории и веса

| # | Категория | Баллы |
|---|-----------|-------|
| 1 | **Hero Section** | 20 |
| 2 | **Value Proposition** | 15 |
| 3 | **Social Proof** | 15 |
| 4 | **CTA Optimization** | 15 |
| 5 | **Copy Quality** | 15 |
| 6 | **Design & UX** | 10 |
| 7 | **Technical Performance** | 10 |
| | **Total** | **100** |

### 15.B Пункты проверки

**Hero Section (20 баллов)**
- (4) H1 ≤ 60 знаков, описывает продукт буквально, не слоган
- (3) H1 содержит ключевую фразу кампании
- (3) Subheading ≤ 140 знаков, одна мысль
- (3) Primary CTA видна выше fold, без конкурирующих solid-кнопок
- (3) Trust-line под CTA с 2–3 бенефитами через `·`
- (4) Product visual (showcase из 2 mockup'ов, glow halo, warm accent)

**Value Proposition (15 баллов)**
- (4) Awareness level определён, framework copy соответствует (§2)
- (3) USP-карточки horizontal layout, ≥ 3 шт
- (4) Feature → Benefit Transformation применён к каждой USP
- (2) Цифры > прилагательных в body USP
- (2) Tone-палитра — 4 разных tone, не монохром

**Social Proof (15 баллов)**
- (3) Минимум 3 testimonial с photo + name + city/role
- (3) Quantified results («-32% к бюджету») в hero или USP
- (3) Числа пользователей на странице («1 200 пар»)
- (3) Trust signals рядом с одним из CTA
- (3) Размещение proof возле CTA, не отдельной страницей

**CTA Optimization (15 баллов)**
- (4) Один primary CTA повторён 3+ раза (Hero / mid / final) — одно действие
- (4) CTA из §5.D иерархии (персонализация / результат), не «Submit»
- (3) Микрокопи под кнопкой («Без карты», «За 2 минуты»)
- (2) Sticky CTA на mobile
- (2) Цветовой контраст ≥ 4.5:1 (WCAG AA)

**Copy Quality (15 баллов)**
- (3) Voice-of-customer, не внутренние термины
- (3) Reading level 5–7 grade (glvrd.ru ≥ 7 для RU; Hemingway ≤ 7 для EN)
- (3) Нет stop-слов Редполитики
- (2) Каждая секция = одна мысль, скан легко
- (2) Заголовки H2/H3 — benefit-driven, не «Наши преимущества»
- (2) Subheadings конкретны, цифры > прилагательных

**Design & UX (10 баллов)**
- (2) Визуальная иерархия — глаз ведёт от H1 к CTA
- (2) Whitespace достаточен, секции не слипаются
- (2) Mobile 375×667 perfect, 390×844 perfect
- (2) Navigation минимальна на лендинге (no full header dropdown)
- (2) SVG-иллюстрации в стиле §6.B (product-UI mockup, не abstract)

**Technical Performance (10 баллов)**
- (3) LCP ≤ 2,5 s (PageSpeed Insights)
- (2) CLS ≤ 0,1
- (2) INP ≤ 200 ms
- (1) Lighthouse Performance ≥ 90
- (1) HTTP 200, no JS errors
- (1) JSON-LD парсится валидно (если есть)

### 15.C Tier'ы и priority

| Score | Tier | Действие |
|-------|------|----------|
| **90–100** | Excellent | Minor tweaks. Можно публиковать. Фокус на A/B тестах. |
| **75–89** | Solid | Точечные правки по low-scoring пунктам |
| **60–74** | Needs work | Significant rewrite одной-двух секций |
| **< 60** | Critical | Complete redesign по §0.A create-flow |

**Priority issues:**
- **Critical (fix now)** — потеряны баллы в Hero (≥ 5) или CTA (≥ 5).
  Влияет на основной conversion path.
- **High (fix this week)** — Value Prop / Social Proof / Copy потери ≥ 5.
- **Medium (optimisation)** — Design / Tech / точечные пункты в любой категории.

### 15.D Audit output format

```markdown
# Audit: /<slug>

**Score:** XX / 100 — <Tier>

## Категории
- Hero: X / 20
- Value Prop: X / 15
- Social Proof: X / 15
- CTA: X / 15
- Copy: X / 15
- Design & UX: X / 10
- Tech Perf: X / 10

## Critical (fix now)
1. <Что не так> → <Что сделать> (§<ссылка на правило>)

## High Priority (fix this week)
1. ...

## Medium (optimisation)
1. ...

## Что работает хорошо
- ...
```

---

## 16. Источники

**Базовые фреймворки:**
- [growth.design / B.I.A.S. framework](https://growth.design/course) —
  поведенческая психология, ethical growth, humane design
- [Julian Shapiro — Startup Handbook: Landing Pages](https://www.julian.com/guide/startup/landing-pages) —
  H1 как описание, структура страницы, парные image+text
- [CXL — How to Build a High-Converting Landing Page](https://cxl.com/blog/how-to-build-a-high-converting-landing-page/) —
  6 критериев (Clarity / Relevancy / Motivation / Buying stage), research-driven CRO
- [Demand Curve — Above the Fold playbook](https://www.demandcurve.com/playbooks/above-the-fold) —
  hero-формула, SaaS growth tactics
- [Copyhackers — Conversion copywriting](https://copyhackers.com/conversion-copywriting-defined/) —
  voice-of-customer, формула «Get [Benefit]. With [Feature]»
- [Nielsen Norman Group](https://www.nngroup.com/articles/) — usability
  heuristics, 4 принципа форм, eye-tracking

**Copywriting frameworks (§2, §5):**
- Eugene Schwartz, *Breakthrough Advertising* (1966) — 5 awareness levels
- Donald Miller, *Building a StoryBrand* (2017) — customer-as-hero
- AIDA, PAS, BAB — общепринятые copywriting структуры

**Benchmarks 2026 (§12):**
- [SaaS Hero — Landing Page Optimization Checklist 2026](https://www.saashero.net/design/landing-page-optimization-checklist-2026/)
- [SaaS Hero — High-Converting SaaS Landing Pages 2026](https://www.saashero.net/design/enterprise-landing-page-design-2026/)
- [Fibr.ai — 20 Best SaaS Landing Pages + 2026 Best Practices](https://fibr.ai/landing-page/saas-landing-pages)
- [Genesys Growth — B2B SaaS Landing Pages 2026](https://genesysgrowth.com/blog/designing-b2b-saas-landing-pages)
- [Rubik — SaaS Landing Page Audit Checklist](https://www.rubik.design/blog/saas-landing-page-design-checklist)

**Audit-mode reference:**
- [Mafia-Skills — landing-page-mastery SKILL.md](https://github.com/alexdcd/Mafia-Claude-Skills/blob/main/skills/landing-page-mastery/SKILL.md) —
  dual-flow (create + audit) + 100-point scorecard + sections catalog
- [SoarAI — AIDA vs PAS vs BAB](https://soarai.in/blog/aida-vs-pas-vs-bab.html)
- [Hive Digital — Frameworks for marketing content](https://www.hivedigital.com/blog/writing-frameworks-for-marketing-content/)

---

## 17. Использование в Buffalo pipeline

1. **system prompt** — этот skill подмешивается в `buildLandingSystemPrompt()`
   рядом с `design-system-kaiten.md`. LLM получает его как сжатый контракт
   при генерации LandingSpec.
2. **CLI generate** — `pnpm harness generate landing --brief <path>` создаёт
   LandingSpec, который потом рендерится в TSX. Skill определяет, какие
   секции и в каком порядке появятся.
3. **CLI validate** — `pnpm harness validate <slug>` запускает schema/brand/a11y
   валидаторы; ручной audit (§15) — поверх как separate step.
4. **CLI handoff** — `pnpm harness handoff <slug>` собирает финальный пакет.
   В manifest подкладывается `auditScore` из §15.
5. **Iteration mode** — для существующего лендинга агент открывает
   `/generated/landings/<slug>/spec.json`, прогоняет §15, получает priority
   list, правит spec, перерисовывает TSX, прогоняет validators ещё раз.

> **Связанные skills и документы:**
> - `design-system-kaiten-v01` — токены, типографика, цвета, состояния.
> - `content-marketing` — playbook для будущей блог-поверхности генератора.
> - `LandingSpec` schema — `packages/harness/src/schemas/landing-spec.ts`.
> - `IllustrationSpec` schema — `packages/harness/src/schemas/illustration-spec.ts`.
> - Component registry — `packages/harness/src/registry/index.ts`.
