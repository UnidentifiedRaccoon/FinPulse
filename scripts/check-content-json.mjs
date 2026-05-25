#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const candidates = [
  path.join(root, 'src/content/program.json'),
  path.join(root, 'public/content/program.json'),
];

const file = candidates.find((candidate) => fs.existsSync(candidate));

if (!file) {
  console.log('[content] No program.json found yet. Skipping content validation.');
  process.exit(0);
}

function fail(message) {
  console.error(`[content] ${message}`);
  process.exitCode = 1;
}

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isSlug(value) {
  return typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

function requireString(obj, key, ctx) {
  if (typeof obj[key] !== 'string' || obj[key].trim() === '') {
    fail(`${ctx}.${key} must be a non-empty string`);
  }
}

function requireSlug(obj, key, ctx) {
  if (!isSlug(obj[key])) {
    fail(`${ctx}.${key} must be a URL-safe slug: lowercase words separated by hyphens`);
  }
}

function checkUnique(value, set, ctx) {
  if (set.has(value)) {
    fail(`${ctx} duplicates value: ${value}`);
  }
  set.add(value);
}

let program;
try {
  program = JSON.parse(fs.readFileSync(file, 'utf8'));
} catch (error) {
  fail(`Failed to parse ${path.relative(root, file)}: ${error.message}`);
  process.exit(process.exitCode ?? 1);
}

if (!isObject(program)) {
  fail('Program root must be an object');
} else {
  if (program.schemaVersion !== 1) fail('program.schemaVersion must be 1');
  requireString(program, 'id', 'program');
  requireSlug(program, 'slug', 'program');
  requireString(program, 'title', 'program');
  if (!Array.isArray(program.modules)) fail('program.modules must be an array');
}

const moduleIds = new Set();
const moduleSlugs = new Set();
const lessonIds = new Set();
const lessonSlugs = new Set();
const allowedBlockTypes = new Set(['heading', 'paragraph', 'list', 'quote', 'callout', 'image', 'video']);

for (const [moduleIndex, module] of (program.modules ?? []).entries()) {
  const mctx = `modules[${moduleIndex}]`;
  if (!isObject(module)) {
    fail(`${mctx} must be an object`);
    continue;
  }
  requireString(module, 'id', mctx);
  requireSlug(module, 'slug', mctx);
  requireString(module, 'title', mctx);
  if (!Number.isInteger(module.order)) fail(`${mctx}.order must be an integer`);
  if (!Array.isArray(module.lessons)) fail(`${mctx}.lessons must be an array`);
  if (typeof module.id === 'string') checkUnique(module.id, moduleIds, 'module id');
  if (typeof module.slug === 'string') checkUnique(module.slug, moduleSlugs, 'module slug');

  for (const [lessonIndex, lesson] of (module.lessons ?? []).entries()) {
    const lctx = `${mctx}.lessons[${lessonIndex}]`;
    if (!isObject(lesson)) {
      fail(`${lctx} must be an object`);
      continue;
    }
    requireString(lesson, 'id', lctx);
    requireSlug(lesson, 'slug', lctx);
    requireString(lesson, 'title', lctx);
    if (!Number.isInteger(lesson.order)) fail(`${lctx}.order must be an integer`);
    if (!Array.isArray(lesson.blocks)) fail(`${lctx}.blocks must be an array`);
    if (typeof lesson.id === 'string') checkUnique(lesson.id, lessonIds, 'lesson id');
    if (typeof lesson.slug === 'string') checkUnique(lesson.slug, lessonSlugs, 'lesson slug');

    for (const [blockIndex, block] of (lesson.blocks ?? []).entries()) {
      const bctx = `${lctx}.blocks[${blockIndex}]`;
      if (!isObject(block)) {
        fail(`${bctx} must be an object`);
        continue;
      }
      if (!allowedBlockTypes.has(block.type)) {
        fail(`${bctx}.type has unsupported value: ${block.type}`);
        continue;
      }
      if (block.type === 'heading') {
        if (![2, 3].includes(block.level)) fail(`${bctx}.level must be 2 or 3`);
        requireString(block, 'text', bctx);
      }
      if (['paragraph', 'quote', 'callout'].includes(block.type)) {
        requireString(block, 'text', bctx);
      }
      if (block.type === 'list') {
        if (!Array.isArray(block.items) || block.items.length === 0) fail(`${bctx}.items must be a non-empty array`);
      }
      if (block.type === 'image') {
        requireString(block, 'src', bctx);
        if (typeof block.alt !== 'string') fail(`${bctx}.alt must be a string`);
      }
      if (block.type === 'video') {
        requireString(block, 'src', bctx);
        requireString(block, 'title', bctx);
      }
    }
  }
}

if (process.exitCode) {
  console.error(`[content] Validation failed for ${path.relative(root, file)}`);
  process.exit(process.exitCode);
}

console.log(`[content] OK: ${path.relative(root, file)}`);
