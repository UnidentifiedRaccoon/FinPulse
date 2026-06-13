import type { Lesson, Level, Program, Section } from './program'

export function getOrderedLevels(program: Program) {
  return [...program.levels].sort((a, b) => a.order - b.order)
}

export function getOrderedSections(level: Level) {
  return [...level.sections].sort((a, b) => a.order - b.order)
}

export function getOrderedLessons(section: Section) {
  return [...section.lessons].sort((a, b) => a.order - b.order)
}

export function getOrderedCards(lesson: Lesson) {
  return [...lesson.cards].sort((a, b) => a.order - b.order)
}

export function getAllLessons(program: Program) {
  return getOrderedLevels(program).flatMap((level) =>
    getOrderedSections(level).flatMap((section) =>
      getOrderedLessons(section).map((lesson) => ({ level, section, lesson })),
    ),
  )
}
