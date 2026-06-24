const STYLE = `
.ctamain{
  --color-neutral-200:#eeeeee;
  --color-action-primary:#7d4ccf;
  --color-action-primary-soft:#efe9f9;
  --color-orange-100:#ffa100;
  --color-green-100:#4caf51;
  --color-red-100:#f44336;
  --color-blue-100:#2196f3;
  --color-red-12:#fde8e6;
  --color-green-12:#e9f5ea;
  --color-blue-12:#e4f2fd;
  --color-border-default:#dbe1e0;
  --color-surface-card:#ffffff;
  --color-surface-section:#f7f7f8;
  --color-surface-page:#ffffff;
  --color-text-primary:#2d2d2d;
  --color-text-secondary:#757575;
  --color-text-accent:#7d4ccf;
  --skel:#d6d6d9;
  --radius-2xl:16px; --radius-xl:12px; --radius-lg:8px; --radius-md:6px;
  font-family:'Inter',system-ui,-apple-system,sans-serif; color:var(--color-text-primary);
}
.ctamain *{box-sizing:border-box;}
.ctamain .frame{position:relative; width:1216px; height:780px; overflow:hidden; background:#ffffff; zoom:0.5;}
.ctamain .window{position:absolute; left:8px; top:130px; width:1200px; height:800px; display:flex; overflow:hidden; border-radius:var(--radius-2xl); border:1px solid var(--color-border-default); background:var(--color-surface-card); box-shadow:0 30px 80px -30px rgba(0,0,0,0.10);}
.ctamain .sidebar{width:300px; flex-shrink:0; display:flex; flex-direction:column; gap:14px; border-right:1px solid var(--color-border-default); background:#f5f5f5; padding:18px 16px;}
.ctamain .brand{display:flex; align-items:center; gap:8px;}
.ctamain .brand-name{font-size:18px; font-weight:600; color:var(--color-text-primary); letter-spacing:.2px;}
.ctamain .search-row{display:flex; align-items:center; gap:8px;}
.ctamain .search{flex:1; display:flex; align-items:center; gap:8px; height:36px; border-radius:var(--radius-lg); border:1px solid var(--color-border-default); background:var(--color-surface-card); padding:0 10px;}
.ctamain .plus{width:36px; height:36px; flex-shrink:0; display:flex; align-items:center; justify-content:center; border-radius:var(--radius-lg); border:1px solid var(--color-border-default); background:var(--color-surface-card);}
.ctamain .nav{display:flex; flex-direction:column; gap:6px;}
.ctamain .nav-item{display:flex; align-items:center; gap:8px; border-radius:var(--radius-lg); padding:0 10px; height:34px;}
.ctamain .nav-item.active{background:var(--color-action-primary-soft);}
.ctamain .nav-item.sub{padding-left:34px;}
.ctamain .navbar{height:8px; border-radius:9999px; background:var(--skel);}
.ctamain .navbar.active{background:var(--color-action-primary);}
.ctamain .chev{flex-shrink:0; color:#9e9e9e;}
.ctamain .ico{display:inline-block; flex-shrink:0;}
.ctamain .t-sec{color:var(--color-text-secondary);}
.ctamain .t-acc{color:var(--color-text-accent);}
.ctamain .main{position:relative; min-width:0; flex:1; display:flex; flex-direction:column;}
.ctamain .toolbar{display:flex; align-items:center; justify-content:space-between; flex-shrink:0; border-bottom:1px solid var(--color-border-default); background:var(--color-surface-section); padding:12px 16px;}
.ctamain .tool-pill{display:inline-flex; align-items:center; gap:8px; border-radius:var(--radius-lg); background:var(--color-action-primary-soft); padding:6px 12px;}
.ctamain .tool-right{display:flex; align-items:center; gap:8px;}
.ctamain .sq{height:28px; width:28px; border-radius:var(--radius-lg); background:var(--color-neutral-200);}
.ctamain .board{position:relative; padding:32px 20px; display:flex; flex-direction:column; gap:20px; background:#f3f3f3;}
.ctamain .lane-divider{height:1px; background:#e8e8e8;}
.ctamain .lane-head{margin-bottom:12px; display:flex; align-items:center; gap:8px; font-size:18px; font-weight:600; color:var(--color-text-secondary);}
.ctamain .cols{display:grid; grid-template-columns:repeat(3,1fr); gap:24px;}
.ctamain .board::before, .ctamain .board::after{content:''; position:absolute; top:0; bottom:0; width:2px; background:#e8e8e8; pointer-events:none;}
.ctamain .board::before{left:calc(33.3333% + 1.7px);}
.ctamain .board::after{left:calc(66.6667% - 3.7px);}
.ctamain .col{display:flex; flex-direction:column;}
.ctamain .colhead{margin-bottom:12px; display:flex; align-items:center; gap:8px;}
.ctamain .colhead .name{font-size:18px; font-weight:600; color:var(--color-text-primary);}
.ctamain .count{margin-left:auto; display:inline-flex; height:22px; min-width:22px; align-items:center; justify-content:center; border-radius:6px; padding:0 7px; font-size:13px; font-weight:600; background:#e6e6e6; color:#616161;}
.ctamain .spacer-head{margin-bottom:12px; height:24px;}
.ctamain .card{position:relative; overflow:hidden; border-radius:var(--radius-lg); border:1px solid var(--color-border-default); background:var(--color-surface-card); padding:14px;}
.ctamain .card.col{display:flex; flex-direction:column;}
.ctamain .cover-card{padding:0;}
.ctamain .card-cover{width:100%; height:138px;}
.ctamain .card-cover.gray-c{background:#ececec;}
.ctamain .card-cover.violet-c{background:color-mix(in srgb, var(--color-action-primary-soft) 75%, #fff); border-bottom:1px solid rgba(125,76,207,0.18);}
.ctamain .card-body{padding:14px;}
.ctamain .h155{height:155px;}
.ctamain .accent{height:6px; width:56px; border-radius:9999px; margin-bottom:10px;}
.ctamain .a-violet{background:var(--color-action-primary);}
.ctamain .a-orange{background:var(--color-orange-100);}
.ctamain .a-yellow{background:#f5c542;}
.ctamain .a-green{background:var(--color-green-100);}
.ctamain .cbar{height:9px; border-radius:9999px; background:var(--skel);}
.ctamain .blue-bar{height:9px; border-radius:9999px; background:var(--color-blue-12);}
.ctamain .mt6{margin-top:6px;}
.ctamain .mtauto{margin-top:auto;}
.ctamain .red-head{margin:-14px -14px 12px; padding:12px 14px; background:var(--color-red-12); display:flex; align-items:center; gap:8px;}
.ctamain .red-bar{height:7px; width:70px; border-radius:9999px; background:var(--color-red-100);}
.ctamain .between{margin-top:auto; display:flex; align-items:center; justify-content:space-between; padding-top:12px;}
.ctamain .pill-fire{display:inline-flex; align-items:center; gap:5px; border-radius:9999px; background:var(--color-red-12); padding:4px 9px;}
.ctamain .pill-fire .red-bar{width:42px; height:6px;}
.ctamain .usr-circle{display:inline-flex; align-items:center; justify-content:center; height:28px; width:28px; border-radius:9999px;}
.ctamain .usr-circle .ico{width:26px; height:26px;}
.ctamain .rail{width:52px; flex-shrink:0; display:flex; flex-direction:column; align-items:center; gap:16px; padding:14px 0; border-left:1px solid var(--color-border-default); background:#f5f5f5;}
.ctamain .rail .ava{height:38px; width:38px;}
.ctamain .rail-sq{height:28px; width:28px; border-radius:var(--radius-lg); background:var(--color-neutral-200); flex-shrink:0;}
.ctamain .ava{border-radius:9999px; display:inline-block; flex-shrink:0;}
.ctamain .floating{position:absolute; left:413px; top:85px; width:415px; border-radius:var(--radius-xl); border:1px solid var(--color-border-default); background:var(--color-surface-card); padding:24px; box-shadow:0 24px 60px -20px rgba(125,76,207,0.45);}
.ctamain .floating .accent{margin-bottom:18px;}
.ctamain .floating .title{font-size:23px; font-weight:600; line-height:1.22; color:var(--color-text-primary);}
.ctamain .floating .ava{height:56px; width:56px;}
.ctamain .badge-urgent{display:inline-flex; align-items:center; gap:6px; border-radius:9999px; background:var(--color-red-12); padding:7px 14px; font-size:14px; font-weight:600; color:var(--color-red-100);}
.ctamain .fl-tags{display:flex; gap:8px; margin-top:14px;}
.ctamain .tag{display:inline-flex; align-items:center; height:24px; padding:0 10px; border-radius:9999px; font-size:12px; font-weight:500; line-height:1;}
.ctamain .tag-violet{background:var(--color-action-primary-soft); color:#6a3fb5;}
.ctamain .tag-blue{background:var(--color-blue-12); color:#1976d2;}
.ctamain .tag-peach{background:#fbe2d0; color:#3a2b22;}
.ctamain .fl-assignee{display:flex; align-items:center; gap:12px; margin-top:16px;}
.ctamain .fl-name{font-size:15px; font-weight:600; color:var(--color-text-primary); line-height:1.2;}
.ctamain .fl-footer{display:flex; align-items:center; gap:18px; margin-top:16px;}
.ctamain .fl-meta{display:inline-flex; align-items:center; gap:6px; font-size:13px; font-weight:500; color:var(--color-text-secondary);}
.ctamain .fl-meta .ico{width:16px; height:16px;}
`;

const NAV_WIDTHS = ['55%', '45%', '52%', '48%', '50%', '50%'];

/** Иконка-сетка (LayoutGrid). `accent` — фиолетовая через t-acc + currentColor. */
function GridIco({ size = 18, fill = '#9e9e9e', accent = false }: { size?: number; fill?: string; accent?: boolean }) {
  const f = accent ? 'currentColor' : fill;
  return (
    <svg className={accent ? 'ico t-acc' : 'ico'} width={size} height={size} viewBox="0 0 24 24">
      <rect x="3" y="3" width="7.5" height="7.5" rx="1.4" fill={f} />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.4" fill={f} />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.4" fill={f} />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.4" fill={f} />
    </svg>
  );
}

/** Иконка-«сетка» строки дерева с шевроном слева. */
function TreeRow({ width }: { width: string }) {
  return (
    <div className="nav-item">
      <svg className="chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m9 18 6-6-6-6" />
      </svg>
      <GridIco />
      <div className="navbar" style={{ width }} />
    </div>
  );
}

/** Заголовок колонки со счётчиком. */
function ColHead({ name, done }: { name: string; done?: boolean }) {
  return (
    <div className="colhead">
      {done && (
        <svg className="ico" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--color-green-100)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      )}
      <span className="name">{name}</span>
      <span className="count">1</span>
    </div>
  );
}

/** Иконка-аватар заглушки пользователя в кружке. */
function UsrCircle() {
  return (
    <span className="usr-circle">
      <svg className="ico">
        <use href="#usr" />
      </svg>
    </span>
  );
}

/** Иконка грипа свимлейна. */
function LaneGrip() {
  return (
    <svg className="ico" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="12" r="1" /><circle cx="9" cy="5" r="1" /><circle cx="9" cy="19" r="1" />
      <circle cx="15" cy="12" r="1" /><circle cx="15" cy="5" r="1" /><circle cx="15" cy="19" r="1" />
    </svg>
  );
}

/**
 * Mock приложения Kaiten в маркетинговом стиле (вариант `pm-board-1`): сайдбар
 * с круглым логотипом, поиском и деревом досок; борд со свимлейнами «Цели» и
 * «Текущие задачи», карточками-обложками и сплошными линиями-разделителями;
 * правый рейл и всплывающая карточка «Новая задача … · Срочно» с метками и
 * ответственным. Self-contained: scoped `<style>` + inline SVG. Палитра — V01.
 */
export function CTAmainMock() {
  return (
    <div className="ctamain" aria-hidden>
      <style dangerouslySetInnerHTML={{ __html: STYLE }} />

      {/* общие SVG-символы: фото-аватар и иконки пользователя */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <symbol id="ava" viewBox="0 0 40 40">
          <clipPath id="avaClip"><circle cx="20" cy="20" r="20" /></clipPath>
          <g clipPath="url(#avaClip)">
            <rect width="40" height="40" fill="#9fb277" />
            <ellipse cx="20" cy="41" rx="15" ry="11" fill="#c9a7d6" />
            <path d="M9 19c0-7 4.5-12 11-12s11 5 11 12c0 3-.5 6-1.5 8.5-1-6-4-8.5-9.5-8.5s-8.5 2.5-9.5 8.5C9.5 25 9 22 9 19z" fill="#e3b96f" />
            <ellipse cx="20" cy="21" rx="8" ry="9" fill="#f2caa4" />
            <path d="M11.5 16c1.5-5 5-7.5 8.5-7.5s7 2.5 8.5 7.5c-2.5-3.5-5.3-5-8.5-5s-6 1.5-8.5 5z" fill="#e3b96f" />
            <g fill="#ffffff" fillOpacity="0.3" stroke="#3c3733" strokeWidth="1.2">
              <rect x="12.4" y="18.2" width="6" height="5" rx="2.2" />
              <rect x="21.6" y="18.2" width="6" height="5" rx="2.2" />
            </g>
            <path d="M18.4 20.6h3.2" stroke="#3c3733" strokeWidth="1.2" />
            <path d="M17 26q3 2 6 0" stroke="#c07f64" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          </g>
        </symbol>
        <symbol id="avaicon" viewBox="0 0 26 26">
          <path d="M13 0C20.176 0 26 5.824 26 13C26 20.176 20.176 26 13 26C5.824 26 0 20.176 0 13C0 5.824 5.824 0 13 0ZM13 2.6C7.267 2.6 2.6 7.267 2.6 13C2.6 15.3659 3.40561 17.5371 4.73154 19.2791C6.59054 17.0171 11.102 16.25 13 16.25C14.898 16.25 19.4095 17.0171 21.2685 19.2791C22.5944 17.5371 23.4 15.3659 23.4 13C23.4 7.267 18.733 2.6 13 2.6ZM13 5.2C15.522 5.2 17.55 7.228 17.55 9.75C17.55 12.272 15.522 14.3 13 14.3C10.478 14.3 8.45 12.272 8.45 9.75C8.45 7.228 10.478 5.2 13 5.2Z" fill="#b4a2e0" />
        </symbol>
        <symbol id="usr" viewBox="0 0 26 26">
          <path d="M13 0C20.176 0 26 5.824 26 13C26 20.176 20.176 26 13 26C5.824 26 0 20.176 0 13C0 5.824 5.824 0 13 0ZM13 2.6C7.267 2.6 2.6 7.267 2.6 13C2.6 15.3659 3.40561 17.5371 4.73154 19.2791C6.59054 17.0171 11.102 16.25 13 16.25C14.898 16.25 19.4095 17.0171 21.2685 19.2791C22.5944 17.5371 23.4 15.3659 23.4 13C23.4 7.267 18.733 2.6 13 2.6ZM13 5.2C15.522 5.2 17.55 7.228 17.55 9.75C17.55 12.272 15.522 14.3 13 14.3C10.478 14.3 8.45 12.272 8.45 9.75C8.45 7.228 10.478 5.2 13 5.2Z" fill="#bdbdbd" />
        </symbol>
      </svg>

      <div className="frame">
        <div className="window">
          {/* ── sidebar ── */}
          <div className="sidebar">
            <div className="brand">
              <svg width="26" height="26" viewBox="0 0 104 104" fill="none" aria-hidden="true">
                <g clipPath="url(#clip0_8356_19837)">
                  <path d="M76.8113 0H27.1887C12.1728 0 0 12.1661 0 27.1738V76.8262C0 91.8339 12.1728 104 27.1887 104H76.8113C91.8272 104 104 91.8339 104 76.8262V27.1738C104 12.1661 91.8272 0 76.8113 0Z" fill="#F11F24" />
                  <path d="M41.4148 11.3364L11.3364 41.4148C5.55453 47.1967 5.55453 56.571 11.3364 62.3529L41.4148 92.4313C47.1967 98.2132 56.571 98.2132 62.3529 92.4313L92.4313 62.3529C98.2132 56.571 98.2132 47.1967 92.4313 41.4148L62.3529 11.3364C56.571 5.55453 47.1967 5.55453 41.4148 11.3364Z" fill="#78FFC7" />
                  <path d="M51.715 77.4267C65.917 77.4267 77.43 65.9144 77.43 51.7133C77.43 37.5123 65.917 26 51.715 26C37.513 26 26 37.5123 26 51.7133C26 65.9144 37.513 77.4267 51.715 77.4267Z" fill="#7D4CCF" />
                </g>
                <defs>
                  <clipPath id="clip0_8356_19837"><rect width="104" height="104" rx="52" fill="white" /></clipPath>
                </defs>
              </svg>
              <span className="brand-name">Kaiten</span>
            </div>

            {/* search + plus */}
            <div className="search-row">
              <div className="search">
                <svg className="ico t-sec" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
              </div>
              <div className="plus">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9e9e9e" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
              </div>
            </div>

            {/* nav */}
            <div className="nav">
              <div className="nav-item">
                <svg className="chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                <svg className="ico" width="18" height="18" viewBox="0 0 24 24"><path d="M2 6a2 2 0 0 1 2-2h4l2 2.2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z" fill="#9e9e9e" /></svg>
                <div className="navbar" style={{ width: '64%' }} />
              </div>
              <div className="nav-item">
                <span style={{ width: '14px' }} />
                <svg className="ico" width="18" height="18" viewBox="0 0 24 24"><path d="M12 3.2l2.6 5.5 6 .8-4.4 4.1 1.1 5.9L12 16.7 6.7 19.5l1.1-5.9L3.4 9.5l6-.8z" fill="#9e9e9e" /></svg>
                <div className="navbar" style={{ width: '38%' }} />
              </div>
              <div className="nav-item active">
                <span style={{ width: '14px' }} />
                <GridIco accent />
                <div className="navbar active" style={{ width: '55%' }} />
              </div>
              <div className="nav-item">
                <svg className="chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                <svg className="ico" width="18" height="18" viewBox="0 0 24 24"><path d="M2 6a2 2 0 0 1 2-2h4l2 2.2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z" fill="#9e9e9e" /></svg>
                <div className="navbar" style={{ width: '34%' }} />
              </div>
              <div className="nav-item sub">
                <GridIco fill="#bdbdbd" />
                <div className="navbar" style={{ width: '46%' }} />
              </div>
              <div className="nav-item sub">
                <GridIco fill="#bdbdbd" />
                <div className="navbar" style={{ width: '33%' }} />
              </div>

              <div style={{ height: '6px' }} />

              {/* board tree rows */}
              {NAV_WIDTHS.map((w, i) => (
                <TreeRow key={i} width={w} />
              ))}
            </div>
          </div>

          {/* ── main board ── */}
          <div className="main">
            <div className="toolbar">
              <span className="tool-pill">
                <GridIco size={16} accent />
                <div style={{ height: '8px', width: '56px', borderRadius: '9999px', background: 'var(--color-action-primary)' }} />
              </span>
              <div className="tool-right">
                <span className="sq" /><span className="sq" /><span className="sq" /><span className="sq" /><span className="sq" />
              </div>
            </div>

            <div className="board">
              {/* swimlane: Цели */}
              <div>
                <div className="lane-head"><LaneGrip />Цели</div>
                <div className="cols">
                  {/* Очередь */}
                  <div>
                    <ColHead name="Очередь" />
                    <div className="card cover-card col">
                      <div className="card-cover gray-c" />
                      <div className="card-body">
                        <div className="accent a-violet" />
                        <div className="cbar" style={{ width: '80%' }} />
                        <div className="cbar mt6" style={{ width: '60%' }} />
                      </div>
                    </div>
                  </div>
                  {/* middle */}
                  <div>
                    <div className="spacer-head" />
                    <div className="card cover-card col">
                      <div className="card-cover violet-c" />
                      <div className="card-body">
                        <div className="accent a-orange" />
                        <div className="cbar" style={{ width: '72%' }} />
                        <div className="cbar mt6" style={{ width: '50%' }} />
                      </div>
                    </div>
                  </div>
                  {/* Готово */}
                  <div>
                    <ColHead name="Готово" done />
                    <div className="card col h155">
                      <div className="accent a-yellow" />
                      <div className="cbar" style={{ width: '100%' }} />
                      <div className="cbar mt6" style={{ width: '84%' }} />
                      <div className="blue-bar mt6" style={{ width: '100%' }} />
                      <UsrCircle />
                    </div>
                  </div>
                </div>
              </div>

              <div className="lane-divider" />

              {/* swimlane: Текущие задачи */}
              <div>
                <div className="lane-head"><LaneGrip />Текущие задачи</div>
                <div className="cols">
                  {/* Очередь */}
                  <div className="col">
                    <ColHead name="Очередь" />
                    <div className="card col h155">
                      <div className="red-head">
                        <span style={{ fontSize: '16px', lineHeight: 1 }}>✋</span>
                        <div className="red-bar" />
                      </div>
                      <div className="accent a-green" style={{ width: '40px' }} />
                      <div className="cbar" style={{ width: '72%' }} />
                      <div className="cbar mt6" style={{ width: '50%' }} />
                      <UsrCircle />
                    </div>
                  </div>
                  {/* В работе */}
                  <div className="col">
                    <ColHead name="В работе" />
                    <div className="card col h155">
                      <div className="accent a-orange" />
                      <div className="cbar" style={{ width: '100%' }} />
                      <div className="cbar mt6" style={{ width: '66%' }} />
                      <UsrCircle />
                    </div>
                  </div>
                  {/* Готово */}
                  <div className="col">
                    <ColHead name="Готово" done />
                    <div className="card col h155">
                      <div className="accent a-orange" />
                      <div className="cbar" style={{ width: '100%' }} />
                      <div className="cbar mt6" style={{ width: '74%' }} />
                      <div className="between">
                        <UsrCircle />
                        <span className="pill-fire">
                          <span style={{ fontSize: '12px', lineHeight: 1 }}>🔥</span>
                          <span className="red-bar" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── right rail ── */}
          <div className="rail">
            <svg className="ava"><use href="#avaicon" /></svg>
            <span className="rail-sq" /><span className="rail-sq" /><span className="rail-sq" /><span className="rail-sq" />
            <span className="rail-sq" /><span className="rail-sq" /><span className="rail-sq" />
          </div>
        </div>

        {/* ── floating card ── */}
        <div className="floating">
          <div className="accent a-violet" />
          <div className="title">Новая задача: Презентация<br />для акционеров</div>
          <div className="fl-tags">
            <span className="tag tag-peach">ООО Альфа</span>
            <span className="tag tag-violet">Презентация</span>
            <span className="tag tag-blue">Финансы</span>
          </div>
          <div className="fl-footer">
            <span className="fl-meta">
              <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
              3
            </span>
            <span className="fl-meta">
              <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>
              1
            </span>
          </div>
          <div className="fl-assignee">
            <svg className="ava" style={{ height: '40px', width: '40px' }}><use href="#avaicon" /></svg>
            <div>
              <div className="fl-name">Алексей Смирнов</div>
            </div>
            <span className="badge-urgent" style={{ marginLeft: 'auto' }}>🔥 Срочно</span>
          </div>
        </div>
      </div>
    </div>
  );
}
