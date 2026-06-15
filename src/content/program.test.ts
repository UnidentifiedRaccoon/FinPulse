import { describe, expect, it } from 'vitest'

import { cardSchema } from './program'

describe('cardSchema practice cards', () => {
  it('accepts approved Markdown in Markdown-enabled card fields', () => {
    expect(
      cardSchema.safeParse({
        id: 'card-markdown-choice',
        type: 'single_choice',
        order: 1,
        question: '**Выбери** вариант и проверь [источник](https://example.com).',
        options: [
          { id: 'first', label: 'Первый вариант', feedback: 'Принято: <u>это безопасный старт</u>.' },
          { id: 'second', label: 'Второй вариант', feedback: 'Принято: *двигаемся дальше*.' },
        ],
      }).success,
    ).toBe(true)
  })

  it('rejects Markdown in plain-text labels', () => {
    expect(
      cardSchema.safeParse({
        id: 'card-markdown-label',
        type: 'single_choice',
        order: 1,
        question: 'Выбери вариант.',
        options: [
          { id: 'first', label: '**Первый вариант**' },
          { id: 'second', label: 'Второй вариант' },
        ],
      }).success,
    ).toBe(false)
  })

  it('rejects arbitrary HTML in Markdown-enabled fields', () => {
    expect(
      cardSchema.safeParse({
        id: 'card-html-body',
        type: 'theory',
        order: 1,
        body: '<strong>Важная мысль</strong>',
      }).success,
    ).toBe(false)
  })

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
