'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * Review slider (мокап секции отзывов «Отзывы клиентов»).
 *
 * Шаблон для наполнения: сохранены только СТИЛИ и ПОВЕДЕНИЕ исходной секции
 * лендинга (карусель `.revx` / карточки `.otz`), а текст, логотипы и фото
 * вынесены в пропсы. Передай массив `reviews` — и слайдер наполнится.
 *
 * Поведение слайдера (порт с лендинга):
 *  - листание по одной карточке кнопками ‹ ›;
 *  - шаг = реальное расстояние между соседними карточками (учитывает gap);
 *  - число видимых карточек и предел прокрутки считаются от ширины окна;
 *  - крайние состояния кнопок (disabled в начале/конце), пересчёт на resize.
 *
 * Адаптив: desktop — карточки 384px; ≤768px — 318px с «выглядыванием»
 * следующей карточки справа и левым отступом 16px; заголовок влево на мобилке.
 * Self-contained: scoped `<style>` под `.revx-mock`, палитра V01.
 */

export interface Review {
  /** Логотип компании: <img/>, инлайновый <svg/> или просто текст-название. */
  logo?: ReactNode;
  /** Текст отзыва (уже с «ёлочками», если нужно). */
  quote: string;
  /** Имя автора. */
  name: string;
  /** Должность / роль автора. */
  role: string;
  /** URL фото-аватара (если есть). */
  avatar?: string;
  /** Буква-заглушка под аватар, если фото нет. */
  avatarInitial?: string;
  /** Цвет фона аватара-заглушки. */
  avatarBg?: string;
  /** Ссылка «Читать кейс» (если есть — рисуется кнопка). */
  caseUrl?: string;
  /** Подпись кнопки-ссылки. */
  caseLabel?: string;
}

export interface ReviewSliderProps {
  /** Заголовок секции. */
  title?: string;
  /** Подзаголовок под заголовком (опционально). */
  subtitle?: string;
  /** Данные отзывов. Если не передать — покажутся нейтральные плейсхолдеры. */
  reviews?: Review[];
}

const STYLE = `
.revx-mock{
  --container:1216px;
  --sp-3:12px; --sp-4:16px; --sp-5:20px; --sp-6:24px; --sp-8:32px; --sp-12:48px;
  --radius-2xl:16px; --radius-lg:8px;
  --fw-med:500; --fw-semi:600;
  --brand-100:#7d4ccf; --brand-hover:#6a3cbf; --brand-48:rgba(125,76,207,.48); --brand-12:#efe9f9;
  --border-default:#dbe1e0; --text-title:#2d2d2d; --text-secondary:#757575; --surface-section:#f7f7f8;
  font-family:'Inter',system-ui,-apple-system,sans-serif; color:var(--text-title);
  background:var(--surface-section); padding:48px 0;
}
.revx-mock *{box-sizing:border-box;}
.revx-mock .revx__in{width:100%; max-width:var(--container); margin:0 auto; padding:0 var(--sp-4); display:flex; flex-direction:column; gap:var(--sp-12); align-items:center;}
.revx-mock .revx__head{display:flex; flex-direction:column; gap:var(--sp-4); align-items:center; text-align:center; width:100%;}
.revx-mock .revx__head h2{font-size:36px; line-height:40px; font-weight:var(--fw-semi); color:var(--text-title); margin:0;}
.revx-mock .revx__head p{font-size:16px; line-height:24px; color:var(--text-title); max-width:680px; margin:0;}
.revx-mock .revx__wrap{width:100%; overflow:hidden; position:relative;}
.revx-mock .revx__track{display:flex; gap:var(--sp-8); align-items:stretch; width:max-content; transition:transform .35s ease;}
.revx-mock .otz{flex-shrink:0; width:384px; height:460px; background:#fff; border-radius:var(--radius-2xl); padding:var(--sp-6); display:flex; flex-direction:column; gap:var(--sp-6);}
.revx-mock .otz__top{display:flex; flex-direction:column; gap:var(--sp-5); flex:1; min-height:0;}
.revx-mock .otz__hd{display:flex; align-items:flex-start; justify-content:space-between; gap:var(--sp-4);}
.revx-mock .otz__co{font-size:18px; line-height:28px; font-weight:var(--fw-semi); color:var(--text-title);}
.revx-mock .otz__co img{height:60px; width:auto; max-width:180px; object-fit:contain; display:block;}
.revx-mock .otz__q{flex-shrink:0; width:79px; height:60px; color:#f3f4f6;}
.revx-mock .otz__text{font-size:16px; line-height:24px; color:var(--text-secondary); flex:1; display:flex; align-items:center;}
.revx-mock .otz__author{display:flex; gap:var(--sp-4); align-items:center;}
.revx-mock .otz__av{position:relative; overflow:hidden; width:56px; height:56px; border-radius:9999px; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:20px; font-weight:var(--fw-semi); color:#fff; background:#c4b5e0;}
.revx-mock .otz__av img{position:absolute; inset:0; width:100%; height:100%; object-fit:cover;}
.revx-mock .otz__who{display:flex; flex-direction:column; min-width:0;}
.revx-mock .otz__name{font-size:16px; line-height:24px; font-weight:var(--fw-med); color:var(--text-title);}
.revx-mock .otz__role{font-size:16px; line-height:24px; color:var(--text-secondary);}
.revx-mock .otz__btn{align-self:flex-start; display:inline-flex; align-items:center; border:1px solid var(--border-default); border-radius:var(--radius-lg); padding:10px var(--sp-4); font-size:16px; line-height:24px; font-weight:var(--fw-med); color:var(--brand-100); background:#fff; text-decoration:none; cursor:pointer; transition:background .18s, border-color .18s, color .18s;}
.revx-mock .otz__btn:hover{border-color:var(--brand-48); background:var(--brand-12); color:var(--brand-hover);}
.revx-mock .revx__nav{display:flex; gap:14px; align-items:center;}
.revx-mock .revx__navbtn{width:48px; height:48px; border-radius:9999px; border:1px solid var(--border-default); background:#fff; display:flex; align-items:center; justify-content:center; cursor:pointer; color:var(--brand-100); transition:background .18s, border-color .18s, color .18s, box-shadow .18s;}
.revx-mock .revx__navbtn:hover:not(:disabled){background:var(--brand-12); border-color:var(--brand-48); color:var(--brand-hover);}
.revx-mock .revx__navbtn:focus-visible{outline:none; box-shadow:0 0 0 4px rgba(152,162,179,.14);}
.revx-mock .revx__navbtn:disabled{background:#fff; border-color:var(--border-default); color:var(--border-default); cursor:default;}
.revx-mock .revx__navbtn svg{width:24px; height:24px;}
@media(min-width:1280px){ .revx-mock .revx__in{max-width:calc(1216px + 64px); padding:0 32px;} }
@media(min-width:768px) and (max-width:1279px){ .revx-mock .revx__in{gap:var(--sp-8);} }
@media(max-width:768px){
  .revx-mock .revx__in{gap:var(--sp-8); padding:0 0 0 var(--sp-4);}
  .revx-mock .revx__head{align-items:flex-start; text-align:left; margin-inline:0;}
  .revx-mock .revx__head h2{font-size:24px; line-height:32px;}
  .revx-mock .revx__track{gap:var(--sp-3);}
  .revx-mock .otz{width:318px; max-width:calc(100vw - 64px); height:auto;}
  .revx-mock .otz__co{font-size:16px; line-height:24px;}
  .revx-mock .otz__co img{height:50px; max-width:150px;}
}
`;

/** Декоративные «ёлочки»-кавычки в шапке карточки. */
function QuoteMark() {
  return (
    <svg className="otz__q" viewBox="0 0 79 60" fill="none" aria-hidden="true">
      <path
        d="M15.9909 0C21.5599 0 26.1742 1.84 29.8338 5.52C33.3344 9.2 35.0846 14.48 35.0846 21.36C35.0846 28.72 33.0161 36 28.8792 43.2C24.5831 50.4 18.6163 56 10.9789 60L5.48943 51.6C13.7634 45.84 18.6959 38.56 20.287 29.76C18.855 30.4 17.1843 30.72 15.2749 30.72C10.8197 30.72 7.16012 29.28 4.29608 26.4C1.43203 23.52 0 19.84 0 15.36C0 10.88 1.51159 7.2 4.53475 4.32C7.55791 1.44 11.3766 0 15.9909 0ZM59.9064 0C65.4753 0 70.0896 1.84 73.7493 5.52C77.2498 9.2 79 14.48 79 21.36C79 28.72 76.9315 36 72.7946 43.2C68.4985 50.4 62.5317 56 54.8943 60L49.4048 51.6C57.6788 45.84 62.6113 38.56 64.2024 29.76C62.7704 30.4 61.0997 30.72 59.1903 30.72C54.7352 30.72 51.0755 29.28 48.2115 26.4C45.3474 23.52 43.9154 19.84 43.9154 15.36C43.9154 10.88 45.427 7.2 48.4502 4.32C51.4733 1.44 55.2921 0 59.9064 0Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Логотип: строка-URL → <img>, строка-текст → как есть, ReactNode → как есть. */
function renderLogo(logo: ReactNode) {
  if (typeof logo === 'string') {
    const isImg = /^https?:\/\//.test(logo) || logo.includes('/') || /\.(png|jpe?g|svg|webp|gif)$/i.test(logo);
    return isImg ? <img src={logo} alt="" onError={(e) => e.currentTarget.remove()} /> : logo;
  }
  return logo;
}

/** Нейтральные плейсхолдеры — заменяются реальными отзывами через проп `reviews`. */
const PLACEHOLDER_REVIEWS: Review[] = Array.from({ length: 4 }, (_, i) => ({
  logo: 'ЛОГО',
  quote: '«Короткая цитата клиента о пользе продукта — 2–3 предложения. Здесь будет реальный текст отзыва при наполнении шаблона.»',
  name: 'Имя Фамилия',
  role: 'Должность, компания',
  avatarInitial: 'И',
  avatarBg: ['#c98a8a', '#8ac9a0', '#b88ac9', '#8aa8c9'][i % 4],
  caseUrl: '#',
  caseLabel: 'Читать кейс',
}));

const GAP = 32;

export function ReviewSlider({ title = 'Заголовок секции отзывов', subtitle, reviews }: ReviewSliderProps) {
  const data = reviews && reviews.length ? reviews : PLACEHOLDER_REVIEWS;

  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);
  const [maxI, setMaxI] = useState(0);

  const step = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 0;
    const cards = track.children;
    const first = cards[0];
    if (!first) return 0;
    const second = cards[1];
    if (second) {
      return second.getBoundingClientRect().left - first.getBoundingClientRect().left;
    }
    return first.getBoundingClientRect().width + GAP;
  }, []);

  const maxIdx = useCallback(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return 0;
    const s = step();
    if (!s) return 0;
    const vis = Math.max(1, Math.floor((wrap.clientWidth + GAP) / s));
    return Math.max(0, track.children.length - vis);
  }, [step]);

  const apply = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const m = maxIdx();
    const clamped = Math.min(idx, m);
    if (clamped !== idx) setIdx(clamped);
    track.style.transform = `translateX(-${clamped * step()}px)`;
    setMaxI(m);
  }, [idx, maxIdx, step]);

  useEffect(() => {
    apply();
  }, [apply, data.length]);

  useEffect(() => {
    const onResize = () => apply();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [apply]);

  return (
    <section className="revx-mock" aria-label="Отзывы клиентов">
      <style dangerouslySetInnerHTML={{ __html: STYLE }} />
      <div className="revx__in">
        <div className="revx__head">
          <h2>{title}</h2>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>

        <div className="revx__wrap" ref={wrapRef}>
          <div className="revx__track" ref={trackRef}>
            {data.map((r, i) => (
              <div className="otz" key={i}>
                <div className="otz__top">
                  <div className="otz__hd">
                    <div className="otz__co">{renderLogo(r.logo)}</div>
                    <QuoteMark />
                  </div>
                  <p className="otz__text">{r.quote}</p>
                </div>

                <div className="otz__author">
                  <span className="otz__av" style={r.avatarBg ? { background: r.avatarBg } : undefined}>
                    {r.avatar ? <img src={r.avatar} alt={r.name} onError={(e) => e.currentTarget.remove()} /> : null}
                    {r.avatarInitial ?? r.name.charAt(0)}
                  </span>
                  <span className="otz__who">
                    <span className="otz__name">{r.name}</span>
                    <span className="otz__role">{r.role}</span>
                  </span>
                </div>

                {r.caseUrl ? (
                  <a className="otz__btn" href={r.caseUrl}>{r.caseLabel ?? 'Читать кейс'}</a>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        {/* Листалки нужны только когда отзывов больше 3 (иначе всё видно сразу). */}
        {data.length > 3 ? (
          <div className="revx__nav" role="group" aria-label="Листать отзывы">
            <button
              type="button"
              className="revx__navbtn"
              aria-label="Предыдущий отзыв"
              disabled={idx <= 0}
              onClick={() => { if (idx > 0) setIdx(idx - 1); }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
            </button>
            <button
              type="button"
              className="revx__navbtn"
              aria-label="Следующий отзыв"
              disabled={idx >= maxI}
              onClick={() => { if (idx < maxIdx()) setIdx(idx + 1); }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default ReviewSlider;
