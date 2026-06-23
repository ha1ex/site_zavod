import { cn } from '../../primitives/cn';

interface Candidate {
  bar: 'violet' | 'orange' | 'blue' | 'green';
  initials: string;
  name: string;
  grade: 'Junior' | 'Middle' | 'Senior';
  salary: string;
  interviewer: string;
  hot?: boolean;
  muted?: boolean;
  lifted?: boolean;
}

interface Stage {
  name: string;
  count: number;
  candidates: Candidate[];
}

const STAGES: Stage[] = [
  {
    name: 'Заявка',
    count: 14,
    candidates: [
      { bar: 'blue', initials: 'МК', name: 'Михаил Котов', grade: 'Middle', salary: '220 000 ₽', interviewer: 'HR · автоскрининг' },
      { bar: 'blue', initials: 'НГ', name: 'Наталья Громова', grade: 'Junior', salary: '140 000 ₽', interviewer: 'HR · ждёт ответа', muted: true },
    ],
  },
  {
    name: 'Скрининг',
    count: 9,
    candidates: [
      { bar: 'orange', initials: 'АП', name: 'Артём Поляков', grade: 'Senior', salary: '380 000 ₽', interviewer: 'Анна Соколова · HR' },
      { bar: 'blue', initials: 'ЕР', name: 'Елена Рябова', grade: 'Middle', salary: '240 000 ₽', interviewer: 'Анна Соколова · HR' },
    ],
  },
  {
    name: 'Интервью',
    count: 6,
    candidates: [
      { bar: 'violet', initials: 'СВ', name: 'Светлана Власова', grade: 'Senior', salary: '320 000 ₽', interviewer: 'Дмитрий Орлов · тимлид', hot: true, lifted: true },
      { bar: 'orange', initials: 'РК', name: 'Роман Климов', grade: 'Middle', salary: '260 000 ₽', interviewer: 'Игорь Лебедев · CTO' },
    ],
  },
  {
    name: 'Тестовое',
    count: 4,
    candidates: [
      { bar: 'orange', initials: 'ВТ', name: 'Виктор Тарасов', grade: 'Middle', salary: '250 000 ₽', interviewer: 'Тимлид проверяет' },
    ],
  },
  {
    name: 'Оффер',
    count: 5,
    candidates: [
      { bar: 'violet', initials: 'ЮС', name: 'Юлия Смирнова', grade: 'Senior', salary: '340 000 ₽', interviewer: 'Готовим документы' },
    ],
  },
  {
    name: 'Принят',
    count: 4,
    candidates: [
      { bar: 'green', initials: 'АН', name: 'Анна Никитина', grade: 'Middle', salary: '230 000 ₽', interviewer: 'Выход · 19 мая', muted: true },
    ],
  },
];

const BAR_CLASS: Record<Candidate['bar'], string> = {
  violet: 'bg-(--color-action-primary)',
  orange: 'bg-(--color-orange-100)',
  blue: 'bg-(--color-blue-100)',
  green: 'bg-(--color-green-100)',
};

const GRADE_CLASS: Record<Candidate['grade'], string> = {
  Junior: 'bg-(--color-blue-12) text-(--color-blue-100)',
  Middle: 'bg-(--color-action-primary-soft) text-(--color-text-accent)',
  Senior: 'bg-(--color-orange-12) text-amber-800',
};

/**
 * Mock канбана найма HR-домена: 6 стадий, карточки кандидатов с грейдом,
 * ожидаемой ЗП, интервьюером.
 */
export function HiringPipelineMock() {
  return (
    <div
      aria-hidden
      className={cn(
        'relative overflow-hidden rounded-(--radius-3xl)',
        'border border-(--color-border-default) bg-(--color-surface-card)',
        'shadow-[0_30px_80px_-30px_rgba(125,76,207,0.30)]',
      )}
    >
      <div className="flex flex-wrap items-center gap-1.5 border-b border-(--color-border-default) bg-(--color-surface-section) px-3 py-2.5">
        <span className="h-2 w-2 rounded-full bg-red-300" />
        <span className="h-2 w-2 rounded-full bg-yellow-300" />
        <span className="h-2 w-2 rounded-full bg-green-300" />
        <div className="ml-2 flex flex-wrap items-center gap-3 text-[11px] text-(--color-text-secondary)">
          <span className="font-medium text-(--color-text-primary)">Найм · Backend · Q2</span>
          <span>42 кандидата</span>
          <span>8 в работе</span>
          <span className="rounded-md border border-(--color-border-default) bg-(--color-surface-page) px-1.5 py-0.5">
            Канбан · Список · Аналитика
          </span>
        </div>
      </div>
      <div className="grid grid-cols-6 gap-2 p-4 md:gap-2.5 md:p-5">
        {STAGES.map((stage) => (
          <div key={stage.name} className="space-y-2.5">
            <div className="flex items-center justify-between text-[11px] font-semibold text-(--color-text-primary)">
              <span className="truncate">{stage.name}</span>
              <span className="rounded-full bg-(--color-neutral-200) px-1.5 py-0.5 text-[10px]">{stage.count}</span>
            </div>
            {stage.candidates.map((c, i) => (
              <div
                key={i}
                className={cn(
                  'relative rounded-(--radius-lg) border bg-(--color-surface-page) p-2.5',
                  c.muted
                    ? 'border-(--color-border-default) opacity-60'
                    : c.hot
                      ? 'border-(--color-orange-100)/40 shadow-sm'
                      : 'border-(--color-border-default) shadow-sm',
                  c.lifted && 'translate-y-[-2px] shadow-md',
                )}
              >
                <div className={cn('mb-1.5 h-1 w-8 rounded-full', BAR_CLASS[c.bar])} />
                <div className="flex items-start gap-2">
                  <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-(--color-action-primary-soft) text-[10px] font-semibold text-(--color-text-accent)">
                    {c.initials}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[11.5px] font-semibold leading-tight text-(--color-text-primary)">{c.name}</div>
                    <span className={cn('mt-0.5 inline-flex h-3.5 items-center rounded-full px-1 text-[9px] font-medium leading-none', GRADE_CLASS[c.grade])}>
                      {c.grade}
                    </span>
                  </div>
                </div>
                <div className="mt-1.5 text-[11px] font-semibold text-(--color-text-accent)">{c.salary}</div>
                <div className="mt-0.5 truncate text-[10px] text-(--color-text-secondary)">{c.interviewer}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
