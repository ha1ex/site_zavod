---
slug: mock-wiring-guide
type: reference
created: 2026-06-23
updated: 2026-06-23
status: rule
sources:
  - packages/ui/src/landing/mocks/index.ts
  - packages/ui/src/landing/mocks/MockVisual.tsx
  - packages/harness/src/schemas/landing-spec.ts
  - packages/harness/src/registry/domain-visual.ts
related:
  - wiki/references/domain-mock-matrix.md
tags:
  - mock
  - wiring
  - triada
  - reference
---

# Как подключить мок (чтобы он не остался сиротой)

Один файл-компонент в `packages/ui/src/landing/mocks/` — это ещё **не** мок лендинга.
Пока вариант не прописан в реестрах, на него **нельзя сослаться из JSON-спека**, и при
этом **не будет ошибки компиляции** — он просто молча не существует для пайплайна.
Это и есть «сирота» (примеры на 2026-06: `VKSemojiMock`, `ThreadsChatMock` из PR #3 —
файлы есть, нигде не подключены).

Подключение = правки в **6 местах** («триада» + реестры). Пропуск любого — сирота
или ошибка валидации.

## Чек-лист (variant `my-variant`, компонент `MyMock`)

1. **Компонент** — `packages/ui/src/landing/mocks/MyMock.tsx`
   `export function MyMock() { … }` (стиль см. соседние моки: window-chrome, токены
   `(--color-*)`, `aria-hidden`).

2. **Бочка экспортов** — `packages/ui/src/landing/mocks/index.ts`
   ```ts
   export { MyMock } from './MyMock';
   ```

3. **`packages/ui/src/landing/mocks/MockVisual.tsx`** — три правки в одном файле:
   - добавить `MyMock` в импорт-блок `import { … } from '.';`
   - добавить `| 'my-variant'` в union-тип `MockVariant`
   - добавить ветку в `switch`:
     ```ts
     case 'my-variant':
       return <MyMock />;
     ```

4. **`packages/harness/src/schemas/landing-spec.ts`** — добавить `'my-variant'` во
   **ВСЕ ТРИ** `z.enum`-списка (иначе вариант пройдёт в одной секции, но упадёт
   валидация в другой):
   - enum `visual.variant` у `AssetRef` (hero-визуал)
   - enum `mediaVariant` у `MediaCopy`
   - отдельный `MockVariantSchema` (tabbed_feature / scenario)
   > Найти все три: `grep -n "meeting-room" packages/harness/src/schemas/landing-spec.ts`
   > (любой уже подключённый вариант показывает все три точки вставки).

5. **`packages/harness/src/registry/domain-visual.ts`** — добавить запись в массив
   `mocks: [...]` **своего домена** (cross-domain reuse = блокер ревью):
   ```ts
   {
     variant: 'my-variant',
     sections: ['media', 'tab'], // где допустим: 'hero' | 'media' | 'tab' | 'scenario'
     description: 'Что показывает мок — для авто-роутинга и ревью',
   },
   ```

6. **`wiki/references/domain-mock-matrix.md`** — строка в таблицу нужного домена:
   ```
   | `MyMock` | `my-variant` | Краткое описание |
   ```

## Использование в спеке

После подключения вариант можно ставить в `content/landings/<slug>.json`:
- hero: `"visual": { …, "variant": "my-variant" }`
- `media_copy`: `"mediaVariant": "my-variant"`
- `tabbed_feature.tabs[]` / `scenario.steps[]`: `"mockVariant": "my-variant"`

## Почему two-source-of-truth — главная ловушка

`MockVariant` (union в `MockVisual.tsx`) и `MockVariantSchema` (zod в `landing-spec.ts`)
— **два независимых списка**, синхронизируются руками. Рассинхрон ловится только
typecheck'ом и валидацией apply, не самим фактом существования компонента.

## Самопроверка

```bash
# вариант должен встретиться во ВСЕХ реестрах (index, MockVisual ×2, spec ×3, domain, matrix):
grep -rn "my-variant" packages/ui/src/landing/mocks packages/harness/src wiki/references/domain-mock-matrix.md
# затем — обязательно:
pnpm -r typecheck            # union ↔ zod enum должны совпадать
# и финально лендинг готов только после Playwright-скриншота (не HTTP 200)
```

Сирота = компонент есть (шаг 1), а в `grep` выше нет ни строки из шагов 2–6.
