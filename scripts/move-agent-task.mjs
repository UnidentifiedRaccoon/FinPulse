#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { discoverTasks, missingResultFields, parseTask } from './check-harness.mjs';

const TARGETS = {
  planned: { lane: 'inbox', status: 'planned' },
  active: { lane: 'active', status: 'active' },
  blocked: { lane: 'active', status: 'blocked' },
  review: { lane: 'review', status: 'review' },
  done: { lane: 'done', status: 'done' },
};

const ALLOWED_TRANSITIONS = {
  planned: new Set(['planned', 'active', 'blocked']),
  active: new Set(['planned', 'active', 'blocked', 'review']),
  blocked: new Set(['planned', 'active', 'blocked', 'review']),
  review: new Set(['active', 'blocked', 'review', 'done']),
  done: new Set(['active', 'done']),
};

const SOURCE_LANE_STATUS = {
  inbox: new Set(['planned']),
  active: new Set(['active', 'blocked']),
  review: new Set(['review']),
  done: new Set(['done']),
};

export function updateStatus(content, status) {
  if (!/^Status:\s*.*$/m.test(content)) throw new Error('Task has no canonical Status field');
  return content.replace(/^Status:\s*.*$/m, `Status: ${status}`);
}

export function assertClaimReady(filePath, content) {
  const task = parseTask(filePath, 'active', content);
  const missing = [];
  if (!task.owner || /^<.*>$/.test(task.owner)) missing.push('Owner');
  if (task.model !== 'GPT-5.5 / xhigh') missing.push('Model');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(task.started ?? '')) missing.push('Started (YYYY-MM-DD)');
  if (!task.branch || /^<.*>$/.test(task.branch)) missing.push('Branch/worktree');
  if (!task.goal) missing.push('Goal');
  if (task.writeSet.length === 0 || task.writeSet.some((item) => /define before/i.test(item))) {
    missing.push('Intended write set');
  }
  if (!task.outOfScope || /define before/i.test(task.outOfScope)) missing.push('Out-of-scope');
  if (!task.plan || /refine before/i.test(task.plan)) missing.push('Plan');
  if (!task.checks || /define focused/i.test(task.checks)) missing.push('Checks');
  if (!task.resultPacket) missing.push('Result packet');
  if (missing.length > 0) throw new Error(`Task is not ready to claim: ${missing.join(', ')}`);
}

export function assertResultReady(filePath, content) {
  const task = parseTask(filePath, 'review', content);
  const missing = missingResultFields(task.resultPacket);
  if (missing.length > 0) {
    throw new Error(`Task result packet is incomplete: ${missing.join(', ')}`);
  }
}

export function transitionSpec(id, target, tasks) {
  if (!/^T-\d{3,}$/.test(id ?? '')) throw new Error('Task ID must look like T-185');
  const destination = TARGETS[target];
  if (!destination) {
    throw new Error('Target must be one of: planned, active, blocked, review, done');
  }
  const matches = tasks.filter((task) => task.id === id);
  if (matches.length === 0) throw new Error(`Task not found: ${id}`);
  if (matches.length > 1) throw new Error(`Task ID is ambiguous (${matches.length} files): ${id}`);
  const currentStatus = matches[0].status;
  if (!currentStatus || !SOURCE_LANE_STATUS[matches[0].lane]?.has(currentStatus)) {
    throw new Error(
      `Source task lane/status mismatch: ${matches[0].lane}/${currentStatus ?? 'missing'}`,
    );
  }
  if (!currentStatus || !ALLOWED_TRANSITIONS[currentStatus]?.has(destination.status)) {
    throw new Error(`Invalid task transition: ${currentStatus ?? 'missing'} -> ${destination.status}`);
  }
  return { task: matches[0], ...destination };
}

export function writeTransition(root, spec, dryRun, log = console.log) {
  const source = spec.task.filePath;
  const targetDir = path.join(root, 'harness', 'tasks', spec.lane);
  const target = path.join(targetDir, path.basename(source));
  const original = fs.readFileSync(source, 'utf8');
  const updated = updateStatus(original, spec.status);

  if (spec.status !== 'planned') assertClaimReady(source, updated);
  if (spec.status === 'review' || spec.status === 'done') assertResultReady(source, updated);
  if (source !== target && fs.existsSync(target)) {
    throw new Error(`Target already exists: ${path.relative(root, target)}`);
  }

  if (dryRun) {
    log(
      `[task] dry-run ${path.relative(root, source)} -> ${path.relative(root, target)} (${spec.status})`,
    );
    return;
  }

  fs.mkdirSync(targetDir, { recursive: true });
  const temp = `${source}.tmp-${process.pid}`;
  fs.writeFileSync(temp, updated, { encoding: 'utf8', flag: 'wx' });
  fs.renameSync(temp, source);
  if (source !== target) {
    try {
      fs.renameSync(source, target);
    } catch (error) {
      const rollback = `${source}.rollback-${process.pid}`;
      fs.writeFileSync(rollback, original, { encoding: 'utf8', flag: 'wx' });
      fs.renameSync(rollback, source);
      throw error;
    }
  }
  log(`[task] moved ${spec.task.id} -> ${spec.lane}/ (${spec.status})`);
}

function runCli() {
  const args = process.argv.slice(2);
  const dryRunIndex = args.indexOf('--dry-run');
  const dryRun = dryRunIndex !== -1;
  if (dryRun) args.splice(dryRunIndex, 1);
  const [id, target] = args;

  try {
    const root = process.cwd();
    const spec = transitionSpec(id, target, discoverTasks(root));
    writeTransition(root, spec, dryRun);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) runCli();
