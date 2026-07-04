import { readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

import { parseProgram, type Lesson } from '../../../src/content/program'

import {
  hydrateProgramFromDocuments,
  toLessonRef,
  type ContentDocuments,
  type ContentLevelPayload,
  type ContentProgramPayload,
  type ContentSectionPayload,
} from './contentDocuments'

type LoadedProgramManifest = ContentProgramPayload
type LoadedLevelFile = ContentLevelPayload
type LoadedSectionFile = Omit<ContentSectionPayload, 'lessons'> & {
  lessons: Lesson[]
}

export function loadContentSeedFromFiles(contentRoot = resolve(process.cwd(), 'src/content')): ContentDocuments {
  const programPayload = readContentJson<LoadedProgramManifest>(contentRoot, 'program.json')
  const documents: ContentDocuments = {
    programs: [
      {
        slug: programPayload.slug,
        payload: programPayload,
        revision: 1,
        updatedAt: new Date(0).toISOString(),
      },
    ],
    levels: [],
    sections: [],
    lessons: [],
  }

  for (const levelRef of programPayload.levels) {
    const levelPath = normalizeContentPath(levelRef.path)
    const levelPayload = readContentJson<LoadedLevelFile>(contentRoot, levelPath)
    const levelBase = levelPath.split('/').slice(0, -1).join('/')

    documents.levels.push({
      slug: levelPayload.slug,
      payload: levelPayload,
      revision: 1,
      updatedAt: new Date(0).toISOString(),
    })

    for (const sectionRef of levelPayload.sections) {
      const sectionPath = joinContentPath(levelBase, sectionRef.path)
      const sectionFile = readContentJson<LoadedSectionFile>(contentRoot, sectionPath)
      const sectionPayload: ContentSectionPayload = {
        ...sectionFile,
        lessons: sectionFile.lessons.map(toLessonRef),
      }

      documents.sections.push({
        levelSlug: levelPayload.slug,
        sectionSlug: sectionFile.slug,
        payload: sectionPayload,
        revision: 1,
        updatedAt: new Date(0).toISOString(),
      })

      for (const lesson of sectionFile.lessons) {
        documents.lessons.push({
          levelSlug: levelPayload.slug,
          sectionSlug: sectionFile.slug,
          lessonSlug: lesson.slug,
          payload: lesson,
          revision: 1,
          updatedAt: new Date(0).toISOString(),
        })
      }
    }
  }

  const parsed = parseProgram(hydrateProgramFromDocuments(documents))
  if (!parsed.success) {
    throw new Error(`Seed content is invalid: ${parsed.error.message}`)
  }

  return documents
}

function readContentJson<T>(contentRoot: string, refPath: string): T {
  const normalizedPath = normalizeContentPath(refPath)
  const absolutePath = resolve(contentRoot, normalizedPath)
  const absoluteRoot = resolve(contentRoot)

  if (!absolutePath.startsWith(`${absoluteRoot}/`)) {
    throw new Error(`Content path escapes root: ${refPath}`)
  }

  return JSON.parse(readFileSync(absolutePath, 'utf8')) as T
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
