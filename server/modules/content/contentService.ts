import { readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

import { getAllLessons, getOrderedCards, getOrderedLevels, getOrderedSections } from '../../../src/content/order'
import {
  parseProgram,
  type Card,
  type Lesson,
  type Level,
  type Program,
  type Section,
} from '../../../src/content/program'

type LoadedLevelFile = {
  sections: Array<{ path: string }>
}

export type LessonDetails = {
  level: Level
  section: Section
  lesson: Lesson
  previous: { level: Level; section: Section; lesson: Lesson } | null
  next: { level: Level; section: Section; lesson: Lesson } | null
}

export type SectionDetails = {
  level: Level
  section: Section
}

export type CardDetails = {
  level: Level
  section: Section
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
    getLevels() {
      return getOrderedLevels(program)
    },
    getLevel(levelSlug: string) {
      return getOrderedLevels(program).find((level) => level.slug === levelSlug) ?? null
    },
    getSection(sectionSlug: string): SectionDetails | null {
      return getSectionFromProgram(program, sectionSlug)
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
    getCardDetails(cardId: string): CardDetails | null {
      return getCardDetailsFromProgram(program, cardId)
    },
  }
}

function getSectionFromProgram(program: Program, sectionSlug: string): SectionDetails | null {
  for (const level of getOrderedLevels(program)) {
    const section = getOrderedSections(level).find((candidate) => candidate.slug === sectionSlug)
    if (section) return { level, section }
  }

  return null
}

function getCardDetailsFromProgram(program: Program, cardId: string): CardDetails | null {
  for (const { level, section, lesson } of getAllLessons(program)) {
    const card = getOrderedCards(lesson).find((candidate) => candidate.id === cardId)
    if (card) return { level, section, lesson, card }
  }

  return null
}

function loadProgramFromFiles(contentRoot: string): Program {
  const programManifest = readContentJson(contentRoot, 'program.json')

  if (!isObjectWithLevels(programManifest)) {
    throw new Error('Program manifest is missing levels')
  }

  const hydratedProgram = {
    ...programManifest,
    levels: programManifest.levels.map((levelRef) => {
      const levelPath = normalizeContentPath(levelRef.path)
      const levelFile = readContentJson(contentRoot, levelPath)

      if (!isObjectWithSections(levelFile)) {
        throw new Error(`Level file is missing sections: ${levelPath}`)
      }

      const levelBase = levelPath.split('/').slice(0, -1).join('/')

      return {
        ...levelFile,
        sections: levelFile.sections.map((sectionRef) => {
          const sectionPath = joinContentPath(levelBase, sectionRef.path)
          return readContentJson(contentRoot, sectionPath)
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

function isObjectWithLevels(data: unknown): data is { levels: Array<{ path: string }> } {
  return Boolean(data && typeof data === 'object' && !Array.isArray(data) && Array.isArray((data as { levels?: unknown }).levels))
}

function isObjectWithSections(data: unknown): data is LoadedLevelFile {
  return Boolean(data && typeof data === 'object' && !Array.isArray(data) && Array.isArray((data as { sections?: unknown }).sections))
}
