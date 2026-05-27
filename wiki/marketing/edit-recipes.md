# Доработка готового лендинга — рецепты

> Если лендинг уже сгенерирован (`content/landings/<slug>.json` существует), не нужно перегенеривать весь — большинство правок делаются точечно через JSON.

## Где что лежит

| Файл | Что |
|---|---|
| `content/briefs/<slug>.json` | Бриф маркетинга (immutable — не редактировать, новый бриф = новый файл) |
| `content/landings/<slug>.json` | LandingSpec — структура лендинга. **Это редактируем для доработок.** |
| `generated/landings/<slug>/page.tsx` | Готовый TSX. Автогенерируется, **не редактировать вручную** — пересоберётся apply'ем. |
| `content/approvals/<slug>.json` | Approval-статус (заполняется через `/approve/<slug>` UI) |

## После любой правки

```bash
pnpm -w run harness agent apply landing --slug <slug> --brief content/briefs/<slug>.json
```

Это:
1. Валидирует spec (Zod + 8 проверок: brand, business, visual diversity, layout conformance, mock-fit, domain-match, cross-landing diversity, audience score).
2. Рендерит TSX заново.
3. Если падает — печатает конкретные ошибки. Правьте `landings/<slug>.json` и повторяйте.

И preview:

```bash
pnpm dev
# → http://localhost:3000/landings/<slug>
```

---

## Рецепт 1 — поменять заголовок hero

Открыть `content/landings/<slug>.json`, найти секцию `id: "hero"`:

```json
{
  "id": "hero",
  "component": "HeroSection",
  "props": {
    "title": "Старый заголовок ...",       // ← поменять
    "subtitle": "Старый подзаголовок ...", // ← или это
    ...
  }
}
```

Запустить apply. Готово.

**Ограничения:** title — 4-80 символов, subtitle — 10-200. Если выйдете за — apply ругнётся, поправите и снова.

---

## Рецепт 2 — поменять текст CTA

CTA лежит в нескольких местах:
- `hero.primaryCta.label` / `secondaryCta.label`
- `final_cta.primaryCta.label` / `secondaryCta.label`
- `cta_banner.primaryCta.label`

Поменять `label` (текст кнопки) и/или `href` (куда ведёт). После — apply.

**Правило:** все CTA должны быть согласованы с `brief.primaryGoal` и `brief.cta`. Если хотите изменить целевое действие — это уже новый brief (= новый slug + новый файл).

---

## Рецепт 3 — переставить секции местами

В JSON `sections` — это массив. Просто пересортируйте элементы.

**Ограничения:**
- Первый элемент — всегда hero.
- Последний — обычно footer.
- Если в `meta.layout` задан конкретный layout — `landing-layout-conformance` валидатор проверит порядок required-секций по [`wiki/layouts/<slug>.md`](../layouts/). Если нарушите — apply покажет где.

---

## Рецепт 4 — заменить mock-вариант (картинку)

Открыть Storybook визуальный каталог:

```bash
pnpm --filter @buffalo/ui storybook
# → http://localhost:6006 → Mocks/_Catalog/AllVariants
```

Выбрать подходящий variant. **Только из своего домена** — cross-domain reuse (например, `pm-board` в CRM-лендинге) валидатор заблокирует.

В JSON поменять:

```json
// Hero
"visual": {
  "type": "product_screenshot",
  "assetId": "...",
  "variant": "новый-variant"   // ← здесь
}

// MediaCopy
"mediaVariant": "новый-variant"  // ← или здесь

// TabbedFeatureSection
"tabs": [
  { ..., "mockVariant": "новый-variant" }
]
```

Запустить apply. Если в новом variant другой домен — `mock-semantic-fit` валидатор завалит и подскажет что выбрать.

---

## Рецепт 5 — добавить блок (feature/FAQ-item/etc.)

Внутри секции `items` или `tabs` или `steps` — это массивы. Просто добавьте новый элемент с такой же структурой.

**Ограничения:**
- FeatureGrid: `items.length` 2-8.
- FAQAccordion: 3-12 items.
- PricingPlans: 2-4 plans, максимум один `highlighted: true`.
- TabbedFeatureSection: 2-6 tabs.

Если выйдете за — apply скажет.

---

## Рецепт 6 — удалить целую секцию

Удалить элемент из массива `sections`. Учесть:
- Не удаляйте hero (нужен всегда).
- Если задан `meta.layout` — проверьте что секция не в required-списке layout'а ([`wiki/layouts/<slug>.md`](../layouts/)). Иначе `landing-layout-conformance` упадёт.

---

## Рецепт 7 — поменять `highlighted` план в pricing

В PricingPlans найти план, выставить `highlighted: true`. На остальных — `false`. Можно только один highlighted (валидатор бизнес-правил проверит).

---

## Рецепт 8 — перегенерить с нуля (новая попытка)

Удалить `content/landings/<slug>.json` (и опционально `.context/pipeline/<slug>/`), запустить:

```bash
pnpm -w run harness agent build landing --slug <slug> --brief content/briefs/<slug>.json
```

Harness заново всё сгенерирует. Иногда быстрее, чем дорабатывать вручную.

---

## Рецепт 9 — сделать диверсити-аудит против других лендингов

```bash
pnpm -w run harness diversity audit --slug <slug> --brief content/briefs/<slug>.json
# → .context/pipeline/<slug>/diversity-report.md
```

Отчёт покажет: structural sim, semantic sim, mock overuse, copy similarity vs другие лендинги. Если warning'и — стоит поразнообразить копию или структуру.

С флагом `--strict` warning'и становятся ошибками.

---

## Рецепт 10 — поменять тему (цвет / шрифты)

Тема живёт в `packages/ui/src/tokens.css` (CSS-переменные). **Не правьте руками** для одного лендинга — это глобальная дизайн-система.

В вехе M3 будет UI-редактор, который позволит маркетингу свапнуть пресет CSS vars прямо на странице `/edit/<slug>` без правки tokens.css. Пока — обращайтесь к фронту.

---

## Когда лучше перегенерить, а не дорабатывать

| Хочу… | Лучше |
|---|---|
| Поменять 1-3 слова в копии | дорабатывать |
| Поменять 1-2 mock'а | дорабатывать |
| Переставить пару секций | дорабатывать |
| Изменить аудиторию / pageGoal / pageLayout | **перегенерить** (это семантическое изменение — пересмотр всей структуры) |
| Поменять домен продукта (PM → CRM) | **новый slug + новый brief**, не дорабатывайте поверх |
| Доработок больше 30% spec'а | **перегенерить** — быстрее и чище |
