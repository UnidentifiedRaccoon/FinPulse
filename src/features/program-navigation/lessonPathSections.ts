import type { LessonPathItem, PathItemState, UnitPathItem } from './learningPath'

export type LessonPathSection = {
  id: string
  number: number
  title: string
  description?: string
  state: PathItemState
  firstLessonNumber: number
  completedLessons: number
  totalLessons: number
  lessons: LessonPathItem[]
}

export function buildLessonPathSections(units: UnitPathItem[]): LessonPathSection[] {
  let firstLessonNumber = 1

  return units.map((unitItem) => {
    const completedLessons = unitItem.lessons.filter((item) => item.state === 'completed').length
    const state = getSectionState(unitItem.lessons)
    const sectionFirstLessonNumber = firstLessonNumber

    firstLessonNumber += unitItem.lessons.length

    return {
      id: unitItem.unit.id,
      number: unitItem.unit.order,
      title: getSectionDisplayTitle(unitItem.unit.title),
      description: unitItem.unit.description,
      state,
      firstLessonNumber: sectionFirstLessonNumber,
      completedLessons,
      totalLessons: unitItem.lessons.length,
      lessons: unitItem.lessons,
    }
  })
}

function getSectionState(lessons: LessonPathItem[]): PathItemState {
  if (lessons.length === 0) return 'locked'
  if (lessons.every((lesson) => lesson.state === 'completed')) return 'completed'
  if (lessons.some((lesson) => lesson.state === 'current')) return 'current'
  return 'locked'
}

function getSectionDisplayTitle(title: string) {
  return title.replace(/^\s*(?:\d{2}\.\d{2}|\d{4})[\s.-]+/, '').trim() || title
}
