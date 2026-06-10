import type { PipelineDoc } from './types';

/**
 * Этапы конвейера по порядку прохождения.
 * Порядок массива = порядок в левой навигации и на схеме обзора.
 */
export const STAGES: PipelineDoc[] = [
  {
    kind: 'stage',
    slug: 'intake',
    num: '1',
    title: 'Фабрика ТЗ (intake)',
    short: 'Сырые материалы превращаются в техзадание и машинный бриф',
    purpose: [
      'Точка входа конвейера. Команда приносит «сырьё»: описание задачи, документы, ссылки, выгрузки. Фабрика ТЗ проводит исследование и собирает из этого два документа: человекочитаемое техзадание (ТЗ) для согласования и машинный бриф — структурированную карточку, по которой дальше работает генерация.',
      'Этап нужен, чтобы лендинг не собирался по размытой формулировке: до запуска генерации фиксируются аудитория, главная боль, обещание, доказательства и цель страницы.',
    ],
    inputs: [
      'Папка inputs/<slug>/ с материалами: документы, заметки, выгрузки',
      'Свободная заявка request.md — что за страница и зачем она нужна',
    ],
    outputs: [
      'ТЗ для людей: content/briefs/<slug>.tz.md',
      'Машинный бриф: content/briefs/<slug>.json',
    ],
    how: [
      {
        title: 'Подготовка задания',
        detail:
          'Команда agent intake собирает задание для ассистента: методология фабрики ТЗ плюс все материалы из inputs/<slug>/.',
      },
      {
        title: 'Исследование и черновик',
        detail:
          'Ассистент (claude / codex в терминале) изучает материалы и пишет черновик ТЗ и брифа в рабочую папку .context/intake/<slug>/.',
      },
      {
        title: 'Публикация с гейтом',
        detail:
          'Команда agent intake-apply проверяет качество брифа (блокирующий гейт) и публикует ТЗ и бриф в content/briefs/.',
      },
      {
        title: 'Ревью человеком',
        detail:
          'ТЗ открывается в браузере на /intake/<slug>: можно согласовать или запросить правки до запуска сборки.',
      },
    ],
    rules: [
      {
        text: 'Поля брифа содержательны, а не «вода» (field-too-thin)',
        severity: 'hard',
        source: 'packages/harness/src/validators/brief-quality.ts',
      },
      {
        text: 'В полях нет лозунгов и рекламных штампов (slogan-in-field)',
        severity: 'hard',
        source: 'packages/harness/src/validators/brief-quality.ts',
      },
      {
        text: 'Домен продукта распознаётся по брифу (domain-unresolvable)',
        severity: 'hard',
        source: 'packages/harness/src/validators/brief-quality.ts',
      },
      {
        text: 'Обещания подкреплены доказательствами — кейсы, цифры, факты (proof-missing)',
        severity: 'hard',
        source: 'packages/harness/src/validators/brief-quality.ts',
      },
      {
        text: 'Язык: англицизмы из словаря помечаются для замены',
        severity: 'soft',
        source: 'packages/harness/src/validators/landing-language.ts',
      },
    ],
    commands: [
      {
        cmd: 'pnpm -w run harness agent intake landing --slug <slug> --request inputs/<slug>/request.md --inputs inputs/<slug>',
        note: 'Подготовить задание для ассистента',
      },
      {
        cmd: 'pnpm -w run harness agent intake-apply landing --slug <slug>',
        note: 'Проверить и опубликовать ТЗ + бриф',
      },
    ],
    artifacts: [
      { path: 'content/briefs/<slug>.tz.md', note: 'ТЗ для согласования' },
      { path: 'content/briefs/<slug>.json', note: 'машинный бриф' },
      { path: 'content/approvals/<slug>.intake.json', note: 'статус согласования ТЗ' },
    ],
    links: [
      {
        path: 'packages/harness/src/prompts/content-factory-methodology.md',
        note: 'методология фабрики ТЗ',
      },
      { path: '.claude/skills/kaiten-intake/SKILL.md', note: 'скилл intake для ассистента' },
    ],
  },

  {
    kind: 'stage',
    slug: 'routing',
    num: '2',
    title: 'Гейт домена (routing)',
    short: 'Проверка перед сборкой: покрыт ли домен продукта mock-набором',
    purpose: [
      'Перед генерацией бриф проходит детерминированную проверку — без LLM, по фиксированным правилам. Система определяет домен продукта и сверяет его с реестром покрытых доменов: для лендинга нужны mock-компоненты именно этого домена.',
      'Это защита от cross-domain подмен: если домен не покрыт, конвейер останавливается и выдаёт конкретный todo-список mock-ов, которые нужно создать. Подсовывать mock-и чужого домена запрещено.',
    ],
    inputs: ['Опубликованный бриф content/briefs/<slug>.json'],
    outputs: [
      'Решение гейта: .context/pipeline/<slug>/route-decision.json',
      'Запуск конвейера сборки или стоп с задачей на mock-и',
    ],
    how: [
      {
        title: 'Аудит домена',
        detail:
          'Продукт из брифа сопоставляется с реестром покрытых доменов (PM, Support, CRM, HR, Marketing, BPM, Finance, Ecommerce — 27 mock-компонентов). Неизвестный домен — стоп: сначала нужно создать mock-и этого домена.',
      },
      {
        title: 'Решение',
        detail:
          'Домен покрыт → запускается конвейер сборки (P0–P8). Неизвестный или непокрытый домен → manual-creation-required: стоп и todo-список mock-ов к созданию.',
      },
    ],
    rules: [
      {
        text: 'Неизвестный домен блокирует генерацию: сначала mock-и своего домена, переиспользовать чужие запрещено',
        severity: 'hard',
        source: 'packages/harness/src/pipeline/route-pipeline.ts',
      },
      {
        text: 'Флаг --require-intake-approved не даёт собрать лендинг без согласованного ТЗ',
        severity: 'hard',
        source: 'packages/harness/src/cli.ts',
      },
    ],
    commands: [
      {
        cmd: 'pnpm -w run harness agent build landing --slug <slug> --brief content/briefs/<slug>.json',
        note: 'Рекомендуемый запуск: гейт домена + сборка автоматически',
      },
      {
        cmd: 'pnpm -w run harness agent build landing --slug <slug> --brief content/briefs/<slug>.json --route-only',
        note: 'Только показать решение гейта, без сборки',
      },
    ],
    artifacts: [
      { path: '.context/pipeline/<slug>/route-decision.json', note: 'решение гейта домена' },
    ],
    links: [
      { path: 'packages/harness/src/pipeline/route-pipeline.ts', note: 'правила гейта' },
    ],
  },

  {
    kind: 'stage',
    slug: 'phased',
    num: '3',
    title: 'Конвейер сборки (P0–P8)',
    short: 'Девять фаз с проверкой после каждой, затем финальный пакет проверок и рендер',
    purpose: [
      'Единственный конвейер сборки страницы. Лендинг собирается за девять фаз — от нормализации брифа до иллюстраций, и после каждой фазы стоит свой гейт: дальше нельзя, пока фаза не пройдёт проверку. Так ошибка аудитории, макета или структуры ловится на своей фазе, а не в готовой странице.',
      'Каждая фаза при ошибке чинится отдельно (repair-цикл до 3 попыток), а готовые фазы при повторном запуске пропускаются — конвейер можно перезапускать с любого места без потери сделанного.',
      'После фаз спецификация проходит финальный пакет проверок (agent apply) и превращается в React-страницу (TSX).',
    ],
    inputs: ['Бриф content/briefs/<slug>.json'],
    outputs: [
      'Артефакты фаз: .context/pipeline/<slug>/p0…p8-*.json',
      'Спецификация страницы content/landings/<slug>.json',
      'Код страницы generated/landings/<slug>/page.tsx',
    ],
    how: [
      {
        title: 'Фазы идут строго по порядку',
        detail: 'P0 → P8, каждая пишет свой артефакт в .context/pipeline/<slug>/.',
      },
      {
        title: 'Гейт после каждой фазы',
        detail:
          'Не прошла проверка — ассистент получает список ошибок и чинит только эту фазу (до 3 попыток).',
      },
      {
        title: 'Идемпотентность',
        detail:
          'Повторный запуск пропускает уже готовые фазы; run-phase перезапускает одну конкретную фазу.',
      },
      {
        title: 'apply: финальные проверки + рендер',
        detail:
          'Команда agent apply прогоняет готовую спецификацию через пакет валидаторов (схема, бренд-голос, бизнес-правила, язык, разнообразие, домен mock-ов, аудитория); при ошибках ассистент чинит по списку. Прошедшая проверки спецификация рендерится в React-страницу (TSX).',
      },
    ],
    phases: [
      {
        id: 'P0',
        title: 'Нормализация брифа',
        summary: 'Бриф приводится к строгой схеме, определяется домен продукта.',
        gate: 'Схема брифа валидна',
        executor: 'code',
        inputs: ['Бриф content/briefs/<slug>.json'],
        outputs: ['p0-brief-normalized.json — бриф + resolvedDomain + resolvedSegments'],
        details: [
          'Бриф валидируется по строгой Zod-схеме: типы, обязательные поля, допустимые значения.',
          'Домен продукта определяется лексическим сопоставлением с реестром domain-visual (без LLM).',
          'Дополнительно прогоняется проверка качества брифа в режиме «советника»: проблемы подсвечиваются, но фазу не блокируют — жёсткий гейт качества стоит раньше, на intake.',
        ],
        sources: [
          { path: 'packages/harness/src/schemas/brief.ts', note: 'схема брифа' },
          { path: 'packages/harness/src/registry/domain-visual.ts', note: 'реестр доменов и mock-ов' },
          { path: 'packages/harness/src/pipeline/phases/p0-brief-normalize.ts', note: 'код фазы' },
        ],
      },
      {
        id: 'P1',
        title: 'Аудитория и намерения',
        summary:
          'Сегменты, уровень осведомлённости, истории пользователей, обязательные намерения (mustCoverIntents).',
        gate: 'Минимум один сегмент аудитории',
        executor: 'llm',
        inputs: ['p0-brief-normalized.json'],
        outputs: ['p1-audience-intent.json — сегменты, awareness, decisionMaker, истории, mustCoverIntents'],
        details: [
          'Ассистент сопоставляет бриф с каталогом сегментов Kaiten: роли, user stories, скоринг.',
          'Определяет уровень осведомлённости аудитории и лицо, принимающее решение (decisionMaker).',
          'Фиксирует mustCoverIntents — что страница обязана доказать, forbiddenIntents — чего избегать, preferredCtaTypes — какие призывы уместны.',
          'В rationale (2–3 абзаца) объясняет, почему выбраны именно эти сегменты.',
        ],
        sources: [
          { path: 'wiki/audiences/kaiten-scoring.json', note: 'каталог сегментов и скоринг' },
          { path: 'wiki/audiences/kaiten-scoring.md', note: 'описание сегментов и ролей' },
          { path: 'packages/harness/src/schemas/audience-intent-plan.ts', note: 'схема результата' },
        ],
      },
      {
        id: 'P2',
        title: 'Выбор макета',
        summary: 'Макет страницы из 10 плейбуков + альтернативы.',
        gate: 'Макет существует и совместим с осведомлённостью аудитории',
        executor: 'llm',
        inputs: ['p0-brief-normalized.json', 'p1-audience-intent.json'],
        outputs: ['p2-layout-decision.json — выбранный макет, обоснование, порядок секций'],
        details: [
          'Ассистент выбирает макет из каталога wiki/layouts с учётом осведомлённости, сегмента и decisionMaker.',
          'Обязательно фиксирует whyThisLayout и две отвергнутые альтернативы с обоснованием.',
          'Из плейбука макета берётся requiredSectionOrder — обязательная последовательность секций.',
          'Валидатор layout-awareness-fit проверяет совместимость макета с уровнем осведомлённости аудитории.',
        ],
        sources: [
          { path: 'wiki/layouts/index.md', note: 'каталог 10 плейбуков' },
          { path: 'wiki/layouts/', note: 'плейбуки по одному на макет' },
          { path: 'packages/harness/src/validators/layout-awareness-fit.ts', note: 'гейт фазы' },
          { path: 'packages/harness/src/schemas/layout-decision.ts', note: 'схема результата' },
        ],
      },
      {
        id: 'P3',
        title: 'Аудит библиотеки',
        summary: 'Проверка: хватает ли mock-компонентов домена для задуманной страницы.',
        gate: 'Нет дыр по домену',
        executor: 'code',
        inputs: ['p0-brief-normalized.json', 'p2-layout-decision.json'],
        outputs: ['p3-coverage-report.json — статус покрытия + разрешённые варианты по слотам'],
        details: [
          'Код сверяет слоты выбранного макета с набором mock-ов домена из реестра.',
          'Статусы: ok / enrich-recommended (1–3 пробела) / enrich-required / domain-missing.',
          'domain-missing — жёсткий стоп: конвейер выдаёт человеку todo-список mock-ов, которые нужно создать.',
          'Отчёт фиксирует разрешённые mock-варианты для каждого слота — P5 сможет выбирать только из них.',
        ],
        sources: [
          { path: 'packages/harness/src/registry/domain-visual.ts', note: 'наборы mock-ов доменов' },
          { path: 'wiki/references/domain-mock-matrix.md', note: 'матрица домен → mock-и' },
          { path: 'packages/harness/src/pipeline/phases/p3-coverage-audit.ts', note: 'код фазы' },
          { path: 'packages/harness/src/schemas/coverage-report.ts', note: 'схема отчёта' },
        ],
      },
      {
        id: 'P4',
        title: 'Архитектура секций',
        summary: 'Структура страницы без текстов: какие секции, зачем, в каком порядке.',
        gate: '100% намерений покрыто; у каждого выбора mock-а есть обоснование',
        executor: 'llm',
        inputs: [
          'p0-brief-normalized.json',
          'p1-audience-intent.json',
          'p2-layout-decision.json',
          'p3-coverage-report.json',
        ],
        outputs: ['p4-section-plan.json — слоты: компонент, intent, keyMessage, mockVariant'],
        details: [
          'Ассистент проектирует структуру без копирайта: для каждого слота — компонент, intent (что секция доказывает), keyMessage (тезис одной строкой).',
          'Каждая секция привязывается к историям и ролям из P1 (coversStoryIds, coversRoleIds).',
          'Заполняется storyCoverageMap: где именно покрыта каждая обязательная история.',
          'Гейты: 100% mustCoverIntents покрыты; выбор mockVariant=default требует письменного обоснования.',
        ],
        sources: [
          { path: 'packages/harness/src/validators/section-plan-intent.ts', note: 'гейт покрытия намерений' },
          { path: 'packages/harness/src/validators/section-plan-mock-choice.ts', note: 'гейт обоснования mock-ов' },
          { path: 'packages/harness/src/schemas/section-plan.ts', note: 'схема результата' },
        ],
      },
      {
        id: 'P5',
        title: 'Распределение mock-ов',
        summary: 'Каждому слоту страницы назначается конкретный вариант mock-а.',
        gate: 'Вариант разрешён для домена (semantic fit)',
        executor: 'llm',
        inputs: ['p4-section-plan.json', 'p3-coverage-report.json'],
        outputs: ['p5-mock-allocation.json — финальный вариант + rationale на каждый слот'],
        details: [
          'Ассистент финализирует выбор mock-варианта для каждой визуальной секции (Hero, MediaCopy, Tabs, Scenario).',
          'Выбирать можно только из разрешённых вариантов домена, зафиксированных в P3 — всё остальное считается cross-domain reuse и блокируется.',
          'Для каждого слота пишется rationaleText — 2–3 предложения, почему именно этот вариант.',
        ],
        sources: [
          { path: 'packages/harness/src/validators/mock-semantic-fit.ts', note: 'гейт фазы' },
          { path: 'packages/harness/src/schemas/mock-allocation.ts', note: 'схема результата' },
        ],
      },
      {
        id: 'P6',
        title: 'Тексты',
        summary: 'Полная спецификация с текстами всех секций.',
        gate: 'Схема + бренд-голос + бизнес-правила',
        executor: 'llm',
        inputs: [
          'p4-section-plan.json',
          'p5-mock-allocation.json',
          'p1-audience-intent.json',
          'p2-layout-decision.json',
          'p0-brief-normalized.json',
        ],
        outputs: [
          'content/landings/<slug>.json — полная спецификация страницы',
          'p6-landing-spec-draft.json — копия для трассировки',
        ],
        details: [
          'Ассистент заполняет копирайт во все секции: заголовки, подзаголовки, описания, списки, цитаты, метрики, подписи CTA.',
          'Менять структуру нельзя — она зафиксирована в P4/P5, только тексты.',
          'Голос: ясно, практично, без хайпа; русский язык, реалистичные доменные формулировки.',
          'Результат проходит схему спецификации, бренд-валидатор и бизнес-правила.',
        ],
        sources: [
          { path: 'wiki/brand/redpolitika.md', note: 'тон и лексика' },
          { path: 'wiki/design-system/voice.md', note: 'голос дизайн-системы' },
          { path: 'packages/harness/src/validators/landing-brand.ts', note: 'гейт бренд-голоса' },
          { path: 'packages/harness/src/validators/landing-business.ts', note: 'гейт бизнес-правил' },
          { path: 'packages/harness/src/schemas/landing-spec.ts', note: 'схема спецификации' },
        ],
      },
      {
        id: 'P7',
        title: 'SEO и CTA',
        summary: 'Шлифовка заголовков, мета-данных и призывов к действию.',
        gate: 'Соответствие аудитории ≥ 70%',
        executor: 'llm',
        inputs: ['p6-landing-spec-draft.json', 'p1-audience-intent.json'],
        outputs: ['p7-landing-spec-final.json — финальная спецификация'],
        details: [
          'seo.title и seo.description дорабатываются так, чтобы упоминать резолвленный сегмент или ключи главных историй.',
          'Подписи всех CTA приводятся к preferredCtaTypes из аудиторного плана P1.',
          'Структура не меняется — только SEO-поля и подписи кнопок.',
          'Гейт: скоринг соответствия аудитории (покрытие историй и сегментов) не ниже 70%.',
        ],
        sources: [
          { path: 'packages/harness/src/validators/landing-audience.ts', note: 'аудиторный скоринг' },
        ],
      },
      {
        id: 'P8',
        title: 'Иллюстрации',
        summary: 'Секциям без mock-ов назначаются SVG-иллюстрации.',
        gate: 'Схема иллюстраций валидна; AST-проверка SVG',
        executor: 'llm',
        inputs: ['p7-landing-spec-final.json (или content/landings/<slug>.json)'],
        outputs: [
          'p8-illustration-allocation.json — решения по каждой визуальной секции',
          'p8-illustration-<id>.prompt.md — задание ассистенту на каждую новую SVG',
          'packages/ui/src/illustrations/generated/ — готовые TSX-иллюстрации',
        ],
        details: [
          'Код решает для каждой визуальной секции: переиспользовать mock, сгенерировать SVG или ничего не делать.',
          'На каждую новую SVG пишется отдельное задание ассистенту с анти-дубликационными отпечатками уже использованных композиций.',
          'Ассистент рисует TSX по правилам skill-документа: светлая и тёмная версии, токены бренда, реалистичные русские строки внутри.',
          'AST-валидатор жёстко проверяет разметку; при повторном запуске фаза видит готовые файлы и проходит.',
        ],
        sources: [
          { path: 'packages/harness/src/pipeline/allocate-illustrations.ts', note: 'логика распределения' },
          { path: 'packages/harness/src/prompts/svg-illustration-skill.md', note: 'правила SVG' },
          { path: 'packages/harness/src/validators/illustration-ast.ts', note: 'AST-гейт' },
          { path: 'packages/harness/src/schemas/illustration-spec.ts', note: 'схема задания' },
        ],
      },
    ],
    rules: [
      {
        text: 'Гейты всех фаз — блокирующие (полная таблица в wiki)',
        severity: 'hard',
        source: 'wiki/pipeline/phase-gates.md',
      },
      {
        text: 'Финальный пакет apply: схема спецификации, бренд-голос, бизнес-правила, визуальное разнообразие, порядок секций, домен mock-ов, соответствие аудитории ≥ 70%',
        severity: 'hard',
        source: 'packages/harness/src/agent/ingest-landing.ts',
      },
      {
        text: 'Язык: англицизмы из словаря §10 редполитики',
        severity: 'soft',
        source: 'packages/harness/src/validators/landing-language.ts',
      },
      {
        text: 'Непохожесть на другие лендинги завода (cross-landing diversity)',
        severity: 'soft',
        source: 'packages/harness/src/validators/cross-landing-diversity.ts',
      },
    ],
    commands: [
      {
        cmd: 'pnpm -w run harness agent run landing --slug <slug> --brief content/briefs/<slug>.json',
        note: 'Прогнать все фазы подряд',
      },
      {
        cmd: 'pnpm -w run harness agent run-phase landing P4 --slug <slug> --brief content/briefs/<slug>.json',
        note: 'Перезапустить одну конкретную фазу',
      },
      {
        cmd: 'pnpm -w run harness agent apply landing --slug <slug> --brief content/briefs/<slug>.json',
        note: 'Финальные проверки спецификации + рендер страницы',
      },
    ],
    artifacts: [
      { path: '.context/pipeline/<slug>/', note: 'артефакты фаз и repair-отчёты' },
      { path: 'content/landings/<slug>.json', note: 'спецификация страницы' },
      { path: 'generated/landings/<slug>/page.tsx', note: 'готовый код страницы' },
    ],
    links: [
      { path: 'packages/harness/src/pipeline/orchestrator.ts', note: 'оркестратор фаз' },
      { path: 'wiki/pipeline/phase-gates.md', note: 'таблица гейтов по фазам' },
      { path: 'packages/harness/src/agent/ingest-landing.ts', note: 'цепочка проверок apply' },
    ],
  },

  {
    kind: 'stage',
    slug: 'illustrations',
    num: '4',
    title: 'Иллюстрации (SVG)',
    short: 'Секции без mock-ов получают уникальные SVG в стиле Kaiten',
    purpose: [
      'Не каждой секции подходит mock интерфейса. Для таких секций конвейер генерирует векторные SVG-иллюстрации по спецификации: светлая и тёмная версии, палитра бренда, реализм домена продукта.',
      'Каждая иллюстрация автоматически проверяется на уровне разметки (AST): корректный viewBox, без растровых вставок, с доступностью. Реестр анти-дубликации не даёт использовать одну и ту же иллюстрацию на разных лендингах.',
    ],
    inputs: [
      'Секции без mock-а из спецификации страницы',
      'IllustrationSpec — задание на иллюстрацию',
    ],
    outputs: [
      'SVG-иллюстрации для секций',
      'Записи в реестре content/illustrations/registry.json',
    ],
    how: [
      {
        title: 'Постановка задания',
        detail: 'Фаза P8 (или ручной запуск) собирает IllustrationSpec: сюжет, домен, палитра.',
      },
      {
        title: 'Генерация SVG',
        detail:
          'Ассистент рисует SVG по правилам skill-документа: light/dark, токены бренда, без растра.',
      },
      {
        title: 'Проверка и регистрация',
        detail:
          'AST-валидатор проверяет разметку; иллюстрация регистрируется в реестре анти-дубликации.',
      },
    ],
    rules: [
      {
        text: 'Разметка SVG: viewBox, без растровых изображений, доступность',
        severity: 'hard',
        source: 'packages/harness/src/validators/illustration-ast.ts',
      },
      {
        text: 'Палитра соответствует токенам бренда',
        severity: 'soft',
        source: 'packages/harness/src/validators/illustration-ast.ts',
      },
      {
        text: 'Иллюстрация из домена продукта, без переиспользования чужих доменов',
        severity: 'hard',
        source: 'packages/harness/src/validators/illustration-domain-match.ts',
      },
    ],
    commands: [
      {
        cmd: 'pnpm -w run harness generate illustration --spec content/illustrations/<file>.json',
        note: 'Сгенерировать иллюстрацию по спецификации',
      },
    ],
    artifacts: [
      { path: 'content/illustrations/registry.json', note: 'реестр против дублей' },
    ],
    links: [
      {
        path: 'packages/harness/src/prompts/svg-illustration-skill.md',
        note: 'правила SVG-иллюстраций',
      },
    ],
  },

  {
    kind: 'stage',
    slug: 'visual-review',
    num: '5',
    title: 'Визуальное ревью (Playwright)',
    short: 'Скриншоты страницы сравниваются с эталоном попиксельно',
    purpose: [
      'Правило завода: лендинг считается готовым только после визуальной проверки скриншотом, а не после «страница открылась без ошибок». Playwright открывает сгенерированную страницу, снимает скриншоты и сравнивает их с эталонными.',
      'Любое расхождение с эталоном — повод посмотреть глазами: либо это регрессия и её нужно чинить, либо изменение осознанное — и тогда эталон обновляется отдельной командой.',
    ],
    inputs: [
      'Сгенерированная страница generated/landings/<slug>/page.tsx',
      'Эталонные скриншоты (baseline)',
    ],
    outputs: ['Отчёт сравнения; diff-картинки при расхождениях'],
    how: [
      {
        title: 'Запуск страницы',
        detail: 'Тест поднимает dev-сервер и открывает лендинг в браузере.',
      },
      {
        title: 'Скриншоты и сравнение',
        detail: 'Снимки сравниваются с эталоном попиксельно с настроенным порогом чувствительности.',
      },
      {
        title: 'Обновление эталона',
        detail: 'Если изменение осознанное — эталон пересоздаётся командой test:visual:update.',
      },
    ],
    rules: [
      {
        text: 'Расхождение скриншота с эталоном — провал проверки',
        severity: 'hard',
        source: 'apps/web/tests/visual/landing.spec.ts',
      },
    ],
    commands: [
      { cmd: 'pnpm --filter @kaiten/web test:visual', note: 'Прогнать визуальные тесты' },
      { cmd: 'pnpm --filter @kaiten/web test:visual:update', note: 'Обновить эталонные скриншоты' },
    ],
    links: [{ path: 'apps/web/tests/visual/landing.spec.ts', note: 'визуальные тесты' }],
  },

  {
    kind: 'stage',
    slug: 'approval',
    num: '6',
    title: 'Согласование (approval)',
    short: 'Человек смотрит готовую страницу и ставит статус',
    purpose: [
      'Финальное решение остаётся за человеком. Готовый лендинг открывается на странице согласования: превью, комментарии и статус — approved или changes_requested.',
      'Согласование двухуровневое: отдельно согласуется ТЗ (на этапе фабрики ТЗ), отдельно — готовый лендинг. Статусы хранятся в репозитории рядом с контентом, история не теряется.',
    ],
    inputs: ['Готовая страница (превью /landings/<slug>)'],
    outputs: [
      'Статус лендинга: content/approvals/<slug>.json',
      'Статус ТЗ: content/approvals/<slug>.intake.json',
    ],
    how: [
      {
        title: 'Открыть страницу согласования',
        detail:
          'http://localhost:3000/approve/<slug> — превью страницы плюс форма: статус, имя ревьюера, комментарии.',
      },
      {
        title: 'Поставить статус',
        detail: 'approved / changes_requested / pending; комментарии сохраняются в файл статуса.',
      },
      {
        title: 'Гейты ниже по конвейеру',
        detail:
          'handoff с флагом --require-approved не соберёт пакет без approved; build с --require-intake-approved не стартует без согласованного ТЗ.',
      },
    ],
    rules: [
      {
        text: 'handoff --require-approved блокируется без статуса approved',
        severity: 'hard',
        source: 'packages/harness/src/approvals/index.ts',
      },
    ],
    commands: [
      { cmd: 'pnpm -w run harness approvals list', note: 'Список всех статусов' },
      { cmd: 'pnpm -w run harness approvals status <slug>', note: 'Статус конкретного лендинга' },
    ],
    artifacts: [{ path: 'content/approvals/', note: 'статусы согласований' }],
    links: [{ path: 'packages/harness/src/approvals/index.ts', note: 'хранение статусов' }],
  },

  {
    kind: 'stage',
    slug: 'handoff',
    num: '7',
    title: 'Передача в разработку (handoff)',
    short: 'Готовый лендинг пакуется в ZIP для команды фронтенда',
    purpose: [
      'Последний этап: согласованный лендинг упаковывается в самодостаточный архив — код страницы, используемые компоненты, дизайн-токены и документация. Разработчик получает один файл и не ходит по репозиторию завода.',
    ],
    inputs: [
      'Код страницы generated/landings/<slug>/page.tsx',
      'Статус согласования (для гейта --require-approved)',
    ],
    outputs: ['Архив out/landing-<slug>.zip'],
    how: [
      {
        title: 'Сборка пакета',
        detail: 'TSX страницы + компоненты + дизайн-токены + manifest собираются в ZIP.',
      },
      {
        title: 'Гейт согласования',
        detail: 'С флагом --require-approved пакет не соберётся без статуса approved.',
      },
      {
        title: 'Скачивание из браузера',
        detail: 'Кнопка «handoff ↓» на дашборде лендингов скачивает тот же архив.',
      },
    ],
    rules: [
      {
        text: 'С флагом --require-approved архив не собирается без согласования',
        severity: 'hard',
        source: 'packages/harness/src/handoff/',
      },
    ],
    commands: [
      { cmd: 'pnpm -w run harness handoff <slug>', note: 'Собрать архив' },
      {
        cmd: 'pnpm -w run harness handoff <slug> --require-approved',
        note: 'Собрать только если лендинг согласован',
      },
    ],
    artifacts: [{ path: 'out/landing-<slug>.zip', note: 'пакет для разработчика' }],
    links: [{ path: 'packages/harness/src/handoff/', note: 'сборщик пакета' }],
  },
];
