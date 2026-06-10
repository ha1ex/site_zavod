# Что-то пошло не так — troubleshooting

> Самые частые проблемы и как их решать. Если вашей нет в списке — пишите в инженерную команду со ссылкой на `.context/pipeline/<slug>/` и `.context/agent/<slug>.prompt.md`.

## 1. Router отказался: `manual-creation-required`

**Что произошло:** harness не нашёл подходящий домен или mock-набор под ваш brief.

**Что в логе:**

```
Pipeline decision: manual-creation-required
Reason: domain unknown / mocks insufficient
TODO mocks: [list of mock'ов to create]
```

**Что делать:**
1. Если домен очевидно не покрыт (Healthcare, Education, Legal, Real Estate и т.п.) → пишите в команду фронта: «создайте набор mock'ов для домена X». Это занимает 1-2 дня.
2. Если домен покрыт, но lexical-резолв не сработал → уточните `brief.product` и `brief.market`, добавьте более «доменные» термины (для CRM — «воронка», «сделка», «клиент»; для PM — «спринт», «эпик», «kanban»).
3. Принудительно явный домен через `pageLayout` — добавьте подходящий из [`brief-fields.md`](brief-fields.md).

---

## 2. Validator `illustration-domain-match` упал

**Сообщение:**

```
Section [hero|media_copy|...] uses variant 'pm-board' which is not allowed for domain 'crm'.
Suggested alternatives: ['sales-funnel', 'crm-client-card', ...]
```

**Что делать:** в `content/landings/<slug>.json` найти эту секцию, поменять `variant` / `mediaVariant` / `mockVariant` на один из suggested. После — `harness agent apply`. См. визуальный каталог: `pnpm --filter @kaiten/ui storybook` → `Mocks/_Catalog`.

---

## 3. Validator `mock-semantic-fit` упал (P5 phased)

То же самое, что #2, но в phased-pipeline'е на фазе P5. Открой `.context/pipeline/<slug>/p5-mock-allocation.json` и `.context/pipeline/<slug>/p5-mock-allocation.repair.md` — там подсказки. Phased сам попытается репаирнуть до 3 раз, потом эскалирует.

---

## 4. Validator `landing-visual-diversity` упал

**Сообщения:**

- `more than 1 MediaCopy uses mediaVariant: 'default'` → у вас несколько «default» (generic placeholder) подряд. Замените хотя бы один на конкретный mock из вашего домена. Если визуально нет подходящего — создайте новый mock (инженерная задача).
- `consecutive sections share the same mediaVariant` → две MediaCopy подряд с одним mock'ом. Поменяйте порядок или mock в одной из них.

---

## 5. Audience-score `< 70` или `audience-resolve-needed`

**Что произошло:** harness прогнал scoring против [`wiki/audiences/kaiten-scoring.md`](../audiences/kaiten-scoring.md) и не набрал нужный балл.

**Что делать:**

### Если `audience-resolve-needed`
Сегменты не определились lexical-матчем. Добавьте `resolvedSegments` явно в brief:

```json
{
  "resolvedSegments": ["IT", "Агентства"]
}
```

Список валидных ID — в [`wiki/audiences/kaiten-scoring.md`](../audiences/kaiten-scoring.md).

### Если `score < 70`
Открой `.context/audience-score/<slug>.md` — там по каждой непокрытой story есть suggestion (какие ключевые слова, какого типа контент добавить).

Точечно правь `content/landings/<slug>.json`: добавь нужные акценты в hero/features/FAQ. Запусти `harness agent apply` снова.

**Бюджет:** 3 итерации. Если не сошлось — пересмотрите brief или аудиторию.

**Эскейп:** `harness agent apply landing --no-audience-gate` (отключает гейт целиком — только для отладки).

---

## 6. Cross-landing diversity warning

**Сообщение:**

```
Landing structurally similar to existing: [list of slugs]
Mock overuse: variant 'pm-board' used in 5 other landings
Copy similarity: high overlap with 'kaiten-platform' in hero/features
```

**Что делать:** это не блокер по умолчанию (warning). Лучше всё-таки поразнообразить:
- Поменяйте структуру: переставьте секции, замените FeatureGrid на BentoGrid (или наоборот).
- Перепишите hero/features в других терминах.
- Поменяйте mock-варианты на менее задействованные.

С флагом `--strict-diversity` apply упадёт на этом warning'е — нужно править.

---

## 7. Apply ругается на длину строки

```
ZodError: title must be at most 80 characters (got 95)
```

Сократите title/subtitle/description. Лимиты:
- title: 4-80
- subtitle: 10-200
- feature title: 2-60
- feature description: 10-200
- FAQ question/answer: см. schema

Точные лимиты — в `packages/harness/src/schemas/landing-spec.ts`.

---

## 8. Brand voice deny-list

```
Brand voice violation in section [hero]: 'revolutionary', 'world-class'
```

Замените на нейтральные формулировки. Список запрещённых hype-слов — в `packages/harness/src/validators/landing-brand.ts` (`HYPE_WORDS`).

---

## 9. Business rules

Возможные ошибки:
- `multiple HeroSection` → оставьте одну.
- `hero is not first` → переставьте.
- `multiple highlighted plans` → оставьте только один `highlighted: true`.
- `href shape invalid` → href должен начинаться с `http(s)://`, `/` или `#`.

---

## 10. Preview не открывается

```bash
pnpm dev
```

→ ждать сообщения `Ready in X ms`. Открыть `http://localhost:3000/landings/<slug>`.

Если 404 → проверь что `generated/landings/<slug>/page.tsx` существует (создаётся apply'ем). Если нет — `harness agent apply` упал, читай его лог.

---

## 11. Storybook не открывается

```bash
pnpm --filter @kaiten/ui storybook
```

Открыть `http://localhost:6006`. Если не открывается:
- `pnpm install` (убедиться что зависимости свежие).
- Удалить `node_modules/.cache/` и повторить.

---

## 12. Handoff падает с «approval required»

```bash
pnpm -w run harness handoff <slug> --require-approved
# → Error: landing is not approved
```

Откройте `http://localhost:3000/approve/<slug>`, заполните форму (статус → `approved`, имя, комментарий), нажмите Submit. Состояние сохранится в `content/approvals/<slug>.json`. После — handoff пройдёт.

---

## Куда писать, если ничего не помогает

В команду фронта со следующей информацией:
- `<slug>` лендинга
- Файлы:
  - `content/briefs/<slug>.json`
  - `content/landings/<slug>.json` (если есть)
  - `.context/pipeline/<slug>/*` (артефакты и prompt'ы фаз)
  - `.context/audience-score/<slug>.md` (если audience gate)
- Что именно сделали и какое сообщение получили.
