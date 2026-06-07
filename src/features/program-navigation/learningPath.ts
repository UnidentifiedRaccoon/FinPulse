import type { ProgressResponse } from '@/api/client'
import { getOrderedLessons, getOrderedModules, getOrderedUnits } from '@/content/order'
import {
  type Lesson,
  type Module,
  type Program,
  type Unit,
} from '@/content/program'

export type PathItemState = 'completed' | 'current' | 'locked'

export type LessonPathItem = {
  module: Module
  unit: Unit
  lesson: Lesson
  state: PathItemState
}

export type UnitPathItem = {
  module: Module
  unit: Unit
  lessons: LessonPathItem[]
  state: PathItemState
  completedLessons: number
  totalLessons: number
}

export type ModulePathItem = {
  module: Module
  units: UnitPathItem[]
  state: PathItemState
  completedLessons: number
  totalLessons: number
}

export type LearningPath = {
  modules: ModulePathItem[]
  currentLesson: LessonPathItem | null
  completedLessons: number
  totalLessons: number
  isComplete: boolean
}

export function buildProgramLearningPath(program: Program, progress: ProgressResponse | null): LearningPath {
  const modules = getOrderedModules(program)
  return buildLearningPath(modules, progress)
}

export function buildModuleLearningPath(module: Module, progress: ProgressResponse | null): LearningPath {
  return buildLearningPath([module], progress)
}

export function buildUnitLearningPath(module: Module, unit: Unit, progress: ProgressResponse | null): LearningPath {
  return buildLearningPath([{ ...module, units: [unit] }], progress)
}

export function getProgressPercent(completedLessons: number, totalLessons: number) {
  if (totalLessons <= 0) return 0
  return Math.round((completedLessons / totalLessons) * 100)
}

function buildLearningPath(modules: Module[], progress: ProgressResponse | null): LearningPath {
  const completedSlugs = new Set(
    progress?.lessons
      .filter((lessonProgress) => lessonProgress.completed)
      .map((lessonProgress) => lessonProgress.lessonSlug) ?? [],
  )
  const orderedLessons = modules.flatMap((module) =>
    getOrderedUnits(module).flatMap((unit) =>
      getOrderedLessons(unit).map((lesson) => ({
        module,
        unit,
        lesson,
      })),
    ),
  )
  const currentLessonSlug = orderedLessons.find(({ lesson }) => !completedSlugs.has(lesson.slug))?.lesson.slug ?? null

  const lessonStateBySlug = new Map<string, PathItemState>()
  for (const { lesson } of orderedLessons) {
    lessonStateBySlug.set(lesson.slug, getLessonState(lesson, currentLessonSlug, completedSlugs))
  }

  const pathModules = modules.map((module) => {
    const units = getOrderedUnits(module).map((unit) => {
      const lessons = getOrderedLessons(unit).map((lesson) => ({
        module,
        unit,
        lesson,
        state: lessonStateBySlug.get(lesson.slug) ?? 'locked',
      }))
      const completedLessons = lessons.filter((item) => item.state === 'completed').length

      return {
        module,
        unit,
        lessons,
        state: getParentState(lessons),
        completedLessons,
        totalLessons: lessons.length,
      }
    })
    const completedLessons = units.reduce((sum, unit) => sum + unit.completedLessons, 0)
    const totalLessons = units.reduce((sum, unit) => sum + unit.totalLessons, 0)

    return {
      module,
      units,
      state: getParentState(units),
      completedLessons,
      totalLessons,
    }
  })
  const currentLesson = findCurrentLesson(pathModules)
  const completedLessons = orderedLessons.filter(({ lesson }) => completedSlugs.has(lesson.slug)).length

  return {
    modules: pathModules,
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

function findCurrentLesson(modules: ModulePathItem[]) {
  for (const module of modules) {
    for (const unit of module.units) {
      const currentLesson = unit.lessons.find((lesson) => lesson.state === 'current')
      if (currentLesson) return currentLesson
    }
  }

  return null
}
