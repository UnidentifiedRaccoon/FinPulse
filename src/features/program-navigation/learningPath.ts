import type { ProgressResponse } from '@/api/client'
import { getOrderedLessons, getOrderedLevels, getOrderedSections } from '@/content/order'
import {
  type Level,
  type Lesson,
  type Program,
  type Section,
} from '@/content/program'

export type PathItemState = 'completed' | 'current' | 'locked'

export type LessonPathItem = {
  level: Level
  section: Section
  lesson: Lesson
  state: PathItemState
}

export type SectionPathItem = {
  level: Level
  section: Section
  lessons: LessonPathItem[]
  state: PathItemState
  completedLessons: number
  totalLessons: number
}

export type LevelPathItem = {
  level: Level
  sections: SectionPathItem[]
  state: PathItemState
  completedLessons: number
  totalLessons: number
}

export type LearningPath = {
  levels: LevelPathItem[]
  currentLesson: LessonPathItem | null
  completedLessons: number
  totalLessons: number
  isComplete: boolean
}

export function buildProgramLearningPath(program: Program, progress: ProgressResponse | null): LearningPath {
  const levels = getOrderedLevels(program)
  return buildLearningPath(levels, progress)
}

export function buildLevelLearningPath(level: Level, progress: ProgressResponse | null): LearningPath {
  return buildLearningPath([level], progress)
}

export function buildSectionLearningPath(level: Level, section: Section, progress: ProgressResponse | null): LearningPath {
  return buildLearningPath([{ ...level, sections: [section] }], progress)
}

export function getProgressPercent(completedLessons: number, totalLessons: number) {
  if (totalLessons <= 0) return 0
  return Math.round((completedLessons / totalLessons) * 100)
}

function buildLearningPath(levels: Level[], progress: ProgressResponse | null): LearningPath {
  const completedSlugs = new Set(
    progress?.lessons
      .filter((lessonProgress) => lessonProgress.completed)
      .map((lessonProgress) => lessonProgress.lessonSlug) ?? [],
  )
  const orderedLessons = levels.flatMap((level) =>
    getOrderedSections(level).flatMap((section) =>
      getOrderedLessons(section).map((lesson) => ({
        level,
        section,
        lesson,
      })),
    ),
  )
  const currentLessonSlug = orderedLessons.find(({ lesson }) => !completedSlugs.has(lesson.slug))?.lesson.slug ?? null

  const lessonStateBySlug = new Map<string, PathItemState>()
  for (const { lesson } of orderedLessons) {
    lessonStateBySlug.set(lesson.slug, getLessonState(lesson, currentLessonSlug, completedSlugs))
  }

  const pathLevels = levels.map((level) => {
    const sections = getOrderedSections(level).map((section) => {
      const lessons = getOrderedLessons(section).map((lesson) => ({
        level,
        section,
        lesson,
        state: lessonStateBySlug.get(lesson.slug) ?? 'locked',
      }))
      const completedLessons = lessons.filter((item) => item.state === 'completed').length

      return {
        level,
        section,
        lessons,
        state: getParentState(lessons),
        completedLessons,
        totalLessons: lessons.length,
      }
    })
    const completedLessons = sections.reduce((sum, section) => sum + section.completedLessons, 0)
    const totalLessons = sections.reduce((sum, section) => sum + section.totalLessons, 0)

    return {
      level,
      sections,
      state: getParentState(sections),
      completedLessons,
      totalLessons,
    }
  })
  const currentLesson = findCurrentLesson(pathLevels)
  const completedLessons = orderedLessons.filter(({ lesson }) => completedSlugs.has(lesson.slug)).length

  return {
    levels: pathLevels,
    currentLesson,
    completedLessons,
    totalLessons: orderedLessons.length,
    isComplete: orderedLessons.length > 0 && completedLessons === orderedLessons.length,
  }
}

function getLessonState(
  lesson: Lesson,
  currentLessonSlug: string | null,
  completedSlugs: ReadonlySet<string>,
): PathItemState {
  if (completedSlugs.has(lesson.slug)) return 'completed'
  if (lesson.slug === currentLessonSlug) return 'current'
  return 'locked'
}

function getParentState(items: Array<{ state: PathItemState }>): PathItemState {
  if (items.length === 0) return 'locked'
  if (items.every((item) => item.state === 'completed')) return 'completed'
  if (items.some((item) => item.state === 'current')) return 'current'
  return 'locked'
}

function findCurrentLesson(levels: LevelPathItem[]) {
  for (const level of levels) {
    for (const section of level.sections) {
      const currentLesson = section.lessons.find((lesson) => lesson.state === 'current')
      if (currentLesson) return currentLesson
    }
  }

  return null
}
