---
slug: ds-component-feature-grid
type: design-system
created: 2026-05-15
updated: 2026-05-15
sources:
  - packages/harness/src/registry/index.ts
  - packages/harness/src/schemas/landing-spec.ts
related:
  - wiki/design-system/typography.md
  - wiki/design-system/grid.md
tags:
  - component
  - section
  - features
stale: false
---

# FeatureGrid

Сетка карточек «иконка + заголовок + описание». 2–8 items, 2/3/4 columns.

## Структура

- **eyebrow** (опц., ≤80)
- **title** (4..80)
- **description** (опц., ≤200)
- **items** (2..8) — каждый: `{ icon: string, title: 2..60, description: 10..200 }`
- **columns** — `2 | 3 | 4`, default `3`.

## Layout

- **3-column (default).** Items занимают 4/6/12 columns на desktop/tablet/mobile.
- **2-column.** Items занимают 6/3/12 columns. Для пар (например, before/after).
- **4-column.** Items занимают 3/3/6 columns. Только при коротких карточках — иначе перегружено.

## Typography

- Section title: `text-3xl` / `text-4xl`, SemiBold.
- Section description: `text-lg`, Regular, `neutral.600`.
- Item title: `text-xl`, SemiBold.
- Item description: `text-md`, Regular.

## Usage rules

- Все item.title уникальны внутри секции (`titles_unique_per_section` constraint).
- Иконка — обязательна (`feature-icon` validator: непустая строка).
- Каждый item — **outcome / capability**, не feature-list.

## Anti-patterns

- ❌ 1 item — это не grid, переделайте в `HeroSection` visual или вынесите как text-block.
- ❌ Длинные descriptions (>200) — это уже case study, не feature.
- ❌ Generic-иконки типа «check-mark» без значения. Каждая иконка должна обозначать категорию.

## Вид блока: «Три в ряд с мини-моками» (`three-up-mini-mocks`)

Отдельный признанный вид `FeatureGrid`. Доступен и в **custom-флоу**, и во **флоу через бриф**.

- **Форма:** `columns: 3`, ровно 3 `items[]`, у каждого задан `mockVariant` — компактное интерфейсное мок-превью (высота ~200px) сверху карточки, под ним заголовок + короткое описание.
- **Когда применять:** секции-триплеты — отделы/подразделения, документы и регламенты, вопросы-отчёты, способы старта и т.п. (в ТЗ это обычно таблица 1×3 или 2×3 с парами «заголовок + текст»).
- **Мок-превью — доменные**, из реестра (`retail-doc-*`, `retail-report-*`, `mini-org-*`, `mini-feat-*` и др.), НЕ `default` и НЕ из чужого домена. Каждый item — свой variant (одинаковые не дублируем).
- **Отличие от обычного `FeatureGrid`:** там `items[]` с иконками (`icon`), здесь — с мок-превью (`mockVariant`); иконка остаётся как фолбэк/акцент.
- Референс-реализация: `kaiten-retail` — блоки «Регламенты и документы» (`retail-doc-instruction/standards/contracts`) и «Отчёты собираются автоматически» (`retail-report-stores/bottlenecks/ai`).
