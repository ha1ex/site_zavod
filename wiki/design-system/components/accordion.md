---
slug: ds-component-accordion
type: design-system
created: 2026-05-15
updated: 2026-06-29
sources:
  - design-system/kaiten-v01/tokens.json
  - vercel_index.html (лендинг «Кайтен для производств»: #control слайдер-аккордион, #faq)
related:
  - wiki/design-system/colors.md
  - wiki/design-system/motion.md
tags:
  - component
  - accordion
  - faq
stale: false
---

# Accordion

Используется для FAQ-секций и slider-аккордеонов.

## States

- **Closed.** Строка на `surface-section`, neutral text, шеврон-вниз справа.
- **Hover.** Title и иконка → violet `#7D4CCF` (`transition:color .18s`).
- **Open.** White / soft-violet panel, violet border, violet SemiBold title, шеврон повёрнут (`rotate(180deg)`), тело под заголовком.

## Motion

- Open/close — `duration-slow` (≈240ms, на лендинге 0.24–0.26s) с `ease-ui` = `cubic-bezier(.2,0,.2,1)`. Без bounce.
- **Анимируйте РЕАЛЬНУЮ высоту контента** — `height:auto` (или `block-size:auto` для `<details>`) через `interpolate-size:allow-keywords`. Плюс лёгкий `opacity`-фейд.
- Не использовать `display:none` (нет transition). Не использовать `max-height` с фиксированным верхним пределом (см. анти-паттерны).
- Иконка-шеврон: `transform:rotate(180deg)` при `.open` (`transition:transform .24s`).

### Рецепт плавного раскрытия (без рывка)

`max-height` с большим пределом (260px/1000px и т.п.) НЕ совпадает с реальной высотой контента → при закрытии сначала «съедается» пустой запас → **дёрганье**. Правильно — интерполяция к `auto`:

```css
.wrap { interpolate-size: allow-keywords; }   /* наследуется; включает интерполяцию к auto */
.body { height:0; opacity:0; overflow:hidden;
        transition: height .26s cubic-bezier(.2,0,.2,1), opacity .2s ease; }
.open .body { height:auto; opacity:1; }
```

Поддержка `interpolate-size` — Chrome 129+. Без поддержки раскрытие мгновенное (без рывка, но без анимации) — мягкая деградация.

## Usage rules

- 2–12 пар Q&A в одной секции (`FAQSection` в `packages/harness/src/registry/index.ts`).
- Ответы — `10..600` символов.
- **Default — открыт один пункт за раз** (эксклюзив). Multi-open допустим, но не по умолчанию.

## Anti-patterns

- ❌ `display:none` для тела (нет transition).
- ❌ Анимировать `max-height` фиксированным пределом — даёт рывок (несовпадение с реальной высотой). Используйте `height/block-size:auto` + `interpolate-size` (а где его нет — мягко падать на мгновенное раскрытие или JS-измерение высоты).
- ❌ Длинные ответы (>600 символов) — это статья, не FAQ. Дробите.

---

## Реализация на лендинге (vercel_index.html)

### A. Слайдер-аккордион `#control` (список пунктов + медиа-панель со слайдом)

HTML:
```html
<div class="acc-wrap">
  <div class="acc">
    <div class="acc-intro"><h2 class="acc-h">…</h2><p class="acc-sub">…</p></div>
    <div class="acc-item">                       <!-- .open = раскрытый -->
      <button class="acc-head"><span class="acc-title">…</span>
        <span class="acc-ic"><svg>…шеврон…</svg></span></button>
      <div class="acc-body"><p>…</p><img class="acc-bmedia" src="…/sliderN.png"></div>
    </div> …
  </div>
  <div class="acc-media">                         <!-- слайд-панель (десктоп/планшет) -->
    <div class="acc-panel on"><img src="…/slider1.png"></div>
    <div class="acc-panel"><img src="…/slider2.png"></div> …
  </div>
</div>
```

CSS (ключевое):
```css
.acc-wrap{display:grid;grid-template-columns:1fr 1fr;gap:var(--sp-8);align-items:stretch;margin-top:var(--sp-12)}
.acc{display:flex;flex-direction:column;gap:var(--sp-3);interpolate-size:allow-keywords}
.acc-item{background:var(--surface-section);border:1px solid transparent;border-radius:12px;overflow:hidden;
          transition:border-color .2s,box-shadow .2s,background .2s}
.acc-item.open{background:#fff;border-color:var(--brand-100);box-shadow:0 2px 10px -4px rgba(125,76,207,.18)}
.acc-head{display:flex;align-items:center;justify-content:space-between;gap:var(--sp-4);padding:var(--sp-5);
          background:none;border:0;cursor:pointer;text-align:left}
.acc-title{font-size:var(--fs-lg);line-height:1.3;font-weight:var(--fw-reg);color:var(--text-title);transition:color .18s}
.acc-head:hover .acc-title,.acc-item.open .acc-title{color:var(--brand-100)}
.acc-item.open .acc-title{font-weight:var(--fw-semi)}
.acc-ic svg{width:20px;height:20px;transition:transform .24s ease}
.acc-item.open .acc-ic{color:var(--brand-100)} .acc-item.open .acc-ic svg{transform:rotate(180deg)}
/* раскрытие по реальной высоте */
.acc-body{height:0;opacity:0;overflow:hidden;transition:height .26s cubic-bezier(.2,0,.2,1),opacity .2s ease}
.acc-item.open .acc-body{height:auto;opacity:1}
.acc-body p{color:#2D2D2D;font-size:var(--fs-md);line-height:var(--lh-md);padding:0 var(--sp-5) var(--sp-5)}
/* медиа-панель */
.acc-media{justify-self:center;align-self:center;width:100%;max-width:592px;aspect-ratio:1/1;
           background:linear-gradient(180deg,#ece0ff,#cdecff);border-radius:16px;overflow:hidden;display:grid;place-items:stretch}
.acc-media img{width:100%;height:auto;display:block}
.acc-panel{grid-area:1/1;width:100%;height:100%;display:flex;align-items:flex-end;justify-content:center;  /* картинка по НИЗУ */
           opacity:0;visibility:hidden;transform:translateY(10px);transition:opacity .28s,transform .28s}
.acc-panel.on{opacity:1;visibility:visible;transform:none}
```

Адаптив:
```css
@media(max-width:860px){.acc-wrap{grid-template-columns:1fr;gap:var(--sp-8)}}                  /* стопкой */
@media(min-width:861px) and (max-width:1279px){.acc-media{align-self:stretch;aspect-ratio:auto}} /* планшет: медиа по высоте аккордеона */
.acc-bmedia{display:none}                                                                      /* картинка внутри пункта — только мобилка */
@media(max-width:767px){
  .acc-media{display:none}
  .acc-bmedia{display:block;width:100%;height:auto;margin:0;border-radius:0}                    /* во всю ширину */
  .acc-item.open{background:linear-gradient(180deg,#ece0ff,#cdecff)}                            /* раскрытая карточка — градиент */
}
```
Десктоп/планшет: слайд в правой панели `.acc-media`. Мобилка ≤767: панели нет, картинка `.acc-bmedia` внутри раскрытого пункта во всю ширину, карточка — на градиенте.

JS (открыт один пункт + слайд синхронен пункту):
```js
(function(){
  var items=[].slice.call(document.querySelectorAll('#control .acc-item')),
      panels=[].slice.call(document.querySelectorAll('#control .acc-panel'));
  if(!items.length) return;
  function open(i){
    items.forEach(function(it,j){ it.classList.toggle('open', j===i); });
    panels.forEach(function(p,j){ p.classList.toggle('on', j===i); });
  }
  items.forEach(function(it,i){ it.querySelector('.acc-head').addEventListener('click',function(){ open(i); }); });
  open(0);                                   // по умолчанию открыт первый
})();
```

### B. FAQ `#faq` (нативные `<details class="faq-item">`)

```css
.faq-item{ …; interpolate-size:allow-keywords }
.faq-item::details-content{block-size:0;overflow:hidden;opacity:0;
  transition:block-size .24s cubic-bezier(.2,0,.2,1),opacity .2s ease,content-visibility .24s allow-discrete}
.faq-item[open]::details-content{block-size:auto;opacity:1}
.faq-item:hover .faq-item__q-text{color:var(--brand-100)}   /* hover — фиолетовый вопрос */
```
JS (открыт один вопрос; в разметке `open` только у первого):
```js
(function(){
  var items=[].slice.call(document.querySelectorAll('#faq .faq-item'));
  items.forEach(function(d){ d.addEventListener('toggle',function(){
    d.setAttribute('aria-expanded', d.open?'true':'false');
    if(d.open){ items.forEach(function(o){ if(o!==d && o.open){ o.open=false; } }); }
  }); });
})();
```

## Чек-лист «спокойного» аккордиона
- Реальная высота (`height/block-size:auto` + `interpolate-size`), НЕ `max-height` фикс.
- 0.24–0.26s, `cubic-bezier(.2,0,.2,1)`, без bounce.
- Открыт один пункт (JS-эксклюзив).
- `overflow:hidden` + лёгкий `opacity`-фейд; шеврон `rotate(180deg)`.
- Акцент раскрытого/hover — `var(--brand-100)` `#7D4CCF`.
