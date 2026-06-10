# content/briefs/ — IMMUTABLE

Файлы здесь — исходники-брифы. Их НЕЛЬЗЯ редактировать, переименовывать и удалять: на них ссылаются LandingSpec, approvals и diversity-audit.

- Новая итерация брифа = **новый файл** `<slug>-v2.json` (создание новых файлов разрешено).
- Поменять копию/SEO лендинга → правь `content/landings/<slug>.json`, а не бриф.
- Правка существующего брифа блокируется на трёх слоях: git pre-commit (`.githooks/`), harness CLI (`agent build/apply/run/intake-apply`), Claude-hook (`scripts/hooks/pre-brief-immutable.sh`).
- Осознанный обход — только по согласованию с пользователем: `HARNESS_SKIP_GATES=1`.
