#!/usr/bin/env tsx
import { resolve } from 'node:path'

import { openDatabase } from '../server/db/connection'
import { loadContentSeedFromFiles } from '../server/modules/content/fileContentSeed'

const contentRoot = resolve(process.cwd(), process.env.FINPULSE_CONTENT_ROOT ?? 'src/content')
const db = await openDatabase()

try {
  const seed = loadContentSeedFromFiles(contentRoot)
  await db.content.replaceAll(seed)
  console.log(
    `[content:seed] Seeded ${seed.programs.length} program(s), ${seed.levels.length} level(s), ${seed.sections.length} section(s), ${seed.lessons.length} lesson(s) from ${contentRoot}`,
  )
} finally {
  await db.close()
}
