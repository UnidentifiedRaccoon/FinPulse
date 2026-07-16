#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { discoverTasks } from './check-harness.mjs';

export function nextTaskId(tasks) {
  const max = tasks.reduce((current, task) => {
    const value = Number.parseInt(task.id?.slice(2) ?? '', 10);
    return Number.isFinite(value) ? Math.max(current, value) : current;
  }, 0);
  return `T-${String(max + 1).padStart(3, '0')}`;
}

export function slugify(title) {
  return title
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60) || 'task';
}

export function renderTask(id, title) {
  return `# ${id} — ${title}

Status: planned
Owner:
Model: GPT-5.5 / xhigh
Started:
Branch/worktree:

## Goal

Deliver “${title}” as one bounded, checkable outcome.

## Context

- \`AGENTS.md\`
- \`harness/PROJECT_STATE.md\`
- Add only task-routed canonical sources before claiming.

## Intended write set

- Define before moving the task to active.

## Out-of-scope

- Define before moving the task to active.

## Plan

1. Refine before moving the task to active.

## Checks

- [ ] Define focused checks and the required verification tier before claiming.

## Result packet

- Files changed:
- Checks run (pass/fail/blocked/skipped):
- Risks:
- Follow-up:
`;
}

export function parseCreateArgs(argv, tasks) {
  const args = [...argv];
  const dryRunIndex = args.indexOf('--dry-run');
  const dryRun = dryRunIndex !== -1;
  if (dryRun) args.splice(dryRunIndex, 1);

  let id;
  if (/^T-\d{3,}$/.test(args[0] ?? '')) id = args.shift();
  else id = nextTaskId(tasks);

  const title = args.join(' ').trim();
  if (!title) {
    throw new Error('Usage: npm run task:new -- [T-XXX] "Short task title" [--dry-run]');
  }
  if (tasks.some((task) => task.id === id)) {
    throw new Error(`Task ID already exists in harness: ${id}`);
  }
  return { id, title, dryRun };
}

function wait(milliseconds) {
  const signal = new Int32Array(new SharedArrayBuffer(4));
  Atomics.wait(signal, 0, 0, milliseconds);
}

export function acquireTaskCreationLock(root, options = {}) {
  const timeoutMs = options.timeoutMs ?? 5_000;
  const staleMs = options.staleMs ?? 30_000;
  const tasksDir = path.join(root, 'harness', 'tasks');
  const lockPath = path.join(tasksDir, '.create-task.lock');
  const token = `${process.pid}-${randomUUID()}`;
  const startedAt = Date.now();
  fs.mkdirSync(tasksDir, { recursive: true });

  while (true) {
    try {
      fs.writeFileSync(lockPath, token, { encoding: 'utf8', flag: 'wx' });
      return () => {
        try {
          if (fs.readFileSync(lockPath, 'utf8') === token) fs.unlinkSync(lockPath);
        } catch (error) {
          if (error.code !== 'ENOENT') throw error;
        }
      };
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
      try {
        const age = Date.now() - fs.statSync(lockPath).mtimeMs;
        if (age > staleMs) {
          fs.unlinkSync(lockPath);
          continue;
        }
      } catch (lockError) {
        if (lockError.code !== 'ENOENT') throw lockError;
        continue;
      }
      if (Date.now() - startedAt >= timeoutMs) {
        throw new Error(`Timed out waiting for task creation lock: ${lockPath}`);
      }
      wait(20);
    }
  }
}

function runCli() {
  const root = process.cwd();
  const argv = process.argv.slice(2);
  const dryRun = argv.includes('--dry-run');
  let releaseLock;
  try {
    if (!dryRun) releaseLock = acquireTaskCreationLock(root);
    const tasks = discoverTasks(root);
    const parsed = parseCreateArgs(argv, tasks);
    const dir = path.join(root, 'harness', 'tasks', 'inbox');
    const file = path.join(dir, `${parsed.id}-${slugify(parsed.title)}.md`);
    const content = renderTask(parsed.id, parsed.title);

    if (parsed.dryRun) {
      console.log(`[task] dry-run ${path.relative(root, file)}`);
      console.log(content);
      return;
    }

    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(file, content, { encoding: 'utf8', flag: 'wx' });
    console.log(`[task] created ${path.relative(root, file)}`);
    console.log('[task] refine scope, then claim with: npm run task:move -- ' + parsed.id + ' active');
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  } finally {
    releaseLock?.();
  }
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) runCli();
