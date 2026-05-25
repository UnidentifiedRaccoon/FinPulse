#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const [, , id, ...titleParts] = process.argv;
const title = titleParts.join(' ').trim();

if (!id || !title) {
  console.error('Usage: node scripts/create-agent-task.mjs T-008 "Short task title"');
  process.exit(1);
}

if (!/^T-\d{3,}$/.test(id)) {
  console.error('Task id must look like T-008');
  process.exit(1);
}

const slug = title
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '')
  .slice(0, 60) || 'task';

const dir = path.join(process.cwd(), 'harness/tasks/inbox');
fs.mkdirSync(dir, { recursive: true });

const file = path.join(dir, `${id}-${slug}.md`);
if (fs.existsSync(file)) {
  console.error(`Task already exists: ${file}`);
  process.exit(1);
}

const content = `# ${id} — ${title}

Status: planned
Owner:
Model: GPT-5.5 / xhigh
Started:
Branch/worktree:

## Goal


## Context

- AGENTS.md
- harness/PROJECT_STATE.md

## Intended write set

-

## Out-of-scope

-

## Plan

1.
2.
3.

## Checks

- [ ] ./scripts/verify.sh

## Result packet

- Files changed:
- Checks run:
- Risks:
- Follow-up:
`;

fs.writeFileSync(file, content, 'utf8');
console.log(`Created ${path.relative(process.cwd(), file)}`);
