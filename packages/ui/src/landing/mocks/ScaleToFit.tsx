'use client';

import { useEffect, useRef, useState } from 'react';

interface ScaleToFitProps {
  /** Базовая ширина макета, относительно которой считается масштаб. */
  designWidth?: number;
  className?: string;
  children: React.ReactNode;
}

/**
 * Пропорционально уменьшает вложенный макет фиксированной ширины
 * (designWidth) до ширины контейнера. На широких экранах масштаб = 1,
 * при сужении окна модуль «зумится» вниз без переноса вёрстки.
 */
export function ScaleToFit({ designWidth = 800, className, children }: ScaleToFitProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState<number>();

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    const update = () => {
      const next = Math.min(1, outer.clientWidth / designWidth);
      setScale(next);
      setHeight(inner.offsetHeight * next);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(outer);
    ro.observe(inner);
    return () => ro.disconnect();
  }, [designWidth]);

  return (
    <div ref={outerRef} className={className} style={{ height }}>
      <div
        ref={innerRef}
        style={{ width: designWidth, transformOrigin: 'top left', transform: `scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  );
}
