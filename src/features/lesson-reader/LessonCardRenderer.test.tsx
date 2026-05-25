import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import type { Card } from '@/content/program'

import { LessonCardRenderer } from './LessonCardRenderer'

describe('LessonCardRenderer interactions', () => {
  it('checks single choice answers only after an explicit action', async () => {
    const user = userEvent.setup()
    const card = {
      id: 'test-choice',
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
    } satisfies Card

    render(<LessonCardRenderer card={card} />)

    const checkButton = screen.getByRole('button', { name: 'Проверить ответ' })
    expect(checkButton).toBeDisabled()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()

    await user.click(screen.getByRole('radio', { name: 'Не подходит' }))
    expect(checkButton).not.toBeDisabled()
    await user.click(checkButton)

    const feedback = screen.getByRole('status')
    expect(feedback).toHaveTextContent('Это не лучший вариант.')
    expect(feedback).toHaveTextContent('Лучший вариант: Подходит')
    expect(feedback).toHaveTextContent('Общий фидбек')
    expect(feedback).toHaveAttribute('aria-live', 'polite')
    expect(screen.getByRole('radio', { name: /Не подходит/ })).toHaveAttribute(
      'aria-describedby',
      'test-choice-choice-feedback',
    )
  })

  it('keeps read-only choice cards static', () => {
    const card = {
      id: 'readonly-choice',
      type: 'single_choice',
      order: 1,
      title: 'Статичный выбор',
      question: 'Что видно?',
      options: [
        { id: 'a', label: 'Обычный вариант' },
        { id: 'b', label: 'Правильный вариант', isCorrect: true },
      ],
      correctOptionId: 'b',
      feedback: 'Фидбек виден сразу',
      readOnly: true,
    } satisfies Card

    render(<LessonCardRenderer card={card} />)

    expect(screen.queryByRole('radio')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Проверить ответ/i })).not.toBeInTheDocument()
    expect(screen.getByText('Фидбек виден сразу')).toBeInTheDocument()
  })

  it('renders scenario options with the same feedback flow', async () => {
    const user = userEvent.setup()
    const card = {
      id: 'test-scenario',
      type: 'scenario',
      order: 1,
      title: 'Сценарий',
      body: 'Ситуация с выбором.',
      question: 'Что выбрать?',
      options: [
        { id: 'a', label: 'Лучший вариант', isCorrect: true },
        { id: 'b', label: 'Слабый вариант' },
      ],
      correctOptionId: 'a',
      feedback: 'Фидбек по сценарию',
    } satisfies Card

    render(<LessonCardRenderer card={card} />)

    expect(screen.getByText('Ситуация с выбором.')).toBeInTheDocument()
    await user.click(screen.getByRole('radio', { name: 'Лучший вариант' }))
    await user.click(screen.getByRole('button', { name: 'Проверить ответ' }))

    expect(screen.getByRole('status')).toHaveTextContent('Ответ верный.')
    expect(screen.getByRole('status')).toHaveTextContent('Фидбек по сценарию')
  })

  it('keeps reflection text in local component state', async () => {
    const user = userEvent.setup()
    const card = {
      id: 'test-reflection-text',
      type: 'reflection',
      order: 1,
      title: 'Рефлексия',
      prompt: 'Запиши мысль.',
      inputType: 'freeform',
      guidance: 'Подсказка',
    } satisfies Card

    render(<LessonCardRenderer card={card} />)

    const textarea = screen.getByRole('textbox', { name: 'Ответ' })
    await user.type(textarea, 'Мой черновик')

    expect(textarea).toHaveValue('Мой черновик')
    expect(screen.getByRole('status')).toHaveTextContent('Черновик заполнен. Он исчезнет при перезагрузке.')
  })

  it('supports local multi-select reflection answers', async () => {
    const user = userEvent.setup()
    const card = {
      id: 'test-reflection-multi',
      type: 'reflection',
      order: 1,
      title: 'Ценности',
      prompt: 'Выбери ценности.',
      inputType: 'multi_select',
      options: ['Свобода', 'Безопасность'],
    } satisfies Card

    render(<LessonCardRenderer card={card} />)

    const checkbox = screen.getByRole('checkbox', { name: 'Свобода' })
    await user.click(checkbox)

    expect(checkbox).toBeChecked()
    expect(screen.getByRole('status')).toHaveTextContent('Выбрано: 1.')
  })

  it('toggles checklist items locally', async () => {
    const user = userEvent.setup()
    const card = {
      id: 'test-checklist',
      type: 'checklist',
      order: 1,
      title: 'Чеклист',
      items: ['Первый пункт', 'Второй пункт'],
    } satisfies Card

    render(<LessonCardRenderer card={card} />)

    const firstItem = screen.getByRole('checkbox', { name: 'Первый пункт' })
    await user.click(firstItem)

    expect(firstItem).toBeChecked()
    expect(screen.getByRole('status')).toHaveTextContent('Отмечено 1 из 2.')
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite')
  })

  it('makes artifact templates editable and variants selectable', async () => {
    const user = userEvent.setup()
    const card = {
      id: 'test-artifact',
      type: 'artifact',
      order: 1,
      title: 'Артефакт',
      body: 'Заполни рабочий блок.',
      template: ['Желание'],
      variants: ['Базовый', 'Расширенный'],
    } satisfies Card

    render(<LessonCardRenderer card={card} />)

    const variant = screen.getByRole('button', { name: 'Базовый' })
    const textarea = screen.getByRole('textbox', { name: 'Желание' })

    await user.click(variant)
    await user.type(textarea, 'Дом у моря')

    expect(variant).toHaveAttribute('aria-pressed', 'true')
    expect(textarea).toHaveValue('Дом у моря')
    expect(screen.getByRole('status')).toHaveTextContent('Рабочий блок заполнен локально.')
  })
})
