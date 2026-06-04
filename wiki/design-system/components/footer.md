---
slug: ds-component-footer
type: design-system
created: 2026-05-15
updated: 2026-06-04
sources:
  - https://www.figma.com/design/6M8lLx2PgVTxwXMeRiOVH4/Landing-DS?node-id=7142-13339&m=dev
  - https://www.figma.com/design/6M8lLx2PgVTxwXMeRiOVH4/Landing-DS?node-id=7146-4343&m=dev
  - packages/ui/src/landing/LandingFooter.tsx
related:
  - wiki/design-system/grid.md
  - wiki/design-system/colors.md
  - wiki/design-system/typography.md
  - wiki/design-system/components/button.md
tags:
  - component
  - section
  - footer
stale: false
---

# LandingFooter

Подвал лендинга Kaiten. Компонент всегда ставится последней секцией страницы и собирает вторичную навигацию, блок сравнения, соцканалы, новые статьи, подписку, юридические данные и нижнюю контактную строку.

Референсы Figma:

- Desktop: `Landing DS`, node `7142:13339`
- Mobile: `Landing DS`, node `7146:4343`

## Структура

- **companyLinks** `4 items` - `Тарифы`, `Контакты`, `Сертификаты`, `Скачать презентацию`
- **resourceLinks** `5 items` - `База знаний`, `Кейсы`, `Блог`, `API`, `Комьюнити`
- **featureLinks** `6 items` - `Партнерская программа`, `Реферальная программа`, `Дополнения`, `On-premise`, `Внедрение`, `Кайтен AI`
- **comparisonLinks** `16 items` - список конкурентов/альтернатив в несколько строк
- **socialChannels** `2 items` - Telegram, Max
- **newArticles** `2 items` - две последние статьи с квадратной фиолетовой иконкой
- **newsletter** - заголовок, описание, e-mail input, primary button, два checkbox-согласия
- **registryStatus** - статус российского ИТ-разработчика, номер реестра, ссылка `Подробнее`
- **legalEntity** - название, ИНН, КПП, юридический адрес
- **contacts** - логотип Kaiten, телефон, email, участник Сколково, VK, R, Habr
- **legalLinks** `5 items` - политика, договор, соглашение, оплата картами, техподдержка

## Визуальный код

```tsx
export function LandingFooter() {
  const companyLinks = ['Тарифы', 'Контакты', 'Сертификаты', 'Скачать презентацию'];
  const resourceLinks = ['База знаний', 'Кейсы', 'Блог', 'API', 'Комьюнити'];
  const featureLinks = [
    'Партнерская программа',
    'Реферальная программа',
    'Дополнения',
    'On-premise',
    'Внедрение',
    'Кайтен AI',
  ];
  const comparisonLinks = [
    'Trello',
    'Jira',
    'Asana',
    'Weeek',
    'Wrike',
    'ClickUp',
    'EvaTeam',
    'MS Project',
    'Notion',
    'Confluence',
    'GanttPRO',
    'Google Docs',
    'Redmine',
    'Youtrack',
    'Zendesk',
    'Okdesk',
    'Юздеск',
  ];

  return (
    <footer className="kaiten-footer">
      <div className="kaiten-footer__inner">
        <div className="kaiten-footer__top">
          <FooterColumn title="Компания" links={companyLinks} />
          <FooterColumn title="Ресурсы" links={resourceLinks} />
          <FooterColumn title="Возможности" links={featureLinks} />
          <FooterComparison links={comparisonLinks} />

          <div className="kaiten-footer__cards">
            <FooterCard title="Каналы в соцсетях">
              <p>Фичи, новости и статьи про эффективное управление</p>
              <div className="kaiten-footer__socials">
                <IconLink icon="telegram" label="Telegram" />
                <IconLink icon="max" label="Max" />
              </div>
            </FooterCard>

            <FooterCard title="Новые статьи">
              <ArticleLink title="Каждый второй сотрудник устает от многозадачности: что показало..." />
              <ArticleLink title="Как сохранить знания команды на пути от гипотезы к разработке" />
            </FooterCard>
          </div>

          <form className="kaiten-footer__newsletter">
            <h3>Подписаться на рассылку</h3>
            <p>Получайте кейсы пользователей, статьи и обновления.</p>
            <input type="email" placeholder="Ваш e-mail" />
            <button type="submit">Подписаться</button>
            <label>
              <input type="checkbox" defaultChecked />
              <span>Я согласен с Политикой конфиденциальности и даю согласие на обработку персональных данных</span>
            </label>
            <label>
              <input type="checkbox" />
              <span>Я согласен получать рассылку от Кайтен (обновления продукта и полезные материалы)</span>
            </label>
          </form>
        </div>

        <div className="kaiten-footer__info">
          <section>
            <h3>Официальный статус российского ИТ-разработчика</h3>
            <p>Кайтен внесен в реестр отечественного ПО №14347, а компания аккредитована как IT-организация</p>
            <a href="#">Подробнее</a>
          </section>

          <section>
            <h3>Общество с ограниченной ответственностью «Кайтен Софтвер»</h3>
            <dl>
              <div>
                <dt>ИНН</dt>
                <dd>7714426252</dd>
              </div>
              <div>
                <dt>КПП</dt>
                <dd>771401001</dd>
              </div>
              <div>
                <dt>Юридический адрес</dt>
                <dd>125252, г. Москва, проезд Берёзовой рощи, дом 12, этаж 2, комната 55</dd>
              </div>
            </dl>
          </section>
        </div>

        <div className="kaiten-footer__bottom">
          <div className="kaiten-footer__brand">
            <KaitenLogo />
            <strong>Кайтен</strong>
          </div>
          <a href="tel:+74994906499">+7 (499) 490-64-99</a>
          <a href="mailto:sales@kaiten.ru">sales@kaiten.ru</a>
          <div className="kaiten-footer__sk">Участник <span>Sk</span> Сколково</div>
          <div className="kaiten-footer__media">
            <a href="#">VK</a>
            <a href="#">R</a>
            <a href="#">habr</a>
          </div>
        </div>

        <nav className="kaiten-footer__legal" aria-label="Юридические ссылки">
          <a href="#">Политика конфиденциальности</a>
          <a href="#">Лицензионный договор</a>
          <a href="#">Пользовательское соглашение</a>
          <a href="#">Оплата банковскими картами</a>
          <a href="#">Техническая поддержка</a>
        </nav>
      </div>
    </footer>
  );
}
```

## CSS

```css
.kaiten-footer {
  background: #282828;
  color: #ffffff;
  font-family: Inter, system-ui, sans-serif;
}

.kaiten-footer__inner {
  width: min(100% - 48px, 1216px);
  margin: 0 auto;
  padding: 64px 0 32px;
}

.kaiten-footer__top {
  display: grid;
  grid-template-columns: 176px 144px 208px 1fr 300px;
  gap: 32px;
  align-items: start;
}

.kaiten-footer h3,
.kaiten-footer h4 {
  margin: 0;
  color: #ffffff;
  font-size: 16px;
  line-height: 1.3;
  font-weight: 700;
}

.kaiten-footer a,
.kaiten-footer p,
.kaiten-footer dd {
  color: #b7bcc4;
  font-size: 14px;
  line-height: 1.45;
  text-decoration: none;
}

.kaiten-footer__column ul,
.kaiten-footer__comparison ul {
  display: grid;
  gap: 12px;
  margin: 16px 0 0;
  padding: 0;
  list-style: none;
}

.kaiten-footer__comparison {
  grid-column: 1 / 4;
  margin-top: 48px;
}

.kaiten-footer__comparison ul {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 20px;
}

.kaiten-footer__cards {
  display: grid;
  gap: 32px;
}

.kaiten-footer__card {
  border-radius: 14px;
  background: #3f3f3f;
  padding: 22px 20px;
}

.kaiten-footer__socials,
.kaiten-footer__article,
.kaiten-footer__bottom {
  display: flex;
  align-items: center;
  gap: 16px;
}

.kaiten-footer__icon {
  display: inline-grid;
  width: 32px;
  height: 32px;
  place-items: center;
  border-radius: 8px;
  background: #824bd8;
  color: #ffffff;
}

.kaiten-footer__newsletter {
  border-radius: 14px;
  background: linear-gradient(135deg, #f0dcff 0%, #d7e1ff 100%);
  color: #241f2c;
  padding: 22px 20px;
}

.kaiten-footer__newsletter h3 {
  color: #824bd8;
}

.kaiten-footer__newsletter p,
.kaiten-footer__newsletter label {
  color: #241f2c;
}

.kaiten-footer__newsletter input[type='email'] {
  width: 100%;
  height: 46px;
  margin: 16px 0 14px;
  border: 0;
  border-radius: 7px;
  padding: 0 16px;
  background: #ffffff;
  color: #282828;
}

.kaiten-footer__newsletter button {
  width: 100%;
  height: 44px;
  border: 0;
  border-radius: 7px;
  background: #824bd8;
  color: #ffffff;
  font-weight: 700;
}

.kaiten-footer__newsletter label {
  display: grid;
  grid-template-columns: 16px 1fr;
  gap: 10px;
  margin-top: 14px;
  font-size: 12px;
  line-height: 1.25;
}

.kaiten-footer__info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  margin-top: 36px;
  padding: 34px 0 42px;
  border-top: 1px solid #505050;
  border-bottom: 1px solid #505050;
}

.kaiten-footer__info dl {
  display: grid;
  grid-template-columns: 88px 88px 1fr;
  gap: 28px;
  margin: 22px 0 0;
}

.kaiten-footer__info dt {
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
}

.kaiten-footer__info dd {
  margin: 10px 0 0;
}

.kaiten-footer__bottom {
  min-height: 64px;
  padding-top: 32px;
  font-size: 16px;
  font-weight: 700;
}

.kaiten-footer__brand {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-right: 28px;
  font-size: 28px;
}

.kaiten-footer__sk {
  margin-left: auto;
}

.kaiten-footer__legal {
  display: flex;
  flex-wrap: wrap;
  gap: 24px 72px;
  padding-top: 22px;
}

@media (max-width: 1023px) {
  .kaiten-footer__inner {
    width: min(100% - 48px, 720px);
  }

  .kaiten-footer__top {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 34px 32px;
  }

  .kaiten-footer__comparison {
    grid-column: auto;
    margin-top: 0;
  }

  .kaiten-footer__cards {
    grid-column: 1 / 3;
  }

  .kaiten-footer__newsletter {
    grid-column: 3 / 5;
  }

  .kaiten-footer__info {
    grid-template-columns: 1fr;
    gap: 52px;
  }

  .kaiten-footer__bottom {
    flex-wrap: wrap;
    gap: 20px 36px;
  }

  .kaiten-footer__sk {
    margin-left: 0;
  }
}

@media (max-width: 479px) {
  .kaiten-footer__inner {
    width: calc(100% - 28px);
    padding: 46px 0 28px;
  }

  .kaiten-footer__top {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 28px 22px;
  }

  .kaiten-footer__comparison {
    grid-column: 1 / 2;
  }

  .kaiten-footer__cards,
  .kaiten-footer__newsletter {
    grid-column: 1 / -1;
  }

  .kaiten-footer__card,
  .kaiten-footer__newsletter {
    border-radius: 12px;
    padding: 20px 14px;
  }

  .kaiten-footer__info {
    margin-top: 22px;
    padding: 28px 0 32px;
    gap: 34px;
  }

  .kaiten-footer__info dl {
    grid-template-columns: 1fr 1fr;
    gap: 18px 20px;
  }

  .kaiten-footer__info dl div:last-child {
    grid-column: 1 / -1;
  }

  .kaiten-footer__bottom {
    display: grid;
    gap: 18px;
  }

  .kaiten-footer__brand {
    order: 2;
    margin-right: 0;
  }

  .kaiten-footer__legal {
    display: grid;
    gap: 16px;
  }
}
```

## Адаптация

- **Desktop 1280+**: контейнер `1216px`, верхняя сетка `176 / 144 / 208 / fluid / 300`, карточки соцсетей и статей стоят в одной вертикальной колонке, newsletter справа.
- **Tablet 768-1023**: верхняя часть становится `4` равными колонками, карточки занимают левую половину, newsletter правую. Юридические блоки идут один под другим, нижняя строка переносится.
- **Mobile 360-479**: верхняя навигация идет в две колонки. `Компания` и `Ресурсы` стоят первой строкой, `Сравнили...` и `Возможности` второй строкой. Карточки, подписка, юридический блок и контакты идут в один столбец.
- Минимальный горизонтальный отступ: `14px` на mobile, `24px` на tablet/desktop.
- Карточки имеют радиус `12-14px`, фон `#3f3f3f`; newsletter использует светлый лавандовый градиент и фиолетовую кнопку `#824bd8`.

## Контент-правила

- Footer не повторяет primary navigation из header дословно. Сюда попадают вторичные ссылки, юридические данные и способы связи.
- Блок сравнения остается компактным списком ссылок. Если ссылок больше 20, переносите часть в отдельную sitemap-страницу.
- Newsletter всегда содержит оба согласия; первое согласие по умолчанию отмечено, второе нет.
- Юридический блок обязателен для российских B2B-лендингов Kaiten.
- Телефон и email должны быть кликабельными `tel:` и `mailto:`.

## Anti-patterns

- Не делать footer светлым на лендингах Kaiten DS V01: темный фон нужен как визуальное закрытие страницы.
- Не растягивать карточку newsletter на всю ширину desktop.
- Не ставить нижние юридические ссылки выше контактов.
- Не прятать ИНН, КПП и юридический адрес в accordion на mobile.
- Не использовать больше двух рядов карточек в верхней части footer.
