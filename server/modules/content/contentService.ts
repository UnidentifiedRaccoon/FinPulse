import { readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

import {
  getAllLessons,
  getOrderedCards,
  getOrderedModules,
  getOrderedUnits,
  parseProgram,
  type Card,
  type Lesson,
  type Module,
  type Program,
  type Unit,
} from '../../../src/content/program'

type LoadedModuleFile = {
  units: Array<{ path: string }>
}

export type LessonDetails = {
  module: Module
  unit: Unit
  lesson: Lesson
  previous: { module: Module; unit: Unit; lesson: Lesson } | null
  next: { module: Module; unit: Unit; lesson: Lesson } | null
}

export type UnitDetails = {
  module: Module
  unit: Unit
}

export type CardDetails = {
  module: Module
  unit: Unit
  lesson: Lesson
  card: Card
}

export type ContentService = ReturnType<typeof createContentService>

export function createContentService(contentRoot = resolve(process.cwd(), 'src/content')) {
  const program = loadProgramFromFiles(contentRoot)

  return {
    getProgram() {
      return program
    },
    getModules() {
      return getOrderedModules(program)
    },
    getModule(moduleSlug: string) {
      return getOrderedModules(program).find((module) => module.slug === moduleSlug) ?? null
    },
    getUnit(unitSlug: string): UnitDetails | null {
      for (const module of getOrderedModules(program)) {
        const unit = getOrderedUnits(module).find((candidate) => candidate.slug === unitSlug)
        if (unit) return { module, unit }
      }

      return null
    },
    getLesson(lessonSlug: string): LessonDetails | null {
      const lessons = getAllLessons(program)
      const currentIndex = lessons.findIndex(({ lesson }) => lesson.slug === lessonSlug)
      if (currentIndex < 0) return null

      return {
        ...lessons[currentIndex],
        previous: currentIndex > 0 ? lessons[currentIndex - 1] : null,
        next: currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null,
      }
    },
    hasLesson(lessonSlug: string) {
      return getAllLessons(program).some(({ lesson }) => lesson.slug === lessonSlug)
    },
    hasCard(cardId: string) {
      return getCardDetailsFromProgram(program, cardId) !== null
    },
    getCard(cardId: string): Card | null {
      return getCardDetailsFromProgram(program, cardId)?.card ?? null
    },
    getCardDetails(cardId: string): CardDetails | null {
      return getCardDetailsFromProgram(program, cardId)
    },
  }
}

function getCardDetailsFromProgram(program: Program, cardId: string): CardDetails | null {
  for (const { module, unit, lesson } of getAllLessons(program)) {
    const card = getOrderedCards(lesson).find((candidate) => candidate.id === cardId)
    if (card) return { module, unit, lesson, card }
  }

  return null
}

function loadProgramFromFiles(contentRoot: string): Program {
  const programManifest = readContentJson(contentRoot, 'program.json')

  if (!isObjectWithModules(programManifest)) {
    throw new Error('Program manifest is missing modules')
  }

  const hydratedProgram = {
    ...programManifest,
    modules: programManifest.modules.map((moduleRef) => {
      const modulePath = normalizeContentPath(moduleRef.path)
      const moduleFile = readContentJson(contentRoot, modulePath)

      if (!isObjectWithUnits(moduleFile)) {
        throw new Error(`Module file is missing units: ${modulePath}`)
      }

      const moduleBase = modulePath.split('/').slice(0, -1).join('/')

      return {
        ...moduleFile,
        units: moduleFile.units.map((unitRef) => {
          const unitPath = joinContentPath(moduleBase, unitRef.path)
          return readContentJson(contentRoot, unitPath)
        }),
      }
    }),
  }

  const parsed = parseProgram(hydratedProgram)
  if (!parsed.success) {
    throw new Error(`Program content is invalid: ${parsed.error.message}`)
  }

  return parsed.data
}

function readContentJson(contentRoot: string, refPath: string) {
  const normalizedPath = normalizeContentPath(refPath)
  const absolutePath = resolve(contentRoot, normalizedPath)
  const absoluteRoot = resolve(contentRoot)

  if (!absolutePath.startsWith(`${absoluteRoot}/`)) {
    throw new Error(`Content path escapes root: ${refPath}`)
  }

  return JSON.parse(readFileSync(absolutePath, 'utf8')) as unknown
}

function normalizeContentPath(refPath: string) {
  if (refPath.trim() !== refPath || refPath.startsWith('/') || refPath.includes('\\')) {
    throw new Error(`Invalid content path: ${refPath}`)
  }

  const parts = refPath.split('/')
  if (parts.some((part) => part === '' || part === '.' || part === '..')) {
    throw new Error(`Invalid content path: ${refPath}`)
  }

  return parts.join('/')
}

function joinContentPath(basePath: string, refPath: string) {
  const normalizedRef = normalizeContentPath(refPath)
  return basePath ? join(basePath, normalizedRef) : normalizedRef
}

function isObjectWithModules(data: unknown): data is { modules: Array<{ path: string }> } {
  return Boolean(data && typeof data === 'object' && !Array.isArray(data) && Array.isArray((data as { modules?: unknown }).modules))
}

function isObjectWithUnits(data: unknown): data is LoadedModuleFile {
  return Boolean(data && typeof data === 'object' && !Array.isArray(data) && Array.isArray((data as { units?: unknown }).units))
}
