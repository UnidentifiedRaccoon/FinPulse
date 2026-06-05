import { render, screen, waitFor, within } from '@testing-library/react'
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

  it('renders the lesson intro as an explicit focus and goal block', () => {
    renderSession([
      {
        id: 'card-theory',
        type: 'theory',
        order: 1,
        title: 'Первый шаг',
        body: 'Короткое объяснение.',
      },
    ])

    const brief = screen.getByRole('region', { name: 'Кратко об уроке' })

    expect(within(brief).getByText('В этом уроке')).toBeInTheDocument()
    expect(within(brief).getByText('Описание урока.')).toBeInTheDocument()
    expect(within(brief).getByText('Цель урока')).toBeInTheDocument()
    expect(within(brief).getByText('Сделать один маленький шаг.')).toBeInTheDocument()
  })

  it('renders theory explanation with the selected calculation pattern and no decorative icon', () => {
    renderSession([
      {
        id: 'card-theory-calc',
        type: 'theory',
        order: 1,
        title: 'Деньги утекают по капле',
        body: 'Большие траты мы помним. А маленькие — кофе, такси, подписка, доставка — проходят мимо внимания.\n\nГлавное правило: чтобы управлять деньгами, их сначала нужно увидеть.\n\nФакт из сценария урока: 5 трат по 200 ₽ в день — это 30 000 ₽ в месяц. По отдельности незаметно, в сумме ощутимо.',
        examples: ['Кофе навынос', 'Такси или доставка'],
      },
    ])

    const card = screen.getByRole('heading', { name: 'Деньги утекают по капле' }).closest('section')
    expect(card).not.toBeNull()

    const lessonCard = within(card as HTMLElement)
    expect(lessonCard.getByText('Расчёт')).toBeInTheDocument()
    expect(lessonCard.getByText('5 трат')).toBeInTheDocument()
    expect(lessonCard.getByText('200 ₽')).toBeInTheDocument()
    expect(lessonCard.getByText('30 дней')).toBeInTheDocument()
    expect(lessonCard.getByText('30 000 ₽')).toBeInTheDocument()
    expect(lessonCard.getByText('По отдельности незаметно, в сумме ощутимо.')).toBeInTheDocument()
    expect(lessonCard.getByText('Кофе навынос')).toBeInTheDocument()
    expect(card?.querySelector('.fr-calculation-container')).toHaveAttribute('data-step-count', '4')
    expect(card?.querySelector('[class*="sm:grid"]')).toBeNull()
    expect(card).toHaveTextContent('5 трат×200 ₽×30 дней=30 000 ₽')
    expect(card?.textContent).not.toContain('××')
    expect(card?.textContent).not.toContain('==')
    expect(card?.querySelector('svg')).toBeNull()
  })

  it('formats every fact-like paragraph in passive theory cards', () => {
    renderSession([
      {
        id: 'card-theory-formula-example',
        type: 'theory',
        order: 1,
        title: 'Правило 3–6 месяцев',
        body: 'Базовый ориентир подушки — 3–6 месяцев твоих обязательных расходов.\n\nФормула простая: подушка = месячные обязательные расходы × 3–6.\n\nПример из сценария: если обязательные расходы — 40 000 ₽ в месяц, то подушка на 3 месяца — 120 000 ₽, а на 6 месяцев — 240 000 ₽.',
      },
    ])

    const card = screen.getByRole('heading', { name: 'Правило 3–6 месяцев' }).closest('section')
    expect(card).not.toBeNull()

    const lessonCard = within(card as HTMLElement)
    expect(lessonCard.getByText('Формула')).toBeInTheDocument()
    expect(lessonCard.getByText('обязательные расходы')).toBeInTheDocument()
    expect(lessonCard.getByText('3-6 месяцев')).toBeInTheDocument()
    expect(lessonCard.getByText('подушка')).toBeInTheDocument()
    expect(card?.querySelector('.fr-calculation-container')).toHaveAttribute('data-step-count', '3')
    expect(card?.querySelector('[class*="sm:grid"]')).toBeNull()
    expect(card).toHaveTextContent('обязательные расходы×3-6 месяцев=подушка')
    expect(card?.textContent).not.toContain('××')
    expect(card?.textContent).not.toContain('==')
    expect(lessonCard.getByText('Пример')).toBeInTheDocument()
    expect(
      lessonCard.getByText(
        'если обязательные расходы — 40 000 ₽ в месяц, то подушка на 3 месяца — 120 000 ₽, а на 6 месяцев — 240 000 ₽.',
      ),
    ).toBeInTheDocument()
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

  it('embeds supported video cards inside the lesson', async () => {
    const user = userEvent.setup()

    renderSession([
      {
        id: 'card-video',
        type: 'video',
        order: 1,
        title: 'Видео урока',
        src: 'https://rutube.ru/play/embed/98b1d47fb6794e189e48bc2d16496429/?p=YZO74pElZsnRBGF7kooKIQ',
        provider: 'rutube',
        timecodes: [{ time: '01:05', label: 'Как поставить финансовую цель' }],
      },
    ])

    const player = screen.getByTitle('Видео урока')
    expect(player).toHaveAttribute('src', expect.stringContaining('https://rutube.ru/play/embed/'))
    expect(player).toHaveAttribute('src', expect.stringContaining('skinColor=1E9BD7'))
    expect(player).toHaveAttribute('allow', expect.stringContaining('autoplay'))
    expect(screen.getByRole('link', { name: 'Открыть в RUTUBE' })).toHaveAttribute(
      'href',
      'https://rutube.ru/play/embed/98b1d47fb6794e189e48bc2d16496429/?p=YZO74pElZsnRBGF7kooKIQ',
    )

    await user.click(screen.getByRole('button', { name: 'Перейти к фрагменту 01:05: Как поставить финансовую цель' }))

    expect(screen.getByTitle('Видео урока')).toHaveAttribute('src', expect.stringContaining('t=65'))
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

  it('requires and saves reflection text before completing the card', async () => {
    const user = userEvent.setup()
    const onReflectionAnswerSave = vi.fn()
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
      { canSaveProgress: true, onCardCompleted, onReflectionAnswerSave },
    )

    const finishButton = screen.getByRole('button', { name: 'Завершить' })
    expect(finishButton).toBeDisabled()

    const textarea = screen.getByRole('textbox', { name: 'Ответ' })
    await user.type(textarea, 'Мой черновик')

    expect(textarea).toHaveValue('Мой черновик')
    expect(screen.getByRole('status')).toHaveTextContent('Черновик заполнен.')
    expect(screen.getByRole('status')).toHaveClass('sr-only')
    expect(onCardCompleted).not.toHaveBeenCalled()

    expect(finishButton).toBeEnabled()
    await user.click(finishButton)

    await waitFor(() =>
      expect(onReflectionAnswerSave).toHaveBeenCalledWith('card-reflection', {
        textValue: 'Мой черновик',
      }),
    )
    await waitFor(() => expect(onCardCompleted).toHaveBeenCalledWith('card-reflection'))
    expect(onReflectionAnswerSave.mock.invocationCallOrder[0]).toBeLessThan(onCardCompleted.mock.invocationCallOrder[0])
    expect(onCardCompleted).toHaveBeenCalledTimes(1)
  })

  it('saves a normal single-select reflection option before completing the card', async () => {
    const user = userEvent.setup()
    const onReflectionAnswerSave = vi.fn()
    const onCardCompleted = vi.fn()

    renderSession(
      [
        {
          id: 'card-reflection-select',
          type: 'reflection',
          order: 1,
          title: 'Выбор фокуса',
          prompt: 'Что сейчас важнее?',
          inputType: 'single_select',
          options: ['Резерв', 'Планирование трат', 'Спокойное закрытие долга'],
        },
      ],
      { canSaveProgress: true, onCardCompleted, onReflectionAnswerSave },
    )

    const finishButton = screen.getByRole('button', { name: 'Завершить' })
    expect(finishButton).toBeDisabled()

    await user.click(screen.getByRole('radio', { name: 'Планирование трат' }))

    expect(finishButton).toBeEnabled()
    await user.click(finishButton)

    await waitFor(() =>
      expect(onReflectionAnswerSave).toHaveBeenCalledWith('card-reflection-select', {
        singleValue: 'Планирование трат',
      }),
    )
    await waitFor(() => expect(onCardCompleted).toHaveBeenCalledWith('card-reflection-select'))
  })

  it('requires and saves typed text for a custom single-select reflection option', async () => {
    const user = userEvent.setup()
    const onReflectionAnswerSave = vi.fn()
    const onCardCompleted = vi.fn()

    renderSession(
      [
        {
          id: 'card-reflection-custom',
          type: 'reflection',
          order: 1,
          title: 'Что удивило?',
          prompt: 'Какая трата удивила?',
          inputType: 'single_select',
          options: ['Кофе или перекусы', 'Такси или доставка', 'Подписки'],
          customOption: {
            label: 'Свой вариант',
            placeholder: 'Напиши свой вариант',
          },
        },
      ],
      { canSaveProgress: true, onCardCompleted, onReflectionAnswerSave },
    )

    const finishButton = screen.getByRole('button', { name: 'Завершить' })
    expect(finishButton).toBeDisabled()
    expect(screen.queryByRole('textbox', { name: 'Введите свой вариант' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('radio', { name: 'Свой вариант' }))

    const customInput = screen.getByRole('textbox', { name: 'Введите свой вариант' })
    expect(customInput).toHaveAttribute('placeholder', 'Напиши свой вариант')
    expect(finishButton).toBeDisabled()

    await user.type(customInput, 'Подарок другу')

    expect(customInput).toHaveValue('Подарок другу')
    expect(finishButton).toBeEnabled()
    await user.click(finishButton)

    await waitFor(() =>
      expect(onReflectionAnswerSave).toHaveBeenCalledWith('card-reflection-custom', {
        singleValue: 'Подарок другу',
      }),
    )
    await waitFor(() => expect(onCardCompleted).toHaveBeenCalledWith('card-reflection-custom'))
  })

  it('does not complete a reflection card when answer persistence fails', async () => {
    const user = userEvent.setup()
    const onReflectionAnswerSave = vi.fn().mockRejectedValue(new Error('Не удалось сохранить ответ.'))
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
        },
      ],
      { canSaveProgress: true, onCardCompleted, onReflectionAnswerSave },
    )

    await user.type(screen.getByRole('textbox', { name: 'Ответ' }), 'Мой черновик')
    await user.click(screen.getByRole('button', { name: 'Завершить' }))

    expect(await screen.findByText('Не удалось сохранить ответ.')).toBeInTheDocument()
    expect(onCardCompleted).not.toHaveBeenCalled()
    expect(screen.queryByRole('heading', { name: 'Урок завершён' })).not.toBeInTheDocument()
  })

  it('renders artifact template rows as text fields without checklist checkboxes', async () => {
    const user = userEvent.setup()

    renderSession([
      {
        id: 'card-artifact',
        type: 'artifact',
        order: 1,
        title: 'Твои 3 траты за сегодня',
        body: 'Вспомни и запиши 3 траты за сегодня.',
        template: ['Трата 1: сумма и категория', 'Трата 2: сумма и категория', 'Трата 3: сумма и категория'],
      },
    ])

    expect(screen.queryByRole('checkbox', { name: 'Трата 1: сумма и категория' })).not.toBeInTheDocument()
    expect(screen.queryByRole('checkbox', { name: 'Трата 2: сумма и категория' })).not.toBeInTheDocument()
    expect(screen.queryByRole('checkbox', { name: 'Трата 3: сумма и категория' })).not.toBeInTheDocument()

    const firstExpense = screen.getByRole('textbox', { name: 'Трата 1: сумма и категория' })
    expect(screen.getByRole('textbox', { name: 'Трата 2: сумма и категория' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Трата 3: сумма и категория' })).toBeInTheDocument()

    const finishButton = screen.getByRole('button', { name: 'Завершить' })
    expect(finishButton).toBeDisabled()

    await user.type(firstExpense, '350 ₽, продукты')

    expect(firstExpense).toHaveValue('350 ₽, продукты')
    expect(screen.getByRole('status')).toHaveTextContent('Рабочий блок заполнен.')
    expect(screen.getByRole('status')).toHaveClass('sr-only')
    expect(finishButton).toBeEnabled()
  })

  it('saves a normal artifact custom-option radio variant before completing the card', async () => {
    const user = userEvent.setup()
    const onReflectionAnswerSave = vi.fn()
    const onCardCompleted = vi.fn()

    renderSession(
      [
        {
          id: 'card-artifact-radio',
          type: 'artifact',
          order: 1,
          title: 'Твоё правило на 3 дня',
          body: 'Выбери правило на ближайшие 3 дня.',
          variants: [
            '3 дня записываю каждую трату — без оценок, просто вижу',
            'Замечаю хотя бы 1 трату в день',
          ],
          customOption: {
            label: 'Свой вариант',
            placeholder: 'Напиши свой вариант',
          },
        },
      ],
      { canSaveProgress: true, onCardCompleted, onReflectionAnswerSave },
    )

    const finishButton = screen.getByRole('button', { name: 'Завершить' })
    expect(finishButton).toBeDisabled()
    expect(screen.queryByRole('textbox', { name: 'Введите свой вариант' })).not.toBeInTheDocument()
    expect(screen.queryByRole('textbox', { name: 'Рабочий ответ' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('radio', { name: 'Замечаю хотя бы 1 трату в день' }))

    expect(screen.queryByRole('textbox', { name: 'Рабочий ответ' })).not.toBeInTheDocument()
    expect(finishButton).toBeEnabled()
    await user.click(finishButton)

    await waitFor(() =>
      expect(onReflectionAnswerSave).toHaveBeenCalledWith('card-artifact-radio', {
        selectedVariant: 'Замечаю хотя бы 1 трату в день',
        checkedRows: [],
        templateValues: [''],
        fallbackValue: '',
      }),
    )
    await waitFor(() => expect(onCardCompleted).toHaveBeenCalledWith('card-artifact-radio'))
  })

  it('requires and saves typed text for a custom artifact radio variant', async () => {
    const user = userEvent.setup()
    const onReflectionAnswerSave = vi.fn()
    const onCardCompleted = vi.fn()

    renderSession(
      [
        {
          id: 'card-artifact-custom-radio',
          type: 'artifact',
          order: 1,
          title: 'Твоё правило выбора',
          body: 'Выбери правило или напиши своё.',
          variants: [
            'Беру правило: перед желаемой покупкой задаю вопрос',
            'Делаю паузу 1 день перед крупной желаемой покупкой',
          ],
          customOption: {
            label: 'Свой вариант',
            placeholder: 'Напиши свой вариант',
          },
        },
      ],
      { canSaveProgress: true, onCardCompleted, onReflectionAnswerSave },
    )

    const finishButton = screen.getByRole('button', { name: 'Завершить' })
    expect(finishButton).toBeDisabled()
    expect(screen.queryByRole('textbox', { name: 'Рабочий ответ' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('radio', { name: 'Свой вариант' }))

    const customInput = screen.getByRole('textbox', { name: 'Введите свой вариант' })
    expect(customInput).toHaveAttribute('placeholder', 'Напиши свой вариант')
    expect(screen.queryByRole('textbox', { name: 'Рабочий ответ' })).not.toBeInTheDocument()
    expect(finishButton).toBeDisabled()

    await user.type(customInput, 'Проверяю корзину перед оплатой')

    expect(customInput).toHaveValue('Проверяю корзину перед оплатой')
    expect(finishButton).toBeEnabled()
    await user.click(finishButton)

    await waitFor(() =>
      expect(onReflectionAnswerSave).toHaveBeenCalledWith('card-artifact-custom-radio', {
        selectedVariant: 'Проверяю корзину перед оплатой',
        checkedRows: [],
        templateValues: [''],
        fallbackValue: '',
      }),
    )
    await waitFor(() => expect(onCardCompleted).toHaveBeenCalledWith('card-artifact-custom-radio'))
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
    onReflectionAnswerSave: (cardId: string, payload: Record<string, unknown>) => void | Promise<void>
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
        onReflectionAnswerSave={overrides.onReflectionAnswerSave}
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
