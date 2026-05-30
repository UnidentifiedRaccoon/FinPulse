import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { vi } from 'vitest'

import type { LessonDetails } from '@/api/client'
import type { Card, Lesson, Module, Unit } from '@/content/program'

import { LessonSession } from './LessonSession'

describe('LessonSession', () => {
  it('renders the first card in a focused session', () => {
    renderSession([
      {
        id: 'card-theory',
        type: 'theory',
        order: 1,
        title: 'Первый шаг',
        body: 'Короткое объяснение.',
      },
      {
        id: 'card-summary',
        type: 'summary',
        order: 2,
        title: 'Итог',
        points: ['Пункт'],
      },
    ])

    expect(screen.getByRole('heading', { name: 'Тестовый урок' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Первый шаг' })).toBeInTheDocument()
    expect(screen.getByText('1 из 2')).toBeInTheDocument()
    expect(screen.getByRole('progressbar', { name: 'Прогресс урока' })).toHaveAttribute('aria-valuenow', '50')
  })

  it('continues through cards with the sticky CTA', async () => {
    const user = userEvent.setup()

    renderSession([
      {
        id: 'card-theory',
        type: 'theory',
        order: 1,
        title: 'Первый шаг',
        body: 'Короткое объяснение.',
      },
      {
        id: 'card-choice',
        type: 'single_choice',
        order: 2,
        title: 'Выбор',
        question: 'Какой вариант подходит?',
        options: [
          { id: 'a', label: 'Не подходит' },
          { id: 'b', label: 'Подходит', isCorrect: true },
        ],
        correctOptionId: 'b',
      },
    ])

    await user.click(screen.getByRole('button', { name: 'Далее' }))

    expect(screen.getByRole('heading', { name: 'Выбор' })).toBeInTheDocument()
    expect(screen.getByText('2 из 2')).toBeInTheDocument()
  })

  it('checks a selected choice and shows supportive feedback', async () => {
    const user = userEvent.setup()

    renderSession([
      {
        id: 'card-choice',
        type: 'single_choice',
        order: 1,
        title: 'Проверка выбора',
        question: 'Какой вариант подходит?',
        options: [
          { id: 'a', label: 'Не подходит' },
          { id: 'b', label: 'Подходит', isCorrect: true },
        ],
        correctOptionId: 'b',
        feedback: 'Общий фидбек',
      },
    ])

    const checkButton = screen.getByRole('button', { name: 'Проверить' })
    expect(checkButton).toBeDisabled()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()

    await user.click(screen.getByRole('radio', { name: 'Не подходит' }))
    expect(checkButton).not.toBeDisabled()
    await user.click(checkButton)

    const feedback = screen.getByRole('status')
    expect(feedback).toHaveTextContent('Можно уточнить')
    expect(feedback).toHaveTextContent('Лучше подходит: Подходит.')
    expect(feedback).toHaveTextContent('Общий фидбек')
    expect(screen.getByRole('button', { name: 'Завершить' })).toBeEnabled()
  })

  it('keeps reflection text local until the user continues', async () => {
    const user = userEvent.setup()
    const onCardCompleted = vi.fn()

    renderSession(
      [
        {
          id: 'card-reflection',
          type: 'reflection',
          order: 1,
          title: 'Рефлексия',
          prompt: 'Запиши мысль.',
          inputType: 'freeform',
          guidance: 'Подсказка',
        },
      ],
      { canSaveProgress: true, onCardCompleted },
    )

    const textarea = screen.getByRole('textbox', { name: 'Ответ' })
    await user.type(textarea, 'Мой черновик')

    expect(textarea).toHaveValue('Мой черновик')
    expect(screen.getByRole('status')).toHaveTextContent('Черновик заполнен. Он исчезнет при перезагрузке.')
    expect(onCardCompleted).not.toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: 'Завершить' }))

    await waitFor(() => expect(onCardCompleted).toHaveBeenCalledWith('card-reflection'))
    expect(onCardCompleted).toHaveBeenCalledTimes(1)
  })

  it('toggles checklist items locally', async () => {
    const user = userEvent.setup()

    renderSession([
      {
        id: 'card-checklist',
        type: 'checklist',
        order: 1,
        title: 'Чеклист',
        body: 'Отметь подходящие пункты.',
        items: ['Первый пункт', 'Второй пункт'],
      },
    ])

    const firstItem = screen.getByRole('checkbox', { name: 'Первый пункт' })
    await user.click(firstItem)

    expect(firstItem).toBeChecked()
    expect(screen.getByRole('status')).toHaveTextContent('Отмечено 1 из 2.')
  })

  it('marks viewed cards and completes lesson with existing progress markers', async () => {
    const user = userEvent.setup()
    const onCardViewed = vi.fn()
    const onCardCompleted = vi.fn()
    const onLessonCompleted = vi.fn()

    renderSession(
      [
        {
          id: 'card-one',
          type: 'theory',
          order: 1,
          title: 'Первый шаг',
          body: 'Короткое объяснение.',
        },
        {
          id: 'card-two',
          type: 'summary',
          order: 2,
          title: 'Итог',
          points: ['Пункт'],
        },
      ],
      { canSaveProgress: true, onCardCompleted, onCardViewed, onLessonCompleted },
    )

    await waitFor(() => expect(onCardViewed).toHaveBeenCalledWith('card-one'))

    await user.click(screen.getByRole('button', { name: 'Далее' }))
    await waitFor(() => expect(onCardCompleted).toHaveBeenCalledWith('card-one'))
    await waitFor(() => expect(onCardViewed).toHaveBeenCalledWith('card-two'))

    await user.click(screen.getByRole('button', { name: 'Завершить' }))

    await waitFor(() => expect(onCardCompleted).toHaveBeenCalledWith('card-two'))
    expect(onLessonCompleted).toHaveBeenCalledWith('test-lesson')
    expect(screen.getByRole('heading', { name: 'Урок завершён' })).toBeInTheDocument()
  })
})

function renderSession(
  cards: Card[],
  overrides: Partial<{
    canSaveProgress: boolean
    onCardViewed: (cardId: string) => void | Promise<void>
    onCardCompleted: (cardId: string) => void | Promise<void>
    onLessonCompleted: (lessonSlug: string) => void | Promise<void>
  }> = {},
) {
  const details = createLessonDetails(cards)

  return render(
    <MemoryRouter>
      <LessonSession
        canSaveProgress={overrides.canSaveProgress ?? false}
        details={details}
        isLessonCompleted={false}
        onCardCompleted={overrides.onCardCompleted}
        onCardViewed={overrides.onCardViewed}
        onLessonCompleted={overrides.onLessonCompleted}
      />
    </MemoryRouter>,
  )
}

function createLessonDetails(cards: Card[]): LessonDetails {
  const lesson: Lesson = {
    id: 'lesson-1',
    slug: 'test-lesson',
    title: 'Тестовый урок',
    description: 'Описание урока.',
    learningGoal: 'Сделать один маленький шаг.',
    order: 1,
    cards,
  }

  const unit: Unit = {
    schemaVersion: 1,
    id: 'unit-1',
    slug: 'unit-1',
    title: 'Тестовый юнит',
    order: 1,
    source: 'test',
    lessons: [lesson],
  }

  const module: Module = {
    schemaVersion: 1,
    id: 'module-1',
    slug: 'module-1',
    title: 'Тестовый модуль',
    order: 1,
    units: [unit],
  }

  return {
    module,
    unit,
    lesson,
    previous: null,
    next: null,
  }
}
