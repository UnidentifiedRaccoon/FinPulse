#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const LANE_STATUS = {
  inbox: new Set(['planned']),
  active: new Set(['active', 'blocked']),
  review: new Set(['review']),
  done: new Set(['done']),
};

const LEGACY_DUPLICATE_IDS = new Set(['T-038']);

const CONTEXT_BUDGETS = {
  'AGENTS.md': { lines: 180, bytes: 14_000 },
  'harness/PROJECT_STATE.md': { lines: 210, bytes: 18_000 },
  'harness/WORKBOARD.md': { lines: 90, bytes: 9_000 },
  'harness/PARALLEL_AGENT_PROTOCOL.md': { lines: 180, bytes: 14_000 },
};

const STALE_PATTERNS = [
  ['Current system risk is low because there is no backend', 'obsolete static-site risk claim'],
  ['Do not introduce a backend dependency for MVP content delivery', 'obsolete no-backend rule'],
  ['JSON data source;', 'obsolete JSON runtime-source rule'],
  ['JSON data;', 'obsolete JSON runtime-source rule'],
  ['make proof-lite', 'foreign Makefile workflow'],
  ['.agent/stages', 'foreign .agent workflow'],
  ['docs/architecture/source-of-truth.md', 'missing foreign source-of-truth doc'],
];

function lineCount(content) {
  if (content.length === 0) return 0;
  return content.split(/\r?\n/).length - (content.endsWith('\n') ? 1 : 0);
}

function sectionBody(content, heading) {
  const lines = content.split(/\r?\n/);
  const start = lines.findIndex((line) => line.trim() === `## ${heading}`);
  if (start === -1) return '';
  const next = lines.findIndex((line, index) => index > start && /^##\s+/.test(line));
  return lines.slice(start + 1, next === -1 ? undefined : next).join('\n').trim();
}

function bulletItems(section) {
  return section
    .split(/\r?\n/)
    .map((line) => line.match(/^\s*-\s+(.*)$/)?.[1]?.trim())
    .filter((value) => value && value !== '-');
}

function cleanPathItem(item) {
  const backtickPath = item.match(/`([^`]+)`/)?.[1]?.trim();
  if (backtickPath) return backtickPath;
  return item
    .replace(/\s+#.*$/, '')
    .trim();
}

function normalizePathPattern(value) {
  return cleanPathItem(value).replace(/^\.\//, '');
}

function hasGlob(value) {
  return /[*?{[]/.test(value);
}

function staticPrefix(value) {
  const cleaned = normalizePathPattern(value);
  const wildcardIndex = cleaned.search(/[*?[{]/);
  return (wildcardIndex === -1 ? cleaned : cleaned.slice(0, wildcardIndex)).replace(/\/$/, '');
}

function expandBraces(pattern) {
  const match = pattern.match(/\{([^{}]+)\}/);
  if (!match) return [pattern];
  return match[1]
    .split(',')
    .flatMap((option) => expandBraces(`${pattern.slice(0, match.index)}${option}${pattern.slice(match.index + match[0].length)}`));
}

function globToRegExp(pattern) {
  let result = '^';
  for (let index = 0; index < pattern.length; index += 1) {
    const char = pattern[index];
    if (char === '*' && pattern[index + 1] === '*') {
      if (pattern[index + 2] === '/') {
        result += '(?:.*/)?';
        index += 2;
      } else {
        result += '.*';
        index += 1;
      }
    } else if (char === '*') {
      result += '[^/]*';
    } else if (char === '?') {
      result += '[^/]';
    } else {
      result += char.replace(/[|\\{}()[\]^$+?.]/g, '\\$&');
    }
  }
  return new RegExp(`${result}$`);
}

function globMatches(pattern, candidate) {
  return expandBraces(pattern).some((expanded) => globToRegExp(expanded).test(candidate));
}

function sampleFromGlob(pattern) {
  return expandBraces(pattern).map((expanded) =>
    expanded
      .replace(/\*\*\/?/g, 'sample/')
      .replace(/\*/g, 'sample')
      .replace(/\?/g, 'x')
      .replace(/\/$/, ''),
  );
}

function globOverlapsConcrete(pattern, candidate) {
  if (globMatches(pattern, candidate)) return true;
  const prefix = staticPrefix(pattern);
  const concrete = candidate.replace(/\/$/, '');
  return Boolean(prefix && (prefix === concrete || prefix.startsWith(`${concrete}/`)));
}

function literalSuffix(pattern) {
  const lastWildcard = Math.max(pattern.lastIndexOf('*'), pattern.lastIndexOf('?'), pattern.lastIndexOf(']'));
  return pattern.slice(lastWildcard + 1);
}

function globSuffixesCompatible(left, right) {
  return expandBraces(left).some((a) =>
    expandBraces(right).some((b) => {
      const aSuffix = literalSuffix(a);
      const bSuffix = literalSuffix(b);
      return aSuffix.endsWith(bSuffix) || bSuffix.endsWith(aSuffix);
    }),
  );
}

export function pathsOverlap(left, right) {
  const a = normalizePathPattern(left);
  const b = normalizePathPattern(right);
  if (!a || !b) return false;
  const aGlob = hasGlob(a);
  const bGlob = hasGlob(b);

  if (!aGlob && !bGlob) {
    if (a === b) return true;
    return a.startsWith(`${b.replace(/\/$/, '')}/`) || b.startsWith(`${a.replace(/\/$/, '')}/`);
  }
  if (aGlob && !bGlob) return globOverlapsConcrete(a, b);
  if (!aGlob && bGlob) return globOverlapsConcrete(b, a);
  if (a === b) return true;
  return (
    sampleFromGlob(a).some((sample) => globMatches(b, sample)) ||
    sampleFromGlob(b).some((sample) => globMatches(a, sample))
  );
}

export function pathsMayOverlap(left, right) {
  if (pathsOverlap(left, right)) return false;
  const a = normalizePathPattern(left);
  const b = normalizePathPattern(right);
  if (!hasGlob(a) || !hasGlob(b)) return false;
  if (!globSuffixesCompatible(a, b)) return false;
  const aPrefix = staticPrefix(a);
  const bPrefix = staticPrefix(b);
  if (!aPrefix || !bPrefix) return true;
  return aPrefix === bPrefix || aPrefix.startsWith(`${bPrefix}/`) || bPrefix.startsWith(`${aPrefix}/`);
}

export function parseTask(filePath, lane, content) {
  const basename = path.basename(filePath);
  const fileId = basename.match(/^(T-\d{3,})-/)?.[1] ?? null;
  const headingId = content.match(/^#\s+(T-\d{3,})\b/m)?.[1] ?? null;
  const status = content.match(/^Status:\s*(\S.*)?$/m)?.[1]?.trim() ?? null;
  const owner = content.match(/^Owner:\s*(.*)$/m)?.[1]?.trim() ?? null;
  const model = content.match(/^Model:\s*(.*)$/m)?.[1]?.trim() ?? null;
  const started = content.match(/^Started:\s*(.*)$/m)?.[1]?.trim() ?? null;
  const branch = content.match(/^Branch\/worktree:\s*(.*)$/m)?.[1]?.trim() ?? null;
  const writeSet = bulletItems(sectionBody(content, 'Intended write set')).map(cleanPathItem);

  return {
    filePath,
    lane,
    fileId,
    headingId,
    id: fileId ?? headingId,
    status,
    owner,
    model,
    started,
    branch,
    goal: sectionBody(content, 'Goal'),
    writeSet,
    outOfScope: sectionBody(content, 'Out-of-scope'),
    plan: sectionBody(content, 'Plan'),
    checks: sectionBody(content, 'Checks'),
    resultPacket: sectionBody(content, 'Result packet'),
  };
}

export function missingResultFields(resultPacket) {
  const required = ['Files changed', 'Checks run', 'Risks', 'Follow-up'];
  return required.filter((label) => {
    const match = resultPacket.match(new RegExp(`^- ${label}(?: \\([^)]*\\))?:\\s*(.*)$`, 'm'));
    return !match?.[1]?.trim();
  });
}

export function discoverTasks(root) {
  const tasks = [];
  for (const lane of Object.keys(LANE_STATUS)) {
    const laneDir = path.join(root, 'harness', 'tasks', lane);
    if (!fs.existsSync(laneDir)) continue;
    for (const entry of fs.readdirSync(laneDir, { withFileTypes: true })) {
      if (!entry.isFile() || !/^T-\d{3,}-.*\.md$/.test(entry.name)) continue;
      const filePath = path.join(laneDir, entry.name);
      tasks.push(parseTask(filePath, lane, fs.readFileSync(filePath, 'utf8')));
    }
  }
  return tasks.sort((a, b) => a.filePath.localeCompare(b.filePath));
}

function validateTask(task, errors, warnings) {
  const relative = task.filePath;
  const taskNumber = Number.parseInt(task.id?.slice(2) ?? '', 10);
  const modern = Number.isFinite(taskNumber) && taskNumber >= 185;
  const strict = task.lane === 'inbox' || task.lane === 'active' || modern;

  if (!task.fileId || !task.headingId || task.fileId !== task.headingId) {
    (strict ? errors : warnings).push(`${relative}: filename/header task ID mismatch`);
  }

  if (!task.status) {
    (strict ? errors : warnings).push(`${relative}: missing canonical Status field`);
  } else if (!LANE_STATUS[task.lane].has(task.status)) {
    errors.push(`${relative}: Status ${JSON.stringify(task.status)} does not match ${task.lane}/`);
  }

  if (!strict) return;

  if (!task.goal || /^[-\s]*$/.test(task.goal)) errors.push(`${relative}: Goal is empty`);
  if (task.model !== 'GPT-5.5 / xhigh') {
    errors.push(`${relative}: Model must be "GPT-5.5 / xhigh"`);
  }

  const claimed = task.lane === 'active' || (modern && (task.lane === 'review' || task.lane === 'done'));
  if (claimed) {
    if (task.writeSet.length === 0 || task.writeSet.some((item) => /define before/i.test(item))) {
      errors.push(`${relative}: Intended write set must be defined before claim`);
    }
    if (!task.outOfScope || /define before/i.test(task.outOfScope)) {
      errors.push(`${relative}: Out-of-scope must be defined before claim`);
    }
    if (!task.plan || /refine before/i.test(task.plan)) {
      errors.push(`${relative}: Plan must be defined before claim`);
    }
    if (!task.checks || /define focused/i.test(task.checks)) {
      errors.push(`${relative}: Checks must be defined before claim`);
    }
    if (!task.owner || /^<.*>$/.test(task.owner)) errors.push(`${relative}: Owner is empty`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(task.started ?? '')) {
      errors.push(`${relative}: Started must be YYYY-MM-DD`);
    }
    if (!task.branch || /^<.*>$/.test(task.branch)) {
      errors.push(`${relative}: Branch/worktree is empty`);
    }
    if (!task.resultPacket) errors.push(`${relative}: Result packet section is missing`);
    if (modern && (task.lane === 'review' || task.lane === 'done')) {
      const missing = missingResultFields(task.resultPacket);
      if (missing.length > 0) {
        errors.push(`${relative}: Result packet is incomplete (${missing.join(', ')})`);
      }
    }
  }
}

function validateDuplicates(tasks, errors, warnings) {
  const byId = new Map();
  for (const task of tasks) {
    if (!task.id) continue;
    const group = byId.get(task.id) ?? [];
    group.push(task);
    byId.set(task.id, group);
  }

  for (const [id, group] of byId) {
    if (group.length < 2) continue;
    const message = `${id}: duplicate task ID in ${group.map((task) => task.lane).join(', ')}`;
    if (
      LEGACY_DUPLICATE_IDS.has(id) &&
      group.every((task) => task.lane === 'review' || task.lane === 'done')
    ) {
      warnings.push(`${message} (grandfathered legacy archive debt)`);
    } else {
      errors.push(message);
    }
  }
}

function validateActiveOverlap(tasks, errors, warnings) {
  const active = tasks.filter((task) => task.lane === 'active');
  for (let i = 0; i < active.length; i += 1) {
    for (let j = i + 1; j < active.length; j += 1) {
      for (const left of active[i].writeSet) {
        for (const right of active[j].writeSet) {
          if (pathsOverlap(left, right)) {
            errors.push(
              `${active[i].id}/${active[j].id}: active write-set overlap (${left} <> ${right})`,
            );
          } else if (pathsMayOverlap(left, right)) {
            warnings.push(
              `${active[i].id}/${active[j].id}: possible glob overlap needs owner review (${left} <> ${right})`,
            );
          }
        }
      }
    }
  }
}

function validateWorkboard(root, errors) {
  const boardPath = path.join(root, 'harness', 'WORKBOARD.md');
  if (!fs.existsSync(boardPath)) {
    errors.push('harness/WORKBOARD.md: missing');
    return;
  }

  const currentWork = sectionBody(fs.readFileSync(boardPath, 'utf8'), 'Current work');
  if (!currentWork) errors.push('WORKBOARD Current work section is empty');
  const duplicatedIds = currentWork.match(/T-\d{3,}/g) ?? [];
  if (duplicatedIds.length > 0) {
    errors.push(
      `WORKBOARD Current work must derive active claims, not duplicate task IDs: ${duplicatedIds.join(', ')}`,
    );
  }
}

function validateContext(root, errors, metrics) {
  for (const [relative, budget] of Object.entries(CONTEXT_BUDGETS)) {
    const filePath = path.join(root, relative);
    if (!fs.existsSync(filePath)) {
      errors.push(`${relative}: missing`);
      continue;
    }
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = lineCount(content);
    const bytes = Buffer.byteLength(content);
    metrics[relative] = { lines, bytes, budget };
    if (lines > budget.lines || bytes > budget.bytes) {
      errors.push(
        `${relative}: context budget exceeded (${lines}/${budget.lines} lines, ${bytes}/${budget.bytes} bytes)`,
      );
    }
  }
}

function validateStaleClaims(root, errors) {
  const files = [
    'AGENTS.md',
    'docs/DEVELOPMENT.md',
    'docs/engineering/contributing.md',
    'harness/RISK_POLICY.md',
    'harness/prompts/BUILDER.md',
    'harness/prompts/ORCHESTRATOR.md',
    'harness/prompts/SUBAGENT_CONTEXT_PACKET.md',
    'harness/prompts/VERIFIER.md',
  ];
  for (const relative of files) {
    const filePath = path.join(root, relative);
    if (!fs.existsSync(filePath)) continue;
    const content = fs.readFileSync(filePath, 'utf8');
    for (const [pattern, label] of STALE_PATTERNS) {
      if (content.includes(pattern)) errors.push(`${relative}: ${label}`);
    }
  }
}

export function auditHarness(root = process.cwd()) {
  const errors = [];
  const warnings = [];
  const metrics = {};
  const tasks = discoverTasks(root);

  for (const task of tasks) validateTask({ ...task, filePath: path.relative(root, task.filePath) }, errors, warnings);
  validateDuplicates(tasks, errors, warnings);
  validateActiveOverlap(tasks, errors, warnings);
  validateWorkboard(root, errors);
  validateContext(root, errors, metrics);
  validateStaleClaims(root, errors);

  const laneCounts = Object.fromEntries(
    Object.keys(LANE_STATUS).map((lane) => [lane, tasks.filter((task) => task.lane === lane).length]),
  );
  return { errors, warnings, metrics, tasks, laneCounts };
}

function printSummary(result) {
  const counts = Object.entries(result.laneCounts)
    .map(([lane, count]) => `${lane}=${count}`)
    .join(' ');
  console.log(`[harness] tasks ${counts}`);
  const active = result.tasks.filter((task) => task.lane === 'active');
  console.log(
    `[harness] active ${active.length ? active.map((task) => `${task.id}:${task.status}`).join(', ') : 'none'}`,
  );
  for (const [relative, metric] of Object.entries(result.metrics)) {
    console.log(`[harness] context ${relative} ${metric.lines} lines ${metric.bytes} bytes`);
  }
}

function printWarnings(warnings) {
  const missingStatus = warnings.filter((warning) => warning.includes('missing canonical Status field'));
  const other = warnings.filter((warning) => !warning.includes('missing canonical Status field'));
  if (missingStatus.length > 0) {
    const ids = missingStatus
      .map((warning) => warning.match(/T-\d{3,}/)?.[0])
      .filter(Boolean)
      .join(', ');
    console.warn(
      `[harness] WARN ${missingStatus.length} legacy review packet(s) lack Status: ${ids}`,
    );
  }
  for (const warning of other) console.warn(`[harness] WARN ${warning}`);
}

function runCli() {
  const summary = process.argv.includes('--summary');
  const result = auditHarness(process.cwd());
  if (summary || result.errors.length > 0) printSummary(result);
  printWarnings(result.warnings);
  for (const error of result.errors) console.error(`[harness] ERROR ${error}`);
  if (result.errors.length > 0) process.exit(1);
  if (!summary) console.log(`[harness] OK (${result.tasks.length} task packets, ${result.warnings.length} legacy warning(s))`);
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) runCli();
