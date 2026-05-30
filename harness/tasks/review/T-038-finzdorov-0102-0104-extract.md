# T-038 — Finzdorov Module 01 source extraction

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-05-30
Branch/worktree: main

## Goal

Extract lessons 01.01, 01.02, 01.03, and 01.04 from the authenticated Finzdorov/GetCourse pages and preserve only educational source material as structured Markdown with all non-video assets stored locally.

## Context

Files/docs read before starting:
- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/CONTENT_MODEL.md`
- `harness/PARALLEL_AGENT_PROTOCOL.md`
- `docs/engineering/contributing.md`

## Intended write set

- `docs/methodology/finzdorov_module_01/**`
- `harness/tasks/review/T-038-finzdorov-0102-0104-extract.md`

## Out-of-scope

- Runtime JSON conversion.
- UI/backend/content model changes.
- Editing active task files for T-036 or T-037.
- Including admin navigation, feedback forms, comments, learner answers, or private user data.

## Plan

1. Use the existing authenticated Yandex Browser session to fetch lesson HTML.
2. Convert the lesson body builders into structured Markdown.
3. Remove non-educational page chrome, admin controls, feedback forms, comments, and learner answers.
4. Download all non-video assets into `docs/methodology/finzdorov_module_01/materials/`.
5. Replace external PDF/DOCX/XLSX/image/page links with local relative paths.
6. Save one Markdown file per lesson and verify the files contain the requested texts, local files, images, and video embeds/timecodes.

## Checks

- [x] Manual content pass over generated Markdown.
- [x] `./scripts/verify.sh`
- [x] `npm run check:content` via `./scripts/verify.sh`
- [x] Local material link resolution check.
- [x] Markdown external URL check: only Rutube video URLs remain.
- [x] Downloaded asset type check with `file`.

## Result packet

- Files changed:
  - `docs/methodology/finzdorov_module_01/README.md`
  - `docs/methodology/finzdorov_module_01/0101-vashi-bazovye-tsennosti.md`
  - `docs/methodology/finzdorov_module_01/0102-videnie-budushchego.md`
  - `docs/methodology/finzdorov_module_01/0103-finansovye-tseli.md`
  - `docs/methodology/finzdorov_module_01/0104-motivatsiya-dostizheniya-tseley.md`
  - `docs/methodology/finzdorov_module_01/materials/**`
  - `harness/tasks/review/T-038-finzdorov-0102-0104-extract.md`
- Checks run:
  - `rg -n "[ \t]+$" docs/methodology/finzdorov_module_01 harness/tasks/review/T-038-finzdorov-0102-0104-extract.md`
  - `rg -n "Мы хотим|Поставить оценку|Комментарии|Модерация|Любимый Клиент|teststst|загрузить аватарку|скачать все ответы|Показать все поля|куратору|преподавателю|Список тренингов|Настройки|Действия|user/control|answers/review|showAnswer" docs/methodology/finzdorov_module_01`
  - `rg -n "https?://" docs/methodology/finzdorov_module_01 --glob "*.md"`
  - local relative material-link resolution script
  - `file docs/methodology/finzdorov_module_01/materials/*`
  - `./scripts/verify.sh`
- Risks:
  - The two external psychological tests from lesson 01.01 are stored as local HTML snapshots. Their internal HTML may still contain upstream page references, but the lesson Markdown links to local files only.
- Follow-up:
  - Convert selected educational source material into FinPulse runtime JSON in a separate task if needed.
