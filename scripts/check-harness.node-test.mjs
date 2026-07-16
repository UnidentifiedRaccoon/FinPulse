import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test, { after } from 'node:test';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

import {
  auditHarness,
  discoverTasks,
  pathsMayOverlap,
  pathsOverlap,
} from './check-harness.mjs';
import { nextTaskId, parseCreateArgs, renderTask } from './create-agent-task.mjs';
import {
  assertClaimReady,
  assertResultReady,
  transitionSpec,
  updateStatus,
  writeTransition,
} from './move-agent-task.mjs';

const fixtureRoots = [];
const execFileAsync = promisify(execFile);

after(() => {
  for (const root of fixtureRoots) fs.rmSync(root, { recursive: true, force: true });
});

function write(root, relative, content) {
  const filePath = path.join(root, relative);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
  return filePath;
}

function taskContent(id, status = 'active') {
  return `# ${id} — Fixture task

Status: ${status}
Owner: /test
Model: GPT-5.5 / xhigh
Started: 2026-07-10
Branch/worktree: current workspace

## Goal

Prove the harness contract.

## Intended write set

- \`src/fixture.ts\`

## Out-of-scope

- Production behavior.

## Plan

1. Run the fixture audit.

## Checks

- [ ] node --test

## Result packet

- Files changed: fixture task.
- Checks run: pass — node test.
- Risks: none.
- Follow-up: none.
`;
}

function fixtureRoot({ active = true } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'finpulse-harness-'));
  fixtureRoots.push(root);
  for (const lane of ['inbox', 'active', 'review', 'done']) {
    fs.mkdirSync(path.join(root, 'harness', 'tasks', lane), { recursive: true });
  }
  write(root, 'AGENTS.md', '# Agents\n');
  write(root, 'harness/PROJECT_STATE.md', '# State\n');
  write(
    root,
    'harness/WORKBOARD.md',
    '# Workboard\n\n## Current work\n\n- Derived from the active lane.\n',
  );
  write(root, 'harness/PARALLEL_AGENT_PROTOCOL.md', '# Protocol\n');
  if (active) write(root, 'harness/tasks/active/T-001-fixture.md', taskContent('T-001'));
  return root;
}

test('pathsOverlap catches exact and parent/glob overlaps', () => {
  assert.equal(pathsOverlap('src/a.ts', 'src/a.ts'), true);
  assert.equal(pathsOverlap('src/features/**', 'src/features/card.ts'), true);
  assert.equal(pathsOverlap('src/features', 'src/features/*.ts'), true);
  assert.equal(pathsOverlap('src/features/**', 'src/features'), true);
  assert.equal(pathsOverlap('src/foo*.ts', 'src/foobar.ts'), true);
  assert.equal(pathsOverlap('src/features/*.test.ts', 'src/features/*.css'), false);
  assert.equal(pathsMayOverlap('src/features/*.test.ts', 'src/features/*.css'), false);
  assert.equal(pathsMayOverlap('src/foo*.ts', 'src/*bar.ts'), true);
  assert.equal(
    pathsOverlap(
      '`harness/tasks/{active,review,done}/T-*.md` only for lifecycle repair',
      '`harness/tasks/review/T-999-foo.md`',
    ),
    true,
  );
  assert.equal(pathsOverlap('src/a.ts', 'src/b.ts'), false);
});

test('valid active task and workboard pass strict audit', () => {
  const root = fixtureRoot();
  const result = auditHarness(root);
  assert.deepEqual(result.errors, []);
  assert.equal(result.laneCounts.active, 1);
});

test('workboard cannot duplicate the active task list', () => {
  const root = fixtureRoot();
  write(root, 'harness/WORKBOARD.md', '# Workboard\n\n## Current work\n\n- T-001 — duplicated.\n');
  const result = auditHarness(root);
  assert(result.errors.some((error) => error.includes('must derive active claims')));
});

test('audit blocks definite overlap between two active write sets', () => {
  const root = fixtureRoot();
  write(
    root,
    'harness/tasks/active/T-002-overlap.md',
    taskContent('T-002').replace('`src/fixture.ts`', '`src/*.ts`'),
  );
  const result = auditHarness(root);
  assert(result.errors.some((error) => error.includes('active write-set overlap')));
});

test('audit detects lane/status mismatch and context budget regression', () => {
  const root = fixtureRoot({ active: false });
  write(root, 'harness/tasks/review/T-002-bad.md', taskContent('T-002', 'active'));
  write(root, 'harness/PROJECT_STATE.md', `${'line\n'.repeat(211)}`);
  const result = auditHarness(root);
  assert(result.errors.some((error) => error.includes('does not match review/')));
  assert(result.errors.some((error) => error.includes('context budget exceeded')));
});

test('new-contract review tasks cannot bypass claim and result metadata', () => {
  const root = fixtureRoot({ active: false });
  const incomplete = renderTask('T-186', 'Incomplete').replace('Status: planned', 'Status: review');
  write(root, 'harness/tasks/review/T-186-incomplete.md', incomplete);
  const result = auditHarness(root);
  assert(result.errors.some((error) => error.includes('Intended write set must be defined')));
  assert(result.errors.some((error) => error.includes('Result packet is incomplete')));
});

test('legacy duplicate is a warning but active duplicate is an error', () => {
  const root = fixtureRoot({ active: false });
  write(root, 'harness/tasks/review/T-038-first.md', taskContent('T-038', 'review'));
  write(root, 'harness/tasks/done/T-038-second.md', taskContent('T-038', 'done'));
  let result = auditHarness(root);
  assert(result.warnings.some((warning) => warning.includes('T-038')));
  assert.equal(result.errors.some((error) => error.includes('duplicate task ID')), false);

  write(root, 'harness/tasks/active/T-038-third.md', taskContent('T-038', 'active'));
  result = auditHarness(root);
  assert(result.errors.some((error) => error.includes('duplicate task ID')));
});

test('only the explicit T-038 legacy duplicate is grandfathered', () => {
  const root = fixtureRoot({ active: false });
  write(root, 'harness/tasks/review/T-039-first.md', taskContent('T-039', 'review'));
  write(root, 'harness/tasks/done/T-039-second.md', taskContent('T-039', 'done'));
  const result = auditHarness(root);
  assert(result.errors.some((error) => error.includes('T-039: duplicate task ID')));
});

test('task creator derives next global ID and rejects explicit reuse', () => {
  const root = fixtureRoot();
  const tasks = discoverTasks(root);
  assert.equal(nextTaskId(tasks), 'T-002');
  assert.deepEqual(parseCreateArgs(['New', 'task', '--dry-run'], tasks), {
    id: 'T-002',
    title: 'New task',
    dryRun: true,
  });
  assert.throws(() => parseCreateArgs(['T-001', 'Duplicate'], tasks), /already exists/);
  assert.match(renderTask('T-002', 'New task'), /Status: planned/);
});

test('parallel task creators reserve globally unique IDs', async () => {
  const root = fixtureRoot({ active: false });
  const creator = fileURLToPath(new URL('./create-agent-task.mjs', import.meta.url));
  await Promise.all(
    Array.from({ length: 12 }, (_, index) =>
      execFileAsync(process.execPath, [creator, `Parallel task ${index}`], { cwd: root }),
    ),
  );
  const ids = discoverTasks(root).map((task) => task.id);
  assert.equal(ids.length, 12);
  assert.equal(new Set(ids).size, 12);
  assert.equal(fs.existsSync(path.join(root, 'harness/tasks/.create-task.lock')), false);
});

test('task transitions update status and require claim metadata', () => {
  const root = fixtureRoot();
  const tasks = discoverTasks(root);
  assert.equal(transitionSpec('T-001', 'review', tasks).status, 'review');
  assert.throws(() => transitionSpec('T-001', 'done', tasks), /Invalid task transition/);
  assert.match(updateStatus(taskContent('T-001'), 'done'), /^Status: done$/m);
  assert.doesNotThrow(() => assertClaimReady(tasks[0].filePath, taskContent('T-001')));
  assert.doesNotThrow(() => assertResultReady(tasks[0].filePath, taskContent('T-001')));
  assert.throws(
    () => assertClaimReady(tasks[0].filePath, renderTask('T-001', 'Unscoped')),
    /not ready to claim/,
  );
  assert.throws(
    () => assertResultReady(tasks[0].filePath, renderTask('T-001', 'Incomplete')),
    /result packet is incomplete/,
  );

  const plannedRoot = fixtureRoot({ active: false });
  write(plannedRoot, 'harness/tasks/inbox/T-002-planned.md', taskContent('T-002', 'planned'));
  assert.throws(
    () => transitionSpec('T-002', 'done', discoverTasks(plannedRoot)),
    /Invalid task transition/,
  );

  const mismatchedRoot = fixtureRoot({ active: false });
  write(mismatchedRoot, 'harness/tasks/active/T-003-mismatch.md', taskContent('T-003', 'review'));
  assert.throws(
    () => transitionSpec('T-003', 'done', discoverTasks(mismatchedRoot)),
    /Source task lane\/status mismatch/,
  );
});

test('task transition writes one destination file and removes the source', () => {
  const root = fixtureRoot();
  const spec = transitionSpec('T-001', 'review', discoverTasks(root));
  writeTransition(root, spec, false, () => undefined);
  assert.equal(fs.existsSync(path.join(root, 'harness/tasks/active/T-001-fixture.md')), false);
  const reviewPath = path.join(root, 'harness/tasks/review/T-001-fixture.md');
  assert.equal(fs.existsSync(reviewPath), true);
  assert.match(fs.readFileSync(reviewPath, 'utf8'), /^Status: review$/m);
});
