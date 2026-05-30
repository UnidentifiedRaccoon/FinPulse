import type { LessonPathItem, PathItemState, UnitPathItem } from './learningPath'

export type LessonPathSection = {
  id: string
  number: number
  title: string
  description?: string
  state: PathItemState
  completedLessons: number
  totalLessons: number
  lessons: LessonPathItem[]
}

export const lessonsPerVisualSection = 3

export function buildLessonPathSections(units: UnitPathItem[]): LessonPathSection[] {
  let sectionNumber = 1

  return units.flatMap((unitItem) => {
    const chunks = splitLessons(unitItem.lessons)

    return chunks.map((lessons, chunkIndex) => {
      const firstLesson = lessons[0]?.lesson
      const completedLessons = lessons.filter((item) => item.state === 'completed').length
      const state = getSectionState(lessons)

      return {
        id: `${unitItem.unit.id}-${chunkIndex + 1}`,
        number: sectionNumber++,
        title: chunkIndex === 0 ? unitItem.unit.title : (firstLesson?.title ?? unitItem.unit.title),
        description:
          chunkIndex === 0
            ? unitItem.unit.description
            : (firstLesson?.learningGoal ?? firstLesson?.description ?? unitItem.unit.description),
        state,
        completedLessons,
        totalLessons: lessons.length,
        lessons,
      }
    })
  })
}

function splitLessons(lessons: LessonPathItem[]) {
  if (lessons.length <= lessonsPerVisualSection + 1) return [lessons]

  const chunks: LessonPathItem[][] = []
  for (let index = 0; index < lessons.length; index += lessonsPerVisualSection) {
    chunks.push(lessons.slice(index, index + lessonsPerVisualSection))
  }

  return chunks
}

function getSectionState(lessons: LessonPathItem[]): PathItemState {
  if (lessons.length === 0) return 'locked'
  if (lessons.every((lesson) => lesson.state === 'completed')) return 'completed'
  if (lessons.some((lesson) => lesson.state === 'current')) return 'current'
  return 'locked'
}
