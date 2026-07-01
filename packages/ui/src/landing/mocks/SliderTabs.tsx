'use client';

import { useState } from 'react';

/**
 * SliderTabs — адаптивный таб-слайдер для лендинга (Landing-DS, node 3121:26091 и адаптивы).
 *
 * Поведение по брейкпоинтам:
 *  - Desktop (≥1024): горизонтальные табы сверху; карточка в ряд — текст слева (384px) + картинка справа (800px).
 *  - Tablet  (768–1023): табов нет; карточка колонкой — текст сверху, картинка снизу; навигация стрелками «‹ i / n ›».
 *  - Mobile  (<768): табов нет; карточка колонкой — картинка сверху, текст снизу; навигация стрелками.
 *
 * Один `activeIndex` управляется и табами (десктоп), и стрелками (планшет/мобайл).
 * Полностью prop-driven; Tailwind-классы, шрифт Roboto, брендовые цвета Kaiten.
 */

export type SliderTab = {
  /** Подпись таба (десктоп) */
  label: string;
  /** Заголовок карточки */
  title: string;
  /** Описание карточки */
  description: string;
  /** URL картинки (соотношение 1600×886) */
  image?: string;
  /** Ссылка кнопки */
  href?: string;
  /** Текст кнопки (по умолчанию «Кнопка») */
  cta?: string;
};

export type SliderTabsProps = {
  tabs?: SliderTab[];
  className?: string;
};

// Нейтральные плейсхолдеры: только структура и стили, без контента из макета.
// Реальные подписи, тексты, картинки и ссылки передаются через props.
const DEFAULT_TABS: SliderTab[] = [
  { label: 'Вкладка один', title: 'Заголовок вкладки', description: 'Короткое описание раздела: что он показывает и чем полезен пользователю.' },
  { label: 'Вкладка два', title: 'Заголовок вкладки', description: 'Короткое описание раздела: что он показывает и чем полезен пользователю.' },
  { label: 'Вкладка три', title: 'Заголовок вкладки', description: 'Короткое описание раздела: что он показывает и чем полезен пользователю.' },
];

const ROBOTO = "'Roboto', system-ui, -apple-system, sans-serif";

function ChevronLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
function ChevronRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

export function SliderTabs({ tabs = DEFAULT_TABS, className }: SliderTabsProps) {
  const [active, setActive] = useState(0);
  const total = tabs.length;
  const t = tabs[active];
  const go = (dir: number) => setActive((i) => (i + dir + total) % total);

  return (
    <div
      className={['w-full max-w-[1216px] mx-auto', className].filter(Boolean).join(' ')}
      style={{ fontFamily: ROBOTO, letterSpacing: '-0.2px' }}
    >
      {/* Tabs — desktop only */}
      <div className="mb-10 hidden justify-center lg:flex">
        <div role="tablist" className="flex h-[44px] items-center justify-center gap-1 rounded-lg bg-white p-1">
          {tabs.map((tab, i) => {
            const on = i === active;
            return (
              <button
                key={i}
                role="tab"
                aria-selected={on}
                onClick={() => setActive(i)}
                className={[
                  'flex h-9 items-center justify-center whitespace-nowrap rounded-md px-6 py-2.5 text-sm font-medium transition-colors',
                  on ? 'bg-[#7d4ccf] text-white shadow-[0_1px_2px_rgba(16,24,40,0.05)]' : 'text-[#2d2d2d] hover:bg-[#f5f5f5]',
                ].join(' ')}
                style={{ fontFamily: ROBOTO }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Card */}
      <div className="overflow-hidden rounded-2xl bg-white">
        <div className="flex flex-col lg:flex-row lg:gap-8">
          {/* Text panel */}
          <div className="order-2 flex flex-col justify-center gap-4 p-6 md:order-1 md:p-8 lg:order-none lg:w-[384px] lg:shrink-0 lg:py-12 lg:pl-12 lg:pr-0">
            <h3 className="text-lg font-semibold leading-7 text-[#2d2d2d]">{t.title}</h3>
            <div className="flex flex-col items-start gap-6">
              <p className="text-base font-normal leading-6 text-[#2d2d2d]">{t.description}</p>
              <a
                href={t.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-1 rounded-lg border border-[#e0e0e0] bg-white px-4 py-2.5 text-base font-medium text-[#7d4ccf] transition-colors hover:bg-[#f5f5f5]"
              >
                {t.cta ?? 'Кнопка'}
              </a>
            </div>
          </div>

          {/* Image panel */}
          <div className="order-1 min-w-0 flex-1 p-4 md:order-2 lg:order-none lg:w-[800px] lg:shrink-0">
            <div className="aspect-[1600/886] w-full overflow-hidden rounded-xl bg-[#f5f5f5]">
              {t.image ? (
                <img src={t.image} alt={t.title} className="h-full w-full object-cover object-top" />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-[#efe9f9] to-[#f5f5f5]" aria-hidden />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Arrows + counter — tablet & mobile */}
      <div className="mt-6 flex items-center justify-center gap-4 lg:hidden">
        <button
          type="button"
          aria-label="Предыдущий"
          onClick={() => go(-1)}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#2d2d2d] shadow-[0_1px_4px_rgba(16,24,40,0.08)] transition-colors hover:bg-[#f5f5f5]"
        >
          <ChevronLeft />
        </button>
        <span className="min-w-[44px] text-center text-sm font-medium text-[#2d2d2d]" style={{ fontFamily: ROBOTO }}>
          {active + 1} / {total}
        </span>
        <button
          type="button"
          aria-label="Следующий"
          onClick={() => go(1)}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-[#7d4ccf] text-white transition-colors hover:bg-[#6b3fbf]"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}

export default SliderTabs;
