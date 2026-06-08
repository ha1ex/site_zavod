# Reviews (Отзывы)

Компонент секции отзывов «Нас часто спрашивают». Три адаптивных варианта: Desktop, Tablet, Mobile. На Desktop при 4+ отзывах отображаются кнопки прокрутки ‹ ›. На Tablet и Mobile — горизонтальный скролл с пагинацией `1 / 4`.

---

## Figma

| Вариант | Node ID | Ссылка |
|---------|---------|--------|
| Section (все) | `3126:29829` | [Открыть](https://www.figma.com/design/6M8lLx2PgVTxwXMeRiOVH4/Landing-DS?node-id=3126-29829) |
| Desktop | `3126:29830` | [Открыть](https://www.figma.com/design/6M8lLx2PgVTxwXMeRiOVH4/Landing-DS?node-id=3126-29830) |
| Tablet | `3126:29983` | [Открыть](https://www.figma.com/design/6M8lLx2PgVTxwXMeRiOVH4/Landing-DS?node-id=3126-29983) |
| Mobile | `3126:33299` | [Открыть](https://www.figma.com/design/6M8lLx2PgVTxwXMeRiOVH4/Landing-DS?node-id=3126-33299) |

---

## Anatomy

### Desktop (`≥ 1280px`) · node `3126:29830`

```
┌── 1920px, bg #f5f5f5, py 80px px 112px ─────────────────────────────────────┐
│  ┌── Container 1280px, gap 48px, px 32px ─────────────────────────────────┐ │
│  │  SectionTitleK (Center, 640px, showSubheading=false)                    │ │
│  │  Более 200 тысяч компаний выбирают Кайтен  (36px SemiBold)             │ │
│  │  описание                                  (16px Regular)              │ │
│  │                                                                         │ │
│  │  ┌── Section, gap 32px ──────────────────────────────────────────────┐ │ │
│  │  │  [Otziv 384px]  [Otziv 384px]  [Otziv 384px]  [Otziv 384px off] │ │ │
│  │  └───────────────────────────────────────────────────────────────────┘ │ │
│  │                                                                         │ │
│  │  ┌── Buttons (gap 14px, centered) ───────────────────────────────────┐ │ │
│  │  │  [◁ 48×48 outline circle]  [▷ 48×48 outline circle]              │ │ │
│  │  └───────────────────────────────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
Кнопки Prev/Next появляются только если отзывов > 3.
```

### Tablet (`768px – 1279px`) · node `3126:29983`

```
┌── 769px, bg #f5f5f5, pt 64px pb 32px px 24px ──────────────────────────────┐
│  ┌── Container 721px, gap 32px ──────────────────────────────────────────┐  │
│  │  Section Title (24px SemiBold)                                         │  │
│  │                                                                         │  │
│  │  ┌── Frame overflow-x hidden, gap 24px ─────────────────────────────┐ │  │
│  │  │  [Otziv 318px]  [Otziv 318px]  [Otziv clip]                     │ │  │
│  │  └──────────────────────────────────────────────────────────────────┘ │  │
│  │                                                                         │  │
│  │  ┌── Buttons (centered), gap 14px ─────────────────────────────────┐  │  │
│  │  │  [◁ 40×40 outline]  1 / 4  [▷ 40×40 filled #7d4ccf]            │  │  │
│  │  └─────────────────────────────────────────────────────────────────┘  │  │
│  └─────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Mobile (`< 768px`) · node `3126:33299`

```
┌── 360px, bg #f5f5f5, pt 48px pb 24px px 16px ─────────────────────┐
│  ┌── Container 328px, gap 24px ─────────────────────────────────┐  │
│  │  Section Title (24px SemiBold, left-aligned)                  │  │
│  │                                                               │  │
│  │  ┌── Frame overflow-x hidden, gap 16px ──────────────────┐  │  │
│  │  │  [Otziv 318px]  [Otziv 318px clip]                    │  │  │
│  │  └───────────────────────────────────────────────────────┘  │  │
│  │                                                               │  │
│  │  ┌── Buttons (centered), gap 14px ──────────────────────┐   │  │
│  │  │  [◁ 40×40 outline]  1 / 4  [▷ 40×40 filled #7d4ccf] │   │  │
│  │  └──────────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────┘
```

---

## Otziv card — Tokens

### Desktop card (`384×460px`, `border-radius: 16px`)

| Свойство | Значение | Токен |
|----------|---------|-------|
| Фон карточки | `#ffffff` | `--background/white/secondary` |
| border-radius | `16px` | `--border-radius/rounded-2xl` |
| padding | `24px` | `--spacing/6` |
| gap внутри | `24px` | `--spacing/6` |
| Размер логотипа | `180×60px` | — |
| Кавычка `"` | `79×60px` | повёрнута `rotate(180deg)` |
| Текст отзыва | `16px Regular #757575` | `--text/secondary-text-color` |
| Аватар | `56×56px circle` | `--border-radius/rounded-full` |
| Имя | `16px Medium #2d2d2d` | `--text/text-color` |
| Должность | `16px Regular #757575` | `--text/secondary-text-color` |
| Кнопка | `outline, py 10px px 16px, r 8px` | — |
| Кнопка текст | `16px Medium #7d4ccf` | `--text/brand-color` |

### Tablet/Mobile card (`318×372px`, `border-radius: 12px`)

| Свойство | Значение | Токен |
|----------|---------|-------|
| border-radius | `12px` | `--border-radius/rounded-xl` |
| padding | `16px` | `--spacing/4` |
| Кавычка `"` | `64×48px` | повёрнута `rotate(180deg)` |
| Текст отзыва | `14px Regular #757575` | — |
| Имя | `14px Medium #2d2d2d` | — |
| Должность | `14px Regular #757575` | — |
| Кнопка | `full-width, py 10px, px 14px, r 8px` | — |
| Кнопка текст | `14px Medium #7d4ccf` | — |

### Кнопки навигации

| Вариант | Размер | Фон | Состояние |
|---------|--------|-----|-----------|
| Desktop Prev `◁` | `48×48px`, `p 12px` | `white, border #e0e0e0` | outline circle |
| Desktop Next `▷` | `48×48px`, `p 12px` | `white, border #e0e0e0` | outline circle |
| Tablet/Mobile Prev `◁` | `40×40px`, `p 10px` | `white, border #e0e0e0` | outline circle |
| Tablet/Mobile Next `▷` | `40×40px`, `p 10px` | `#7d4ccf` filled | filled circle |

Счётчик пагинации (`1 / 4`): активная цифра `16px Medium #7d4ccf`, разделитель `16px Regular #2d2d2d`.

---

## Assets

| Ключ | URL (Figma MCP) | Использование |
|------|-----------------|---------------|
| `imgQuote-desktop` | `https://www.figma.com/api/mcp/asset/9625d0e9-7374-4f7f-811d-2c76a9dbb952` | Кавычка `"` Desktop |
| `imgAvatar-desktop` | `https://www.figma.com/api/mcp/asset/7f600b60-5305-4f01-9d27-30859fa6e99b` | Аватар Desktop |
| `imgArrowLeft-desktop` | `https://www.figma.com/api/mcp/asset/8ea32f40-1558-43dd-a8a7-f05505c74f26` | Стрелка ← Desktop |
| `imgArrowRight-desktop` | `https://www.figma.com/api/mcp/asset/6160d59c-5389-482f-ada6-2b67baaa3273` | Стрелка → Desktop |
| `imgQuote-tablet` | `https://www.figma.com/api/mcp/asset/fbee3c38-3055-47d0-9379-a6ae01629f43` | Кавычка `"` Tablet |
| `imgAvatar-tablet` | `https://www.figma.com/api/mcp/asset/f773449a-4b56-4b16-b16c-8e92a56d8991` | Аватар Tablet |
| `imgArrowLeft-tablet` | `https://www.figma.com/api/mcp/asset/58eb0ac6-e49f-4770-a1a3-ad107bd11968` | Стрелка ← Tablet |
| `imgArrowRight-tablet` | `https://www.figma.com/api/mcp/asset/04d0c205-d724-4b41-8ef0-39b96903735d` | Стрелка → Tablet |
| `imgQuote-mobile` | `https://www.figma.com/api/mcp/asset/26ed0ba1-1adf-4e0d-8126-86487def38e2` | Кавычка `"` Mobile |
| `imgAvatar-mobile` | `https://www.figma.com/api/mcp/asset/79e9313d-512f-49d5-b1ca-a14c69d8936d` | Аватар Mobile |
| `imgArrowLeft-mobile` | `https://www.figma.com/api/mcp/asset/76d54aa9-35e9-4f0d-8579-1f0ded2e1144` | Стрелка ← Mobile |
| `imgArrowRight-mobile` | `https://www.figma.com/api/mcp/asset/ac424d2e-ef62-4a2e-9b6d-a3d010f205a0` | Стрелка → Mobile |

> ⚠️ Ссылки на ассеты действуют **7 дней** с даты генерации.

---

## HTML + CSS + JS

```html
<!-- ============================================================
     REVIEWS SECTION COMPONENT
     Desktop  ≥ 1280px : 3 карточки видимы, кнопки ← → без счётчика
     Tablet   768–1279px: 2 карточки видимы, пагинация 1/N, → filled violet
     Mobile   < 768px  : 1 карточка видима, пагинация 1/N, → filled violet
     bg: #f5f5f5
     ============================================================ -->

<style>
  /* ── Design Tokens ─────────────────────────────────────────── */
  :root {
    --reviews-bg:            #f5f5f5;  /* --background/gray/secondary_alt_2 */
    --card-bg:               #ffffff;  /* --background/white/secondary      */
    --text-title:            #2d2d2d;  /* --text/title-color                */
    --text-body:             #2d2d2d;  /* --text/text-color                 */
    --text-secondary:        #757575;  /* --text/secondary-text-color       */
    --text-brand:            #7d4ccf;  /* --text/brand-color                */
    --btn-outline-bg:        #ffffff;  /* --button/primary-outline/background */
    --btn-outline-border:    #e0e0e0;  /* --button/disabled/outline/border  */
    --btn-filled-bg:         #7d4ccf;  /* --colors/brand/500                */
    --btn-filled-text:       #ffffff;
    --radius-2xl:            16px;     /* --border-radius/rounded-2xl       */
    --radius-xl:             12px;     /* --border-radius/rounded-xl        */
    --radius-lg:             8px;      /* --border-radius/rounded-lg        */
    --radius-full:           9999px;   /* --border-radius/rounded-full      */
    --ls:                    -0.2px;
    --font:                  'Roboto', sans-serif;
    --fw-reg:  400;
    --fw-med:  500;
    --fw-semi: 600;

    /* spacing */
    --sp-0:   0px;   --sp-1:   4px;   --sp-2:   8px;
    --sp-3:   12px;  --sp-3-5: 14px;  --sp-4:   16px;
    --sp-5:   20px;  --sp-6:   24px;  --sp-8:   32px;
    --sp-12:  48px;  --sp-16:  64px;  --sp-20:  80px;
    --sp-24:  96px;  --sp-28:  112px;

    /* type scale */
    --fs-sm:  14px; --lh-sm:  20px;
    --fs-md:  16px; --lh-md:  24px;
    --fs-4xl: 36px; --lh-4xl: 40px;
    --fs-2xl: 24px; --lh-2xl: 32px;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── Section wrapper ───────────────────────────────────────── */
  .reviews {
    background-color: var(--reviews-bg);
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: var(--font);
  }

  /* ════════════════════════════════════════════════════════════
     DESKTOP  ≥ 1280px
     node 3126:29830
     ════════════════════════════════════════════════════════════ */
  .reviews--desktop {
    padding: var(--sp-20) var(--sp-28);  /* py 80px px 112px */
    display: flex;
  }
  .reviews--desktop .reviews__container {
    display: flex;
    flex-direction: column;
    gap: var(--sp-12);              /* 48px */
    align-items: center;
    padding: 0 var(--sp-8);         /* px 32px */
    width: 1280px;
    flex-shrink: 0;
  }

  /* ── Section title — Desktop ───────────────────────────────── */
  .reviews__section-title--desktop {
    display: flex;
    flex-direction: column;
    gap: var(--sp-4);               /* 16px */
    align-items: center;
    width: 640px;
    flex-shrink: 0;
  }
  .reviews__heading--desktop {
    font-size: var(--fs-4xl);
    font-weight: var(--fw-semi);
    line-height: var(--lh-4xl);
    /* letter-spacing: 0 per Figma Text 4xl/Semibold */
    color: var(--text-title);
    text-align: center;
    width: 100%;
    font-variation-settings: "wdth" 100;
  }
  .reviews__subtext--desktop {
    font-size: var(--fs-md);
    font-weight: var(--fw-reg);
    line-height: var(--lh-md);
    letter-spacing: var(--ls);
    color: var(--text-title);
    text-align: center;
    width: 100%;
    font-variation-settings: "wdth" 100;
  }

  /* ── Cards track — Desktop ─────────────────────────────────── */
  .reviews__track-wrap--desktop {
    width: 100%;
    overflow: hidden;               /* clip 4-й карточки */
    position: relative;
  }
  .reviews__track--desktop {
    display: flex;
    gap: var(--sp-8);               /* 32px */
    align-items: flex-start;
    padding: 0;
    width: max-content;
    transition: transform 0.35s ease;
  }

  /* ── Otziv card — Desktop (384×460px) ──────────────────────── */
  .otziv--desktop {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    flex-shrink: 0;
    width: 384px;
  }
  .otziv__inner--desktop {
    background: var(--card-bg);
    display: flex;
    flex-direction: column;
    gap: var(--sp-6);               /* 24px */
    height: 460px;
    align-items: flex-start;
    padding: var(--sp-6);           /* 24px */
    border-radius: var(--radius-2xl);
    width: 100%;
    position: relative;
    overflow: hidden;
  }

  /* ── review and star block ─────────────────────────────────── */
  .otziv__top {
    display: flex;
    flex-direction: column;
    gap: var(--sp-6);
    align-items: flex-start;
    width: 100%;
    flex-shrink: 0;
  }
  .otziv__top--desktop { height: 248px; }
  .otziv__top--sm      { flex: 1 0 0; min-height: 0; }

  /* Logo + quote row */
  .otziv__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    overflow: hidden;
    width: 100%;
    flex-shrink: 0;
  }
  .otziv__header--desktop { height: 60px; }
  .otziv__header--sm      { height: 48px; }

  .otziv__logo--desktop { width: 180px; height: 60px; flex-shrink: 0; }
  .otziv__logo--sm      { width: 180px; height: 48px; flex-shrink: 0; }

  /* Quotation mark " — rotated 180deg */
  .otziv__quote {
    transform: rotate(180deg);
    flex-shrink: 0;
    display: block;
  }
  .otziv__quote--desktop { width: 79px;  height: 60px; }
  .otziv__quote--sm      { width: 64px;  height: 48px; }
  .otziv__quote img { display: block; width: 100%; height: 100%; }

  /* Review text */
  .otziv__text {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    flex: 1 0 0;
    min-height: 0;
  }
  .otziv__text p {
    font-weight: var(--fw-reg);
    letter-spacing: var(--ls);
    color: var(--text-secondary);
    word-break: break-word;
    font-variation-settings: "wdth" 100;
    flex: 1 0 0;
    min-width: 0;
  }
  .otziv__text--desktop p { font-size: var(--fs-md); line-height: var(--lh-md); }
  .otziv__text--sm     p { font-size: var(--fs-sm); line-height: var(--lh-sm); }

  /* Avatar + name block */
  .otziv__author {
    display: flex;
    gap: var(--sp-4);
    align-items: flex-start;
    width: 100%;
    flex-shrink: 0;
  }
  .otziv__avatar {
    border-radius: var(--radius-full);
    flex-shrink: 0;
    overflow: hidden;
    position: relative;
  }
  .otziv__avatar--desktop { width: 56px; height: 56px; }
  .otziv__avatar--sm      { width: 56px; height: 56px; }
  .otziv__avatar img { display: block; width: 100%; height: 100%; object-fit: cover; }

  .otziv__author-text {
    display: flex;
    flex-direction: column;
    gap: 0;
    align-items: flex-start;
    letter-spacing: var(--ls);
    flex: 1 0 0;
    min-width: 0;
  }
  .otziv__author-name {
    font-weight: var(--fw-med);
    color: var(--text-body);
    word-break: break-word;
    font-variation-settings: "wdth" 100;
    width: 100%;
  }
  .otziv__author-role {
    font-weight: var(--fw-reg);
    color: var(--text-secondary);
    word-break: break-word;
    font-variation-settings: "wdth" 100;
    width: 100%;
  }
  .otziv__author-text--desktop .otziv__author-name,
  .otziv__author-text--desktop .otziv__author-role {
    font-size: var(--fs-md); line-height: var(--lh-md);
  }
  .otziv__author-text--sm .otziv__author-name,
  .otziv__author-text--sm .otziv__author-role {
    font-size: var(--fs-sm); line-height: var(--lh-sm);
  }

  /* "Читать кейс" button */
  .otziv__btn {
    background: var(--btn-outline-bg);
    border: 1px solid var(--btn-outline-border);
    border-radius: var(--radius-lg);
    display: flex;
    gap: 4px;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    cursor: pointer;
    text-decoration: none;
    flex-shrink: 0;
  }
  .otziv__btn--desktop {
    padding: 10px var(--sp-4);      /* py 10px px 16px */
    /* width auto — Desktop */
  }
  .otziv__btn--full-width {
    padding: 10px var(--sp-3-5);    /* py 10px px 14px */
    width: 100%;
    justify-content: center;
  }
  .otziv__btn-text {
    font-family: var(--font);
    font-weight: var(--fw-med);
    letter-spacing: var(--ls);
    color: var(--text-brand);
    white-space: nowrap;
    font-variation-settings: "wdth" 100;
    padding: 0 4px;
  }
  .otziv__btn--desktop .otziv__btn-text {
    font-size: var(--fs-md); line-height: var(--lh-md);
  }
  .otziv__btn--full-width .otziv__btn-text {
    font-size: var(--fs-sm); line-height: var(--lh-sm);
  }

  /* ── Navigation buttons — Desktop ──────────────────────────── */
  .reviews__nav--desktop {
    display: flex;
    gap: var(--sp-3-5);             /* 14px */
    align-items: center;
    flex-shrink: 0;
  }

  /* Desktop nav button: 48×48px, p 12px, outline circle */
  .nav-btn--desktop {
    background: var(--btn-outline-bg);
    border: 1px solid var(--btn-outline-border);
    border-radius: var(--radius-full);
    width: 48px; height: 48px;
    padding: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    cursor: pointer;
    flex-shrink: 0;
  }
  .nav-btn--desktop img { display: block; width: 24px; height: 24px; }

  /* Disabled state */
  .nav-btn--disabled {
    opacity: 0.35;
    cursor: default;
    pointer-events: none;
  }

  /* Desktop: кнопки видимы только если отзывов > 3 */
  .reviews__nav--desktop[data-hidden="true"] {
    display: none;
  }

  /* ════════════════════════════════════════════════════════════
     TABLET  768–1279px
     node 3126:29983
     ════════════════════════════════════════════════════════════ */
  .reviews--tablet {
    padding-top: var(--sp-16);      /* 64px */
    padding-bottom: var(--sp-8);    /* 32px */
    padding-left: var(--sp-6);      /* 24px */
    padding-right: var(--sp-6);
    display: flex;
  }
  .reviews--tablet .reviews__container {
    display: flex;
    flex-direction: column;
    gap: var(--sp-8);               /* 32px */
    align-items: flex-start;
    width: 100%;
  }

  /* ── Section title — Tablet ────────────────────────────────── */
  .reviews__section-title--tablet {
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: center;
    width: 100%;
    flex-shrink: 0;
    text-align: center;
  }
  .reviews__heading--tablet {
    font-size: var(--fs-2xl);
    font-weight: var(--fw-semi);
    line-height: var(--lh-2xl);
    letter-spacing: var(--ls);
    color: var(--text-title);
    text-align: center;
    width: 100%;
    font-variation-settings: "wdth" 100;
  }
  .reviews__subtext--tablet {
    font-size: var(--fs-sm);
    font-weight: var(--fw-reg);
    line-height: var(--lh-sm);
    color: var(--text-body);
    text-align: center;
    width: 100%;
    font-variation-settings: "wdth" 100;
  }

  /* ── Cards track — Tablet ──────────────────────────────────── */
  .reviews__track-wrap--tablet {
    width: 100%;
    overflow: hidden;
    flex-shrink: 0;
    padding-right: 16px;            /* clip правого края */
  }
  .reviews__track--tablet {
    display: flex;
    gap: var(--sp-6);               /* 24px */
    align-items: flex-start;
    width: max-content;
    transition: transform 0.35s ease;
  }

  /* ── Otziv card — Tablet/Mobile (318×372px) ─────────────────── */
  .otziv--sm {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    flex-shrink: 0;
    width: 328px;                   /* outer wrapper */
  }
  .otziv__inner--sm {
    background: var(--card-bg);
    display: flex;
    flex-direction: column;
    gap: var(--sp-6);               /* 24px */
    align-items: flex-start;
    padding: var(--sp-4);           /* 16px */
    border-radius: var(--radius-xl); /* 12px */
    width: 318px;                   /* inner card */
    position: relative;
    overflow: hidden;
  }

  /* ── Navigation — Tablet (centered, with counter) ──────────── */
  .reviews__nav--tablet {
    display: flex;
    gap: var(--sp-3-5);             /* 14px */
    align-items: center;
    justify-content: center;
    width: 100%;
    flex-shrink: 0;
  }

  /* Tablet/Mobile nav button small: 40×40px, p 10px */
  .nav-btn--sm-outline {
    background: var(--btn-outline-bg);
    border: 1px solid var(--btn-outline-border);
    border-radius: var(--radius-full);
    width: 40px; height: 40px;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    cursor: pointer;
    flex-shrink: 0;
  }
  .nav-btn--sm-outline img { display: block; width: 20px; height: 20px; }

  /* Tablet/Mobile Next button — filled Violet */
  .nav-btn--sm-filled {
    background: var(--btn-filled-bg); /* #7d4ccf */
    border: none;
    border-radius: var(--radius-full);
    width: 40px; height: 40px;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    cursor: pointer;
    flex-shrink: 0;
  }
  .nav-btn--sm-filled img { display: block; width: 20px; height: 20px; }

  /* Pagination counter "1 / 4" */
  .reviews__counter {
    font-family: var(--font);
    font-size: var(--fs-md);
    font-weight: var(--fw-reg);
    line-height: var(--lh-md);
    letter-spacing: var(--ls);
    color: var(--text-title);
    white-space: nowrap;
    flex-shrink: 0;
    font-variation-settings: "wdth" 100;
  }
  .reviews__counter-current {
    font-weight: var(--fw-med);
    color: var(--text-brand);       /* #7d4ccf */
  }

  /* ════════════════════════════════════════════════════════════
     MOBILE  < 768px
     node 3126:33299
     ════════════════════════════════════════════════════════════ */
  .reviews--mobile {
    padding-top: var(--sp-12);      /* 48px */
    padding-bottom: var(--sp-6);    /* 24px */
    padding-left: var(--sp-4);      /* 16px */
    padding-right: var(--sp-4);
    display: flex;
  }
  .reviews--mobile .reviews__container {
    display: flex;
    flex-direction: column;
    gap: var(--sp-6);               /* 24px */
    align-items: flex-start;
    width: 100%;
  }

  /* ── Section title — Mobile ────────────────────────────────── */
  .reviews__section-title--mobile {
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
    width: 328px;
    flex-shrink: 0;
    letter-spacing: var(--ls);
  }
  .reviews__heading--mobile {
    font-size: var(--fs-2xl);
    font-weight: var(--fw-semi);
    line-height: var(--lh-2xl);
    letter-spacing: var(--ls);
    color: var(--text-title);
    width: 100%;
    font-variation-settings: "wdth" 100;
  }
  .reviews__subtext--mobile {
    font-size: var(--fs-sm);
    font-weight: var(--fw-reg);
    line-height: var(--lh-sm);
    color: var(--text-body);
    width: 100%;
    font-variation-settings: "wdth" 100;
  }

  /* ── Cards track — Mobile ──────────────────────────────────── */
  .reviews__track-wrap--mobile {
    overflow: hidden;
    flex-shrink: 0;
    width: 100%;
  }
  .reviews__track--mobile {
    display: flex;
    gap: var(--sp-4);               /* 16px */
    align-items: flex-start;
    width: max-content;
    transition: transform 0.35s ease;
  }

  /* ── Navigation — Mobile ───────────────────────────────────── */
  .reviews__nav--mobile {
    display: flex;
    gap: var(--sp-3-5);             /* 14px */
    align-items: center;
    justify-content: center;
    width: 328px;
    flex-shrink: 0;
  }

  /* ── Responsive visibility ─────────────────────────────────── */
  .reviews--desktop { display: flex; }
  .reviews--tablet  { display: none; }
  .reviews--mobile  { display: none; }

  @media (max-width: 1279px) and (min-width: 768px) {
    .reviews--desktop { display: none; }
    .reviews--tablet  { display: flex; }
    .reviews--mobile  { display: none; }
  }
  @media (max-width: 767px) {
    .reviews--desktop { display: none; }
    .reviews--tablet  { display: none; }
    .reviews--mobile  { display: flex; }
  }
</style>


<!-- ══════════════════════════════════════════════════════════
     DESKTOP  ≥ 1280px  ·  node 3126:29830
     Кнопки ← → показываются только если отзывов > 3
     ══════════════════════════════════════════════════════════ -->
<section
  class="reviews reviews--desktop"
  data-node-id="3126:29830"
  aria-label="Отзывы клиентов"
>
  <div class="reviews__container" data-node-id="3126:29831">

    <!-- Section title -->
    <div
      class="reviews__section-title--desktop"
      data-node-id="6445:9609"
      data-name="Section Title K"
    >
      <h2 class="reviews__heading--desktop" data-node-id="2390:14409">
        Более 200 тысяч компаний выбирают Кайтен
      </h2>
      <p class="reviews__subtext--desktop" data-node-id="2390:14410">
        в IT, ритейле, производстве, строительстве, образовании и других отраслях
      </p>
    </div>

    <!-- Cards track -->
    <div class="reviews__track-wrap--desktop" data-node-id="3126:29833">
      <div class="reviews__track--desktop" id="reviews-track-desktop" data-node-id="3126:29833-inner">

        <!-- Otziv 1 · node 6445:9862 -->
        <div class="otziv--desktop" data-node-id="6445:9862">
          <div class="otziv__inner--desktop" data-node-id="I6445:9862;1213:18407">
            <div class="otziv__top otziv__top--desktop" data-node-id="I6445:9862;1213:18408">
              <div class="otziv__header otziv__header--desktop" data-node-id="I6445:9862;1213:18410">
                <div class="otziv__logo--desktop" data-node-id="I6445:9862;1213:18438">
                  <!-- место для логотипа клиента -->
                </div>
                <div class="otziv__quote otziv__quote--desktop" data-node-id="I6445:9862;1213:18412" aria-hidden="true">
                  <img src="https://www.figma.com/api/mcp/asset/9625d0e9-7374-4f7f-811d-2c76a9dbb952" alt="" />
                </div>
              </div>
              <div class="otziv__text otziv__text--desktop" data-node-id="I6445:9862;4077:44576">
                <p data-node-id="I6445:9862;1213:18413">
                  Кайтен помог нам выстроить прозрачные процессы между отделами. Теперь каждый видит статус задачи в реальном времени, а менеджеры тратят вдвое меньше времени на статусные встречи.
                </p>
              </div>
            </div>
            <div class="otziv__author" data-node-id="I6445:9862;1213:18439">
              <div class="otziv__avatar otziv__avatar--desktop" data-node-id="I6445:9862;1213:18440">
                <img src="https://www.figma.com/api/mcp/asset/7f600b60-5305-4f01-9d27-30859fa6e99b" alt="Аватар" />
              </div>
              <div class="otziv__author-text otziv__author-text--desktop" data-node-id="I6445:9862;1213:18441">
                <p class="otziv__author-name" data-node-id="I6445:9862;1213:18442">Иван Петров</p>
                <p class="otziv__author-role" data-node-id="I6445:9862;1213:18443">Руководитель проектного офиса, СберМаркет</p>
              </div>
            </div>
            <a
              class="otziv__btn otziv__btn--desktop"
              href="#"
              data-node-id="I6445:9862;1213:18415"
            >
              <span class="otziv__btn-text" data-node-id="I6445:9862;1213:18415;7140:74297">Читать кейс</span>
            </a>
          </div>
        </div><!-- /Otziv 1 -->

        <!-- Otziv 2 · node 6445:9884 -->
        <div class="otziv--desktop" data-node-id="6445:9884">
          <div class="otziv__inner--desktop" data-node-id="I6445:9884;1213:18407">
            <div class="otziv__top otziv__top--desktop" data-node-id="I6445:9884;1213:18408">
              <div class="otziv__header otziv__header--desktop">
                <div class="otziv__logo--desktop" data-node-id="I6445:9884;1213:18438"></div>
                <div class="otziv__quote otziv__quote--desktop" aria-hidden="true">
                  <img src="https://www.figma.com/api/mcp/asset/9625d0e9-7374-4f7f-811d-2c76a9dbb952" alt="" />
                </div>
              </div>
              <div class="otziv__text otziv__text--desktop">
                <p data-node-id="I6445:9884;1213:18413">
                  Перешли с Jira на Кайтен — и не пожалели. Интерфейс интуитивный, команда адаптировалась за неделю. Особенно нравится, что клиенты могут следить за ходом задач без доступа к внутренним доскам.
                </p>
              </div>
            </div>
            <div class="otziv__author" data-node-id="I6445:9884;1213:18439">
              <div class="otziv__avatar otziv__avatar--desktop">
                <img src="https://www.figma.com/api/mcp/asset/7f600b60-5305-4f01-9d27-30859fa6e99b" alt="Аватар" />
              </div>
              <div class="otziv__author-text otziv__author-text--desktop">
                <p class="otziv__author-name">Анна Смирнова</p>
                <p class="otziv__author-role">CTO, Lamoda Tech</p>
              </div>
            </div>
            <a class="otziv__btn otziv__btn--desktop" href="#">
              <span class="otziv__btn-text">Читать кейс</span>
            </a>
          </div>
        </div><!-- /Otziv 2 -->

        <!-- Otziv 3 · node 6445:9906 -->
        <div class="otziv--desktop" data-node-id="6445:9906">
          <div class="otziv__inner--desktop">
            <div class="otziv__top otziv__top--desktop">
              <div class="otziv__header otziv__header--desktop">
                <div class="otziv__logo--desktop"></div>
                <div class="otziv__quote otziv__quote--desktop" aria-hidden="true">
                  <img src="https://www.figma.com/api/mcp/asset/9625d0e9-7374-4f7f-811d-2c76a9dbb952" alt="" />
                </div>
              </div>
              <div class="otziv__text otziv__text--desktop">
                <p>
                  С Кайтеном мы наконец избавились от бесконечных переписок в мессенджерах. Всё фиксируется в карточках, ничего не теряется. Автоматизации сэкономили нам минимум 10 часов в неделю.
                </p>
              </div>
            </div>
            <div class="otziv__author">
              <div class="otziv__avatar otziv__avatar--desktop">
                <img src="https://www.figma.com/api/mcp/asset/7f600b60-5305-4f01-9d27-30859fa6e99b" alt="Аватар" />
              </div>
              <div class="otziv__author-text otziv__author-text--desktop">
                <p class="otziv__author-name">Дмитрий Козлов</p>
                <p class="otziv__author-role">Product Manager, Wildberries</p>
              </div>
            </div>
            <a class="otziv__btn otziv__btn--desktop" href="#">
              <span class="otziv__btn-text">Читать кейс</span>
            </a>
          </div>
        </div><!-- /Otziv 3 -->

        <!-- Otziv 4 · node 6445:9928 (скрыта частично, скролл) -->
        <div class="otziv--desktop" data-node-id="6445:9928">
          <div class="otziv__inner--desktop">
            <div class="otziv__top otziv__top--desktop">
              <div class="otziv__header otziv__header--desktop">
                <div class="otziv__logo--desktop"></div>
                <div class="otziv__quote otziv__quote--desktop" aria-hidden="true">
                  <img src="https://www.figma.com/api/mcp/asset/9625d0e9-7374-4f7f-811d-2c76a9dbb952" alt="" />
                </div>
              </div>
              <div class="otziv__text otziv__text--desktop">
                <p>
                  Раньше статус задачи можно было узнать только на созвоне. Теперь всё видно на доске. Кайтен — первый инструмент, который прижился у нас без давления сверху.
                </p>
              </div>
            </div>
            <div class="otziv__author">
              <div class="otziv__avatar otziv__avatar--desktop">
                <img src="https://www.figma.com/api/mcp/asset/7f600b60-5305-4f01-9d27-30859fa6e99b" alt="Аватар" />
              </div>
              <div class="otziv__author-text otziv__author-text--desktop">
                <p class="otziv__author-name">Мария Новикова</p>
                <p class="otziv__author-role">Head of Operations, Самокат</p>
              </div>
            </div>
            <a class="otziv__btn otziv__btn--desktop" href="#">
              <span class="otziv__btn-text">Читать кейс</span>
            </a>
          </div>
        </div><!-- /Otziv 4 -->

      </div><!-- /track -->
    </div><!-- /track-wrap -->

    <!-- Navigation buttons (показываются только если > 3 отзывов) -->
    <div
      class="reviews__nav--desktop"
      id="reviews-nav-desktop"
      data-node-id="3126:29864"
      role="group"
      aria-label="Листать отзывы"
    >
      <!-- Prev ← · node 3126:29865 -->
      <button
        class="nav-btn--desktop nav-btn--disabled"
        id="reviews-prev-desktop"
        aria-label="Предыдущий отзыв"
        data-node-id="3126:29865"
      >
        <img src="https://www.figma.com/api/mcp/asset/8ea32f40-1558-43dd-a8a7-f05505c74f26" alt="" aria-hidden="true" />
      </button>
      <!-- Next → · node 3126:29866 -->
      <button
        class="nav-btn--desktop"
        id="reviews-next-desktop"
        aria-label="Следующий отзыв"
        data-node-id="3126:29866"
      >
        <img src="https://www.figma.com/api/mcp/asset/6160d59c-5389-482f-ada6-2b67baaa3273" alt="" aria-hidden="true" />
      </button>
    </div>

  </div>
</section>


<!-- ══════════════════════════════════════════════════════════
     TABLET  768–1279px  ·  node 3126:29983
     ══════════════════════════════════════════════════════════ -->
<section
  class="reviews reviews--tablet"
  data-node-id="3126:29983"
  aria-label="Отзывы клиентов"
>
  <div class="reviews__container" data-node-id="3126:29984">

    <!-- Section title -->
    <div class="reviews__section-title--tablet" data-node-id="3126:29985">
      <h2 class="reviews__heading--tablet" data-node-id="I3126:29985;7638:6924">
        Более 200 тысяч компаний выбирают Кайтен
      </h2>
      <p class="reviews__subtext--tablet" data-node-id="I3126:29985;7638:6925">
        в IT, ритейле, производстве, строительстве, образовании и других отраслях
      </p>
    </div>

    <!-- Cards track -->
    <div class="reviews__track-wrap--tablet" data-node-id="3126:29986">
      <div class="reviews__track--tablet" id="reviews-track-tablet">

        <!-- Otziv 1 · node 7165:19583 -->
        <div class="otziv--sm" data-node-id="7165:19583">
          <div class="otziv__inner--sm" data-node-id="I7165:19583;0:258">
            <div class="otziv__top otziv__top--sm" data-node-id="I7165:19583;0:259">
              <div class="otziv__header otziv__header--sm">
                <div class="otziv__logo--sm"></div>
                <div class="otziv__quote otziv__quote--sm" aria-hidden="true">
                  <img src="https://www.figma.com/api/mcp/asset/fbee3c38-3055-47d0-9379-a6ae01629f43" alt="" />
                </div>
              </div>
              <div class="otziv__text otziv__text--sm">
                <p>
                  Кайтен помог нам выстроить прозрачные процессы между отделами. Теперь каждый видит статус задачи в реальном времени, а менеджеры тратят вдвое меньше времени на статусные встречи.
                </p>
              </div>
            </div>
            <div class="otziv__author">
              <div class="otziv__avatar otziv__avatar--sm">
                <img src="https://www.figma.com/api/mcp/asset/f773449a-4b56-4b16-b16c-8e92a56d8991" alt="Аватар" />
              </div>
              <div class="otziv__author-text otziv__author-text--sm">
                <p class="otziv__author-name">Иван Петров</p>
                <p class="otziv__author-role">Руководитель проектного офиса, СберМаркет</p>
              </div>
            </div>
            <a class="otziv__btn otziv__btn--full-width" href="#">
              <span class="otziv__btn-text">Читать кейс</span>
            </a>
          </div>
        </div>

        <!-- Otziv 2 · node 7165:19539 -->
        <div class="otziv--sm" data-node-id="7165:19539">
          <div class="otziv__inner--sm">
            <div class="otziv__top otziv__top--sm">
              <div class="otziv__header otziv__header--sm">
                <div class="otziv__logo--sm"></div>
                <div class="otziv__quote otziv__quote--sm" aria-hidden="true">
                  <img src="https://www.figma.com/api/mcp/asset/fbee3c38-3055-47d0-9379-a6ae01629f43" alt="" />
                </div>
              </div>
              <div class="otziv__text otziv__text--sm">
                <p>Перешли с Jira на Кайтен — и не пожалели. Интерфейс интуитивный, команда адаптировалась за неделю.</p>
              </div>
            </div>
            <div class="otziv__author">
              <div class="otziv__avatar otziv__avatar--sm">
                <img src="https://www.figma.com/api/mcp/asset/f773449a-4b56-4b16-b16c-8e92a56d8991" alt="Аватар" />
              </div>
              <div class="otziv__author-text otziv__author-text--sm">
                <p class="otziv__author-name">Анна Смирнова</p>
                <p class="otziv__author-role">CTO, Lamoda Tech</p>
              </div>
            </div>
            <a class="otziv__btn otziv__btn--full-width" href="#">
              <span class="otziv__btn-text">Читать кейс</span>
            </a>
          </div>
        </div>

        <!-- Otziv 3 · node 7165:19561 -->
        <div class="otziv--sm" data-node-id="7165:19561">
          <div class="otziv__inner--sm">
            <div class="otziv__top otziv__top--sm">
              <div class="otziv__header otziv__header--sm">
                <div class="otziv__logo--sm"></div>
                <div class="otziv__quote otziv__quote--sm" aria-hidden="true">
                  <img src="https://www.figma.com/api/mcp/asset/fbee3c38-3055-47d0-9379-a6ae01629f43" alt="" />
                </div>
              </div>
              <div class="otziv__text otziv__text--sm">
                <p>С Кайтеном мы избавились от бесконечных переписок. Всё фиксируется в карточках, ничего не теряется.</p>
              </div>
            </div>
            <div class="otziv__author">
              <div class="otziv__avatar otziv__avatar--sm">
                <img src="https://www.figma.com/api/mcp/asset/f773449a-4b56-4b16-b16c-8e92a56d8991" alt="Аватар" />
              </div>
              <div class="otziv__author-text otziv__author-text--sm">
                <p class="otziv__author-name">Дмитрий Козлов</p>
                <p class="otziv__author-role">Product Manager, Wildberries</p>
              </div>
            </div>
            <a class="otziv__btn otziv__btn--full-width" href="#">
              <span class="otziv__btn-text">Читать кейс</span>
            </a>
          </div>
        </div>

        <!-- Otziv 4 · node 7165:19517 -->
        <div class="otziv--sm" data-node-id="7165:19517">
          <div class="otziv__inner--sm">
            <div class="otziv__top otziv__top--sm">
              <div class="otziv__header otziv__header--sm">
                <div class="otziv__logo--sm"></div>
                <div class="otziv__quote otziv__quote--sm" aria-hidden="true">
                  <img src="https://www.figma.com/api/mcp/asset/fbee3c38-3055-47d0-9379-a6ae01629f43" alt="" />
                </div>
              </div>
              <div class="otziv__text otziv__text--sm">
                <p>Кайтен — первый инструмент, который прижился у нас без давления сверху. Статус задачи видно на доске, а не только на созвоне.</p>
              </div>
            </div>
            <div class="otziv__author">
              <div class="otziv__avatar otziv__avatar--sm">
                <img src="https://www.figma.com/api/mcp/asset/f773449a-4b56-4b16-b16c-8e92a56d8991" alt="Аватар" />
              </div>
              <div class="otziv__author-text otziv__author-text--sm">
                <p class="otziv__author-name">Мария Новикова</p>
                <p class="otziv__author-role">Head of Operations, Самокат</p>
              </div>
            </div>
            <a class="otziv__btn otziv__btn--full-width" href="#">
              <span class="otziv__btn-text">Читать кейс</span>
            </a>
          </div>
        </div>

      </div>
    </div>

    <!-- Navigation — Tablet · node 3126:30017 -->
    <div
      class="reviews__nav--tablet"
      data-node-id="3126:30017"
      role="group"
      aria-label="Листать отзывы"
    >
      <!-- Prev ← outline · node 3126:30018 -->
      <button
        class="nav-btn--sm-outline nav-btn--disabled"
        id="reviews-prev-tablet"
        aria-label="Предыдущий отзыв"
        data-node-id="3126:30018"
      >
        <img src="https://www.figma.com/api/mcp/asset/58eb0ac6-e49f-4770-a1a3-ad107bd11968" alt="" aria-hidden="true" />
      </button>

      <!-- Counter · node 3126:30019 -->
      <span class="reviews__counter" id="reviews-counter-tablet" data-node-id="3126:30019">
        <span class="reviews__counter-current">1</span> / 4
      </span>

      <!-- Next → filled violet · node 3126:30020 -->
      <button
        class="nav-btn--sm-filled"
        id="reviews-next-tablet"
        aria-label="Следующий отзыв"
        data-node-id="3126:30020"
      >
        <img src="https://www.figma.com/api/mcp/asset/04d0c205-d724-4b41-8ef0-39b96903735d" alt="" aria-hidden="true" />
      </button>
    </div>

  </div>
</section>


<!-- ══════════════════════════════════════════════════════════
     MOBILE  < 768px  ·  node 3126:33299
     ══════════════════════════════════════════════════════════ -->
<section
  class="reviews reviews--mobile"
  data-node-id="3126:33299"
  aria-label="Отзывы клиентов"
>
  <div class="reviews__container" data-node-id="3126:33300">

    <!-- Section title (left-aligned) -->
    <div class="reviews__section-title--mobile" data-node-id="3126:33301">
      <h2 class="reviews__heading--mobile" data-node-id="I3126:33301;7638:6924">
        Более 200 тысяч компаний выбирают Кайтен
      </h2>
      <p class="reviews__subtext--mobile" data-node-id="I3126:33301;7638:6925">
        в IT, ритейле, производстве, строительстве, образовании и других отраслях
      </p>
    </div>

    <!-- Cards track -->
    <div class="reviews__track-wrap--mobile" data-node-id="6446:14863">
      <div class="reviews__track--mobile" id="reviews-track-mobile">

        <!-- Otziv 1 · node 6445:10129 -->
        <div class="otziv--sm" data-node-id="6445:10129">
          <div class="otziv__inner--sm">
            <div class="otziv__top otziv__top--sm">
              <div class="otziv__header otziv__header--sm">
                <div class="otziv__logo--sm"></div>
                <div class="otziv__quote otziv__quote--sm" aria-hidden="true">
                  <img src="https://www.figma.com/api/mcp/asset/26ed0ba1-1adf-4e0d-8126-86487def38e2" alt="" />
                </div>
              </div>
              <div class="otziv__text otziv__text--sm">
                <p>Кайтен помог нам выстроить прозрачные процессы. Теперь каждый видит статус задачи в реальном времени.</p>
              </div>
            </div>
            <div class="otziv__author">
              <div class="otziv__avatar otziv__avatar--sm">
                <img src="https://www.figma.com/api/mcp/asset/79e9313d-512f-49d5-b1ca-a14c69d8936d" alt="Аватар" />
              </div>
              <div class="otziv__author-text otziv__author-text--sm">
                <p class="otziv__author-name">Иван Петров</p>
                <p class="otziv__author-role">Руководитель проектного офиса, СберМаркет</p>
              </div>
            </div>
            <a class="otziv__btn otziv__btn--full-width" href="#">
              <span class="otziv__btn-text">Читать кейс</span>
            </a>
          </div>
        </div>

        <!-- Otziv 2 · node 6446:14731 -->
        <div class="otziv--sm" data-node-id="6446:14731">
          <div class="otziv__inner--sm">
            <div class="otziv__top otziv__top--sm">
              <div class="otziv__header otziv__header--sm">
                <div class="otziv__logo--sm"></div>
                <div class="otziv__quote otziv__quote--sm" aria-hidden="true">
                  <img src="https://www.figma.com/api/mcp/asset/26ed0ba1-1adf-4e0d-8126-86487def38e2" alt="" />
                </div>
              </div>
              <div class="otziv__text otziv__text--sm">
                <p>Перешли с Jira на Кайтен — и не пожалели. Команда адаптировалась за неделю.</p>
              </div>
            </div>
            <div class="otziv__author">
              <div class="otziv__avatar otziv__avatar--sm">
                <img src="https://www.figma.com/api/mcp/asset/79e9313d-512f-49d5-b1ca-a14c69d8936d" alt="Аватар" />
              </div>
              <div class="otziv__author-text otziv__author-text--sm">
                <p class="otziv__author-name">Анна Смирнова</p>
                <p class="otziv__author-role">CTO, Lamoda Tech</p>
              </div>
            </div>
            <a class="otziv__btn otziv__btn--full-width" href="#">
              <span class="otziv__btn-text">Читать кейс</span>
            </a>
          </div>
        </div>

        <!-- Otziv 3 · node 6446:14864 -->
        <div class="otziv--sm" data-node-id="6446:14864">
          <div class="otziv__inner--sm">
            <div class="otziv__top otziv__top--sm">
              <div class="otziv__header otziv__header--sm">
                <div class="otziv__logo--sm"></div>
                <div class="otziv__quote otziv__quote--sm" aria-hidden="true">
                  <img src="https://www.figma.com/api/mcp/asset/26ed0ba1-1adf-4e0d-8126-86487def38e2" alt="" />
                </div>
              </div>
              <div class="otziv__text otziv__text--sm">
                <p>Автоматизации сэкономили нам минимум 10 часов в неделю. Всё фиксируется в карточках.</p>
              </div>
            </div>
            <div class="otziv__author">
              <div class="otziv__avatar otziv__avatar--sm">
                <img src="https://www.figma.com/api/mcp/asset/79e9313d-512f-49d5-b1ca-a14c69d8936d" alt="Аватар" />
              </div>
              <div class="otziv__author-text otziv__author-text--sm">
                <p class="otziv__author-name">Дмитрий Козлов</p>
                <p class="otziv__author-role">Product Manager, Wildberries</p>
              </div>
            </div>
            <a class="otziv__btn otziv__btn--full-width" href="#">
              <span class="otziv__btn-text">Читать кейс</span>
            </a>
          </div>
        </div>

        <!-- Otziv 4 · node 6446:14886 -->
        <div class="otziv--sm" data-node-id="6446:14886">
          <div class="otziv__inner--sm">
            <div class="otziv__top otziv__top--sm">
              <div class="otziv__header otziv__header--sm">
                <div class="otziv__logo--sm"></div>
                <div class="otziv__quote otziv__quote--sm" aria-hidden="true">
                  <img src="https://www.figma.com/api/mcp/asset/26ed0ba1-1adf-4e0d-8126-86487def38e2" alt="" />
                </div>
              </div>
              <div class="otziv__text otziv__text--sm">
                <p>Кайтен — первый инструмент, который прижился у нас без давления сверху.</p>
              </div>
            </div>
            <div class="otziv__author">
              <div class="otziv__avatar otziv__avatar--sm">
                <img src="https://www.figma.com/api/mcp/asset/79e9313d-512f-49d5-b1ca-a14c69d8936d" alt="Аватар" />
              </div>
              <div class="otziv__author-text otziv__author-text--sm">
                <p class="otziv__author-name">Мария Новикова</p>
                <p class="otziv__author-role">Head of Operations, Самокат</p>
              </div>
            </div>
            <a class="otziv__btn otziv__btn--full-width" href="#">
              <span class="otziv__btn-text">Читать кейс</span>
            </a>
          </div>
        </div>

      </div>
    </div>

    <!-- Navigation — Mobile · node 3126:33333 -->
    <div
      class="reviews__nav--mobile"
      data-node-id="3126:33333"
      role="group"
      aria-label="Листать отзывы"
    >
      <!-- Prev ← outline · node 3126:33334 -->
      <button
        class="nav-btn--sm-outline nav-btn--disabled"
        id="reviews-prev-mobile"
        aria-label="Предыдущий отзыв"
        data-node-id="3126:33334"
      >
        <img src="https://www.figma.com/api/mcp/asset/76d54aa9-35e9-4f0d-8579-1f0ded2e1144" alt="" aria-hidden="true" />
      </button>

      <!-- Counter · node 3126:33335 -->
      <span class="reviews__counter" id="reviews-counter-mobile" data-node-id="3126:33335">
        <span class="reviews__counter-current">1</span> / 4
      </span>

      <!-- Next → filled violet · node 3126:33336 -->
      <button
        class="nav-btn--sm-filled"
        id="reviews-next-mobile"
        aria-label="Следующий отзыв"
        data-node-id="3126:33336"
      >
        <img src="https://www.figma.com/api/mcp/asset/ac424d2e-ef62-4a2e-9b6d-a3d010f205a0" alt="" aria-hidden="true" />
      </button>
    </div>

  </div>
</section>


<!-- ══════════════════════════════════════════════════════════
     JavaScript — Carousel controller
     Desktop: шаг = ширина одной карточки + gap (384+32=416px)
              кнопки скрыты если ≤ 3 отзывов
     Tablet:  шаг = 318+24=342px, счётчик 1/N
     Mobile:  шаг = 318+16=334px, счётчик 1/N
     ══════════════════════════════════════════════════════════ -->
<script>
  (function () {

    /* ── Desktop ──────────────────────────────────────────── */
    (function initDesktop() {
      var track    = document.getElementById('reviews-track-desktop');
      var prevBtn  = document.getElementById('reviews-prev-desktop');
      var nextBtn  = document.getElementById('reviews-next-desktop');
      var navGroup = document.getElementById('reviews-nav-desktop');

      if (!track || !prevBtn || !nextBtn) return;

      var cards       = track.querySelectorAll('.otziv--desktop');
      var CARD_W      = 384;
      var GAP         = 32;
      var STEP        = CARD_W + GAP;           /* 416px */
      var VISIBLE     = 3;                      /* 3 карточки видимы */
      var totalCards  = cards.length;
      var maxIndex    = Math.max(0, totalCards - VISIBLE);
      var current     = 0;

      /* Скрыть кнопки если ≤ 3 отзывов */
      if (totalCards <= VISIBLE) {
        navGroup.setAttribute('data-hidden', 'true');
        return;
      }

      function updateTrack() {
        track.style.transform = 'translateX(-' + (current * STEP) + 'px)';
      }

      function updateButtons() {
        if (current <= 0) {
          prevBtn.classList.add('nav-btn--disabled');
        } else {
          prevBtn.classList.remove('nav-btn--disabled');
        }
        if (current >= maxIndex) {
          nextBtn.classList.add('nav-btn--disabled');
        } else {
          nextBtn.classList.remove('nav-btn--disabled');
        }
      }

      prevBtn.addEventListener('click', function () {
        if (current > 0) { current--; updateTrack(); updateButtons(); }
      });
      nextBtn.addEventListener('click', function () {
        if (current < maxIndex) { current++; updateTrack(); updateButtons(); }
      });

      /* Keyboard */
      [prevBtn, nextBtn].forEach(function (btn) {
        btn.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); }
        });
      });

      updateButtons();
    })();

    /* ── Tablet ───────────────────────────────────────────── */
    (function initTablet() {
      var track   = document.getElementById('reviews-track-tablet');
      var prevBtn = document.getElementById('reviews-prev-tablet');
      var nextBtn = document.getElementById('reviews-next-tablet');
      var counter = document.getElementById('reviews-counter-tablet');

      if (!track || !prevBtn || !nextBtn) return;

      var cards      = track.querySelectorAll('.otziv--sm');
      var STEP       = 318 + 24;                /* 342px */
      var total      = cards.length;
      var current    = 0;

      function updateTrack() {
        track.style.transform = 'translateX(-' + (current * STEP) + 'px)';
      }

      function updateUI() {
        /* counter */
        if (counter) {
          counter.innerHTML = '<span class="reviews__counter-current">' + (current + 1) + '</span> / ' + total;
        }
        /* Prev */
        if (current <= 0) prevBtn.classList.add('nav-btn--disabled');
        else              prevBtn.classList.remove('nav-btn--disabled');
        /* Next: filled violet when not at end */
        if (current >= total - 1) {
          nextBtn.style.opacity = '0.35';
          nextBtn.style.pointerEvents = 'none';
        } else {
          nextBtn.style.opacity = '';
          nextBtn.style.pointerEvents = '';
        }
      }

      prevBtn.addEventListener('click', function () {
        if (current > 0) { current--; updateTrack(); updateUI(); }
      });
      nextBtn.addEventListener('click', function () {
        if (current < total - 1) { current++; updateTrack(); updateUI(); }
      });

      updateUI();
    })();

    /* ── Mobile ───────────────────────────────────────────── */
    (function initMobile() {
      var track   = document.getElementById('reviews-track-mobile');
      var prevBtn = document.getElementById('reviews-prev-mobile');
      var nextBtn = document.getElementById('reviews-next-mobile');
      var counter = document.getElementById('reviews-counter-mobile');

      if (!track || !prevBtn || !nextBtn) return;

      var cards   = track.querySelectorAll('.otziv--sm');
      var STEP    = 318 + 16;                   /* 334px */
      var total   = cards.length;
      var current = 0;

      function updateTrack() {
        track.style.transform = 'translateX(-' + (current * STEP) + 'px)';
      }

      function updateUI() {
        if (counter) {
          counter.innerHTML = '<span class="reviews__counter-current">' + (current + 1) + '</span> / ' + total;
        }
        if (current <= 0) prevBtn.classList.add('nav-btn--disabled');
        else              prevBtn.classList.remove('nav-btn--disabled');
        if (current >= total - 1) {
          nextBtn.style.opacity = '0.35';
          nextBtn.style.pointerEvents = 'none';
        } else {
          nextBtn.style.opacity = '';
          nextBtn.style.pointerEvents = '';
        }
      }

      prevBtn.addEventListener('click', function () {
        if (current > 0) { current--; updateTrack(); updateUI(); }
      });
      nextBtn.addEventListener('click', function () {
        if (current < total - 1) { current++; updateTrack(); updateUI(); }
      });

      updateUI();
    })();

  })();
</script>
```

---

## Breakpoints

| Вариант | Диапазон | Контейнер | Карточки | Кнопки | Счётчик |
|---------|----------|-----------|----------|--------|---------|
| Desktop | `≥ 1280px` | `1280px`, `px 32px` | `384×460px`, `gap 32px`, 3 видимы | `48×48px` outline ← → | нет |
| Tablet | `768–1279px` | `721px`, `px 24px` | `318×372px`, `gap 24px`, 2 видимы | `40×40px` outline ← / violet → | `1 / N` |
| Mobile | `< 768px` | `328px`, `px 16px` | `318×372px`, `gap 16px`, 1 видима | `40×40px` outline ← / violet → | `1 / N` |

---

## Логика кнопок

### Desktop

- Кнопки ← → **не отображаются**, если карточек ≤ 3 (`navGroup[data-hidden=true]`)
- Кнопка ← неактивна (`opacity: 0.35`) на первом слайде
- Кнопка → неактивна на последнем слайде (когда 3-я видимая = последняя карточка)
- Шаг прокрутки: `384 + 32 = 416px`

### Tablet & Mobile

- Всегда показаны счётчик `1 / N` и обе кнопки
- Кнопка ← `outline` (всегда), кнопка → `filled violet` (всегда)
- Кнопка ← неактивна на первом слайде, → неактивна на последнем
- Шаг: Tablet `318 + 24 = 342px`, Mobile `318 + 16 = 334px`

---

## Accessibility

- `<section>` с `aria-label="Отзывы клиентов"`
- Навигационные кнопки с `aria-label` (Предыдущий/Следующий)
- Кнопки-навигации сгруппированы в `role="group"` с `aria-label`
- Неактивные кнопки имеют `pointer-events: none` (не `disabled`, чтобы сохранить tabindex)
- Декоративные иконки: `aria-hidden="true"`, `alt=""`

---

## Changelog

| Версия | Дата | Описание |
|--------|------|---------|
| 1.0.0 | 2026-06-05 | Desktop + Tablet + Mobile, JS-карусель, логика показа кнопок при > 3 отзывах |
