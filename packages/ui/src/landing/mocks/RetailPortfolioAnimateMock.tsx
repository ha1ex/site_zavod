import { ScaleToFit } from './ScaleToFit';

/**
 * Mock дашборда Kaiten «Портфель проектов сети» (анимированный) для розничной сети.
 * Колонки Новые инициативы → Оценка → В работе → Контроль рисков → Готово,
 * свимлейны «Открытие и ремонт точек» / «Операционные проекты сети», карточки —
 * реальные проекты сети (открытие точки, маркировка, ребрендинг, инвентаризация).
 * Карточка «Внедрение маркировки табака» циклически перетаскивается рукой-курсором
 * в соседнюю колонку (CSS @keyframes rpTravel). Стили заскоуплены под .rpa,
 * разметка статична (dangerouslySetInnerHTML). Домен: pm.
 */
const CSS = `.rpa{ --tp:#2d2d2d; --ts:#8a8a8f; --acc:#7d4ccf; --bd:#e8e8eb; --sec:#f4f4f6; }
.rpa *{ box-sizing:border-box; margin:0; padding:0; }
.rpa{ font-family:"Inter",system-ui,"Segoe UI",sans-serif; color:var(--tp); -webkit-font-smoothing:antialiased; }
.rpa .mod{ width:1360px; flex:0 0 auto; background:#f1f1f4; border:1px solid var(--bd); border-radius:16px; box-shadow:0 18px 50px -24px rgba(45,45,45,.35); overflow:hidden; }
.rpa .hdr{ display:flex; align-items:center; gap:12px; padding:14px 18px; }
.rpa .grip{ display:grid; grid-template-columns:repeat(2,3px); gap:3px; }
.rpa .grip i{ width:3px; height:3px; border-radius:50%; background:#c4c4c9; display:block; }
.rpa .hdr .nm{ font-size:17px; font-weight:600; }
.rpa .hdr .chev{ margin-left:auto; color:var(--ts); display:flex; }
.rpa .colhdr{ display:flex; padding:6px 16px 10px; border-bottom:1px solid var(--bd); }
.rpa .colhdr .c{ flex:1; display:flex; align-items:center; gap:8px; padding:0 9px; }
.rpa .colhdr .c .t{ font-size:14.5px; font-weight:500; color:var(--tp); }
.rpa .colhdr .c .chk{ color:#4a8a2f; display:flex; }
.rpa .cnt{ margin-left:auto; display:inline-flex; min-width:24px; height:24px; align-items:center; justify-content:center; background:#5f5e5a; color:#fff; border-radius:7px; padding:0 7px; font-size:12.5px; font-weight:600; }
.rpa .lane{ display:flex; align-items:center; gap:12px; padding:13px 18px; border-bottom:1px solid var(--bd); }
.rpa .lane .lnm{ font-size:15px; font-weight:600; }
.rpa .lane .cnt2{ margin-left:auto; display:inline-flex; min-width:30px; height:24px; align-items:center; justify-content:center; background:#ededf0; color:#6b6b70; border-radius:7px; padding:0 8px; font-size:12.5px; font-weight:600; }
.rpa .lane .chev{ color:var(--ts); display:flex; }
.rpa .lanebody{ display:flex; padding:14px 8px; }
.rpa .col{ flex:1; padding:0 9px; display:flex; flex-direction:column; gap:12px; position:relative; }
.rpa .col + .col::before{ content:""; position:absolute; left:0; top:-14px; bottom:-14px; border-left:1px solid var(--bd); }
.rpa .card{ background:#fff; border:1px solid var(--bd); border-radius:12px; padding:14px; box-shadow:0 1px 2px rgba(45,45,45,.05); display:flex; flex-direction:column; gap:11px; }
.rpa .ct{ font-size:14.5px; font-weight:500; line-height:1.35; color:var(--tp); }
.rpa .row{ display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
.rpa .prio{ display:inline-flex; align-items:center; gap:3px; color:var(--ts); font-size:13px; }
.rpa .prio b{ color:#6b6b70; font-weight:600; }
.rpa .sub{ display:inline-flex; align-items:center; gap:4px; color:var(--ts); font-size:12.5px; }
.rpa .tags{ display:flex; flex-wrap:wrap; gap:6px; }
.rpa .tag{ border-radius:999px; padding:3px 10px; font-size:12.5px; font-weight:500; white-space:nowrap; }
.rpa .t-store{ background:#ededf0; color:#6b6b70; }
.rpa .t-buy{ background:#f7f0cf; color:#8a6a00; }
.rpa .t-big{ background:#efe9f9; color:#7d4ccf; }
.rpa .t-urg{ background:#fbe3ec; color:#c2185b; }
.rpa .datepill{ display:inline-flex; align-items:center; gap:7px; background:#f1f1f4; color:#5b5b62; border-radius:999px; padding:5px 11px; font-size:12.5px; align-self:flex-start; }
.rpa .foot{ display:flex; align-items:center; justify-content:space-between; }
.rpa .avs{ display:flex; align-items:center; }
.rpa .av{ width:24px; height:24px; border-radius:50%; border:2px solid #fff; margin-left:-7px; }
.rpa .av:first-child{ margin-left:0; }
.rpa .plus{ font-size:12.5px; color:var(--ts); margin-left:7px; }
.rpa .due{ display:inline-flex; align-items:center; gap:5px; color:var(--ts); font-size:12.5px; }
.rpa .today{ display:inline-flex; align-items:center; gap:5px; background:#f5972a; color:#fff; border-radius:8px; padding:4px 9px; font-size:12px; font-weight:600; }
.rpa .alert{ padding:0; overflow:hidden; }
.rpa .alert .band{ background:#e7402c; color:#fff; padding:10px 12px; font-size:13.5px; font-weight:600; line-height:1.3; display:flex; gap:8px; align-items:flex-start; }
.rpa .alert .abody{ padding:14px; display:flex; flex-direction:column; gap:11px; }
.rpa .placeholder{ height:208px; border:2px dashed #cfd6df; border-radius:12px; background:#f6f8fb; }
.rpa .drag-layer{ position:absolute; top:0; left:9px; right:9px; z-index:30; animation:rpTravel 5s ease-in-out infinite; }
.rpa .drag-card{ border:1px solid #e0d6f3; transform-origin:center; animation:rpLift 5s ease-in-out infinite; }
.rpa .hand{ position:absolute; left:76%; top:32%; transform:translate(-50%,-50%); width:40px; height:40px; filter:drop-shadow(0 2px 3px rgba(0,0,0,.25)); animation:rpHand 5s ease-in-out infinite; }
@keyframes rpTravel{ 0%{ transform:translate(0,0); } 40%{ transform:translate(0,0); } 48%{ transform:translate(4px,-12px); } 66%{ transform:translate(154px,48px); } 74%{ transform:translate(154px,48px); } 90%{ transform:translate(4px,-12px); } 100%{ transform:translate(0,0); } }
@keyframes rpLift{ 0%{ transform:rotate(0deg) scale(1); box-shadow:0 1px 2px rgba(45,45,45,.06); } 40%{ transform:rotate(0deg) scale(1); box-shadow:0 1px 2px rgba(45,45,45,.06); } 48%{ transform:rotate(3deg) scale(1.03); box-shadow:0 22px 45px -12px rgba(45,45,45,.40); } 90%{ transform:rotate(3deg) scale(1.03); box-shadow:0 22px 45px -12px rgba(45,45,45,.40); } 100%{ transform:rotate(0deg) scale(1); box-shadow:0 1px 2px rgba(45,45,45,.06); } }
@keyframes rpHand{ 0%{opacity:0;} 40%{opacity:0;} 47%{opacity:1;} 90%{opacity:1;} 100%{opacity:0;} }`;

const CAL = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v4M16 2v4"/><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 10h18"/></svg>';

const MARKUP = `<div class="mod" aria-hidden="true">
  <div class="hdr">
    <span class="grip"><i></i><i></i><i></i><i></i><i></i><i></i></span>
    <span class="nm">Портфель проектов сети</span>
    <span class="chev"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 15l-6-6-6 6"/></svg></span>
  </div>

  <div class="colhdr">
    <div class="c"><span class="t">Новые инициативы</span><span class="cnt">5</span></div>
    <div class="c"><span class="t">Оценка и приоритизация</span><span class="cnt">6</span></div>
    <div class="c"><span class="t">В работе</span><span class="cnt">9</span></div>
    <div class="c"><span class="t">Контроль рисков</span><span class="cnt">4</span></div>
    <div class="c"><span class="chk"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span><span class="t">Готово</span><span class="cnt">7</span></div>
  </div>

  <div class="lane">
    <span class="lnm">Открытие и ремонт точек</span>
    <span class="cnt2">8</span>
    <span class="chev"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg></span>
  </div>

  <div class="lanebody">
    <div class="col">
      <div class="card">
        <div class="ct">Открытие точки — ТЦ «Мега»</div>
        <div class="row"><span class="prio"><b>M</b></span></div>
        <div class="tags"><span class="tag t-store">Магазины</span></div>
        <div class="datepill">${CAL}17 июня — 18 сент.</div>
        <div class="foot"><span class="avs"><span class="av" style="background:#d9a3a3"></span><span class="av" style="background:#8a9bc9"></span><span class="plus">+1</span></span><span class="due">${CAL}28 июня</span></div>
      </div>
      <div class="card">
        <div class="ct">Замена кассового ПО в 20 точках</div>
        <div class="row"><span class="prio"><b>M</b></span></div>
        <div class="tags"><span class="tag t-store">ИТ</span></div>
        <div class="datepill">${CAL}24 июня — 21 авг.</div>
      </div>
    </div>

    <div class="col">
      <div class="card">
        <div class="ct">Ребрендинг 12 магазинов</div>
        <div class="row"><span class="prio"><b>L</b></span></div>
        <div class="tags"><span class="tag t-big">крупный проект</span><span class="tag t-store">Маркетинг</span></div>
        <div class="datepill">${CAL}14 июня — 2 авг.</div>
        <div class="foot"><span class="avs"><span class="av" style="background:#b88ac9"></span><span class="av" style="background:#d9a3a3"></span><span class="plus">+2</span></span><span class="due">${CAL}2 авг.</span></div>
      </div>
    </div>

    <div class="col">
      <div class="placeholder"></div>
      <div class="card">
        <div class="ct">Инвентаризация склада №3</div>
        <div class="row"><span class="prio"><b>M</b></span></div>
        <div class="tags"><span class="tag t-store">Склад</span></div>
        <div class="foot"><span class="avs"><span class="av" style="background:#8ac9a0"></span><span class="av" style="background:#c9b78a"></span><span class="plus">+1</span></span></div>
      </div>

      <div class="drag-layer">
        <div class="card drag-card">
          <div class="ct">Внедрение маркировки табака</div>
          <div class="row"><span class="prio"><b>L</b></span><span class="sub"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>1/4</span></div>
          <div class="tags"><span class="tag t-buy">Закупки</span><span class="tag t-big">крупный проект</span></div>
          <div class="datepill">${CAL}3 июня — 31 июля</div>
          <div class="foot"><span class="avs"><span class="av" style="background:#d9a3a3"></span><span class="av" style="background:#2d2d2d"></span><span class="plus">+2</span></span><span class="due">${CAL}5 июля</span></div>
        </div>
        <svg class="hand" viewBox="0 0 40 40"><path d="M14 22V14a2.2 2.2 0 0 1 4.4 0v-1a2.2 2.2 0 0 1 4.4 0v1a2.2 2.2 0 0 1 4.4 0v1a2.2 2.2 0 0 1 4.4 0v9a8 8 0 0 1-8 8h-2.5a8 8 0 0 1-6.6-3.5l-3.2-4.8a2.3 2.3 0 0 1 3.7-2.8z" fill="#fff" stroke="#2f2f2f" stroke-width="1.6" stroke-linejoin="round"/></svg>
      </div>
    </div>

    <div class="col">
      <div class="card alert">
        <div class="band"><span>Подрядчик срывает поставку стеллажей на новую точку</span></div>
        <div class="abody">
          <div class="tags"><span class="tag t-urg">Срочно</span></div>
          <div class="foot"><span class="avs"><span class="av" style="background:#d9a3a3"></span><span class="av" style="background:#8a9bc9"></span><span class="plus">+2</span></span><span class="due">${CAL}10 июня</span></div>
        </div>
      </div>
      <div class="card alert">
        <div class="band"><span>Не согласованы макеты витрин к акции</span></div>
      </div>
    </div>

    <div class="col">
      <div class="card">
        <div class="ct">Запуск акции «Чёрная пятница»</div>
        <div class="row"><span class="prio"><b>S</b></span></div>
        <div class="tags"><span class="tag t-store">Маркетинг</span></div>
        <div class="foot"><span class="avs"><span class="av" style="background:#b88ac9"></span><span class="av" style="background:#8ac9a0"></span><span class="plus">+3</span></span><span class="today">${CAL}Сегодня</span></div>
      </div>
      <div class="card">
        <div class="ct">Аудит выкладки в 8 магазинах</div>
        <div class="row"><span class="prio"><b>S</b></span></div>
        <div class="tags"><span class="tag t-store">Магазины</span></div>
        <div class="datepill">${CAL}20 мая — 3 июня</div>
        <div class="foot"><span class="avs"><span class="av" style="background:#d9a3a3"></span><span class="av" style="background:#c9b78a"></span><span class="plus">+2</span></span><span class="today">${CAL}Сегодня</span></div>
      </div>
    </div>
  </div>
</div>`;

export function RetailPortfolioAnimateMock() {
  return (
    <div className="rpa" aria-hidden>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <ScaleToFit designWidth={1360}>
        <div dangerouslySetInnerHTML={{ __html: MARKUP }} />
      </ScaleToFit>
    </div>
  );
}
