# Illustration Styles

Руководство по стилю иллюстраций продуктового лендинга. Все иллюстрации строятся строго по палитре **Color Dop**, единой системе форм, теней и типографики дизайн-системы Landing-DS.

**Figma — Color Dop:** [node `7196-20042`](https://www.figma.com/design/6M8lLx2PgVTxwXMeRiOVH4/Landing-DS?node-id=7196-20042)
**Figma — Иллюстрации «Фичи»:** [section `7196-3170`](https://www.figma.com/design/6M8lLx2PgVTxwXMeRiOVH4/Landing-DS?node-id=7195-2592)

---

## 1. Палитра Color Dop

Единственный допустимый набор цветов. Каждый цвет — пара: **100** (насыщенный, для акцентов) + **12** (прозрачный 12%, для фонов).

| Название | 100 — насыщенный | 12 — прозрачный |
|----------|-----------------|----------------|
| **Violet** | `#7D4CCF` | `rgba(125,76,207,0.12)` = `#EFE9F9` |
| **Purple** | `#9C27B0` | `rgba(156,39,176,0.12)` |
| **Red** | `#F44336` | `rgba(244,67,54,0.12)` = `#FDE8E6` |
| **Orange** | `#FFA100` | `rgba(255,161,0,0.12)` = `#FFF0D9` |
| **Lime** | `#CDDC39` | `rgba(205,220,57,0.12)` |
| **Green** | `#4CAF51` | `rgba(76,175,81,0.12)` = `#E9F5EA` |
| **Blue** | `#2196F3` | `rgba(33,150,243,0.12)` |

### CSS-переменные

```css
:root {
  --dop-violet-100: #7D4CCF;
  --dop-violet-12:  rgba(125, 76, 207, 0.12);  /* = #EFE9F9 */

  --dop-purple-100: #9C27B0;
  --dop-purple-12:  rgba(156, 39, 176, 0.12);

  --dop-red-100:    #F44336;
  --dop-red-12:     rgba(244, 67, 54, 0.12);   /* = #FDE8E6 */

  --dop-orange-100: #FFA100;
  --dop-orange-12:  rgba(255, 161, 0, 0.12);   /* = #FFF0D9 */

  --dop-lime-100:   #CDDC39;
  --dop-lime-12:    rgba(205, 220, 57, 0.12);

  --dop-green-100:  #4CAF51;
  --dop-green-12:   rgba(76, 175, 81, 0.12);   /* = #E9F5EA */

  --dop-blue-100:   #2196F3;
  --dop-blue-12:    rgba(33, 150, 243, 0.12);
}
```

---

## 2. Семантика цветов

| Статус / состояние | Цвет 100 (элементы) | Цвет 12 (фоны) |
|-------------------|---------------------|----------------|
| Бренд / активный / выбранный | `Violet 100` `#7D4CCF` | `#EFE9F9` |
| Успех / завершено / онлайн | `Green 100` `#4CAF51` | `#E9F5EA` |
| Предупреждение / в работе / ожидание | `Orange 100` `#FFA100` | `#FFF0D9` |
| Ошибка / блокер / просрочено | `Red 100` `#F44336` | `#FDE8E6` |
| Информация / ссылка | `Blue 100` `#2196F3` | `rgba(33,150,243,0.12)` |
| Вторичный акцент / метка | `Purple 100` `#9C27B0` | `rgba(156,39,176,0.12)` |

> **Правило 100/12:** насыщенный (100) — точки-статусы, иконки, бордеры контролов, filled-кнопки; прозрачный (12) — фон карточки Kanban, подсветка строки, фон активного dropdown, заливка hover.

---

## 3. Базовые стили иллюстраций

### Контейнер иллюстрации-фичи

```css
.illus {
  width: 314px;
  height: 220px;
  background: #ffffff;
  border-radius: 16px;        /* --border-radius/rounded-2xl */
  overflow: hidden;
  position: relative;
  font-family: 'Roboto', sans-serif;
}
```

### Нейтральная палитра (структурные элементы)

Разделители, заглушки, неактивные элементы — НЕ Color Dop:

| Элемент | Цвет | DS-токен |
|---------|------|---------|
| Разделители / бордеры таблицы | `#EEEEEE` | k200 |
| Заглушки текста (placeholder) | `#EEEEEE` | k200 |
| Неактивные точки меню | `#E0E0E0` | k300 |
| Вторичный текст / подписи | `#757575` | k600 |
| Основной текст | `#2D2D2D` | k900 |
| Заголовок колонки таблицы | `#898989` | — |
| Фон заголовка таблицы | `#F3F3F3` | — |
| Нейтральный фон (dropdown) | `#F5F5F5` | — |

### Масштаб типографики

Иллюстрации — сжатый UI ~0.5×:

| Элемент | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Заголовок секции/блока | Roboto | 10px | Bold 700 | `#424242` |
| Активный таб / акцент | Roboto | 10px | Regular | `#7D4CCF` |
| Неактивный таб | Roboto | 10px | Regular | `#757575` |
| Заголовок колонки таблицы | Roboto | 9px | Regular | `#898989` |
| Текст строки / поля | Roboto | 10–12px | Regular | `#424242` / `#757575` |
| Мелкая метка (чекбокс, AI) | Roboto | 7.5–11.5px | Regular | `#2D2D2D` |

---

## 4. Каталог иллюстраций «Фичи»

### 4.1 Kanban-доска

**Нода:** `7196:16227` | **Figma:** [открыть](https://www.figma.com/design/6M8lLx2PgVTxwXMeRiOVH4/Landing-DS?node-id=7196-16227)

**Сценарий:** Kanban-вид задач с цветными карточками, активным проектом в сайдбаре.

```
┌── 314×220px ──────────────────────────────────────────────────────┐
│ Sidebar 75px      │  [тулбар вида]                                 │
│ · ─────────       │  Делопроизводство  (Bold 10px #424242)         │
│ · ──────          │                                                 │
│ ▓ Проект ◀ active │  Очередь    В работе   [empty]   Готово        │
│   (Violet 12 bg)  │  ┌──────┐  ┌──────┐             ┌──────┐      │
│ · ─────           │  │FDE8E6│  │FFF0D9│             │FDE8E6│ Red  │
│ · ──────          │  │E9F5EA│  │FDE8E6│             │E9F5EA│ Green│
│                   │  │F5F5F5│  │E9F5EA│             │FFF0D9│ Org  │
│                   │  │↓fade │             │↓fade Green  fade│      │
└───────────────────────────────────────────────────────────────────┘
```

**Цвета карточек Kanban** (Color Dop 12, border-radius: 2px):

| Цвет карточки | HEX | Токен | Значение |
|--------------|-----|-------|---------|
| `#FDE8E6` | Red 12 | Заблокировано / срочно |
| `#E9F5EA` | Green 12 | Завершено / ОК |
| `#FFF0D9` | Orange 12 | В работе / ожидание |
| `#F5F5F5` | — | Нет статуса |
| `gradient: #FFF0D9 → transparent` | Orange 12 fade | Фейд вниз |
| `gradient: #E9F5EA → transparent` | Green 12 fade | Фейд вниз |

```html
<style>
  .illus-kanban {
    width: 314px; height: 220px; background: #fff;
    border-radius: 16px; overflow: hidden; position: relative;
    font-family: 'Roboto', sans-serif;
  }
  .ik-sidebar {
    position: absolute; left: 0; top: 0;
    width: 75px; height: 220px; background: #fff;
  }
  /* Подсветка активного пункта — Violet 12 */
  .ik-highlight {
    position: absolute; left: 7px; top: 92px;
    width: 70px; height: 18px;
    background: #EFE9F9;
  }
  .ik-divider {
    position: absolute; left: 75px; top: 0;
    width: 1px; height: 199px; background: #EEEEEE;
  }
  .ik-nav { display: flex; flex-direction: column; gap: 9px; padding: 13px; }
  .ik-row { display: flex; align-items: center; gap: 4px; }
  .ik-dot { width: 7px; height: 7px; border-radius: 4px; background: #E0E0E0; flex-shrink: 0; }
  /* Активная точка — Violet 100 */
  .ik-dot--active { background: #7D4CCF; border: 1px solid #7D4CCF; }
  .ik-label { font-size: 10px; font-weight: 700; color: #424242; letter-spacing: .15px; font-variation-settings: "wdth" 100; }
  .ik-stub { height: 5px; border-radius: 4px; background: #EEEEEE; }
  .ik-board { position: absolute; left: 84px; top: 40px; width: 222px; }
  .ik-board-title { font-size: 10px; font-weight: 700; color: #424242; letter-spacing: .25px; margin-bottom: 10px; font-variation-settings: "wdth" 100; }
  .ik-cols { display: flex; gap: 4px; }
  .ik-col { display: flex; flex-direction: column; gap: 4px; width: 47px; flex-shrink: 0; }
  .ik-col-title { font-size: 10px; color: #898989; letter-spacing: .1465px; margin-bottom: 4px; font-variation-settings: "wdth" 100; }
  /* Карточки Kanban — Color Dop 12 */
  .card { border-radius: 2px; width: 100%; }
  .card--red    { background: #FDE8E6; }
  .card--green  { background: #E9F5EA; }
  .card--orange { background: #FFF0D9; }
  .card--neutral{ background: #F5F5F5; }
  .card--fade-orange { background: linear-gradient(to bottom, #FFF0D9, transparent); }
  .card--fade-green  { background: linear-gradient(to bottom, #E9F5EA, transparent); }
</style>

<div class="illus-kanban" data-node-id="7196:16227">
  <div class="ik-sidebar">
    <div class="ik-highlight"></div>
    <div class="ik-nav">
      <div class="ik-row"><div class="ik-stub" style="width:55px;"></div></div>
      <div class="ik-row"><div class="ik-dot"></div><div class="ik-stub" style="width:32px;"></div></div>
      <div class="ik-row"><div class="ik-dot"></div><div class="ik-stub" style="width:40px;"></div></div>
      <div class="ik-row"><div class="ik-dot"></div><div class="ik-stub" style="width:32px;"></div></div>
      <!-- Активный пункт: Проект — Violet 100 -->
      <div class="ik-row"><div class="ik-dot ik-dot--active"></div><span class="ik-label">Проект</span></div>
      <div class="ik-row"><div class="ik-dot"></div><div class="ik-stub" style="width:32px;"></div></div>
      <div class="ik-row"><div class="ik-dot"></div><div class="ik-stub" style="width:39px;"></div></div>
    </div>
    <div class="ik-divider"></div>
  </div>
  <div class="ik-board">
    <div class="ik-board-title">Делопроизводство</div>
    <div class="ik-cols">
      <div class="ik-col">
        <div class="ik-col-title">Очередь</div>
        <div class="card card--red"     style="height:21px;"></div>
        <div class="card card--green"   style="height:31px;"></div>
        <div class="card card--neutral" style="height:30px;"></div>
        <div class="card card--fade-orange" style="height:28px;"></div>
      </div>
      <div class="ik-col">
        <div class="ik-col-title">В работе</div>
        <div class="card card--orange"  style="height:31px;"></div>
        <div class="card card--red"     style="height:33px;"></div>
        <div class="card card--green"   style="height:32px;"></div>
      </div>
      <div class="ik-col"><div class="ik-col-title">&nbsp;</div></div>
      <div class="ik-col">
        <div class="ik-col-title">Готово</div>
        <div class="card card--red"     style="height:21px;"></div>
        <div class="card card--green"   style="height:32px;"></div>
        <div class="card card--orange"  style="height:29px;"></div>
        <div class="card card--fade-green" style="height:28px;"></div>
      </div>
    </div>
  </div>
</div>
```

---

### 4.2 Права доступа

**Нода:** `7196:16320` | **Figma:** [открыть](https://www.figma.com/design/6M8lLx2PgVTxwXMeRiOVH4/Landing-DS?node-id=7196-16320)

**Сценарий:** Панель выбора роли для пользователя, декоративная иллюстрация щита справа.

```
┌── 314×220px ──────────────────────────────────┐
│  ┌── белая панель 239px ─────────┐  [🛡 щит]  │
│  │  [аватар]  @nickname          │  (Violet 12)│
│  │            Комментатор        │             │
│  │  Роль                         │             │
│  │  ○ администратор (Violet out) │             │
│  │  ○ редактор      (Violet out) │             │
│  │  ● комментатор   (Violet fill)│             │
│  └───────────────────────────────┘             │
└────────────────────────────────────────────────┘
```

| Элемент | Цвет | Токен |
|---------|------|-------|
| Radio unchecked | `border: 1px solid #7D4CCF` | Violet 100 outline |
| Radio checked | `background: #7D4CCF` | Violet 100 filled |
| Иллюстрация-щит | `rgba(125,76,207,0.12)` тона | Violet 12 |

```html
<style>
  .illus-roles {
    width: 314px; height: 220px; background: #fff;
    border-radius: 16px; overflow: hidden; position: relative;
    font-family: 'Roboto', sans-serif;
  }
  .ir-panel { position: absolute; left: 0; top: 0; width: 239px; height: 220px; background: #fff; border-radius: 16px; }
  .ir-user { display: flex; align-items: center; gap: 11px; position: absolute; left: 19px; top: 18px; }
  .ir-avatar { width: 40px; height: 40px; border-radius: 50%; overflow: hidden; flex-shrink: 0; }
  .ir-avatar img { width: 100%; height: 100%; object-fit: cover; }
  .ir-name { font-size: 16px; color: #000; line-height: 24px; font-variation-settings: "wdth" 100; }
  .ir-subtitle { font-size: 14px; color: #757575; line-height: 20px; font-variation-settings: "wdth" 100; }
  .ir-roles { position: absolute; left: 19px; top: 83px; width: 129px; }
  .ir-roles-label { font-size: 14px; color: #757575; line-height: 20px; letter-spacing: -0.2px; margin-bottom: 14px; font-variation-settings: "wdth" 100; }
  .ir-options { display: flex; flex-direction: column; gap: 12px; }
  .ir-option { display: flex; align-items: flex-start; gap: 12px; }
  /* Radio unchecked — Violet 100 outline */
  .ir-radio { width: 16px; height: 16px; border-radius: 50%; border: 1px solid #7D4CCF; flex-shrink: 0; margin-top: 2px; background: transparent; }
  /* Radio checked — Violet 100 filled */
  .ir-radio--checked { background: #7D4CCF; border-color: #7D4CCF; }
  .ir-option-text { font-size: 14px; color: #2D2D2D; line-height: 20px; letter-spacing: -0.2px; white-space: nowrap; font-variation-settings: "wdth" 100; }
  .ir-shield { position: absolute; left: 140px; top: 27px; width: 174px; height: 174px; }
  .ir-shield img { width: 100%; height: 100%; }
</style>

<div class="illus-roles" data-node-id="7196:16320">
  <div class="ir-panel"></div>
  <!-- Аватар + имя -->
  <div class="ir-user">
    <div class="ir-avatar">
      <img src="https://www.figma.com/api/mcp/asset/762c40f2-2cba-4c9f-9315-ad9f0bfe096d" alt="Аватар" />
    </div>
    <div>
      <div class="ir-name">@nickname</div>
      <div class="ir-subtitle">Комментатор</div>
    </div>
  </div>
  <!-- Роли -->
  <div class="ir-roles">
    <div class="ir-roles-label">Роль</div>
    <div class="ir-options">
      <div class="ir-option"><div class="ir-radio"></div><span class="ir-option-text">администратор</span></div>
      <div class="ir-option"><div class="ir-radio"></div><span class="ir-option-text">редактор</span></div>
      <!-- Checked — Violet 100 -->
      <div class="ir-option"><div class="ir-radio ir-radio--checked"></div><span class="ir-option-text">комментатор</span></div>
    </div>
  </div>
  <!-- Декоративный щит (Violet 12 тона) -->
  <div class="ir-shield">
    <img src="https://www.figma.com/api/mcp/asset/8cc87217-ce58-4f1c-92af-a312b80aabd8" alt="" aria-hidden="true" />
  </div>
</div>
```

---

### 4.3 Кайтен AI

**Нода:** `7196:16347` | **Figma:** [открыть](https://www.figma.com/design/6M8lLx2PgVTxwXMeRiOVH4/Landing-DS?node-id=7196-16347)

**Сценарий:** AI-помощник предлагает действия для улучшения задачи. Активный пункт подсвечен Violet 12.

```
┌── 314×220px ────────────────────────────────────────────────────┐
│ ┌────────────────────────────────────────────────────────────┐  │
│ │ [🤖 KAI]  Привет!                                          │  │
│ │           Я — ваш AI-помощник, готовый улучшить эту задачу │  │
│ └────────────────────────────────────────────────────────────┘  │
│  📅  Спрогнозировать срок          (серый #757575)              │
│  ✏️  Исправить орфографию          (серый)                      │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ← Violet 12 подсветка       │
│  📚  Привести в порядок            (#2D2D2D активный)           │
│  📝  Расписать подробнее           (серый)                      │
│  🏗   Декомпозировать задачу        (серый)                      │
└─────────────────────────────────────────────────────────────────┘
```

| Элемент | Цвет | Токен |
|---------|------|-------|
| Подсветка активного пункта | `#EFE9F9` + `mix-blend-mode: multiply` | Violet 12 |
| Текст активного пункта | `#2D2D2D` | k900 |
| Текст неактивных пунктов | `#757575` | k600 |
| KAI smile (пиксели) | `#4CAF51` | Green 100 |

```html
<style>
  .illus-ai {
    width: 314px; height: 220px; background: #fff;
    border-radius: 16px; overflow: hidden; position: relative;
    font-family: 'Roboto', sans-serif;
  }
  .ai-avatar { position: absolute; left: 14px; top: 13px; width: 40px; height: 40px; border-radius: 20px; background: #fff; border: 1px solid rgba(18,18,18,0.12); overflow: hidden; }
  .ai-avatar img { width: 100%; height: 100%; object-fit: cover; }
  .ai-card { position: absolute; left: 63px; top: 13px; width: 237px; height: 67px; border: 1px solid rgba(18,18,18,0.12); border-radius: 8px; background: #fff; padding: 8px 10px; }
  .ai-card-text { font-size: 11.5px; color: #757575; line-height: 18px; letter-spacing: -0.2px; white-space: pre-wrap; font-variation-settings: "wdth" 100; }
  .ai-actions { position: absolute; left: 63px; top: 90px; width: 240px; }
  .ai-action { display: flex; align-items: center; gap: 16px; height: 24px; padding: 0 4px; position: relative; }
  /* Активный пункт — Violet 12 */
  .ai-action--active { background: #EFE9F9; mix-blend-mode: multiply; border-radius: 4px; }
  .ai-action-icon { width: 24px; flex-shrink: 0; }
  .ai-action-icon img { width: 24px; height: auto; display: block; }
  .ai-text { font-size: 12px; letter-spacing: -0.2px; line-height: 24px; font-variation-settings: "wdth" 100; }
  .ai-text--inactive { color: #757575; }
  .ai-text--active   { color: #2D2D2D; }
</style>

<div class="illus-ai" data-node-id="7196:16347">
  <div class="ai-avatar">
    <img src="https://www.figma.com/api/mcp/asset/b3ccf069-cf50-4075-9b1e-c9469b973b9b" alt="KAI AI-помощник" />
  </div>
  <div class="ai-card">
    <p class="ai-card-text">Привет!
Я — ваш AI-помощник, готовый улучшить
эту задачу. Что вы хотите сделать?</p>
  </div>
  <div class="ai-actions">
    <div class="ai-action">
      <img class="ai-action-icon" src="https://www.figma.com/api/mcp/asset/6e964479-570a-425e-87ee-c6bd0a2f5f57" alt="" aria-hidden="true" />
      <span class="ai-text ai-text--inactive">Спрогнозировать срок</span>
    </div>
    <div class="ai-action">
      <img class="ai-action-icon" src="https://www.figma.com/api/mcp/asset/6e964479-570a-425e-87ee-c6bd0a2f5f57" alt="" aria-hidden="true" />
      <span class="ai-text ai-text--inactive">Исправить орфографию</span>
    </div>
    <!-- Активный пункт — Violet 12 bg -->
    <div class="ai-action ai-action--active">
      <img class="ai-action-icon" src="https://www.figma.com/api/mcp/asset/6e964479-570a-425e-87ee-c6bd0a2f5f57" alt="" aria-hidden="true" />
      <span class="ai-text ai-text--active">Привести в порядок</span>
    </div>
    <div class="ai-action">
      <img class="ai-action-icon" src="https://www.figma.com/api/mcp/asset/6e964479-570a-425e-87ee-c6bd0a2f5f57" alt="" aria-hidden="true" />
      <span class="ai-text ai-text--inactive">Расписать подробнее</span>
    </div>
    <div class="ai-action">
      <img class="ai-action-icon" src="https://www.figma.com/api/mcp/asset/6e964479-570a-425e-87ee-c6bd0a2f5f57" alt="" aria-hidden="true" />
      <span class="ai-text ai-text--inactive">Декомпозировать задачу</span>
    </div>
  </div>
</div>
```

---

## 5. Общие CSS-паттерны Color Dop

### Точки-статусы

```css
/* Стандарт: 6×6px, border-radius: 10px */
.status-dot { width: 6px; height: 6px; border-radius: 10px; flex-shrink: 0; }
.status-dot--orange { background: #FFA100; }  /* Orange 100 — в работе     */
.status-dot--green  { background: #4CAF51; }  /* Green 100  — выполнено    */
.status-dot--red    { background: #F44336; }  /* Red 100    — ошибка       */
.status-dot--violet { background: #7D4CCF; }  /* Violet 100 — активный     */
.status-dot--blue   { background: #2196F3; }  /* Blue 100   — информация   */
```

### Подсветка активного элемента

```css
.highlight-violet {
  background: #EFE9F9;        /* Violet 12 */
}
/* Поверх белого фона с blend */
.highlight-violet-blend {
  background: #EFE9F9;
  mix-blend-mode: multiply;
}
```

### Карточки Kanban (Color Dop 12)

```css
.kanban-card { border-radius: 2px; }
.kanban-card--orange { background: #FFF0D9; }  /* Orange 12 */
.kanban-card--green  { background: #E9F5EA; }  /* Green 12  */
.kanban-card--red    { background: #FDE8E6; }  /* Red 12    */
/* Fade-out последней карточки в колонке */
.kanban-card--fade-orange { background: linear-gradient(to bottom, #FFF0D9, transparent); }
.kanban-card--fade-green  { background: linear-gradient(to bottom, #E9F5EA, transparent); }
.kanban-card--fade-red    { background: linear-gradient(to bottom, #FDE8E6, transparent); }
```

### Radio / Checkbox

```css
/* Radio unchecked — Violet 100 outline */
.radio { border: 1px solid #7D4CCF; background: transparent; border-radius: 50%; }
/* Radio checked — Violet 100 filled */
.radio--checked { background: #7D4CCF; border-color: #7D4CCF; border-radius: 50%; }

/* Checkbox unchecked */
.checkbox { border: 1px solid #7D4CCF; background: #fff; border-radius: 8px; }
/* Checkbox checked */
.checkbox--checked { background: #7D4CCF; border-color: #7D4CCF; border-radius: 8px; }
```

---

## 6. Правила применения

### Обязательно

- Использовать только Color Dop для статусов, акцентов и фонов
- Соблюдать правило 100/12: насыщенный → элементы, прозрачный → фоны
- Карточки иллюстраций: `314×220px`, `border-radius: 16px`, `overflow: hidden`
- Уменьшать типографику ~0.5× относительно реального UI
- Применять `mix-blend-mode: multiply` для Violet 12 поверх белого фона

### Запрещено

- Произвольные цвета вне Color Dop и нейтральных серых k200/k300
- Смешивать разные Color Dop-цвета без семантического обоснования
- Использовать Violet для «ошибки», Red для «успеха» и т.д.
- Добавлять внешние тени (только `inset shadow` при необходимости рельефа)
- Текст крупнее 14px внутри карточки иллюстрации

---

## Changelog

| Версия | Дата | Описание |
|--------|------|---------|
| 1.0.0 | 2026-06-05 | Полная палитра Color Dop; 3 иллюстрации «Фичи» (Kanban, Права доступа, Кайтен AI) с HTML+CSS и data-node-id; общие паттерны |
