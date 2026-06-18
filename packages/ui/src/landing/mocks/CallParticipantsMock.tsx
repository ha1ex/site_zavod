import { Icon } from '../../primitives/Icon';
import { cn } from '../../primitives/cn';

interface Participant {
  name: string;
  emoji: string;
  bg: string;
}

/** Цвета кружков (мягкие тона, часть с прозрачностью) — из Figma-исходника. */
const PEOPLE: Participant[] = [
  { name: 'Анна', emoji: '👩‍🦰', bg: 'rgba(250,165,159,0.6)' },
  { name: 'Владимир', emoji: '👨‍🦰', bg: 'rgba(174,232,167,0.6)' },
  { name: 'Наталья', emoji: '👩🏻', bg: '#ebd3f0' },
  { name: 'Александр', emoji: '🧑🏻', bg: 'rgba(255,210,133,0.5)' },
  { name: 'Вероника', emoji: '👱‍♀️', bg: '#afd4ff' },
  { name: 'Николай', emoji: '👱‍♂️', bg: '#caffe9' },
];

interface Tool {
  icon?: string;
  label?: string;
  active?: boolean;
  title: string;
}

const TOOLS: Tool[] = [
  { icon: 'Volume2', active: true, title: 'Звук' },
  { icon: 'Camera', active: true, title: 'Камера' },
  { icon: 'Circle', title: 'Запись' },
  { label: 'AI', title: 'AI-помощник' },
  { icon: 'Users', title: 'Участники' },
  { icon: 'Phone', active: true, title: 'Завершить' },
];

/**
 * Mock экрана звонка: сетка участников 3×2 с цветными аватарами и панель
 * управления снизу (звук, камера, запись, AI, участники, завершить).
 * Активные кнопки — фиолетовые (--color-action-primary), неактивные — серые.
 * Свёрстан в общем стиле mock-ов (см. DocEditorRichMock, ModulesMatrixMock).
 */
export function CallParticipantsMock() {
  return (
    <div
      aria-hidden
      className={cn(
        'relative overflow-hidden rounded-(--radius-3xl)',
        'border border-(--color-border-default) bg-(--color-surface-card)',
        'shadow-[0_30px_80px_-30px_rgba(125,76,207,0.30)]',
      )}
    >
      {/* window chrome */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-(--color-border-default) bg-(--color-surface-section) px-3 py-2.5">
        <span className="h-2 w-2 rounded-full bg-red-300" />
        <span className="h-2 w-2 rounded-full bg-yellow-300" />
        <span className="h-2 w-2 rounded-full bg-green-300" />
        <div className="ml-2 flex flex-wrap items-center gap-3 text-[11px] text-(--color-text-secondary)">
          <span className="font-medium text-(--color-text-primary)">Звонок · Команда</span>
          <span>6 участников</span>
        </div>
      </div>

      <div className="bg-(--color-surface-section) p-5">
        {/* participants grid */}
        <div className="grid grid-cols-3 gap-4">
          {PEOPLE.map((p) => (
            <div
              key={p.name}
              className="flex flex-col items-center gap-3.5 rounded-(--radius-lg) bg-(--color-surface-card) px-3 pb-4 pt-5"
            >
              <span
                className="flex h-[88px] w-[88px] items-center justify-center rounded-full text-[46px] leading-none"
                style={{ background: p.bg }}
              >
                {p.emoji}
              </span>
              <span className="text-[15px] text-(--color-text-primary)">{p.name}</span>
            </div>
          ))}
        </div>

        {/* control bar */}
        <div className="mt-6 flex items-center justify-center gap-3">
          {TOOLS.map((t, i) => (
            <button
              key={i}
              type="button"
              aria-label={t.title}
              className={cn(
                'inline-flex h-9 min-w-12 items-center justify-center rounded-(--radius-md) px-3 text-[13px] font-semibold',
                t.active
                  ? 'bg-(--color-action-primary) text-white'
                  : 'bg-[rgba(217,217,217,0.5)] text-[#818286]',
              )}
            >
              {t.icon ? <Icon name={t.icon} className="h-[18px] w-[18px]" strokeWidth={2} /> : t.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
