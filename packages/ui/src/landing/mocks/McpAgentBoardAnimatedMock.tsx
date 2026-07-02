import { ScaleToFit } from './ScaleToFit';

/**
 * Анимированный сигнатурный визуал лендинга «MCP-сервер Kaiten» для первого экрана.
 * Спринт-доска команды разработки (Бэклог → В работе → Готово) и плавающий поверх
 * неё чат ИИ-ассистента. Цикл (CSS @keyframes, 8s):
 *   1. юзер пишет «Назначь ответственного, передвинь в „Готово“»;
 *   2. ассистент вызывает kaiten.update_card через MCP;
 *   3. на карточке «Починить flaky-тесты в CI» всплывает аватар ответственного;
 *   4. карточка переезжает из «В работе» в «Готово»;
 *   5. ассистент отвечает «Готово».
 * Стили заскоуплены под .maa, разметка статична (dangerouslySetInnerHTML) —
 * без клиентских хуков, безопасно для прод-сборки. Домен: pm.
 */
const CSS = `.maa{ --tp:#2d2d2d; --ts:#8a8a8f; --acc:#7d4ccf; --bd:#e8e8eb; --sec:#f4f4f6; }
.maa *{ box-sizing:border-box; margin:0; padding:0; }
.maa{ font-family:"Inter",system-ui,"Segoe UI",sans-serif; color:var(--tp); -webkit-font-smoothing:antialiased; }
.maa .wrap{ position:relative; width:870px; }
.maa .mod{ width:870px; background:#f1f1f4; border:1px solid var(--bd); border-radius:16px; box-shadow:0 18px 50px -24px rgba(45,45,45,.35); overflow:hidden; }
.maa .hdr{ display:flex; align-items:center; gap:12px; padding:14px 18px; }
.maa .grip{ display:grid; grid-template-columns:repeat(2,3px); gap:3px; }
.maa .grip i{ width:3px; height:3px; border-radius:50%; background:#c4c4c9; display:block; }
.maa .hdr .nm{ font-size:16px; font-weight:600; }
.maa .hdr .spr{ margin-left:8px; font-size:12.5px; color:var(--ts); background:#ededf0; border-radius:7px; padding:3px 9px; }
.maa .hdr .chev{ margin-left:auto; color:var(--ts); display:flex; }
.maa .colhdr{ display:flex; gap:16px; padding:6px 14px 10px; border-bottom:1px solid var(--bd); }
.maa .colhdr .c{ width:270px; display:flex; align-items:center; gap:8px; }
.maa .colhdr .c .t{ font-size:14px; font-weight:500; }
.maa .colhdr .c .chk{ color:#4a8a2f; display:flex; }
.maa .cnt{ margin-left:auto; display:inline-flex; min-width:22px; height:22px; align-items:center; justify-content:center; background:#5f5e5a; color:#fff; border-radius:7px; padding:0 7px; font-size:12px; font-weight:600; }
.maa .lanebody{ position:relative; display:flex; gap:16px; padding:14px; }
.maa .col{ width:270px; display:flex; flex-direction:column; gap:12px; }
.maa .card{ background:#fff; border:1px solid var(--bd); border-radius:12px; padding:13px; box-shadow:0 1px 2px rgba(45,45,45,.05); display:flex; flex-direction:column; gap:10px; }
.maa .ct{ font-size:14px; font-weight:500; line-height:1.35; }
.maa .row{ display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
.maa .prio b{ color:#6b6b70; font-weight:600; font-size:13px; }
.maa .tags{ display:flex; flex-wrap:wrap; gap:6px; }
.maa .tag{ border-radius:999px; padding:3px 10px; font-size:12px; font-weight:500; white-space:nowrap; }
.maa .t-ci{ background:#ededf0; color:#6b6b70; }
.maa .t-api{ background:#efe9f9; color:#7d4ccf; }
.maa .t-done{ background:#e7f2e2; color:#3f7a26; }
.maa .foot{ display:flex; align-items:center; justify-content:space-between; }
.maa .avs{ display:flex; align-items:center; }
.maa .av{ width:24px; height:24px; border-radius:50%; border:2px solid #fff; }
.maa .slot{ height:104px; }
.maa .muted .ct{ color:var(--ts); }
.maa .check{ color:#3f7a26; display:flex; }

/* карточка-путешественница */
.maa .drag-layer{ position:absolute; top:14px; left:300px; width:270px; z-index:20; animation:maTravel 8s ease-in-out infinite; }
.maa .drag-card{ animation:maFade 8s ease-in-out infinite, maLift 8s ease-in-out infinite; }
.maa .assignee{ opacity:0; animation:maAssign 8s ease-in-out infinite; }

/* плавающий чат ИИ поверх доски */
.maa .chat{ position:absolute; right:20px; bottom:18px; width:312px; z-index:40; background:#fff; border:1px solid var(--bd); border-radius:16px; box-shadow:0 26px 60px -20px rgba(45,45,45,.45); padding:13px; }
.maa .chat .chd{ display:flex; align-items:center; gap:8px; padding-bottom:11px; }
.maa .chat .dot{ width:9px; height:9px; border-radius:50%; }
.maa .chat .cnm{ font-size:12.5px; font-weight:600; }
.maa .chat .mcp{ margin-left:auto; display:inline-flex; align-items:center; gap:4px; background:#efe9f9; color:#6d3fbf; border-radius:999px; padding:2px 8px; font-size:10px; font-weight:700; }
.maa .chat .bubwrap{ display:flex; flex-direction:column; gap:9px; min-height:118px; }
.maa .typing{ align-self:flex-end; display:inline-flex; gap:4px; background:var(--acc); border-radius:14px 14px 4px 14px; padding:9px 12px; opacity:0; animation:maTyping 8s ease-in-out infinite; }
.maa .typing i{ width:5px; height:5px; border-radius:50%; background:#fff; opacity:.85; }
.maa .msg{ font-size:12.5px; line-height:1.4; border-radius:14px; padding:9px 12px; max-width:88%; opacity:0; }
.maa .m-user{ align-self:flex-end; background:var(--acc); color:#fff; border-bottom-right-radius:4px; animation:maUser 8s ease-in-out infinite; }
.maa .tool{ align-self:flex-start; display:inline-flex; align-items:center; gap:7px; font-size:11px; font-weight:600; color:var(--tp); background:var(--sec); border:1px solid var(--bd); border-radius:9px; padding:6px 9px; opacity:0; animation:maTool 8s ease-in-out infinite; }
.maa .tool .ok{ display:inline-flex; align-items:center; justify-content:center; width:15px; height:15px; border-radius:50%; background:#3f7a26; color:#fff; }
.maa .m-ai{ align-self:flex-start; background:var(--sec); color:var(--tp); border:1px solid var(--bd); border-bottom-left-radius:4px; animation:maAi 8s ease-in-out infinite; }

@keyframes maTravel{ 0%,50%{ transform:translate(0,0);} 64%,100%{ transform:translate(286px,4px);} }
@keyframes maFade{ 0%{opacity:0;} 5%{opacity:1;} 88%{opacity:1;} 95%{opacity:0;} 100%{opacity:0;} }
@keyframes maLift{ 0%,50%{ box-shadow:0 1px 2px rgba(45,45,45,.06); transform:scale(1);} 57%{ box-shadow:0 22px 44px -12px rgba(45,45,45,.42); transform:scale(1.03);} 64%,100%{ box-shadow:0 1px 2px rgba(45,45,45,.06); transform:scale(1);} }
@keyframes maAssign{ 0%,36%{opacity:0; transform:scale(.4);} 44%{opacity:1; transform:scale(1);} 88%{opacity:1;} 95%{opacity:0;} 100%{opacity:0;} }
@keyframes maTyping{ 0%,6%{opacity:0;} 9%{opacity:1;} 19%{opacity:1;} 23%{opacity:0;} 100%{opacity:0;} }
@keyframes maUser{ 0%,20%{opacity:0; transform:translateY(6px);} 26%{opacity:1; transform:translateY(0);} 88%{opacity:1;} 96%{opacity:0;} 100%{opacity:0;} }
@keyframes maTool{ 0%,38%{opacity:0; transform:translateY(6px);} 45%{opacity:1; transform:translateY(0);} 88%{opacity:1;} 96%{opacity:0;} 100%{opacity:0;} }
@keyframes maAi{ 0%,66%{opacity:0; transform:translateY(6px);} 73%{opacity:1; transform:translateY(0);} 88%{opacity:1;} 96%{opacity:0;} 100%{opacity:0;} }`;

const CHECK = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';

const MARKUP = `<div class="wrap" aria-hidden="true">
  <div class="mod">
    <div class="hdr">
      <span class="grip"><i></i><i></i><i></i><i></i><i></i><i></i></span>
      <span class="nm">Доска команды</span>
      <span class="spr">Спринт 24</span>
      <span class="chev"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 15l-6-6-6 6"/></svg></span>
    </div>

    <div class="colhdr">
      <div class="c"><span class="t">Бэклог</span><span class="cnt">5</span></div>
      <div class="c"><span class="t">В работе</span><span class="cnt">3</span></div>
      <div class="c"><span class="chk">${CHECK}</span><span class="t">Готово</span><span class="cnt">8</span></div>
    </div>

    <div class="lanebody">
      <div class="col">
        <div class="card"><div class="ct">Вынести конфиг в переменные окружения</div><div class="tags"><span class="tag t-ci">Инфра</span></div></div>
        <div class="card"><div class="ct">Обновить зависимости фронтенда</div><div class="tags"><span class="tag t-api">Фронтенд</span></div></div>
      </div>

      <div class="col">
        <div class="slot"></div>
        <div class="card"><div class="ct">Ревью авторизации по токену</div><div class="row"><span class="prio"><b>M</b></span></div><div class="tags"><span class="tag t-api">API</span></div><div class="foot"><span class="avs"><span class="av" style="background:#8a9bc9"></span></span></div></div>
      </div>

      <div class="col">
        <div class="slot"></div>
        <div class="card muted"><div class="ct"><span class="check">${CHECK}</span> Кеш сборки в CI</div><div class="tags"><span class="tag t-done">Готово</span></div></div>
        <div class="card muted"><div class="ct"><span class="check">${CHECK}</span> Логи в формате JSON</div><div class="tags"><span class="tag t-done">Готово</span></div></div>
      </div>

      <div class="drag-layer">
        <div class="card drag-card">
          <div class="ct">Починить flaky-тесты в CI</div>
          <div class="row"><span class="prio"><b>L</b></span></div>
          <div class="tags"><span class="tag t-ci">CI</span></div>
          <div class="foot">
            <span class="avs"><span class="av assignee" style="background:#7d4ccf"></span></span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="chat">
    <div class="chd">
      <span class="dot" style="background:#7d4ccf"></span>
      <span class="cnm">ИИ-ассистент</span>
      <span class="mcp">◇ MCP</span>
    </div>
    <div class="bubwrap">
      <span class="typing"><i></i><i></i><i></i></span>
      <span class="msg m-user">Назначь ответственного, передвинь в «Готово»</span>
      <span class="tool"><span class="ok">${CHECK}</span> kaiten.update_card → «Спринт 24»</span>
      <span class="msg m-ai">Готово. Назначил ответственного и перенёс карточку в «Готово».</span>
    </div>
  </div>
</div>`;

export function McpAgentBoardAnimatedMock() {
  return (
    <div className="maa" aria-hidden>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <ScaleToFit designWidth={870}>
        <div dangerouslySetInnerHTML={{ __html: MARKUP }} />
      </ScaleToFit>
    </div>
  );
}
