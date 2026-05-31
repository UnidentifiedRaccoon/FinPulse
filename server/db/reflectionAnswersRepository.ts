import type { Pool, QueryResultRow } from 'pg'

import {
  type JsonObject,
  type JsonValue,
  queryMany,
  toRequiredIsoTimestamp,
  toTimestampParam,
} from './query'

export type ReflectionCardType = 'reflection' | 'artifact'

export type ReflectionAnswerUpsert = {
  userId: string
  cardId: string
  saveKey: string | null
  lessonSlug: string
  moduleSlug: string
  unitSlug: string
  cardType: ReflectionCardType
  title: string | null
  prompt: string
  contextTitle: string
  sourceSection: string | null
  moduleTitle: string
  unitTitle: string
  lessonTitle: string
  answer: JsonObject
  updatedAt?: Date | string
}

export type ReflectionAnswerEntry = {
  cardId: string
  saveKey: string | null
  lessonSlug: string
  moduleSlug: string
  unitSlug: string
  cardType: ReflectionCardType
  cardTitle: string | null
  prompt: string
  template: string[] | null
  contextTitle: string
  sourceSection: string | null
  moduleTitle: string
  unitTitle: string
  lessonTitle: string
  answer: JsonObject
  createdAt: string
  updatedAt: string
}

type ReflectionAnswerRow = QueryResultRow & {
  card_id: string
  save_key: string | null
  lesson_slug: string
  module_slug: string
  unit_slug: string
  card_type: ReflectionCardType
  title: string | null
  prompt: string
  context_title: string
  source_section: string | null
  module_title: string
  unit_title: string
  lesson_title: string
  answer_json: JsonValue | string
  created_at: Date | string
  updated_at: Date | string
}

export class ReflectionAnswersRepository {
  private readonly pool: Pool

  constructor(pool: Pool) {
    this.pool = pool
  }

  async listReflectionAnswers(userId: string): Promise<ReflectionAnswerEntry[]> {
    const rows = await queryMany<ReflectionAnswerRow>(
      this.pool,
      `SELECT card_id,
              save_key,
              lesson_slug,
              module_slug,
              unit_slug,
              card_type,
              title,
              prompt,
              context_title,
              source_section,
              module_title,
              unit_title,
              lesson_title,
              answer_json,
              created_at,
              updated_at
       FROM reflection_answers
       WHERE user_id = $1::uuid
       ORDER BY updated_at DESC, card_id ASC`,
      [userId],
    )

    return rows.map(toReflectionAnswerEntry)
  }

  async upsertReflectionAnswer(input: ReflectionAnswerUpsert): Promise<void> {
    const updatedAt = toTimestampParam(input.updatedAt ?? new Date())

    await this.pool.query(
      `INSERT INTO reflection_answers (
         user_id,
         card_id,
         save_key,
         lesson_slug,
         module_slug,
         unit_slug,
         card_type,
         title,
         prompt,
         context_title,
         source_section,
         module_title,
         unit_title,
         lesson_title,
         answer_json,
         created_at,
         updated_at
       )
       VALUES (
         $1::uuid,
         $2,
         $3,
         $4,
         $5,
         $6,
         $7,
         $8,
         $9,
         $10,
         $11,
         $12,
         $13,
         $14,
         $15::jsonb,
         $16::timestamptz,
         $16::timestamptz
       )
       ON CONFLICT (user_id, card_id)
       DO UPDATE SET save_key = excluded.save_key,
                     lesson_slug = excluded.lesson_slug,
                     module_slug = excluded.module_slug,
                     unit_slug = excluded.unit_slug,
                     card_type = excluded.card_type,
                     title = excluded.title,
                     prompt = excluded.prompt,
                     context_title = excluded.context_title,
                     source_section = excluded.source_section,
                     module_title = excluded.module_title,
                     unit_title = excluded.unit_title,
                     lesson_title = excluded.lesson_title,
                     answer_json = excluded.answer_json,
                     updated_at = excluded.updated_at`,
      [
        input.userId,
        input.cardId,
        input.saveKey,
        input.lessonSlug,
        input.moduleSlug,
        input.unitSlug,
        input.cardType,
        input.title,
        input.prompt,
        input.contextTitle,
        input.sourceSection,
        input.moduleTitle,
        input.unitTitle,
        input.lessonTitle,
        JSON.stringify(input.answer),
        updatedAt,
      ],
    )
  }
}

function toReflectionAnswerEntry(row: ReflectionAnswerRow): ReflectionAnswerEntry {
  return {
    cardId: row.card_id,
    saveKey: row.save_key,
    lessonSlug: row.lesson_slug,
    moduleSlug: row.module_slug,
    unitSlug: row.unit_slug,
    cardType: row.card_type,
    cardTitle: row.title,
    prompt: row.prompt,
    template: null,
    contextTitle: row.context_title,
    sourceSection: row.source_section,
    moduleTitle: row.module_title,
    unitTitle: row.unit_title,
    lessonTitle: row.lesson_title,
    answer: toJsonObject(row.answer_json),
    createdAt: toRequiredIsoTimestamp(row.created_at),
    updatedAt: toRequiredIsoTimestamp(row.updated_at),
  }
}

function toJsonObject(value: JsonValue | string): JsonObject {
  const parsed = typeof value === 'string' ? (JSON.parse(value) as JsonValue) : value

  if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
    return parsed
  }

  throw new Error('Expected reflection answer payload to be a JSON object')
}
