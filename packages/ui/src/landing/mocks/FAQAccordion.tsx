import { useEffect, useRef, type ReactNode } from 'react';

/**
 * FAQ Accordion (мокап секции «Часто задаваемые вопросы»).
 *
 * Шаблон для наполнения: сохранены СТИЛИ, СТРУКТУРА и ПОВЕДЕНИЕ секции FAQ
 * лендинга, а тексты вопросов/ответов вынесены в пропсы. Передай `items` —
 * и аккордеон наполнится.
 *
 * Поведение (порт с лендинга):
 *  - нативные <details>/<summary> (доступность, работает без JS);
 *  - плавное раскрытие по реальной высоте контента через `::details-content`
 *    + `interpolate-size:allow-keywords` (Chrome 129+; иначе мгновенно, без рывка);
 *  - открыт только ОДИН пункт за раз (эксклюзив — при открытии закрываем прочие);
 *  - иконка +/− (минус в открытом состоянии), hover — вопрос и иконка фиолетовые;
 *  - `aria-expanded` синхронизируется с состоянием.
 *
 * Адаптив: ≤767px — меньше паддинги, вопрос `fs-md`, ответ `fs-sm`, заголовок
 * влево и мельче, container gap 24.
 * Self-contained: scoped `<style>` под `.faq-mock`, палитра V01.
 */

export interface FaqItem {
  /** Текст вопроса. */
  question: string;
  /** Ответ: строка или ReactNode (можно со ссылками <a>). */
  answer: ReactNode;
}

export interface FAQAccordionProps {
  /** Заголовок секции. */
  title?: string;
  /** Пары вопрос/ответ. Если не передать — покажутся нейтральные плейсхолдеры. */
  items?: FaqItem[];
  /** Индекс изначально открытого пункта (по умолчанию 0). null — все закрыты. */
  defaultOpen?: number | null;
}

const STYLE = `
.faq-mock{
  --sp-3:12px; --sp-4:16px; --sp-6:24px; --sp-12:48px;
  --fw-reg:400; --fw-semi:600; --ls:0;
  --brand-100:#7d4ccf;
  --border-default:#dbe1e0; --border-hover:#e5e7eb;
  --text-title:#2d2d2d; --text-secondary:#757575; --icon:#757575; --surface-section:#f7f7f8;
  font-family:'Inter',system-ui,-apple-system,sans-serif; color:var(--text-title);
  background:var(--surface-section); width:100%; padding:48px var(--sp-4);
}
.faq-mock *{box-sizing:border-box;}
.faq-mock .faq-section__container{display:flex; flex-direction:column; align-items:center; width:100%; gap:var(--sp-12); max-width:1216px; margin:0 auto;}
.faq-mock .faq-section__title{font-weight:var(--fw-semi); color:var(--text-title); text-align:center; width:100%; font-size:36px; line-height:40px; letter-spacing:0; margin:0;}
.faq-mock .faq-list{display:flex; flex-direction:column; align-items:center; gap:var(--sp-4); width:100%; list-style:none; margin:0; padding:0;}
.faq-mock .faq-list li{width:100%; list-style:none;}
.faq-mock .faq-item{background:#fff; border-radius:12px; width:100%; border:1px solid transparent; display:flex; flex-direction:column; cursor:pointer; text-align:left; transition:border-color .2s ease; interpolate-size:allow-keywords;}
.faq-mock .faq-item::details-content{block-size:0; overflow:hidden; opacity:0; transition:block-size .24s cubic-bezier(.2,0,.2,1), opacity .2s ease, content-visibility .24s allow-discrete;}
.faq-mock .faq-item[open]::details-content{block-size:auto; opacity:1;}
.faq-mock .faq-item:hover{border-color:var(--border-hover);}
.faq-mock .faq-item[open]{border-color:var(--brand-100);}
.faq-mock .faq-item>summary{padding:var(--sp-6); list-style:none;}
.faq-mock .faq-item>summary::-webkit-details-marker{display:none;}
.faq-mock .faq-item[open]>summary{padding:var(--sp-6) var(--sp-6) var(--sp-4);}
.faq-mock .faq-item__question{display:flex; align-items:flex-start; justify-content:space-between; width:100%; gap:var(--sp-4); list-style:none;}
.faq-mock .faq-item__q-text{font-weight:var(--fw-reg); color:var(--text-title); flex:1 0 0; min-width:0; letter-spacing:var(--ls); word-break:break-word; transition:color .18s ease; font-size:20px; line-height:28px;}
.faq-mock .faq-item:hover .faq-item__q-text{color:var(--brand-100);}
.faq-mock .faq-item:hover .faq-item__icon{color:var(--brand-100);}
.faq-mock .faq-item[open] .faq-item__q-text{font-weight:var(--fw-semi); color:var(--brand-100);}
.faq-mock .faq-item__icon{position:relative; flex-shrink:0; width:24px; height:24px; color:var(--icon);}
.faq-mock .faq-item[open] .faq-item__icon{color:var(--brand-100);}
.faq-mock .faq-item__icon::before{content:""; position:absolute; left:5px; right:5px; top:11px; height:2px; background:currentColor; border-radius:2px;}
.faq-mock .faq-item__icon::after{content:""; position:absolute; top:5px; bottom:5px; left:11px; width:2px; background:currentColor; border-radius:2px; transition:opacity .2s;}
.faq-mock .faq-item[open] .faq-item__icon::after{opacity:0;}
.faq-mock .faq-item__answer{font-weight:var(--fw-reg); color:var(--text-secondary); letter-spacing:var(--ls); word-break:break-word; width:100%; max-width:900px; padding:0 var(--sp-6) var(--sp-6); margin:0; font-size:16px; line-height:24px;}
.faq-mock .faq-item__answer a{color:var(--brand-100); text-decoration:underline;}
@media(max-width:767px){
  .faq-mock{padding:48px var(--sp-4);}
  .faq-mock .faq-section__container{gap:var(--sp-6);}
  .faq-mock .faq-section__title{font-size:24px; line-height:32px; text-align:left;}
  .faq-mock .faq-item>summary{padding:var(--sp-4);}
  .faq-mock .faq-item[open]>summary{padding:var(--sp-4) var(--sp-4) var(--sp-3);}
  .faq-mock .faq-item__q-text{font-size:16px; line-height:24px;}
  .faq-mock .faq-item__answer{padding:0 var(--sp-4) var(--sp-4); font-size:14px; line-height:20px;}
}
`;

/** Нейтральные плейсхолдеры — заменяются реальными парами через проп `items`. */
const PLACEHOLDER_ITEMS: FaqItem[] = [
  {
    question: 'Текст вопроса — короткая формулировка?',
    answer: 'Текст ответа: 1–3 предложения с сутью. Здесь будет реальный ответ при наполнении шаблона. Можно вставлять ссылку.',
  },
  {
    question: 'Второй вопрос пользователя?',
    answer: (
      <>
        Ответ со ссылкой: <a href="#">пример ссылки</a> внутри текста. Остальное — обычный текст ответа.
      </>
    ),
  },
  { question: 'Третий частый вопрос?', answer: 'Короткий ответ на третий вопрос.' },
  { question: 'Четвёртый вопрос — про возможности?', answer: 'Короткий ответ на четвёртый вопрос.' },
];

export function FAQAccordion({ title = 'Заголовок FAQ-секции', items, defaultOpen = 0 }: FAQAccordionProps) {
  const data = items && items.length ? items : PLACEHOLDER_ITEMS;
  const refs = useRef<Array<HTMLDetailsElement | null>>([]);

  // изначально открытый пункт (uncontrolled <details>, задаём через DOM)
  useEffect(() => {
    refs.current.forEach((d, i) => {
      if (!d) return;
      const isOpen = defaultOpen != null && i === defaultOpen;
      d.open = isOpen;
      d.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }, [defaultOpen, data.length]);

  const handleToggle = (i: number) => (e: React.SyntheticEvent<HTMLDetailsElement>) => {
    const el = e.currentTarget;
    // эксклюзив: при открытии закрываем остальные
    if (el.open) {
      refs.current.forEach((d, j) => {
        if (d && j !== i && d.open) {
          d.open = false;
          d.setAttribute('aria-expanded', 'false');
        }
      });
    }
    el.setAttribute('aria-expanded', el.open ? 'true' : 'false');
  };

  return (
    <section className="faq-mock" aria-label="Часто задаваемые вопросы">
      <style dangerouslySetInnerHTML={{ __html: STYLE }} />
      <div className="faq-section__container">
        <h2 className="faq-section__title">{title}</h2>
        <ul className="faq-list">
          {data.map((item, i) => (
            <li key={i}>
              <details
                className="faq-item"
                ref={(el) => { refs.current[i] = el; }}
                onToggle={handleToggle(i)}
              >
                <summary>
                  <span className="faq-item__question">
                    <span className="faq-item__q-text">{item.question}</span>
                    <span className="faq-item__icon" aria-hidden="true" />
                  </span>
                </summary>
                <p className="faq-item__answer">{item.answer}</p>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default FAQAccordion;
