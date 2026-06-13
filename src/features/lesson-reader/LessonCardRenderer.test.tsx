import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { vi } from 'vitest'

import type { LessonDetails } from '@/api/client'
import type { Card, Lesson, Level, Section } from '@/content/program'

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

  it('renders the lesson goal as the only intro card', () => {
    renderSession([
      {
        id: 'card-theory',
        type: 'theory',
        order: 1,
        title: 'Первый шаг',
        body: 'Короткое объяснение.',
      },
    ])

    const goalCard = screen.getByRole('region', { name: 'Цель урока' })

    expect(within(goalCard).getByText('Цель урока')).toBeInTheDocument()
    expect(within(goalCard).getByText('Сделать один маленький шаг.')).toBeInTheDocument()
    expect(screen.queryByText('В этом уроке')).not.toBeInTheDocument()
    expect(screen.queryByText('Описание урока.')).not.toBeInTheDocument()
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
        body: 'Базовый ориентир подушки — 3–6 месяцев твоих обязательных расходов.\n\nФормула простая: подушка = месячные обязательные расходы × 3–6.\n\nПример из сценария: Если обязательные расходы — 40 000 ₽ в месяц, то подушка на 3 месяца — 120 000 ₽, а на 6 месяцев — 240 000 ₽.',
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
    expect(card).toHaveTextContent(
      'Если обязательные расходы — 40 000 ₽ в месяц, то подушка на 3 месяца — 120 000 ₽, а на 6 месяцев — 240 000 ₽.',
    )
    expect(lessonCard.getByText('40 000 ₽ в месяц')).toHaveClass('whitespace-nowrap')
    expect(lessonCard.getByText('120 000 ₽')).toHaveClass('whitespace-nowrap')
    expect(lessonCard.getByText('6 месяцев')).toHaveClass('whitespace-nowrap')
  })

  it('renders structured statistics and checked feedback on interactive scenario cards', async () => {
    const user = userEvent.setup()

    renderSession([
      {
        id: 'card-scenario-statistics',
        type: 'scenario',
        order: 4,
        title: 'Как выбрать горизонт',
        body: 'У Даши обязательные расходы 40 000 ₽ в месяц, доход сезонный: в одни месяцы больше, в другие меньше.',
        question: 'Фрилансеру с непостоянным доходом ближе к какому ориентиру?',
        options: [
          { id: 'three-months', label: '3 месяца' },
          { id: 'six-plus', label: '6 месяцев и больше', isCorrect: true },
        ],
        correctOptionId: 'six-plus',
        statistics: {
          title: 'Статистика по теме (Россия)',
          items: [
            {
              value: '3–6 зарплат',
              label: 'рекомендация Банка России по размеру финансовой подушки.',
            },
            {
              value: '12%',
              label: 'россиян имеют запас на 3–6 месяцев.',
            },
          ],
          sources: ['Банк России (2025)', 'SuperJob (2025)'],
        },
      },
    ])

    const card = screen.getByRole('heading', { name: 'Как выбрать горизонт' }).closest('section')
    expect(card).not.toBeNull()

    const lessonCard = within(card as HTMLElement)
    expect(lessonCard.getByText('40 000 ₽ в месяц')).toHaveClass('whitespace-nowrap')
    expect(lessonCard.getByRole('heading', { name: 'Статистика по теме (Россия)' })).toBeInTheDocument()
    expect(lessonCard.getByText('3–6 зарплат')).toBeInTheDocument()
    expect(lessonCard.getByText('рекомендация Банка России по размеру финансовой подушки.')).toBeInTheDocument()
    expect(lessonCard.getByText('12%')).toBeInTheDocument()
    expect(card).toHaveTextContent('россиян имеют запас на 3–6 месяцев.')
    expect(lessonCard.getByText('3–6 месяцев')).toHaveClass('whitespace-nowrap')
    expect(lessonCard.getByText('Источники: Банк России (2025); SuperJob (2025).')).toBeInTheDocument()

    await user.click(screen.getByRole('radio', { name: '6 месяцев и больше' }))
    await user.click(screen.getByRole('button', { name: 'Проверить' }))

    expect(screen.getByRole('status')).toHaveTextContent('Верно')
    expect(screen.getByRole('button', { name: 'Завершить' })).toBeEnabled()
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

  it('resets the lesson screen scroll when moving between cards', async () => {
    const user = userEvent.setup()
    const { restore, scrollIntoView } = mockElementScrollIntoView()

    try {
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

      scrollIntoView.mockClear()
      await user.click(screen.getByRole('button', { name: 'Далее' }))

      expect(screen.getByRole('heading', { name: 'Итог' })).toBeInTheDocument()
      expect(scrollIntoView).toHaveBeenCalledWith({
        block: 'start',
        behavior: 'auto',
      })
    } finally {
      restore()
    }
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
    const animatedFeedback = feedback.closest('[data-lesson-bottom-feedback]')
    expect(feedback).toHaveTextContent('Можно уточнить')
    expect(feedback).toHaveTextContent('Лучше подходит: Подходит.')
    expect(feedback).toHaveTextContent('Общий фидбек')
    expect(animatedFeedback).toHaveClass('animate-in', 'fade-in-0', 'slide-in-from-bottom-4')
    expect(screen.getByRole('button', { name: 'Завершить' })).toBeEnabled()
  })

  it('checks an objective multi-select answer and allows continuing after feedback', async () => {
    const user = userEvent.setup()

    renderSession([
      {
        id: 'card-multi-select',
        type: 'multi_select',
        order: 3,
        title: 'Где помогает подушка?',
        question: 'Отметь ситуации, в которых финансовая подушка помогает.',
        options: [
          { id: 'breakdown', label: 'Внезапная поломка техники', isCorrect: true },
          { id: 'income-loss', label: 'Задержка или потеря дохода', isCorrect: true },
          { id: 'treatment', label: 'Срочное лечение', isCorrect: true },
          { id: 'status-phone', label: 'Новый телефон для статуса' },
        ],
        feedback: 'Подушка — для непредвиденного и важного.',
      },
    ])

    const checkButton = screen.getByRole('button', { name: 'Проверить' })
    expect(checkButton).toBeDisabled()

    await user.click(screen.getByRole('button', { name: 'Перейти к карточке 4' }))
    await user.click(screen.getByRole('checkbox', { name: 'Новый телефон для статуса' }))
    expect(checkButton).toBeEnabled()
    await user.click(checkButton)

    const feedback = screen.getByRole('status')
    expect(feedback).toHaveTextContent('Можно уточнить')
    expect(feedback).toHaveTextContent('Ещё подходит: Внезапная поломка техники, Задержка или потеря дохода, Срочное лечение.')
    expect(feedback).toHaveTextContent('Проверь лишнее: Новый телефон для статуса.')
    expect(feedback).toHaveTextContent('Подушка — для непредвиденного и важного.')
    expect(screen.getByRole('button', { name: 'Завершить' })).toBeEnabled()

    await user.click(screen.getByRole('button', { name: 'Перейти к карточке 3' }))
    await user.click(screen.getByRole('checkbox', { name: 'Срочное лечение' }))
    expect(screen.getByRole('button', { name: 'Проверить' })).toBeEnabled()
  })

  it('shows correct feedback for an objective multi-select answer', async () => {
    const user = userEvent.setup()

    renderSession([
      {
        id: 'card-multi-select-correct',
        type: 'multi_select',
        order: 3,
        title: 'Где помогает подушка?',
        question: 'Отметь ситуации, в которых финансовая подушка помогает.',
        options: [
          { id: 'breakdown', label: 'Внезапная поломка техники', isCorrect: true },
          { id: 'income-loss', label: 'Задержка или потеря дохода', isCorrect: true },
          { id: 'shopping', label: 'Спонтанный шопинг' },
        ],
        feedback: 'Подушка — для непредвиденного и важного.',
      },
    ])

    await user.click(screen.getByRole('checkbox', { name: 'Внезапная поломка техники' }))
    await user.click(screen.getByRole('button', { name: 'Следующая карточка' }))
    await user.click(screen.getByRole('checkbox', { name: 'Задержка или потеря дохода' }))
    await user.click(screen.getByRole('button', { name: 'Проверить' }))

    expect(screen.getByRole('status')).toHaveTextContent('Верно')
    expect(screen.getByRole('status')).toHaveTextContent('Подушка — для непредвиденного и важного.')
  })

  it('checks an objective categorization answer and requires every item before checking', async () => {
    const user = userEvent.setup()

    renderSession([
      {
        id: 'card-categorization',
        type: 'categorization',
        order: 3,
        title: 'Где подушка реально выручает?',
        question: 'Разбери ситуации: где подушка помогает, а где это отдельные желания.',
        categories: [
          { id: 'helps', label: 'Подушка помогает' },
          { id: 'not-for-fund', label: 'Не для подушки' },
        ],
        items: [
          { id: 'breakdown', label: 'Внезапная поломка техники', correctCategoryId: 'helps' },
          { id: 'shopping', label: 'Спонтанный шопинг на распродаже', correctCategoryId: 'not-for-fund' },
        ],
        feedback: 'Подушка — страховка на «беду», не кошелёк для желаний.',
      },
    ])

    const checkButton = screen.getByRole('button', { name: 'Проверить' })
    expect(checkButton).toBeDisabled()

    await user.click(
      within(screen.getByRole('group', { name: 'Внезапная поломка техники' })).getByRole('radio', {
        name: 'Не для подушки',
      }),
    )
    expect(checkButton).toBeDisabled()
    await waitFor(() => expect(screen.getByRole('group', { name: 'Спонтанный шопинг на распродаже' })).toBeInTheDocument())

    await user.click(
      within(screen.getByRole('group', { name: 'Спонтанный шопинг на распродаже' })).getByRole('radio', {
        name: 'Не для подушки',
      }),
    )
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Внезапная поломка техники: Подушка помогает' })).toBeInTheDocument(),
    )
    expect(screen.getByRole('button', { name: 'Внезапная поломка техники: Не для подушки' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByRole('button', { name: 'Спонтанный шопинг на распродаже: Не для подушки' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(checkButton).toBeEnabled()
    await user.click(checkButton)

    const feedback = screen.getByRole('status')
    expect(feedback).toHaveTextContent('Можно уточнить')
    expect(feedback).toHaveTextContent('Уточни: Внезапная поломка техники → Подушка помогает.')
    expect(feedback).toHaveTextContent('Подушка — страховка на «беду», не кошелёк для желаний.')
    expect(screen.getByRole('button', { name: 'Завершить' })).toBeEnabled()

    await user.click(screen.getByRole('button', { name: 'Внезапная поломка техники: Подушка помогает' }))
    expect(screen.getByRole('button', { name: 'Проверить' })).toBeEnabled()
  })

  it('keeps money and duration fragments unwrapped in formula practice labels', () => {
    renderSession([
      {
        id: 'card-categorization-formula',
        type: 'categorization',
        order: 3,
        title: 'Проверь расчёты подушки',
        question: 'Формула: обязательные расходы × число месяцев.',
        categories: [
          { id: 'correct', label: 'Верно' },
          { id: 'error', label: 'Есть ошибка' },
        ],
        items: [
          {
            id: 'forty-six-months',
            label: '40 000 ₽ в месяц × 6 месяцев = 200 000 ₽',
            correctCategoryId: 'error',
          },
        ],
      },
    ])

    expect(screen.getByText('40 000 ₽ в месяц')).toHaveClass('whitespace-nowrap')
    expect(screen.getByText('6 месяцев')).toHaveClass('whitespace-nowrap')
    expect(screen.getByText('200 000 ₽')).toHaveClass('whitespace-nowrap')
  })

  it('shows correct feedback for an objective categorization answer', async () => {
    const user = userEvent.setup()

    renderSession([
      {
        id: 'card-categorization-correct',
        type: 'categorization',
        order: 3,
        title: 'Раздели траты',
        question: 'Распредели траты по группам.',
        categories: [
          { id: 'mandatory', label: 'Обязательное' },
          { id: 'desired', label: 'Желаемое' },
        ],
        items: [
          { id: 'utilities', label: 'Оплата ЖКХ', correctCategoryId: 'mandatory' },
          { id: 'streaming', label: 'Подписка на стриминг', correctCategoryId: 'desired' },
        ],
        feedback: 'Обязательное — это «нужно жить», желаемое — «хочу лучше».',
      },
    ])

    await user.click(within(screen.getByRole('group', { name: 'Оплата ЖКХ' })).getByRole('radio', { name: 'Обязательное' }))
    await waitFor(() => expect(screen.getByRole('group', { name: 'Подписка на стриминг' })).toBeInTheDocument())
    await user.click(
      within(screen.getByRole('group', { name: 'Подписка на стриминг' })).getByRole('radio', { name: 'Желаемое' }),
    )
    await waitFor(() => expect(screen.getByRole('button', { name: 'Оплата ЖКХ: Обязательное' })).toBeInTheDocument())
    await user.click(screen.getByRole('button', { name: 'Проверить' }))

    expect(screen.getByRole('status')).toHaveTextContent('Верно')
    expect(screen.getByRole('status')).toHaveTextContent('Обязательное — это «нужно жить», желаемое — «хочу лучше».')
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

    const customInput = screen.getByRole('textbox', { name: 'Мой вариант' })
    expect(customInput.tagName).toBe('TEXTAREA')
    expect(customInput).toHaveAttribute('placeholder', 'Напиши свой вариант')
    expect(screen.getByText('Мой вариант')).toHaveClass('sr-only')
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
    expect(screen.queryByRole('heading', { name: 'Урок пройден' })).not.toBeInTheDocument()
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

    const customInput = screen.getByRole('textbox', { name: 'Мой вариант' })
    expect(customInput.tagName).toBe('TEXTAREA')
    expect(customInput).toHaveAttribute('placeholder', 'Напиши свой вариант')
    expect(screen.getByText('Мой вариант')).toHaveClass('sr-only')
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
    expect(screen.getByRole('heading', { name: 'Урок пройден' })).toBeInTheDocument()
    expect(screen.getByText('2 из 2 карточек')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'К списку уроков' })).toHaveAttribute('href', '/levels/level-1')
  })

  it('renders next lesson and lesson-list actions on completion when another lesson exists', async () => {
    const user = userEvent.setup()

    renderSession(
      [
        {
          id: 'card-summary',
          type: 'summary',
          order: 1,
          title: 'Итог',
          points: ['Пункт'],
        },
      ],
      { nextLessonSlug: 'next-lesson' },
    )

    await user.click(screen.getByRole('button', { name: 'Завершить' }))

    expect(screen.getByRole('heading', { name: 'Урок пройден' })).toBeInTheDocument()
    expect(screen.getByText('Один небольшой шаг пройден. Можно перейти к следующему уроку или вернуться к списку уроков.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'К следующему уроку' })).toHaveAttribute('href', '/lessons/next-lesson')
    expect(screen.getByRole('link', { name: 'К списку уроков' })).toHaveAttribute('href', '/levels/level-1')
  })
})

function renderSession(
  cards: Card[],
  overrides: Partial<{
    canSaveProgress: boolean
    nextLessonSlug: string
    onCardViewed: (cardId: string) => void | Promise<void>
    onCardCompleted: (cardId: string) => void | Promise<void>
    onReflectionAnswerSave: (cardId: string, payload: Record<string, unknown>) => void | Promise<void>
    onLessonCompleted: (lessonSlug: string) => void | Promise<void>
  }> = {},
) {
  const details = createLessonDetails(cards, overrides.nextLessonSlug)

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

function mockElementScrollIntoView() {
  const scrollIntoView = vi.fn()
  const originalScrollIntoView = Element.prototype.scrollIntoView

  Element.prototype.scrollIntoView = scrollIntoView as Element['scrollIntoView']

  return {
    scrollIntoView,
    restore: () => {
      if (originalScrollIntoView) {
        Element.prototype.scrollIntoView = originalScrollIntoView
        return
      }

      delete (Element.prototype as Partial<Pick<Element, 'scrollIntoView'>>).scrollIntoView
    },
  }
}

function createLessonDetails(cards: Card[], nextLessonSlug?: string): LessonDetails {
  const lesson: Lesson = {
    id: 'lesson-1',
    slug: 'test-lesson',
    title: 'Тестовый урок',
    description: 'Описание урока.',
    learningGoal: 'Сделать один маленький шаг.',
    order: 1,
    cards,
  }
  const nextLesson: Lesson | null = nextLessonSlug
    ? {
        id: 'lesson-next',
        slug: nextLessonSlug,
        title: 'Следующий урок',
        description: 'Описание следующего урока.',
        learningGoal: 'Продолжить маршрут.',
        order: 2,
        cards: [],
      }
    : null

  const section: Section = {
    schemaVersion: 1,
    id: 'section-1',
    slug: 'section-1',
    title: 'Тестовый раздел',
    order: 1,
    source: 'test',
    lessons: nextLesson ? [lesson, nextLesson] : [lesson],
  }

  const level: Level = {
    schemaVersion: 1,
    id: 'level-1',
    slug: 'level-1',
    title: 'Тестовый уровень',
    order: 1,
    sections: [section],
  }

  return {
    level,
    section,
    lesson,
    previous: null,
    next: nextLesson ? { level, section, lesson: nextLesson } : null,
  }
}
