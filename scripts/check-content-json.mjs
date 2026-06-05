#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const contentRoot = path.join(root, 'src/content');
const programFile = path.join(contentRoot, 'program.json');
const allowedCardTypes = new Set([
  'theory',
  'video',
  'callout',
  'single_choice',
  'reflection',
  'scenario',
  'artifact',
  'checklist',
  'summary',
]);
const allowedCheckability = new Set(['objective', 'subjective', 'mixed']);
const allowedInputTypes = new Set(['text', 'single_select', 'multi_select', 'table', 'freeform']);

function fail(message) {
  console.error(`[content] ${message}`);
  process.exitCode = 1;
}

if (!fs.existsSync(programFile)) {
  fail('src/content/program.json is required');
  process.exit(1);
}

function rel(file) {
  return path.relative(root, file);
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    fail(`Failed to parse ${rel(file)}: ${error.message}`);
    return null;
  }
}

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isSlug(value) {
  return typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

function requireObject(value, ctx) {
  if (!isObject(value)) {
    fail(`${ctx} must be an object`);
    return false;
  }
  return true;
}

function requireOnlyKeys(obj, allowedKeys, ctx) {
  if (!isObject(obj)) return;
  const allowed = new Set(allowedKeys);
  for (const key of Object.keys(obj)) {
    if (!allowed.has(key)) {
      fail(`${ctx}.${key} is not supported`);
    }
  }
}

function requireString(obj, key, ctx) {
  if (typeof obj[key] !== 'string' || obj[key].trim() === '') {
    fail(`${ctx}.${key} must be a non-empty string`);
  }
}

function requireOptionalString(obj, key, ctx) {
  if (obj[key] !== undefined && typeof obj[key] !== 'string') {
    fail(`${ctx}.${key} must be a string when present`);
  }
}

function requireSlug(obj, key, ctx) {
  if (!isSlug(obj[key])) {
    fail(`${ctx}.${key} must be a URL-safe slug: lowercase words separated by hyphens`);
  }
}

function requireOrder(obj, ctx) {
  if (!Number.isInteger(obj.order) || obj.order < 0) {
    fail(`${ctx}.order must be a non-negative integer`);
  }
}

function requireStringArray(obj, key, ctx, min = 0) {
  if (obj[key] === undefined) return;
  if (!Array.isArray(obj[key]) || obj[key].length < min || obj[key].some((item) => typeof item !== 'string' || item.trim() === '')) {
    fail(`${ctx}.${key} must be an array of non-empty strings`);
  }
}

function requireCustomOption(obj, key, ctx) {
  if (obj[key] === undefined) return;
  const customOption = obj[key];
  const optionCtx = `${ctx}.${key}`;
  if (!requireObject(customOption, optionCtx)) return;
  requireOnlyKeys(customOption, ['label', 'placeholder'], optionCtx);
  requireString(customOption, 'label', optionCtx);
  requireOptionalString(customOption, 'placeholder', optionCtx);
}

function requireArray(obj, key, ctx, min = 0) {
  if (!Array.isArray(obj[key]) || obj[key].length < min) {
    fail(`${ctx}.${key} must be an array with at least ${min} item(s)`);
    return [];
  }
  return obj[key];
}

function checkUnique(value, set, ctx) {
  if (typeof value !== 'string') return;
  if (set.has(value)) {
    fail(`${ctx} duplicates value: ${value}`);
  }
  set.add(value);
}

function validateOrderSequence(items, ctx) {
  const seenOrders = new Set();
  let previousOrder = -1;

  for (const [index, item] of items.entries()) {
    if (!isObject(item) || !Number.isInteger(item.order)) continue;

    if (seenOrders.has(item.order)) {
      fail(`${ctx}[${index}].order duplicates value: ${item.order}`);
    }
    if (item.order < previousOrder) {
      fail(`${ctx} must be sorted by order`);
    }

    seenOrders.add(item.order);
    previousOrder = item.order;
  }
}

function normalizeRefPath(refPath, ctx) {
  if (typeof refPath !== 'string' || refPath.trim() === '') return null;
  if (refPath.trim() !== refPath) {
    fail(`${ctx}.path must not have leading or trailing whitespace`);
    return null;
  }
  if (path.isAbsolute(refPath) || refPath.includes('\\')) {
    fail(`${ctx}.path must be a normalized relative POSIX path`);
    return null;
  }

  const normalized = path.posix.normalize(refPath);
  if (normalized !== refPath || normalized === '.' || normalized.startsWith('../') || normalized.includes('/../')) {
    fail(`${ctx}.path must be normalized and stay within the content tree`);
    return null;
  }

  return normalized;
}

function resolveRef(baseDir, refPath, ctx) {
  const normalized = normalizeRefPath(refPath, ctx);
  if (!normalized) return null;
  return path.join(baseDir, ...normalized.split('/'));
}

function validateRefShape(ref, ctx) {
  if (!requireObject(ref, ctx)) return;
  requireOnlyKeys(ref, ['id', 'slug', 'title', 'description', 'order', 'path'], ctx);
  requireString(ref, 'id', ctx);
  requireSlug(ref, 'slug', ctx);
  requireString(ref, 'title', ctx);
  requireOptionalString(ref, 'description', ctx);
  requireOrder(ref, ctx);
  requireString(ref, 'path', ctx);
}

function validateLesson(lesson, ctx, seen) {
  if (!requireObject(lesson, ctx)) return;
  requireOnlyKeys(lesson, ['id', 'slug', 'title', 'subtitle', 'description', 'order', 'estimatedMinutes', 'learningGoal', 'mainSkill', 'tags', 'sourceSection', 'cards'], ctx);
  requireString(lesson, 'id', ctx);
  requireSlug(lesson, 'slug', ctx);
  requireString(lesson, 'title', ctx);
  requireOptionalString(lesson, 'subtitle', ctx);
  requireOptionalString(lesson, 'description', ctx);
  requireOrder(lesson, ctx);
  if (lesson.estimatedMinutes !== undefined && (!Number.isInteger(lesson.estimatedMinutes) || lesson.estimatedMinutes < 1)) {
    fail(`${ctx}.estimatedMinutes must be a positive integer when present`);
  }
  requireOptionalString(lesson, 'learningGoal', ctx);
  requireOptionalString(lesson, 'mainSkill', ctx);
  requireOptionalString(lesson, 'sourceSection', ctx);
  requireStringArray(lesson, 'tags', ctx);
  checkUnique(lesson.id, seen.lessonIds, 'lesson id');
  checkUnique(lesson.slug, seen.lessonSlugs, 'lesson slug');

  const cards = requireArray(lesson, 'cards', ctx, 1);
  validateOrderSequence(cards, `${ctx}.cards`);
  for (const [cardIndex, card] of cards.entries()) {
    validateCard(card, `${ctx}.cards[${cardIndex}]`, seen);
  }
}

function validateChoiceOptions(card, ctx) {
  const options = requireArray(card, 'options', ctx, 2);
  const optionIds = new Set();
  for (const [optionIndex, option] of options.entries()) {
    const optionCtx = `${ctx}.options[${optionIndex}]`;
    if (!requireObject(option, optionCtx)) continue;
    requireOnlyKeys(option, ['id', 'label', 'isCorrect', 'feedback'], optionCtx);
    requireString(option, 'id', optionCtx);
    requireString(option, 'label', optionCtx);
    requireOptionalString(option, 'feedback', optionCtx);
    if (option.isCorrect !== undefined && typeof option.isCorrect !== 'boolean') {
      fail(`${optionCtx}.isCorrect must be a boolean when present`);
    }
    checkUnique(option.id, optionIds, `${ctx} option id`);
  }
  if (typeof card.correctOptionId === 'string' && !optionIds.has(card.correctOptionId)) {
    fail(`${ctx}.correctOptionId must match one of the option ids`);
  }
}

function validateCard(card, ctx, seen) {
  if (!requireObject(card, ctx)) return;
  requireString(card, 'id', ctx);
  requireOrder(card, ctx);
  requireOptionalString(card, 'title', ctx);
  requireOptionalString(card, 'sourceSection', ctx);
  requireOptionalString(card, 'thinkingType', ctx);
  requireOptionalString(card, 'develops', ctx);
  if (!allowedCardTypes.has(card.type)) {
    fail(`${ctx}.type has unsupported value: ${card.type}`);
    return;
  }
  const baseCardKeys = ['id', 'type', 'order', 'title', 'sourceSection', 'thinkingType', 'develops', 'checkability'];
  const cardKeysByType = {
    theory: [...baseCardKeys, 'body', 'examples'],
    video: [...baseCardKeys, 'src', 'provider', 'transcript', 'timecodes'],
    callout: [...baseCardKeys, 'tone', 'body'],
    single_choice: [...baseCardKeys, 'question', 'options', 'correctOptionId', 'feedback', 'readOnly'],
    reflection: [...baseCardKeys, 'prompt', 'inputType', 'options', 'customOption', 'saveKey', 'guidance', 'readOnly'],
    scenario: [...baseCardKeys, 'body', 'question', 'options', 'correctOptionId', 'feedback', 'readOnly'],
    artifact: [...baseCardKeys, 'body', 'template', 'variants', 'customOption', 'readOnly'],
    checklist: [...baseCardKeys, 'body', 'items'],
    summary: [...baseCardKeys, 'body', 'points', 'nextStep'],
  };
  requireOnlyKeys(card, cardKeysByType[card.type], ctx);
  if (card.checkability !== undefined && !allowedCheckability.has(card.checkability)) {
    fail(`${ctx}.checkability must be objective, subjective, or mixed`);
  }
  checkUnique(card.id, seen.cardIds, 'card id');

  if (card.type === 'theory') {
    requireString(card, 'body', ctx);
    requireStringArray(card, 'examples', ctx);
  }
  if (card.type === 'video') {
    requireString(card, 'title', ctx);
    requireString(card, 'src', ctx);
    requireOptionalString(card, 'provider', ctx);
    requireOptionalString(card, 'transcript', ctx);
    if (card.timecodes !== undefined) {
      const timecodes = requireArray(card, 'timecodes', ctx);
      for (const [timecodeIndex, timecode] of timecodes.entries()) {
        const timecodeCtx = `${ctx}.timecodes[${timecodeIndex}]`;
        if (!requireObject(timecode, timecodeCtx)) continue;
        requireOnlyKeys(timecode, ['time', 'label'], timecodeCtx);
        requireString(timecode, 'time', timecodeCtx);
        requireString(timecode, 'label', timecodeCtx);
      }
    }
  }
  if (card.type === 'callout') {
    requireString(card, 'body', ctx);
    if (card.tone !== undefined && !['info', 'warning', 'success', 'reflection'].includes(card.tone)) {
      fail(`${ctx}.tone has unsupported value: ${card.tone}`);
    }
  }
  if (card.type === 'single_choice') {
    requireString(card, 'question', ctx);
    validateChoiceOptions(card, ctx);
    requireOptionalString(card, 'correctOptionId', ctx);
    requireOptionalString(card, 'feedback', ctx);
    if (card.readOnly !== undefined && typeof card.readOnly !== 'boolean') fail(`${ctx}.readOnly must be a boolean`);
  }
  if (card.type === 'reflection') {
    requireString(card, 'prompt', ctx);
    if (card.inputType !== undefined && !allowedInputTypes.has(card.inputType)) fail(`${ctx}.inputType has unsupported value: ${card.inputType}`);
    requireStringArray(card, 'options', ctx);
    requireCustomOption(card, 'customOption', ctx);
    if (card.customOption !== undefined && card.inputType !== 'single_select') {
      fail(`${ctx}.customOption is only supported for inputType single_select`);
    }
    requireOptionalString(card, 'saveKey', ctx);
    requireOptionalString(card, 'guidance', ctx);
    if (card.readOnly !== undefined && typeof card.readOnly !== 'boolean') fail(`${ctx}.readOnly must be a boolean`);
  }
  if (card.type === 'scenario') {
    requireString(card, 'body', ctx);
    requireOptionalString(card, 'question', ctx);
    if (card.options !== undefined) validateChoiceOptions(card, ctx);
    if (card.correctOptionId !== undefined && card.options === undefined) {
      fail(`${ctx}.correctOptionId requires options`);
    }
    requireOptionalString(card, 'correctOptionId', ctx);
    requireOptionalString(card, 'feedback', ctx);
    if (card.readOnly !== undefined && typeof card.readOnly !== 'boolean') fail(`${ctx}.readOnly must be a boolean`);
  }
  if (card.type === 'artifact') {
    requireString(card, 'body', ctx);
    requireStringArray(card, 'template', ctx);
    requireStringArray(card, 'variants', ctx);
    requireCustomOption(card, 'customOption', ctx);
    if (card.customOption !== undefined && (!Array.isArray(card.variants) || card.variants.length === 0)) {
      fail(`${ctx}.customOption requires variants`);
    }
    if (card.readOnly !== undefined && typeof card.readOnly !== 'boolean') fail(`${ctx}.readOnly must be a boolean`);
  }
  if (card.type === 'checklist') {
    requireOptionalString(card, 'body', ctx);
    requireStringArray(card, 'items', ctx, 1);
  }
  if (card.type === 'summary') {
    requireOptionalString(card, 'body', ctx);
    requireStringArray(card, 'points', ctx, 1);
    requireOptionalString(card, 'nextStep', ctx);
  }
}

function validateSupplemental(unit, ctx) {
  if (unit.supplemental === undefined) return;
  const supplemental = unit.supplemental;
  if (!requireObject(supplemental, `${ctx}.supplemental`)) return;
  requireOnlyKeys(supplemental, ['strategy', 'sourceFiles', 'trainings', 'spacedRepetition', 'expansionScenarios', 'editorialRules', 'glossary', 'outcome'], `${ctx}.supplemental`);
  requireOptionalString(supplemental, 'strategy', `${ctx}.supplemental`);
  requireStringArray(supplemental, 'sourceFiles', `${ctx}.supplemental`);
  for (const key of ['trainings', 'spacedRepetition', 'expansionScenarios']) {
    if (supplemental[key] === undefined) continue;
    const items = requireArray(supplemental, key, `${ctx}.supplemental`);
    for (const [itemIndex, item] of items.entries()) {
      const itemCtx = `${ctx}.supplemental.${key}[${itemIndex}]`;
      if (!requireObject(item, itemCtx)) continue;
      requireOnlyKeys(item, ['id', 'title', 'sourceSection', 'type', 'summary', 'content'], itemCtx);
      requireString(item, 'id', itemCtx);
      requireString(item, 'title', itemCtx);
      requireOptionalString(item, 'sourceSection', itemCtx);
      requireOptionalString(item, 'type', itemCtx);
      requireString(item, 'summary', itemCtx);
      requireStringArray(item, 'content', itemCtx);
    }
  }
  requireStringArray(supplemental, 'editorialRules', `${ctx}.supplemental`);
  requireStringArray(supplemental, 'outcome', `${ctx}.supplemental`);
  if (supplemental.glossary !== undefined) {
    const terms = requireArray(supplemental, 'glossary', `${ctx}.supplemental`);
    for (const [termIndex, term] of terms.entries()) {
      const termCtx = `${ctx}.supplemental.glossary[${termIndex}]`;
      if (!requireObject(term, termCtx)) continue;
      requireOnlyKeys(term, ['term', 'definition'], termCtx);
      requireString(term, 'term', termCtx);
      requireString(term, 'definition', termCtx);
    }
  }
}

function validateProgramGraph(programFile, contentRoot) {
  const program = readJson(programFile);
  const seen = {
    moduleIds: new Set(),
    moduleSlugs: new Set(),
    unitIds: new Set(),
    unitSlugs: new Set(),
    lessonIds: new Set(),
    lessonSlugs: new Set(),
    cardIds: new Set(),
  };

  if (requireObject(program, 'program')) {
  requireOnlyKeys(program, ['schemaVersion', 'id', 'slug', 'title', 'description', 'modules'], 'program');
  if (program.schemaVersion !== 1) fail('program.schemaVersion must be 1');
  requireString(program, 'id', 'program');
  requireSlug(program, 'slug', 'program');
  requireString(program, 'title', 'program');
  requireOptionalString(program, 'description', 'program');

  const moduleRefs = requireArray(program, 'modules', 'program', 1);
  validateOrderSequence(moduleRefs, 'program.modules');
  for (const [moduleIndex, moduleRef] of moduleRefs.entries()) {
    const refCtx = `program.modules[${moduleIndex}]`;
    validateRefShape(moduleRef, refCtx);
    checkUnique(moduleRef.id, seen.moduleIds, 'module id');
    checkUnique(moduleRef.slug, seen.moduleSlugs, 'module slug');

    const modulePath = resolveRef(contentRoot, moduleRef.path, refCtx);
    if (!modulePath || !fs.existsSync(modulePath)) {
      fail(`${refCtx}.path does not exist: ${moduleRef.path}`);
      continue;
    }

    const module = readJson(modulePath);
    const moduleCtx = `${rel(modulePath)}`;
    if (!requireObject(module, moduleCtx)) continue;
    requireOnlyKeys(module, ['schemaVersion', 'id', 'slug', 'title', 'description', 'order', 'source', 'units'], moduleCtx);
    if (module.schemaVersion !== 1) fail(`${moduleCtx}.schemaVersion must be 1`);
    requireString(module, 'id', moduleCtx);
    requireSlug(module, 'slug', moduleCtx);
    requireString(module, 'title', moduleCtx);
    requireOptionalString(module, 'description', moduleCtx);
    requireOptionalString(module, 'source', moduleCtx);
    requireOrder(module, moduleCtx);

    for (const key of ['id', 'slug', 'title', 'order']) {
      if (moduleRef[key] !== module[key]) {
        fail(`${refCtx}.${key} must match ${moduleCtx}.${key}`);
      }
    }

    const unitRefs = requireArray(module, 'units', moduleCtx, 1);
    validateOrderSequence(unitRefs, `${moduleCtx}.units`);
    const unitIdsInModule = new Set();
    const unitSlugsInModule = new Set();
    for (const [unitIndex, unitRef] of unitRefs.entries()) {
      const unitRefCtx = `${moduleCtx}.units[${unitIndex}]`;
      validateRefShape(unitRef, unitRefCtx);
      checkUnique(unitRef.id, unitIdsInModule, `${moduleCtx} unit id`);
      checkUnique(unitRef.slug, unitSlugsInModule, `${moduleCtx} unit slug`);
      checkUnique(unitRef.id, seen.unitIds, 'unit id');
      checkUnique(unitRef.slug, seen.unitSlugs, 'unit slug');

      const unitPath = resolveRef(path.dirname(modulePath), unitRef.path, unitRefCtx);
      if (!unitPath || !fs.existsSync(unitPath)) {
        fail(`${unitRefCtx}.path does not exist: ${unitRef.path}`);
        continue;
      }

      const unit = readJson(unitPath);
      const unitCtx = `${rel(unitPath)}`;
      if (!requireObject(unit, unitCtx)) continue;
      requireOnlyKeys(unit, ['schemaVersion', 'id', 'slug', 'title', 'description', 'order', 'source', 'lessons', 'supplemental'], unitCtx);
      if (unit.schemaVersion !== 1) fail(`${unitCtx}.schemaVersion must be 1`);
      requireString(unit, 'id', unitCtx);
      requireSlug(unit, 'slug', unitCtx);
      requireString(unit, 'title', unitCtx);
      requireOptionalString(unit, 'description', unitCtx);
      requireOrder(unit, unitCtx);
      requireString(unit, 'source', unitCtx);

      for (const key of ['id', 'slug', 'title', 'order']) {
        if (unitRef[key] !== unit[key]) {
          fail(`${unitRefCtx}.${key} must match ${unitCtx}.${key}`);
        }
      }

      const lessons = requireArray(unit, 'lessons', unitCtx, 1);
      validateOrderSequence(lessons, `${unitCtx}.lessons`);
      for (const [lessonIndex, lesson] of lessons.entries()) {
        validateLesson(lesson, `${unitCtx}.lessons[${lessonIndex}]`, seen);
      }
      validateSupplemental(unit, unitCtx);
    }
  }
  }
}

validateProgramGraph(programFile, contentRoot);

const exampleProgramFile = path.join(root, 'examples/content/program.example.json');
if (fs.existsSync(exampleProgramFile)) {
  validateProgramGraph(exampleProgramFile, path.dirname(exampleProgramFile));
}

if (process.exitCode) {
  console.error(`[content] Validation failed for ${rel(programFile)}`);
  process.exit(process.exitCode);
}

console.log(`[content] OK: ${rel(programFile)}`);
