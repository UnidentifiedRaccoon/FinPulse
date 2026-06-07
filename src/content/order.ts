import type { Lesson, Module, Program, Unit } from './program'

export function getOrderedModules(program: Program) {
  return [...program.modules].sort((a, b) => a.order - b.order)
}

export function getOrderedUnits(module: Module) {
  return [...module.units].sort((a, b) => a.order - b.order)
}

export function getOrderedLessons(unit: Unit) {
  return [...unit.lessons].sort((a, b) => a.order - b.order)
}

export function getOrderedCards(lesson: Lesson) {
  return [...lesson.cards].sort((a, b) => a.order - b.order)
}

export function getAllLessons(program: Program) {
  return getOrderedModules(program).flatMap((module) =>
    getOrderedUnits(module).flatMap((unit) =>
      getOrderedLessons(unit).map((lesson) => ({ module, unit, lesson })),
    ),
  )
}
