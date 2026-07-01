'use client';

import { useState, type ReactNode } from 'react';

/**
 * AccordionFeatureSection — переиспользуемый шаблон секции-аккордеона
 * (левая колонка: заголовок + описание + сворачиваемые пункты + CTA;
 *  правая колонка: квадратная медиа-область 592×592 с переключаемыми панелями).
 *
 * Поведение (как в исходном мокапе):
 *  - открыт всегда ровно один пункт; клик по пункту переключает и пункт, и медиа-панель;
 *  - плавная анимация высоты тела (height:0 → auto + interpolate-size), без «дёрганья»;
 *  - медиа-область — квадрат, картинка/мокап заполняет её по object-fit:cover;
 *  - адаптив: ≤900px колонки складываются в одну, медиа уходит наверх.
 *
 * Только стили и правила поведения — контент передаётся через props.
 */

export type AccordionFeatureItemProps = {
  /** Заголовок пункта */
  title: ReactNode;
  /** Тело пункта (раскрывается при открытии) */
  body: ReactNode;
  /** Медиа для правой панели: <img/>, готовый мокап или любой ReactNode */
  media: ReactNode;
};

/** Совместимый алиас (историческое имя типа пункта). */
export type AccordionFeatureItem = AccordionFeatureItemProps;

export type AccordionFeatureSectionProps = {
  /** Заголовок секции (левая колонка) */
  heading: ReactNode;
  /** Необязательное описание под заголовком */
  description?: ReactNode;
  /** Пункты аккордеона + соответствующие медиа-панели */
  items: AccordionFeatureItemProps[];
  /** Индекс изначально открытого пункта (по умолчанию 0) */
  defaultOpen?: number;
  /** Блок кнопок под пунктами (например, две CTA-кнопки) */
  cta?: ReactNode;
  /** Доп. класс на <section> */
  className?: string;
  /** id секции (для якорей/CSS) */
  id?: string;
};

const ChevronDown = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

const STYLES = `
.afs{--afs-brand:#7d4ccf;--afs-brand-12:#efe9f9;--afs-bd:#e0e0e0;--afs-t1:#2d2d2d;--afs-t2:#757575;--afs-sec:#f5f5f5;
  interpolate-size:allow-keywords;font-family:'Roboto','Inter',system-ui,-apple-system,'Segoe UI',sans-serif;color:var(--afs-t1);padding:64px 0}
.afs *{box-sizing:border-box}
.afs__container{max-width:1216px;margin:0 auto;padding:0 24px}
.afs .acc-wrap{display:grid;grid-template-columns:1fr 1fr;gap:32px;align-items:stretch}
.afs .acc{display:flex;flex-direction:column;gap:12px}
.afs .acc-intro{margin-bottom:auto}
.afs .acc-h{font-size:30px;line-height:36px;font-weight:600;color:var(--afs-t1);margin:0 0 12px}
.afs .acc-sub{font-size:16px;line-height:24px;color:var(--afs-t2);margin:0}
.afs .acc-item{background:var(--afs-sec);border:1px solid transparent;border-radius:12px;overflow:hidden;transition:border-color .2s ease,box-shadow .2s ease,background .2s ease}
.afs .acc-item.open{background:#fff;border-color:var(--afs-brand);box-shadow:0 2px 10px -4px rgba(125,76,207,.18)}
.afs .acc-head{width:100%;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:20px;margin:0;background:none;border:0;cursor:pointer;text-align:left;font-family:inherit}
.afs .acc-item.open .acc-head{padding-bottom:12px}
.afs .acc-title{font-size:18px;line-height:1.3;font-weight:400;color:var(--afs-t1);transition:color .18s}
.afs .acc-head:hover .acc-title,.afs .acc-item.open .acc-title{color:var(--afs-brand)}
.afs .acc-item.open .acc-title{font-weight:600}
.afs .acc-ic{position:relative;flex:0 0 auto;display:flex;align-items:center;justify-content:center;width:24px;height:24px;color:var(--afs-t2);transition:color .18s}
.afs .acc-item.open .acc-ic{color:var(--afs-brand)}
.afs .acc-ic svg{width:20px;height:20px;transition:transform .24s ease}
.afs .acc-item.open .acc-ic svg{transform:rotate(180deg)}
.afs .acc-body{height:0;opacity:0;overflow:hidden;transition:height .26s cubic-bezier(.2,0,.2,1),opacity .2s ease}
.afs .acc-item.open .acc-body{height:auto;opacity:1}
.afs .acc-body__inner{padding:0 20px 20px;color:var(--afs-t2);font-size:16px;line-height:24px}
/* Медиа-область — квадрат 592×592 с переключаемыми панелями */
.afs .acc-media{position:relative;justify-self:center;align-self:center;width:100%;max-width:592px;aspect-ratio:1/1;
  background:linear-gradient(180deg,#ece0ff,#cdecff);border-radius:16px;overflow:hidden;display:grid;place-items:stretch}
.afs .acc-panel{grid-area:1/1;width:100%;height:100%;display:flex;align-items:stretch;justify-content:center;
  opacity:0;visibility:hidden;transform:translateY(10px);transition:opacity .28s ease,transform .28s ease}
.afs .acc-panel.on{opacity:1;visibility:visible;transform:none}
.afs .acc-panel img{width:100%;height:100%;object-fit:cover;display:block}
.afs .acc-cta{display:flex;gap:12px;flex-wrap:wrap;margin-top:32px}
@media(max-width:900px){
  .afs{padding:40px 0}
  .afs .acc-wrap{grid-template-columns:1fr;gap:24px}
  .afs .acc-intro{margin-bottom:0}
  .afs .acc-media{order:-1;margin-bottom:8px}
  .afs .acc-h{font-size:24px;line-height:32px}
}
@media(prefers-reduced-motion:reduce){
  .afs .acc-body,.afs .acc-panel,.afs .acc-ic svg{transition:none}
}
`;

export function AccordionFeatureSection({
  heading,
  description,
  items,
  defaultOpen = 0,
  cta,
  className,
  id,
}: AccordionFeatureSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className={`afs${className ? ' ' + className : ''}`} id={id}>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="afs__container">
        <div className="acc-wrap">
          <div className="acc">
            <div className="acc-intro">
              <h2 className="acc-h">{heading}</h2>
              {description ? <p className="acc-sub">{description}</p> : null}
            </div>

            {items.map((item, i) => (
              <div className={`acc-item${i === open ? ' open' : ''}`} key={i}>
                <button
                  className="acc-head"
                  type="button"
                  aria-expanded={i === open}
                  onClick={() => setOpen(i)}
                >
                  <span className="acc-title">{item.title}</span>
                  <span className="acc-ic" aria-hidden="true">
                    <ChevronDown />
                  </span>
                </button>
                <div className="acc-body">
                  <div className="acc-body__inner">{item.body}</div>
                </div>
              </div>
            ))}

            {cta ? <div className="acc-cta">{cta}</div> : null}
          </div>

          <div className="acc-media" aria-hidden="true">
            {items.map((item, i) => (
              <div className={`acc-panel${i === open ? ' on' : ''}`} key={i}>
                {item.media}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* --- Пример использования ---
<AccordionFeatureSection
  id="control"
  heading="Заголовок секции"
  description="Необязательное описание под заголовком."
  defaultOpen={0}
  items={[
    { title: "Пункт 1", body: <p>Текст пункта 1.</p>, media: <img src="/img/1.png" alt="" /> },
    { title: "Пункт 2", body: <p>Текст пункта 2.</p>, media: <img src="/img/2.png" alt="" /> },
  ]}
  cta={
    <>
      <a className="btn btn--fill" href="#">Попробовать</a>
      <a className="btn btn--outline" href="#">Демо</a>
    </>
  }
/>
*/
