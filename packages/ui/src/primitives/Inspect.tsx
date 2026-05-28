import type { CSSProperties, ElementType, ReactNode } from 'react';

/**
 * Inspect — обёртка для разметки микро-элементов лендинга атрибутом `data-comp`.
 *
 * Используется в местах где Inspector (apps/web/components/InspectorOverlay.tsx)
 * должен ловить hover на каждый элемент массива (items, cards, plans, links и т.п.).
 *
 * Конвенция: `data-comp="<sectionId>.<arrayField>[N].<field>"` — путь до поля в
 * `content/landings/<slug>.json` через `sections[N].id`-литерал.
 *
 * Стратегия:
 *  - `as="span"` (default) — рендерит `<span style={display:contents}>` — DOM-узел
 *    есть (для querySelector / hover), но для CSS-layout прозрачен. Не ломает
 *    grid/flex родителя.
 *  - `as="li"` / `as="div"` / etc — заменяет родной тег. Используется когда
 *    обёртка пишется поверх существующего блочного элемента.
 *
 * Не использовать для одиночных полей — там просто добавь `data-comp` прямо
 * на существующий тег (h1/button/p), без обёртки.
 */
export interface InspectProps {
  name: string;
  as?: ElementType;
  className?: string;
  children: ReactNode;
}

const SPAN_STYLE: CSSProperties = { display: 'contents' };

export function Inspect({ name, as: Tag = 'span', className, children }: InspectProps) {
  const style = Tag === 'span' ? SPAN_STYLE : undefined;
  return (
    <Tag data-comp={name} className={className} style={style}>
      {children}
    </Tag>
  );
}
