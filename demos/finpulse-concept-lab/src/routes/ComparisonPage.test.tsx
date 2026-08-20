import { cleanup, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { HashRouter, MemoryRouter } from 'react-router'

import { AppRoutes } from '../App'
import { practiceActionLabel } from '../components/practiceMechanicLabels'
import {
  sameEpisodeMechanicEntries,
  sharedSameEpisode,
} from '../comparison/sameEpisodeCatalog'

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

describe('same-episode mechanic lab', () => {
  it('renders a nine-card catalog without pairwise comparison controls', () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
    const storageSpy = vi.spyOn(Storage.prototype, 'setItem')
    renderAt('/compare')

    expect(screen.getByRole('heading', { level: 1, name: 'Один эпизод, девять способов' })).toHaveFocus()
    expect(screen.getByText(/Текст, факты и финал не меняются/)).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /Открыть разбор/ })).toHaveLength(9)
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument()
    expect(screen.queryByText(/Поменять местами/)).not.toBeInTheDocument()

    for (const mechanic of sameEpisodeMechanicEntries) {
      expect(screen.getByRole('link', { name: `Открыть разбор «${mechanic.title}»` }))
        .toHaveAttribute('href', `/compare/${mechanic.slug}/1`)
    }
    expect(new Set(sameEpisodeMechanicEntries.map((mechanic) => mechanic.slug))).toHaveLength(9)
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

  it('keeps story material outside mechanic definitions', () => {
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
  })

  it.each(sameEpisodeMechanicEntries)(
    'runs the full $title route over the shared episode',
    async (mechanic) => {
      const user = userEvent.setup()
      renderAt(`/compare/${mechanic.slug}/1`)

      expect(screen.getByRole('heading', { level: 1, name: mechanic.title })).toHaveFocus()
      await user.click(screen.getByRole('button', { name: 'Начать разбор' }))

      expect(screen.getByText(sharedSameEpisode.opening.paragraphs[0])).toBeInTheDocument()
      await user.click(screen.getByRole('button', { name: 'Продолжить историю' }))

      expect(screen.getByText(sharedSameEpisode.beforeReveal.paragraphs[0])).toBeInTheDocument()
      expect(screen.getByText(sharedSameEpisode.beforeReveal.facts[2].body)).toBeInTheDocument()
      await user.click(screen.getByRole('button', { name: 'Увидеть ответ Тамары' }))

      expect(screen.getByText(sharedSameEpisode.reveal)).toBeInTheDocument()
      for (const prompt of mechanic.practice.prompts) {
        const group = screen.getByRole('group', { name: prompt.legend })
        for (const expectedId of prompt.expected) {
          const option = prompt.options.find((candidate) => candidate.id === expectedId)
          expect(option).toBeDefined()
          await user.click(within(group).getByRole(prompt.mode === 'multiple' ? 'checkbox' : 'radio', { name: option!.label }))
        }
      }
      await user.click(screen.getByRole('button', { name: practiceActionLabel(mechanic.practice.kind) }))

      expect(screen.getByRole('heading', { name: mechanic.feedback.successTitle })).toBeInTheDocument()
      await user.click(screen.getByRole('button', { name: 'Вернуться к эпизоду' }))

      expect(screen.getByRole('heading', { name: sharedSameEpisode.outcome.title })).toBeInTheDocument()
      expect(screen.getByText(sharedSameEpisode.outcome.paragraphs[1])).toBeInTheDocument()
      await user.click(screen.getByRole('button', { name: 'Проверить границу вывода' }))

      await user.click(screen.getByRole('radio', { name: 'Оплата комнаты затем состоялась' }))
      await user.click(screen.getByRole('button', { name: 'Проверить' }))
      expect(screen.getByText(sharedSameEpisode.checkpoint.feedback.success)).toBeInTheDocument()
      await user.click(screen.getByRole('button', { name: 'К итогу' }))

      expect(screen.getByRole('heading', { name: sharedSameEpisode.summary.title })).toBeInTheDocument()
      expect(screen.getByText(sharedSameEpisode.summary.takeaway)).toBeInTheDocument()
      await user.click(screen.getByRole('button', { name: 'Завершить' }))

      expect(screen.getByRole('heading', { name: 'Разбор завершён' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Выбрать другой способ' })).toBeInTheDocument()
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
    expect(screen.getByRole('heading', { name: 'Один эпизод, девять способов' })).toBeInTheDocument()

    cleanup()
    window.location.hash = '#/compare/facts-before-reveal'
    render(<HashRouter><AppRoutes /></HashRouter>)
    await waitFor(() => expect(window.location.hash).toBe('#/compare'))
    expect(screen.getByRole('heading', { name: 'Один эпизод, девять способов' })).toBeInTheDocument()
  })

  it('restores bounded answer state from a direct HashRouter URL', async () => {
    window.location.hash = '#/compare/one-fact-one-conclusion/4?practice-conclusion-boundary=bounded'
    render(<HashRouter><AppRoutes /></HashRouter>)

    expect(screen.getByRole('radio', {
      name: 'Перенос согласован, новая дата зафиксирована; остальные вопросы открыты',
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

  it('returns deterministically from the first and completed screens to the new catalog', async () => {
    const user = userEvent.setup()
    renderAt('/compare/source-scope/1')

    await user.click(screen.getByRole('button', { name: 'Все способы' }))
    expect(screen.getByRole('heading', { name: 'Один эпизод, девять способов' })).toBeInTheDocument()
  })
})
