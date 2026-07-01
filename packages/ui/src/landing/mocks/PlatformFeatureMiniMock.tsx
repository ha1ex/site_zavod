/**
 * Компактные мок-превью платформенных возможностей Kaiten под секцию «Один
 * инструмент вместо десятка сервисов» финансового лендинга. Отчёты, автоматизации
 * и чат/видео берут готовые детальные плитки из галереи FeatureMocksV01; Гант,
 * ИИ-ассистент и мобильное — рисованные карточки в том же стиле (белая карточка
 * на серой рамке). Единая высота 196px.
 */
import { FEATURE_TILES_CSS, featureTileCard } from './FeatureMocksV01';

/** Общая серая «рамка-пространство» фиксированной высоты. */
function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-[196px] w-full items-center justify-center overflow-hidden rounded-(--radius-xl) bg-[#e9eaee] p-2">
      {children}
    </div>
  );
}

/** Белая карточка 240×176 — базовая форма как у плиток галереи. */
function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-[176px] w-[240px] flex-col overflow-hidden rounded-[16px] bg-(--color-surface-card) p-3 shadow-[0_0_40px_-20px_rgba(40,40,60,0.45)]">
      {children}
    </div>
  );
}

/** Плитка из галереи FeatureMocksV01 (белая карточка 240px) на серой рамке. */
function GalleryTile({ caption }: { caption: string }) {
  const html = featureTileCard(caption);
  if (!html) return <Frame>{null}</Frame>;
  return (
    <Frame>
      <div className="fm" style={{ background: 'transparent', padding: 0, width: 'fit-content' }}>
        <style dangerouslySetInnerHTML={{ __html: FEATURE_TILES_CSS }} />
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </Frame>
  );
}

/** Гант — простые полосы по неделям (реальная диаграмма, не таблица загрузки). */
function GanttCardMock() {
  const rows: { label: string; start: number; len: number; color: string }[] = [
    { label: 'Планёрка', start: 3, len: 20, color: '#7d4ccf' },
    { label: 'Сверка', start: 16, len: 30, color: '#2b8fd6' },
    { label: 'Закрытие периода', start: 38, len: 40, color: '#3f9d4a' },
    { label: 'Отчёт', start: 66, len: 30, color: '#e0a92e' },
  ];
  return (
    <Card>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[10px] font-semibold text-(--color-text-primary)">Диаграмма Ганта</span>
        <span className="text-[7.5px] text-(--color-text-tertiary)">Загрузка команды</span>
      </div>
      <div className="mb-1.5 flex gap-1 pl-[76px]">
        {['Нед 1', 'Нед 2', 'Нед 3', 'Нед 4'].map((w) => (
          <span key={w} className="flex-1 text-[7px] text-(--color-text-tertiary)">{w}</span>
        ))}
      </div>
      <div className="relative flex flex-1 flex-col justify-center gap-2">
        {/* сетка недель */}
        <div className="pointer-events-none absolute inset-y-0 left-[76px] right-0 flex">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="flex-1 border-l border-(--color-border-default)/60" />
          ))}
        </div>
        {rows.map((r) => (
          <div key={r.label} className="relative flex items-center gap-2">
            <span className="w-[68px] shrink-0 truncate text-[8px] text-(--color-text-secondary)">{r.label}</span>
            <span className="relative h-3 flex-1 rounded-full bg-(--color-surface-page)">
              <span
                className="absolute top-0 h-3 rounded-full"
                style={{ left: `${r.start}%`, width: `${r.len}%`, background: r.color }}
              />
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

/** ИИ-ассистент — расшифровка встречи → список задач. */
function AiCardMock() {
  const tasks = ['Согласовать бюджет Q3', 'Отправить отчёт в банк', 'Назначить сверку'];
  const wave = [5, 9, 6, 12, 8, 14, 7, 11, 6, 10, 5, 9, 7, 12];
  return (
    <Card>
      <div className="mb-2 flex items-center gap-1.5">
        <span className="text-[12px] leading-none">✨</span>
        <span className="text-[10px] font-semibold text-(--color-text-accent)">ИИ-ассистент</span>
        <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-[#fbe3ec] px-1.5 py-0.5 text-[7px] font-medium text-[#c2185b]">
          ● запись
        </span>
      </div>
      <div className="mb-2 flex items-center gap-2 rounded-md bg-(--color-surface-page) px-2 py-1.5">
        <span className="flex h-5 items-end gap-[1.5px]">
          {wave.map((h, i) => (
            <span key={i} className="w-[1.5px] rounded-full bg-(--color-action-primary)/70" style={{ height: `${h}px` }} />
          ))}
        </span>
        <span className="text-[7.5px] text-(--color-text-tertiary)">Расшифровка встречи готова</span>
      </div>
      <div className="mb-1 text-[7.5px] font-medium text-(--color-text-tertiary)">Задачи из встречи</div>
      <div className="flex flex-col gap-1.5">
        {tasks.map((t) => (
          <div key={t} className="flex items-center gap-1.5 rounded border border-(--color-border-default) px-1.5 py-1">
            <span className="grid h-3 w-3 shrink-0 place-items-center rounded-full bg-(--color-action-primary) text-[7px] text-white">
              ✓
            </span>
            <span className="truncate text-[8px] text-(--color-text-primary)">{t}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

/** Мобильное приложение Kaiten — по образцу реального приложения. */
function MobileMock() {
  const cards = [
    { bar: '#7d4ccf', t: 'Согласовать платёж поставщику', due: '10 июня', avatars: ['#d9a3a3', '#8a9bc9'] },
    { bar: '#e5548a', t: 'Сверка за март', avatars: ['#8ac9a0'] },
  ];
  return (
    <Frame>
      <div className="flex h-[184px] w-[116px] flex-col overflow-hidden rounded-[14px] border-2 border-(--color-text-primary)/80 bg-(--color-surface-page) shadow-[0_12px_34px_-12px_rgba(45,45,45,0.45)]">
        {/* статус-бар */}
        <div className="flex items-center justify-between bg-(--color-surface-card) px-2 pt-1 pb-0.5 text-[5px] font-semibold text-(--color-text-primary)">
          <span>23:59</span>
          <span className="flex items-end gap-[1px]">
            <span className="h-[3px] w-[2px] rounded-[1px] bg-(--color-text-primary)" />
            <span className="h-[4px] w-[2px] rounded-[1px] bg-(--color-text-primary)" />
            <span className="h-[5px] w-[2px] rounded-[1px] bg-(--color-text-primary)" />
            <span className="ml-0.5 inline-block h-[5px] w-[8px] rounded-[1px] border border-(--color-text-primary)" />
          </span>
        </div>
        {/* шапка */}
        <div className="flex items-center gap-1 border-b border-(--color-border-default) bg-(--color-surface-card) px-2 py-1">
          <span className="h-2.5 w-2.5 rounded-[3px] bg-gradient-to-br from-(--color-action-primary) to-(--color-blue-100)" />
          <span className="text-[6.5px] font-bold text-(--color-text-primary)">Kaiten</span>
          <span className="ml-auto flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full border border-(--color-text-tertiary)" />
            <span className="rounded-[3px] bg-gradient-to-r from-[#7d4ccf] to-[#2b8fd6] px-1 py-px text-[4.5px] font-bold text-white">AI</span>
            <span className="flex flex-col gap-[1px]">
              {[0, 1, 2].map((i) => <span key={i} className="h-[1.5px] w-[1.5px] rounded-full bg-(--color-text-tertiary)" />)}
            </span>
          </span>
        </div>
        {/* тулбар */}
        <div className="flex items-center justify-between px-2 py-1">
          <span className="grid h-3.5 w-3.5 place-items-center rounded-[4px] bg-(--color-action-primary) text-[8px] font-bold leading-none text-white">+</span>
          <span className="grid h-3.5 w-3.5 place-items-center rounded-[4px] bg-(--color-surface-card)">
            <span className="flex flex-col gap-[1.5px]">
              <span className="h-[1.5px] w-2 rounded-full bg-(--color-text-tertiary)" />
              <span className="h-[1.5px] w-1.5 rounded-full bg-(--color-text-tertiary)" />
              <span className="h-[1.5px] w-1 rounded-full bg-(--color-text-tertiary)" />
            </span>
          </span>
        </div>
        {/* доска */}
        <div className="flex flex-1 flex-col gap-1 overflow-hidden px-2">
          <span className="text-[5.5px] font-semibold text-(--color-text-secondary)">В очереди</span>
          {cards.map((c) => (
            <div key={c.t} className="rounded-[5px] border border-(--color-border-default) bg-(--color-surface-card) p-1">
              <span className="block h-[2px] w-4 rounded-full" style={{ background: c.bar }} />
              <span className="mt-1 block text-[5.5px] leading-tight text-(--color-text-primary) line-clamp-2">{c.t}</span>
              <div className="mt-1 flex items-center gap-1">
                <span className="flex -space-x-1">
                  {c.avatars.map((a, i) => (
                    <span key={i} className="h-2 w-2 rounded-full border border-(--color-surface-card)" style={{ background: a }} />
                  ))}
                </span>
                {c.due && (
                  <span className="ml-auto rounded-[3px] bg-[#fbe3ec] px-1 text-[4.5px] font-semibold text-[#c2185b]">{c.due}</span>
                )}
              </div>
            </div>
          ))}
        </div>
        {/* нижняя навигация */}
        <div className="mt-1 flex items-center justify-around border-t border-(--color-border-default) bg-(--color-surface-card) px-1 py-1">
          <span className="relative">
            <span className="block h-2 w-2.5 rounded-[2px] border border-(--color-action-primary)" />
            <span className="absolute -right-1 -top-1 grid h-1.5 min-w-[6px] place-items-center rounded-full bg-(--color-action-primary) px-[1px] text-[3.5px] font-bold text-white">18</span>
          </span>
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="h-2 w-2 rounded-[2px] border border-(--color-text-tertiary)" />
          ))}
          <span className="h-2.5 w-2.5 rounded-full bg-[#d9a3a3]" />
        </div>
      </div>
    </Frame>
  );
}

const CAPTIONS: Record<string, string> = {
  'mini-feat-reports': 'Отчёты и метрики',
  'mini-feat-automation': 'Автоматизация и правила',
  'mini-feat-chat': 'Видеозвонки и конференции',
};

export function PlatformFeatureMiniMock({ variant }: { variant: string }) {
  if (variant === 'mini-feat-gantt') return <Frame><GanttCardMock /></Frame>;
  if (variant === 'mini-feat-ai') return <Frame><AiCardMock /></Frame>;
  if (variant === 'mini-feat-mobile') return <MobileMock />;
  const caption = CAPTIONS[variant];
  if (!caption) return null;
  return <GalleryTile caption={caption} />;
}
