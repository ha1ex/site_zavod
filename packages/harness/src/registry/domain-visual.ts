/**
 * Domain → Visual registry.
 *
 * TypeScript-зеркало wiki/references/domain-mock-matrix.md. Машинно-читаемый
 * источник правды о том, какие mock-варианты принадлежат какому домену
 * продукта. Используется validator'ом illustration-domain-match для блокировки
 * cross-domain reuse (pm-board в CRM-лендинге и т.п.).
 *
 * Если этот файл расходится с domain-mock-matrix.md — markdown побеждает,
 * поправь TypeScript. Не дублируй контент, только зеркали.
 *
 * Расширение нового домена:
 *   1. Сначала обнови wiki/references/domain-mock-matrix.md (раздел + mocks).
 *   2. Создай wiki/landings/<domain>-reference.md по образцу crm-reference.md.
 *   3. Затем добавь запись в DOMAIN_REGISTRY ниже (mirroring matrix).
 *   4. Обнови aliases для lexical-резолва.
 */
import type { Brief } from '../schemas/brief';
import type { MockVariant } from '../schemas/landing-spec';

export type Domain =
  | 'pm'
  | 'support'
  | 'crm'
  | 'hr'
  | 'marketing'
  | 'bpm'
  | 'finance'
  | 'ecommerce'
  | 'docs'
  | 'manufacturing'
  | 'unknown';

export interface DomainMockEntry {
  variant: MockVariant;
  /**
   * В каких секциях этот mock уместен. Используется
   * для предотвращения «hero-only mock в media-слоте».
   */
  sections: Array<'hero' | 'media' | 'tab' | 'scenario'>;
  description: string;
}

export interface MissingMockHint {
  variant: string;
  description: string;
}

export interface DomainEntry {
  domain: Domain;
  displayName: string;
  description: string;
  /** Ключевые слова для lexical-резолва в brief.product/market/audience/mainPain/mainPromise. */
  aliases: string[];
  /** Существующие mocks. Пустой массив для непокрытых доменов. */
  mocks: DomainMockEntry[];
  /** Описание ожидаемых mocks для непокрытых доменов (для domain-missing-mocks суггестов). */
  missingMocks: MissingMockHint[];
  /** Путь к reference-документу. */
  referenceDoc?: string;
}

/**
 * Зеркало wiki/references/domain-mock-matrix.md.
 *
 * Порядок записей соответствует разделам матрицы. При добавлении нового домена
 * вставляй в правильное место (alphabetical либо по приоритету покрытия).
 */
export const DOMAIN_REGISTRY: DomainEntry[] = [
  {
    domain: 'pm',
    displayName: 'Project Management',
    description:
      'Jira-like, спринты, эпики, story points, команды разработки, дорожная карта',
    aliases: [
      'project management',
      'pm',
      'jira',
      'спринт',
      'эпик',
      'story points',
      'kanban',
      'agile',
      'scrum',
      'трекер задач',
      'управление проектами',
      'разработк',
      'дорожная карта',
    ],
    mocks: [
      {
        variant: 'pm-board',
        sections: ['hero', 'media', 'tab', 'scenario'],
        description:
          'Канбан PM-команды: Бэклог → В работе → Ревью → Готово, карточки с эпиками, story points, исполнителями',
      },
      {
        variant: 'kb-internal',
        sections: ['media', 'tab'],
        description: 'Внутренний регламент / база знаний для команды',
      },
      {
        variant: 'analytics-kpi',
        sections: ['media', 'tab'],
        description:
          'Дашборд руководителя: спринт в срок, задач в работе, цикл story, риски, загрузка команд',
      },
      {
        variant: 'integrations-console',
        sections: ['media', 'tab'],
        description: 'Лента событий из 1С, AmoCRM, Telegram, GitLab (Kaiten-домен)',
      },
      {
        variant: 'modules-matrix',
        sections: ['media', 'hero'],
        description: 'Bento-grid модулей платформы (PM, KB, поддержка, BPM, BI, AI)',
      },
      {
        variant: 'pm-board-1',
        sections: ['hero', 'media', 'tab', 'scenario'],
        description:
          'Приложение Kaiten (маркетинговый стиль): сайдбар с деревом досок, борд со свимлейнами «Цели»/«Текущие задачи», карточки-скелетоны, всплывающая срочная задача — «вся работа команды в одном окне»',
      },
    ],
    missingMocks: [],
    referenceDoc: 'wiki/landings/kaiten-platform.md',
  },
  {
    domain: 'support',
    displayName: 'Service Desk / Поддержка',
    description:
      'Входящие обращения, SLA, очередь, эскалация, чат с клиентом, FAQ, статьи КБ',
    aliases: [
      'service desk',
      'support',
      'поддержка',
      'обращение',
      'тикет',
      'sla',
      'клиентский сервис',
      'customer success',
      'хелпдеск',
      'helpdesk',
      'faq',
      'база знаний',
    ],
    mocks: [
      {
        variant: 'support-board',
        sections: ['hero', 'media', 'tab', 'scenario'],
        description:
          'Канбан-доска заявок поддержки: Очередь → В работе → Готовлю ответ → Готово',
      },
      {
        variant: 'request-card',
        sections: ['media', 'tab', 'scenario'],
        description: 'Карточка заявки с чатом клиент/агент и чек-листом действий',
      },
      {
        variant: 'kb-public',
        sections: ['media', 'tab'],
        description: 'Статья базы знаний для клиентов',
      },
      {
        variant: 'kb-internal',
        sections: ['media', 'tab'],
        description: 'Внутренний регламент для агентов поддержки',
      },
    ],
    missingMocks: [],
    referenceDoc: 'wiki/landings/kaiten-techsupport-reference.md',
  },
  {
    domain: 'crm',
    displayName: 'CRM / Продажи',
    description:
      'Воронка сделок, карточка клиента, омниканальные обращения, звонки, аналитика выручки, документы, мобильное',
    aliases: [
      'crm',
      'продаж',
      'воронк',
      'сделк',
      'лид',
      'клиентск',
      'омниканальн',
      'выручк',
      'cpl',
      'конверси',
      'sales',
      'pipeline',
      'b2c sales',
      'b2b sales',
      'cold outreach',
    ],
    mocks: [
      {
        variant: 'sales-funnel',
        sections: ['hero', 'media', 'tab', 'scenario'],
        description:
          'Воронка сделок: Лид → Квалификация → Договор → Оплата с компаниями, суммами в рублях, контактами, датой следующего шага',
      },
      {
        variant: 'crm-client-card',
        sections: ['media', 'tab', 'scenario'],
        description:
          'Карточка клиента с табами (Профиль / Сделки / История / Документы / Задачи), активной сделкой, таймлайном событий',
      },
      {
        variant: 'omnichannel-inbox',
        sections: ['media', 'tab', 'scenario'],
        description:
          'Единый inbox обращений: звонок, Telegram, чат сайта, почта, WhatsApp с цвет-кодом канала',
      },
      {
        variant: 'call-overlay',
        sections: ['media', 'scenario'],
        description:
          'Окно входящего звонка поверх карточки клиента: таймер, скрипт продаж, заметка после разговора',
      },
      {
        variant: 'crm-analytics',
        sections: ['media', 'tab'],
        description:
          'Дашборд CRM: выручка, конверсия в оплату, стоимость лида, длина сделки, воронка по стадиям, источники лидов',
      },
      {
        variant: 'doc-template',
        sections: ['media', 'scenario'],
        description:
          'Счёт / договор с автоподстановкой полей клиента и статусом Сформирован → Отправлен → Просмотрен → Оплачен',
      },
      {
        variant: 'booking-calendar',
        sections: ['media', 'scenario'],
        description:
          'Онлайн-запись: сетка специалисты × часы, выбранный слот, подтверждение брони',
      },
      {
        variant: 'mobile-crm',
        sections: ['media', 'scenario'],
        description:
          'Мобильное приложение CRM: пропущенный звонок, KPI дня, активные сделки, нижняя таб-навигация',
      },
    ],
    missingMocks: [],
    referenceDoc: 'wiki/landings/crm-reference.md',
  },
  {
    domain: 'hr',
    displayName: 'HR / Recruiting / People Operations',
    description: 'Кандидат, вакансия, оффер, онбординг, перформанс-ревью, 1-on-1',
    aliases: [
      'hr',
      'recruiting',
      'people operations',
      'рекрутинг',
      'найм',
      'кандидат',
      'вакансия',
      'оффер',
      'онбординг',
      'ats',
      'hrm',
      'перформанс ревью',
    ],
    mocks: [
      {
        variant: 'hiring-pipeline',
        sections: ['hero', 'media', 'tab', 'scenario'],
        description:
          'Канбан найма: 6 стадий, карточки кандидатов с грейдом, ожидаемой ЗП, интервьюером',
      },
      {
        variant: 'candidate-card',
        sections: ['media', 'tab', 'scenario'],
        description:
          'Карточка кандидата с табами, оценками 3 интервьюеров, статусом готовности к офферу',
      },
      {
        variant: 'onboarding-checklist',
        sections: ['media', 'tab', 'scenario'],
        description:
          'Чек-лист онбординга по 5 дням первой недели с владельцами задач (HR / IT / тимлид) и статусами',
      },
      {
        variant: 'org-chart',
        sections: ['media', 'tab'],
        description: 'Фрагмент оргструктуры: CTO → 3 Lead\'а → команда с open vacancies',
      },
      {
        variant: 'performance-review',
        sections: ['media', 'scenario'],
        description:
          'Карточка performance review: цели с прогрессом, 360° обратная связь, финальный рейтинг',
      },
    ],
    missingMocks: [],
    referenceDoc: 'wiki/landings/hr-reference.md',
  },
  {
    domain: 'marketing',
    displayName: 'Marketing Automation',
    description: 'Кампания, A/B-тест, конверсия, LTV/CAC, email-цепочка, сегмент аудитории',
    aliases: [
      'marketing',
      'маркетинг',
      'кампани',
      'email цепочк',
      'a/b тест',
      'ltv',
      'cac',
      'cpa',
      'аудитор сегмент',
      'growth marketing',
      'performance marketing',
    ],
    mocks: [
      {
        variant: 'campaign-dashboard',
        sections: ['hero', 'media', 'tab'],
        description:
          'Дашборд кампании: 2×2 KPI (CTR, CPL, конверсия, расход) + 4 канала с распределением бюджета',
      },
      {
        variant: 'email-sequence',
        sections: ['media', 'tab', 'scenario'],
        description:
          'Flow email-цепочки: 5 писем с триггерами, темами, open/click rate, активным шагом',
      },
      {
        variant: 'ab-test-results',
        sections: ['media', 'tab', 'scenario'],
        description:
          'Результаты A/B: Variant A vs B с метриками, lift +40%, стат-значимость p-value 0.012',
      },
      {
        variant: 'audience-segments',
        sections: ['media', 'tab'],
        description:
          'Список сегментов аудитории: правила формирования, размер, рост за неделю',
      },
    ],
    missingMocks: [],
    referenceDoc: 'wiki/landings/marketing-reference.md',
  },
  {
    domain: 'bpm',
    displayName: 'BPM / Workflow Automation',
    description: 'Процесс, шаг, согласование, SLA, эскалация, BPMN, узкое место',
    aliases: [
      'bpm',
      'workflow',
      'процесс',
      'согласовани',
      'bpmn',
      'регламент',
      'эскалаци',
      'бизнес-процесс',
    ],
    mocks: [
      {
        variant: 'process-flowchart',
        sections: ['hero', 'media', 'tab'],
        description:
          'Схема бизнес-процесса: 6 шагов с ответственными, SLA, статусами (done/current/bottleneck/pending)',
      },
      {
        variant: 'approval-chain',
        sections: ['media', 'scenario'],
        description:
          'Цепочка согласований: 4 подписанта со статусами, временами ожидания, эскалацией',
      },
      {
        variant: 'sla-tracker',
        sections: ['media', 'tab'],
        description:
          'SLA-трекер: 6 процессов с % в SLA / % просрочки, цвет-код зон (зелёный/оранжевый/красный)',
      },
    ],
    missingMocks: [],
    referenceDoc: 'wiki/landings/bpm-reference.md',
  },
  {
    domain: 'finance',
    displayName: 'Finance / Accounting',
    description: 'Проводка, счёт, сверка, бюджет, P&L, дебиторка/кредиторка',
    aliases: [
      'finance',
      'accounting',
      'бухгалтер',
      'финанс',
      'проводк',
      'счёт',
      'сверк',
      'бюджет',
      'p&l',
      'дебиторк',
      'кредиторк',
      'erp',
    ],
    mocks: [
      {
        variant: 'ledger-view',
        sections: ['hero', 'media', 'tab'],
        description:
          'Главная книга: проводки с датой, документом, счётами дебет/кредит, балансом',
      },
      {
        variant: 'invoice-status',
        sections: ['media', 'tab', 'scenario'],
        description:
          'Список счетов с компанией, суммой, сроком оплаты, статусом просрочки (paid/sent/overdue/draft)',
      },
      {
        variant: 'reconciliation-matrix',
        sections: ['media', 'tab', 'scenario'],
        description:
          'Матрица сверки банк × ERP с расхождениями: match/diff/missing с цвет-кодом',
      },
    ],
    missingMocks: [],
    referenceDoc: 'wiki/landings/finance-reference.md',
  },
  {
    domain: 'ecommerce',
    displayName: 'E-commerce / Retail operations',
    description: 'SKU, заказ, остаток, доставка, маркетплейс, повторная покупка',
    aliases: [
      'ecommerce',
      'e-commerce',
      'retail',
      'sku',
      'заказ',
      'остаток',
      'доставк',
      'маркетплейс',
      'wildberries',
      'ozon',
      'я.маркет',
      'интернет магазин',
    ],
    mocks: [
      {
        variant: 'order-queue',
        sections: ['hero', 'media', 'tab', 'scenario'],
        description:
          'Лента заказов с маркетплейсов и сайта со статусами сборки/доставки/курьерами',
      },
      {
        variant: 'inventory-grid',
        sections: ['media', 'tab'],
        description:
          'Каталог товаров SKU × склады с остатками, минимальным запасом, цвет-код наличия',
      },
      {
        variant: 'marketplace-connector',
        sections: ['media', 'tab', 'scenario'],
        description:
          'Статус коннекторов Wildberries / Ozon / Я.Маркет / AliExpress: подключён/синхронизация/ошибка',
      },
    ],
    missingMocks: [],
    referenceDoc: 'wiki/landings/ecommerce-reference.md',
  },
  {
    domain: 'docs',
    displayName: 'Документы и база знаний',
    description:
      'Документы, страницы, иерархия разделов, права доступа, совместное ' +
      'редактирование, комментарии, шаблоны, поиск, публичные ссылки, импорт',
    aliases: [
      'документ',
      'база знаний',
      'базы знаний',
      'wiki',
      'вики',
      'knowledge base',
      'kb',
      'инструкци',
      'регламент компани',
      'регламент процесс',
      'разделы и папк',
      'иерархия документ',
      'структур знани',
      'шаблон документ',
      'шаблоны документ',
      'совместное редактирование',
      'совместная работа над документ',
      'комментарии к документ',
      'комментарии в документ',
      'упоминания в документ',
      'доступ к документ',
      'доступы к документ',
      'публичная ссылка на документ',
      'импорт документ',
      'редактор документов',
      'редактор документ',
      'техническ документац',
      'проектная документац',
      'страницы и подстраницы',
    ],
    mocks: [
      {
        variant: 'docs-tree',
        sections: ['hero', 'media', 'tab', 'scenario'],
        description:
          'Дерево разделов слева (Компания → Регламенты / HR / Маркетинг → документы) и фрагмент открытого документа справа',
      },
      {
        variant: 'doc-editor-rich',
        sections: ['hero', 'media', 'tab'],
        description:
          'Документ в редакторе с разнотипными блоками: заголовки, текст, чек-лист, таблица, цитата, блок кода, раскрывающийся блок',
      },
      {
        variant: 'permissions-panel',
        sections: ['media', 'tab', 'scenario'],
        description:
          'Окно настройки доступа: участники с ролями (Owner / Editor / Viewer), группы, переключатель публичной ссылки',
      },
      {
        variant: 'share-link-card',
        sections: ['media', 'scenario'],
        description:
          'Карточка документа с настройкой публичной ссылки: статус доступа, кнопка «Скопировать», ограничения для внешнего пользователя',
      },
      {
        variant: 'template-gallery',
        sections: ['media', 'tab', 'hero'],
        description:
          'Сетка карточек шаблонов: регламент, протокол встречи, ТЗ, OKR, онбординг, FAQ',
      },
      {
        variant: 'mobile-doc-reader',
        sections: ['media', 'scenario'],
        description:
          'Силуэт мобильного экрана: заголовок документа, дерево разделов и чек-лист, нижняя навигация',
      },
      {
        variant: 'kb-public',
        sections: ['media', 'tab'],
        description:
          'Опубликованная статья базы знаний для клиентов или партнёров',
      },
      {
        variant: 'kb-internal',
        sections: ['media', 'tab'],
        description:
          'Внутренний регламент / инструкция для сотрудников команды',
      },
    ],
    missingMocks: [],
    referenceDoc: 'wiki/landings/docs-reference.md',
  },
  {
    domain: 'manufacturing',
    displayName: 'Manufacturing / Производство',
    description:
      'Производственные заказы, маршрут заявка → закупка → производство → ОТК → отгрузка, ' +
      'спецификации и чертежи внутри карточки, загрузка цеха и участков, ОТК, диаграмма Ганта',
    aliases: [
      'manufacturing',
      'production',
      'производств',
      'цех',
      'отк',
      'снабжен',
      'технолог',
      'мастер',
      'кладовщик',
      'участок',
      'заказ на поставку',
      'спецификаци',
      'чертёж',
      'чертеж',
      'техкарт',
      'диаграмма ганта',
      'ресурсное планирование',
      'согласование отк',
      'мелкосерийное производство',
      'машиностроени',
      'металлообработка',
      'приборостроение',
      'контрактное производство',
      'завод',
    ],
    mocks: [
      {
        variant: 'production-board',
        sections: ['hero', 'media', 'tab', 'scenario'],
        description:
          'Канбан производственного потока: Очередь → В работе → Согласование ОТК → Правки ОТК → Готово, карточки заказов с участками, номерами и компаниями',
      },
      {
        variant: 'order-flow',
        sections: ['media', 'tab', 'scenario'],
        description:
          'Доска «Заказы на поставку» + «Проект Омега» с одинаковыми стадиями: внешние заявки и внутренний производственный цикл бок о бок',
      },
      {
        variant: 'production-gantt',
        sections: ['hero', 'media', 'tab', 'scenario'],
        description:
          'Диаграмма Ганта по фазам Инициация → Планирование → Реализация, с ресурсным планированием и пересечениями этапов',
      },
      {
        variant: 'production-task-card',
        sections: ['media', 'scenario'],
        description:
          'Карточка производственной задачи с цехом, номером заказа, чек-листом действий, спецификацией и фото материалов',
      },
      {
        variant: 'production-departments',
        sections: ['media', 'tab'],
        description:
          'Mockup ноутбука «Вся компания в одной системе» с плавающими лейблами 6 департаментов (бухгалтерия, проектирование, логистика, коммерческий отдел, производство, оценка рисков)',
      },
    ],
    missingMocks: [],
    referenceDoc: 'wiki/landings/manufacturing-reference.md',
  },
];

/**
 * Lexical-резолв домена по brief. Возвращает первое совпадение по rank.
 * Если совпадений нет — 'unknown' (тогда нужен явный input или fallback).
 *
 * Стратегия: нормализуем все строковые поля brief в lowercase, ищем aliases,
 * считаем количество вхождений. Возвращаем домен с максимальным rank > 0.
 */
export function resolveDomainFromBrief(brief: Brief): Domain {
  const text = [
    brief.product,
    brief.market,
    brief.mainPain,
    brief.mainPromise,
    ...(brief.audience ?? []),
    ...(brief.proofPoints ?? []),
  ]
    .join(' ')
    .toLowerCase();

  let bestDomain: Domain = 'unknown';
  let bestScore = 0;

  for (const entry of DOMAIN_REGISTRY) {
    let score = 0;
    for (const alias of entry.aliases) {
      const aliasLower = alias.toLowerCase();
      let pos = 0;
      while ((pos = text.indexOf(aliasLower, pos)) !== -1) {
        score += 1;
        pos += aliasLower.length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestDomain = entry.domain;
    }
  }

  return bestDomain;
}

export function getDomainEntry(domain: Domain): DomainEntry | undefined {
  return DOMAIN_REGISTRY.find((entry) => entry.domain === domain);
}

/**
 * Список разрешённых mock-variants для домена. Для unknown — пустой
 * массив (validator должен заставить пользователя резолвить домен явно).
 */
export function getAllowedVariants(domain: Domain): MockVariant[] {
  return getDomainEntry(domain)?.mocks.map((m) => m.variant) ?? [];
}

/**
 * Проверка, разрешён ли variant для домена. 'unknown' домен запрещает всё —
 * это форсирует явную резолюцию через brief или ручной outline.
 */
export function isVariantValidForDomain(variant: string, domain: Domain): boolean {
  if (domain === 'unknown') return false;
  return getAllowedVariants(domain).includes(variant as MockVariant);
}

/**
 * Какой домен «владеет» этим variant'ом (для error messages типа
 * «variant pm-board из домена PM, продукт CRM — несовместимо»).
 */
export function getDomainOfVariant(variant: string): Domain | undefined {
  for (const entry of DOMAIN_REGISTRY) {
    if (entry.mocks.some((m) => m.variant === variant)) {
      return entry.domain;
    }
  }
  return undefined;
}

/**
 * Список ожидаемых mock'ов для домена, который не покрыт. Используется в
 * сообщении domain-missing-mocks: «создай эти 5 mock'ов, потом возвращайся».
 */
export function getMissingMocksForDomain(domain: Domain): MissingMockHint[] {
  return getDomainEntry(domain)?.missingMocks ?? [];
}

/**
 * Полный список доменов, для которых уже есть набор mock'ов. Используется
 * в onboarding'е (`harness registry --domains`) и в audit-output'ах.
 */
export function getCoveredDomains(): Domain[] {
  return DOMAIN_REGISTRY.filter((e) => e.mocks.length > 0).map((e) => e.domain);
}

/**
 * Список доменов, ждущих создания набора mock'ов. Для подсказок при создании
 * нового лендинга в новом домене.
 */
export function getUncoveredDomains(): Domain[] {
  return DOMAIN_REGISTRY.filter((e) => e.mocks.length === 0 && e.missingMocks.length > 0).map(
    (e) => e.domain,
  );
}
