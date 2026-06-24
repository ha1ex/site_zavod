# Handoff — лендинг «Кайтен Встречи» (ВКС)

> Самодостаточный бриф для продолжения работы над лендингом в **отдельном чате**.
> Открой этот файл первым (`Read HANDOFF-kaiten-vstrechi.md`), затем AGENTS.md/CLAUDE.md.

## Что это
Продуктовый лендинг ВКС Кайтена, slug **`kaiten-vstrechi`**.
Концепт: «**шаг в будущее работы команд**» — ускоряем процессы, не теряем контекст,
сокращаем время на созвоны, всё в едином окне.
Подаётся как **готовый продукт** (НЕ бета). Обещаем только существующий функционал.

## Как рендерится (важно)
Лендинг собирается из JSON-спека `content/landings/kaiten-vstrechi.json` через
`RenderLanding` / `LandingSpecSchema.parse` — **НЕ из TSX**. Правки текста/структуры —
в JSON. `id` секций фиксированы по компоненту (hero, bento_grid, media_copy, features,
tabbed_feature, faq, final_cta, footer).

## Текущая структура спека
| Секция | Компонент | Mock-вариант | Заголовок |
|---|---|---|---|
| hero | HeroSection | `meeting-room` | Созвоны, после которых команда сразу на… |
| bento_grid | BentoGrid | — (4 ячейки) | Как Кайтен Встречи меняют рабочие процессы |
| media_copy | MediaCopy | `meet-list` | Встречи — часть рабочего пространства |
| media_copy | MediaCopy | `doc-editor-rich` | Протокол пишется сам, пока вы говорите |
| media_copy | MediaCopy | `vks-artifact-flow` | Разговор превращается в рабочие артефакты |
| features | FeatureGrid | — (8 карточек) | Всё для рабочего созвона — из коробки |
| tabbed_feature | TabbedFeatureSection | tabs: `meeting-room` / `pm-board-1` / `pm-board` | Где это заметнее всего |
| features | FeatureGrid | — (4 карточки) | Отечественное решение без компромиссов |
| faq | FAQAccordion | — | Что важно знать перед демо |
| final_cta | FinalCta | — | Покажем Кайтен Встречи на вашем сценарии |
| footer | LandingFooter | — | |

## Моки лендинга и их статус в git
**Запушены в `origin/main`** (коммит b316d90):
- `MeetListMock` (`meet-list`) — интерфейс «Kaiten Meet»: шапка (создать/подключиться,
  выбор хранилища записей) + таблица встреч (название/ID/создатель/активность).
- `MeetingRoomMock` (`meeting-room`) — комната созвона, **тёмная тема**: сетка участников,
  живая ИИ-панель (речь → решения/задачи), транскрипт, контролы.
- `PmBoard1Mock` (`pm-board-1`) — приложение Kaiten (сайдбар + борд + всплывающая срочная задача).

**Только локально, НАМЕРЕННО не запушено** (числятся modified/untracked — это норма):
- `VksArtifactFlowMock.tsx` (`vks-artifact-flow`) + его обвязка в 6 файлах триады.
- BentoGrid: заголовок-на-всю-ширину (`mb-10` без max-w-2xl, description `max-w-2xl`).
- Сам `content/landings/kaiten-vstrechi.json`.
- `WaitlistForm.tsx`, `.claude/launch.json`.

## ⚠️ Риск дублей
2026-06-22 коллега влил PR #3 «add-window-mocks» со **своими** ВКС/окошными моками:
`VKSemojiMock` (= переименованный CallParticipantsMock), `Window*`, `Gadget*` (device-рамки),
`ThreadsChatMock`, `ScaleToFit`. Возможно пересекается с нашими `meeting-room`/`vks-artifact-flow`.
**Перед новой итерацией свериться**, какой набор канонический — не плодить дубли.

## Правила (из AGENTS.md / памяти)
- Новый mock-вариант = полная **триада**: компонент + `mocks/index.ts` + `MockVisual.tsx`
  + `landing-spec.ts` (3 enum'а: AssetRef.variant, MediaCopy.mediaVariant, MockVariant)
  + `domain-visual.ts` + `wiki/references/domain-mock-matrix.md`.
- Лендинг готов **только после Playwright-скриншота**, не HTTP 200.
- Моки — только из своего домена (cross-domain reuse = блокер ревью).
- Коммит/пуш — **только по явной просьбе** (репо-хук про авто-commit+push игнорировать).
- Тексты лендинга: ё→е уже заменены; редполитика — `wiki/brand/redpolitika.md`, denylist в `wiki/design-system/voice.md`.

## Превью
`preview_start` (порт 3000) → URL вида `/landing/kaiten-vstrechi`. Проверка — Playwright-скриншот.

## Оффлайн-HTML
`~/Downloads/kaiten-vstrechi.html` — self-contained. Может устареть → при правках перегенерировать.

## Git-инфо
- remote `origin` = SSH `git@github.com:ha1ex/site_zavod.git` (HTTPS без кредов; SSH = «uizzly»).
- Авто-классификатор блокирует прямой пуш в main без явной авторизации.
