# @buffalo/harness — skills

База знаний harness: markdown-документы с frontmatter, которые
подмешиваются в system prompt LLM и используются как rulebook
людьми/агентами, правящими LandingSpec вручную.

Формат — Anthropic-style skill: frontmatter (`name`, `description`,
опц. `metadata`) + содержимое. Используется так же, как
`prompts/design-system-kaiten.md`.

## Текущие skills

| Файл | Поверхность | Статус | Кратко |
|------|-------------|--------|--------|
| `conversion-landing.md` | landings | ✅ active | Универсальные правила конверсионных SaaS-лендингов: 8 page types, awareness levels, hero, секции, копи, визуал, CTA, social proof, audit (100-point scorecard) |
| `content-marketing.md` | articles | ⏳ planned | Playbook блог-поверхности: позиция, 5 направлений, пайплайн статьи, промпты для агентов |

## Как подключить

Skill грузится в `prompts/system.ts` через `readFile` рядом с
`design-system-kaiten.md`. Пример:

```ts
const skillPath = resolve(__dirname, '../skills/conversion-landing.md');
const conversionLanding = await readFile(skillPath, 'utf-8');

return `...
## Conversion landing skill

${conversionLanding}
...`;
```

## Когда добавлять новый skill

Новый markdown в этой папке создаётся, когда:

1. **Появилась новая поверхность generation** (блог, email, ads-copy)
   — кладём rulebook поверхности отдельным файлом.
2. **Появилась устойчивая методология** (audit-mode, refactor-mode,
   A/B-mode), которую агент должен соблюдать на нескольких этапах
   пайплайна.
3. **Появился специфичный domain knowledge**, который не входит в
   `design-system-kaiten` (legal, accessibility, locale-specific
   copywriting и т. п.).

## Что НЕ кладём в skills

- Конкретный контент конкретного бренда — это в `content/briefs/*.json`.
- TypeScript-код / схемы — это в `schemas/`, `pipeline/`, `validators/`.
- Конфиги моделей / провайдеров — это в `providers/`.
- Эфемерные заметки и TODO — в `.context/` workspace.

## Связь со схемами

Skill `conversion-landing.md` ссылается на:
- `schemas/landing-spec.ts` — SectionSchema, HeroSection, FeatureGrid, …
- `schemas/illustration-spec.ts` — hero showcase composition
- `registry/index.ts` — список разрешённых компонентов

Если меняешь schema/registry — обновляй §4.A и §17 в
`conversion-landing.md`, чтобы skill не врал про доступные секции.
