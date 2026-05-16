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
    mocks: [],
    missingMocks: [
      {
        variant: 'hiring-pipeline',
        description:
          'Канбан найма: Заявка → Скрининг → Интервью → Тестовое → Оффер → Принят, в карточке кандидат с фото, грейдом, ожидаемой ЗП, этапом, интервьюером',
      },
      {
        variant: 'candidate-card',
        description:
          'Карточка кандидата с табами (Профиль / Резюме / Интервью / Тестовое / Оффер), оценками интервьюеров',
      },
      {
        variant: 'onboarding-checklist',
        description: 'Чек-лист онбординга по дням первой недели с владельцами задач и статусами',
      },
      {
        variant: 'org-chart',
        description: 'Фрагмент оргструктуры с открытыми вакансиями',
      },
      {
        variant: 'performance-review',
        description:
          'Карточка ревью с целями, оценками peers и manager, обратной связью',
      },
    ],
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
    mocks: [],
    missingMocks: [
      {
        variant: 'campaign-dashboard',
        description:
          'Дашборд кампании с CTR, CPC, конверсией по каналам, графиком расходов',
      },
      {
        variant: 'email-sequence',
        description:
          'Flow email-цепочки с триггерами, задержками, ветвлениями open/click',
      },
      {
        variant: 'ab-test-results',
        description: 'Результаты A/B: вариант A vs B, стат-значимость, lift по метрике',
      },
      {
        variant: 'audience-segments',
        description: 'Список сегментов с правилами включения и размером каждого',
      },
    ],
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
    mocks: [],
    missingMocks: [
      {
        variant: 'process-flowchart',
        description:
          'Визуальная схема процесса с шагами, ветвлениями и SLA на каждом шаге',
      },
      {
        variant: 'approval-chain',
        description:
          'Цепочка согласований с подписантами, статусом каждого, временем ожидания',
      },
      {
        variant: 'sla-tracker',
        description: 'Таблица процессов с временем выполнения vs SLA, цвет-код красный/зелёный',
      },
    ],
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
    mocks: [],
    missingMocks: [
      {
        variant: 'ledger-view',
        description: 'Фрагмент главной книги с проводками, дебет/кредит, балансом',
      },
      {
        variant: 'invoice-status',
        description:
          'Список счетов с компанией, суммой, сроком оплаты, статусом просрочки',
      },
      {
        variant: 'reconciliation-matrix',
        description: 'Матрица сверки банк × ERP с расхождениями',
      },
    ],
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
    mocks: [],
    missingMocks: [
      {
        variant: 'order-queue',
        description: 'Лента заказов с маркетплейсов и сайта, статус сборки/доставки',
      },
      {
        variant: 'inventory-grid',
        description:
          'Каталог товаров с остатками по складам, минимальным запасом',
      },
      {
        variant: 'marketplace-connector',
        description:
          'Статус подключения к Wildberries / Ozon / Я.Маркет с числом активных карточек',
      },
    ],
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
