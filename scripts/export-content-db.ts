#!/usr/bin/env tsx
import { mkdir, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'

import { openDatabase } from '../server/db/connection'
const outDir = resolve(process.cwd(), process.argv[2] ?? 'tmp/content-db-export')
const db = await openDatabase()

try {
  const documents = await db.content.loadDocuments()

  await mkdir(outDir, { recursive: true })
  const program = documents.programs[0]
  if (!program) {
    throw new Error('DB content has no program document')
  }
  await writeJson(join(outDir, 'program.json'), program.payload)

  for (const level of documents.levels) {
    const levelDir = join(outDir, 'levels', level.slug)
    await mkdir(join(levelDir, 'sections'), { recursive: true })
    await writeJson(join(levelDir, 'level.json'), level.payload)

    for (const section of documents.sections.filter((candidate) => candidate.levelSlug === level.slug)) {
      const lessons = documents.lessons
        .filter((lesson) => lesson.levelSlug === section.levelSlug && lesson.sectionSlug === section.sectionSlug)
        .toSorted((left, right) => left.payload.order - right.payload.order)
        .map((lesson) => lesson.payload)
      await writeJson(join(levelDir, 'sections', `${section.sectionSlug}.json`), {
        ...section.payload,
        lessons,
      })
    }
  }

  console.log(`[content:pull] Exported current DB content to ${outDir}`)
} finally {
  await db.close()
}

async function writeJson(path: string, value: unknown) {
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
}
