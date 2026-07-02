import type { ReactNode } from 'react';

/**
 * CTA secondary block (финальный CTA-блок лендинга, «Попробуйте …»).
 *
 * Шаблон блока: сохранены СТИЛИ, ТИПОГРАФИКА и ПРАВИЛА АДАПТАЦИИ исходной
 * секции `.fcta`, а текст, кнопки и «интерфейс» справа вынесены в пропсы —
 * контент может меняться. За интерфейсом — градиентный засвет (blur-glow).
 *
 * Раскладка (порт с лендинга):
 *  - desktop ≥1280: две колонки (текст слева, интерфейс справа, 520px), текст влево;
 *  - планшет ≤1279: одна колонка по центру, кнопки по центру, интерфейс по центру;
 *  - мобилка ≤767: кнопки в столбик и Hug (ширина по контенту), заголовок/текст влево,
 *    H2 → xl, абзац → md, паддинги/скругление контейнера меньше.
 *
 * Градиентный засвет: `.fcta__blur` — размытый градиент (`blur(200px)`) под слоем
 * интерфейса, даёт мягкое свечение за мокапом.
 *
 * Self-contained: scoped `<style>` под `.cta-secondary`, палитра V01.
 */

export interface CTAButton {
  label: string;
  href?: string;
  /** 'fill' — основная (фиолетовая), 'outline' — вторичная (обводка). */
  variant?: 'fill' | 'outline';
}

export interface CTAsecondaryMockProps {
  /** Заголовок блока. */
  title?: string;
  /** Подзаголовок. */
  subtitle?: string;
  /** Кнопки (1–2). По умолчанию — основная + вторичная. */
  buttons?: CTAButton[];
  /** Интерфейс справа: любой мокап (напр. <CTAmainMock/>). Без него — плейсхолдер-борд. */
  visual?: ReactNode;
}

const STYLE = `
.cta-secondary{
  --sp-1:4px; --sp-3:12px; --sp-4:16px; --sp-5:20px; --sp-6:24px; --sp-8:32px; --sp-10:40px; --sp-12:48px; --sp-16:64px;
  --radius-3xl:24px; --radius-lg:8px;
  --fw-med:500; --fw-semi:600; --ls:0;
  --brand-12:#efe9f9; --brand-100:#7d4ccf; --brand-hover:#6a3cbf; --brand-48:rgba(125,76,207,.48);
  --border-default:#dbe1e0; --text-title:#2d2d2d; --skel:#e6e6ea; --skel-strong:#d6d6d9; --surface-section:#f7f7f8;
  font-family:'Inter',system-ui,-apple-system,sans-serif; color:var(--text-title);
  display:block; width:100%; padding:48px var(--sp-4); box-sizing:border-box;
}
.cta-secondary, .cta-secondary *{box-sizing:border-box;}
.cta-secondary .fcta{position:relative; overflow:hidden; max-width:1216px; margin:0 auto; background:var(--brand-12); border-radius:var(--radius-3xl); text-align:left; padding:var(--sp-16) var(--sp-12) var(--sp-12);}
.cta-secondary .fcta__blur{position:absolute; width:786px; height:744px; left:55%; top:-120px; border-radius:9999px; background:linear-gradient(-90deg,#e298ff,#6fe5ff); filter:blur(200px); opacity:.5; pointer-events:none; z-index:0;}
.cta-secondary .fcta__in{position:relative; z-index:1; display:grid; grid-template-columns:minmax(0,1fr) 520px; gap:var(--sp-10); align-items:center;}
.cta-secondary .fcta__copy{max-width:560px; align-self:start;}
.cta-secondary .fcta h2{font-size:30px; line-height:36px; font-weight:var(--fw-semi); margin:0 0 var(--sp-4);}
.cta-secondary .fcta p{font-size:18px; line-height:28px; color:#2d2d2d; margin:0 0 var(--sp-8);}
.cta-secondary .fcta__cta{display:flex; gap:var(--sp-3); justify-content:flex-start; flex-wrap:nowrap;}
.cta-secondary .btn{display:inline-flex; align-items:center; justify-content:center; gap:var(--sp-1); font-family:inherit; font-weight:var(--fw-med); letter-spacing:var(--ls); border-radius:var(--radius-lg); border:none; cursor:pointer; white-space:nowrap; text-decoration:none; height:48px; padding:var(--sp-3) var(--sp-5); font-size:16px; line-height:24px; transition:background .18s, border-color .18s, color .18s;}
.cta-secondary .btn--fill{background:var(--brand-100); color:#fff;}
.cta-secondary .btn--fill:hover{background:var(--brand-hover);}
.cta-secondary .btn--outline{background:#fff; border:1px solid var(--border-default); color:var(--brand-100);}
.cta-secondary .btn--outline:hover{background:var(--brand-12); border-color:var(--brand-48); color:var(--brand-hover);}
.cta-secondary .fcta__visual{justify-self:end; align-self:end; width:520px; max-width:100%; overflow:visible; margin-bottom:0; text-align:left;}
.cta-secondary .cta-window{width:100%; background:#fff; border-radius:16px; border:1px solid var(--border-default); box-shadow:0 24px 60px -28px rgba(45,45,45,.28); overflow:hidden;}
.cta-secondary .cta-window__bar{height:38px; display:flex; align-items:center; gap:6px; padding:0 14px; border-bottom:1px solid var(--border-default);}
.cta-secondary .cta-window__bar span{width:9px; height:9px; border-radius:9999px; background:var(--skel);}
.cta-secondary .cta-board{display:grid; grid-template-columns:repeat(3,1fr); gap:12px; padding:16px;}
.cta-secondary .cta-col{display:flex; flex-direction:column; gap:10px;}
.cta-secondary .cta-colhd{height:8px; width:60%; border-radius:4px; background:var(--skel-strong);}
.cta-secondary .cta-card{background:var(--surface-section); border:1px solid #eee; border-radius:8px; padding:10px; display:flex; flex-direction:column; gap:7px;}
.cta-secondary .cta-line{height:6px; border-radius:3px; background:var(--skel);}
.cta-secondary .cta-line.a{width:80%;} .cta-secondary .cta-line.b{width:55%;}
.cta-secondary .cta-accent{height:6px; width:40%; border-radius:3px; background:var(--brand-100); opacity:.55;}
@media(max-width:1279px){
  .cta-secondary .fcta__in{grid-template-columns:minmax(0,1fr); text-align:center; gap:var(--sp-8); justify-items:center;}
  .cta-secondary .fcta__copy{max-width:680px; margin:0 auto; min-width:0;}
  .cta-secondary .fcta__cta{justify-content:center; flex-wrap:wrap;}
  .cta-secondary .fcta__visual{justify-self:center; align-self:auto; width:100%; max-width:520px; text-align:center;}
}
@media(max-width:767px){
  .cta-secondary{padding:32px var(--sp-4);}
  .cta-secondary .fcta{padding:var(--sp-12) var(--sp-6) 0; border-radius:12px;}
  .cta-secondary .fcta h2{font-size:20px; line-height:28px;}
  .cta-secondary .fcta p{font-size:16px; line-height:24px;}
  .cta-secondary .fcta__copy{text-align:left;}
  .cta-secondary .fcta__cta{flex-direction:column; width:100%; max-width:360px; margin-inline:auto; align-items:center;}
  .cta-secondary .fcta__cta .btn{width:auto;}
}
`;

const DEFAULT_BUTTONS: CTAButton[] = [
  { label: 'Основное действие', variant: 'fill', href: '#' },
  { label: 'Второе действие', variant: 'outline', href: '#' },
];

/** Плейсхолдер «интерфейса» — лёгкий скелет доски. Заменяется пропом `visual`. */
function PlaceholderBoard() {
  const cols = [
    [true, false, false],
    [false, true, false],
    [false, false, true],
  ];
  return (
    <div className="cta-window" aria-hidden="true">
      <div className="cta-window__bar"><span /><span /><span /></div>
      <div className="cta-board">
        {cols.map((cards, c) => (
          <div className="cta-col" key={c}>
            <div className="cta-colhd" />
            {cards.map((accent, i) => (
              <div className="cta-card" key={i}>
                {accent ? <div className="cta-accent" /> : <div className="cta-line a" />}
                <div className="cta-line b" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function CTAsecondaryMock({
  title = 'Заголовок призыва к действию',
  subtitle = 'Короткий поясняющий подзаголовок под заголовком CTA-блока.',
  buttons = DEFAULT_BUTTONS,
  visual,
}: CTAsecondaryMockProps) {
  return (
    <section className="cta-secondary" aria-label="Призыв к действию">
      <style dangerouslySetInnerHTML={{ __html: STYLE }} />
      <div className="fcta">
        <div className="fcta__blur" aria-hidden="true" />
        <div className="fcta__in">
          <div className="fcta__copy">
            <h2>{title}</h2>
            {subtitle ? <p>{subtitle}</p> : null}
            <div className="fcta__cta">
              {buttons.map((b, i) => (
                <a key={i} className={`btn btn--lg btn--${b.variant ?? (i === 0 ? 'fill' : 'outline')}`} href={b.href ?? '#'}>
                  {b.label}
                </a>
              ))}
            </div>
          </div>
          <div className="fcta__visual">
            {visual ?? <PlaceholderBoard />}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTAsecondaryMock;
