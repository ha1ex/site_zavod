# FAQ

Компонент «Часто задаваемые вопросы». Аккордеон с тремя адаптивными состояниями (Desktop / Tablet / Mobile). Каждый элемент имеет три варианта: Default (свёрнут), Hover и Active (развёрнут с ответом и фиолетовой рамкой). Секция располагается на сером фоне `#f5f5f5`.

---

## Anatomy

### FAQ Item — состояния

```
┌── Default ─────────────────────────────────────────────────────────────────────┐
│  bg: white  border: none  border-radius: 12px  p: 24px (desktop/tablet)       │
│                                                p: 16px (mobile)                │
│  Заголовок вопроса                                                 [+]          │
│  (20px Regular #2d2d2d — desktop/tablet | 16px Regular — mobile)               │
└────────────────────────────────────────────────────────────────────────────────┘

┌── Active ──────────────────────────────────────────────────────────────────────┐
│  bg: white  border: 1px solid #7d4ccf  border-radius: 12px  p: 24px / 16px   │
│  Заголовок вопроса (SemiBold #7d4ccf)                              [−]          │
│                                                                                │
│  Текст ответа (16px Regular #757575 — desktop/tablet                           │
│               14px Regular #757575 — mobile)                                   │
└────────────────────────────────────────────────────────────────────────────────┘
```

### Desktop (`≥ 1280px`) · node `2041-30818`

```
┌───────────────────────────────── 1920px ──────────────────────────────────────┐
│  bg: #f5f5f5  pt: 96px  pb: 128px                                             │
│                                                                                │
│  ┌──── container 1216px ───────────────────────────────────────────────────┐  │
│  │  gap: 48px  (section title + items column)                               │  │
│  │                                                                           │  │
│  │  Нас часто спрашивают          (36px SemiBold, centered)                 │  │
│  │                                                                           │  │
│  │  ┌── FAQ items column, gap 16px ─────────────────────────────────────┐  │  │
│  │  │  [FAQ item 1 — Default]  1216×76px                                 │  │  │
│  │  │  [FAQ item 2 — Default]  1216×76px                                 │  │  │
│  │  │  [FAQ item 3 — Active]   1216×140px  (border #7d4ccf)              │  │  │
│  │  │  [FAQ item 4 — Default]  1216×76px                                 │  │  │
│  │  │  [FAQ item 5 — Default]  1216×76px                                 │  │  │
│  │  └───────────────────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────────┘
```

### Tablet (`768px – 1279px`) · node `2813-39967`

```
┌──────────────────────── 768px ──────────────────────────┐
│  bg: #f5f5f5  py: 64px  px: 24px                        │
│                                                          │
│  ┌── container 720px, gap 32px ───────────────────────┐ │
│  │  Нас часто спрашивают  (24px SemiBold, centered)    │ │
│  │                                                     │ │
│  │  ┌── FAQ items, gap 16px ──────────────────────┐   │ │
│  │  │  [item 1 — Default]  720×76px  p: 24px      │   │ │
│  │  │  [item 2 — Default]  720×76px               │   │ │
│  │  │  [item 3 — Active]   720×164px  #7d4ccf     │   │ │
│  │  │  [item 4 — Default]  720×76px               │   │ │
│  │  │  [item 5 — Default]  720×76px               │   │ │
│  │  └──────────────────────────────────────────────┘   │ │
│  └─────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

### Mobile (`< 768px`) · node `2041-30866`

```
┌────── 360px ──────┐
│  bg: #f5f5f5       │
│  py: 48px  px: 16px│
│                    │
│  Нас часто         │  (24px SemiBold, centered)
│  спрашивают        │
│                    │
│  ┌── items gap 16─┐│
│  │ [item — Default]││  328×56px  p: 16px
│  │ [item — Default]││  question: 16px Regular
│  │ [item — Active] ││  328×172px  border #7d4ccf
│  │  answer: 14px   ││  question: 16px Medium #7d4ccf
│  │ [item — Default]││
│  │ [item — Default]││
│  └─────────────────┘│
└────────────────────┘
```

---

## Figma

| Версия  | Node ID      | Ссылка |
|---------|--------------|--------|
| Section | `2041-30915` | [Открыть в Figma](https://www.figma.com/design/6M8lLx2PgVTxwXMeRiOVH4/Landing-DS?node-id=2041-30915) |
| Desktop | `2041-30818` | [Открыть в Figma](https://www.figma.com/design/6M8lLx2PgVTxwXMeRiOVH4/Landing-DS?node-id=2041-30818) |
| Tablet  | `2813-39967` | [Открыть в Figma](https://www.figma.com/design/6M8lLx2PgVTxwXMeRiOVH4/Landing-DS?node-id=2813-39967) |
| Mobile  | `2041-30866` | [Открыть в Figma](https://www.figma.com/design/6M8lLx2PgVTxwXMeRiOVH4/Landing-DS?node-id=2041-30866) |

### FAQ Item — sub-nodes

| Состояние | View | Node ID |
|-----------|------|---------|
| Default | Desktop | `1207:17758` |
| Hover | Desktop | `1507:22920` |
| Active | Desktop | `1207:17760` |
| Default | Mobile | `1256:14399` |
| Active | Mobile | `1256:14394` |

---

## Assets

| Ключ | URL (Figma MCP) | Использование |
|------|-----------------|---------------|
| `imgIcon-plus-desktop` | `https://www.figma.com/api/mcp/asset/81f2d551-ccfc-4852-b8d1-b8668b3c1196` | Иконка «+» Desktop |
| `imgIcon-minus-desktop` | `https://www.figma.com/api/mcp/asset/e756fbf6-126a-4304-be03-9a9a80a01f27` | Иконка «−» Desktop (active) |
| `imgIcon-plus-mobile` | `https://www.figma.com/api/mcp/asset/f358159e-5c8f-42b5-ac28-8a1186e22a62` | Иконка «+» Mobile |
| `imgIcon-minus-mobile` | `https://www.figma.com/api/mcp/asset/94559e6a-cd81-4e40-8705-0767a9eb92a8` | Иконка «−» Mobile (active) |
| `imgIcon-plus-tablet` | `https://www.figma.com/api/mcp/asset/0d26dc48-f1e0-41ca-ac2b-3c9c6d90170a` | Иконка «+» Tablet |
| `imgIcon-minus-tablet` | `https://www.figma.com/api/mcp/asset/66ebf208-47c7-4890-9a87-ef935b1b2bee` | Иконка «−» Tablet (active) |

> ⚠️ Ссылки на ассеты действуют **7 дней** с даты генерации. После истечения замените на стабильные CDN-пути проекта.

---

## Tokens

| Token | Value | Использование |
|-------|-------|---------------|
| `--background/gray/secondary` | `#f5f5f5` | Фон секции |
| `--background/white/secondary` | `#ffffff` | Фон элемента FAQ |
| `--border/secondary` | `#e5e7eb` | Рамка Default (border: 0 — не отображается) |
| `--text/brand-color` | `#7d4ccf` | Рамка Active |
| `--colors/kaiten/brand-100k` | `#7d4ccf` | Цвет заголовка Active; рамка Mobile Active |
| `--text/title-color` | `#2d2d2d` | Цвет заголовка Default |
| `--text/secondary-text-color` | `#757575` | Цвет текста ответа |
| `--border-radius/rounded-xl` | `12px` | Скругление элемента FAQ |
| `--spacing/4` | `16px` | Gap внутри элемента; p Mobile; gap items |
| `--spacing/6` | `24px` | p Desktop/Tablet |
| `--spacing/8` | `32px` | gap Container Tablet |
| `--spacing/12` | `48px` | gap Container Desktop; py Mobile |
| `--spacing/16` | `64px` | py Tablet |
| `--spacing/24` | `96px` | pt Desktop |
| `--spacing/32` | `128px` | pb Desktop |
| `--size/4xl` | `36px` | Заголовок секции Desktop |
| `--size/2xl` | `24px` | Заголовок секции Tablet/Mobile |
| `--size/xl` | `20px` | Вопрос Desktop/Tablet |
| `--size/md` | `16px` | Вопрос Mobile; ответ Desktop/Tablet |
| `--size/sm` | `14px` | Ответ Mobile |
| `--line-height/4xl` | `40px` | LH заголовка секции Desktop |
| `--line-height/2xl` | `32px` | LH заголовка секции Tablet/Mobile |
| `--line-height/xl` | `28px` | LH вопроса Desktop/Tablet |
| `--line-height/md` | `24px` | LH вопроса Mobile; ответа Desktop/Tablet |
| `--line-height/sm` | `20px` | LH ответа Mobile |
| `--family/family` | `'Roboto'` | Шрифт |

---

## HTML + CSS

```html
<!-- ============================================================
     FAQ COMPONENT — Accordion
     Desktop  ≥ 1280px : 1216px container, pt 96px pb 128px
     Tablet   768–1279px: 720px container, py 64px px 24px
     Mobile   < 768px  : full-width, py 48px px 16px
     Background: #f5f5f5
     ============================================================ -->

<style>
  /* ── Design Tokens ─────────────────────────────────────────── */
  :root {
    --faq-section-bg:   #f5f5f5;
    --faq-item-bg:      #ffffff;
    --faq-border:       #e5e7eb;
    --faq-active-border:#7d4ccf;
    --text-title:       #2d2d2d;
    --text-brand:       #7d4ccf;
    --text-answer:      #757575;
    --radius-xl:        12px;
    --ls:               -0.2px;
    --font:             'Roboto', sans-serif;
    --fw-reg:           400;
    --fw-med:           500;
    --fw-semi:          600;

    /* spacing */
    --sp-4:   16px;
    --sp-6:   24px;
    --sp-8:   32px;
    --sp-12:  48px;
    --sp-16:  64px;
    --sp-24:  96px;
    --sp-32: 128px;

    /* type */
    --fs-sm:  14px; --lh-sm:  20px;
    --fs-md:  16px; --lh-md:  24px;
    --fs-xl:  20px; --lh-xl:  28px;
    --fs-2xl: 24px; --lh-2xl: 32px;
    --fs-4xl: 36px; --lh-4xl: 40px;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── Section wrapper ───────────────────────────────────────── */
  .faq-section {
    background-color: var(--faq-section-bg);
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* ── Container ─────────────────────────────────────────────── */
  .faq-section__container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  /* ── Section heading ───────────────────────────────────────── */
  .faq-section__title {
    font-family: var(--font);
    font-weight: var(--fw-semi);
    color: var(--text-title);
    text-align: center;
    width: 100%;
    font-variation-settings: "wdth" 100;
  }
  .faq-section__title--desktop {
    font-size: var(--fs-4xl);
    line-height: var(--lh-4xl);
    /* letter-spacing: 0 per Figma Text 4xl/Semibold */
  }
  .faq-section__title--tablet,
  .faq-section__title--mobile {
    font-size: var(--fs-2xl);
    line-height: var(--lh-2xl);
    letter-spacing: var(--ls);
  }

  /* ── Items list ────────────────────────────────────────────── */
  .faq-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--sp-4);
    width: 100%;
    list-style: none;
  }

  /* ── FAQ item ──────────────────────────────────────────────── */
  .faq-item {
    background: var(--faq-item-bg);
    border-radius: var(--radius-xl);
    width: 100%;
    /* Default state: no visible border (border: 0 from Figma) */
    border: 1px solid transparent;
    display: flex;
    flex-direction: column;
    gap: var(--sp-4);
    align-items: flex-start;
    cursor: pointer;
    text-align: left;
    font-family: var(--font);
    transition: border-color 0.2s ease;
  }
  /* Default: border transparent (matches Figma border-0 / transparent) */
  .faq-item--default {
    border-color: transparent;
  }
  /* Hover */
  .faq-item--default:hover,
  .faq-item:hover {
    border-color: var(--faq-border);
  }
  /* Active / Open */
  .faq-item--active,
  .faq-item[aria-expanded="true"] {
    border-color: var(--faq-active-border);
  }

  /* padding variants */
  .faq-item--pad-lg { padding: var(--sp-6); }  /* Desktop + Tablet: 24px */
  .faq-item--pad-sm { padding: var(--sp-4); }  /* Mobile: 16px */

  /* ── Question row ──────────────────────────────────────────── */
  .faq-item__question {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    width: 100%;
    gap: 16px;
  }

  /* question text — Default */
  .faq-item__q-text {
    font-family: var(--font);
    font-weight: var(--fw-reg);
    color: var(--text-title);
    flex: 1 0 0;
    min-width: 0;
    letter-spacing: var(--ls);
    word-break: break-word;
    font-variation-settings: "wdth" 100;
  }
  .faq-item__q-text--xl  { font-size: var(--fs-xl);  line-height: var(--lh-xl);  }
  .faq-item__q-text--md  { font-size: var(--fs-md);  line-height: var(--lh-md);  }

  /* question text — Active */
  .faq-item--active .faq-item__q-text,
  .faq-item[aria-expanded="true"] .faq-item__q-text {
    font-weight: var(--fw-semi);
    color: var(--text-brand);
  }

  /* Mobile Active uses font-weight: medium (500) instead of semibold */
  .faq-item--active-mobile .faq-item__q-text {
    font-weight: var(--fw-med);
    color: var(--text-brand);
  }

  /* ── Icon wrapper ──────────────────────────────────────────── */
  .faq-item__icon {
    position: relative;
    flex-shrink: 0;
    width: 24px;
    height: 24px;
  }

  /* Plus icon (default) */
  .faq-item__icon-plus {
    position: absolute;
    /* inset: 21.87% 21.87% 21.87% 21.88% from Figma */
    top:    21.87%;
    right:  21.87%;
    bottom: 21.87%;
    left:   21.88%;
  }
  .faq-item__icon-plus img {
    position: absolute;
    inset: 0;
    display: block;
    max-width: none;
    width: 100%;
    height: 100%;
  }

  /* Minus icon (active) */
  .faq-item__icon-minus {
    position: absolute;
    /* bottom: 50%, left: 25%, right: 25%, top: 50% from Figma */
    bottom: 50%;
    left:   25%;
    right:  25%;
    top:    50%;
  }
  .faq-item__icon-minus-inner {
    position: absolute;
    /* inset: -0.75px -6.25% from Figma */
    top:    -0.75px;
    right:  -6.25%;
    bottom: -0.75px;
    left:   -6.25%;
  }
  .faq-item__icon-minus-inner img {
    display: block;
    max-width: none;
    width: 100%;
    height: 100%;
  }

  /* ── Answer text ───────────────────────────────────────────── */
  .faq-item__answer {
    font-family: var(--font);
    font-weight: var(--fw-reg);
    color: var(--text-answer);
    letter-spacing: var(--ls);
    word-break: break-word;
    width: 100%;
    font-variation-settings: "wdth" 100;
    /* Hidden by default; shown when active */
    display: none;
  }
  .faq-item--active .faq-item__answer,
  .faq-item[aria-expanded="true"] .faq-item__answer,
  .faq-item--active-mobile .faq-item__answer {
    display: block;
  }

  .faq-item__answer--md {
    font-size: var(--fs-md);
    line-height: var(--lh-md);
    /* Desktop: max-width 776px per Figma */
    max-width: 776px;
  }
  .faq-item__answer--sm {
    font-size: var(--fs-sm);
    line-height: var(--lh-sm);
    max-width: 100%;
  }

  /* ── Desktop layout ────────────────────────────────────────── */
  .faq-section--desktop {
    padding-top: var(--sp-24);    /* 96px */
    padding-bottom: var(--sp-32); /* 128px */
  }
  .faq-section--desktop .faq-section__container {
    max-width: 1216px;
    gap: var(--sp-12); /* 48px */
  }

  /* ── Tablet layout ─────────────────────────────────────────── */
  .faq-section--tablet {
    padding: var(--sp-16) var(--sp-6); /* 64px 24px */
  }
  .faq-section--tablet .faq-section__container {
    max-width: 720px;
    gap: var(--sp-8); /* 32px */
  }

  /* ── Mobile layout ─────────────────────────────────────────── */
  .faq-section--mobile {
    padding: var(--sp-12) var(--sp-4); /* 48px 16px */
  }
  .faq-section--mobile .faq-section__container {
    max-width: 100%;
    gap: var(--sp-6); /* 24px */
  }

  /* ── Responsive visibility ─────────────────────────────────── */
  .faq-section--desktop { display: flex; }
  .faq-section--tablet  { display: none; }
  .faq-section--mobile  { display: none; }

  @media (max-width: 1279px) and (min-width: 768px) {
    .faq-section--desktop { display: none; }
    .faq-section--tablet  { display: flex; }
    .faq-section--mobile  { display: none; }
  }
  @media (max-width: 767px) {
    .faq-section--desktop { display: none; }
    .faq-section--tablet  { display: none; }
    .faq-section--mobile  { display: flex; }
  }

  /* ── JS-driven toggle ──────────────────────────────────────── */
  /*
   * When JS adds .faq-item--open, icons swap and answer shows.
   * The .faq-item__icon-plus / .faq-item__icon-minus visibility
   * is controlled via the aria-expanded pattern below.
   */
  .faq-item[aria-expanded="false"] .faq-item__icon-minus { display: none; }
  .faq-item[aria-expanded="true"]  .faq-item__icon-plus  { display: none; }
  .faq-item[aria-expanded="false"] .faq-item__icon-plus  { display: block; }
  .faq-item[aria-expanded="true"]  .faq-item__icon-minus { display: block; }
</style>


<!-- ══════════════════════════════════════════════════════════
     DESKTOP  ≥ 1280px
     ══════════════════════════════════════════════════════════ -->
<section
  class="faq-section faq-section--desktop"
  data-node-id="2041:30818"
  aria-label="Часто задаваемые вопросы"
>
  <div class="faq-section__container" data-node-id="2041:30819">

    <!-- Section title -->
    <div data-node-id="2390:16686">
      <h2
        class="faq-section__title faq-section__title--desktop"
        data-node-id="I2390:16686;2390:14409"
      >
        Нас часто спрашивают
      </h2>
    </div>

    <!-- FAQ list -->
    <ul class="faq-list" data-node-id="2041:30821">

      <!-- Item 1 — Default -->
      <li
        class="faq-item faq-item--default faq-item--pad-lg"
        role="button"
        aria-expanded="false"
        tabindex="0"
        data-node-id="2390:16705"
      >
        <div class="faq-item__question" data-node-id="1207:17751">
          <span class="faq-item__q-text faq-item__q-text--xl" data-node-id="1207:17752">
            Можно ли перенести данные из другого сервиса?
          </span>
          <span class="faq-item__icon" data-node-id="1207:17753" aria-hidden="true">
            <!-- Plus -->
            <span class="faq-item__icon-plus">
              <img src="https://www.figma.com/api/mcp/asset/81f2d551-ccfc-4852-b8d1-b8668b3c1196" alt="" />
            </span>
            <!-- Minus -->
            <span class="faq-item__icon-minus">
              <span class="faq-item__icon-minus-inner">
                <img src="https://www.figma.com/api/mcp/asset/e756fbf6-126a-4304-be03-9a9a80a01f27" alt="" />
              </span>
            </span>
          </span>
        </div>
        <p class="faq-item__answer faq-item__answer--md" data-node-id="1207:17764">
          Да. Кайтен поддерживает импорт данных из популярных сервисов через CSV/XLS. Вы можете перенести задачи, историю обращений, базу знаний и структуру проектов с сохранением всех связей.
        </p>
      </li>

      <!-- Item 2 — Default -->
      <li
        class="faq-item faq-item--default faq-item--pad-lg"
        role="button"
        aria-expanded="false"
        tabindex="0"
        data-node-id="2390:16714"
      >
        <div class="faq-item__question" data-node-id="1207:17751">
          <span class="faq-item__q-text faq-item__q-text--xl" data-node-id="1207:17752">
            Как устроена тарификация — платить нужно за всех?
          </span>
          <span class="faq-item__icon" aria-hidden="true">
            <span class="faq-item__icon-plus">
              <img src="https://www.figma.com/api/mcp/asset/81f2d551-ccfc-4852-b8d1-b8668b3c1196" alt="" />
            </span>
            <span class="faq-item__icon-minus">
              <span class="faq-item__icon-minus-inner">
                <img src="https://www.figma.com/api/mcp/asset/e756fbf6-126a-4304-be03-9a9a80a01f27" alt="" />
              </span>
            </span>
          </span>
        </div>
        <p class="faq-item__answer faq-item__answer--md">
          Нет. Оплата взимается только за сотрудников компании. Клиенты, подрядчики и гости могут участвовать в задачах бесплатно.
        </p>
      </li>

      <!-- Item 3 — Active (open) -->
      <li
        class="faq-item faq-item--active faq-item--pad-lg"
        role="button"
        aria-expanded="true"
        tabindex="0"
        data-node-id="2390:16723"
      >
        <div class="faq-item__question" data-node-id="1207:17761">
          <span class="faq-item__q-text faq-item__q-text--xl" data-node-id="1207:17762">
            Есть ли риск блокировки или ограничений для российских компаний?
          </span>
          <span class="faq-item__icon" aria-hidden="true">
            <span class="faq-item__icon-plus">
              <img src="https://www.figma.com/api/mcp/asset/81f2d551-ccfc-4852-b8d1-b8668b3c1196" alt="" />
            </span>
            <span class="faq-item__icon-minus">
              <span class="faq-item__icon-minus-inner">
                <img src="https://www.figma.com/api/mcp/asset/e756fbf6-126a-4304-be03-9a9a80a01f27" alt="" />
              </span>
            </span>
          </span>
        </div>
        <p class="faq-item__answer faq-item__answer--md" data-node-id="1207:17764">
          Нет. Кайтен — российский сервис, входящий в реестр отечественного ПО № 14347. Компания аккредитована как IT-организация, серверы расположены в России. Никаких рисков блокировки или санкционных ограничений нет.
        </p>
      </li>

      <!-- Item 4 — Default -->
      <li
        class="faq-item faq-item--default faq-item--pad-lg"
        role="button"
        aria-expanded="false"
        tabindex="0"
        data-node-id="2390:16738"
      >
        <div class="faq-item__question" data-node-id="1207:17751">
          <span class="faq-item__q-text faq-item__q-text--xl" data-node-id="1207:17752">
            Нужны ли программисты для настройки?
          </span>
          <span class="faq-item__icon" aria-hidden="true">
            <span class="faq-item__icon-plus">
              <img src="https://www.figma.com/api/mcp/asset/81f2d551-ccfc-4852-b8d1-b8668b3c1196" alt="" />
            </span>
            <span class="faq-item__icon-minus">
              <span class="faq-item__icon-minus-inner">
                <img src="https://www.figma.com/api/mcp/asset/e756fbf6-126a-4304-be03-9a9a80a01f27" alt="" />
              </span>
            </span>
          </span>
        </div>
        <p class="faq-item__answer faq-item__answer--md">
          Нет. Кайтен настраивается без технических знаний: создание досок, процессов и автоматизаций доступно через визуальный интерфейс.
        </p>
      </li>

      <!-- Item 5 — Default -->
      <li
        class="faq-item faq-item--default faq-item--pad-lg"
        role="button"
        aria-expanded="false"
        tabindex="0"
        data-node-id="2390:16747"
      >
        <div class="faq-item__question" data-node-id="1207:17751">
          <span class="faq-item__q-text faq-item__q-text--xl" data-node-id="1207:17752">
            Можно попробовать бесплатно?
          </span>
          <span class="faq-item__icon" aria-hidden="true">
            <span class="faq-item__icon-plus">
              <img src="https://www.figma.com/api/mcp/asset/81f2d551-ccfc-4852-b8d1-b8668b3c1196" alt="" />
            </span>
            <span class="faq-item__icon-minus">
              <span class="faq-item__icon-minus-inner">
                <img src="https://www.figma.com/api/mcp/asset/e756fbf6-126a-4304-be03-9a9a80a01f27" alt="" />
              </span>
            </span>
          </span>
        </div>
        <p class="faq-item__answer faq-item__answer--md">
          Да. Зарегистрируйтесь и получите полный доступ ко всем функциям на 14 дней без карты и обязательств.
        </p>
      </li>

    </ul>
  </div>
</section>


<!-- ══════════════════════════════════════════════════════════
     TABLET  768px – 1279px
     ══════════════════════════════════════════════════════════ -->
<section
  class="faq-section faq-section--tablet"
  data-node-id="2813:39967"
  aria-label="Часто задаваемые вопросы"
>
  <div class="faq-section__container" data-node-id="2813:39968">

    <div data-node-id="2903:24441">
      <h2
        class="faq-section__title faq-section__title--tablet"
        data-node-id="2390:14415"
      >
        Нас часто спрашивают
      </h2>
    </div>

    <ul class="faq-list" data-node-id="2813:39970">

      <!-- Item 1 — Default -->
      <li
        class="faq-item faq-item--default faq-item--pad-lg"
        role="button"
        aria-expanded="false"
        tabindex="0"
        data-node-id="2813:39971"
      >
        <div class="faq-item__question" data-node-id="I2813:39971;1207:17751">
          <span class="faq-item__q-text faq-item__q-text--xl" data-node-id="I2813:39971;1207:17752">
            Можно ли перенести данные из другого сервиса?
          </span>
          <span class="faq-item__icon" aria-hidden="true">
            <span class="faq-item__icon-plus">
              <img src="https://www.figma.com/api/mcp/asset/0d26dc48-f1e0-41ca-ac2b-3c9c6d90170a" alt="" />
            </span>
            <span class="faq-item__icon-minus">
              <span class="faq-item__icon-minus-inner">
                <img src="https://www.figma.com/api/mcp/asset/66ebf208-47c7-4890-9a87-ef935b1b2bee" alt="" />
              </span>
            </span>
          </span>
        </div>
        <p class="faq-item__answer faq-item__answer--md">
          Да. Кайтен поддерживает импорт данных из популярных сервисов через CSV/XLS. Вы можете перенести задачи, историю обращений и базу знаний с сохранением структуры.
        </p>
      </li>

      <!-- Item 2 — Default -->
      <li
        class="faq-item faq-item--default faq-item--pad-lg"
        role="button"
        aria-expanded="false"
        tabindex="0"
        data-node-id="2903:24326"
      >
        <div class="faq-item__question" data-node-id="I2903:24326;1207:17751">
          <span class="faq-item__q-text faq-item__q-text--xl" data-node-id="I2903:24326;1207:17752">
            Как устроена тарификация — платить нужно за всех?
          </span>
          <span class="faq-item__icon" aria-hidden="true">
            <span class="faq-item__icon-plus">
              <img src="https://www.figma.com/api/mcp/asset/0d26dc48-f1e0-41ca-ac2b-3c9c6d90170a" alt="" />
            </span>
            <span class="faq-item__icon-minus">
              <span class="faq-item__icon-minus-inner">
                <img src="https://www.figma.com/api/mcp/asset/66ebf208-47c7-4890-9a87-ef935b1b2bee" alt="" />
              </span>
            </span>
          </span>
        </div>
        <p class="faq-item__answer faq-item__answer--md">
          Нет. Оплата взимается только за сотрудников. Клиенты и гости участвуют бесплатно.
        </p>
      </li>

      <!-- Item 3 — Active -->
      <li
        class="faq-item faq-item--active faq-item--pad-lg"
        role="button"
        aria-expanded="true"
        tabindex="0"
        data-node-id="2813:39973"
      >
        <div class="faq-item__question" data-node-id="I2813:39973;1207:17761">
          <span class="faq-item__q-text faq-item__q-text--xl" data-node-id="I2813:39973;1207:17762">
            Есть ли риск блокировки или ограничений для российских компаний?
          </span>
          <span class="faq-item__icon" aria-hidden="true">
            <span class="faq-item__icon-plus">
              <img src="https://www.figma.com/api/mcp/asset/0d26dc48-f1e0-41ca-ac2b-3c9c6d90170a" alt="" />
            </span>
            <span class="faq-item__icon-minus">
              <span class="faq-item__icon-minus-inner">
                <img src="https://www.figma.com/api/mcp/asset/66ebf208-47c7-4890-9a87-ef935b1b2bee" alt="" />
              </span>
            </span>
          </span>
        </div>
        <p class="faq-item__answer faq-item__answer--md" data-node-id="I2813:39973;1207:17764">
          Нет. Кайтен — российский сервис в реестре ПО № 14347, серверы в России. Никаких рисков блокировки нет.
        </p>
      </li>

      <!-- Item 4 — Default -->
      <li
        class="faq-item faq-item--default faq-item--pad-lg"
        role="button"
        aria-expanded="false"
        tabindex="0"
        data-node-id="2813:39974"
      >
        <div class="faq-item__question" data-node-id="I2813:39974;1207:17751">
          <span class="faq-item__q-text faq-item__q-text--xl" data-node-id="I2813:39974;1207:17752">
            Нужны ли программисты для настройки?
          </span>
          <span class="faq-item__icon" aria-hidden="true">
            <span class="faq-item__icon-plus">
              <img src="https://www.figma.com/api/mcp/asset/0d26dc48-f1e0-41ca-ac2b-3c9c6d90170a" alt="" />
            </span>
            <span class="faq-item__icon-minus">
              <span class="faq-item__icon-minus-inner">
                <img src="https://www.figma.com/api/mcp/asset/66ebf208-47c7-4890-9a87-ef935b1b2bee" alt="" />
              </span>
            </span>
          </span>
        </div>
        <p class="faq-item__answer faq-item__answer--md">
          Нет. Всё настраивается через визуальный интерфейс без технических знаний.
        </p>
      </li>

      <!-- Item 5 — Default -->
      <li
        class="faq-item faq-item--default faq-item--pad-lg"
        role="button"
        aria-expanded="false"
        tabindex="0"
        data-node-id="2813:39975"
      >
        <div class="faq-item__question" data-node-id="I2813:39975;1207:17751">
          <span class="faq-item__q-text faq-item__q-text--xl" data-node-id="I2813:39975;1207:17752">
            Можно попробовать бесплатно?
          </span>
          <span class="faq-item__icon" aria-hidden="true">
            <span class="faq-item__icon-plus">
              <img src="https://www.figma.com/api/mcp/asset/0d26dc48-f1e0-41ca-ac2b-3c9c6d90170a" alt="" />
            </span>
            <span class="faq-item__icon-minus">
              <span class="faq-item__icon-minus-inner">
                <img src="https://www.figma.com/api/mcp/asset/66ebf208-47c7-4890-9a87-ef935b1b2bee" alt="" />
              </span>
            </span>
          </span>
        </div>
        <p class="faq-item__answer faq-item__answer--md">
          Да. 14 дней полного доступа без карты.
        </p>
      </li>

    </ul>
  </div>
</section>


<!-- ══════════════════════════════════════════════════════════
     MOBILE  < 768px
     ══════════════════════════════════════════════════════════ -->
<section
  class="faq-section faq-section--mobile"
  data-node-id="2041:30866"
  aria-label="Часто задаваемые вопросы"
>
  <div class="faq-section__container" data-node-id="2041:30867">

    <div data-node-id="4142:34889">
      <h2
        class="faq-section__title faq-section__title--mobile"
        data-node-id="I4142:34889;2390:14403"
      >
        Нас часто спрашивают
      </h2>
    </div>

    <ul class="faq-list" data-node-id="2041:30869">

      <!-- Item 1 — Default (Mobile: q text 16px Regular) -->
      <li
        class="faq-item faq-item--default faq-item--pad-sm"
        role="button"
        aria-expanded="false"
        tabindex="0"
        data-node-id="2903:24371"
      >
        <div class="faq-item__question" data-node-id="I2903:24371;1256:14400">
          <span class="faq-item__q-text faq-item__q-text--md" data-node-id="I2903:24371;1256:14401">
            Можно ли перенести данные из другого сервиса?
          </span>
          <span class="faq-item__icon" aria-hidden="true">
            <span class="faq-item__icon-plus">
              <img src="https://www.figma.com/api/mcp/asset/f358159e-5c8f-42b5-ac28-8a1186e22a62" alt="" />
            </span>
            <span class="faq-item__icon-minus">
              <span class="faq-item__icon-minus-inner">
                <img src="https://www.figma.com/api/mcp/asset/94559e6a-cd81-4e40-8705-0767a9eb92a8" alt="" />
              </span>
            </span>
          </span>
        </div>
        <p class="faq-item__answer faq-item__answer--sm" data-node-id="1256:14398">
          Да. Кайтен поддерживает импорт через CSV/XLS с сохранением структуры данных.
        </p>
      </li>

      <!-- Item 2 — Default -->
      <li
        class="faq-item faq-item--default faq-item--pad-sm"
        role="button"
        aria-expanded="false"
        tabindex="0"
        data-node-id="2903:24386"
      >
        <div class="faq-item__question" data-node-id="I2903:24386;1256:14400">
          <span class="faq-item__q-text faq-item__q-text--md" data-node-id="I2903:24386;1256:14401">
            Как устроена тарификация?
          </span>
          <span class="faq-item__icon" aria-hidden="true">
            <span class="faq-item__icon-plus">
              <img src="https://www.figma.com/api/mcp/asset/f358159e-5c8f-42b5-ac28-8a1186e22a62" alt="" />
            </span>
            <span class="faq-item__icon-minus">
              <span class="faq-item__icon-minus-inner">
                <img src="https://www.figma.com/api/mcp/asset/94559e6a-cd81-4e40-8705-0767a9eb92a8" alt="" />
              </span>
            </span>
          </span>
        </div>
        <p class="faq-item__answer faq-item__answer--sm">
          Оплата только за сотрудников, клиенты — бесплатно.
        </p>
      </li>

      <!-- Item 3 — Active (Mobile: font-weight medium 500 per Figma) -->
      <li
        class="faq-item faq-item--active faq-item--pad-sm"
        role="button"
        aria-expanded="true"
        tabindex="0"
        data-node-id="2903:24395"
        style="--faq-q-weight: 500;"
      >
        <div class="faq-item__question" data-node-id="I2903:24395;1256:14395">
          <!--
            Mobile Active: font-weight: medium (500) per Figma node 1256:14396
            vs Desktop Active: font-weight: semibold (600) per Figma node 1207:17762
          -->
          <span
            class="faq-item__q-text faq-item__q-text--md"
            style="font-weight: 500; color: var(--text-brand, #7d4ccf);"
            data-node-id="1256:14396"
          >
            Есть ли риск блокировки для российских компаний?
          </span>
          <span class="faq-item__icon" aria-hidden="true">
            <span class="faq-item__icon-plus">
              <img src="https://www.figma.com/api/mcp/asset/f358159e-5c8f-42b5-ac28-8a1186e22a62" alt="" />
            </span>
            <span class="faq-item__icon-minus">
              <span class="faq-item__icon-minus-inner">
                <img src="https://www.figma.com/api/mcp/asset/94559e6a-cd81-4e40-8705-0767a9eb92a8" alt="" />
              </span>
            </span>
          </span>
        </div>
        <p class="faq-item__answer faq-item__answer--sm" data-node-id="1256:14398">
          Нет. Кайтен — российский сервис в реестре ПО № 14347. Серверы в России, санкционных рисков нет.
        </p>
      </li>

      <!-- Item 4 — Default -->
      <li
        class="faq-item faq-item--default faq-item--pad-sm"
        role="button"
        aria-expanded="false"
        tabindex="0"
        data-node-id="2903:24404"
      >
        <div class="faq-item__question" data-node-id="I2903:24404;1256:14400">
          <span class="faq-item__q-text faq-item__q-text--md" data-node-id="I2903:24404;1256:14401">
            Нужны ли программисты для настройки?
          </span>
          <span class="faq-item__icon" aria-hidden="true">
            <span class="faq-item__icon-plus">
              <img src="https://www.figma.com/api/mcp/asset/f358159e-5c8f-42b5-ac28-8a1186e22a62" alt="" />
            </span>
            <span class="faq-item__icon-minus">
              <span class="faq-item__icon-minus-inner">
                <img src="https://www.figma.com/api/mcp/asset/94559e6a-cd81-4e40-8705-0767a9eb92a8" alt="" />
              </span>
            </span>
          </span>
        </div>
        <p class="faq-item__answer faq-item__answer--sm">
          Нет. Всё настраивается без технических знаний.
        </p>
      </li>

      <!-- Item 5 — Default -->
      <li
        class="faq-item faq-item--default faq-item--pad-sm"
        role="button"
        aria-expanded="false"
        tabindex="0"
        data-node-id="2903:24413"
      >
        <div class="faq-item__question" data-node-id="I2903:24413;1256:14400">
          <span class="faq-item__q-text faq-item__q-text--md" data-node-id="I2903:24413;1256:14401">
            Можно попробовать бесплатно?
          </span>
          <span class="faq-item__icon" aria-hidden="true">
            <span class="faq-item__icon-plus">
              <img src="https://www.figma.com/api/mcp/asset/f358159e-5c8f-42b5-ac28-8a1186e22a62" alt="" />
            </span>
            <span class="faq-item__icon-minus">
              <span class="faq-item__icon-minus-inner">
                <img src="https://www.figma.com/api/mcp/asset/94559e6a-cd81-4e40-8705-0767a9eb92a8" alt="" />
              </span>
            </span>
          </span>
        </div>
        <p class="faq-item__answer faq-item__answer--sm">
          Да. 14 дней полного доступа без карты.
        </p>
      </li>

    </ul>
  </div>
</section>


<!-- ══════════════════════════════════════════════════════════
     JavaScript — Accordion toggle
     ══════════════════════════════════════════════════════════ -->
<script>
  (function () {
    /**
     * FAQ Accordion
     * Toggles aria-expanded on .faq-item on click / Enter / Space.
     * Icon swap and answer visibility are CSS-driven via aria-expanded.
     */
    function initFaqAccordion(root) {
      var items = root.querySelectorAll('.faq-item');
      items.forEach(function (item) {
        item.addEventListener('click', function () {
          var isOpen = item.getAttribute('aria-expanded') === 'true';
          item.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
          if (isOpen) {
            item.classList.remove('faq-item--active');
          } else {
            item.classList.add('faq-item--active');
          }
        });
        item.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            item.click();
          }
        });
      });
    }

    document.querySelectorAll('.faq-section').forEach(initFaqAccordion);
  })();
</script>
```

---

## FAQ Item — component props

| Prop | Тип | Default | Описание |
|------|-----|---------|----------|
| `property1` | `"Default" \| "Active"` | `"Default"` | Состояние элемента |
| `view` | `"Desktop" \| "Mobile"` | `"Desktop"` | Брейкпоинт |
| `textZagolovok` | `string` | `"Заголовок"` | Текст вопроса |
| `text` | `string` | `"…"` | Текст ответа |

---

## States

| Состояние | Border | Question text | Answer |
|-----------|--------|---------------|--------|
| **Default** | `transparent` (border: 0) | 20px Regular `#2d2d2d` (Desktop/Tablet) / 16px Regular (Mobile) | скрыт |
| **Hover** | `1px solid #e5e7eb` | без изменений | скрыт |
| **Active** | `1px solid #7d4ccf` | 20px SemiBold `#7d4ccf` (Desktop/Tablet) / 16px **Medium** `#7d4ccf` (Mobile) | виден |

> ⚠️ Важное отличие Mobile Active от Desktop/Tablet Active: `font-weight: 500 (Medium)` вместо `600 (SemiBold)` — Figma node `1256:14396` vs `1207:17762`.

---

## Breakpoints

| Имя | Диапазон | Node | Container | Padding секции | Gap container | Question fs |
|-----|----------|------|-----------|----------------|---------------|-------------|
| Desktop | `≥ 1280px` | `2041-30818` | `1216px` | `pt 96px pb 128px` | `48px` | `20px` |
| Tablet | `768–1279px` | `2813-39967` | `720px` | `py 64px px 24px` | `32px` | `20px` |
| Mobile | `< 768px` | `2041-30866` | `100%` | `py 48px px 16px` | `24px` | `16px` |

---

## Accessibility

- Секция — `<section>` с `aria-label`.
- Элементы FAQ — `role="button"`, `tabindex="0"`, `aria-expanded`.
- Иконки — `aria-hidden="true"`.
- Клавиатурная навигация: `Enter` / `Space` открывают/закрывают элемент.
- Заголовок секции — семантический `<h2>`.

---

## Changelog

| Версия | Дата | Описание |
|--------|------|----------|
| 1.0.0 | 2026-06-05 | Первичная реализация Desktop + Tablet + Mobile + JS-аккордеон |
| 2.0.0 | 2026-06-29 | Реализация на лендинге «Кайтен для производств»: нативные `<details>`, плавная анимация `::details-content`, «открыт один вопрос», иконка `+/−` на CSS, hover-подсветка вопроса (см. ниже) |

---

## Реализация на лендинге (vercel_index.html) — каноничная, отличия от Figma-спеки

На лендинге `#faq` собран НЕ на `li role="button"`, а на **нативных `<details>`** — один адаптивный блок (без раздельных Desktop/Tablet/Mobile секций, всё через медиа-запросы). Ключевые улучшения против Figma-спеки выше:

| Что | Figma-спека (выше) | Лендинг (актуально) |
|---|---|---|
| Разметка | `<li role="button" aria-expanded>` ×3 секции | один `<details class="faq-item">` на вопрос |
| Раскрытие | `display:none` → `block` (мгновенно) | **плавно**: `::details-content` `block-size:0→auto` + `interpolate-size`, 0.24s `cubic-bezier(.2,0,.2,1)` |
| Несколько открытых | каждый сам по себе (multi-open) | **открыт только один** (JS на `toggle`) |
| Иконка `+/−` | картинки из Figma (ассеты на 7 дней) | CSS: две полоски-псевдоэлемента, при `[open]` вертикаль гаснет |
| Hover | только рамка `#e5e7eb` | рамка + **текст вопроса → `#7d4ccf`** |
| Ширина текста ответа (desktop) | 776px | **900px** (`.faq-item__answer{max-width:900px}`), карточки — 1216px |
| Отступы секции (desktop) | pt 96 / pb 128 | **96 / 96** (`#faq{padding:96px 0}` ≥1280); планшет 32, мобилка 24 (общий ритм) |
| Шрифт | Roboto | `var(--font)` = Roboto/Inter/system-ui |

### CSS (как в проекте)
```css
.faq-section{background-color:var(--surface-section);width:100%}
.faq-section__container{display:flex;flex-direction:column;align-items:center;width:100%;gap:var(--sp-12);max-width:1216px;margin:0 auto}
.faq-section__title{font-weight:var(--fw-semi);color:var(--text-title);text-align:center;width:100%;font-size:var(--fs-4xl);line-height:var(--lh-4xl)}
.faq-list{display:flex;flex-direction:column;align-items:center;gap:var(--sp-4);width:100%;list-style:none}

.faq-item{background:#fff;border-radius:12px;width:100%;border:1px solid transparent;display:flex;flex-direction:column;
  cursor:pointer;text-align:left;transition:border-color .2s ease;interpolate-size:allow-keywords}
.faq-item:hover{border-color:#e5e7eb}
.faq-item[open]{border-color:var(--brand-100)}
/* плавное раскрытие реальной высоты */
.faq-item::details-content{block-size:0;overflow:hidden;opacity:0;
  transition:block-size .24s cubic-bezier(.2,0,.2,1),opacity .2s ease,content-visibility .24s allow-discrete}
.faq-item[open]::details-content{block-size:auto;opacity:1}

.faq-item--pad-lg>summary{padding:var(--sp-6)}
.faq-item[open].faq-item--pad-lg>summary{padding:var(--sp-6) var(--sp-6) var(--sp-4)}
.faq-item__question{display:flex;align-items:flex-start;justify-content:space-between;width:100%;gap:var(--sp-4);list-style:none}
.faq-item>summary{list-style:none}.faq-item>summary::-webkit-details-marker{display:none}
.faq-item__q-text{font-weight:var(--fw-reg);color:var(--text-title);flex:1 0 0;min-width:0;word-break:break-word;transition:color .18s ease}
.faq-item__q-text--xl{font-size:var(--fs-xl);line-height:var(--lh-xl)}
.faq-item:hover .faq-item__q-text,.faq-item:hover .faq-item__icon{color:var(--brand-100)}   /* hover — фиолетовый вопрос+иконка */
.faq-item[open] .faq-item__q-text{font-weight:var(--fw-semi);color:var(--brand-100)}

/* иконка + / − на псевдоэлементах (без картинок) */
.faq-item__icon{position:relative;flex-shrink:0;width:24px;height:24px;color:var(--k600)}
.faq-item[open] .faq-item__icon{color:var(--brand-100)}
.faq-item__icon::before{content:"";position:absolute;left:5px;right:5px;top:11px;height:2px;background:currentColor;border-radius:2px}
.faq-item__icon::after{content:"";position:absolute;top:5px;bottom:5px;left:11px;width:2px;background:currentColor;border-radius:2px;transition:opacity .2s}
.faq-item[open] .faq-item__icon::after{opacity:0}   /* открыт → минус */

.faq-item__answer{font-weight:var(--fw-reg);color:var(--text-secondary);word-break:break-word;width:100%;max-width:900px;padding:0 var(--sp-6) var(--sp-6)}
.faq-item__answer--md{font-size:var(--fs-md);line-height:var(--lh-md)}
.faq-item__answer a{color:var(--brand-100);text-decoration:underline}   /* ссылки фиолетовые + подчёркивание */

/* мобилка ≤767 */
@media(max-width:767px){
  .faq-section__title{font-size:var(--fs-2xl)}
  .faq-item--pad-lg>summary{padding:var(--sp-4)}
  .faq-item[open].faq-item--pad-lg>summary{padding:var(--sp-4) var(--sp-4) var(--sp-3)}
  .faq-item__q-text--xl{font-size:var(--fs-md);line-height:var(--lh-md)}
  .faq-item__answer{padding:0 var(--sp-4) var(--sp-4)}
  .faq-item__answer--md{font-size:var(--fs-sm);line-height:var(--lh-sm)}
}
/* отступы секции по вертикали (десктоп) */
@media(min-width:1280px){ #faq{padding-top:var(--sp-24);padding-bottom:var(--sp-24)} }   /* 96/96 */
```

### HTML (как в проекте)
```html
<section class="s faq-section" id="faq" aria-label="Часто задаваемые вопросы"><div class="container">
  <div class="faq-section__container">
    <h2 class="faq-section__title">Нас часто спрашивают</h2>
    <ul class="faq-list">
      <li style="width:100%;list-style:none">
        <details class="faq-item faq-item--pad-lg" open>   <!-- open только у первого -->
          <summary><span class="faq-item__question">
            <span class="faq-item__q-text faq-item__q-text--xl">Вопрос?</span>
            <span class="faq-item__icon" aria-hidden="true"></span>
          </span></summary>
          <p class="faq-item__answer faq-item__answer--md">Ответ… <a href="…">Ссылка →</a></p>
        </details>
      </li> …
    </ul>
  </div>
</div></section>
```

### JS (как в проекте) — открыт только один вопрос
```js
(function(){
  var items=[].slice.call(document.querySelectorAll('#faq .faq-item'));
  items.forEach(function(d){
    d.addEventListener('toggle',function(){
      d.setAttribute('aria-expanded', d.open?'true':'false');
      if(d.open){ items.forEach(function(o){ if(o!==d && o.open){ o.open=false; } }); }
    });
  });
})();
```

> Поддержка `::details-content`/`interpolate-size` — Chrome 131+/129+. Без поддержки — раскрытие мгновенное (мягкая деградация, без рывка). **Не использовать `max-height`-фикс** — он даёт рывок. См. также [[accordion.md]].
