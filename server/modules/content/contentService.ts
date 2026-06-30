import { resolve } from 'node:path'

import { getAllLessons, getOrderedCards, getOrderedLevels, getOrderedSections } from '../../../src/content/order'
import type { Card, Lesson, Level, Program, Section } from '../../../src/content/program'
import type { ContentRepository } from '../../db/contentRepository'

import {
  ContentConfigurationError,
  hydrateProgramFromDocuments,
  type ContentDocuments,
  type ContentLevelDocument,
  type ContentSectionDocument,
  type ContentLessonDocument,
} from './contentDocuments'
import { loadContentSeedFromFiles } from './fileContentSeed'

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

export type LearningCatalogLesson = {
  levelSlug: string
  levelTitle: string
  sectionSlug: string
  sectionTitle: string
  lessonSlug: string
  lessonTitle: string
  lessonOrder: number
  cardCount: number
  cards: Array<{
    cardId: string
    cardType: Card['type']
    cardTitle: string | null
    order: number
  }>
}

export type ContentTree = {
  program: {
    slug: string
    title: string
  }
  levels: Array<{
    slug: string
    title: string
    revision: number
    sections: Array<{
      slug: string
      title: string
      revision: number
      lessons: Array<{
        slug: string
        title: string
        revision: number
        cards: Array<{
          id: string
          type: Card['type']
          title: string | null
          order: number
        }>
      }>
    }>
  }>
}

export type ContentPreview =
  | {
      kind: 'level'
      revision: number
      slice: EditableMetadataSlice
      preview: {
        level: Level
      }
    }
  | {
      kind: 'section'
      revision: number
      slice: EditableMetadataSlice
      preview: {
        level: Level
        section: Section
      }
    }
  | {
      kind: 'card'
      revision: number
      slice: Card
      preview: {
        details: LessonDetails
        card: Card
      }
    }

export type ContentPreviewInput =
  | {
      kind: 'level'
      levelSlug: string
    }
  | {
      kind: 'section'
      levelSlug: string
      sectionSlug: string
    }
  | {
      kind: 'card'
      levelSlug: string
      sectionSlug: string
      lessonSlug: string
      cardId: string
    }

export type ContentUpdateInput = ContentPreviewInput & {
  revision: number
  slice: unknown
}

export type ContentUpdateResult =
  | {
      status: 'updated'
      preview: ContentPreview
    }
  | {
      status: 'conflict'
    }

type EditableMetadataSlice = {
  title: string
  description?: string
}

export type ContentService = Awaited<ReturnType<typeof createContentService>>

export async function createContentService(
  repository: ContentRepository,
  contentRoot = resolve(process.cwd(), 'src/content'),
) {
  if (await repository.isEmpty()) {
    await repository.seedIfEmpty(loadContentSeedFromFiles(contentRoot))
  }

  const service = new DatabaseContentService(repository)
  await service.refresh()
  return service
}

class DatabaseContentService {
  private program: Program | null = null
  private documents: ContentDocuments | null = null
  private readonly repository: ContentRepository

  constructor(repository: ContentRepository) {
    this.repository = repository
  }

  async refresh() {
    const documents = await this.repository.loadDocuments()
    this.program = hydrateProgramFromDocuments(documents)
    this.documents = documents
  }

  getProgram() {
    return this.requireProgram()
  }

  getLevels() {
    return getOrderedLevels(this.requireProgram())
  }

  getLevel(levelSlug: string) {
    return getOrderedLevels(this.requireProgram()).find((level) => level.slug === levelSlug) ?? null
  }

  getSection(sectionSlug: string): SectionDetails | null {
    return getSectionFromProgram(this.requireProgram(), sectionSlug)
  }

  getLesson(lessonSlug: string): LessonDetails | null {
    const lessons = getAllLessons(this.requireProgram())
    const currentIndex = lessons.findIndex(({ lesson }) => lesson.slug === lessonSlug)
    if (currentIndex < 0) return null

    return {
      ...lessons[currentIndex],
      previous: currentIndex > 0 ? lessons[currentIndex - 1] : null,
      next: currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null,
    }
  }

  hasLesson(lessonSlug: string) {
    return getAllLessons(this.requireProgram()).some(({ lesson }) => lesson.slug === lessonSlug)
  }

  hasCard(cardId: string) {
    return getCardDetailsFromProgram(this.requireProgram(), cardId) !== null
  }

  getCardDetails(cardId: string): CardDetails | null {
    return getCardDetailsFromProgram(this.requireProgram(), cardId)
  }

  getLearningCatalog(): LearningCatalogLesson[] {
    return getAllLessons(this.requireProgram()).map(({ level, section, lesson }) => ({
      levelSlug: level.slug,
      levelTitle: level.title,
      sectionSlug: section.slug,
      sectionTitle: section.title,
      lessonSlug: lesson.slug,
      lessonTitle: lesson.title,
      lessonOrder: lesson.order,
      cardCount: lesson.cards.length,
      cards: getOrderedCards(lesson).map((card) => ({
        cardId: card.id,
        cardType: card.type,
        cardTitle: 'title' in card && typeof card.title === 'string' ? card.title : null,
        order: card.order,
      })),
    }))
  }

  getContentTree(): ContentTree {
    const documents = this.requireDocuments()
    const program = this.requireProgram()
    const levelRevisions = new Map(documents.levels.map((level) => [level.slug, level.revision]))
    const sectionRevisions = new Map(documents.sections.map((section) => [`${section.levelSlug}/${section.sectionSlug}`, section.revision]))
    const lessonRevisions = new Map(
      documents.lessons.map((lesson) => [`${lesson.levelSlug}/${lesson.sectionSlug}/${lesson.lessonSlug}`, lesson.revision]),
    )

    return {
      program: {
        slug: program.slug,
        title: program.title,
      },
      levels: getOrderedLevels(program).map((level) => ({
        slug: level.slug,
        title: level.title,
        revision: levelRevisions.get(level.slug) ?? 0,
        sections: getOrderedSections(level).map((section) => ({
          slug: section.slug,
          title: section.title,
          revision: sectionRevisions.get(`${level.slug}/${section.slug}`) ?? 0,
          lessons: section.lessons
            .toSorted((left, right) => left.order - right.order)
            .map((lesson) => ({
              slug: lesson.slug,
              title: lesson.title,
              revision: lessonRevisions.get(`${level.slug}/${section.slug}/${lesson.slug}`) ?? 0,
              cards: getOrderedCards(lesson).map((card) => ({
                id: card.id,
                type: card.type,
                title: 'title' in card && typeof card.title === 'string' ? card.title : null,
                order: card.order,
              })),
            })),
        })),
      })),
    }
  }

  getContentPreview(input: ContentPreviewInput): ContentPreview | null {
    if (input.kind === 'level') {
      const levelDocument = this.findLevelDocument(input.levelSlug)
      const level = this.getLevel(input.levelSlug)
      if (!levelDocument || !level) return null

      return {
        kind: 'level',
        revision: levelDocument.revision,
        slice: toMetadataSlice(levelDocument.payload),
        preview: { level },
      }
    }

    if (input.kind === 'section') {
      const sectionDocument = this.findSectionDocument(input.levelSlug, input.sectionSlug)
      const sectionDetails = this.getSection(input.sectionSlug)
      if (!sectionDocument || !sectionDetails || sectionDetails.level.slug !== input.levelSlug) return null

      return {
        kind: 'section',
        revision: sectionDocument.revision,
        slice: toMetadataSlice(sectionDocument.payload),
        preview: sectionDetails,
      }
    }

    const lessonDocument = this.findLessonDocument(input.levelSlug, input.sectionSlug, input.lessonSlug)
    const details = this.getLesson(input.lessonSlug)
    const card = details?.lesson.cards.find((candidate) => candidate.id === input.cardId) ?? null
    if (!lessonDocument || !details || details.level.slug !== input.levelSlug || details.section.slug !== input.sectionSlug || !card) {
      return null
    }

    return {
      kind: 'card',
      revision: lessonDocument.revision,
      slice: structuredClone(card),
      preview: {
        details,
        card,
      },
    }
  }

  async updateContentSlice(input: ContentUpdateInput): Promise<ContentUpdateResult | null> {
    if (input.kind === 'level') {
      const current = await this.repository.findLevel(input.levelSlug)
      if (!current) return null
      const slice = parseMetadataSlice(input.slice)
      const nextPayload = {
        ...current.payload,
        ...slice,
      }
      const documents = replaceLevelDocument(this.requireDocuments(), {
        ...current,
        payload: nextPayload,
      })
      hydrateProgramFromDocuments(documents)

      const result = await this.repository.updateLevelPayload(current.slug, input.revision, nextPayload)
      if (result.status === 'conflict') return result
      await this.refresh()
      return {
        status: 'updated',
        preview: this.getContentPreview(input) as ContentPreview,
      }
    }

    if (input.kind === 'section') {
      const current = await this.repository.findSection(input.levelSlug, input.sectionSlug)
      if (!current) return null
      const slice = parseMetadataSlice(input.slice)
      const nextPayload = {
        ...current.payload,
        ...slice,
      }
      const documents = replaceSectionDocument(this.requireDocuments(), {
        ...current,
        payload: nextPayload,
      })
      hydrateProgramFromDocuments(documents)

      const result = await this.repository.updateSectionPayload(
        current.levelSlug,
        current.sectionSlug,
        input.revision,
        nextPayload,
      )
      if (result.status === 'conflict') return result
      await this.refresh()
      return {
        status: 'updated',
        preview: this.getContentPreview(input) as ContentPreview,
      }
    }

    const current = await this.repository.findLesson(input.levelSlug, input.sectionSlug, input.lessonSlug)
    if (!current) return null
    const cardIndex = current.payload.cards.findIndex((card) => card.id === input.cardId)
    if (cardIndex < 0) return null
    const currentCard = current.payload.cards[cardIndex]
    const nextCard = parseCardSlice(input.slice)
    assertEditableOnlyChange(currentCard, nextCard, 'card')

    const nextLesson = structuredClone(current.payload)
    nextLesson.cards = nextLesson.cards.map((card, index) => (index === cardIndex ? nextCard : card))
    const documents = replaceLessonDocument(this.requireDocuments(), {
      ...current,
      payload: nextLesson,
    })
    hydrateProgramFromDocuments(documents)

    const result = await this.repository.updateLessonPayload(
      current.levelSlug,
      current.sectionSlug,
      current.lessonSlug,
      input.revision,
      nextLesson,
    )
    if (result.status === 'conflict') return result
    await this.refresh()
    return {
      status: 'updated',
      preview: this.getContentPreview(input) as ContentPreview,
    }
  }

  private requireProgram() {
    if (!this.program) {
      throw new ContentConfigurationError('Content service is not initialized')
    }

    return this.program
  }

  private requireDocuments() {
    if (!this.documents) {
      throw new ContentConfigurationError('Content service is not initialized')
    }

    return this.documents
  }

  private findLevelDocument(levelSlug: string) {
    return this.requireDocuments().levels.find((level) => level.slug === levelSlug) ?? null
  }

  private findSectionDocument(levelSlug: string, sectionSlug: string) {
    return (
      this.requireDocuments().sections.find(
        (section) => section.levelSlug === levelSlug && section.sectionSlug === sectionSlug,
      ) ?? null
    )
  }

  private findLessonDocument(levelSlug: string, sectionSlug: string, lessonSlug: string) {
    return (
      this.requireDocuments().lessons.find(
        (lesson) => lesson.levelSlug === levelSlug && lesson.sectionSlug === sectionSlug && lesson.lessonSlug === lessonSlug,
      ) ?? null
    )
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

function toMetadataSlice(payload: { title: string; description?: string }): EditableMetadataSlice {
  return {
    title: payload.title,
    ...(payload.description ? { description: payload.description } : {}),
  }
}

function parseMetadataSlice(value: unknown): EditableMetadataSlice {
  if (!isRecord(value) || typeof value.title !== 'string') {
    throw new ContentConfigurationError('Editable metadata slice must include a title string')
  }

  if ('description' in value && value.description !== undefined && typeof value.description !== 'string') {
    throw new ContentConfigurationError('Editable metadata description must be a string')
  }

  return {
    title: value.title,
    ...(typeof value.description === 'string' ? { description: value.description } : {}),
  }
}

function parseCardSlice(value: unknown): Card {
  if (!isRecord(value)) {
    throw new ContentConfigurationError('Card slice must be a JSON object')
  }

  return value as Card
}

function assertEditableOnlyChange(previous: unknown, next: unknown, path: string) {
  if (typeof previous === 'string' && typeof next === 'string') {
    if (isProtectedPath(path) && previous !== next) {
      throw new ContentConfigurationError(`${path} is protected and cannot be edited`)
    }
    return
  }

  if (Array.isArray(previous) && Array.isArray(next)) {
    const isStringArray = previous.every((item) => typeof item === 'string') && next.every((item) => typeof item === 'string')
    if (isStringArray) return
    if (previous.length !== next.length) {
      throw new ContentConfigurationError(`${path} cannot change array length`)
    }
    previous.forEach((previousItem, index) => assertEditableOnlyChange(previousItem, next[index], `${path}[${index}]`))
    return
  }

  if (isRecord(previous) && isRecord(next)) {
    const previousKeys = Object.keys(previous).toSorted()
    const nextKeys = Object.keys(next).toSorted()
    if (previousKeys.join('\u0000') !== nextKeys.join('\u0000')) {
      throw new ContentConfigurationError(`${path} cannot add or remove fields`)
    }
    for (const key of previousKeys) {
      assertEditableOnlyChange(previous[key], next[key], `${path}.${key}`)
    }
    return
  }

  if (previous !== next) {
    throw new ContentConfigurationError(`${path} is not an editable text field`)
  }
}

function isProtectedPath(path: string) {
  const lastSegment = path.split('.').at(-1)?.replace(/\[\d+\]$/u, '')
  return ['id', 'slug', 'type', 'order', 'sourceSection', 'checkability', 'correctOptionId', 'correctCategoryId'].includes(
    lastSegment ?? '',
  )
}

function replaceLevelDocument(documents: ContentDocuments, replacement: ContentLevelDocument): ContentDocuments {
  return {
    ...documents,
    levels: documents.levels.map((level) => (level.slug === replacement.slug ? replacement : level)),
  }
}

function replaceSectionDocument(documents: ContentDocuments, replacement: ContentSectionDocument): ContentDocuments {
  return {
    ...documents,
    sections: documents.sections.map((section) =>
      section.levelSlug === replacement.levelSlug && section.sectionSlug === replacement.sectionSlug ? replacement : section,
    ),
  }
}

function replaceLessonDocument(documents: ContentDocuments, replacement: ContentLessonDocument): ContentDocuments {
  return {
    ...documents,
    lessons: documents.lessons.map((lesson) =>
      lesson.levelSlug === replacement.levelSlug &&
      lesson.sectionSlug === replacement.sectionSlug &&
      lesson.lessonSlug === replacement.lessonSlug
        ? replacement
        : lesson,
    ),
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value))
}
