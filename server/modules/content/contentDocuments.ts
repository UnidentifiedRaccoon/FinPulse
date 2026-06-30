import type { QueryResultRow } from 'pg'

import {
  parseProgram,
  type Lesson,
  type Level,
  type Program,
  type Section,
} from '../../../src/content/program'

type ProgramLevelRef = Omit<Program['levels'][number], 'sections'> & {
  path: string
}

type LevelSectionRef = Omit<Level['sections'][number], 'lessons' | 'supplemental' | 'source'> & {
  path: string
}

export type LessonRef = Pick<Lesson, 'id' | 'slug' | 'title' | 'description' | 'order'>

export type ContentProgramPayload = Omit<Program, 'levels'> & {
  levels: ProgramLevelRef[]
}

export type ContentLevelPayload = Omit<Level, 'sections'> & {
  sections: LevelSectionRef[]
}

export type ContentSectionPayload = Omit<Section, 'lessons'> & {
  lessons: LessonRef[]
}

export type ContentProgramDocument = {
  slug: string
  payload: ContentProgramPayload
  revision: number
  updatedAt: string
}

export type ContentLevelDocument = {
  slug: string
  payload: ContentLevelPayload
  revision: number
  updatedAt: string
}

export type ContentSectionDocument = {
  levelSlug: string
  sectionSlug: string
  payload: ContentSectionPayload
  revision: number
  updatedAt: string
}

export type ContentLessonDocument = {
  levelSlug: string
  sectionSlug: string
  lessonSlug: string
  payload: Lesson
  revision: number
  updatedAt: string
}

export type ContentDocuments = {
  programs: ContentProgramDocument[]
  levels: ContentLevelDocument[]
  sections: ContentSectionDocument[]
  lessons: ContentLessonDocument[]
}

export class ContentConfigurationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ContentConfigurationError'
  }
}

export function hydrateProgramFromDocuments(documents: ContentDocuments): Program {
  if (documents.programs.length !== 1) {
    throw new ContentConfigurationError(`Expected exactly one content program, found ${documents.programs.length}`)
  }

  const levelBySlug = new Map(documents.levels.map((level) => [level.slug, level]))
  const sectionsByKey = new Map(documents.sections.map((section) => [sectionKey(section.levelSlug, section.sectionSlug), section]))
  const lessonsByKey = new Map(
    documents.lessons.map((lesson) => [lessonKey(lesson.levelSlug, lesson.sectionSlug, lesson.lessonSlug), lesson]),
  )
  const programDocument = documents.programs[0]
  const program = {
    ...programDocument.payload,
    levels: programDocument.payload.levels.map((levelRef) => {
      const levelDocument = levelBySlug.get(levelRef.slug)
      if (!levelDocument) {
        throw new ContentConfigurationError(`Missing content level: ${levelRef.slug}`)
      }

      return {
        ...levelDocument.payload,
        sections: levelDocument.payload.sections.map((sectionRef) => {
          const sectionDocument = sectionsByKey.get(sectionKey(levelDocument.slug, sectionRef.slug))
          if (!sectionDocument) {
            throw new ContentConfigurationError(`Missing content section: ${levelDocument.slug}/${sectionRef.slug}`)
          }

          return {
            ...sectionDocument.payload,
            lessons: sectionDocument.payload.lessons.map((lessonRef) => {
              const lessonDocument = lessonsByKey.get(lessonKey(levelDocument.slug, sectionRef.slug, lessonRef.slug))
              if (!lessonDocument) {
                throw new ContentConfigurationError(
                  `Missing content lesson: ${levelDocument.slug}/${sectionRef.slug}/${lessonRef.slug}`,
                )
              }

              return lessonDocument.payload
            }),
          }
        }),
      }
    }),
  }

  const parsed = parseProgram(program)
  if (!parsed.success) {
    throw new ContentConfigurationError(`Program content is invalid: ${parsed.error.message}`)
  }

  return parsed.data
}

export function toLessonRef(lesson: Lesson): LessonRef {
  return {
    id: lesson.id,
    slug: lesson.slug,
    title: lesson.title,
    ...(lesson.description ? { description: lesson.description } : {}),
    order: lesson.order,
  }
}

export function assertPayloadObject(value: unknown, context: string): asserts value is Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new ContentConfigurationError(`${context} payload must be an object`)
  }
}

export function rowNumber(value: string | number) {
  return typeof value === 'number' ? value : Number(value)
}

export function rowTimestamp(value: Date | string) {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString()
}

export type ContentProgramRow = QueryResultRow & {
  slug: string
  payload: ContentProgramPayload
  revision: string | number
  updated_at: Date | string
}

export type ContentLevelRow = QueryResultRow & {
  slug: string
  payload: ContentLevelPayload
  revision: string | number
  updated_at: Date | string
}

export type ContentSectionRow = QueryResultRow & {
  level_slug: string
  section_slug: string
  payload: ContentSectionPayload
  revision: string | number
  updated_at: Date | string
}

export type ContentLessonRow = QueryResultRow & {
  level_slug: string
  section_slug: string
  lesson_slug: string
  payload: Lesson
  revision: string | number
  updated_at: Date | string
}

export function toProgramDocument(row: ContentProgramRow): ContentProgramDocument {
  return {
    slug: row.slug,
    payload: row.payload,
    revision: rowNumber(row.revision),
    updatedAt: rowTimestamp(row.updated_at),
  }
}

export function toLevelDocument(row: ContentLevelRow): ContentLevelDocument {
  return {
    slug: row.slug,
    payload: row.payload,
    revision: rowNumber(row.revision),
    updatedAt: rowTimestamp(row.updated_at),
  }
}

export function toSectionDocument(row: ContentSectionRow): ContentSectionDocument {
  return {
    levelSlug: row.level_slug,
    sectionSlug: row.section_slug,
    payload: row.payload,
    revision: rowNumber(row.revision),
    updatedAt: rowTimestamp(row.updated_at),
  }
}

export function toLessonDocument(row: ContentLessonRow): ContentLessonDocument {
  return {
    levelSlug: row.level_slug,
    sectionSlug: row.section_slug,
    lessonSlug: row.lesson_slug,
    payload: row.payload,
    revision: rowNumber(row.revision),
    updatedAt: rowTimestamp(row.updated_at),
  }
}

function sectionKey(levelSlug: string, sectionSlug: string) {
  return `${levelSlug}/${sectionSlug}`
}

function lessonKey(levelSlug: string, sectionSlug: string, lessonSlug: string) {
  return `${levelSlug}/${sectionSlug}/${lessonSlug}`
}
