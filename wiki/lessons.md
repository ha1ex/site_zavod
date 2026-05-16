# wiki/lessons.md

Кумулятивные правила, извлечённые из прошлых генераций, фидбэка ревьюеров и lint-замечаний. Используется repair-loop'ом (M4c): по типу validation-ошибки находятся релевантные записи и подмешиваются в repair-prompt как additional guidance.

## Формат записи

Каждое правило — H2-заголовок (slug-kebab-case), под ним:

```markdown
## <slug>
- **rule:** одна строка с правилом
- **constraint:** machine-readable tag для lessons-loader (например, `subtitle.length`, `hero.headline.tone`)
- **applies_to:** archetype/audience/component, к которым относится
- **reason:** почему это правило важно
- **first_observed:** YYYY-MM-DD slug-первого-инцидента
```

## Правила

## window-chrome-on-product-mocks
- **rule:** Любой крупный UI-мок (доска, чат, статья БЗ, дашборд) начинается с window-chrome: тонкая шапка с тремя цветными точками `bg-red-300 / bg-yellow-300 / bg-green-300` (h-2 w-2 rounded-full) + ряд табов справа от точек, где один таб подсвечен.
- **constraint:** `mock.shell.window-chrome`
- **applies_to:** section.mockUi (board, chat, doc, kpi, article, console), Hero illustration с laptop scene
- **reason:** Без window-chrome mock читается как абстрактная карточка. С window-chrome — сразу как «скриншот реального приложения». В эталоне kaiten-techsupport это даёт 5 крупным мокам узнаваемость.
- **first_observed:** 2026-05-16 kaiten-techsupport-reference

## realistic-russian-copy-in-mocks
- **rule:** Внутри mock'а каждая текстовая строка отвечает на вопрос «что бы здесь увидел реальный пользователь». Никаких "Item 1", "Title", "Lorem ipsum", "Заголовок" и серых placeholder'ов с подобным текстом. Имена клиентов, темы обращений, реплики чата — конкретные и доменные.
- **constraint:** `mock.content.realistic-text`
- **applies_to:** section.mockUi.* (все шаблоны с текстом)
- **reason:** Целевая аудитория узнаёт свою работу за секунду, если видит «Не приходит код подтверждения · Telegram · новый клиент», и не узнаёт «Card 1 · Source · Tag». Это главный приём, который превращает mock из dummy в иллюстрацию ценности.
- **first_observed:** 2026-05-16 kaiten-techsupport-reference

## accent-bar-color-as-semantics
- **rule:** На карточках mock'а (доска, статья, KPI) используется тонкая верхняя акцент-полоска `h-1 w-8 rounded-full bg-(--color-…)`, цвет которой кодирует семантику: фиолет = в работе/приоритет, зелёный = done, оранжевый = в процессе, красный = блокер. Не больше одной семантической оси на mock.
- **constraint:** `mock.accent-bar.color-semantic`
- **applies_to:** section.mockUi (board, doc, article, kpi)
- **reason:** Цвет читается быстрее текста. Полоска фиксирует «это статус», без неё карточки сливаются. Использовать DS-токены (`--color-action-primary`, `--color-green-100` и т.д.), не raw hex.
- **first_observed:** 2026-05-16 kaiten-techsupport-reference

## active-vs-inactive-contrast-in-mock
- **rule:** Внутри одного mock-блока ОДИН элемент явно «активен», остальные приглушены. Активный: `translate-y-[-2px] shadow-md`. Неактивный: `opacity-60`. Для аккордеона: открытый — `bg-action-primary-soft border-action-primary` с «−», закрытые — нейтральные с «+».
- **constraint:** `mock.state.one-active`
- **applies_to:** section.mockUi.board, section.mockUi.faq, section.mockUi.checklist
- **reason:** Контраст «живой ↔ фоновый» убирает ощущение мёртвого скриншота. Все карточки одинаковые — читается как заглушка; одна выделенная — читается как взаимодействие.
- **first_observed:** 2026-05-16 kaiten-techsupport-reference

## lucide-icons-in-violet-capsule
- **rule:** Все иконки — inline SVG из lucide (`stroke-width="1.75"` или `2.5`, `stroke-linecap="round" stroke-linejoin="round"`, `aria-hidden="true"`), помещённые в обязательную «капсулу» `inline-flex h-N w-N items-center justify-center rounded-(--radius-xl) bg-(--color-action-primary-soft) text-(--color-text-accent)`. Размер капсулы: 12 для feature-cards, 11 для step-cards, 5 для bullet-points.
- **constraint:** `mock.icons.lucide-capsule`
- **applies_to:** все компоненты с иконками, section.mockUi.*
- **reason:** Единый стиль иконок + капсула фиолетовая фиксируют визуальную идентичность. Сторонние иконки, эмодзи как замена, разная толщина обводки — ломают тон.
- **first_observed:** 2026-05-16 kaiten-techsupport-reference

## emoji-as-single-human-accent
- **rule:** На один mock — 0 или 1 эмодзи. Допустимые роли: указатель действия (`☝️` в углу активной карточки = «можно перетащить»), маркер типа документа (`📌` публичная статья vs `🧑‍💻` внутренний регламент), компактная галочка в чек-листе (`✓`). Никаких рассыпанных эмодзи в заголовках, кнопках, бейджах.
- **constraint:** `mock.emoji.max-one`
- **applies_to:** section.mockUi.*
- **reason:** Один эмодзи даёт «человеческий штрих», два и больше превращают серьёзный продукт в детский. В эталоне всего 4 уникальных эмодзи на всю страницу, каждый строго в одном месте.
- **first_observed:** 2026-05-16 kaiten-techsupport-reference

## ds-tokens-only-no-hardcoded-hex
- **rule:** Все цвета, радиусы, отступы, тени — только через CSS-переменные DS (`bg-(--color-action-primary-soft)`, `rounded-(--radius-2xl)`, `var(--spacing-3)`). Запрещены raw hex (`bg-[#7d4ccf]`), arbitrary-радиусы (`rounded-[18px]`), arbitrary-spacing (`p-[14px]`). Исключение: `shadow-[…]` с rgba — только для брендового drop-shadow (см. lesson `brand-violet-drop-shadow`).
- **constraint:** `mock.tokens.css-vars-only`
- **applies_to:** все компоненты, section.mockUi.*, Hero illustrations (TSX)
- **reason:** Любой raw-hex выпадает из dark-режима, ломает refactor токенов, превращает дизайн-систему в «дизайн-чат». Token-only — единственное правило, которое масштабируется.
- **first_observed:** 2026-05-16 kaiten-techsupport-reference

## brand-violet-drop-shadow
- **rule:** Drop-shadow на крупных карточках/моках всегда в брендовом фиолете, не серый: `shadow-[0_30px_80px_-30px_rgba(125,76,207,0.30)]`. Для маленьких карточек — `shadow-sm` нейтральный. Никаких «жирных серых» теней.
- **constraint:** `mock.shadow.brand-violet`
- **applies_to:** section.mockUi.* (все крупные обёртки), Hero card, CTA-карточки
- **reason:** Брендовый shadow даёт «парение» в фирменном цвете — карточка не «лежит на сером фоне», а «светится фиолетом». В эталоне это единый цвет на 5 крупных моках, что закрепляет ощущение продукта.
- **first_observed:** 2026-05-16 kaiten-techsupport-reference

## small-font-density-inside-mock
- **rule:** Внутри mock'а шрифты намеренно мельче базового: заголовок карточки `text-[11.5px]`, мета-строка `text-[10px]`, бейдж `text-[9px]`. Spacing внутри карточек тоже компактнее (`p-2.5 gap-1.5 space-y-1`).
- **constraint:** `mock.typography.small-density`
- **applies_to:** section.mockUi.board, section.mockUi.chat, section.mockUi.kpi
- **reason:** Mock — это «оптический скриншот в уменьшении». Если шрифт внутри mock'а равен H2 секции, mock начинает конкурировать с текстом, а должен поддерживать. Маленький шрифт = mock читается как «уменьшенный реальный экран».
- **first_observed:** 2026-05-16 kaiten-techsupport-reference

## three-or-four-items-per-list
- **rule:** Списки внутри mock'а — всегда 3-4 элемента, не 1, не 2. Канбан-колонка = 2 карточки (вторая полупрозрачная, имитирует «обрезанный кадр»). Bullet-листы фич = 3-4. KPI = 2×2. Шаги запуска = 4.
- **constraint:** `mock.list.cardinality-3-4`
- **applies_to:** section.mockUi.board, section.mockUi.kpi, FeatureGrid items, step-cards
- **reason:** Один элемент = заглушка, два = неполнота, три-четыре = «реальный список». Это работает на разных уровнях иерархии.
- **first_observed:** 2026-05-16 kaiten-techsupport-reference

## placeholder-bars-with-decreasing-width
- **rule:** «Тело статьи» / «текст в редакторе» рисуется не пустыми div'ами, а 3-4 полосками `h-2 rounded-full bg-(--color-neutral-200)` с убывающей шириной: 100% → 5/6 → 4/6 → 3/4. Имитирует абзац, даёт оптический объём без необходимости рисовать настоящий текст.
- **constraint:** `mock.placeholder.decreasing-width`
- **applies_to:** section.mockUi.article, section.mockUi.doc
- **reason:** Пустой div = дыра. Полоска одной ширины = технический wireframe. Убывающие полоски = «здесь живёт абзац», и читателю не нужно заполнять mock реальным текстом до буквы.
- **first_observed:** 2026-05-16 kaiten-techsupport-reference

## chat-bubbles-asymmetric
- **rule:** Чат-mock = два пузыря разной стороны. Входящий: `max-w-[85%] rounded-2xl rounded-bl-md bg-(--color-neutral-100)`. Исходящий: `ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-(--color-action-primary-soft)`. Шрифт `text-sm`, padding `px-4 py-2.5`. Контент — реальный диалог по сценарию обращения.
- **constraint:** `mock.chat.asymmetric-bubbles`
- **applies_to:** section.mockUi.chat
- **reason:** Скос противоположного угла + разный фон = мгновенно читается как «диалог», без подписей «Клиент»/«Агент». Симметричные пузыри одного цвета читаются как «два сообщения от одного».
- **first_observed:** 2026-05-16 kaiten-techsupport-reference

## checklist-states-mixed
- **rule:** Чек-лист в mock'е содержит элементы в разных состояниях. Done: `bg-(--color-action-primary) text-white ✓` + текст с `line-through text-text-secondary`. Todo: `border bg-white` пустой квадрат + текст обычный. Минимум 1 done и 1 todo в одном чек-листе.
- **constraint:** `mock.checklist.mixed-states`
- **applies_to:** section.mockUi.checklist, section.mockUi.chat (с прикреплённым чек-листом)
- **reason:** Все ✓ = работа закончена, не интересно. Все пустые = ничего не сделано. Mix = «задача в процессе», что соответствует реальной картине у пользователя.
- **first_observed:** 2026-05-16 kaiten-techsupport-reference

## kpi-tile-with-trend-arrow
- **rule:** KPI-плитка = крупное число (`text-3xl md:text-4xl font-semibold`) + стрелка тренда (`▲` зелёным, `▼` красным, цветом через токены `text-(--color-green-100)` / `text-(--color-red-100)`) на одной baseline + подпись под числом (`text-sm text-(--color-text-secondary)`). Никаких графиков рядом с числом — только число + стрелка + подпись.
- **constraint:** `mock.kpi.number-arrow-label`
- **applies_to:** section.mockUi.kpi
- **reason:** На лендинге KPI — это «вспышка цифры», а не дашборд. Графики/спарклайны перетягивают внимание и удлиняют чтение. Число + стрелка читаются за 0.5 сек.
- **first_observed:** 2026-05-16 kaiten-techsupport-reference

## background-decoration-radial-and-blob
- **rule:** Фоновая декорация секции = либо `radial-gradient(60% 60% at 70% 0%, rgba(125,76,207,0.22), transparent 60%)` (Hero), либо `absolute -right-20 -top-20 h-72 w-72 rounded-full opacity-30 blur-3xl bg-(--color-action-primary)` (CTA-баннер). Всегда с `aria-hidden="true"`, всегда `pointer-events-none`, прозрачность 0.22-0.30.
- **constraint:** `mock.background.radial-or-blob`
- **applies_to:** Hero section, FinalCta section, section.mockUi.* (опц. для крупных моков)
- **reason:** Без декора секция выглядит «голой» на светлом фоне. С декором — секция «дышит» брендовым цветом. Жёсткие границы радиус и opacity убирают риск переборщить.
- **first_observed:** 2026-05-16 kaiten-techsupport-reference

## reverse-layout-zigzag-in-paired-sections
- **rule:** Когда две соседние секции имеют одинаковую структуру «текст слева + mock справа», во второй секции порядок меняется на «mock слева + текст справа» через `lg:[&>div:first-child]:order-2`. Никогда не идут подряд 3+ секции с одинаковым layout.
- **constraint:** `mock.layout.zigzag-paired`
- **applies_to:** body sections с mockUi
- **reason:** Зигзаг создаёт визуальный ритм при скролле и не даёт лендингу слипаться в «текст-картинка-текст-картинка». В эталоне это сделано между «контекст не теряется» (mock слева) и «база знаний» (mock справа).
- **first_observed:** 2026-05-16 kaiten-techsupport-reference

## one-hero-mock-plus-3-5-section-mocks
- **rule:** На крупном SaaS-лендинге: один большой Hero-mock (доска/дашборд во всю ширину flex-1 рядом с текстом) + 3-5 средних mock'ов в body-секциях (рядом с текстом, в gridcell). Без иллюстраций оставлять: trust-bar, FAQ, footer, повторяющие промежуточные CTA-баннеры. Соотношение моков к содержательным секциям ≈ 1:1.5.
- **constraint:** `mock.distribution.hero-plus-3-5`
- **applies_to:** archetype: saas_landing, enterprise_landing
- **reason:** Меньше — лендинг выглядит «текстовым», больше — читатель устаёт. Эталон даёт ровно эту пропорцию (5 крупных + 2 средних + аккордеон на 13 секций).
- **first_observed:** 2026-05-16 kaiten-techsupport-reference
