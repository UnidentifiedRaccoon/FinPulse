import type { Pool, QueryResult, QueryResultRow } from 'pg'

export type QueryValues = unknown[]

type JsonPrimitive = string | number | boolean | null
export type JsonObject = {
  [key: string]: JsonValue
}
export type JsonValue = JsonPrimitive | JsonObject | JsonValue[]

export async function queryOne<Row extends QueryResultRow>(
  pool: Pool,
  text: string,
  values: QueryValues = [],
): Promise<Row | null> {
  const result = await pool.query<Row>(text, values)
  return result.rows[0] ?? null
}

export async function queryMany<Row extends QueryResultRow>(
  pool: Pool,
  text: string,
  values: QueryValues = [],
): Promise<Row[]> {
  const result: QueryResult<Row> = await pool.query<Row>(text, values)
  return result.rows
}

export function toIsoTimestamp(value: Date | string | null): string | null {
  if (value === null) return null
  if (value instanceof Date) return value.toISOString()

  return new Date(value).toISOString()
}

export function toRequiredIsoTimestamp(value: Date | string): string {
  return toIsoTimestamp(value) ?? new Date(0).toISOString()
}

export function toTimestampParam(value: Date | string): string {
  if (value instanceof Date) return value.toISOString()

  return value
}
