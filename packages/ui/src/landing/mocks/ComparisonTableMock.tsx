// ComparisonTableMock.tsx — адаптивная таблица «Сравнение функций» лендинга Kaiten.
// Правила взяты из Figma Landing-DS (node 2780:38484): три брейкпоинта
// desktop / tablet / mobile, токены DS V01.
// Self-contained: scoped <style> (.kct), единственная зависимость — React.
//   • Шрифт Roboto; заголовок 36→24, SemiBold #2d2d2d.
//   • Колонка «Кайтен» — сплошная плашка #efe9f9 со скруглением сверху.
//   • Секции-аккордеоны: раскрыта #7d4ccf + шеврон вверх, свёрнута #2d2d2d + вниз.
//   • Ячейки: есть = зелёная галка #22c55e, нет = красное тире #ef4444.
// Контент prop-driven (см. SECTIONS) — легко заменить под нужное сравнение.

import * as React from "react";

const styles = `
.kct {
  --brand:#7d4ccf; --brand-12:#efe9f9;
  --ink:#2d2d2d; --muted:#5f5f5f; --tertiary:#9e9e9e;
  --border:#e5e7eb; --divider:#f0f0f0;
  --ok:#22c55e; --no:#ef4444; --white:#fff;
  --colA:156px; --colB:156px; --rowpad:13px; --feat:14px;
  font-family:"Roboto",system-ui,-apple-system,sans-serif;
  letter-spacing:-.2px; color:var(--ink);
  -webkit-font-smoothing:antialiased;
}
.kct *, .kct *::before, .kct *::after { box-sizing:border-box; margin:0; padding:0; }
.kct button { font:inherit; letter-spacing:inherit; color:inherit; background:none; border:none; cursor:pointer; }

.kct-card {
  max-width:1040px; margin:0 auto;
  background:var(--white); border-radius:24px; padding:24px 32px 20px;
}
.kct-table { position:relative; }

/* фиолетовая плашка колонки «Кайтен» во всю высоту таблицы */
.kct-band {
  position:absolute; top:0; bottom:0; right:var(--colB); width:var(--colA);
  background:var(--brand-12); border-radius:16px 16px 0 0; z-index:0; pointer-events:none;
}

.kct-row { position:relative; z-index:1; display:grid;
  grid-template-columns:minmax(0,1fr) var(--colA) var(--colB); align-items:center; }

/* ── header ── */
.kct-head { padding-top:6px; }
.kct-h-title { padding:8px 4px 18px; font-size:36px; line-height:40px; font-weight:600; color:var(--ink); }
.kct-h-prod { display:flex; align-items:center; justify-content:center; gap:8px;
  padding:18px 8px; font-size:16px; line-height:24px; font-weight:600; color:var(--ink); }
.kct-h-prod--a { font-weight:600; }
.kct-logo { width:22px; height:22px; flex:none; }

/* ── section header ── */
.kct-sec { width:100%; text-align:left; }
.kct-sec-label { display:inline-flex; align-items:center; gap:8px;
  padding:16px 4px; font-size:15px; line-height:20px; }
.kct-sec[data-open="true"] .kct-sec-label { color:var(--brand); font-weight:500; }
.kct-sec[data-open="false"] .kct-sec-label { color:var(--ink); font-weight:600; }
.kct-chev { width:16px; height:16px; flex:none; transition:transform .22s cubic-bezier(.2,0,.2,1); }
.kct-sec[data-open="true"] .kct-chev { transform:rotate(180deg); }

/* ── data row ── */
.kct-data { border-top:1px solid var(--divider); }
.kct-feat { padding:var(--rowpad) 4px; font-size:var(--feat); line-height:20px; color:var(--muted); }
.kct-cell { display:flex; align-items:center; justify-content:center; padding:var(--rowpad) 8px; }
.kct-ok { color:var(--ok); }
.kct-no { width:14px; height:2.5px; border-radius:2px; background:var(--no); display:inline-block; }

.kct-foot { padding:16px 4px 4px; font-size:13px; line-height:18px; color:var(--tertiary); }

/* ───────────── TABLET ───────────── */
@media (max-width:900px) {
  .kct { --colA:128px; --colB:128px; --rowpad:10px; }
  .kct-card { padding:20px 24px 16px; border-radius:20px; }
  .kct-h-title { font-size:24px; line-height:32px; padding:6px 4px 14px; }
  .kct-h-prod { font-size:15px; padding:14px 6px; }
}
/* ───────────── MOBILE ───────────── */
@media (max-width:560px) {
  .kct { --colA:74px; --colB:74px; --rowpad:9px; --feat:12px; }
  .kct-card { padding:16px 14px 14px; border-radius:16px; }
  .kct-h-title { font-size:22px; line-height:28px; padding:4px 2px 12px; }
  .kct-h-prod { font-size:12px; gap:5px; padding:12px 4px; }
  .kct-logo { width:16px; height:16px; }
  .kct-sec-label { font-size:13px; padding:13px 2px; }
  .kct-feat { padding-left:2px; }
  .kct-foot { font-size:12px; line-height:17px; }
}
`;

function KaitenLogo() {
  return (
    <svg className="kct-logo" viewBox="0 0 104 104" fill="none" aria-hidden="true">
      <path d="M76.81 0H27.19C12.17 0 0 12.17 0 27.17v49.66C0 91.83 12.17 104 27.19 104h49.62C91.83 104 104 91.83 104 76.83V27.17C104 12.17 91.83 0 76.81 0Z" fill="#F11F24" />
      <path d="M41.41 11.34 11.34 41.41c-5.79 5.78-5.79 15.16 0 20.94l30.07 30.08c5.79 5.78 15.16 5.78 20.94 0l30.08-30.08c5.78-5.78 5.78-15.16 0-20.94L62.35 11.34c-5.78-5.79-15.16-5.79-20.94 0Z" fill="#78FFC7" />
      <path d="M51.72 77.43c14.2 0 25.71-11.51 25.71-25.72C77.43 37.51 65.92 26 51.72 26 37.51 26 26 37.51 26 51.71c0 14.21 11.51 25.72 25.72 25.72Z" fill="#7D4CCF" />
    </svg>
  );
}

function Chevron() {
  return (
    <svg className="kct-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function Cell({ on }: { on: boolean }) {
  return on ? (
    <span className="kct-cell">
      <svg className="kct-ok" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-label="Есть">
        <path d="M20 6 9 17l-5-5" />
      </svg>
    </span>
  ) : (
    <span className="kct-cell"><span className="kct-no" aria-label="Нет" role="img" /></span>
  );
}

type Section = { title: string; rows: { name: string; a: boolean; b: boolean }[] };

const COMPETITOR = "Zendesk";

const SECTIONS: Section[] = [
  {
    title: "Задачи и проекты",
    rows: [
      { name: "Канбан- и scrum-доски", a: true, b: true },
      { name: "Диаграмма Ганта", a: true, b: false },
      { name: "Автоматизация процессов и правила", a: true, b: true },
      { name: "Связи и зависимости задач", a: true, b: false },
      { name: "Учёт времени и трудозатрат", a: true, b: true },
      { name: "Портфели проектов", a: true, b: false },
    ],
  },
  {
    title: "Поддержка и сервис-деск",
    rows: [
      { name: "Очереди обращений", a: true, b: true },
      { name: "SLA и эскалации", a: true, b: true },
      { name: "Обращения из почты и мессенджеров", a: true, b: true },
      { name: "Портал самообслуживания", a: true, b: true },
    ],
  },
  {
    title: "Документы и база знаний",
    rows: [
      { name: "Совместный редактор документов", a: true, b: false },
      { name: "База знаний и регламенты", a: true, b: true },
      { name: "История версий и комментарии", a: true, b: true },
    ],
  },
  {
    title: "Безопасность и размещение",
    rows: [
      { name: "Данные на серверах в России", a: true, b: false },
      { name: "Коробочная версия (on-premise)", a: true, b: false },
      { name: "Реестр отечественного ПО", a: true, b: false },
      { name: "Двухфакторная аутентификация и SSO", a: true, b: true },
    ],
  },
  {
    title: "Тарифы и доступ",
    rows: [
      { name: "Бесплатный бессрочный тариф", a: true, b: false },
      { name: "Без ограничения числа участников на Free", a: true, b: false },
      { name: "Открытый API и вебхуки", a: true, b: true },
    ],
  },
];

/**
 * Адаптивная таблица «Сравнение функций» Kaiten vs конкурент. Колонка «Кайтен»
 * выделена фиолетовой плашкой (#efe9f9) во всю высоту; разделы — аккордеоны на
 * useState (раскрыты по умолчанию 1-й и «Безопасность»). Брейкпоинты desktop /
 * tablet (≤900) / mobile (≤560) через media-queries. Палитра и типографика —
 * Figma Landing-DS, токены V01.
 */
export function ComparisonTableMock() {
  const [open, setOpen] = React.useState<number[]>([0, 3]);
  const toggle = (i: number) =>
    setOpen((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]));

  return (
    <section className="kct">
      <style>{styles}</style>
      <div className="kct-card">
        <div className="kct-table">
          <div className="kct-band" />

          {/* header */}
          <div className="kct-row kct-head">
            <div className="kct-h-title">Сравнение функций</div>
            <div className="kct-h-prod kct-h-prod--a"><KaitenLogo /> Кайтен</div>
            <div className="kct-h-prod">{COMPETITOR}</div>
          </div>

          {/* sections */}
          {SECTIONS.map((sec, i) => {
            const isOpen = open.includes(i);
            return (
              <React.Fragment key={i}>
                <button
                  type="button"
                  className="kct-row kct-sec"
                  data-open={isOpen}
                  aria-expanded={isOpen}
                  onClick={() => toggle(i)}
                >
                  <span className="kct-sec-label"><Chevron /> {sec.title}</span>
                  <span />
                  <span />
                </button>
                {isOpen &&
                  sec.rows.map((r, j) => (
                    <div className="kct-row kct-data" key={j}>
                      <div className="kct-feat">{r.name}</div>
                      <Cell on={r.a} />
                      <Cell on={r.b} />
                    </div>
                  ))}
              </React.Fragment>
            );
          })}
        </div>

        <p className="kct-foot">
          Сравнение приведено на основе открытых источников. Актуально на апрель 2026.
        </p>
      </div>
    </section>
  );
}

export default ComparisonTableMock;
