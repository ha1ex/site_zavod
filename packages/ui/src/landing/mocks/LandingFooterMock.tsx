'use client';

const STYLE = `
.kf {
  --bg:#2d2d2d; --card:#424242; --news:#efe9f9;
  --white:#fff; --muted:#bdbdbd; --muted2:#a3a3a3;
  --violet:#7d4ccf; --violet48:rgba(125,76,207,.48);
  --border:#d1d5db; --placeholder:#9ca3af; --ink:#2d2d2d; --social:#9e9e9e;
  background:var(--bg);
  color:var(--white);
  font-family:'Inter',system-ui,-apple-system,sans-serif;
  letter-spacing:-.2px;
  -webkit-font-smoothing:antialiased;
}
.kf *, .kf *::before, .kf *::after { box-sizing:border-box; margin:0; padding:0; }
.kf a { color:inherit; text-decoration:none; }
.kf p { line-height:20px; }
.kf-inner {
  max-width:1216px; margin:0 auto; padding:64px 24px 24px;
  display:flex; flex-direction:column; gap:32px;
}
.kf h4 { font-size:16px; line-height:24px; font-weight:600; color:var(--white); }
.kf-links { display:flex; flex-direction:column; gap:12px; font-size:14px; line-height:20px; }
.kf-links a { color:var(--muted2); transition:color .12s cubic-bezier(.2,0,.2,1); }
.kf-links a:hover { color:var(--white); }

/* ---------- TOP ---------- */
.kf-top { display:grid; grid-template-columns:1fr 1fr; gap:32px; align-items:start; }
.kf-nav {
  display:grid; gap:32px;
  grid-template-columns:repeat(3,1fr);
  grid-template-areas:"company resources capabilities" "compare compare compare";
  align-content:start;
}
.kf-nav .col-company { grid-area:company; }
.kf-nav .col-resources { grid-area:resources; }
.kf-nav .col-capabilities { grid-area:capabilities; }
.kf-nav .col-compare { grid-area:compare; }
.kf-col { display:flex; flex-direction:column; gap:16px; }
.kf-compare-tags { display:flex; flex-wrap:wrap; gap:12px; font-size:14px; line-height:20px; color:var(--muted); }
.kf-compare-tags a { transition:color .12s cubic-bezier(.2,0,.2,1); }
.kf-compare-tags a:hover { color:var(--white); }

/* cards cluster */
.kf-cards {
  display:grid; gap:32px;
  grid-template-columns:280px 1fr; grid-template-rows:auto 1fr;
  grid-template-areas:"soc sub" "art sub";
}
.kf-card { background:var(--card); border-radius:16px; padding:16px; }
.kf-card-soc { grid-area:soc; }
.kf-card-art { grid-area:art; }
.kf-card-sub { grid-area:sub; }
.kf-card-soc .desc { font-size:14px; line-height:20px; color:var(--muted); margin-top:10px; }
.kf-soc-row { display:flex; gap:20px; margin-top:20px; }
.kf-soc-item { display:flex; align-items:center; gap:12px; flex:1 1 0; min-width:0; }
.kf-soc-item .label { font-size:14px; line-height:20px; font-weight:500; }
.kf-ico { flex:none; width:32px; height:32px; border-radius:8px; background:var(--violet48); display:flex; align-items:center; justify-content:center; }
.kf-ico svg { display:block; }
.kf-art-list { display:flex; flex-direction:column; gap:12px; margin-top:12px; }
.kf-art-item { display:flex; align-items:center; gap:12px; }
.kf-art-item .t { font-size:14px; line-height:20px; color:var(--muted); min-width:0; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }

/* newsletter */
.kf-card-sub { position:relative; overflow:hidden; background:var(--news); color:var(--ink); display:flex; flex-direction:column; gap:24px; }
.kf-card-sub::before { content:""; position:absolute; right:-120px; top:-160px; width:360px; height:360px; border-radius:50%; background:radial-gradient(circle, rgba(125,76,207,.20), rgba(125,76,207,0) 70%); pointer-events:none; }
.kf-sub-head { position:relative; display:flex; flex-direction:column; gap:16px; }
.kf-sub-title { font-size:16px; line-height:24px; font-weight:600; color:var(--violet); }
.kf-sub-desc { font-size:14px; line-height:20px; color:var(--ink); }
.kf-sub-form { display:flex; flex-direction:column; gap:12px; margin-top:16px; }
.kf-input { height:44px; border:1px solid var(--border); background:#fff; border-radius:8px; padding:10px 16px; font:inherit; font-size:14px; color:var(--ink); letter-spacing:-.2px; }
.kf-input::placeholder { color:var(--placeholder); }
.kf-btn { height:44px; border:none; border-radius:8px; background:var(--violet); color:#fff; font:inherit; font-size:16px; line-height:24px; font-weight:500; letter-spacing:-.2px; cursor:pointer; transition:background .12s cubic-bezier(.2,0,.2,1); }
.kf-btn:hover { background:#6c3fbb; }
.kf-consents { position:relative; display:flex; flex-direction:column; gap:16px; }
.kf-consent { display:flex; gap:8px; align-items:flex-start; }
.kf-consent .cb { flex:none; width:16px; height:16px; border-radius:4px; border:1px solid var(--border); background:#fff; position:relative; }
.kf-consent .cb.on { background:var(--violet); border-color:var(--violet); }
.kf-consent .cb.on::after { content:""; position:absolute; left:5px; top:2px; width:4px; height:8px; border:solid #fff; border-width:0 2px 2px 0; transform:rotate(45deg); }
.kf-consent p { font-size:12px; line-height:16px; color:var(--ink); }
.kf-consent .lnk { color:var(--violet); }

/* ---------- MID ---------- */
.kf-mid { display:grid; grid-template-columns:1fr 1fr; gap:32px; align-items:start; }
.kf-status { display:flex; flex-direction:column; gap:16px; }
.kf-status p { font-size:14px; line-height:20px; color:var(--muted); }
.kf-status p b { color:var(--white); font-weight:500; }
.kf-more { display:inline-flex; align-items:center; gap:8px; font-size:14px; font-weight:500; color:var(--white); }
.kf-legal-block { display:flex; flex-direction:column; gap:16px; }
.kf-legal-grid { display:grid; grid-template-columns:auto auto 1fr; gap:32px; font-size:14px; line-height:20px; }
.kf-legal-grid .lab { font-weight:500; color:var(--white); }
.kf-legal-cell .val { color:var(--muted); margin-top:8px; }

/* ---------- BOTTOM ---------- */
.kf-bottom { display:flex; flex-direction:column; gap:20px; }
.kf-credits { display:flex; align-items:center; justify-content:space-between; gap:32px; flex-wrap:wrap; }
.kf-brand { display:flex; align-items:center; gap:32px; }
.kf-logo { display:flex; align-items:center; }
.kf-logo svg { height:40px; width:auto; display:block; }
.kf-contacts { display:flex; align-items:center; gap:32px; }
.kf-contact { display:flex; align-items:center; gap:10px; font-size:16px; line-height:24px; font-weight:500; }
.kf-partner { display:flex; align-items:center; gap:12px; }
.kf-partner .word { font-size:16px; font-weight:600; }
.kf-partner .sk { display:flex; align-items:center; gap:8px; }
.kf-partner .sk-mark { width:30px; height:30px; border:1.5px solid #fff; border-radius:7px; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:600; }
.kf-partner .sk-name { font-size:16px; font-weight:500; }
.kf-social { display:flex; align-items:center; gap:16px; color:var(--social); }
.kf-social a { display:flex; align-items:center; transition:color .12s cubic-bezier(.2,0,.2,1); }
.kf-social a:hover { color:#fff; }
.kf-social .habr { font-size:18px; font-weight:600; color:currentColor; }
.kf-legal { display:flex; flex-wrap:wrap; justify-content:space-between; gap:16px 24px; font-size:14px; line-height:20px; color:var(--muted); }
.kf-legal a { transition:color .12s cubic-bezier(.2,0,.2,1); }
.kf-legal a:hover { color:var(--white); }

/* ---------- dividers ---------- */
.kf-line { height:1px; background:rgba(255,255,255,.12); width:100%; }
.kf-line--top { display:block; }
.kf-line--legal { display:none; }

/* ================= MOBILE ================= */
@media (max-width: 980px) {
  .kf-inner { padding:48px 16px 24px; gap:24px; }
  .kf-top { grid-template-columns:1fr; gap:24px; }
  .kf-nav { grid-template-columns:1fr 1fr; gap:24px; grid-template-areas:"company resources" "compare capabilities"; }
  .kf-cards { grid-template-columns:1fr; grid-template-rows:none; grid-template-areas:"soc" "art" "sub"; }
  .kf-mid { grid-template-columns:1fr; gap:24px; }
  .kf-legal-grid { grid-template-columns:auto 1fr; gap:24px; }
  .kf-legal-grid .kf-addr { grid-column:1 / -1; }
  .kf-credits { flex-direction:column; align-items:flex-start; gap:24px; }
  .kf-partner { order:-1; }
  .kf-brand { flex-direction:column; align-items:flex-start; gap:24px; }
  .kf-contacts { flex-direction:column; align-items:flex-start; gap:16px; }
  .kf-legal { flex-direction:column; flex-wrap:nowrap; justify-content:flex-start; gap:12px; }
  .kf-line--top { display:none; }
  .kf-line--legal { display:block; }
}
`;

const COMPARE_SERVICES = [
  'Trello', 'Jira', 'Asana', 'Weeek', 'Wrike', 'ClickUp', 'EvaTeam', 'MS Project',
  'Notion', 'Confluence', 'GanttPRO', 'Google Docs', 'Redmine', 'Youtrack',
  'Zendesk', 'Okdesk', 'Юздеск', 'amoCRM',
];

/** Иконка-стрелка вверх-вправо (для статей и «Подробнее»). */
function ArrowUpRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M3 11 11 3M5 3h6v6" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Адаптивный футер лендинга Kaiten (desktop + mobile в одном компоненте).
 * Источник: Figma «Landing-DS» — desktop 7142:13339, mobile 7146:4343.
 * Реструктуризация раскладки через `grid-template-areas`: на ≤980px навигация
 * сворачивается в 2 колонки, карточки и блоки — в один столбец, «Участник
 * Сколково» поднимается над логотипом. Self-contained: scoped `<style>` (.kf) +
 * inline SVG (логотип logo-white.svg). Палитра и токены — V01.
 */
export function LandingFooterMock() {
  return (
    <footer className="kf">
      <style dangerouslySetInnerHTML={{ __html: STYLE }} />
      <div className="kf-inner">

        {/* ============ TOP ============ */}
        <div className="kf-top">
          <nav className="kf-nav">
            <div className="kf-col col-company">
              <h4>Компания</h4>
              <div className="kf-links">
                <a href="#">Тарифы</a>
                <a href="#">Контакты</a>
                <a href="#">Сертификаты</a>
                <a href="#">Скачать презентацию</a>
              </div>
            </div>
            <div className="kf-col col-resources">
              <h4>Ресурсы</h4>
              <div className="kf-links">
                <a href="#">База знаний</a>
                <a href="#">Кейсы</a>
                <a href="#">Блог</a>
                <a href="#">API</a>
                <a href="#">Комьюнити</a>
              </div>
            </div>
            <div className="kf-col col-capabilities">
              <h4>Возможности</h4>
              <div className="kf-links">
                <a href="#">Партнерская программа</a>
                <a href="#">Реферальная программа</a>
                <a href="#">Дополнения</a>
                <a href="#">On-premise</a>
                <a href="#">Внедрение</a>
                <a href="#">Кайтен AI</a>
              </div>
            </div>
            <div className="kf-col col-compare">
              <h4>Сравнили Кайтен с другими сервисами</h4>
              <div className="kf-compare-tags">
                {COMPARE_SERVICES.map((s) => (
                  <a href="#" key={s}>{s}</a>
                ))}
              </div>
            </div>
          </nav>

          <div className="kf-cards">
            {/* social channels */}
            <div className="kf-card kf-card-soc">
              <h4>Каналы в соцсетях</h4>
              <p className="desc">Фичи, новости и статьи<br />про эффективное управление</p>
              <div className="kf-soc-row">
                <a className="kf-soc-item" href="#">
                  <span className="kf-ico">
                    <svg width="18" height="15" viewBox="0 0 18 15" fill="none"><path d="M16.7 1.2 14.3 13c-.18.8-.65 1-1.32.62l-3.66-2.7-1.77 1.7c-.2.2-.36.36-.73.36l.26-3.73L13.6 3.2c.3-.26-.06-.4-.46-.15L5.3 8.07 1.7 6.94c-.78-.24-.8-.78.16-1.16L15.7.27c.65-.24 1.22.15 1 1.93Z" fill="#fff" /></svg>
                  </span>
                  <span className="label">Telegram</span>
                </a>
                <a className="kf-soc-item" href="#">
                  <span className="kf-ico">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 1.2a7.8 7.8 0 1 0 4.06 14.46l2.9.62a.5.5 0 0 0 .6-.6l-.62-2.9A7.8 7.8 0 0 0 9 1.2Z" stroke="#fff" strokeWidth="1.6" /><circle cx="9" cy="9" r="1.3" fill="#fff" /></svg>
                  </span>
                  <span className="label">Max</span>
                </a>
              </div>
            </div>

            {/* articles */}
            <div className="kf-card kf-card-art">
              <h4>Новые статьи</h4>
              <div className="kf-art-list">
                <a className="kf-art-item" href="#">
                  <span className="kf-ico"><ArrowUpRight /></span>
                  <span className="t">Каждый второй сотрудник устает от многозадачности: что показало</span>
                </a>
                <a className="kf-art-item" href="#">
                  <span className="kf-ico"><ArrowUpRight /></span>
                  <span className="t">Как сохранить знания команды на пути от гипотезы к разработке: полезные практики</span>
                </a>
              </div>
            </div>

            {/* newsletter */}
            <div className="kf-card kf-card-sub">
              <div className="kf-sub-head">
                <div>
                  <div className="kf-sub-title">Подписаться на рассылку</div>
                  <div className="kf-sub-desc">Получайте кейсы пользователей, статьи и обновления.</div>
                </div>
                <form className="kf-sub-form" onSubmit={(e) => e.preventDefault()}>
                  <input className="kf-input" type="email" placeholder="Ваш e-mail" />
                  <button className="kf-btn" type="submit">Подписаться</button>
                </form>
              </div>
              <div className="kf-consents">
                <label className="kf-consent">
                  <span className="cb on" />
                  <p>Я согласен с <span className="lnk">Политикой конфиденциальности</span> и даю <span className="lnk">согласие на обработку персональных данных</span></p>
                </label>
                <label className="kf-consent">
                  <span className="cb" />
                  <p>Я согласен <span className="lnk">получать рассылку</span> от Кайтен (обновления продукта и полезные материалы)</p>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="kf-line kf-line--top" />

        {/* ============ MID ============ */}
        <div className="kf-mid">
          <div className="kf-status">
            <h4>Официальный статус российского ИТ-разработчика</h4>
            <p>Кайтен внесен в реестр отечественного ПО <b>№14347</b>, а компания аккредитована как ИТ-организация</p>
            <a className="kf-more" href="#">Подробнее
              <svg width="22" height="10" viewBox="0 0 22 10" fill="none"><path d="M1 5h19m0 0-4-4m4 4-4 4" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </a>
          </div>
          <div className="kf-legal-block">
            <h4>Общество с ограниченной ответственностью «Кайтен Софтвер»</h4>
            <div className="kf-legal-grid">
              <div className="kf-legal-cell">
                <div className="lab">ИНН</div>
                <div className="val">7714426252</div>
              </div>
              <div className="kf-legal-cell">
                <div className="lab">КПП</div>
                <div className="val">771401001</div>
              </div>
              <div className="kf-legal-cell kf-addr">
                <div className="lab">Юридический адрес</div>
                <div className="val">125252, г. Москва, проезд Берёзовой рощи, дом 12, этаж 2, комната 55</div>
              </div>
            </div>
          </div>
        </div>

        <div className="kf-line kf-line--mid" />

        {/* ============ BOTTOM ============ */}
        <div className="kf-bottom">
          <div className="kf-credits">
            <div className="kf-brand">
              <a className="kf-logo" href="#" aria-label="Kaiten">
                {/* Kaiten logo (white) — assets/logo/logo-white.svg */}
                <svg viewBox="0 0 349 104" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Kaiten">
                  <path d="M76.8113 0H27.1887C12.1728 0 0 12.1661 0 27.1738V76.8262C0 91.8339 12.1728 104 27.1887 104H76.8113C91.8272 104 104 91.8339 104 76.8262V27.1738C104 12.1661 91.8272 0 76.8113 0Z" fill="#F11F24" />
                  <path d="M41.4148 11.3364L11.3364 41.4148C5.55453 47.1967 5.55453 56.571 11.3364 62.3529L41.4148 92.4313C47.1967 98.2132 56.571 98.2132 62.3529 92.4313L92.4313 62.3529C98.2132 56.571 98.2132 47.1967 92.4313 41.4148L62.3529 11.3364C56.571 5.55453 47.1967 5.55453 41.4148 11.3364Z" fill="#78FFC7" />
                  <path d="M51.715 77.4267C65.917 77.4267 77.43 65.9144 77.43 51.7133C77.43 37.5123 65.917 26 51.715 26C37.513 26 26 37.5123 26 51.7133C26 65.9144 37.513 77.4267 51.715 77.4267Z" fill="#7D4CCF" />
                  <path d="M243.439 41.4082H251.802V45.1846H243.439V59.2119C243.439 60.5787 243.583 61.7476 243.871 62.7188C244.195 63.6539 244.609 64.4276 245.112 65.0391C245.652 65.6144 246.263 66.0463 246.946 66.334C247.63 66.6217 248.349 66.7656 249.104 66.7656C250.183 66.7656 251.226 66.603 252.233 66.2793C253.241 65.9196 254.086 65.5421 254.77 65.1465L256.388 68.6533C255.309 69.1928 254.068 69.6423 252.665 70.002C251.298 70.3616 249.932 70.542 248.565 70.542C244.501 70.542 241.372 69.5346 239.178 67.5205C236.984 65.5063 235.886 62.7368 235.886 59.2119V45.1846H230.761V41.4082H235.886V32.7754H243.439V41.4082Z" fill="white" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M274.39 40.3281C276.548 40.3282 278.58 40.6514 280.486 41.2988C282.393 41.9463 284.047 42.9004 285.449 44.1592C286.852 45.3821 287.968 46.8743 288.795 48.6367C289.622 50.399 290.035 52.3952 290.035 54.625V58.4023H266.998C267.43 61.3876 268.455 63.5275 270.073 64.8223C271.728 66.1171 273.796 66.7646 276.277 66.7646C278.04 66.7646 279.677 66.4591 281.188 65.8477C282.734 65.2362 284.245 64.3728 285.72 63.2578L287.877 66.4951C287.194 67.1065 286.384 67.6635 285.449 68.167C284.55 68.6705 283.561 69.1023 282.482 69.4619C281.439 69.7856 280.342 70.0379 279.191 70.2178C278.04 70.4336 276.889 70.541 275.738 70.541C273.185 70.541 270.847 70.1999 268.725 69.5166C266.638 68.8692 264.857 67.9161 263.383 66.6572C261.908 65.3624 260.757 63.7795 259.93 61.9092C259.138 60.0388 258.743 57.8804 258.743 55.4346C258.743 53.0249 259.121 50.8849 259.876 49.0146C260.667 47.1083 261.746 45.5255 263.113 44.2666C264.516 42.9718 266.171 42.0009 268.077 41.3535C269.983 40.6702 272.088 40.3281 274.39 40.3281ZM274.39 43.835C273.347 43.835 272.375 44.0331 271.476 44.4287C270.577 44.8244 269.785 45.4533 269.102 46.3164C268.454 47.1796 267.915 48.2953 267.483 49.6621C267.088 51.0287 266.872 52.683 266.836 54.625H281.942C281.942 52.7548 281.727 51.1362 281.295 49.7695C280.863 48.4029 280.288 47.288 279.568 46.4248C278.885 45.5257 278.076 44.8781 277.141 44.4824C276.242 44.0509 275.325 43.835 274.39 43.835Z" fill="white" />
                  <path d="M224.606 69.4629H217.053V41.9473H224.606V69.4629Z" fill="white" />
                  <path d="M311.83 41.4082C316.973 41.4082 320.768 42.3436 323.214 44.2139C325.696 46.0482 326.937 48.8001 326.937 52.4688V69.4629H319.383V52.4688C319.383 49.879 318.735 48.0261 317.44 46.9111C316.146 45.7604 314.276 45.1846 311.83 45.1846H304.816V69.4629H297.263V41.4082H311.83Z" fill="white" />
                  <path d="M145.944 48.6904H154.847L167.255 31.6953H175.888L162.399 50.3086L176.697 69.4619H167.795L155.386 52.7363H145.944V69.4619H138.121V31.6953H145.944V48.6904Z" fill="white" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M194.2 40.3281C196.502 40.3281 198.534 40.5982 200.297 41.1377C202.059 41.6772 203.552 42.4499 204.775 43.457C205.998 44.4641 206.915 45.6695 207.526 47.0723C208.174 48.439 208.498 49.9677 208.498 51.6582V69.4619H193.391C188.499 69.4619 184.885 68.7246 182.547 67.25C180.245 65.7754 179.094 63.5457 179.094 60.5605C179.094 57.5752 180.245 55.3448 182.547 53.8701C184.885 52.3955 188.499 51.6582 193.391 51.6582H200.944C200.944 49.0687 200.261 47.1624 198.895 45.9395C197.564 44.7166 195.819 44.1045 193.661 44.1045C192.043 44.1045 190.46 44.3568 188.913 44.8604C187.366 45.3279 185.982 45.9755 184.759 46.8027L182.87 43.5654C183.661 43.0259 184.525 42.5578 185.46 42.1621C186.188 41.8653 186.927 41.6094 187.676 41.3936L189.18 40.9893C189.928 40.8005 190.666 40.6518 191.395 40.5439C192.402 40.4001 193.337 40.3281 194.2 40.3281ZM193.391 55.4346C189.255 55.4347 187.187 57.1437 187.187 60.5605C187.187 63.9772 189.255 65.6854 193.391 65.6855H200.944V55.4346H193.391Z" fill="white" />
                  <path d="M220.83 30.6172C222.017 30.6173 222.988 31.0312 223.743 31.8584C224.498 32.6497 224.876 33.5851 224.876 34.6641C224.876 35.7429 224.498 36.6963 223.743 37.5234C223.024 38.3145 222.053 38.7099 220.83 38.71C219.607 38.71 218.618 38.3146 217.862 37.5234C217.143 36.6963 216.783 35.7429 216.783 34.6641C216.783 33.5851 217.143 32.6497 217.862 31.8584C218.618 31.0311 219.607 30.6172 220.83 30.6172Z" fill="white" />
                </svg>
              </a>
              <div className="kf-contacts">
                <a className="kf-contact" href="tel:+74994906499">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M6.6 4h3l1.4 3.5-2 1.2a11 11 0 0 0 4.8 4.8l1.2-2 3.5 1.4v3a1.4 1.4 0 0 1-1.5 1.4A14 14 0 0 1 5.2 5.5 1.4 1.4 0 0 1 6.6 4Z" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" /></svg>
                  +7 (499) 490-64-99
                </a>
                <a className="kf-contact" href="mailto:sales@kaiten.ru">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2.5" stroke="#fff" strokeWidth="1.6" /><path d="m4 7 8 6 8-6" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" /></svg>
                  sales@kaiten.ru
                </a>
              </div>
            </div>

            <div className="kf-partner">
              <span className="word">Участник</span>
              <span className="sk">
                <span className="sk-mark">Sk</span>
                <span className="sk-name">Сколково</span>
              </span>
            </div>

            <div className="kf-social">
              <a href="#" aria-label="VK">
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><path d="M13.7 18.4c-5.9 0-9.3-4-9.5-10.7h3c.1 4.9 2.3 7 4 7.4V7.7h2.8v4.3c1.7-.18 3.5-2.1 4.1-4.3h2.8c-.46 2.7-2.4 4.6-3.7 5.4 1.4.65 3.5 2.3 4.3 5.3h-3.1c-.62-1.9-2.2-3.4-4.4-3.6v3.6h-.34Z" fill="currentColor" /></svg>
              </a>
              <a href="#" aria-label="Rutube">
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><rect x="3" y="6" width="20" height="14" rx="4" fill="currentColor" /><path d="M11 10v6l5-3-5-3Z" fill="#2d2d2d" /></svg>
              </a>
              <a className="habr" href="#" aria-label="Habr">habr</a>
            </div>
          </div>

          <div className="kf-line kf-line--legal" />

          <nav className="kf-legal">
            <a href="#">Политика конфиденциальности</a>
            <a href="#">Лицензионный договор</a>
            <a href="#">Пользовательское соглашение</a>
            <a href="#">Оплата банковскими картами</a>
            <a href="#">Техническая поддержка</a>
          </nav>
        </div>

      </div>
    </footer>
  );
}
