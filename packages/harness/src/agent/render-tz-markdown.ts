import type { IntakeTz } from '../schemas/intake-tz';
import type { Brief } from '../schemas/brief';

/**
 * Рендерит ТЗ (IntakeTz) в человекочитаемый Markdown для ревью командой.
 * ТЗ.md выводится ДЕТЕРМИНИРОВАННО из того же JSON, из которого валидируется brief —
 * поэтому опубликованное ТЗ всегда соответствует брифу (faithful-by-construction).
 */
export function renderTzMarkdown(tz: IntakeTz, slug: string, brief: Brief): string {
  const L: string[] = [];
  const h = (s: string) => L.push(`## ${s}`, '');
  const list = (items: string[]) => {
    if (!items.length) {
      L.push('_(нет)_', '');
      return;
    }
    for (const i of items) L.push(`- ${i}`);
    L.push('');
  };

  L.push(`# ТЗ на лендинг — ${slug}`, '');
  L.push('> Сгенерировано фабрикой ТЗ (Контент-завод Кайтен) из сырых данных. Документ для ревью командой; машинный бриф — `content/briefs/' + slug + '.json`.', '');

  h('Summary');
  L.push(tz.summary, '');

  h('Аудитория');
  L.push(`- **Основная:** ${tz.audience_research.primary}`);
  if (tz.audience_research.decisionMaker) L.push(`- **Принимает решение:** ${tz.audience_research.decisionMaker}`);
  if (tz.audience_research.roles.length) L.push(`- **Роли:** ${tz.audience_research.roles.join(', ')}`);
  L.push('');
  L.push('**Боли:**');
  list(tz.audience_research.pains);
  L.push('**Критерии выбора:**');
  list(tz.audience_research.selectionCriteria);
  L.push('**Возражения:**');
  list(tz.audience_research.objections);

  h('Конкуренты (анализ, без копирования)');
  if (tz.competitor_research.length) {
    for (const c of tz.competitor_research) L.push(`- **${c.name}** — ${c.takeaways}`);
  } else L.push('_(не анализировались)_');
  L.push('');

  h('Source map');
  if (tz.source_map.length) {
    for (const s of tz.source_map) L.push(`- [${s.kind}] \`${s.ref}\` — ${s.used_for}`);
  } else L.push('_(нет)_');
  L.push('');

  h('Кейсы');
  if (tz.cases.length) {
    for (const c of tz.cases) L.push(`- **${c.company}** — ${c.result}${c.href ? ` ([кейс](${c.href}))` : ''}`);
  } else L.push('_(точных кейсов нет — используется альтернативный блок доверия)_');
  L.push('');

  h('SEO');
  L.push(`- **Интент:** ${tz.seo.intent}`);
  L.push(`- **Title:** ${tz.seo.title}`);
  L.push(`- **Description:** ${tz.seo.description}`);
  L.push(`- **URL:** ${tz.seo.url}`);
  if (tz.seo.keywords.length) L.push(`- **Ключи:** ${tz.seo.keywords.join(', ')}`);
  L.push('');

  h('Структура лендинга');
  tz.landing_structure.forEach((b, i) => {
    L.push(`${i + 1}. **${b.block}** — ${b.purpose}${b.mockHint ? ` _(визуал: ${b.mockHint})_` : ''}`);
  });
  L.push('');

  if (tz.landing_copy.length) {
    h('Тексты блоков');
    for (const c of tz.landing_copy) {
      L.push(`### ${c.block}`);
      if (c.heading) L.push(`**${c.heading}**`, '');
      L.push(c.body, '');
    }
  }

  if (tz.visual_assets.length) {
    h('Визуалы');
    for (const v of tz.visual_assets) L.push(`- **${v.block}** — ${v.description}`);
    L.push('');
  }

  if (tz.templates.length) {
    h('Шаблоны');
    for (const t of tz.templates) L.push(`- ${t.name}${t.href ? ` — ${t.href}` : ''}`);
    L.push('');
  }

  h('⚠️ Needs confirmation');
  list(tz.needs_confirmation);

  h('QA-чеклист');
  list(tz.qa_checklist);

  h('Производный Brief (для пайплайна)');
  L.push('```json');
  L.push(JSON.stringify(brief, null, 2));
  L.push('```');

  return L.join('\n') + '\n';
}
