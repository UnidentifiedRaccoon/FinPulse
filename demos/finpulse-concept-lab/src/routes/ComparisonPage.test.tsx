import { cleanup, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { HashRouter, MemoryRouter } from 'react-router'

import { AppRoutes } from '../App'
import { practiceActionLabel } from '../components/practiceMechanicLabels'
import {
  comparisonEpisodeEntries,
  comparisonLessonPath,
  getComparisonLesson,
} from '../comparison/comparisonLessonCatalog'
import {
  sameEpisodeMechanicEntries,
  sharedSameEpisode,
} from '../comparison/sameEpisodeCatalog'
import { sharedSecondEpisode } from '../comparison/secondEpisodeCatalog'

const comparisonLessonCases = sameEpisodeMechanicEntries.flatMap((method) => (
  comparisonEpisodeEntries.map((episode) => {
    const lesson = getComparisonLesson(method.slug, episode.routeSlug)
    if (!lesson) throw new Error(`Missing comparison lesson ${method.slug}/${episode.slug}`)
    return lesson
  })
))

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  )
}

afterEach(() => {
  cleanup()
  window.location.hash = ''
  vi.restoreAllMocks()
})

describe('two-episode mechanic lab', () => {
  it('renders nine distinct methods with two episode choices each', () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
    const storageSpy = vi.spyOn(Storage.prototype, 'setItem')
    renderAt('/compare')

    expect(screen.getByRole('heading', { level: 1, name: 'Девять способов, два эпизода' })).toHaveFocus()
    expect(screen.getByText(/Для каждого эпизода текст и финал одинаковы/)).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /Способ/ })).toHaveLength(18)
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument()
    expect(screen.queryByText(/Поменять местами/)).not.toBeInTheDocument()

    for (const mechanic of sameEpisodeMechanicEntries) {
      expect(screen.getByText(mechanic.shortLabel)).toBeInTheDocument()
      expect(screen.getByText(mechanic.catalogDescription)).toBeInTheDocument()
      for (const episode of comparisonEpisodeEntries) {
        expect(screen.getByRole('link', {
          name: `${episode.sequenceLabel}: ${episode.title}. Способ «${mechanic.title}»`,
        })).toHaveAttribute('href', comparisonLessonPath(mechanic.slug, episode, 1))
      }
    }
    expect(new Set(sameEpisodeMechanicEntries.map((mechanic) => mechanic.slug))).toHaveLength(9)
    expect(new Set(sameEpisodeMechanicEntries.map((mechanic) => mechanic.shortLabel))).toHaveLength(9)
    expect(fetchSpy).not.toHaveBeenCalled()
    expect(storageSpy).not.toHaveBeenCalled()
  })

  it('leaves the existing Concept Lab launcher unchanged', () => {
    renderAt('/lab')

    expect(screen.getByRole('heading', { name: 'Выберите короткий урок' })).toBeInTheDocument()
    expect(screen.getByText('Сообщение и проверка')).toBeInTheDocument()
    expect(screen.getByText('Деньги и срок')).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /Открыть урок/ })).toHaveLength(9)
    expect(screen.queryByRole('link', { name: /Открыть разбор/ })).not.toBeInTheDocument()
  })

  it('keeps both canonical stories outside mechanic definitions', () => {
    const forbiddenKeys = ['opening', 'beforeReveal', 'reveal', 'outcome', 'checkpoint', 'summary']

    for (const mechanic of sameEpisodeMechanicEntries) {
      for (const key of forbiddenKeys) expect(mechanic).not.toHaveProperty(key)
    }
    expect(sharedSameEpisode.opening.paragraphs[0]).toMatch(/^Саша приехал в новый город/)
    expect(sharedSameEpisode.beforeReveal.paragraphs.at(-1)).toBe(
      'Получив сообщение Тамары, Саша сохранил точную дату оплаты в календаре рядом с днём зарплаты.',
    )
    expect(sharedSameEpisode.reveal).toBe(
      'В тот же вечер он попросил перенести оплату на день зарплаты. Тамара согласилась, и новую дату они зафиксировали в переписке.',
    )
    expect(sharedSecondEpisode.opening.paragraphs[0]).toMatch(/^Утром Саша заполнил анкету/)
    expect(sharedSecondEpisode.beforeReveal.paragraphs.at(-1)).toBe(
      '— Давай посмотрим, что там после пробного периода, — предложил Миша.',
    )
    expect(sharedSecondEpisode.reveal).toMatch(/^Они открыли условия подписки/)
    expect(sharedSecondEpisode.outcome.paragraphs.at(-1)).toBe(
      'Саша не собирался регулярно пользоваться этими услугами и отменил подписку.',
    )
    expect(JSON.stringify(sharedSecondEpisode)).not.toContain('сообщение от «поддержки»')

    for (const mechanic of sameEpisodeMechanicEntries) {
      expect(getComparisonLesson(mechanic.slug)?.story).toBe(sharedSameEpisode)
      expect(getComparisonLesson(mechanic.slug, 'trial-subscription')?.story).toBe(sharedSecondEpisode)
    }
  })

  it.each(comparisonLessonCases)(
    'runs $method.title through $episode.title over its shared episode',
    async ({ episode, method, story, variant }) => {
      const user = userEvent.setup()
      renderAt(comparisonLessonPath(method.slug, episode, 1))

      expect(screen.getByRole('heading', { level: 1, name: method.title })).toHaveFocus()
      expect(screen.getByText(new RegExp(`${episode.sequenceLabel}.*${episode.title}`))).toBeInTheDocument()
      await user.click(screen.getByRole('button', { name: 'Начать разбор' }))

      expect(screen.getByText(story.opening.paragraphs[0])).toBeInTheDocument()
      await user.click(screen.getByRole('button', { name: 'Продолжить историю' }))

      expect(screen.getByText(story.beforeReveal.paragraphs[0])).toBeInTheDocument()
      expect(screen.getByText(story.beforeReveal.facts[2].body)).toBeInTheDocument()
      await user.click(screen.getByRole('button', { name: story.revealActionLabel }))

      expect(screen.getByText(story.reveal)).toBeInTheDocument()
      for (const prompt of variant.practice.prompts) {
        const group = screen.getByRole('group', { name: prompt.legend })
        for (const expectedId of prompt.expected) {
          const option = prompt.options.find((candidate) => candidate.id === expectedId)
          expect(option).toBeDefined()
          await user.click(within(group).getByRole(prompt.mode === 'multiple' ? 'checkbox' : 'radio', { name: option!.label }))
        }
      }
      await user.click(screen.getByRole('button', { name: practiceActionLabel(variant.practice.kind) }))

      expect(screen.getByRole('heading', { name: variant.feedback.successTitle })).toBeInTheDocument()
      if (episode.slug === 'trial-subscription') {
        expect(screen.queryByText(story.outcome.paragraphs.at(-1)!)).not.toBeInTheDocument()
      }
      await user.click(screen.getByRole('button', { name: 'Вернуться к эпизоду' }))

      expect(screen.getByRole('heading', { name: story.outcome.title })).toBeInTheDocument()
      expect(screen.getByText(story.outcome.paragraphs.at(-1)!)).toBeInTheDocument()
      await user.click(screen.getByRole('button', { name: 'Проверить границу вывода' }))

      const checkpointOption = story.checkpoint.prompt.options.find((option) => (
        story.checkpoint.prompt.expected.includes(option.id)
      ))
      expect(checkpointOption).toBeDefined()
      await user.click(screen.getByRole('radio', { name: checkpointOption!.label }))
      await user.click(screen.getByRole('button', { name: 'Проверить' }))
      expect(screen.getByText(story.checkpoint.feedback.success)).toBeInTheDocument()
      await user.click(screen.getByRole('button', { name: 'К итогу' }))

      expect(screen.getByRole('heading', { name: story.summary.title })).toBeInTheDocument()
      expect(screen.getByText(story.summary.takeaway)).toBeInTheDocument()
      await user.click(screen.getByRole('button', { name: 'Завершить' }))

      expect(screen.getByRole('heading', { name: 'Разбор завершён' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'К способам и эпизодам' })).toBeInTheDocument()
    },
  )

  it('shows calm corrective feedback without trapping the learner', async () => {
    const user = userEvent.setup()
    const mechanic = sameEpisodeMechanicEntries[0]
    renderAt(`/compare/${mechanic.slug}/4`)

    for (const prompt of mechanic.practice.prompts) {
      const group = screen.getByRole('group', { name: prompt.legend })
      const wrong = prompt.options.find((option) => !prompt.expected.includes(option.id))
      expect(wrong).toBeDefined()
      await user.click(within(group).getByRole('radio', { name: wrong!.label }))
    }
    await user.click(screen.getByRole('button', { name: practiceActionLabel(mechanic.practice.kind) }))

    expect(screen.getByRole('heading', { name: mechanic.feedback.nuanceTitle })).toBeInTheDocument()
    expect(screen.getAllByText(/Точнее здесь:/)).toHaveLength(mechanic.practice.prompts.length)
    expect(screen.getByRole('button', { name: 'Вернуться к эпизоду' })).toBeEnabled()
  })

  it('uses subscription-specific labels instead of first-episode placeholders', () => {
    renderAt('/compare/source-scope/trial-subscription/4')
    expect(screen.getByText('Открытый вопрос')).toBeInTheDocument()
    expect(screen.queryByText('Источник 4')).not.toBeInTheDocument()

    cleanup()
    renderAt('/compare/question-and-source/trial-subscription/4')
    expect(screen.getByRole('region', { name: 'Вопросы и источники' })).toBeInTheDocument()
    expect(screen.getByText('Вопрос 3')).toBeInTheDocument()
    expect(screen.queryByText('Граница ответа')).not.toBeInTheDocument()

    cleanup()
    renderAt('/compare/deadline-backward/trial-subscription/4')
    expect(screen.getByText('Конец пробного периода')).toBeInTheDocument()
    expect(screen.queryByText('Жилищная дата')).not.toBeInTheDocument()
  })

  it('repairs legacy query, invalid steps and incomplete direct links', async () => {
    window.location.hash = '#/compare?first=facts-before-reveal&second=one-change&view=second'
    render(<HashRouter><AppRoutes /></HashRouter>)
    await waitFor(() => expect(window.location.hash).toBe('#/compare'))

    cleanup()
    window.location.hash = '#/compare/facts-before-reveal/99'
    render(<HashRouter><AppRoutes /></HashRouter>)
    await waitFor(() => expect(window.location.hash).toBe('#/compare/facts-before-reveal/1'))

    cleanup()
    window.location.hash = '#/compare/facts-before-reveal/5'
    render(<HashRouter><AppRoutes /></HashRouter>)
    await waitFor(() => expect(window.location.hash).toContain('#/compare/facts-before-reveal/4'))

    cleanup()
    window.location.hash = '#/compare/missing/3'
    render(<HashRouter><AppRoutes /></HashRouter>)
    await waitFor(() => expect(window.location.hash).toBe('#/compare'))
    expect(screen.getByRole('heading', { name: 'Девять способов, два эпизода' })).toBeInTheDocument()

    cleanup()
    window.location.hash = '#/compare/facts-before-reveal/trial-subscription/99'
    render(<HashRouter><AppRoutes /></HashRouter>)
    await waitFor(() => expect(window.location.hash).toBe('#/compare/facts-before-reveal/trial-subscription/1'))

    cleanup()
    window.location.hash = '#/compare/facts-before-reveal/trial-subscription/5'
    render(<HashRouter><AppRoutes /></HashRouter>)
    await waitFor(() => expect(window.location.hash).toContain('#/compare/facts-before-reveal/trial-subscription/4'))

    cleanup()
    window.location.hash = '#/compare/facts-before-reveal/missing-episode/3'
    render(<HashRouter><AppRoutes /></HashRouter>)
    await waitFor(() => expect(window.location.hash).toBe('#/compare'))

    cleanup()
    window.location.hash = '#/compare/facts-before-reveal'
    render(<HashRouter><AppRoutes /></HashRouter>)
    await waitFor(() => expect(window.location.hash).toBe('#/compare'))
    expect(screen.getByRole('heading', { name: 'Девять способов, два эпизода' })).toBeInTheDocument()
  })

  it('restores bounded answer state from a direct HashRouter URL', async () => {
    window.location.hash = '#/compare/one-fact-one-conclusion/4?practice-conclusion-boundary=bounded'
    render(<HashRouter><AppRoutes /></HashRouter>)

    expect(screen.getByRole('radio', {
      name: 'Перенос согласован, новая дата зафиксирована; остальные вопросы открыты',
      checked: true,
    })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Сравнить последствия' })).toBeEnabled()

    cleanup()
    window.location.hash = '#/compare/one-fact-one-conclusion/trial-subscription/4?practice-conclusion-boundary=bounded'
    render(<HashRouter><AppRoutes /></HashRouter>)
    expect(screen.getByRole('radio', {
      name: 'Эти условия описывают ежемесячную плату после этого пробного периода',
      checked: true,
    })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Сравнить последствия' })).toBeEnabled()
  })

  it('clears completion when going back after reload and requires a checked checkpoint', async () => {
    const user = userEvent.setup()
    window.location.hash = '#/compare/facts-before-reveal/8?checkpoint-shared-boundary=payment-complete&checkpoint-checked=1&done=1'
    render(<HashRouter><AppRoutes /></HashRouter>)

    expect(screen.getByRole('heading', { name: 'Разбор завершён' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Назад' }))
    await waitFor(() => {
      expect(window.location.hash).toContain('#/compare/facts-before-reveal/7')
      expect(window.location.hash).not.toContain('done=1')
    })
    await user.click(screen.getByRole('button', { name: 'К итогу' }))
    expect(screen.getByRole('heading', { name: sharedSameEpisode.summary.title })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Разбор завершён' })).not.toBeInTheDocument()

    cleanup()
    window.location.hash = '#/compare/facts-before-reveal/8?checkpoint-shared-boundary=payment-complete'
    render(<HashRouter><AppRoutes /></HashRouter>)
    await waitFor(() => expect(window.location.hash).toContain('#/compare/facts-before-reveal/7'))
    expect(screen.getByRole('button', { name: 'Проверить' })).toBeInTheDocument()
  })

  it('keeps second-episode guards and back navigation inside the second episode', async () => {
    const user = userEvent.setup()
    window.location.hash = '#/compare/facts-before-reveal/trial-subscription/8?checkpoint-shared-boundary=cancel-method&checkpoint-checked=1&done=1'
    render(<HashRouter><AppRoutes /></HashRouter>)

    expect(screen.getByRole('heading', { name: 'Разбор завершён' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Назад' }))
    await waitFor(() => {
      expect(window.location.hash).toContain('#/compare/facts-before-reveal/trial-subscription/7')
      expect(window.location.hash).not.toContain('done=1')
    })
    await user.click(screen.getByRole('button', { name: 'К итогу' }))
    expect(screen.getByRole('heading', { name: sharedSecondEpisode.summary.title })).toBeInTheDocument()

    cleanup()
    window.location.hash = '#/compare/facts-before-reveal/trial-subscription/8?checkpoint-shared-boundary=cancel-method'
    render(<HashRouter><AppRoutes /></HashRouter>)
    await waitFor(() => expect(window.location.hash).toContain('#/compare/facts-before-reveal/trial-subscription/7'))
    expect(screen.getByRole('button', { name: 'Проверить' })).toBeInTheDocument()

    cleanup()
    window.location.hash = '#/compare/facts-before-reveal/move-in-evening/2'
    render(<HashRouter><AppRoutes /></HashRouter>)
    await waitFor(() => expect(window.location.hash).toBe('#/compare/facts-before-reveal/2'))
  })

  it('returns deterministically from the first and completed screens to the new catalog', async () => {
    const user = userEvent.setup()
    renderAt('/compare/source-scope/1')

    await user.click(screen.getByRole('button', { name: 'Все способы' }))
    expect(screen.getByRole('heading', { name: 'Девять способов, два эпизода' })).toBeInTheDocument()
  })
})
