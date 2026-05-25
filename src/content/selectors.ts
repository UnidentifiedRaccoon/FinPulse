import {
  getAllLessons,
  getOrderedLessons,
  getOrderedModules,
  getOrderedUnits,
  type Lesson,
  type Module,
  type Program,
  type Unit,
} from './program'

export function findModuleBySlug(program: Program, moduleSlug: string | undefined) {
  return getOrderedModules(program).find((module) => module.slug === moduleSlug)
}

export function findUnitBySlug(module: Module, unitSlug: string | undefined) {
  return getOrderedUnits(module).find((unit) => unit.slug === unitSlug)
}

export function findLessonBySlug(program: Program, lessonSlug: string | undefined) {
  return getAllLessons(program).find(({ lesson }) => lesson.slug === lessonSlug)
}

export function getLessonNavigation(program: Program, lesson: Lesson) {
  const lessons = getAllLessons(program)
  const currentIndex = lessons.findIndex((item) => item.lesson.id === lesson.id)

  return {
    previous: currentIndex > 0 ? lessons[currentIndex - 1] : null,
    next: currentIndex >= 0 ? lessons[currentIndex + 1] : null,
  }
}

export function getUnitLessonCount(unit: Unit) {
  return getOrderedLessons(unit).length
}
