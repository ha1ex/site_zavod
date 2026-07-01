/**
 * Window: карточка заявки Service Desk с легендой-выносками к сущностям.
 * Экран «Не могу загрузить изображение» — окно карточки + панель комментариев,
 * вокруг — подписи (выноски) к ключевым сущностям: информация о заказчике,
 * ответственный, срок, описание, файлы, связи, а также заметки/ответы специалиста.
 *
 * Стили заскоуплены под корневой класс `.wclm`, координаты выносок и SVG-линий
 * заданы в пикселях относительно сцены (так выноски ложатся ровно на уровни строк).
 */

const css = `
.wclm{
  --violet:#7d4ccf; --violet-12:#efe9f9; --violet-soft:#f4eefc;
  --ink:#2d2d2d; --ink-2:#5b5b5b; --ink-3:#8a8a8a;
  --line:#e4e4e8; --line-2:#ededf1;
  --page:#f3f1f6; --card:#ffffff;
  --orange-bg:#fff3e0; --blue-bg:#eef4fc; --green:#4caf51;
  --legend:#6b4ba8;
  font-family:"Inter",system-ui,sans-serif;color:var(--ink);
  background:var(--page);-webkit-font-smoothing:antialiased;
  display:flex;justify-content:center;padding:48px 24px;
}
.wclm *{box-sizing:border-box;margin:0;padding:0;}
.wclm .stage{position:relative;display:grid;grid-template-columns:230px 720px 230px;gap:0;align-items:start;}
.wclm .legend{display:flex;flex-direction:column;}
.wclm .tag{position:absolute;width:186px;border:1.5px solid var(--line);background:var(--card);border-radius:14px;padding:14px 16px;font-size:14px;line-height:1.35;color:#2d2d2d;font-weight:400;box-shadow:0 2px 8px rgba(40,30,70,.04);text-align:left;z-index:2;transform:translateY(-50%);}
.wclm .legend-left .tag{left:0;}
.wclm .legend-right .tag{right:0;}
.wclm .links{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:3;overflow:visible;}
.wclm .window{background:var(--card);border:1px solid var(--line);border-radius:16px;overflow:hidden;box-shadow:0 24px 60px rgba(40,30,70,.14);display:grid;grid-template-columns:1fr 312px;min-height:540px;}
.wclm .main{padding:20px 22px 26px;border-right:1px solid var(--line-2);}
.wclm .h1{font-size:21px;font-weight:700;letter-spacing:-.2px;}
.wclm .id{color:var(--violet);font-size:12px;border-bottom:1px solid var(--violet);display:inline-block;margin-top:6px;}
.wclm .toolbar{display:flex;align-items:center;gap:8px;margin:14px 0 4px;}
.wclm .plus{width:34px;height:34px;border-radius:50%;background:var(--violet);color:#fff;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;}
.wclm .progress{flex:1;height:4px;border-radius:3px;background:linear-gradient(90deg,var(--violet) 0 18%,#e9e4f2 18% 100%);}
.wclm .tbtn{height:30px;min-width:30px;padding:0 8px;border:1px solid var(--line);border-radius:8px;background:#fff;display:flex;align-items:center;justify-content:center;gap:5px;font-size:12px;color:var(--ink-2);}
.wclm .tbtn.go{font-weight:600;color:var(--ink);}
.wclm .support{background:var(--blue-bg);border-radius:12px;padding:13px 15px;margin-top:14px;font-size:12.5px;color:var(--ink-2);}
.wclm .support .row1{display:flex;align-items:center;gap:8px;font-weight:600;color:var(--ink);}
.wclm .support .row1 svg{color:var(--violet);}
.wclm .support .meta{margin:6px 0 2px;line-height:1.55;}
.wclm .support a{color:var(--violet);}
.wclm .support .notify{margin-top:8px;}
.wclm .support .new{margin-top:11px;padding-top:10px;border-top:1px solid #dce6f3;display:flex;align-items:center;justify-content:space-between;gap:10px;}
.wclm .support .new .l{display:flex;align-items:center;gap:7px;color:var(--ink-2);}
.wclm .support .new .r{color:var(--violet);font-weight:600;font-size:10.5px;letter-spacing:.4px;}
.wclm .badge-dot{width:8px;height:8px;border-radius:50%;background:var(--violet);}
.wclm .props{margin-top:18px;display:grid;grid-template-columns:108px 1fr;row-gap:13px;font-size:13px;align-items:center;}
.wclm .props .k{color:var(--ink-3);}
.wclm .props .v{color:var(--ink);display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
.wclm .props .v a{color:var(--violet);border-bottom:1px solid var(--violet);}
.wclm .pill{display:inline-flex;align-items:center;gap:6px;background:#f0f0f3;border-radius:7px;padding:3px 9px;font-size:12px;color:var(--ink-2);}
.wclm .ava{width:22px;height:22px;border-radius:50%;flex-shrink:0;}
.wclm .ava.a{background:linear-gradient(135deg,#9b6dde,#6f44b8);}
.wclm .ava.b{background:linear-gradient(135deg,#f0a14e,#e07d2a);}
.wclm .ava.add{background:#eceaf2;color:var(--violet);display:flex;align-items:center;justify-content:center;font-size:15px;}
.wclm .sec{margin-top:20px;}
.wclm .sec-h{display:flex;align-items:center;gap:7px;font-size:13px;font-weight:600;color:var(--ink-2);margin-bottom:9px;}
.wclm .sec-h svg{color:var(--ink-3);}
.wclm .desc{font-size:13px;color:var(--ink);line-height:1.55;}
.wclm .file{display:flex;align-items:center;gap:11px;}
.wclm .file .thumb{width:54px;height:34px;border-radius:6px;flex-shrink:0;background:repeating-linear-gradient(90deg,#7d4ccf 0 3px,#4caf51 3px 6px,#ffa100 6px 9px,#f44336 9px 12px);}
.wclm .file .ft{font-size:12.5px;}
.wclm .file .ft a{color:var(--violet);border-bottom:1px solid var(--violet);}
.wclm .file .ft small{display:block;color:var(--ink-3);font-size:11px;margin-top:3px;}
.wclm .rel-head{display:flex;align-items:center;justify-content:space-between;}
.wclm .rel-tools{display:flex;align-items:center;gap:6px;}
.wclm .seg{display:flex;background:var(--violet);border-radius:7px;overflow:hidden;}
.wclm .seg span{padding:4px 7px;color:#fff;font-size:11px;display:flex;align-items:center;}
.wclm .seg span+span{border-left:1px solid rgba(255,255,255,.3);}
.wclm .rel-row{margin-top:10px;}
.wclm .rel-sub{font-size:12px;color:var(--ink-2);border-bottom:2px solid var(--violet);display:inline-block;padding-bottom:6px;font-weight:600;}
.wclm .rel-list{display:flex;align-items:center;justify-content:space-between;border:1px solid var(--line);border-radius:9px;padding:10px 12px;margin-top:10px;font-size:13px;}
.wclm .rel-list .meta{display:flex;align-items:center;gap:10px;color:var(--ink-3);font-size:11px;}
.wclm .chip-sel{display:inline-flex;align-items:center;gap:5px;border:1px solid var(--line);border-radius:7px;padding:3px 8px;font-size:11px;color:var(--ink-2);}
.wclm .comments{background:#fafafb;display:flex;flex-direction:column;}
.wclm .c-head{display:flex;align-items:center;justify-content:space-between;padding:15px 16px;border-bottom:1px solid var(--line-2);}
.wclm .c-head .t{font-weight:700;font-size:15px;}
.wclm .c-head .ic{display:flex;gap:14px;color:var(--ink-3);}
.wclm .c-filter{display:flex;align-items:center;justify-content:flex-end;gap:8px;padding:10px 16px 0;}
.wclm .c-filter .all{display:inline-flex;align-items:center;gap:5px;border:1px solid var(--line);border-radius:7px;padding:3px 9px;font-size:11px;color:var(--ink-2);}
.wclm .c-filter .lay{display:flex;gap:9px;color:var(--ink-3);}
.wclm .c-input{margin:11px 16px 0;border:1px solid var(--line);border-radius:9px;padding:9px 11px;font-size:12px;color:var(--ink-3);display:flex;align-items:center;gap:8px;background:#fff;}
.wclm .c-select{margin:9px 16px 4px;border:1px solid var(--line);border-radius:9px;padding:9px 11px;font-size:12px;color:var(--ink-3);display:flex;align-items:center;justify-content:space-between;background:#fff;}
.wclm .c-list{padding:6px 16px 18px;overflow:auto;display:flex;flex-direction:column;gap:14px;}
.wclm .cm{display:flex;gap:9px;}
.wclm .cm .av{width:26px;height:26px;border-radius:50%;flex-shrink:0;}
.wclm .cm .av.al{background:linear-gradient(135deg,#5b8def,#3a6bd0);}
.wclm .cm .av.ek{background:linear-gradient(135deg,#ef6ea1,#d0407a);}
.wclm .cm .av.an{background:linear-gradient(135deg,#9b6dde,#6f44b8);}
.wclm .cm .body{flex:1;min-width:0;}
.wclm .cm .name{font-size:12.5px;font-weight:600;}
.wclm .cm .name small{color:var(--ink-3);font-weight:400;margin-left:6px;font-size:10.5px;}
.wclm .cm .bubble{margin-top:5px;border-radius:9px;padding:8px 10px;font-size:12px;line-height:1.5;color:var(--ink);}
.wclm .cm .bubble.note{background:var(--orange-bg);}
.wclm .cm .bubble.reply{background:#eef0f3;}
.wclm .cm .bubble .mention{color:var(--violet);font-weight:600;}
.wclm .cm .acts{margin-top:6px;font-size:10.5px;color:var(--ink-3);}
.wclm .cm .acts a{color:var(--violet);}
`;

export function WindowCardLegendMock() {
  return (
    <div className="wclm" aria-hidden>
      <style>{css}</style>
      <div className="stage">
        {/* ───── левая легенда ───── */}
        <div className="legend legend-left">
          <div className="tag" style={{ top: 224 }}>Информация о заказчике</div>
          <div className="tag" style={{ top: 380 }}>Ответственный за заявку</div>
          <div className="tag" style={{ top: 470 }}>Срок выполнения</div>
          <div className="tag" style={{ top: 558 }}>Описание запроса<br />и дополнительные данные</div>
          <div className="tag" style={{ top: 642 }}>Вложенные файлы</div>
          <div className="tag" style={{ top: 731 }}>Связанные задачи</div>
        </div>

        {/* ───── окно карточки ───── */}
        <div className="window">
          {/* основная панель */}
          <div className="main">
            <div className="h1">Не могу загрузить изображение</div>
            <a className="id" href="#">#54670184</a>

            <div className="toolbar">
              <div className="plus">+</div>
              <div className="progress" />
              <div className="tbtn">▶</div>
              <div className="tbtn go">→ ГОТОВО</div>
              <div className="tbtn">!</div>
              <div className="tbtn">↗</div>
              <div className="tbtn">⋯</div>
            </div>

            {/* блок техподдержки */}
            <div className="support">
              <div className="row1">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                  <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                </svg>
                Техподдержка
              </div>
              <div className="meta">
                Автор: Анна (anna@mail.ru) <a href="#">изменить</a><br />
                SLA: <a href="#">выбрать sla</a>
              </div>
              <div className="notify"><a href="#">Добавить дополнительных адресатов для получения уведомлений</a> ⓘ</div>
              <div className="new">
                <div className="l"><span className="badge-dot" /> Новые комментарии в заявке</div>
                <div className="r">ОТМЕТИТЬ КАК ПРОЧИТАННОЕ</div>
              </div>
            </div>

            {/* свойства */}
            <div className="props">
              <div className="k">Расположение</div>
              <div className="v"><a href="#">Спринт / В работе (Срочно)</a> 🔍</div>

              <div className="k">Тип</div>
              <div className="v"><span className="pill">🟪 Card</span></div>

              <div className="k">Участники</div>
              <div className="v">
                <span className="pill"><span className="ava a" /> Ответственный</span>
                <span className="ava b" />
                <span className="ava add">+</span>
              </div>

              <div className="k">Срок</div>
              <div className="v"><a href="#">22 февр.</a></div>
            </div>

            {/* описание */}
            <div className="sec">
              <div className="sec-h">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="18" x2="14" y2="18" />
                </svg>
                Описание
              </div>
              <div className="desc">Не могу загрузить изображение в статью. Пишет, что файл не подходит под стандарты.</div>
            </div>

            {/* файлы */}
            <div className="sec">
              <div className="sec-h">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                </svg>
                Файлы
              </div>
              <div className="file">
                <div className="thumb" />
                <div className="ft"><a href="#">накопительная диаграмма</a><small>Добавлен 3 минуты назад</small></div>
              </div>
            </div>

            {/* связи */}
            <div className="sec">
              <div className="sec-h rel-head">
                <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="6" cy="6" r="3" />
                    <circle cx="6" cy="18" r="3" />
                    <path d="M6 9v6M15 6h3a3 3 0 0 1 3 3v0M15 18h3a3 3 0 0 0 3-3" />
                  </svg>
                  Связи
                </span>
                <span className="rel-tools">
                  <span style={{ color: 'var(--ink-3)' }}>≡</span>
                  <span className="seg"><span>🕐</span><span>»</span><span>✓</span></span>
                </span>
              </div>
              <div className="rel-row">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="rel-sub">Дочерние карточки</span>
                  <span className="chip-sel">Список ▾</span>
                </div>
                <div className="rel-list">
                  <span>Исправить баг при добавлении GIF</span>
                  <span className="meta">👁 1{'  '}💬 1{'  '}<span className="ava a" style={{ width: 18, height: 18 }} /> 📅</span>
                </div>
              </div>
            </div>
          </div>

          {/* правая панель: комментарии */}
          <div className="comments">
            <div className="c-head">
              <div className="t">Комментарии</div>
              <div className="ic"><span>⤢</span><span>✕</span></div>
            </div>
            <div className="c-filter">
              <span className="all">Все ▾</span>
              <span className="lay">▢ ◧ ↔</span>
            </div>
            <div className="c-input">✎ Напишите комментарий</div>
            <div className="c-select"><span>Выберите шаблонный ответ</span><span>▾</span></div>

            <div className="c-list">
              <div className="cm">
                <div className="av al" />
                <div className="body">
                  <div className="name">Алексей <small>13 февр. 2026 г., 12:53</small></div>
                  <div className="bubble note"><span className="mention">@e_lebedeva</span> Зафиксировал, забираю в работу</div>
                  <div className="acts"><a href="#">цитировать</a> или <a href="#">ответить</a></div>
                </div>
              </div>

              <div className="cm">
                <div className="av ek" />
                <div className="body">
                  <div className="name">Екатерина <small>13 февр. 2026 г., 12:46</small></div>
                  <div className="bubble note"><span className="mention">@a_savin</span> Обрати внимание, что изображения формата GIF имеют проблемы с загрузкой. Нужно сделать предупреждение об этом в форме.</div>
                  <div className="acts"><a href="#">цитировать</a> или <a href="#">ответить</a></div>
                </div>
              </div>

              <div className="cm">
                <div className="av an" />
                <div className="body">
                  <div className="name">Анна <small>12 февр. 2026 г., 10:24</small></div>
                  <div className="bubble reply">Анна, проблема по вашей заявке Не могу загрузить изображение решена. Вы можете проверить, все ли у вас работает, и поставить оценку нашей службе поддержки прямо на портале Service Desk.</div>
                  <div className="acts"><a href="#">цитировать</a> или <a href="#">ответить</a></div>
                </div>
              </div>

              <div className="cm">
                <div className="av ek" />
                <div className="body">
                  <div className="name">Екатерина <small>12 февр. 2026 г., 10:20</small></div>
                  <div className="bubble reply">Здравствуйте, Анна, мы приняли вашу заявку Не могу загрузить изображение и скоро начнём над ней работать. Время ответа займёт приблизительно 10 минут.</div>
                  <div className="acts"><a href="#">цитировать</a> или <a href="#">ответить</a></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ───── правая легенда ───── */}
        <div className="legend legend-right">
          <div className="tag" style={{ top: 301 }}>Заметки специалиста,<br />которые не видны заказчику</div>
          <div className="tag" style={{ top: 609 }}>Ответы специалиста,<br />которые уходят клиенту</div>
        </div>

        {/* ───── выноски: SVG-линии от тега к уровню сущности + точка на краю окна ───── */}
        <svg className="links" preserveAspectRatio="none">
          <g fill="none" stroke="#c9b9e6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M186 224 L230 224" />
            <path d="M186 380 L201 380 Q206 380 206 385 L206 408 Q206 413 211 413 L230 413" />
            <path d="M186 470 L201 470 Q206 470 206 465 L206 454 Q206 449 211 449 L230 449" />
            <path d="M186 558 L201 558 Q206 558 206 553 L206 529 Q206 524 211 524 L230 524" />
            <path d="M186 642 L201 642 Q206 642 206 637 L206 612 Q206 607 211 607 L230 607" />
            <path d="M186 731 L230 731" />
            <path d="M994 301 L950 301" />
            <path d="M994 609 L950 609" />
          </g>
          <g fill="#7d4ccf">
            <circle cx="230" cy="224" r="4.5" />
            <circle cx="230" cy="413" r="4.5" />
            <circle cx="230" cy="449" r="4.5" />
            <circle cx="230" cy="524" r="4.5" />
            <circle cx="230" cy="607" r="4.5" />
            <circle cx="230" cy="731" r="4.5" />
            <circle cx="950" cy="301" r="4.5" />
            <circle cx="950" cy="609" r="4.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}
