#!/usr/bin/env tsx
import { openDatabase } from '../server/db/connection'
import { hydrateProgramFromDocuments } from '../server/modules/content/contentDocuments'

const db = await openDatabase()

try {
  const documents = await db.content.loadDocuments()
  const program = hydrateProgramFromDocuments(documents)
  const totalLessons = program.levels.flatMap((level) => level.sections.flatMap((section) => section.lessons)).length
  console.log(`[content:db] OK: ${program.slug}, ${program.levels.length} level(s), ${totalLessons} lesson(s)`)
} finally {
  await db.close()
}
