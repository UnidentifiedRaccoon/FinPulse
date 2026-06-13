import { describe, expect, it } from 'vitest'

import type { ProgressResponse } from '@/api/client'
import type { Lesson, Level, Program, Section } from '@/content/program'

import { buildProgramLearningPath } from './learningPath'

describe('buildProgramLearningPath', () => {
  it('marks the first incomplete lesson as current and later lessons as locked', () => {
    const path = buildProgramLearningPath(createProgram(), null)

    expect(path.currentLesson?.lesson.slug).toBe('lesson-one')
    expect(path.levels[0].state).toBe('current')
    expect(path.levels[0].sections[0].lessons.map((lesson) => lesson.state)).toEqual(['current', 'locked', 'locked'])
  })

  it('advances current lesson from completed progress markers', () => {
    const path = buildProgramLearningPath(createProgram(), createProgress(['lesson-one']))

    expect(path.completedLessons).toBe(1)
    expect(path.currentLesson?.lesson.slug).toBe('lesson-two')
    expect(path.levels[0].sections[0].lessons.map((lesson) => lesson.state)).toEqual(['completed', 'current', 'locked'])
  })

  it('treats non-contiguous completions as completed before current precedence', () => {
    const path = buildProgramLearningPath(createProgram(), createProgress(['lesson-two']))

    expect(path.currentLesson?.lesson.slug).toBe('lesson-one')
    expect(path.levels[0].sections[0].lessons.map((lesson) => lesson.state)).toEqual(['current', 'completed', 'locked'])
  })

  it('marks the path complete when every lesson is complete', () => {
    const path = buildProgramLearningPath(createProgram(), createProgress(['lesson-one', 'lesson-two', 'lesson-three']))

    expect(path.isComplete).toBe(true)
    expect(path.currentLesson).toBeNull()
    expect(path.levels[0].state).toBe('completed')
  })
})

function createProgram(): Program {
  const lessons: Lesson[] = ['one', 'two', 'three'].map((slugPart, index) => ({
    id: `lesson-${slugPart}`,
    slug: `lesson-${slugPart}`,
    title: `Lesson ${index + 1}`,
    order: index + 1,
    cards: [
      {
        id: `card-${slugPart}`,
        type: 'theory',
        order: 1,
        body: 'Text',
      },
    ],
  }))
  const section: Section = {
    schemaVersion: 1,
    id: 'section-one',
    slug: 'section-one',
    title: 'Section One',
    order: 1,
    source: 'test',
    lessons,
  }
  const level: Level = {
    schemaVersion: 1,
    id: 'level-one',
    slug: 'level-one',
    title: 'Level One',
    order: 1,
    sections: [section],
  }

  return {
    schemaVersion: 1,
    id: 'program',
    slug: 'program',
    title: 'Program',
    levels: [level],
  }
}

function createProgress(completedSlugs: string[]): ProgressResponse {
  return {
    lessons: completedSlugs.map((lessonSlug) => ({
      lessonSlug,
      viewed: true,
      completed: true,
      viewedAt: null,
      completedAt: null,
      updatedAt: '2026-05-30T00:00:00.000Z',
    })),
    cards: [],
  }
}
