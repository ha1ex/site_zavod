---
name: kaiten-intake
description: Фабрика ТЗ Контент-завода Кайтен. Превращает сырые данные команды (свободный запрос + папка материалов + веб-ресёрч) в человекочитаемое ТЗ (по методологии Content Factory §18) и согласованный машинный brief.json, который уходит в пайплайн P0..P8. Используй, когда команда приходит с задачей «нужен лендинг для …» и сырыми материалами, но готового brief.json ещё нет; или когда упоминают intake, фабрику ТЗ, `agent intake`.
---

# Kaiten Intake — фабрика ТЗ

Верхний этап пайплайна: **сырьё → ТЗ + brief → пайплайн**. Ты (host LLM, без API-ключей) исполняешь роль контент-завода: исследуешь, пишешь ТЗ по методологии Kaiten Content Factory и выводишь из него машинный Brief.

## Когда использовать
- Команда дала задачу и материалы (транскрипт, список возможностей, тексты, ссылки на конкурентов), но `content/briefs/<slug>.json` ещё нет.
- Нужно подготовить ТЗ для ревью командой до запуска генерации лендинга.

## Поток

```
agent intake → (host пишет intake.json) → agent intake-apply → review ТЗ.md → agent build → ...
```

### 1. Prepare — собрать промпт
```bash
pnpm -w run harness agent intake landing --slug <slug> \
  --request inputs/<slug>/request.md \
  --inputs inputs/<slug>
```
Нужен хотя бы один из `--request` (файл со свободным запросом: тема, аудитория, пожелания) или `--inputs` (папка материалов; текстовые файлы инлайнятся в промпт). Команда пишет `.context/intake/<slug>/intake.prompt.md` (system = брендовый канон Kaiten + методология §18; user = запрос + материалы) и JSON-schema на `{ tz, brief }`.

### 2. Сгенерировать ТЗ + Brief (ты — host LLM)
Прочитай `intake.prompt.md`. Проведи веб-ресёрч по Kaiten (kaiten.ru, faq-ru.kaiten.site, /blog/tag/case/, /teams/*). Соблюдай:
- редполитику и §10 (без англицизмов; канбан/скрам кириллицей; имена сервисов не переводим);
- §8 (боли через управляемое улучшение), §9 (без лозунгов; возможность→сценарий→польза);
- §12/§13 структуру, §17 SEO, §18 формат выдачи.

Запиши ОДИН JSON-объект `{ "tz": <IntakeTz>, "brief": <Brief> }` в `.context/intake/<slug>/intake.json`. Brief обязан быть **согласован с ТЗ** и пройти brief-quality (домен резолвится, поля содержательны, без лозунгов). Неподтверждённые факты — в `tz.needs_confirmation`.

### 3. Apply — валидировать и опубликовать
```bash
pnpm -w run harness agent intake-apply landing --slug <slug>
```
Валидирует ТЗ+бриф и прогоняет **brief-quality как жёсткий гейт**. При успехе публикует `content/briefs/<slug>.json` и рендерит `content/briefs/<slug>.tz.md` (для ревью командой). При ошибках пишет `.context/intake/<slug>/intake.repair.md` — поправь `intake.json` и повтори (repair-loop).

### 4. Ревью и передача в пайплайн
Покажи команде `content/briefs/<slug>.tz.md`. После согласования — обычный пайплайн:
```bash
pnpm -w run harness agent build landing --slug <slug> --brief content/briefs/<slug>.json
```
Дальше — навык `kaiten-generate` (P0..P8 → LandingSpec → TSX) и `kaiten-review` (валидаторы + визуальный ревью).

## Важно
- ТЗ.md выводится детерминированно из того же JSON, что и бриф → они всегда согласованы. Правки вносить в `intake.json` (источник) и повторять apply, не редактируя `.tz.md` вручную.
- Лендинг «готов» только после Playwright-скриншота и сверки с design-system (не HTTP 200).
