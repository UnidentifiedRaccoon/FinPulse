import type { Pool, QueryResultRow } from 'pg'

import { queryMany, queryOne } from './query'
import {
  toLevelDocument,
  toLessonDocument,
  toProgramDocument,
  toSectionDocument,
  type ContentDocuments,
  type ContentLevelPayload,
  type ContentLevelRow,
  type ContentLessonRow,
  type ContentProgramRow,
  type ContentSectionPayload,
  type ContentSectionRow,
} from '../modules/content/contentDocuments'
import type { Lesson } from '../../src/content/program'

type CountRow = QueryResultRow & {
  count: string | number
}

type RevisionUpdateResult<Document> =
  | {
      status: 'updated'
      document: Document
    }
  | {
      status: 'conflict'
    }

export class ContentRepository {
  private readonly pool: Pool

  constructor(pool: Pool) {
    this.pool = pool
  }

  async isEmpty() {
    const row = await queryOne<CountRow>(
      this.pool,
      `SELECT
         (SELECT count(*) FROM content_programs) +
         (SELECT count(*) FROM content_levels) +
         (SELECT count(*) FROM content_sections) +
         (SELECT count(*) FROM content_lessons) AS count`,
    )

    return Number(row?.count ?? 0) === 0
  }

  async loadDocuments(): Promise<ContentDocuments> {
    const [programRows, levelRows, sectionRows, lessonRows] = await Promise.all([
      queryMany<ContentProgramRow>(this.pool, 'SELECT slug, payload, revision, updated_at FROM content_programs ORDER BY slug'),
      queryMany<ContentLevelRow>(this.pool, 'SELECT slug, payload, revision, updated_at FROM content_levels ORDER BY (payload->>\'order\')::int, slug'),
      queryMany<ContentSectionRow>(
        this.pool,
        `SELECT level_slug, section_slug, payload, revision, updated_at
         FROM content_sections
         ORDER BY level_slug, (payload->>'order')::int, section_slug`,
      ),
      queryMany<ContentLessonRow>(
        this.pool,
        `SELECT level_slug, section_slug, lesson_slug, payload, revision, updated_at
         FROM content_lessons
         ORDER BY level_slug, section_slug, (payload->>'order')::int, lesson_slug`,
      ),
    ])

    return {
      programs: programRows.map(toProgramDocument),
      levels: levelRows.map(toLevelDocument),
      sections: sectionRows.map(toSectionDocument),
      lessons: lessonRows.map(toLessonDocument),
    }
  }

  async replaceAll(documents: ContentDocuments) {
    const client = await this.pool.connect()

    try {
      await client.query('BEGIN')
      await client.query('DELETE FROM content_lessons')
      await client.query('DELETE FROM content_sections')
      await client.query('DELETE FROM content_levels')
      await client.query('DELETE FROM content_programs')

      for (const program of documents.programs) {
        await client.query(
          `INSERT INTO content_programs (slug, payload, revision)
           VALUES ($1, $2::jsonb, 1)`,
          [program.slug, JSON.stringify(program.payload)],
        )
      }

      for (const level of documents.levels) {
        await client.query(
          `INSERT INTO content_levels (slug, payload, revision)
           VALUES ($1, $2::jsonb, 1)`,
          [level.slug, JSON.stringify(level.payload)],
        )
      }

      for (const section of documents.sections) {
        await client.query(
          `INSERT INTO content_sections (level_slug, section_slug, payload, revision)
           VALUES ($1, $2, $3::jsonb, 1)`,
          [section.levelSlug, section.sectionSlug, JSON.stringify(section.payload)],
        )
      }

      for (const lesson of documents.lessons) {
        await client.query(
          `INSERT INTO content_lessons (level_slug, section_slug, lesson_slug, payload, revision)
           VALUES ($1, $2, $3, $4::jsonb, 1)`,
          [lesson.levelSlug, lesson.sectionSlug, lesson.lessonSlug, JSON.stringify(lesson.payload)],
        )
      }

      await client.query('COMMIT')
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }

  async seedIfEmpty(documents: ContentDocuments) {
    const client = await this.pool.connect()

    try {
      await client.query('BEGIN')
      const count = await client.query<CountRow>(
        `SELECT
           (SELECT count(*) FROM content_programs) +
           (SELECT count(*) FROM content_levels) +
           (SELECT count(*) FROM content_sections) +
           (SELECT count(*) FROM content_lessons) AS count`,
      )
      if (Number(count.rows[0]?.count ?? 0) > 0) {
        await client.query('COMMIT')
        return false
      }
      await client.query('COMMIT')
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }

    await this.replaceAll(documents)
    return true
  }

  async findLevel(slug: string) {
    const row = await queryOne<ContentLevelRow>(
      this.pool,
      'SELECT slug, payload, revision, updated_at FROM content_levels WHERE slug = $1 LIMIT 1',
      [slug],
    )

    return row ? toLevelDocument(row) : null
  }

  async findSection(levelSlug: string, sectionSlug: string) {
    const row = await queryOne<ContentSectionRow>(
      this.pool,
      `SELECT level_slug, section_slug, payload, revision, updated_at
       FROM content_sections
       WHERE level_slug = $1 AND section_slug = $2
       LIMIT 1`,
      [levelSlug, sectionSlug],
    )

    return row ? toSectionDocument(row) : null
  }

  async findLesson(levelSlug: string, sectionSlug: string, lessonSlug: string) {
    const row = await queryOne<ContentLessonRow>(
      this.pool,
      `SELECT level_slug, section_slug, lesson_slug, payload, revision, updated_at
       FROM content_lessons
       WHERE level_slug = $1 AND section_slug = $2 AND lesson_slug = $3
       LIMIT 1`,
      [levelSlug, sectionSlug, lessonSlug],
    )

    return row ? toLessonDocument(row) : null
  }

  async updateLevelPayload(slug: string, revision: number, payload: ContentLevelPayload) {
    const row = await queryOne<ContentLevelRow>(
      this.pool,
      `UPDATE content_levels
       SET payload = $3::jsonb,
           revision = revision + 1,
           updated_at = now()
       WHERE slug = $1 AND revision = $2
       RETURNING slug, payload, revision, updated_at`,
      [slug, revision, JSON.stringify(payload)],
    )

    return toRevisionUpdate(row ? toLevelDocument(row) : null)
  }

  async updateSectionPayload(levelSlug: string, sectionSlug: string, revision: number, payload: ContentSectionPayload) {
    const row = await queryOne<ContentSectionRow>(
      this.pool,
      `UPDATE content_sections
       SET payload = $4::jsonb,
           revision = revision + 1,
           updated_at = now()
       WHERE level_slug = $1 AND section_slug = $2 AND revision = $3
       RETURNING level_slug, section_slug, payload, revision, updated_at`,
      [levelSlug, sectionSlug, revision, JSON.stringify(payload)],
    )

    return toRevisionUpdate(row ? toSectionDocument(row) : null)
  }

  async updateLessonPayload(levelSlug: string, sectionSlug: string, lessonSlug: string, revision: number, payload: Lesson) {
    const row = await queryOne<ContentLessonRow>(
      this.pool,
      `UPDATE content_lessons
       SET payload = $5::jsonb,
           revision = revision + 1,
           updated_at = now()
       WHERE level_slug = $1 AND section_slug = $2 AND lesson_slug = $3 AND revision = $4
       RETURNING level_slug, section_slug, lesson_slug, payload, revision, updated_at`,
      [levelSlug, sectionSlug, lessonSlug, revision, JSON.stringify(payload)],
    )

    return toRevisionUpdate(row ? toLessonDocument(row) : null)
  }
}

function toRevisionUpdate<Document>(document: Document | null): RevisionUpdateResult<Document> {
  return document ? { status: 'updated', document } : { status: 'conflict' }
}
