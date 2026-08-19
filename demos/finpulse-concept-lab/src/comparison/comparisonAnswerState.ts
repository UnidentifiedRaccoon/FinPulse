import type { ComparisonMechanic } from './comparisonMechanics'
import { mechanicPrompts } from './comparisonMechanics'

export function sameAnswerValues(left: readonly string[], right: readonly string[]) {
  if (left.length !== right.length) return false
  const expected = new Set(right)
  return left.every((value) => expected.has(value))
}

export function mechanicIsComplete(mechanic: ComparisonMechanic, answers: readonly string[][]) {
  return mechanicPrompts(mechanic).every((_, index) => (answers[index]?.length ?? 0) > 0)
}

export function mechanicIsExact(mechanic: ComparisonMechanic, answers: readonly string[][]) {
  return mechanicPrompts(mechanic).every(
    (prompt, index) => sameAnswerValues(answers[index] ?? [], prompt.expected),
  )
}
