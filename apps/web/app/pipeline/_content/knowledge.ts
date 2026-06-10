import type { PipelineDoc } from './types';

/**
 * Сквозные разделы: действуют на всех этапах конвейера.
 */
export const KNOWLEDGE: PipelineDoc[] = [
  {
    kind: 'knowledge',
    slug: 'brand-canon',
    title: 'Брендовый канон',
    short: 'Источник истины: тон, лексика, факты продукта',
    purpose: [
      'Все тексты конвейера опираются на единый канон. Главный документ — редполитика Kaiten: тон («ясно, практично, уверенно, без хайпа»), имя продукта, как формулируются боли клиентов, запрет лозунгов.',
      'При конфликте источников действует каскад: редполитика главнее голосовых правил дизайн-системы, а те — главнее промптов. Факты о продукте (возможности, тарифы, интеграции) берутся только из проверенного списка — выдумывать запрещено.',
    ],
    rules: [
      {
        text: 'Запрещены hype-слова, абсолютизмы («10x», «лучший в мире») и пустые штампы',
        severity: 'hard',
        source: 'packages/harness/src/validators/landing-brand.ts',
      },
      {
        text: 'Англицизмы заменяются по словарю: «канбан» и «скрам» — кириллицей, названия сервисов не переводятся',
        severity: 'soft',
        source: 'wiki/references/anglicism-dictionary.md',
      },
      {
        text: 'Факты о продукте — только из проверенного списка kaiten-product-facts',
        severity: 'hard',
        source: 'wiki/references/kaiten-product-facts.md',
      },
    ],
    links: [
      { path: 'wiki/brand/redpolitika.md', note: 'редполитика — главный документ канона' },
      {
        path: 'wiki/design-system/voice.md',
        note: 'голос дизайн-системы (подчинён редполитике)',
      },
      { path: 'wiki/references/anglicism-dictionary.md', note: 'словарь англицизмов' },
      { path: 'wiki/references/kaiten-product-facts.md', note: 'проверенные факты продукта' },
      { path: 'wiki/references/domain-mock-matrix.md', note: 'какие mock-и разрешены какому домену' },
    ],
  },

  {
    kind: 'knowledge',
    slug: 'validators',
    title: 'Валидаторы качества',
    short: 'Автоматические проверки, через которые проходит каждая страница',
    purpose: [
      'Валидаторы — это ОТК завода: набор автоматических проверок, которые не пропускают брак. HARD-проверка блокирует конвейер до исправления; SOFT — предупреждает, но не останавливает.',
      'Проверки стоят в четырёх точках: публикация брифа (intake-apply), гейты фаз конвейера сборки P0–P8 с финальным пакетом проверок (agent apply), генерация иллюстраций и аудит непохожести лендингов между собой.',
    ],
    rules: [
      {
        text: 'Качество брифа: поля содержательны, без лозунгов, домен распознан, есть доказательства',
        severity: 'hard',
        source: 'packages/harness/src/validators/brief-quality.ts',
      },
      {
        text: 'Структура спецификации: типы и длины полей по строгой схеме',
        severity: 'hard',
        source: 'packages/harness/src/schemas/landing-spec.ts',
      },
      {
        text: 'Бренд-голос: без хайпа, абсолютизмов и штампов',
        severity: 'hard',
        source: 'packages/harness/src/validators/landing-brand.ts',
      },
      {
        text: 'Бизнес-правила: hero первой секцией, hero один, CTA согласован с целью',
        severity: 'hard',
        source: 'packages/harness/src/validators/landing-business.ts',
      },
      {
        text: 'Язык: англицизмы по словарю §10 редполитики',
        severity: 'soft',
        source: 'packages/harness/src/validators/landing-language.ts',
      },
      {
        text: 'Визуальное разнообразие: варианты компонентов не повторяются',
        severity: 'hard',
        source: 'packages/harness/src/validators/landing-visual-diversity.ts',
      },
      {
        text: 'Соответствие макету: порядок секций по плейбуку',
        severity: 'hard',
        source: 'packages/harness/src/validators/landing-layout-conformance.ts',
      },
      {
        text: 'Mock-и и иллюстрации только из домена продукта (cross-domain запрещён)',
        severity: 'hard',
        source: 'packages/harness/src/validators/illustration-domain-match.ts',
      },
      {
        text: 'Соответствие аудитории: покрытие историй и сегментов ≥ 70%',
        severity: 'hard',
        source: 'packages/harness/src/validators/landing-audience.ts',
      },
      {
        text: 'Совместимость макета с осведомлённостью аудитории (гейт P2)',
        severity: 'hard',
        source: 'packages/harness/src/validators/layout-awareness-fit.ts',
      },
      {
        text: 'Архитектура секций покрывает 100% обязательных намерений (гейт P4)',
        severity: 'hard',
        source: 'packages/harness/src/validators/section-plan-intent.ts',
      },
      {
        text: 'У каждого выбора mock-а есть обоснование (гейт P4)',
        severity: 'hard',
        source: 'packages/harness/src/validators/section-plan-mock-choice.ts',
      },
      {
        text: 'Вариант mock-а разрешён для домена страницы (гейт P5)',
        severity: 'hard',
        source: 'packages/harness/src/validators/mock-semantic-fit.ts',
      },
      {
        text: 'Разметка SVG-иллюстраций: viewBox, без растра, доступность',
        severity: 'hard',
        source: 'packages/harness/src/validators/illustration-ast.ts',
      },
      {
        text: 'Непохожесть на другие лендинги: структура, mock-и, тексты',
        severity: 'soft',
        source: 'packages/harness/src/validators/cross-landing-diversity.ts',
      },
    ],
    links: [
      { path: 'packages/harness/src/validators/', note: 'каталог всех валидаторов' },
      { path: 'wiki/pipeline/phase-gates.md', note: 'какие гейты стоят на каких фазах' },
    ],
  },

  {
    kind: 'knowledge',
    slug: 'knowledge-base',
    title: 'База знаний (wiki)',
    short: 'Плейбуки, референсы и накопленные уроки завода',
    purpose: [
      'Конвейер учится: каждое ревью пополняет wiki. Уроки (lessons) автоматически попадают в системные промпты следующих генераций — однажды найденная ошибка не повторяется.',
      'Здесь же живут плейбуки макетов (какую структуру страницы выбирать под какую аудиторию), референсы по покрытым доменам и журнал всех операций завода.',
    ],
    how: [
      {
        title: 'Уроки — lessons.md',
        detail:
          'Накопленные правила из ревью: оформление mock-ов, реалистичные русские тексты, семантика акцентных цветов и другие.',
      },
      {
        title: 'Плейбуки макетов — layouts/',
        detail: '10 типовых структур страницы с рекомендациями по секциям и слотам.',
      },
      {
        title: 'Доменные референсы — landings/',
        detail: 'Эталонные структуры, mock-и и паттерны текстов под каждый покрытый домен.',
      },
      {
        title: 'Журнал — log.md',
        detail: 'Append-only хроника операций: генерации, проверки, согласования, handoff.',
      },
    ],
    links: [
      { path: 'wiki/lessons.md', note: 'накопленные уроки' },
      { path: 'wiki/layouts/', note: '10 плейбуков макетов' },
      { path: 'wiki/landings/', note: 'референсы по доменам' },
      { path: 'wiki/pipeline/phase-gates.md', note: 'гейты фаз поэтапного конвейера' },
      { path: 'wiki/log.md', note: 'журнал операций' },
    ],
  },
];
