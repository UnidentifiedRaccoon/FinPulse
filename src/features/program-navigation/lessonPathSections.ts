import type { LessonPathItem, PathItemState, SectionPathItem } from './learningPath'

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

export function buildLessonPathSections(sections: SectionPathItem[]): LessonPathSection[] {
  let firstLessonNumber = 1

  return sections.map((sectionItem) => {
    const completedLessons = sectionItem.lessons.filter((item) => item.state === 'completed').length
    const state = getSectionState(sectionItem.lessons)
    const sectionFirstLessonNumber = firstLessonNumber

    firstLessonNumber += sectionItem.lessons.length

    return {
      id: sectionItem.section.id,
      number: sectionItem.section.order,
      title: getSectionDisplayTitle(sectionItem.section.title),
      description: sectionItem.section.description,
      state,
      firstLessonNumber: sectionFirstLessonNumber,
      completedLessons,
      totalLessons: sectionItem.lessons.length,
      lessons: sectionItem.lessons,
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
