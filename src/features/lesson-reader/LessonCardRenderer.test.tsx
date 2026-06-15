import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useEffect } from 'react'
import { MemoryRouter, useLocation, type Location } from 'react-router'
import { afterEach, beforeEach, vi } from 'vitest'

import type { LessonDetails } from '@/api/client'
import type { Card, Lesson, Level, Section } from '@/content/program'

import { LessonSession } from './LessonSession'

describe('LessonSession', () => {
  let originalWindowScrollTo: typeof window.scrollTo

  beforeEach(() => {
    originalWindowScrollTo = window.scrollTo
    window.scrollTo = vi.fn() as typeof window.scrollTo
  })

  afterEach(() => {
    window.scrollTo = originalWindowScrollTo
  })

  it('renders the first card in a focused session', () => {
    renderSession(
      [
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
      ],
      {
        levelTitle: 'Уровень 1 · Старт',
        sectionTitle: 'Раздел 1. Деньги и операции',
      },
    )

    expect(screen.getByRole('heading', { name: 'Тестовый урок' })).toBeInTheDocument()
    expect(screen.getByText('Старт · Деньги и операции')).toBeInTheDocument()
    expect(screen.queryByText('Уровень 1. Старт · Раздел 1. Деньги и операции')).not.toBeInTheDocument()
    expect(screen.queryByText('Уровень 1 · Старт · Раздел 1. Деньги и операции')).not.toBeInTheDocument()
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
    const goalLabel = within(goalCard).getByText('Цель урока')

    expect(goalLabel).toBeInTheDocument()
    expect(goalLabel.className).toContain('bg-[var(--fr-color-sky-500)]')
    expect(within(goalCard).getByText('Сделать один маленький шаг.')).toBeInTheDocument()
    expect(goalCard.className).toContain('border-[var(--fr-color-sky-500)]/35')
    expect(goalCard.querySelector('svg')).toBeNull()
    expect(screen.queryByText('В этом уроке')).not.toBeInTheDocument()
    expect(screen.queryByText('Описание урока.')).not.toBeInTheDocument()
  })

  it('renders Markdown-enabled theory body as rich text and preserves no-break amounts', () => {
    renderSession([
      {
        id: 'card-theory-rich-text',
        type: 'theory',
        order: 1,
        title: 'Rich теория',
        body: 'Тут есть **жирным**, *курсивом*, <u>подчёркиванием</u> и [ссылкой](https://example.com).\n\nСумма 30 000 ₽ в месяц остаётся цельной.',
      },
    ])

    const card = getLessonCardByHeading('Rich теория')
    const lessonCard = within(card)

    expect(lessonCard.getByText('жирным').tagName).toBe('STRONG')
    expect(lessonCard.getByText('курсивом').tagName).toBe('EM')
    expect(lessonCard.getByText('подчёркиванием').tagName).toBe('U')
    expect(lessonCard.getByRole('link', { name: 'ссылкой' })).toHaveAttribute('href', 'https://example.com')
    expect(lessonCard.getByRole('link', { name: 'ссылкой' })).toHaveAttribute('target', '_blank')
    expect(lessonCard.getByRole('link', { name: 'ссылкой' })).toHaveAttribute('rel', 'noreferrer')
    expect(lessonCard.getByText('30 000 ₽ в месяц')).toHaveClass('whitespace-nowrap')
    expectNoVisibleMarkdownMarkers(card)
  })

  it('renders single-choice question and option feedback as rich text while keeping option labels plain', async () => {
    const user = userEvent.setup()

    renderSession([
      {
        id: 'card-choice-rich-text',
        type: 'single_choice',
        order: 1,
        title: 'Граница выбора',
        question: 'Что **важнее** отметить?',
        options: [
          {
            id: 'raw-label',
            label: '**Оставить как есть**',
            feedback: 'Это **персональный** фидбек с <u>акцентом</u>.',
          },
          {
            id: 'plain-label',
            label: 'Обычный вариант',
            feedback: 'Можно двигаться дальше.',
          },
        ],
      },
    ])

    const card = getLessonCardByHeading('Граница выбора')
    expect(within(card).getByText('важнее').tagName).toBe('STRONG')

    const rawLabelOption = screen.getByRole('radio', { name: '**Оставить как есть**' })
    const rawLabel = rawLabelOption.closest('label')
    expect(rawLabel).not.toBeNull()
    expect(rawLabel).toHaveTextContent('**Оставить как есть**')
    expect(rawLabel?.querySelector('strong')).toBeNull()

    await user.click(rawLabelOption)

    const feedback = await screen.findByRole('status')
    expect(within(feedback).getByText('персональный').tagName).toBe('STRONG')
    expect(within(feedback).getByText('акцентом').tagName).toBe('U')
    expectNoVisibleMarkdownMarkers(feedback)
  })

  it('renders Markdown-enabled choice question paragraphs without collapsing line breaks', () => {
    renderSession([
      {
        id: 'card-choice-paragraphs',
        type: 'single_choice',
        order: 1,
        title: 'Абзацы вопроса',
        question: 'Первый абзац вопроса.\n\nВторой **важный** абзац.',
        options: [
          { id: 'first', label: 'Первый вариант' },
          { id: 'second', label: 'Второй вариант' },
        ],
      },
    ])

    const card = getLessonCardByHeading('Абзацы вопроса')
    expect(getParagraphTexts(card)).toEqual(expect.arrayContaining([
      'Первый абзац вопроса.',
      'Второй важный абзац.',
    ]))
    expect(within(card).getByText('важный').tagName).toBe('STRONG')
    expectNoVisibleMarkdownMarkers(card)
  })

  it('renders bottom feedback paragraphs without collapsing line breaks', async () => {
    const user = userEvent.setup()

    renderSession([
      {
        id: 'card-feedback-paragraphs',
        type: 'single_choice',
        order: 1,
        title: 'Абзацы фидбека',
        question: 'Что выберешь?',
        options: [
          {
            id: 'selected',
            label: 'Выбрать',
            feedback: 'Первый абзац фидбека.\n\nВторой **важный** абзац фидбека.',
          },
          {
            id: 'other',
            label: 'Другой вариант',
          },
        ],
        feedback: 'Общий абзац.\n\nЕщё один общий абзац.',
      },
    ])

    await user.click(screen.getByRole('radio', { name: 'Выбрать' }))

    const feedback = await screen.findByRole('status')
    expect(getParagraphTexts(feedback)).toEqual(expect.arrayContaining([
      'Первый абзац фидбека.',
      'Второй важный абзац фидбека.',
      'Общий абзац.',
      'Ещё один общий абзац.',
    ]))
    expect(within(feedback).getByText('важный').tagName).toBe('STRONG')
    expectNoVisibleMarkdownMarkers(feedback)
  })

  it('renders scenario body, feedback, statistics labels, and statistics sources as rich text', async () => {
    const user = userEvent.setup()

    renderSession([
      {
        id: 'card-scenario-rich-text',
        type: 'scenario',
        order: 1,
        title: 'Сценарий с источниками',
        body: 'Аня **заметила**, что подписки стали незаметной статьёй расходов.',
        question: 'Что <u>сначала</u> проверить?',
        options: [
          { id: 'ignore', label: 'Не смотреть подписки', feedback: 'Так можно *упустить* повторные списания.' },
          {
            id: 'check',
            label: 'Проверить активные подписки',
            isCorrect: true,
            feedback: 'Верно: **сначала видим список**.',
          },
        ],
        correctOptionId: 'check',
        feedback: 'Общее правило: **сначала увидеть**, потом решить.',
        statistics: {
          title: 'Статистика',
          items: [
            {
              value: '68%',
              label: 'людей **замечают** лишние подписки только после проверки.',
            },
          ],
          sources: ['[Банк России](https://example.com/source)'],
        },
      },
    ])

    const card = getLessonCardByHeading('Сценарий с источниками')
    const lessonCard = within(card)
    expect(lessonCard.getByText('заметила').tagName).toBe('STRONG')
    expect(lessonCard.getByText('сначала').tagName).toBe('U')
    expect(lessonCard.getByText('замечают').tagName).toBe('STRONG')
    expect(lessonCard.getByRole('link', { name: 'Банк России' })).toHaveAttribute(
      'href',
      'https://example.com/source',
    )

    await user.click(screen.getByRole('radio', { name: 'Проверить активные подписки' }))
    await user.click(screen.getByRole('button', { name: 'Проверить' }))

    const feedback = screen.getByRole('status')
    expect(within(feedback).getByText('сначала видим список').tagName).toBe('STRONG')
    expect(within(feedback).getByText('сначала увидеть').tagName).toBe('STRONG')
    expectNoVisibleMarkdownMarkers(feedback)
  })

  it('renders artifact template Markdown but keeps artifact variants plain', () => {
    renderSession([
      {
        id: 'card-artifact-rich-text',
        type: 'artifact',
        order: 1,
        title: 'Рабочий блок',
        body: 'Собери **мини-правило** для проверки трат.',
        variants: ['**Готовое правило**', 'Обычный вариант'],
        customOption: {
          label: 'Свой вариант',
          placeholder: 'Напиши свой вариант',
        },
        template: ['*Первая строка*', '<u>Вторая строка</u>'],
      },
    ])

    const card = getLessonCardByHeading('Рабочий блок')
    const lessonCard = within(card)
    expect(lessonCard.getByText('мини-правило').tagName).toBe('STRONG')
    expect(lessonCard.getByText('Первая строка').tagName).toBe('EM')
    expect(lessonCard.getByText('Вторая строка').tagName).toBe('U')
    expect(lessonCard.getByRole('textbox', { name: 'Первая строка' })).toBeInTheDocument()
    expect(lessonCard.getByRole('textbox', { name: 'Вторая строка' })).toBeInTheDocument()

    const rawVariantOption = screen.getByRole('radio', { name: '**Готовое правило**' })
    const rawVariantLabel = rawVariantOption.closest('label')
    expect(rawVariantLabel).not.toBeNull()
    expect(rawVariantLabel).toHaveTextContent('**Готовое правило**')
    expect(rawVariantLabel?.querySelector('strong')).toBeNull()
  })

  it('renders summary body, points, and next step as rich text', () => {
    renderSession([
      {
        id: 'card-summary-rich-text',
        type: 'summary',
        order: 1,
        title: 'Rich итог',
        body: 'Готово: **итоговый акцент**.\n\nВторой абзац итога.',
        points: ['<u>Вижу свободу выбора</u>\n\nВторой абзац пункта.', 'Проверяю [источник](https://example.com/summary).'],
        nextStep: 'Дальше *собрать план* без спешки.\n\nЗатем вернуться к правилу.',
      },
    ])

    const card = getLessonCardByHeading('Rich итог')
    const lessonCard = within(card)
    expect(lessonCard.getByText('итоговый акцент').tagName).toBe('STRONG')
    expect(lessonCard.getByText('Вижу свободу выбора').tagName).toBe('U')
    expect(lessonCard.getByRole('link', { name: 'источник' })).toHaveAttribute(
      'href',
      'https://example.com/summary',
    )
    expect(lessonCard.getByText('собрать план').tagName).toBe('EM')
    expect(card).toHaveTextContent('Второй абзац итога.')
    expect(card).toHaveTextContent('Второй абзац пункта.')
    expect(card).toHaveTextContent('Затем вернуться к правилу.')
    expectNoVisibleMarkdownMarkers(card)
  })

  it('renders reflection prompt and guidance paragraphs as rich text', () => {
    renderSession([
      {
        id: 'card-reflection-paragraphs',
        type: 'reflection',
        order: 1,
        title: 'Абзацы рефлексии',
        prompt: 'Первый абзац промпта.\n\nВторой **личный** абзац промпта.',
        inputType: 'freeform',
        guidance: 'Первый абзац подсказки.\n\nВторой <u>важный</u> абзац подсказки.',
      },
    ])

    const card = getLessonCardByHeading('Абзацы рефлексии')
    expect(getParagraphTexts(card)).toEqual(expect.arrayContaining([
      'Первый абзац промпта.',
      'Второй личный абзац промпта.',
      'Первый абзац подсказки.',
      'Второй важный абзац подсказки.',
    ]))
    expect(within(card).getByText('личный').tagName).toBe('STRONG')
    expect(within(card).getByText('важный').tagName).toBe('U')
    expectNoVisibleMarkdownMarkers(card)
  })

  it('renders artifact body and template paragraphs as rich text', () => {
    renderSession([
      {
        id: 'card-artifact-paragraphs',
        type: 'artifact',
        order: 1,
        title: 'Абзацы артефакта',
        body: 'Первый абзац задания.\n\nВторой **важный** абзац задания.',
        template: ['Первый абзац шаблона.\n\nВторой <u>шаблонный</u> абзац.'],
      },
    ])

    const card = getLessonCardByHeading('Абзацы артефакта')
    expect(getParagraphTexts(card)).toEqual(expect.arrayContaining([
      'Первый абзац задания.',
      'Второй важный абзац задания.',
    ]))
    expect(card).toHaveTextContent('Первый абзац шаблона.')
    expect(card).toHaveTextContent('Второй шаблонный абзац.')
    expect(within(card).getByText('важный').tagName).toBe('STRONG')
    expect(within(card).getByText('шаблонный').tagName).toBe('U')
    expect(screen.getByRole('textbox', { name: 'Первый абзац шаблона. Второй шаблонный абзац.' })).toBeInTheDocument()
    expectNoVisibleMarkdownMarkers(card)
  })

  it('renders fact-like theory paragraphs as plain text without calculation panels', () => {
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
    expect(lessonCard.queryByText('Расчёт')).not.toBeInTheDocument()
    expect(lessonCard.getByText(/200 ₽/)).toBeInTheDocument()
    expect(lessonCard.getByText(/30 000 ₽/)).toBeInTheDocument()
    expect(lessonCard.getByText('Кофе навынос')).toBeInTheDocument()
    expect(card?.querySelector('.fr-calculation-container')).toBeNull()
    expect(card?.querySelector('[class*="sm:grid"]')).toBeNull()
    expect(card).toHaveTextContent(
      'Факт из сценария урока: 5 трат по 200 ₽ в день — это 30 000 ₽ в месяц. По отдельности незаметно, в сумме ощутимо.',
    )
    expect(card?.textContent).not.toContain('××')
    expect(card?.textContent).not.toContain('==')
    expect(card?.querySelector('svg')).toBeNull()
  })

  it('does not infer formula or example surfaces from passive theory copy', () => {
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
    expect(lessonCard.queryByText('Формула')).not.toBeInTheDocument()
    expect(lessonCard.queryByText('Пример')).not.toBeInTheDocument()
    expect(lessonCard.queryByRole('heading', { name: 'Формула' })).not.toBeInTheDocument()
    expect(lessonCard.queryByRole('heading', { name: 'Пример' })).not.toBeInTheDocument()
    expect(lessonCard.queryByRole('heading', { name: 'Расчёт' })).not.toBeInTheDocument()
    expect(card?.querySelector('.fr-calculation-container')).toBeNull()
    expect(card?.querySelector('[class*="sm:grid"]')).toBeNull()
    expect(card).toHaveTextContent('Формула простая: подушка = месячные обязательные расходы × 3–6.')
    expect(card?.textContent).not.toContain('××')
    expect(card?.textContent).not.toContain('==')
    expect(card).toHaveTextContent(
      'Пример из сценария: Если обязательные расходы — 40 000 ₽ в месяц, то подушка на 3 месяца — 120 000 ₽, а на 6 месяцев — 240 000 ₽.',
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

  it('resets third-screen categorization practice after using the bottom back action', async () => {
    const user = userEvent.setup()

    renderSession([
      {
        id: 'card-theory-one',
        type: 'theory',
        order: 1,
        title: 'Первый шаг',
        body: 'Короткое объяснение.',
      },
      {
        id: 'card-theory-two',
        type: 'theory',
        order: 2,
        title: 'Второй шаг',
        body: 'Ещё одно объяснение.',
      },
      {
        id: 'card-categorization-reset',
        type: 'categorization',
        order: 3,
        title: 'Раздели траты',
        question: 'Распредели траты по группам.',
        categories: [
          { id: 'mandatory', label: 'Обязательное' },
          { id: 'desired', label: 'Желаемое' },
        ],
        items: [
          { id: 'rent', label: 'Аренда квартиры', correctCategoryId: 'mandatory' },
          { id: 'coffee', label: 'Кофе навынос', correctCategoryId: 'desired' },
          { id: 'utilities', label: 'Оплата ЖКХ', correctCategoryId: 'mandatory' },
        ],
      },
      {
        id: 'card-summary',
        type: 'summary',
        order: 4,
        title: 'Итог',
        points: ['Пункт'],
      },
    ])

    await user.click(screen.getByRole('button', { name: 'Далее' }))
    await user.click(screen.getByRole('button', { name: 'Далее' }))

    expect(screen.getByRole('group', { name: 'Аренда квартиры' })).toBeInTheDocument()

    await user.click(within(screen.getByRole('group', { name: 'Аренда квартиры' })).getByRole('radio', { name: 'Обязательное' }))
    await waitFor(() => expect(screen.getByRole('group', { name: 'Кофе навынос' })).toBeInTheDocument())

    await user.click(within(screen.getByRole('group', { name: 'Кофе навынос' })).getByRole('radio', { name: 'Желаемое' }))
    await waitFor(() => expect(screen.getByRole('group', { name: 'Оплата ЖКХ' })).toBeInTheDocument())

    await user.click(screen.getByRole('button', { name: 'Назад' }))

    expect(screen.getByRole('heading', { name: 'Второй шаг' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Далее' }))

    const firstItem = screen.getByRole('group', { name: 'Аренда квартиры' })
    expect(within(firstItem).getByRole('radio', { name: 'Обязательное' })).not.toBeChecked()
    expect(screen.getByRole('button', { name: 'Проверить' })).toBeDisabled()

    await user.click(within(firstItem).getByRole('radio', { name: 'Обязательное' }))

    await waitFor(() => expect(screen.getByRole('group', { name: 'Кофе навынос' })).toBeInTheDocument())
    expect(screen.queryByRole('group', { name: 'Оплата ЖКХ' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Аренда квартиры: Обязательное' })).not.toBeInTheDocument()
  })

  it('resets the lesson screen scroll when moving between cards', async () => {
    const user = userEvent.setup()
    const { restore: restoreScrollIntoView, scrollIntoView } = mockElementScrollIntoView()
    const { restore: restoreScrollTo, scrollTo } = mockWindowScrollTo()

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

      scrollTo.mockClear()
      scrollIntoView.mockClear()
      await user.click(screen.getByRole('button', { name: 'Далее' }))

      expect(screen.getByRole('heading', { name: 'Итог' })).toBeInTheDocument()
      expect(scrollTo).toHaveBeenCalledWith({
        top: 0,
        behavior: 'auto',
      })
      expect(scrollIntoView).not.toHaveBeenCalled()
    } finally {
      restoreScrollTo()
      restoreScrollIntoView()
    }
  })

  it('uses directional side motion for next and back card transitions', async () => {
    const user = userEvent.setup()
    const { container } = renderSession([
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

    expect(getLessonCardTransition(container)).toHaveAttribute('data-lesson-card-transition', 'none')
    expect(getLessonCardTransition(container)).not.toHaveClass('fr-lesson-card-transition')

    await user.click(screen.getByRole('button', { name: 'Далее' }))

    expect(screen.getByRole('heading', { name: 'Итог' })).toBeInTheDocument()
    expect(getLessonCardTransition(container)).toHaveAttribute('data-lesson-card-transition', 'forward')
    expect(getLessonCardTransition(container)).toHaveClass(
      'fr-lesson-card-transition',
      'fr-lesson-card-transition--forward',
    )

    await user.click(screen.getByRole('button', { name: 'Назад' }))

    expect(screen.getByRole('heading', { name: 'Первый шаг' })).toBeInTheDocument()
    expect(getLessonCardTransition(container)).toHaveAttribute('data-lesson-card-transition', 'back')
    expect(getLessonCardTransition(container)).toHaveClass('fr-lesson-card-transition', 'fr-lesson-card-transition--back')
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
    const resultMatrix = screen.getByRole('region', { name: 'Итоговая таблица распределения' })
    const pinnedColumnShadow = 'shadow-[8px_0_14px_-14px_rgba(15,23,42,0.6)]'
    expect(resultMatrix).toHaveClass('max-h-[min(56svh,28rem)]', 'overflow-auto', 'overscroll-contain')
    const firstHeaderCell = within(resultMatrix).getByText('Пункт')
    expect(firstHeaderCell).toHaveClass('sticky', 'left-0', 'top-0', 'z-30')
    expect(firstHeaderCell).not.toHaveClass(pinnedColumnShadow)
    expect(within(resultMatrix).getByText('Подушка помогает')).toHaveClass('sticky', 'top-0', 'z-20')
    const firstItemCell = within(resultMatrix).getByText('Внезапная поломка техники').closest('div')
    expect(firstItemCell).not.toBeNull()
    expect(firstItemCell).toHaveClass('sticky', 'left-0')
    expect(firstItemCell).not.toHaveClass(pinnedColumnShadow)

    resultMatrix.scrollLeft = 24
    fireEvent.scroll(resultMatrix)
    await waitFor(() => expect(firstHeaderCell).toHaveClass(pinnedColumnShadow))
    expect(firstItemCell).toHaveClass(pinnedColumnShadow)

    resultMatrix.scrollLeft = 0
    fireEvent.scroll(resultMatrix)
    await waitFor(() => expect(firstHeaderCell).not.toHaveClass(pinnedColumnShadow))
    expect(firstItemCell).not.toHaveClass(pinnedColumnShadow)

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
    const secondExpense = screen.getByRole('textbox', { name: 'Трата 2: сумма и категория' })
    const thirdExpense = screen.getByRole('textbox', { name: 'Трата 3: сумма и категория' })

    const finishButton = screen.getByRole('button', { name: 'Завершить' })
    expect(finishButton).toBeDisabled()

    await user.type(firstExpense, '350 ₽, продукты')

    expect(firstExpense).toHaveValue('350 ₽, продукты')
    expect(screen.getByRole('status')).toHaveTextContent('Заполни все поля, чтобы продолжить.')
    expect(screen.getByRole('status')).toHaveClass('sr-only')
    expect(finishButton).toBeDisabled()

    await user.type(secondExpense, '120 ₽, транспорт')
    await user.type(thirdExpense, '200 ₽, кофе')

    expect(finishButton).toBeEnabled()
    expect(screen.getByRole('status')).toHaveTextContent('Рабочий блок заполнен.')
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
    expect(screen.getByRole('heading', { name: 'Итог' })).toBeInTheDocument()
    expect(screen.getByText('Пункт')).toBeInTheDocument()
    expect(screen.getByText('Сохранено в Навигатор')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Урок пройден' })).toBeInTheDocument()
    expect(screen.getByText('2 из 2 карточек')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Завершить' })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'К списку уроков' })).toHaveAttribute('href', '/levels/level-1')
  })

  it('renders next lesson and lesson-list actions on completion when another lesson exists', async () => {
    const user = userEvent.setup()

    const { container } = renderSession(
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

    expect(screen.getByRole('heading', { name: 'Итог' })).toBeInTheDocument()
    expect(screen.getByText('Сохранено в Навигатор')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Урок пройден' })).toBeInTheDocument()
    expect(screen.getByText('Твой результат сохранён. Можно перейти к следующему уроку или вернуться к списку уроков.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'К следующему уроку' })).toHaveAttribute('href', '/lessons/next-lesson')
    expect(screen.getByRole('link', { name: 'К списку уроков' })).toHaveAttribute('href', '/levels/level-1')

    const mascot = container.querySelector('.fr-completion-mascot-celebrate')
    expect(mascot).toHaveAttribute('loading', 'eager')
    expect(mascot).toHaveAttribute('data-loaded', 'false')

    fireEvent.load(mascot as Element)

    expect(mascot).toHaveAttribute('data-loaded', 'true')
  })

  it('passes the focused lesson state through the completion lesson-list action', async () => {
    const user = userEvent.setup()
    const locations: Location[] = []

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
      { onLocationChange: (location) => locations.push(location) },
    )

    await user.click(screen.getByRole('button', { name: 'Завершить' }))
    await user.click(screen.getByRole('link', { name: 'К списку уроков' }))

    await waitFor(() => {
      expect(locations.at(-1)?.pathname).toBe('/levels/level-1')
    })
    expect(locations.at(-1)?.state).toEqual({ focusLessonSlug: 'test-lesson' })
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
    levelTitle: string
    sectionTitle: string
    onLocationChange: (location: Location) => void
  }> = {},
) {
  const details = createLessonDetails(cards, {
    levelTitle: overrides.levelTitle,
    nextLessonSlug: overrides.nextLessonSlug,
    sectionTitle: overrides.sectionTitle,
  })

  return render(
    <MemoryRouter initialEntries={['/lessons/test-lesson']}>
      <LessonSession
        canSaveProgress={overrides.canSaveProgress ?? false}
        details={details}
        isLessonCompleted={false}
        onCardCompleted={overrides.onCardCompleted}
        onCardViewed={overrides.onCardViewed}
        onReflectionAnswerSave={overrides.onReflectionAnswerSave}
        onLessonCompleted={overrides.onLessonCompleted}
      />
      {overrides.onLocationChange ? <LocationProbe onChange={overrides.onLocationChange} /> : null}
    </MemoryRouter>,
  )
}

function LocationProbe({ onChange }: { onChange: (location: Location) => void }) {
  const location = useLocation()

  useEffect(() => {
    onChange(location)
  }, [location, onChange])

  return null
}

function getLessonCardByHeading(name: string) {
  const card = screen.getByRole('heading', { name }).closest('section')
  expect(card).toBeInstanceOf(HTMLElement)
  return card as HTMLElement
}

function expectNoVisibleMarkdownMarkers(container: HTMLElement) {
  const text = container.textContent ?? ''

  expect(text).not.toContain('**')
  expect(text).not.toMatch(/\*\S[^*]*\*/)
  expect(text).not.toContain('<u>')
  expect(text).not.toContain('</u>')
  expect(text).not.toContain('](')
}

function getParagraphTexts(container: HTMLElement) {
  return Array.from(container.querySelectorAll('p'))
    .map((paragraph) => paragraph.textContent?.trim())
    .filter((text): text is string => Boolean(text))
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

function mockWindowScrollTo() {
  const scrollTo = vi.fn()
  const originalScrollTo = window.scrollTo

  window.scrollTo = scrollTo as typeof window.scrollTo

  return {
    scrollTo,
    restore: () => {
      window.scrollTo = originalScrollTo
    },
  }
}

function getLessonCardTransition(container: HTMLElement) {
  const transition = container.querySelector('[data-lesson-card-transition]')
  expect(transition).toBeInstanceOf(HTMLElement)
  return transition as HTMLElement
}

function createLessonDetails(
  cards: Card[],
  options: { levelTitle?: string; nextLessonSlug?: string; sectionTitle?: string } = {},
): LessonDetails {
  const lesson: Lesson = {
    id: 'lesson-1',
    slug: 'test-lesson',
    title: 'Тестовый урок',
    description: 'Описание урока.',
    learningGoal: 'Сделать один маленький шаг.',
    order: 1,
    cards,
  }
  const nextLesson: Lesson | null = options.nextLessonSlug
    ? {
        id: 'lesson-next',
        slug: options.nextLessonSlug,
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
    title: options.sectionTitle ?? 'Тестовый раздел',
    order: 1,
    source: 'test',
    lessons: nextLesson ? [lesson, nextLesson] : [lesson],
  }

  const level: Level = {
    schemaVersion: 1,
    id: 'level-1',
    slug: 'level-1',
    title: options.levelTitle ?? 'Тестовый уровень',
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
