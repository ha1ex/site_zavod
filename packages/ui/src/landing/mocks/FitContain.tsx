'use client';

import { useEffect, useRef, useState } from 'react';

interface FitContainProps {
  className?: string;
  children: React.ReactNode;
}

/**
 * Пропорционально масштабирует вложенный мок так, чтобы он ЦЕЛИКОМ помещался
 * в контейнер (contain по обеим осям) и был отцентрирован. В отличие от
 * `ScaleToFit` (только ширина) учитывает и высоту — для квадратных полей
 * (напр. градиентное поле `AccordionFeatureSection`), где моки разной ширины
 * и высоты должны выглядеть ровно и единообразно. `transform` не меняет
 * layout-бокс, поэтому натуральные размеры берём из offsetWidth/offsetHeight.
 * Пересчитываем и по ResizeObserver, и несколькими кадрами после монтирования —
 * панели аккордеона скрыты (visibility:hidden) и «доезжают» по размеру не сразу.
 */
export function FitContain({ className, children }: FitContainProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    const update = () => {
      const nw = inner.offsetWidth;
      const nh = inner.offsetHeight;
      const ow = outer.clientWidth;
      const oh = outer.clientHeight;
      if (!nw || !nh || !ow || !oh) return;
      const next = Math.min(1, ow / nw, oh / nh);
      setScale((prev) => (Math.abs(prev - next) > 0.001 ? next : prev));
    };

    update();
    // несколько кадров — поймать реальные размеры после reflow скрытой панели
    let frame = 0;
    let raf = 0;
    const tick = () => {
      update();
      if (++frame < 8) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const ro = new ResizeObserver(update);
    ro.observe(outer);
    ro.observe(inner);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <div
      ref={outerRef}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <div
        ref={innerRef}
        style={{ flex: '0 0 auto', transform: `scale(${scale})`, transformOrigin: 'center center' }}
      >
        {children}
      </div>
    </div>
  );
}
