import { describe, expect, it } from 'vitest'

import { cardSchema } from './program'

describe('cardSchema practice cards', () => {
  it('accepts objective multi-select cards with correct and incorrect options', () => {
    expect(
      cardSchema.safeParse({
        id: 'card-multi-select',
        type: 'multi_select',
        order: 1,
        question: 'Отметь подходящие ситуации.',
        options: [
          { id: 'correct', label: 'Подходит', isCorrect: true },
          { id: 'incorrect', label: 'Не подходит' },
        ],
      }).success,
    ).toBe(true)
  })

  it('rejects multi-select cards without an incorrect option', () => {
    expect(
      cardSchema.safeParse({
        id: 'card-multi-select-invalid',
        type: 'multi_select',
        order: 1,
        question: 'Отметь подходящие ситуации.',
        options: [
          { id: 'first', label: 'Подходит', isCorrect: true },
          { id: 'second', label: 'Тоже подходит', isCorrect: true },
        ],
      }).success,
    ).toBe(false)
  })

  it('rejects categorization cards with items pointing to unknown categories', () => {
    expect(
      cardSchema.safeParse({
        id: 'card-categorization-invalid',
        type: 'categorization',
        order: 1,
        question: 'Распредели элементы.',
        categories: [
          { id: 'first', label: 'Первая категория' },
          { id: 'second', label: 'Вторая категория' },
        ],
        items: [
          { id: 'item-one', label: 'Первый пункт', correctCategoryId: 'first' },
          { id: 'item-two', label: 'Второй пункт', correctCategoryId: 'missing' },
        ],
      }).success,
    ).toBe(false)
  })
})
